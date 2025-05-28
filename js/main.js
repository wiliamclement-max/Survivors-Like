// js/main.js
// 只保留事件绑定和updateGameUI函数，彻底移除gameLoop相关内容

document.addEventListener('DOMContentLoaded', () => {
    initGame(); // 初始化游戏，显示主菜单
    // gameLoop(); // 启动主菜单的渲染循环，不启动游戏逻辑

    // 绑定事件监听器
    document.getElementById('startButton').addEventListener('click', showCharacterSelect);
    document.getElementById('restartButton').addEventListener('click', showCharacterSelect);
    document.getElementById('highScoresButton').addEventListener('click', showHighScores);
    document.getElementById('backFromHighScoresButton').addEventListener('click', showMainMenu);
    document.getElementById('backToMenuButton').addEventListener('click', showMainMenu);
    document.getElementById('backToMainMenuButton').addEventListener('click', showMainMenu);

    // 键盘事件监听
    document.addEventListener('keydown', (e) => {
        game.keys[e.key] = true;
        // 如果是 P 键或 ESC 键，切换暂停
        if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
            togglePause();
        }
    });
    document.addEventListener('keyup', (e) => {
        game.keys[e.key] = false;
    });

    // 鼠标移动事件监听
    document.addEventListener('mousemove', (e) => {
        const rect = game.canvas.getBoundingClientRect();
        // 考虑 Canvas 的缩放和定位
        game.mouse.x = (e.clientX - rect.left) / game.scaleX;
        game.mouse.y = (e.clientY - rect.top) / game.scaleY;
    });

    // 鼠标点击事件监听 (用于玩家射击或互动)
    document.addEventListener('mousedown', (e) => {
        game.mouse.isDown = true;
    });
    document.addEventListener('mouseup', (e) => {
        game.mouse.isDown = false;
    });

    // ====================== 全屏功能 ======================
    document.getElementById('fullscreenButton').addEventListener('click', toggleFullscreen);

    function toggleFullscreen() {
        const element = document.documentElement; // 整个文档全屏
        // 或者只让 canvas 全屏：const element = game.canvas;

        if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    }

    // 监听全屏状态变化，以调整Canvas尺寸
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // For Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);   // For Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);   // For IE/Edge

    function handleFullscreenChange() {
        const canvas = game.canvas;
        if (document.fullscreenElement) {
            // 进入全屏
            canvas.style.width = '100%';
            canvas.style.height = '100%';

            // 更新 game 对象的宽高，并根据新宽高调整 Canvas 尺寸
            game.width = window.innerWidth;
            game.height = window.innerHeight;
            canvas.width = game.width;
            canvas.height = game.height;

            // 计算缩放比例，以便在渲染时调整
            game.scaleX = game.width / CONFIG.ORIGINAL_GAME_WIDTH;
            game.scaleY = game.height / CONFIG.ORIGINAL_GAME_HEIGHT;

            // 重新定位玩家到新画布的中心 (如果游戏正在进行)
            if (game.player) {
                game.player.x = game.width / 2;
                game.player.y = game.height / 2;
            }

        } else {
            // 退出全屏
            canvas.style.width = `${CONFIG.ORIGINAL_GAME_WIDTH}px`; // 恢复到原始尺寸
            canvas.style.height = `${CONFIG.ORIGINAL_GAME_HEIGHT}px`;

            // 恢复 game 对象的宽高
            game.width = CONFIG.ORIGINAL_GAME_WIDTH;
            game.height = CONFIG.ORIGINAL_GAME_HEIGHT;
            canvas.width = game.width;
            canvas.height = game.height;

            // 重置缩放比例
            game.scaleX = 1;
            game.scaleY = 1;

            // 重新定位玩家到中心
            if (game.player) {
                game.player.x = game.width / 2;
                game.player.y = game.height / 2;
            }
        }
        // 当画布大小改变时，清除并重新渲染一次，确保画面正确
        if (game.ctx) {
            game.ctx.clearRect(0, 0, canvas.width, canvas.height);
            render(); // 重新渲染当前游戏状态
        }
    }
});

// ========== 新增：每帧同步UI ========== //
function updateGameUI() {
    // 计算当前等级所需经验值（与player.js中的updateUI保持一致）
    const baseExp = 100;
    const expMultiplier = 1.2;
    const expNeeded = Math.floor(baseExp * Math.pow(expMultiplier, game.player.level - 1));
    const expRatio = expNeeded > 0 ? Math.min(1, game.player.exp / expNeeded) : 0;
    
    // PC端UI
    document.getElementById('uiLevel').textContent = game.player.level;
    document.getElementById('uiHp').textContent = `${Math.max(0, Math.floor(game.player.hp))}/${game.player.maxHp}`;
    document.getElementById('uiExpBar').style.width = (expRatio * 100) + '%';
    document.getElementById('uiExpText').textContent = `${Math.floor(game.player.exp)}/${expNeeded}`;
    document.getElementById('uiScore').textContent = game.score;
    document.getElementById('uiTime').textContent = `${Math.floor(game.gameTime / CONFIG.TARGET_FPS)}s`;
    document.getElementById('uiWave').textContent = `${game.currentWave + 1}/${CONFIG.WAVE_DEFINITIONS.length}`;
    // 移动端UI
    if (document.getElementById('mobileStatusPanel')) {
        document.getElementById('m_uiLevel').textContent = game.player.level;
        document.getElementById('m_uiHp').textContent = `${Math.max(0, Math.floor(game.player.hp))}/${game.player.maxHp}`;
        document.getElementById('m_uiExpBar').style.width = (expRatio * 100) + '%';
        document.getElementById('m_uiExpText').textContent = `${Math.floor(game.player.exp)}/${expNeeded}`;
        document.getElementById('m_uiScore').textContent = game.score;
        document.getElementById('m_uiTime').textContent = `${Math.floor(game.gameTime / CONFIG.TARGET_FPS)}s`;
        document.getElementById('m_uiWave').textContent = `${game.currentWave + 1}/${CONFIG.WAVE_DEFINITIONS.length}`;
    }
}