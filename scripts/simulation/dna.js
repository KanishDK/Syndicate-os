
/**
 * DNA Schema for Persona Automation
 * Defines the genes that control decision making logic.
 */

export const DNA_SCHEMA = {
    // Financial Risks
    riskTolerance: { min: 1.0, max: 3.0, default: 1.5 }, // Multiplier for cash buffer (Higher = More Safe)
    auditChance: { min: 0.0, max: 1.0, default: 0.1 },   // Chance to check finances explicitly

    // Aggression & Growth
    aggression: { min: 0.0, max: 1.0, default: 0.5 },    // Chance to skip safety checks for upgrades
    expansionBias: { min: 0.0, max: 1.0, default: 0.5 }, // Preference for buying Staff vs Saving

    // Endgame Logic
    prestigeThreshold: { min: 10, max: 60, default: 30 }, // Level to prestige at
    cryptoAlloc: { min: 0.0, max: 0.5, default: 0.1 },    // % of Cash to keep in Crypto
    sellThreshold: { min: 1.1, max: 2.0, default: 1.2 },  // Crypto Profit multiplier to sell at

    // Gamer Personality (New)
    curiosity: { min: 0.0, max: 1.0, default: 0.3 },     // Chance to try random unlocked features (Stats, Manual)
    defenseBias: { min: 0.0, max: 1.0, default: 0.2 },   // Priority for buying defenses/lowering heat
    districtBias: { min: 0.0, max: 1.0, default: 0.2 },  // Priority for saving up for Districts
    upgradeBias: { min: 0.0, max: 1.0, default: 0.4 },   // Priority for building upgrades over new staff
};

/**
 * Generates a random DNA strand based on schema
 */
export const generateRandomDNA = () => {
    const dna = {};
    for (const [key, schema] of Object.entries(DNA_SCHEMA)) {
        if (Number.isInteger(schema.min) && Number.isInteger(schema.max) && schema.max > 5) {
            // Integer gene (like Level)
            dna[key] = Math.floor(Math.random() * (schema.max - schema.min + 1)) + schema.min;
        } else {
            // Float gene
            dna[key] = Math.random() * (schema.max - schema.min) + schema.min;
        }
    }
    return dna;
};

/**
 * Mutates a DNA strand
 * @param {Object} dna - Parent DNA
 * @param {number} rate - Mutation strength (0.0 - 1.0)
 */
export const mutateDNA = (dna, rate = 0.2) => {
    const newDNA = { ...dna };

    for (const [key, schema] of Object.entries(DNA_SCHEMA)) {
        if (Math.random() < 0.3) { // 30% chance to mutate this specific gene
            const mutation = (Math.random() - 0.5) * 2 * rate * (schema.max - schema.min);
            let val = newDNA[key] + mutation;

            // Clamp
            val = Math.max(schema.min, Math.min(schema.max, val));

            if (Number.isInteger(schema.min) && Number.isInteger(schema.max) && schema.max > 5) {
                newDNA[key] = Math.round(val);
            } else {
                newDNA[key] = val;
            }
        }
    }

    return newDNA;
};

/**
 * Crosses over two DNA strands
 */
export const crossoverDNA = (dnaA, dnaB) => {
    const newDNA = {};
    for (const key of Object.keys(DNA_SCHEMA)) {
        newDNA[key] = Math.random() > 0.5 ? dnaA[key] : dnaB[key];
    }
    return newDNA;
};
