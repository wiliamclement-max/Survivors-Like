// js/attacks.js
// Weapon logic

/**
 * Find the nearest enemy to the player.
 * @param {object} player - Player object.
 * @returns {object|null} Nearest enemy object, or null if no enemies exist.
 */
function findNearestEnemy(player) {
    let nearestEnemy = null;
    let minDistance = Infinity;

    // The getDistance function is assumed to be defined in utils.js as: Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y)
    for (const enemy of game.enemies) {
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distance < minDistance) {
            minDistance = distance;
            nearestEnemy = enemy;
        }
    }
    return nearestEnemy;
}


/**
 * Activate ranged weapon (e.g., bullets).
 * @param {string} weaponType - Weapon type string (e.g., 'basic_shot').
 * @param {number} level - Current weapon level.
 */
function activateRangedWeapon(weaponType, level) {
    const def = WEAPON_DEFINITIONS[weaponType];
    if (!def || def.type !== 'ranged') {
        console.error(`Attempting to activate non-ranged weapon or unknown weapon as ranged: ${weaponType}`);
        return;
    }

    const currentLevel = Math.min(level - 1, def.damage.length - 1);
    if (currentLevel < 0) { // Ensure index is not negative
        console.error(`Ranged weapon ${weaponType} level calculation error or damage array too small.`);
        return;
    }

    const damage = def.damage[currentLevel] || 1; // Ensure default damage
    const bulletSpeed = def.bulletSpeed || 10;
    const bulletRadius = def.bulletRadius || 5;
    const bulletColor = def.bulletColor || '#FFFF00';
    const numBullets = def.numBullets[currentLevel] || 1;
    const pierce = def.pierce[currentLevel] || 0;
    const knockback = def.knockback || 0;
    const spreadAngle = def.spreadAngle || 0;
    const homing = def.homing || false;
    const tracking = def.tracking || false;
    const homingStrength = def.homingStrength || 0.05;
    const doubleDamage = def.doubleDamage || false;
    const explosive = def.explosive || false;
    const explosionRadius = def.explosionRadius ? def.explosionRadius[currentLevel] : 0;

    // --- Auto-aim logic ---
    let baseAngle = game.player.lastMoveAngle; // Default direction: player movement direction
    const nearestEnemy = findNearestEnemy(game.player);

    if (nearestEnemy && !homing && !tracking) { // If not a tracking weapon, auto-aim at nearest enemy
        baseAngle = Math.atan2(nearestEnemy.y - game.player.y, nearestEnemy.x - game.player.x);
    }

    // Special firing pattern handling
    if (def.pattern === 'cross') {
        // Crossbow: fire in four directions
        const directions = [0, Math.PI/2, Math.PI, 3*Math.PI/2]; // Right, down, left, up
        directions.forEach(angle => {
            const bullet = createBullet(angle, damage, bulletSpeed, bulletRadius, bulletColor, pierce, knockback, tracking, doubleDamage, explosive, explosionRadius);
            game.bullets.push(bullet);
        });
        return;
    }
    // --- End auto-aim logic ---

    // Fire based on bullet count and spread angle
    for (let i = 0; i < numBullets; i++) {
        let angleOffset = 0;
        if (numBullets > 1) {
            angleOffset = (i - (numBullets - 1) / 2) * (spreadAngle / numBullets) * (Math.PI / 180);
        }

        const angle = baseAngle + angleOffset; // Use calculated base angle
        const bullet = createBullet(angle, damage, bulletSpeed, bulletRadius, bulletColor, pierce, knockback, tracking, doubleDamage, explosive, explosionRadius);
        game.bullets.push(bullet);
    }
}

/**
 * Create bullet object
 */
function createBullet(angle, damage, bulletSpeed, bulletRadius, bulletColor, pierce, knockback, tracking, doubleDamage, explosive, explosionRadius) {
    return {
        x: game.player.x,
        y: game.player.y,
        radius: bulletRadius,
        color: bulletColor,
        damage: damage,
        speed: bulletSpeed,
        dx: Math.cos(angle) * bulletSpeed,
        dy: Math.sin(angle) * bulletSpeed,
        life: 60, // Bullet lifespan (frames)
        pierce: pierce, // Number of enemies to pierce
        knockback: knockback, // Knockback force
        tracking: tracking, // Tracking ability
        doubleDamage: doubleDamage, // Double damage
        explosive: explosive, // Explosion effect
        explosionRadius: explosionRadius, // Explosion radius
        hitEnemies: new Set() // Track hit enemies to prevent duplicate pierce damage
    };
}

/**
 * Activate melee weapon (e.g., whirlwind, thrust).
 * @param {string} weaponType - Weapon type string.
 * @param {number} level - Current weapon level.
 */
function activateMeleeWeapon(weaponType, level) {
    console.log(`--- Attempting to activate melee weapon: ${weaponType}, level: ${level} ---`);
    const def = WEAPON_DEFINITIONS[weaponType];
    console.log('Weapon definition (def):', def);

    if (!def) {
        console.error(`Error: Melee weapon type "${weaponType}" definition not found.`);
        return;
    }
    if (def.type !== 'melee') {
        console.error(`Error: Attempting to activate non-melee weapon "${weaponType}" as melee weapon (type: ${def.type}).`);
        return;
    }
    if (!Array.isArray(def.damage) || def.damage.length === 0) {
        console.error(`Error: Melee weapon "${weaponType}" damage property missing or empty array.`, def.damage);
        return;
    }
    if (!Array.isArray(def.cooldown) || def.cooldown.length === 0) {
        console.error(`Error: Melee weapon "${weaponType}" cooldown property missing or empty array.`, def.cooldown);
        return;
    }

    const currentLevel = Math.min(level - 1, def.damage.length - 1);
    if (currentLevel < 0) {
        console.error(`Error: Melee weapon "${weaponType}" level ${level} or damage array length ${def.damage.length} resulted in negative index ${currentLevel}.`);
        return;
    }

    // Properly handle duration - support arrays and fixed values
    const duration = (def.duration && Array.isArray(def.duration)) ? def.duration[currentLevel] : (def.duration || 10);
    
    console.log(`Melee weapon creation: type=${weaponType}, level=${level}, duration=${duration}`);

    const meleeAttack = {
        id: Date.now() + Math.random(), // Unique ID for collision detection
        x: game.player.x,
        y: game.player.y,
        type: weaponType,
        damage: def.damage[currentLevel],
        radius: (def.radius && Array.isArray(def.radius) && def.radius.length > currentLevel) ? def.radius[currentLevel] : CONFIG.PLAYER_RADIUS + 20,
        knockback: def.knockback || 0,
        color: def.color || 'white',
        life: duration, // Use life for unified naming, consistent with update logic
        maxLife: duration, // Maximum lifespan for rendering transparency calculation
        arc: def.arc || 0,
        length: def.length || 0,
        width: def.width || 0,
        angle: game.player.lastMoveAngle || 0
    };
    game.meleeAttacks.push(meleeAttack);
    console.log(`Melee attack created successfully: life=${meleeAttack.life}, maxLife=${meleeAttack.maxLife}`);
    console.log('--- Successfully activated melee weapon ---');
}

/**
 * Activate area effect (e.g., blizzard, poison gas, lightning strike).
 * @param {string} weaponType - Weapon type string.
 * @param {number} level - Current weapon level.
 */
function activateAreaEffect(weaponType, level) {
    const def = WEAPON_DEFINITIONS[weaponType];
    if (!def || def.type !== 'area_effect') {
        console.error(`Attempting to activate non-area effect weapon or unknown weapon as area effect: ${weaponType}`);
        return;
    }

    const currentLevel = Math.min(level - 1, def.damage.length - 1);
    if (currentLevel < 0) {
        console.error(`Area effect weapon ${weaponType} level calculation error or damage array too small.`);
        return;
    }

    // Lightning strike special handling: instant attack on multiple enemies
    if (weaponType === 'lightning_strike') {
        const targets = def.targets ? def.targets[currentLevel] : 3;
        const damage = def.damage[currentLevel] || 0;
        const radius = def.radius[currentLevel] || 20;
        // Properly get duration - support arrays and fixed values
        const duration = (def.duration && Array.isArray(def.duration)) ? def.duration[currentLevel] : (def.duration || 15);
        
        console.log(`Lightning strike activation: targets=${targets}, damage=${damage}, radius=${radius}, duration=${duration}`);
        
        // Find nearest enemies
        const nearbyEnemies = game.enemies
            .map(enemy => ({
                enemy,
                distance: Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, targets);
        
        // Create lightning effect for each target enemy
        nearbyEnemies.forEach(({enemy}) => {
            const lightningEffect = {
                x: enemy.x,
                y: enemy.y,
                type: weaponType,
                damage: damage,
                radius: radius,
                life: duration, // Use correctly calculated duration
                currentTick: 0,
                tickInterval: 1, // Instant damage
                color: def.color || '#FFFF00',
                instant: true // Mark as instant damage
            };
            game.areaEffects.push(lightningEffect);
            
            console.log(`Lightning effect created: position(${enemy.x.toFixed(1)}, ${enemy.y.toFixed(1)}), life=${duration}, damage=${damage}`);
            
            // Immediately deal damage to enemy
            enemy.hp -= damage;
            if (enemy.hp <= 0) {
                handleEnemyDefeat(enemy);
                const enemyIndex = game.enemies.indexOf(enemy);
                if (enemyIndex !== -1) {
                    game.enemies.splice(enemyIndex, 1);
                }
            } else {
                spawnParticle(enemy.x, enemy.y, lightningEffect.color, 10, 3, 20);
            }
        });
        return;
    }

    // Regular area effects (e.g., blizzard)
    const duration = (def.duration && Array.isArray(def.duration)) ? def.duration[currentLevel] : (def.duration || 180);
    const totalDamage = def.damage[currentLevel] || 0;
    const tickInterval = def.interval || 30;
    
    // Fix damage calculation - ensure reasonable damage per tick
    const totalTicks = Math.ceil(duration / tickInterval);
    const damagePerTick = Math.max(8, Math.round(totalDamage / totalTicks));
    
    console.log(`Blizzard creation: totalDamage=${totalDamage}, duration=${duration}, interval=${tickInterval}, totalTicks=${totalTicks}, damagePerTick=${damagePerTick}`);
    
    const areaEffect = {
        x: game.player.x,
        y: game.player.y,
        type: weaponType,
        damage: totalDamage,
        damagePerTick: damagePerTick,
        radius: def.radius[currentLevel] || 50,
        life: duration, // Use life for unified naming
        currentTick: 0,
        tickInterval: tickInterval,
        color: def.color || 'white',
        slowFactor: def.slowFactor ? (def.slowFactor[currentLevel] || 0) : 0,
        pullForce: def.pullForce ? (def.pullForce[currentLevel] || 0) : 0
    };
    game.areaEffects.push(areaEffect);
}

/**
 * Activate summon.
 * @param {string} weaponType - Weapon type string.
 * @param {number} level - Current weapon level.
 */
function activateSummon(weaponType, level) {
    const def = WEAPON_DEFINITIONS[weaponType];
    if (!def || def.type !== 'summon') {
        console.error(`Attempting to activate non-summon type or unknown weapon as summon: ${weaponType}`);
        return;
    }

    const currentLevel = Math.min(level - 1, def.damage.length - 1);
    if (currentLevel < 0) {
        console.error(`Summon ${weaponType} level calculation error or damage array too small.`);
        return;
    }

    const spawnOffsetX = (Math.random() - 0.5) * 20;
    const spawnOffsetY = (Math.random() - 0.5) * 20;

    const summon = {
        x: game.player.x + spawnOffsetX,
        y: game.player.y + spawnOffsetY,
        type: weaponType,
        damage: def.damage[currentLevel] || 0,
        radius: def.radius || 10,
        duration: def.duration || 600,
        maxLife: def.duration || 600,
        speed: def.speed || 3,
        attackInterval: def.attackInterval || 60,
        attackTimer: 0,
        range: def.range || 100,
        color: def.color || 'grey',
        numShields: def.numShields ? (def.numShields[currentLevel] || 1) : 1,
        explosionRadius: def.explosionRadius ? (def.explosionRadius[currentLevel] || 0) : 0,
        target: null
    };
    game.summons.push(summon);
}