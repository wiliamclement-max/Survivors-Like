// js/config.js
const CONFIG = {
    PLAYER_SPEED: 3,
    PLAYER_RADIUS: 15,
    PLAYER_MAX_HP: 100,
    PLAYER_COLOR: '#4ECDC4', // Default color (archer)
    PLAYER_MAGNET_RADIUS: 50, // Experience attraction range
    BASE_EXP_TO_NEXT_LEVEL: 100, // Base experience required for level up

    ENEMY_SPAWN_INTERVAL: 60,
    ENEMY_MAX_COUNT: 500,

    BULLET_SPEED: 10,
    BULLET_RADIUS: 5,
    BULLET_DAMAGE: 10,

    ITEM_RADIUS: 8,
    ITEM_EXP_VALUE: 10,
    ITEM_HP_VALUE: 20,

    EXP_PER_LEVEL: 100,

    PARTICLE_LIFESPAN: 60,
    PARTICLE_SIZE: 3,

    EXPLOSION_LIFESPAN: 20,
    EXPLOSION_MAX_RADIUS: 50,

    TARGET_FPS: 60,
    ORIGINAL_GAME_WIDTH: 800,
    ORIGINAL_GAME_HEIGHT: 600,

    // Character definitions
    CHARACTER_CLASSES: {
        'warrior': {
            name: 'Warrior',
            description: 'Melee specialist with strong defense and health',
            shape: 'square',
            color: '#FF6B6B',
            initialWeapon: 'whirlwind',
            stats: {
                maxHp: 120,
                speed: 2.5,
                attack: 8,
                defense: 5
            }
        },
        'archer': {
            name: 'Archer',
            description: 'Ranged fighter with high attack speed and mobility',
            shape: 'triangle',
            color: '#4ECDC4',
            initialWeapon: 'basic_shot',
            stats: {
                maxHp: 80,
                speed: 3.5,
                attack: 6,
                defense: 2
            }
        },
        'mage': {
            name: 'Mage',
            description: 'Magic user with powerful area attack abilities',
            shape: 'circle',
            color: '#45B7D1',
            initialWeapon: 'blizzard',
            stats: {
                maxHp: 70,
                speed: 3.0,
                attack: 10,
                defense: 1
            }
        }
    },

    // New: Enemy type definitions
    ENEMY_DEFINITIONS: {
        'grunt': { hp: 10, speed: 1.5, radius: 10, color: '#A9A9A9', exp: 3 },
        'rusher': { hp: 7, speed: 2.5, radius: 8, color: '#FF4500', exp: 4 },
        'brute': { hp: 30, speed: 1, radius: 15, color: '#8B0000', exp: 6 },
        'dasher_boss': {
            hp: 200, speed: 2, radius: 25, color: '#FFD700', exp: 50,
            behavior: 'dasher', dashSpeed: 8, dashDuration: 20, dashCooldown: 120
        },
        'tank_boss': {
            hp: 300, speed: 0.8, radius: 30, color: '#4B0082', exp: 75,
            behavior: 'tank', shieldDuration: 180, shieldCooldown: 300
        },
        'summoner_boss': {
            hp: 250, speed: 1.5, radius: 25, color: '#00CED1', exp: 60,
            behavior: 'summoner', summonInterval: 180, summonCount: 3
        }
    },

    // New: Wave (level) definitions
    WAVE_DEFINITIONS: [
        // Wave 1: Basic enemies
        {
            totalEnemies: 100,
            spawnRate: 45,
            spawnGroups: [
                { type: 'grunt', count: 4, weight: 1 }
            ],
            boss: { type: 'dasher_boss', scale: 1.0 }
        },
        // Wave 2
        {
            totalEnemies: 150,
            spawnRate: 40,
            spawnGroups: [
                { type: 'grunt', count: 5, weight: 2 },
                { type: 'rusher', count: 2, weight: 1 }
            ],
            boss: { type: 'tank_boss', scale: 1.0 }
        },
        // Wave 3
        {
            totalEnemies: 200,
            spawnRate: 38,
            spawnGroups: [
                { type: 'grunt', count: 6, weight: 2 },
                { type: 'rusher', count: 3, weight: 1 }
            ],
            boss: { type: 'summoner_boss', scale: 1.0 }
        },
        // Wave 4
        {
            totalEnemies: 250,
            spawnRate: 35,
            spawnGroups: [
                { type: 'grunt', count: 6, weight: 2 },
                { type: 'rusher', count: 4, weight: 1 },
                { type: 'brute', count: 1, weight: 1 }
            ],
            boss: { type: 'dasher_boss', scale: 1.1 }
        },
        // Wave 5
        {
            totalEnemies: 300,
            spawnRate: 32,
            spawnGroups: [
                { type: 'grunt', count: 7, weight: 2 },
                { type: 'rusher', count: 5, weight: 1 },
                { type: 'brute', count: 2, weight: 1 }
            ],
            boss: { type: 'tank_boss', scale: 1.1 }
        },
        // Wave 6
        {
            totalEnemies: 350,
            spawnRate: 30,
            spawnGroups: [
                { type: 'grunt', count: 8, weight: 2 },
                { type: 'rusher', count: 6, weight: 1 },
                { type: 'brute', count: 2, weight: 1 }
            ],
            boss: { type: 'summoner_boss', scale: 1.1 }
        },
        // Wave 7
        {
            totalEnemies: 400,
            spawnRate: 28,
            spawnGroups: [
                { type: 'grunt', count: 10, weight: 2 },
                { type: 'rusher', count: 7, weight: 1 },
                { type: 'brute', count: 3, weight: 1 }
            ],
            boss: { type: 'dasher_boss', scale: 1.2 }
        },
        // Wave 8
        {
            totalEnemies: 450,
            spawnRate: 26,
            spawnGroups: [
                { type: 'grunt', count: 12, weight: 2 },
                { type: 'rusher', count: 8, weight: 1 },
                { type: 'brute', count: 3, weight: 1 }
            ],
            boss: { type: 'tank_boss', scale: 1.2 }
        },
        // Wave 9
        {
            totalEnemies: 500,
            spawnRate: 24,
            spawnGroups: [
                { type: 'grunt', count: 14, weight: 2 },
                { type: 'rusher', count: 9, weight: 1 },
                { type: 'brute', count: 4, weight: 1 }
            ],
            boss: { type: 'summoner_boss', scale: 1.2 }
        },
        // Wave 10
        {
            totalEnemies: 550,
            spawnRate: 22,
            spawnGroups: [
                { type: 'grunt', count: 15, weight: 2 },
                { type: 'rusher', count: 10, weight: 1 },
                { type: 'brute', count: 4, weight: 1 }
            ],
            boss: { type: 'dasher_boss', scale: 1.3 }
        },
        // Wave 11
        {
            totalEnemies: 600,
            spawnRate: 20,
            spawnGroups: [
                { type: 'grunt', count: 16, weight: 2 },
                { type: 'rusher', count: 12, weight: 1 },
                { type: 'brute', count: 5, weight: 1 }
            ],
            boss: { type: 'tank_boss', scale: 1.3 }
        },
        // Wave 12
        {
            totalEnemies: 650,
            spawnRate: 19,
            spawnGroups: [
                { type: 'grunt', count: 18, weight: 2 },
                { type: 'rusher', count: 14, weight: 1 },
                { type: 'brute', count: 6, weight: 1 }
            ],
            boss: { type: 'summoner_boss', scale: 1.3 }
        },
        // Wave 13
        {
            totalEnemies: 700,
            spawnRate: 18,
            spawnGroups: [
                { type: 'grunt', count: 20, weight: 2 },
                { type: 'rusher', count: 16, weight: 1 },
                { type: 'brute', count: 7, weight: 1 }
            ],
            boss: { type: 'dasher_boss', scale: 1.4 }
        },
        // Wave 14
        {
            totalEnemies: 750,
            spawnRate: 17,
            spawnGroups: [
                { type: 'grunt', count: 22, weight: 2 },
                { type: 'rusher', count: 18, weight: 1 },
                { type: 'brute', count: 8, weight: 1 }
            ],
            boss: { type: 'tank_boss', scale: 1.4 }
        },
        // Wave 15
        {
            totalEnemies: 800,
            spawnRate: 16,
            spawnGroups: [
                { type: 'grunt', count: 24, weight: 2 },
                { type: 'rusher', count: 20, weight: 1 },
                { type: 'brute', count: 9, weight: 1 }
            ],
            boss: { type: 'summoner_boss', scale: 1.4 }
        },
        // Wave 16
        {
            totalEnemies: 850,
            spawnRate: 15,
            spawnGroups: [
                { type: 'grunt', count: 26, weight: 2 },
                { type: 'rusher', count: 22, weight: 1 },
                { type: 'brute', count: 10, weight: 1 }
            ],
            boss: { type: 'dasher_boss', scale: 1.5 }
        },
        // Wave 17
        {
            totalEnemies: 900,
            spawnRate: 14,
            spawnGroups: [
                { type: 'grunt', count: 28, weight: 2 },
                { type: 'rusher', count: 24, weight: 1 },
                { type: 'brute', count: 12, weight: 1 }
            ],
            boss: { type: 'tank_boss', scale: 1.5 }
        },
        // Wave 18
        {
            totalEnemies: 950,
            spawnRate: 13,
            spawnGroups: [
                { type: 'grunt', count: 30, weight: 2 },
                { type: 'rusher', count: 26, weight: 1 },
                { type: 'brute', count: 14, weight: 1 }
            ],
            boss: { type: 'summoner_boss', scale: 1.5 }
        },
        // Wave 19
        {
            totalEnemies: 980,
            spawnRate: 12,
            spawnGroups: [
                { type: 'grunt', count: 32, weight: 2 },
                { type: 'rusher', count: 28, weight: 1 },
                { type: 'brute', count: 16, weight: 1 }
            ],
            boss: { type: 'dasher_boss', scale: 1.6 }
        },
        // Wave 20
        {
            totalEnemies: 1000,
            spawnRate: 10,
            spawnGroups: [
                { type: 'grunt', count: 35, weight: 2 },
                { type: 'rusher', count: 30, weight: 1 },
                { type: 'brute', count: 20, weight: 1 }
            ],
            boss: { type: 'tank_boss', scale: 2.0 }
        }
    ]
};