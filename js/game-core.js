// js/game-core.js
// 游戏核心逻辑 - 只包含游戏循环和核心状态管理

let lastFrameTime = 0;
let frameInterval = 1000 / CONFIG.TARGET_FPS; // 每帧的毫秒数

/**
 * 游戏主循环
 */
function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);

    // 只在主菜单、角色选择或结算界面可见时return
    if (
        document.getElementById('mainMenu').style.display !== 'none' ||
        document.getElementById('characterSelectScreen').style.display !== 'none' ||
        document.getElementById('gameOverScreen').style.display !== 'none'
    ) {
        return;
    }

    const elapsed = currentTime - lastFrameTime;

    if ((!game.isRunning && !game.isLevelingUp) || elapsed < frameInterval) {
        render();
        return;
    }

    lastFrameTime += frameInterval;

    if (game.isRunning) {
        // 更新游戏对象
        updatePlayer();
        updateEnemies();
        updateItems();
        updateBullets();
        updateMeleeAttacks();
        updateAreaEffects();
        updateSummons();
        updateParticles();
        updateExplosions();

        // 碰撞检测
        checkBulletCollisions();
        checkMeleeCollisions();
        checkAreaEffectCollisions();
        checkPlayerEnemyCollisions();
        checkPlayerItemCollisions();

        // 波次系统
        updateWaveAndSpawnEnemies();

        game.gameTime++;

        // 检查游戏胜利
        if (game.waveState.isFinished) {
            endGame(true);
        }
    }

    render();
    updateGameUI();
}

/**
 * 切换暂停状态
 */
function togglePause() {
    if (game.isLevelingUp) return; // 升级时不允许暂停
    game.isRunning = !game.isRunning;
    if (!game.isRunning) {
        document.getElementById('pauseOverlay').style.display = 'flex';
    } else {
        document.getElementById('pauseOverlay').style.display = 'none';
        lastFrameTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
}

/**
 * 结束游戏
 */
function endGame(isVictory = false) {
    game.isRunning = false;
    if (isVictory) {
        document.getElementById('gameOverTitle').textContent = "Victory!";
    } else {
        document.getElementById('gameOverTitle').textContent = "Game Over";
    }
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('finalLevel').textContent = game.player.level;
    document.getElementById('finalTime').textContent = `${Math.floor(game.gameTime / CONFIG.TARGET_FPS)}s`;
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('restartButton').style.display = 'block';
    // 隐藏游戏状态UI
    document.getElementById('gameStatusPanel').style.display = 'none';
    document.getElementById('gameInfoPanel').style.display = 'none';
    saveHighScore(game.score);
    renderHighScores();
} 