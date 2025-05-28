// js/enemies.js

function updateWaveAndSpawnEnemies() {
    const waveState = game.waveState;
    const currentWaveDef = CONFIG.WAVE_DEFINITIONS[game.currentWave];

    // 如果游戏胜利，则不执行任何操作
    if (waveState.isFinished) {
        return;
    }

    // 初始化关卡
    if (waveState.status === 'spawning') {
        waveState.enemiesRemaining = currentWaveDef.totalEnemies;
        waveState.enemiesSpawned = 0;
        waveState.spawnTimer = 0;
        waveState.bossSpawned = false;
        waveState.status = 'fighting';
        console.log(`Wave ${game.currentWave + 1} starting with ${currentWaveDef.totalEnemies} total enemies.`);
    }
    // 战斗中状态
    else if (waveState.status === 'fighting') {
        // 更新生成计时器
        waveState.spawnTimer++;
        
        // 检查是否需要生成新敌人
        if (waveState.spawnTimer >= currentWaveDef.spawnRate && 
            waveState.enemiesSpawned < currentWaveDef.totalEnemies) {
            
            // 生成普通敌人
            const spawnGroup = selectRandomSpawnGroup(currentWaveDef.spawnGroups);
            spawnEnemyGroup(spawnGroup);
            waveState.enemiesSpawned += spawnGroup.count;
            waveState.spawnTimer = 0;
        }

        // 检查是否需要生成Boss
        if (!waveState.bossSpawned && 
            waveState.enemiesSpawned >= currentWaveDef.totalEnemies * 0.7) { // 当70%的敌人被生成时
            spawnBoss(currentWaveDef.boss);
            waveState.bossSpawned = true;
        }

        // 检查关卡是否完成
        if (waveState.enemiesRemaining <= 0 && game.enemies.length === 0) {
            waveState.status = 'cleared';
            waveState.timer = 180; // 3秒倒计时到下一关
            console.log(`Wave ${game.currentWave + 1} cleared!`);
        }
    }
    // 关卡完成，等待下一关
    else if (waveState.status === 'cleared') {
        waveState.timer--;
        if (waveState.timer <= 0) {
            game.currentWave++;
            if (game.currentWave >= CONFIG.WAVE_DEFINITIONS.length) {
                waveState.isFinished = true;
                console.log("Congratulations! You have cleared all waves!");
            } else {
                waveState.status = 'spawning';
            }
        }
    }
}

// 根据权重随机选择生成组
function selectRandomSpawnGroup(spawnGroups) {
    const totalWeight = spawnGroups.reduce((sum, group) => sum + group.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const group of spawnGroups) {
        random -= group.weight;
        if (random <= 0) {
            return group;
        }
    }
    
    return spawnGroups[0]; // 保底返回第一个组
}

// 生成一组敌人
function spawnEnemyGroup(group) {
    const enemyDef = CONFIG.ENEMY_DEFINITIONS[group.type];
    for (let i = 0; i < group.count; i++) {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        if (side === 0) { x = Math.random() * game.width; y = -enemyDef.radius; }
        else if (side === 1) { x = game.width + enemyDef.radius; y = Math.random() * game.height; }
        else if (side === 2) { x = Math.random() * game.width; y = game.height + enemyDef.radius; }
        else { x = -enemyDef.radius; y = Math.random() * game.height; }
        
        const scale = group.scale || 1;
        spawnEnemy(group.type, x, y, scale);
    }
}

// 生成单个敌人
function spawnEnemy(type, x, y, scale = 1) {
    const enemyDef = CONFIG.ENEMY_DEFINITIONS[type];
    game.enemies.push({
        id: Date.now() + Math.random(),
        type: type,
        x: x, y: y,
        radius: enemyDef.radius * scale,
        color: enemyDef.color,
        speed: enemyDef.speed,
        hp: enemyDef.hp * scale,
        maxHp: enemyDef.hp * scale,
        exp: enemyDef.exp * scale,
        behavior: enemyDef.behavior || 'standard',
        aiState: { 
            timer: 0, 
            isDashing: false,
            shieldActive: false,
            summonTimer: 0
        }
    });
}

// 生成Boss
function spawnBoss(bossDef) {
    const enemyDef = CONFIG.ENEMY_DEFINITIONS[bossDef.type];
    const scale = bossDef.scale || 1;
    
    // 在屏幕中央生成Boss
    const x = game.width / 2;
    const y = game.height / 2;
    
    spawnEnemy(bossDef.type, x, y, scale);
    
    // 显示Boss出现提示
    game.particles.push({
        x: x, y: y,
        size: 50,
        color: enemyDef.color,
        life: 60,
        dx: 0, dy: 0,
        type: 'boss_spawn'
    });
}

function updateEnemies() {
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const enemy = game.enemies[i];
        let currentSpeed = enemy.speed;

        // 麻痹效果处理
        if (enemy.paralyzed) {
            const currentTime = Date.now();
            if (currentTime >= enemy.paralyzeEndTime) {
                enemy.paralyzed = false;
                enemy.speed = enemy.originalSpeed || enemy.speed;
                delete enemy.paralyzeEndTime;
                delete enemy.originalSpeed;
            } else {
                currentSpeed = 0; // 麻痹时无法移动
            }
        }

        // 减速效果处理
        if (enemy.slowed && enemy.slowDuration > 0) {
            currentSpeed *= (1 - enemy.slowEffect);
            enemy.slowDuration--;
            if (enemy.slowDuration <= 0) {
                enemy.slowed = false;
            }
        }

        // Boss AI 行为
        switch (enemy.behavior) {
            case 'dasher':
                updateDasherBoss(enemy, currentSpeed);
                break;
            case 'tank':
                updateTankBoss(enemy, currentSpeed);
                break;
            case 'summoner':
                updateSummonerBoss(enemy, currentSpeed);
                break;
            default:
                // 普通敌人追踪玩家
                const angleToPlayer = Math.atan2(game.player.y - enemy.y, game.player.x - enemy.x);
                enemy.x += Math.cos(angleToPlayer) * currentSpeed;
                enemy.y += Math.sin(angleToPlayer) * currentSpeed;
        }
    }
}

// 冲刺型Boss的行为
function updateDasherBoss(enemy, currentSpeed) {
    const bossDef = CONFIG.ENEMY_DEFINITIONS[enemy.type];
    enemy.aiState.timer++;
    
    if (enemy.aiState.isDashing) {
        currentSpeed = bossDef.dashSpeed;
        if (enemy.aiState.timer > bossDef.dashDuration) {
            enemy.aiState.isDashing = false;
            enemy.aiState.timer = 0;
        }
    } else if (enemy.aiState.timer > bossDef.dashCooldown) {
        enemy.aiState.isDashing = true;
        enemy.aiState.timer = 0;
        const angleToPlayer = Math.atan2(game.player.y - enemy.y, game.player.x - enemy.x);
        enemy.aiState.dashDx = Math.cos(angleToPlayer);
        enemy.aiState.dashDy = Math.sin(angleToPlayer);
    }
    
    if (enemy.aiState.isDashing) {
        enemy.x += enemy.aiState.dashDx * currentSpeed;
        enemy.y += enemy.aiState.dashDy * currentSpeed;
    } else {
        const angleToPlayer = Math.atan2(game.player.y - enemy.y, game.player.x - enemy.x);
        enemy.x += Math.cos(angleToPlayer) * currentSpeed;
        enemy.y += Math.sin(angleToPlayer) * currentSpeed;
    }
}

// 坦克型Boss的行为
function updateTankBoss(enemy, currentSpeed) {
    const bossDef = CONFIG.ENEMY_DEFINITIONS[enemy.type];
    enemy.aiState.timer++;
    
    // 护盾系统
    if (enemy.aiState.shieldActive) {
        if (enemy.aiState.timer > bossDef.shieldDuration) {
            enemy.aiState.shieldActive = false;
            enemy.aiState.timer = 0;
            enemy.color = bossDef.color; // 恢复原始颜色
        }
    } else if (enemy.aiState.timer > bossDef.shieldCooldown) {
        enemy.aiState.shieldActive = true;
        enemy.aiState.timer = 0;
        enemy.color = '#4B0082'; // 护盾激活时的颜色
    }
    
    // 移动模式：缓慢但坚定地追踪玩家
    const angleToPlayer = Math.atan2(game.player.y - enemy.y, game.player.x - enemy.x);
    enemy.x += Math.cos(angleToPlayer) * currentSpeed;
    enemy.y += Math.sin(angleToPlayer) * currentSpeed;
}

// 召唤型Boss的行为
function updateSummonerBoss(enemy, currentSpeed) {
    const bossDef = CONFIG.ENEMY_DEFINITIONS[enemy.type];
    enemy.aiState.timer++;
    
    // 召唤小怪
    if (enemy.aiState.timer > bossDef.summonInterval) {
        enemy.aiState.timer = 0;
        
        // 在Boss周围生成小怪
        for (let i = 0; i < bossDef.summonCount; i++) {
            const angle = (Math.PI * 2 * i) / bossDef.summonCount;
            const distance = 100; // 召唤距离
            const x = enemy.x + Math.cos(angle) * distance;
            const y = enemy.y + Math.sin(angle) * distance;
            
            // 随机选择小怪类型
            const minionTypes = ['grunt', 'rusher'];
            const type = minionTypes[Math.floor(Math.random() * minionTypes.length)];
            spawnEnemy(type, x, y, 0.8); // 小怪尺寸稍小
        }
        
        // 召唤特效
        createParticleExplosion(enemy.x, enemy.y, enemy.color, 20, 3, 30);
    }
    
    // 移动模式：保持距离
    const angleToPlayer = Math.atan2(game.player.y - enemy.y, game.player.x - enemy.x);
    const distanceToPlayer = Math.hypot(game.player.x - enemy.x, game.player.y - enemy.y);
    const idealDistance = 200; // 理想距离
    
    if (distanceToPlayer < idealDistance) {
        // 如果太近，远离玩家
        enemy.x -= Math.cos(angleToPlayer) * currentSpeed;
        enemy.y -= Math.sin(angleToPlayer) * currentSpeed;
    } else if (distanceToPlayer > idealDistance + 50) {
        // 如果太远，接近玩家
        enemy.x += Math.cos(angleToPlayer) * currentSpeed;
        enemy.y += Math.sin(angleToPlayer) * currentSpeed;
    }
}