// js/collisions.js
// 碰撞检测函数

// 假设 utils.js 中有:
// function getDistance(obj1, obj2) { return Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y); }
// function checkCollision(obj1, obj2) { return getDistance(obj1, obj2) < obj1.radius + obj2.radius; }

// handleEnemyDefeat 函数已移至 utils.js


function checkBulletCollisions() {
    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        let bulletHit = false;

        // 追踪逻辑
        if (bullet.tracking && bullet.life > 0) {
            const nearestEnemy = findNearestEnemy(bullet);
            if (nearestEnemy) {
                const angle = Math.atan2(nearestEnemy.y - bullet.y, nearestEnemy.x - bullet.x);
                const trackingStrength = 0.1; // 追踪强度
                bullet.dx += Math.cos(angle) * trackingStrength;
                bullet.dy += Math.sin(angle) * trackingStrength;
                
                // 限制速度
                const speed = Math.hypot(bullet.dx, bullet.dy);
                if (speed > bullet.speed) {
                    bullet.dx = (bullet.dx / speed) * bullet.speed;
                    bullet.dy = (bullet.dy / speed) * bullet.speed;
                }
            }
        }

        for (let j = game.enemies.length - 1; j >= 0; j--) {
            const enemy = game.enemies[j];

            if (checkCollision(bullet, enemy)) {
                if (!bullet.hitEnemies.has(enemy)) {
                    let damage = bullet.damage;
                    
                    // 双重伤害效果
                    if (bullet.doubleDamage) {
                        damage *= 2;
                    }
                    
                    enemy.hp -= damage;
                    
                    // 吸血效果
                    if (game.player.lifeSteal && game.player.lifeSteal > 0) {
                        const healAmount = Math.round(damage * game.player.lifeSteal);
                        game.player.hp = Math.min(game.player.hp + healAmount, game.player.maxHp);
                    }
                    
                    createParticleExplosion(enemy.x, enemy.y, 'red', 5, 2);

                    if (bullet.knockback > 0) {
                        const angle = Math.atan2(enemy.y - bullet.y, enemy.x - bullet.x);
                        enemy.x += Math.cos(angle) * bullet.knockback;
                        enemy.y += Math.sin(angle) * bullet.knockback;
                    }
                    bullet.hitEnemies.add(enemy);

                    if (enemy.hp <= 0) {
                        handleEnemyDefeat(enemy);
                        game.enemies.splice(j, 1);
                        continue; // 敌人已死，继续检查子弹是否能击中其他敌人
                    }

                    // 爆炸效果
                    if (bullet.explosive && bullet.explosionRadius > 0) {
                        createExplosion(bullet.x, bullet.y, bullet.explosionRadius, damage * 0.7);
                        bulletHit = true;
                        break;
                    }

                    if (bullet.pierce <= 0 || bullet.hitEnemies.size > bullet.pierce) {
                        bulletHit = true;
                        break; // 子弹消失
                    }
                }
            }
        }
        if (bulletHit) {
            game.bullets.splice(i, 1);
        }
    }
}

/**
 * 创建爆炸效果，对范围内的敌人造成伤害
 */
function createExplosion(x, y, radius, damage) {
    // 创建视觉爆炸效果
    createParticleExplosion(x, y, '#FF4500', 20, 8, 30);
    
    // 对范围内的敌人造成伤害
    for (let j = game.enemies.length - 1; j >= 0; j--) {
        const enemy = game.enemies[j];
        const distance = Math.hypot(enemy.x - x, enemy.y - y);
        
        if (distance <= radius) {
            // 距离越近伤害越高
            const damageMultiplier = 1 - (distance / radius) * 0.5;
            const explosionDamage = Math.round(damage * damageMultiplier);
            
            enemy.hp -= explosionDamage;
            
            // 吸血效果
            if (game.player.lifeSteal && game.player.lifeSteal > 0) {
                const healAmount = Math.round(explosionDamage * game.player.lifeSteal);
                game.player.hp = Math.min(game.player.hp + healAmount, game.player.maxHp);
            }
            
            // 击退效果
            const angle = Math.atan2(enemy.y - y, enemy.x - x);
            enemy.x += Math.cos(angle) * 10;
            enemy.y += Math.sin(angle) * 10;
            
            createParticleExplosion(enemy.x, enemy.y, '#FF6347', 3, 1);
            
            if (enemy.hp <= 0) {
                handleEnemyDefeat(enemy);
                game.enemies.splice(j, 1);
            }
        }
    }
}

function checkPlayerEnemyCollisions() {
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const enemy = game.enemies[i];
        if (checkCollision(game.player, enemy)) {
            game.player.hp -= 1;
            if (game.player.hp <= 0) {
                endGame();
                return;
            }
            createParticleExplosion(game.player.x, game.player.y, 'red', 3, 1);

            const angle = Math.atan2(enemy.y - game.player.y, enemy.x - game.player.x);
            enemy.x += Math.cos(angle) * 5;
            enemy.y += Math.sin(angle) * 5;
            game.player.x -= Math.cos(angle) * 2;
            game.player.y -= Math.sin(angle) * 2;
        }
    }
}

// checkPlayerItemCollisions 函数已移至 items.js

const meleeHitRegistry = new Map();

function checkMeleeCollisions() {
    for (let i = game.meleeAttacks.length - 1; i >= 0; i--) {
        const attack = game.meleeAttacks[i];
        if (!meleeHitRegistry.has(attack.id)) {
            meleeHitRegistry.set(attack.id, new Set());
        }
        const hitEnemies = meleeHitRegistry.get(attack.id);

        for (let j = game.enemies.length - 1; j >= 0; j--) {
            const enemy = game.enemies[j];
            if (hitEnemies.has(enemy.id)) continue;

            if (checkCollision(attack, enemy)) {
                const damage = attack.damage;
                enemy.hp -= damage;
                hitEnemies.add(enemy.id);

                // 吸血效果
                if (game.player.lifeSteal && game.player.lifeSteal > 0) {
                    const healAmount = Math.round(damage * game.player.lifeSteal);
                    game.player.hp = Math.min(game.player.hp + healAmount, game.player.maxHp);
                }

                // 麻痹效果
                if (attack.paralyze) {
                    const currentTime = Date.now();
                    if (!enemy.lastParalyzeTime || currentTime - enemy.lastParalyzeTime > 10000) { // 10秒冷却
                        enemy.paralyzed = true;
                        enemy.paralyzeEndTime = currentTime + (attack.paralyzeDuration * 1000 / 60); // 转换为毫秒
                        enemy.lastParalyzeTime = currentTime;
                        enemy.originalSpeed = enemy.speed;
                        enemy.speed = 0;
                    }
                }

                if (attack.knockback > 0) {
                    const angle = Math.atan2(enemy.y - attack.y, enemy.x - attack.x);
                    enemy.x += Math.cos(angle) * attack.knockback;
                    enemy.y += Math.sin(angle) * attack.knockback;
                }
                createParticleExplosion(enemy.x, enemy.y, attack.color || 'white', 5, 2);

                if (enemy.hp <= 0) {
                    handleEnemyDefeat(enemy);
                    game.enemies.splice(j, 1);
                }
            }
        }
        if (attack.duration <= 0) {
             meleeHitRegistry.delete(attack.id);
        }
    }
}


function checkAreaEffectCollisions() {
    game.areaEffects.forEach(effect => {
        if (effect.timer % effect.interval === 0) {
            for (let j = game.enemies.length - 1; j >= 0; j--) {
                const enemy = game.enemies[j];
                if (checkCollision(effect, enemy)) {
                    enemy.hp -= effect.damage;
                    createParticleExplosion(enemy.x, enemy.y, effect.color, 2, 1);

                    if (effect.slowFactor > 0) {
                        enemy.slowed = true;
                        enemy.slowEffect = effect.slowFactor;
                        enemy.slowDuration = effect.interval + 5;
                    }

                    if (enemy.hp <= 0) {
                        handleEnemyDefeat(enemy);
                        game.enemies.splice(j, 1);
                    }
                }
            }
        }
    });
}