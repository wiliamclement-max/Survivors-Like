// js/render.js
// Game rendering logic

function render() {
    const ctx = game.ctx;
    const scaleX = game.scaleX;
    const scaleY = game.scaleY;
    const scaleR = Math.min(scaleX, scaleY);

    // Clear canvas
    ctx.clearRect(0, 0, game.width, game.height);

    // Draw background
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, game.width, game.height);

    // Draw enemies
    game.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        
        // Paralysis status visual effect
        if (enemy.paralyzed) {
            ctx.fillStyle = '#9932CC'; // Purple for paralysis
            ctx.strokeStyle = '#FFFF00'; // Yellow border
            ctx.lineWidth = 2 * scaleR;
        }
        
        ctx.beginPath();
        ctx.arc(enemy.x * scaleX, enemy.y * scaleY, enemy.radius * scaleR, 0, Math.PI * 2);
        ctx.fill();
        
        if (enemy.paralyzed) {
            ctx.stroke();
        }

        // Draw enemy health bar
        const hpBarWidth = enemy.radius * 2 * scaleR;
        const hpBarHeight = 5 * scaleR;
        const hpRatio = enemy.hp / enemy.maxHp;
        const hpBarX = (enemy.x - enemy.radius) * scaleX;
        const hpBarY = (enemy.y - enemy.radius - 2) * scaleY - hpBarHeight;

        ctx.fillStyle = 'red';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
        ctx.fillStyle = 'lime';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth * hpRatio, hpBarHeight);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1 * scaleR;
        ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
    });

    // Draw bullets
    game.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x * scaleX, bullet.y * scaleY, bullet.radius * scaleR, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw melee attacks
    game.meleeAttacks.forEach(attack => {
        ctx.save();
        ctx.globalAlpha = attack.life / attack.maxLife;

        switch (attack.type) {
            case 'whirlwind':
            case 'berserker_whirlwind':
            case 'power_whirlwind':
            case 'paralyze_strike':
                ctx.strokeStyle = attack.color;
                let lineWidth = 5 * scaleR;
                
                // Different visual effects for different skills
                if (attack.type === 'berserker_whirlwind') {
                    lineWidth = 3 * scaleR; // Thinner lines for fast attacks
                    ctx.setLineDash([5, 5]); // Dashed effect
                } else if (attack.type === 'power_whirlwind') {
                    lineWidth = 8 * scaleR; // Thicker lines for powerful attacks
                } else if (attack.type === 'paralyze_strike') {
                    lineWidth = 4 * scaleR;
                    // Add flashing effect
                    ctx.globalAlpha *= (Math.sin(Date.now() * 0.02) + 1) * 0.5;
                }
                
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.arc(attack.x * scaleX, attack.y * scaleY, attack.radius * scaleR, 0, Math.PI * 2);
                ctx.stroke();
                
                // Reset line style
                ctx.setLineDash([]);
                break;
            case 'moonslash':
                ctx.fillStyle = attack.color;
                ctx.beginPath();
                ctx.moveTo(attack.x * scaleX, attack.y * scaleY);
                ctx.arc(attack.x * scaleX, attack.y * scaleY, attack.radius * scaleR, attack.angle - attack.arc / 2, attack.angle + attack.arc / 2);
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    });

    // Draw area effects
    game.areaEffects.forEach(effect => {
        ctx.save();
        
        if (effect.type === 'lightning_strike') {
            // Lightning strike special rendering
            ctx.globalAlpha = Math.max(0.3, effect.life / 15); // Use life property
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 3 * scaleR;
            
            // Draw lightning effect
            const x = effect.x * scaleX;
            const y = effect.y * scaleY;
            const radius = effect.radius * scaleR;
            
            // Draw multiple lightning lines
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(x, y - radius * 2);
                
                // Create jagged lightning
                const segments = 8;
                for (let j = 0; j <= segments; j++) {
                    const segmentY = y - radius * 2 + (radius * 4 * j / segments);
                    const offsetX = (Math.random() - 0.5) * radius * 0.5;
                    ctx.lineTo(x + offsetX, segmentY);
                }
                ctx.stroke();
            }
            
            // Draw lightning center circle
            ctx.fillStyle = effect.color;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        } else if (effect.type === 'blizzard') {
            // Blizzard special rendering - semi-transparent and doesn't block player
            ctx.globalAlpha = 0.3; // More transparent
            ctx.fillStyle = effect.color;
            ctx.beginPath();
            ctx.arc(effect.x * scaleX, effect.y * scaleY, effect.radius * scaleR, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw blizzard edge effect
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = effect.color;
            ctx.lineWidth = 2 * scaleR;
            ctx.stroke();
        } else {
            // Other area effect rendering
            const maxLife = 180; // Default maximum life value
            ctx.globalAlpha = 0.4 + (effect.life / maxLife) * 0.3;

            ctx.fillStyle = effect.color;
            ctx.beginPath();
            ctx.arc(effect.x * scaleX, effect.y * scaleY, effect.radius * scaleR, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    });
    
    // Draw summons
    game.summons.forEach(summon => { /* ... */ });

    // Draw player
    ctx.fillStyle = game.player.color;
    ctx.strokeStyle = 'gold';
    ctx.lineWidth = 2 * scaleR;
    
    const playerX = game.player.x * scaleX;
    const playerY = game.player.y * scaleY;
    const playerRadius = game.player.radius * scaleR;
    
    ctx.beginPath();
    
    switch (game.player.shape) {
        case 'circle':
            ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2);
            break;
        case 'square':
            const size = playerRadius * 1.4; // Square slightly larger to maintain similar visual size
            ctx.rect(playerX - size/2, playerY - size/2, size, size);
            break;
        case 'triangle':
            const height = playerRadius * 1.6; // Triangle height
            ctx.moveTo(playerX, playerY - height/2); // Top vertex
            ctx.lineTo(playerX - height/2, playerY + height/2); // Bottom left
            ctx.lineTo(playerX + height/2, playerY + height/2); // Bottom right
            ctx.closePath();
            break;
        default:
            ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2);
    }
    
    ctx.fill();
    ctx.stroke();

    // Draw items
    game.items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x * scaleX, item.y * scaleY, item.radius * scaleR, 0, Math.PI * 2);
        ctx.fill();
        if (item.type === 'hp') {
            ctx.fillStyle = 'white';
            ctx.font = `${10 * scaleR}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('+', item.x * scaleX, item.y * scaleY - 1 * scaleR);
        }
    });

    // Draw particle effects
    game.particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / particle.maxLife;
        ctx.beginPath();
        ctx.arc(particle.x * scaleX, particle.y * scaleY, particle.size * scaleR, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    // Draw explosion effects
    game.explosions.forEach(explosion => {
        ctx.fillStyle = explosion.color;
        ctx.globalAlpha = explosion.life / explosion.maxLife;
        ctx.beginPath();
        ctx.arc(explosion.x * scaleX, explosion.y * scaleY, explosion.radius * (1 - (explosion.life / explosion.maxLife)) * scaleR, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    // --- Only keep game content rendering, remove canvas internal numerical UI ---
}