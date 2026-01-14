// Lightweight Particle Physics Engine

let particles = [];
const DECAY = 0.02;

export const spawnParticles = (x, y, type = 'cash', count = 10) => {

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3, // Initial upward burst
            life: 1.0,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            color: getColor(type),
            size: Math.random() * 5 + 3,
            type
        });
    }
};

const getColor = (type) => {
    switch (type) {
        case 'cash': return '#10b981'; // Emerald 500
        case 'dirty': return '#ef4444'; // Red 500
        case 'xp': return '#3b82f6'; // Blue 500
        case 'gold': return '#fbbf24'; // Amber 400
        case 'diamond': return '#00d9ff'; // Cyan
        default: return '#ffffff';
    }
};

export const updateParticles = (ctx, width, height) => {
    if (particles.length === 0) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.life -= DECAY;
        p.rotation += p.rotationSpeed;

        // Render
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'cash' || p.type === 'dirty') {
            // Draw rectangle for bills
            ctx.fillRect(-p.size / 2, -p.size / 2 * 0.6, p.size, p.size * 0.6);
        } else if (p.type === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size, 0);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size, 0);
            ctx.closePath();
            ctx.fill();
        } else {
            // Circle for generic
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Kill
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
};
