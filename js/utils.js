// js/utils.js
// 通用工具函数

/**
 * 计算两个对象之间的距离。
 * @param {object} obj1 - 包含 x 和 y 属性的第一个对象。
 * @param {object} obj2 - 包含 x 和 y 属性的第二个对象。
 * @returns {number} 两个对象之间的距离。
 */
function getDistance(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 检查两个对象是否碰撞 (基于圆形碰撞检测)。
 * @param {object} obj1 - 包含 x, y, radius 属性的第一个对象。
 * @param {object} obj2 - 包含 x, y, radius 属性的第二个对象。
 * @returns {boolean} 如果两个对象发生碰撞，则返回 true；否则返回 false。
 */
function checkCollision(obj1, obj2) {
    const distance = getDistance(obj1, obj2);
    return distance < (obj1.radius + obj2.radius);
}

/**
 * 创建一个单独的粒子。
 * @param {number} x - 粒子的初始 X 坐标。
 * @param {number} y - 粒子的初始 Y 坐标。
 * @param {string} color - 粒子的颜色。
 * @param {number} size - 粒子的初始大小。
 * @param {number} life - 粒子的生命周期 (帧数)。
 */
function createParticle(x, y, color, size, life) {
    game.particles.push({
        x: x,
        y: y,
        dx: (Math.random() - 0.5) * 2, // 随机X方向速度
        dy: (Math.random() - 0.5) * 2, // 随机Y方向速度
        color: color,
        size: size,
        life: life,
        maxLife: life
    });
}

/**
 * 在指定位置创建粒子爆炸效果。
 * @param {number} x - 爆炸的 X 坐标。
 * @param {number} y - 爆炸的 Y 坐标。
 * @param {string} color - 粒子的颜色。
 * @param {number} count - 粒子数量。
 * @param {number} [size=3] - 粒子的初始大小。
 * @param {number} [life=30] - 粒子的生命周期 (帧数)。
 */
function createParticleExplosion(x, y, color, count, size = 3, life = 30) {
    for (let i = 0; i < count; i++) {
        createParticle(x, y, color, size, life);
    }
}

/**
 * 创建一个爆炸效果。
 * @param {number} x - 爆炸的 X 坐标。
 * @param {number} y - 爆炸的 Y 坐标。
 * @param {string} color - 爆炸的颜色。
 * @param {number} radius - 爆炸的最大半径。
 * @param {number} [life=20] - 爆炸的持续时间 (帧数)。
 */
function createExplosion(x, y, color, radius, life = 20) {
    game.explosions.push({
        x: x,
        y: y,
        color: color,
        radius: radius,
        life: life,
        maxLife: life
    });
}

/**
 * 处理敌人被击败的统一逻辑
 * @param {Object} enemy - 被击败的敌人对象
 */
function handleEnemyDefeat(enemy) {
    if (game.waveState) {
        game.waveState.enemiesRemaining--;
    }
    // 生成经验块
    if (typeof spawnItem === 'function') {
        spawnItem(enemy.x, enemy.y, 'exp', enemy.exp || 10);
    }
    game.score += 1; // 每击败一个敌人，杀敌计数加1
    createExplosion(enemy.x, enemy.y, 'orange', enemy.radius * 1.5);
    
    // 3% 几率掉落血包
    if (Math.random() < 0.03 && typeof spawnItem === 'function') {
        spawnItem(enemy.x, enemy.y, 'hp');
    }
    console.log(`敌人被击败, 杀敌计数: ${game.score}`);
}

/**
 * 生成一个随机的十六进制颜色字符串。
 * @returns {string} 随机的十六进制颜色字符串 (例如 '#RRGGBB')。
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}