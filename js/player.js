// js/player.js
// 玩家逻辑

/**
 * 初始化玩家对象。
 * @param {string} characterClass - 角色类型 ('warrior', 'archer', 'mage')
 */
function initPlayer(characterClass = 'archer') {
    const charConfig = CONFIG.CHARACTER_CLASSES[characterClass];
    
    game.player = {
        x: game.width / 2,
        y: game.height / 2,
        radius: CONFIG.PLAYER_RADIUS,
        color: charConfig.color,
        shape: charConfig.shape,
        characterClass: characterClass,
        speed: charConfig.stats.speed,
        hp: charConfig.stats.maxHp,
        maxHp: charConfig.stats.maxHp,
        exp: 0,
        level: 1,
        expToNextLevel: CONFIG.BASE_EXP_TO_NEXT_LEVEL,
        weapons: {
            [charConfig.initialWeapon]: { level: 1 } // 根据角色类型设置初始武器
        },
        weaponCooldowns: {}, // 存储每种武器的冷却时间
        lastMoveAngle: 0, // 记录玩家最后一次移动的方向，用于武器发射
        magnetRadius: CONFIG.PLAYER_MAGNET_RADIUS, // 经验吸附范围
        attack: charConfig.stats.attack, // 根据角色设置攻击力
        defense: charConfig.stats.defense, // 根据角色设置防御力
        updateExp: function(exp) {
            this.exp += exp;
            // 计算升级所需经验值：每级递增20%
            const baseExp = 100; // 基础经验值
            const expMultiplier = 1.2; // 每级经验值增加20%
            const requiredExp = Math.floor(baseExp * Math.pow(expMultiplier, this.level - 1));
            
            // 检查是否可以升级
            while (this.exp >= requiredExp) {
                this.exp -= requiredExp;
                this.levelUp();
            }
            
            // 更新UI
            this.updateUI();
        },
        levelUp: function() {
            this.level++;
            this.maxHp += 20; // 每级增加20点最大生命值
            this.hp = this.maxHp; // 升级时恢复满血
            
            // 属性成长
            this.attack += 2; // 每级增加2点攻击力
            this.defense += 1; // 每级增加1点防御力
            this.speed += 0.2; // 每级增加0.2点速度
            
            // 显示升级选项窗口
            game.isRunning = false;
            game.isLevelingUp = true;
            showLevelUpOptions();
            
            // 升级特效
            createParticleExplosion(game.player.x, game.player.y, 'gold', 50, 5, 60);
            
            console.log(`玩家升级到 Level ${this.level}!`);
            
            // 更新UI
            this.updateUI();
            
            // 触发升级事件
            if (window.gameEvents) {
                window.gameEvents.emit('playerLevelUp', {
                    level: this.level,
                    maxHp: this.maxHp,
                    attack: this.attack,
                    defense: this.defense,
                    speed: this.speed
                });
            }
        },
        updateUI: function() {
            // 计算当前等级所需经验值
            const baseExp = 100;
            const expMultiplier = 1.2;
            const requiredExp = Math.floor(baseExp * Math.pow(expMultiplier, this.level - 1));
            
            // 计算经验值百分比
            const expPercentage = (this.exp / requiredExp) * 100;
            
            // 更新UI元素
            const expBar = document.getElementById('expBar');
            const expText = document.getElementById('expText');
            const levelText = document.getElementById('levelText');
            
            if (expBar) expBar.style.width = `${expPercentage}%`;
            if (expText) expText.textContent = `${this.exp}/${requiredExp}`;
            if (levelText) levelText.textContent = `Lv.${this.level}`;
            
            // 更新其他UI
            const hpBar = document.getElementById('hpBar');
            const hpText = document.getElementById('hpText');
            if (hpBar) hpBar.style.width = `${(this.hp / this.maxHp) * 100}%`;
            if (hpText) hpText.textContent = `${this.hp}/${this.maxHp}`;
        }
    };

    // 初始化所有武器的冷却时间
    for (const weaponType in game.player.weapons) {
        const def = WEAPON_DEFINITIONS[weaponType];
        if (def && def.cooldown) {
            const cooldownIndex = Math.min(game.player.weapons[weaponType].level - 1, def.cooldown.length - 1);
            game.player.weaponCooldowns[weaponType] = def.cooldown[cooldownIndex];
        }
    }
}

/**
 * 更新玩家状态和逻辑。
 */
function updatePlayer() {
    // 处理玩家移动
    let dx = 0;
    let dy = 0;
    if (game.keys['w']) dy -= 1;
    if (game.keys['s']) dy += 1;
    if (game.keys['a']) dx -= 1;
    if (game.keys['d']) dx += 1;

    // 归一化移动向量，防止斜向移动过快
    if (dx !== 0 || dy !== 0) {
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        dx /= magnitude;
        dy /= magnitude;

        game.player.x += dx * game.player.speed;
        game.player.y += dy * game.player.speed;

        // 更新玩家最后移动方向
        game.player.lastMoveAngle = Math.atan2(dy, dx);
    }

    // 限制玩家在游戏边界内，使用玩家半径作为边距
    const minX = game.player.radius;
    const maxX = CONFIG.ORIGINAL_GAME_WIDTH - game.player.radius;
    const minY = game.player.radius;
    const maxY = CONFIG.ORIGINAL_GAME_HEIGHT - game.player.radius;
    game.player.x = Math.max(minX, Math.min(maxX, game.player.x));
    game.player.y = Math.max(minY, Math.min(maxY, game.player.y));

    // 武器发射逻辑
    for (const weaponType in game.player.weapons) {
        const weaponLevel = game.player.weapons[weaponType].level;
        const def = WEAPON_DEFINITIONS[weaponType];

        // 如果武器定义不存在，则跳过
        if (!def) continue;

        // 获取当前等级的冷却时间，确保索引不越界
        const cooldownIndex = Math.min(weaponLevel - 1, def.cooldown.length - 1);
        const cooldown = def.cooldown[cooldownIndex];

        // 减少武器冷却时间
        if (game.player.weaponCooldowns[weaponType] > 0) {
            game.player.weaponCooldowns[weaponType]--;
        }

        // 如果冷却时间结束，且武器类型是近战、远程、区域效果或召唤物
        if (game.player.weaponCooldowns[weaponType] <= 0) {
            if (def.type === 'ranged') {
                activateRangedWeapon(weaponType, weaponLevel); // 调用 activateRangedWeapon
            } else if (def.type === 'melee') {
                activateMeleeWeapon(weaponType, weaponLevel);
            } else if (def.type === 'area_effect') {
                activateAreaEffect(weaponType, weaponLevel);
            } else if (def.type === 'summon') {
                activateSummon(weaponType, weaponLevel);
            }
            // 重置冷却时间
            game.player.weaponCooldowns[weaponType] = cooldown;
        }
    }
}

// showLevelUpOptions 函数已移至 game.js