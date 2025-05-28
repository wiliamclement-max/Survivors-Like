// js/items.js
// 道具相关函数

const items = {
    spawnItem: function(x, y, type = 'exp', value = null) {
        const item = {
            x: x,
            y: y,
            radius: CONFIG.ITEM_RADIUS,
            type: type, // 'exp' 或 'hp'
            color: type === 'exp' ? '#00FF00' : '#FF0000', // 经验绿色，血量红色
            value: value !== null ? value : (type === 'exp' ? CONFIG.ITEM_EXP_VALUE : CONFIG.ITEM_HP_VALUE),
            // 初始速度，可以为道具添加一些随机散开效果
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            life: 0 // 道具生命周期，用于吸附效果，也可以用于限制道具存在时间
        };
        game.items.push(item);
    },

    updateItems: function() {
        for (let i = game.items.length - 1; i >= 0; i--) {
            const item = game.items[i];

            // 简单的移动逻辑 (可根据需要更复杂)
            item.x += item.dx;
            item.y += item.dy;

            // 道具吸附效果
            const dist = getDistance(game.player, item);
            if (dist < game.player.magnetRadius) {
                // 计算朝向玩家的向量
                const angleToPlayer = Math.atan2(game.player.y - item.y, game.player.x - item.x);
                const attractSpeed = 5; // 吸附速度
                item.dx = Math.cos(angleToPlayer) * attractSpeed;
                item.dy = Math.sin(angleToPlayer) * attractSpeed;
            } else {
                // 如果不在吸附范围内，道具逐渐减速并停止
                item.dx *= 0.95;
                item.dy *= 0.95;
            }

            // 限制道具在画布内，与玩家边界一致
            item.x = Math.max(item.radius, Math.min(item.x, CONFIG.ORIGINAL_GAME_WIDTH - item.radius));
            item.y = Math.max(item.radius, Math.min(item.y, CONFIG.ORIGINAL_GAME_HEIGHT - item.radius));

            // 道具生命周期（如果需要自动消失）
            // item.life++;
            // if (item.life > 300) { // 例如，300帧后消失
            //     game.items.splice(i, 1);
            // }
        }
    },

    checkPlayerItemCollisions: function() {
        for (let i = game.items.length - 1; i >= 0; i--) {
            const item = game.items[i];
            if (checkCollision(game.player, item)) {
                if (item.type === 'hp') {
                    game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.value);
                    createParticleExplosion(item.x, item.y, '#FF0000', 5, 2);
                } else if (item.type === 'exp') {
                    game.player.updateExp(item.value);
                    createParticleExplosion(item.x, item.y, '#00FF00', 5, 2);
                }
                game.items.splice(i, 1);
            }
        }
    },

    createExpOrb: function(x, y, expValue) {
        return {
            x: x,
            y: y,
            radius: 5,
            expValue: expValue || Math.floor(Math.random() * 20) + 10, // 经验值范围：10-30
            color: '#FFD700',
            collected: false,
            update: function(deltaTime, player) {
                if (this.collected) return;
                
                // 计算与玩家的距离
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 如果玩家在吸附范围内，向玩家移动
                if (distance < player.magnetRadius) {
                    const speed = 200; // 吸附速度
                    const angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * speed * deltaTime;
                    this.y += Math.sin(angle) * speed * deltaTime;
                }
                
                // 检查是否被收集
                if (distance < player.radius + this.radius) {
                    this.collected = true;
                    player.updateExp(this.expValue);
                    return true;
                }
                return false;
            },
            draw: function(ctx) {
                if (this.collected) return;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                
                // 绘制经验值数字
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.expValue, this.x, this.y);
            }
        };
    }
};

// 导出所有函数到全局作用域
window.items = items;
window.updateItems = items.updateItems;
window.spawnItem = items.spawnItem;
window.checkPlayerItemCollisions = items.checkPlayerItemCollisions;
window.createExpOrb = items.createExpOrb;