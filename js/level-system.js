// js/level-system.js
// 升级系统管理

/**
 * 显示升级选项
 */
function showLevelUpOptions() {
    game.isRunning = false;
    game.isLevelingUp = true;
    const overlay = document.getElementById('levelUpOverlay');
    const optionsDiv = document.getElementById('levelUpOptions');
    optionsDiv.innerHTML = '';

    game.levelUpChoices = getRandomLevelUpOptions(3);

    game.levelUpChoices.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'level-up-option';
        optionElement.innerHTML = `
            <div class="option-title">${option.title}</div>
            <div class="option-description">${option.description}</div>
        `;
        optionElement.onclick = () => selectLevelUpOption(index);
        optionsDiv.appendChild(optionElement);
    });

    overlay.style.display = 'flex';
}

/**
 * 选择升级选项
 */
function selectLevelUpOption(index) {
    const chosenOption = game.levelUpChoices[index];
    if (chosenOption) {
        chosenOption.action();
        console.log(`选择了: ${chosenOption.title}`);
    }

    document.getElementById('levelUpOverlay').style.display = 'none';
    game.isLevelingUp = false;
    game.isRunning = true;
    if (typeof handleResize === 'function') handleResize();
    lastFrameTime = performance.now();
    requestAnimationFrame(gameLoop);
} 