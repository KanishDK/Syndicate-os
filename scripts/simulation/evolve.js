
import fs from 'fs';
import { fork } from 'child_process';
import { generateRandomDNA, mutateDNA, crossoverDNA } from './dna.js';

// Configuration
const GENERATIONS = 5;
const POPULATION_SIZE = 20;
const SIM_SCRIPT = './scripts/simulation/run_beta.js';
const BRAIN_PATH = './brain.json';
const REPORT_PATH = 'evolution_report.md';

const runGeneration = async (gen, population) => {
    console.log(`\n🧬 STARTING GENERATION ${gen}`);

    // We can't easily fork run_beta.js because it's a standalone script.
    // Instead, we will "Import" the runSimulation function if I refactor it,
    // OR we can pass DNA via Environment Variables to the child process.
    // Let's use Environment Variables for simplicity and isolation.

    const results = [];

    // Run Simulations in Parallel (or Batches)
    // For Node.js, running 20 forks might be heavy. Let's do batches of 5.
    const BATCH_SIZE = 5;
    for (let i = 0; i < population.length; i += BATCH_SIZE) {
        const batch = population.slice(i, i + BATCH_SIZE);
        const promises = batch.map((dna, idx) => {
            return new Promise((resolve) => {
                const child = fork(SIM_SCRIPT, [], {
                    env: { ...process.env, SIM_DNA: JSON.stringify(dna), SIM_SILENT: 'true' }
                });

                let output = '';
                child.on('message', (msg) => {
                    // Expecting message: { netWorth: 12345, prestige: 5, ... }
                    if (msg.type === 'RESULT') resolve({ ...msg.data, dna });
                });

                // Fallback for crash
                child.on('exit', (code) => {
                    if (code !== 0) resolve({ netWorth: 0, prestige: 0, dna, crashed: true });
                });
            });
        });

        const batchResults = await Promise.all(promises);
        results.push(...batchResults);
        console.log(`   - Batch ${i / BATCH_SIZE + 1} Complete`);
    }

    return results.sort((a, b) => {
        // Fitness Function V2: "The Completionist"
        // Reward diverse gameplay, not just hoarding.
        const scoreA = getFitness(a);
        const scoreB = getFitness(b);
        return scoreB - scoreA;
    });
};

const getFitness = (r) => {
    let score = r.netWorth;

    // Individual Progress Rewards (Moderate)
    if (r.districts) score += (Object.keys(r.districts).length * 5000000); // 5M per District
    if (r.upgrades) score += (Object.keys(r.upgrades).length * 1000000); // 1M per Upgrade
    if (r.defenses) score += (Object.keys(r.defenses).length * 500000); // 500k per Defense
    if (r.prestige) score += (r.prestige * 500000); // 500k per Prestige (NERFED from 2M)

    // COMPLETION BONUSES (Massive rewards for "beating the game")
    // These bonuses encourage the AI to explore all features, not just spam prestige

    // All Districts Bonus (3 total in CONFIG.districts)
    if (r.districts && Object.keys(r.districts).length >= 3) {
        score += 100000000; // +100M for owning all districts
    }

    // All Upgrades Bonus (6 total in CONFIG.upgrades)
    if (r.upgrades && Object.keys(r.upgrades).length >= 6) {
        score += 50000000; // +50M for owning all upgrades
    }

    // All Defenses Bonus (3 total in CONFIG.defense)
    if (r.defenses && Object.keys(r.defenses).length >= 3) {
        score += 25000000; // +25M for owning all defenses
    }

    return score;
};

const evolve = async () => {
    let population = [];

    // 1. Initialize Population
    if (fs.existsSync(BRAIN_PATH)) {
        const best = JSON.parse(fs.readFileSync(BRAIN_PATH));
        console.log(`🧠 Loaded Best Brain to seed population.`);
        population = Array(POPULATION_SIZE).fill(null).map(() => mutateDNA(best, 0.5)); // High mutation spread
    } else {
        population = Array(POPULATION_SIZE).fill(null).map(generateRandomDNA);
    }

    let reportMD = `# 🧬 Evolution Report\n\n`;

    for (let g = 1; g <= GENERATIONS; g++) {
        const results = await runGeneration(g, population);
        const best = results[0];

        console.log(`🏆 Gen ${g} Winner: NetWorth ${best.netWorth.toLocaleString()} kr (Prestige: ${best.prestige})`);
        console.log(`   Genes: Risk ${best.dna.riskTolerance.toFixed(2)}, Aggro ${best.dna.aggression.toFixed(2)}`);

        reportMD += `## Generation ${g}\n`;
        reportMD += `- **Winner Net Worth**: ${best.netWorth.toLocaleString()} kr\n`;
        reportMD += `- **Winner Genes**: Risk=${best.dna.riskTolerance.toFixed(2)}, Aggro=${best.dna.aggression.toFixed(2)}\n\n`;

        // Save Best
        fs.writeFileSync(BRAIN_PATH, JSON.stringify(best.dna, null, 2));

        // Evolve Next Population
        const elite = results.slice(0, 4); // Top 4 (20%)
        const nextPop = [...elite.map(r => r.dna)]; // Elitism (Keep winners)

        while (nextPop.length < POPULATION_SIZE) {
            if (Math.random() > 0.3) {
                // Mutate a winner
                const parent = elite[Math.floor(Math.random() * elite.length)].dna;
                nextPop.push(mutateDNA(parent, 0.1)); // Fine tuning
            } else {
                // Crossover
                const p1 = elite[Math.floor(Math.random() * elite.length)].dna;
                const p2 = elite[Math.floor(Math.random() * elite.length)].dna;
                nextPop.push(crossoverDNA(p1, p2));
            }
        }
        population = nextPop;
    }

    fs.writeFileSync(REPORT_PATH, reportMD);
    console.log(`\n✅ Evolution Complete. Report: ${REPORT_PATH}`);
};

evolve();
