// js/effects.js
// 存放视觉效果相关的函数，如粒子和爆炸

/**
 * 在指定位置创建粒子爆炸效果。
 * @param {number} x - 爆炸中心的x坐标。
 * @param {number} y - 爆炸中心的y坐标。
 * @param {string} color - 粒子颜色。
 * @param {number} count - 粒子数量。
 * @param {number} speed - 粒子初始速度。
 * @param {number} lifespan - 粒子生命周期（帧）。
 */
function createParticleExplosion(x, y, color, count = 10, speed = 3, lifespan = 30) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const particle = {
            x: x,
            y: y,
            dx: Math.cos(angle) * Math.random() * speed,
            dy: Math.sin(angle) * Math.random() * speed,
            life: Math.random() * lifespan + 20,
            maxLife: lifespan,
            color: color,
            size: Math.random() * CONFIG.PARTICLE_SIZE + 1
        };
        game.particles.push(particle);
    }
}

/**
 * 在指定位置创建一个逐渐扩大的爆炸效果。
 * @param {number} x
 * @param {number} y
 * @param {string} color
 * @param {number} radius
 */
function createExplosion(x, y, color, radius) {
    game.explosions.push({
        x: x,
        y: y,
        radius: radius,
        color: color,
        life: CONFIG.EXPLOSION_LIFESPAN,
        maxLife: CONFIG.EXPLOSION_LIFESPAN
    });
}