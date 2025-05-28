// js/game-state.js
// 游戏状态管理和UI控制

/**
 * 初始化游戏
 */
function initGame(characterClass = 'archer') {
    game.canvas = document.getElementById('gameCanvas');
    game.ctx = game.canvas.getContext('2d');
    game.width = CONFIG.ORIGINAL_GAME_WIDTH;
    game.height = CONFIG.ORIGINAL_GAME_HEIGHT;
    game.canvas.width = game.width;
    game.canvas.height = game.height;
    game.scaleX = 1;
    game.scaleY = 1;

    // 使用initPlayer函数初始化玩家，传入角色类型
    initPlayer(characterClass);

    // 初始化游戏对象数组
    game.bullets = [];
    game.enemies = [];
    game.items = [];
    game.particles = [];
    game.explosions = [];
    game.meleeAttacks = [];
    game.areaEffects = [];
    game.summons = [];

    // 游戏状态
    game.isRunning = false;
    game.score = 0; // 现在表示杀敌个数
    game.gameTime = 0;

    // 关卡状态管理
    game.currentWave = 0;
    game.waveState = {
        status: 'spawning', // "spawning", "fighting", "cleared"
        timer: 0,
        enemiesRemaining: 0,
        isFinished: false // 游戏是否胜利
    };

    // 高分系统
    game.highScores = loadHighScores();
    renderHighScores();

    // UI 状态初始化
    resetUIState();

    // 重置所有武器冷却时间
    for (const weaponType in WEAPON_DEFINITIONS) {
        game.player.weaponCooldowns[weaponType] = 0;
    }
}

/**
 * 重置UI状态
 */
function resetUIState() {
    document.getElementById('startButton').style.display = 'block';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('highScoresScreen').style.display = 'none';
    document.getElementById('levelUpOverlay').style.display = 'none';
    document.getElementById('characterSelectScreen').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
    document.getElementById('gameStatusPanel').style.display = 'none';
    document.getElementById('gameInfoPanel').style.display = 'none';
    game.isLevelingUp = false;
}

/**
 * 开始游戏
 */
function startGame(characterClass = 'archer') {
    initGame(characterClass);
    hideAllMenus();
    document.getElementById('gameOverTitle').textContent = "Game Over"; // Reset title
    // 显示游戏状态UI
    document.getElementById('gameStatusPanel').style.display = 'block';
    document.getElementById('gameInfoPanel').style.display = 'block';
    if (typeof handleResize === 'function') handleResize(); // 保证比例正常
    game.isRunning = true;
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
}

/**
 * 隐藏所有菜单
 */
function hideAllMenus() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('characterSelectScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('highScoresScreen').style.display = 'none';
    document.getElementById('levelUpOverlay').style.display = 'none';
}

/**
 * 显示角色选择界面
 */
function showCharacterSelect() {
    hideAllMenus();
    document.getElementById('characterSelectScreen').style.display = 'block';
    renderCharacterOptions();
}

/**
 * 渲染角色选择选项
 */
function renderCharacterOptions() {
    const optionsDiv = document.getElementById('characterOptions');
    optionsDiv.innerHTML = '';
    
    Object.keys(CONFIG.CHARACTER_CLASSES).forEach(classKey => {
        const charClass = CONFIG.CHARACTER_CLASSES[classKey];
        
        // 创建角色选项容器
        const optionElement = document.createElement('div');
        optionElement.className = 'character-option';
        optionElement.onclick = () => selectCharacter(classKey);
        
        // 创建角色预览容器
        const previewDiv = document.createElement('div');
        previewDiv.className = 'character-preview';
        
        // 创建并配置canvas
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        canvas.style.display = 'block';
        
        const ctx = canvas.getContext('2d');
        
        // 绘制角色形状
        ctx.fillStyle = charClass.color;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        switch (charClass.shape) {
            case 'circle':
                ctx.arc(20, 20, 15, 0, Math.PI * 2);
                break;
            case 'square':
                ctx.rect(5, 5, 30, 30);
                break;
            case 'triangle':
                ctx.moveTo(20, 5);
                ctx.lineTo(5, 35);
                ctx.lineTo(35, 35);
                ctx.closePath();
                break;
        }
        
        ctx.fill();
        ctx.stroke();
        
        previewDiv.appendChild(canvas);
        
        // 创建角色信息容器
        const infoDiv = document.createElement('div');
        infoDiv.className = 'character-info';
        
        // 角色名称
        const nameDiv = document.createElement('div');
        nameDiv.className = 'character-name';
        nameDiv.textContent = charClass.name;
        
        // 角色描述
        const descDiv = document.createElement('div');
        descDiv.className = 'character-description';
        descDiv.textContent = charClass.description;
        
        // 角色属性
        const statsDiv = document.createElement('div');
        statsDiv.className = 'character-stats';
        
        const stats = [
            { label: 'HP', value: charClass.stats.maxHp },
            { label: 'Speed', value: charClass.stats.speed },
            { label: 'Attack', value: charClass.stats.attack },
            { label: 'Defense', value: charClass.stats.defense }
        ];
        
        stats.forEach(stat => {
            const statDiv = document.createElement('div');
            statDiv.className = 'character-stat';
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'stat-label';
            labelDiv.textContent = stat.label;
            
            const valueDiv = document.createElement('div');
            valueDiv.className = 'stat-value';
            valueDiv.textContent = stat.value;
            
            statDiv.appendChild(labelDiv);
            statDiv.appendChild(valueDiv);
            statsDiv.appendChild(statDiv);
        });
        
        // 组装信息容器
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(descDiv);
        infoDiv.appendChild(statsDiv);
        
        // 组装选项容器
        optionElement.appendChild(previewDiv);
        optionElement.appendChild(infoDiv);
        
        // 添加到选项列表
        optionsDiv.appendChild(optionElement);
    });
}

/**
 * 选择角色
 */
function selectCharacter(characterClass) {
    console.log(`Selected character: ${CONFIG.CHARACTER_CLASSES[characterClass].name}`);
    startGame(characterClass);
}

/**
 * 显示高分榜
 */
function showHighScores() {
    hideAllMenus();
    document.getElementById('highScoresScreen').style.display = 'block';
    // 隐藏游戏状态UI
    document.getElementById('gameStatusPanel').style.display = 'none';
    document.getElementById('gameInfoPanel').style.display = 'none';
    renderHighScores();
}

/**
 * 显示主菜单
 */
function showMainMenu() {
    hideAllMenus();
    document.getElementById('mainMenu').style.display = 'block';
    // 隐藏游戏状态UI
    document.getElementById('gameStatusPanel').style.display = 'none';
    document.getElementById('gameInfoPanel').style.display = 'none';
    game.isLevelingUp = false;
    game.isRunning = false;
    requestAnimationFrame(gameLoop);
} 