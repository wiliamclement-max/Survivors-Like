// js/updates.js
// Update logic for various game elements

function updateBullets() {
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];

        // All bullets have a lifespan
        if (bullet.life !== undefined) {
            bullet.life--;
            if (bullet.life <= 0) {
                game.bullets.splice(i, 1);
                continue;
            }
        }

        // New tracking logic
        if (bullet.tracking) {
            let targetEnemy = null;
            if (bullet.targetEnemyId) {
                targetEnemy = game.enemies.find(e => e.id === bullet.targetEnemyId);
            }
            
            // If no target or target too far, find new target
            if (!targetEnemy || Math.hypot(bullet.x - targetEnemy.x, bullet.y - targetEnemy.y) > 300) {
                targetEnemy = findNearestEnemy(bullet);
                if (targetEnemy) {
                    bullet.targetEnemyId = targetEnemy.id;
                } else {
                    bullet.targetEnemyId = null;
                }
            }

            if (targetEnemy) {
                const angleToTarget = Math.atan2(targetEnemy.y - bullet.y, targetEnemy.x - bullet.x);
                let currentAngle = Math.atan2(bullet.dy, bullet.dx);
                const angleDiff = angleToTarget - currentAngle;

                // Calculate shortest turn angle
                let turnAngle = angleDiff;
                if (turnAngle > Math.PI) turnAngle -= 2 * Math.PI;
                if (turnAngle < -Math.PI) turnAngle += 2 * Math.PI;
                
                // Limit turn rate
                const maxTurnRate = 0.15; // Maximum turn speed
                turnAngle = Math.sign(turnAngle) * Math.min(Math.abs(turnAngle), maxTurnRate);

                currentAngle += turnAngle;
                bullet.dx = Math.cos(currentAngle) * bullet.speed;
                bullet.dy = Math.sin(currentAngle) * bullet.speed;
            }
        }

        // Bullet movement
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Remove bullets that go off screen
        if (bullet.x < -50 || bullet.x > game.width + 50 || bullet.y < -50 || bullet.y > game.height + 50) {
            game.bullets.splice(i, 1);
        }
    }
}

function updateMeleeAttacks() {
    for (let i = game.meleeAttacks.length - 1; i >= 0; i--) {
        const attack = game.meleeAttacks[i];
        attack.life--;
        
        // Add debug output, especially for warrior-specific skills
        if ((attack.type === 'berserker_whirlwind' || attack.type === 'power_whirlwind' || attack.type === 'paralyze_strike') && 
            (attack.life % 10 === 0 || attack.life <= 3)) {
            console.log(`${attack.type} lifecycle: remaining=${attack.life} frames, max=${attack.maxLife} frames`);
        }
        
        if (attack.life <= 0) {
            console.log(`Remove melee attack: ${attack.type}, existed for ${attack.maxLife} frames`);
            game.meleeAttacks.splice(i, 1);
            continue;
        }

        // Melee attacks usually bind to player position
        if (attack.type === 'whirlwind' || attack.type === 'moonslash' || 
            attack.type === 'berserker_whirlwind' || attack.type === 'power_whirlwind' || attack.type === 'paralyze_strike') {
            attack.x = game.player.x;
            attack.y = game.player.y;
            if (attack.type === 'moonslash') {
                 attack.angle += 0.1;
            }
        } else if (attack.type === 'thrust') {
            const thrustSpeed = 10;
            attack.x += Math.cos(attack.angle) * thrustSpeed;
            attack.y += Math.sin(attack.angle) * thrustSpeed;
        }
    }
}

// Area effect updates
function updateAreaEffects() {
    for (let i = game.areaEffects.length - 1; i >= 0; i--) {
        const areaEffect = game.areaEffects[i];
        areaEffect.life--;
        
        // When lifespan ends, remove effect
        if (areaEffect.life <= 0) {
            game.areaEffects.splice(i, 1);
            continue;
        }

        switch (areaEffect.type) {
            case 'lightning_strike':
                // Lightning strike only shows visual effects, damage already dealt on creation
                // Generate lightning particle effects
                if (areaEffect.life > 10) { // Only generate particles in first few frames
                    spawnParticle(areaEffect.x, areaEffect.y, areaEffect.color, 5, 2, 15);
                }
                // Add debug output
                if (areaEffect.life % 5 === 0 || areaEffect.life <= 3) {
                    console.log(`Lightning strike lifecycle: remaining=${areaEffect.life} frames, position(${areaEffect.x.toFixed(1)}, ${areaEffect.y.toFixed(1)})`);
                }
                break;
                
            case 'blizzard':
                // Blizzard continuous damage
                areaEffect.currentTick++;
                if (areaEffect.currentTick >= areaEffect.tickInterval) {
                    areaEffect.currentTick = 0;
                    
                    // Generate blizzard particle effects
                    for (let j = 0; j < 3; j++) {
                        const particleX = areaEffect.x + (Math.random() - 0.5) * areaEffect.radius * 2;
                        const particleY = areaEffect.y + (Math.random() - 0.5) * areaEffect.radius * 2;
                        spawnParticle(particleX, particleY, areaEffect.color, 2, 1, 20);
                    }
                    
                    let enemiesHit = 0;
                    
                    // Deal damage to enemies in range
                    game.enemies.forEach(enemy => {
                        const dist = getDistance(areaEffect, enemy);
                        if (dist < areaEffect.radius + enemy.radius) {
                            enemiesHit++;
                            const damage = areaEffect.damagePerTick;
                            enemy.hp -= damage;
                            
                            console.log(`Blizzard damage: enemy position(${enemy.x.toFixed(1)}, ${enemy.y.toFixed(1)}), distance=${dist.toFixed(1)}, radius=${areaEffect.radius}, damage=${damage}, remaining HP=${enemy.hp}`);
                            
                            if (enemy.hp <= 0) {
                                handleEnemyDefeat(enemy);
                                const enemyIndex = game.enemies.indexOf(enemy);
                                if (enemyIndex !== -1) {
                                    game.enemies.splice(enemyIndex, 1);
                                }
                            } else {
                                spawnParticle(enemy.x, enemy.y, areaEffect.color, 3, 1, 15);
                            }
                        }
                    });
                    
                    if (enemiesHit > 0) {
                        console.log(`Blizzard tick: hit ${enemiesHit} enemies, life remaining=${areaEffect.life}, damage/tick=${areaEffect.damagePerTick}`);
                    }
                }
                break;
                
            case 'poison_gas':
                // Poison gas continuous damage
                areaEffect.currentTick++;
                if (areaEffect.currentTick >= areaEffect.tickInterval) {
                    areaEffect.currentTick = 0;
                    game.enemies.forEach(enemy => {
                        if (getDistance(areaEffect, enemy) < areaEffect.radius + enemy.radius) {
                            enemy.hp -= areaEffect.damagePerTick;
                            if (enemy.hp <= 0) {
                                handleEnemyDefeat(enemy);
                                const enemyIndex = game.enemies.indexOf(enemy);
                                if (enemyIndex !== -1) {
                                    game.enemies.splice(enemyIndex, 1);
                                }
                            } else {
                                spawnParticle(enemy.x, enemy.y, areaEffect.color, 5, 1, 20);
                            }
                        }
                    });
                }
                break;
                
            case 'earthquake':
                // Earthquake wave spreading effect
                if (!areaEffect.currentRadius) {
                    areaEffect.currentRadius = areaEffect.radius * 0.2;
                    areaEffect.maxRadius = areaEffect.radius;
                    areaEffect.hasDealtDamage = false;
                }
                
                areaEffect.currentRadius += (areaEffect.maxRadius - areaEffect.radius * 0.2) / 30;
                
                // Earthquake wave deals damage only once
                if (!areaEffect.hasDealtDamage && areaEffect.life < 45) { // Judge in middle of spreading
                    game.enemies.forEach(enemy => {
                        // Ensure enemy is between initial radius and current radius (wave crest)
                        const enemyDistance = getDistance(areaEffect, enemy);
                        if (enemyDistance < areaEffect.currentRadius + enemy.radius &&
                            enemyDistance > areaEffect.currentRadius - enemy.radius - 20) { // 20 is wave width
                            enemy.hp -= areaEffect.damage;
                            if (enemy.hp <= 0) {
                                handleEnemyDefeat(enemy);
                                const enemyIndex = game.enemies.indexOf(enemy);
                                if (enemyIndex !== -1) {
                                    game.enemies.splice(enemyIndex, 1);
                                }
                            } else {
                                spawnParticle(enemy.x, enemy.y, areaEffect.color, 8, 2, 20);
                            }
                        }
                    });
                    areaEffect.hasDealtDamage = true;
                }
                break;
                
            case 'black_hole':
                // Black hole attraction and damage
                areaEffect.currentTick++;
                if (areaEffect.currentTick >= areaEffect.tickInterval) {
                    areaEffect.currentTick = 0;
                    game.enemies.forEach(enemy => {
                        const dist = getDistance(areaEffect, enemy);
                        if (dist < areaEffect.radius + enemy.radius) {
                            // Attract enemies
                            const attractionForce = areaEffect.pullForce || 2;
                            const angleToBlackHole = Math.atan2(areaEffect.y - enemy.y, areaEffect.x - enemy.x);
                            enemy.x += Math.cos(angleToBlackHole) * attractionForce;
                            enemy.y += Math.sin(angleToBlackHole) * attractionForce;
                            
                            // Deal continuous small damage during attraction
                            enemy.hp -= areaEffect.damagePerTick;
                            if (enemy.hp <= 0) {
                                handleEnemyDefeat(enemy);
                                const enemyIndex = game.enemies.indexOf(enemy);
                                if (enemyIndex !== -1) {
                                    game.enemies.splice(enemyIndex, 1);
                                }
                            } else {
                                spawnParticle(enemy.x, enemy.y, areaEffect.color, 2, 1, 5);
                            }
                        }
                    });
                }
                break;
        }
    }
}

// Summon updates
function updateSummons() {
    for (let i = game.summons.length - 1; i >= 0; i--) {
        const summon = game.summons[i];
        if (summon.life > 0) { // -1 means permanent, don't decrease life
            summon.life--;
        }
        if (summon.life === 0) {
            game.summons.splice(i, 1);
            continue;
        }

        switch (summon.weaponType) {
            case 'sprite':
                // Sprite orbits around player
                summon.angle += 0.05;
                summon.x = game.player.x + Math.cos(summon.angle) * summon.orbitRadius;
                summon.y = game.player.y + Math.sin(summon.angle) * summon.orbitRadius;

                // Attack nearby enemies
                summon.currentCooldown--;
                if (summon.currentCooldown <= 0) {
                    const targetEnemy = findNearestEnemy(summon.x, summon.y);
                    if (targetEnemy && getDistance(summon, targetEnemy) < 150) {
                        targetEnemy.hp -= summon.damage;
                        summon.currentCooldown = summon.attackSpeed;
                        if (targetEnemy.hp <= 0) {
                            handleEnemyDefeat(targetEnemy);
                            game.enemies.splice(game.enemies.indexOf(targetEnemy), 1);
                        } else {
                            spawnParticle(targetEnemy.x, targetEnemy.y, summon.color, 5, 1, 10);
                        }
                    }
                }
                break;
            case 'guardian_shield':
                // Guardian shield orbits around player and deals damage
                summon.angle += summon.rotationSpeed;
                summon.x = game.player.x + Math.cos(summon.angle) * summon.orbitRadius;
                summon.y = game.player.y + Math.sin(summon.angle) * summon.orbitRadius;

                game.enemies.forEach(enemy => {
                    if (getDistance(summon, enemy) < summon.radius + enemy.radius && !summon.hitEnemies.has(enemy.id)) {
                        enemy.hp -= summon.damage;
                        if (enemy.hp <= 0) {
                            handleEnemyDefeat(enemy);
                            game.enemies.splice(game.enemies.indexOf(enemy), 1);
                        } else {
                            spawnParticle(enemy.x, enemy.y, summon.color, 5, 1, 10);
                        }
                        summon.hitEnemies.add(enemy.id);
                    } else if (getDistance(summon, enemy) >= summon.radius + enemy.radius) {
                        summon.hitEnemies.delete(enemy.id);
                    }
                });
                break;
            case 'tracking_bee':
                let targetEnemyBee = null;
                if (summon.targetEnemyId) {
                    targetEnemyBee = game.enemies.find(e => e.id === summon.targetEnemyId);
                }
                if (!targetEnemyBee || getDistance(summon, targetEnemyBee) > 300) {
                    targetEnemyBee = findNearestEnemy(summon.x, summon.y);
                    if (targetEnemyBee) {
                        summon.targetEnemyId = targetEnemyBee.id;
                    } else {
                        summon.targetEnemyId = null;
                    }
                }

                if (targetEnemyBee) {
                    const angleToTarget = Math.atan2(targetEnemyBee.y - summon.y, targetEnemyBee.x - summon.x);
                    summon.x += Math.cos(angleToTarget) * summon.speed;
                    summon.y += Math.sin(angleToTarget) * summon.speed;

                    // Collision detection
                    if (getDistance(summon, targetEnemyBee) < summon.radius + targetEnemyBee.radius) {
                        targetEnemyBee.hp -= summon.damage;
                        summon.life = 0; // Disappear after hitting enemy
                        if (targetEnemyBee.hp <= 0) {
                            handleEnemyDefeat(targetEnemyBee);
                            game.enemies.splice(game.enemies.indexOf(targetEnemyBee), 1);
                        } else {
                            spawnParticle(targetEnemyBee.x, targetEnemyBee.y, summon.color, 5, 1, 10);
                        }
                    }
                } else {
                    // When no target, wander randomly
                    summon.x += (Math.random() - 0.5) * summon.speed * 0.5;
                    summon.y += (Math.random() - 0.5) * summon.speed * 0.5;
                }
                break;
            case 'ghost_warrior':
                // Ghost warrior mimics player position and attacks
                summon.x = game.player.x + (Math.random() - 0.5) * 20;
                summon.y = game.player.y + (Math.random() - 0.5) * 20;

                const mimicWeaponDef = WEAPON_DEFINITIONS[summon.mimicWeaponType];
                if (mimicWeaponDef && (game.gameTime - summon.lastAttackTime > (mimicWeaponDef.baseEffect.cooldown || 60))) { // Assume default 60 frame cooldown
                    summon.lastAttackTime = game.gameTime;
                    const mimicEffect = getWeaponEffect(summon.mimicWeaponType, summon.mimicWeaponLevel); // Ghost warrior uses its recorded weapon level
                    const targetEnemy = findNearestEnemy(summon.x, summon.y);

                    if (targetEnemy) {
                        if (mimicWeaponDef.type === 'ranged') {
                            const angle = Math.atan2(targetEnemy.y - summon.y, targetEnemy.x - summon.x);
                            game.bullets.push({
                                x: summon.x,
                                y: summon.y,
                                radius: (mimicEffect.bulletRadius || 5) * 0.5, // Ghost warrior bullets are smaller
                                color: summon.color,
                                speed: (mimicEffect.speed || 5) * 0.8,
                                dx: Math.cos(angle) * (mimicEffect.speed || 5) * 0.8,
                                dy: Math.sin(angle) * (mimicEffect.speed || 5) * 0.8,
                                damage: (mimicEffect.damage || 1) * summon.damageRatio,
                                type: 'normal',
                                life: 180 // Ghost warrior bullet lifespan
                            });
                        } else if (mimicWeaponDef.type === 'melee') {
                            if (getDistance(summon, targetEnemy) < (mimicEffect.radius || CONFIG.PLAYER_RADIUS) + targetEnemy.radius) {
                                targetEnemy.hp -= (mimicEffect.damage || 1) * summon.damageRatio;
                                if (targetEnemy.hp <= 0) {
                                    handleEnemyDefeat(targetEnemy);
                                    game.enemies.splice(game.enemies.indexOf(targetEnemy), 1);
                                } else {
                                    spawnParticle(targetEnemy.x, targetEnemy.y, summon.color, 5, 1, 10);
                                }
                            }
                        } else if (mimicWeaponDef.type === 'area') {
                             // Ghost warrior also casts area attacks (simplified handling, cast directly at enemy position)
                             game.areaEffects.push({
                                id: Date.now() + Math.random(),
                                x: targetEnemy.x,
                                y: targetEnemy.y,
                                radius: (mimicEffect.radius || 50) * 0.5, // Ghost warrior area effects are smaller
                                damagePerTick: (mimicEffect.damagePerTick || 0.5) * summon.damageRatio,
                                tickInterval: mimicEffect.tickInterval || 30,
                                currentTick: 0,
                                duration: (mimicEffect.duration || 120) * 0.5,
                                life: (mimicEffect.duration || 120) * 0.5,
                                color: summon.color,
                                type: mimicWeaponDef.baseEffect.type, // Mimic type
                                hitEnemies: new Set()
                            });
                        }
                    }
                }
                break;
        }
    }
}


function spawnParticle(x, y, color, count, size, life) {
    for (let i = 0; i < count; i++) {
        game.particles.push({
            x: x,
            y: y,
            size: Math.random() * size + 1,
            color: color,
            life: life,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2
        });
    }
}

function updateParticles() {
    for (let i = game.particles.length - 1; i >= 0; i--) {
        const particle = game.particles[i];
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life--;
        if (particle.life <= 0) {
            game.particles.splice(i, 1);
        }
    }
}

function spawnExplosion(x, y, color, radius = 20) {
    game.explosions.push({ x: x, y: y, radius: radius, color: color, life: 30 });
    spawnParticle(x, y, color, 20, 5, 30); // Generate particles on explosion
}

function updateExplosions() {
    for (let i = game.explosions.length - 1; i >= 0; i--) {
        const explosion = game.explosions[i];
        explosion.life--;
        if (explosion.life <= 0) {
            game.explosions.splice(i, 1);
        }
    }
}