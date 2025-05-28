// js/score-system.js
// 高分系统管理

/**
 * 加载高分记录
 */
function loadHighScores() {
    const highScoresString = localStorage.getItem('highScores');
    return highScoresString ? JSON.parse(highScoresString) : [];
}

/**
 * 保存高分记录
 */
function saveHighScore(score) {
    const highScores = loadHighScores();
    highScores.push({ score: score, date: new Date().toLocaleString() });
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 10) {
        highScores.splice(10);
    }
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

/**
 * 渲染高分榜
 */
function renderHighScores() {
    const listElement = document.getElementById('highScoresList');
    listElement.innerHTML = '';
    if (game.highScores && game.highScores.length > 0) {
        game.highScores.forEach((entry, index) => {
            const div = document.createElement('div');
            div.textContent = `${index + 1}. ${entry.score} - ${entry.date}`;
            listElement.appendChild(div);
        });
    } else {
        listElement.innerHTML = '<div style="color: #888; text-align: center;">暂无记录</div>';
    }
} 