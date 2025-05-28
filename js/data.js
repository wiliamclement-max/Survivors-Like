// js/data.js
// Weapon and ability definitions

const WEAPON_DEFINITIONS = {
    // Ranged weapons
    'basic_shot': {
        name: 'Basic Shot',
        description: 'Fires a basic bullet.',
        type: 'ranged',
        cooldown: [30, 28, 26, 24, 22, 20], // Cooldown time (frames)
        damage: [10, 12, 14, 16, 18, 20], // Damage
        bulletSpeed: 10,
        bulletRadius: 5,
        bulletColor: '#FFFF00', // Yellow bullet
        numBullets: [1, 1, 1, 1, 1, 1], // Number of bullets
        pierce: [0, 0, 0, 0, 0, 0], // Pierce count
        knockback: 0
    },
    'spread_shot': {
        name: 'Spread Shot',
        description: 'Fires multiple scattered bullets forward.',
        type: 'ranged',
        cooldown: [60, 55, 50, 45, 40, 35],
        damage: [5, 6, 7, 8, 9, 10],
        bulletSpeed: 8,
        bulletRadius: 4,
        bulletColor: '#FFA500', // Orange bullet
        numBullets: [3, 4, 5, 6, 7, 8], // Number of bullets
        spreadAngle: 45, // Spread angle (degrees)
        pierce: [0, 0, 0, 0, 0, 0],
        knockback: 5
    },
    'piercing_shot': {
        name: 'Piercing Shot',
        description: 'Fires bullets that can pierce through enemies.',
        type: 'ranged',
        cooldown: [45, 42, 39, 36, 33, 30],
        damage: [8, 9, 10, 11, 12, 13],
        bulletSpeed: 12,
        bulletRadius: 6,
        bulletColor: '#00FFFF', // Cyan bullet
        numBullets: [1, 1, 1, 1, 1, 1],
        pierce: [1, 2, 3, 4, 5, 999], // Pierce count (999 = infinite)
        knockback: 0
    },
    'homing_missile': {
        name: 'Homing Missile',
        description: 'Fires missiles that track enemies.',
        type: 'ranged',
        cooldown: [120, 110, 100, 90, 80, 70],
        damage: [20, 25, 30, 35, 40, 50],
        bulletSpeed: 5,
        bulletRadius: 8,
        bulletColor: '#FF00FF', // Purple bullet
        numBullets: [1, 1, 1, 1, 1, 1],
        pierce: [0, 0, 0, 0, 0, 0],
        knockback: 10,
        homing: true, // Homing property
        homingStrength: 0.05 // Homing strength
    },

    // Melee weapons
    'whirlwind': {
        name: 'Whirlwind',
        description: 'A 360-degree slash attack centered on the player.',
        type: 'melee',
        cooldown: [90, 85, 80, 75, 70, 60],
        damage: [15, 20, 25, 30, 35, 40],
        radius: [50, 55, 60, 65, 70, 80], // Attack range
        arc: Math.PI * 2, // 360-degree full attack
        knockback: 10,
        duration: 10, // Attack duration in frames
        color: 'rgba(255, 255, 255, 0.8)' // White
    },
    'moonslash': {
        name: 'Moon Slash',
        description: 'A quick fan-shaped slash attack forward.',
        type: 'melee',
        cooldown: [70, 65, 60, 55, 50, 40],
        damage: [10, 12, 14, 16, 18, 20],
        radius: [70, 75, 80, 85, 90, 100],
        arc: Math.PI / 2, // 90-degree fan
        knockback: 15,
        duration: 15,
        color: 'rgba(0, 200, 255, 0.8)' // Blue
    },
    'thrust': {
        name: 'Thrust',
        description: 'A penetrating thrust in the aimed direction.',
        type: 'melee',
        cooldown: [80, 75, 70, 65, 60, 50],
        damage: [20, 25, 30, 35, 40, 50],
        length: [100, 110, 120, 130, 140, 150], // Thrust length
        width: [20, 22, 24, 26, 28, 30], // Thrust width
        knockback: 20,
        duration: 12,
        color: 'rgba(255, 255, 0, 0.8)' // Yellow
    },

    // Area effects
    'blizzard': {
        name: 'Blizzard',
        description: 'Summons a frost area around the player that continuously damages and slows enemies.',
        type: 'area_effect',
        cooldown: [300, 280, 260, 240, 220, 200], // Cooldown time (frames)
        damage: [2, 3, 4, 5, 6, 7], // Damage per tick
        radius: [80, 90, 100, 110, 120, 130], // Range
        duration: [180, 200, 220, 240, 260, 280], // Duration (frames, e.g., 3-4.7 seconds)
        interval: 30, // Damage interval (frames)
        slowFactor: [0.1, 0.15, 0.2, 0.25, 0.3, 0.35], // Slow ratio (0 to 1)
        color: 'lightblue'
    },
    'toxic_cloud': {
        name: 'Toxic Cloud',
        description: 'Throws a poison bomb that continuously poisons enemies in the area.',
        type: 'area_effect',
        cooldown: [240, 220, 200, 180, 160, 140],
        damage: [3, 4, 5, 6, 7, 8],
        radius: [60, 70, 80, 90, 100, 110],
        duration: 240, // 4 seconds
        interval: 20, // Damage interval
        color: 'lime'
    },
    'black_hole': {
        name: 'Black Hole',
        description: 'Summons a black hole that pulls enemies to the center and deals massive damage.',
        type: 'area_effect',
        cooldown: [600, 570, 540, 510, 480, 450], // 10 second cooldown
        damage: [50, 60, 70, 80, 90, 100], // Final explosion damage
        radius: [40, 50, 60, 70, 80, 90], // Pull range
        duration: 120, // Duration (2 seconds)
        pullForce: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Pull strength
        interval: 10, // Check pull every frame
        color: 'purple'
    },

    // Summons
    'fairy': {
        name: 'Fairy',
        description: 'Summons a fairy that follows the player and automatically attacks the nearest enemy.',
        type: 'summon',
        cooldown: [400, 380, 360, 340, 320, 300],
        damage: [5, 6, 7, 8, 9, 10], // Fairy attack damage
        radius: 8, // Fairy radius
        duration: 900, // Duration (15 seconds)
        speed: 4, // Fairy movement speed
        attackInterval: 45, // Attack interval
        range: 150, // Attack range
        color: 'pink'
    },
    'guardian_shield': {
        name: 'Guardian Shield',
        description: 'Summons a guardian shield that rotates around the player, blocking and damaging enemies on contact.',
        type: 'summon',
        cooldown: [360, 340, 320, 300, 280, 260],
        damage: [8, 10, 12, 14, 16, 18],
        radius: 12,
        duration: 600, // Duration (10 seconds)
        speed: 0, // Doesn\'t move itself, but rotates around player
        attackInterval: 5, // Check collision every frame
        range: CONFIG.PLAYER_RADIUS + 20, // Radius around player
        numShields: [1, 2, 3, 3, 3, 4], // Number of shields
        color: 'cyan'
    },
    'seeking_bee': {
        name: 'Seeking Bee',
        description: 'Summons a tracking bee that explodes on contact with enemies, dealing area damage.',
        type: 'summon',
        cooldown: [200, 180, 160, 140, 120, 100],
        damage: [15, 20, 25, 30, 35, 40], // Explosion damage
        radius: 10, // Bee radius
        duration: 180, // Duration (3 seconds)
        speed: 6,
        explosionRadius: [30, 35, 40, 45, 50, 60], // Explosion range
        color: 'yellow'
    },
    'phantom_warrior': {
        name: 'Phantom Warrior',
        description: 'Summons a phantom warrior that automatically attacks nearby enemies.',
        type: 'summon',
        cooldown: [500, 480, 460, 440, 420, 400],
        damage: [20, 25, 30, 35, 40, 50],
        radius: 15,
        duration: 720, // Duration (12 seconds)
        speed: 2,
        attackInterval: 90, // Attack interval
        range: 100, // Attack range
        color: 'rgba(150, 150, 255, 0.6)'
    },

    // Archer-specific weapons
    'crossbow': {
        name: 'Crossbow',
        description: 'Shoots in four directions simultaneously.',
        type: 'ranged',
        cooldown: [80, 75, 70, 65, 60, 55],
        damage: [8, 10, 12, 14, 16, 18],
        bulletSpeed: 8,
        bulletRadius: 4,
        bulletColor: '#00FFFF',
        numBullets: [4, 4, 4, 4, 4, 4], // Fixed 4 shots
        pierce: [0, 0, 1, 1, 2, 2],
        knockback: 0,
        pattern: 'cross' // Cross-shaped firing
    },
    'double_shot': {
        name: 'Double Shot',
        description: 'Each arrow deals double damage to enemies.',
        type: 'ranged',
        cooldown: [50, 45, 40, 35, 30, 25],
        damage: [6, 8, 10, 12, 14, 16],
        bulletSpeed: 10,
        bulletRadius: 5,
        bulletColor: '#FFD700',
        numBullets: [1, 1, 1, 1, 1, 1],
        pierce: [0, 0, 0, 1, 1, 2],
        knockback: 0,
        doubleDamage: true // Special flag: double damage
    },

    // Warrior-specific skills
    'berserker_whirlwind': {
        name: 'Berserker Whirlwind',
        description: 'Greatly increases whirlwind attack frequency.',
        type: 'melee',
        cooldown: [20, 18, 16, 14, 12, 10], // Much faster than normal whirlwind
        damage: [15, 18, 21, 24, 27, 30],
        radius: [40, 42, 44, 46, 48, 50],
        duration: [30, 32, 34, 36, 38, 40],
        color: '#FF4500',
        knockback: 8
    },
    'power_whirlwind': {
        name: 'Power Whirlwind',
        description: 'Increases whirlwind area and attack range.',
        type: 'melee',
        cooldown: [60, 55, 50, 45, 40, 35],
        damage: [20, 25, 30, 35, 40, 45],
        radius: [60, 70, 80, 90, 100, 110], // Larger range
        duration: [40, 42, 44, 46, 48, 50],
        color: '#8B0000',
        knockback: 15
    },
    'paralyze_strike': {
        name: 'Paralyze Strike',
        description: 'Paralyzes enemies for 2 seconds after attacking.',
        type: 'melee',
        cooldown: [45, 42, 39, 36, 33, 30],
        damage: [12, 15, 18, 21, 24, 27],
        radius: [35, 37, 39, 41, 43, 45],
        duration: [25, 27, 29, 31, 33, 35],
        color: '#9932CC',
        knockback: 5,
        paralyze: true, // Special effect: paralyze
        paralyzeDuration: 120 // 2 seconds (120 frames)
    },

    // Mage-specific weapons
    'small_fireball': {
        name: 'Small Fireball',
        description: 'Rapidly fires 2 tracking fireballs.',
        type: 'ranged',
        cooldown: [40, 35, 30, 25, 20, 15],
        damage: [8, 10, 12, 14, 16, 18],
        bulletSpeed: 12,
        bulletRadius: 6,
        bulletColor: '#FF6347',
        numBullets: [2, 2, 2, 2, 2, 2],
        pierce: [0, 0, 0, 1, 1, 1],
        knockback: 3,
        tracking: true // Tracking ability
    },
    'big_fireball': {
        name: 'Big Fireball',
        description: 'Fires trackable explosive fireballs.',
        type: 'ranged',
        cooldown: [90, 85, 80, 75, 70, 65],
        damage: [25, 30, 35, 40, 45, 50],
        bulletSpeed: 6,
        bulletRadius: 12,
        bulletColor: '#FF4500',
        numBullets: [1, 1, 1, 1, 1, 1],
        pierce: [0, 0, 0, 0, 0, 0],
        knockback: 10,
        tracking: true,
        explosive: true, // Explosion effect
        explosionRadius: [30, 35, 40, 45, 50, 55]
    },
    'lightning_strike': {
        name: 'Lightning Strike',
        description: 'Summons lightning above enemies, attacking 3 enemies simultaneously.',
        type: 'area_effect',
        cooldown: [120, 110, 100, 90, 80, 70],
        damage: [30, 35, 40, 45, 50, 55],
        radius: [20, 22, 24, 26, 28, 30],
        duration: 15, // Fixed duration: 15 frames for visual effect
        color: '#FFFF00',
        targets: [3, 3, 4, 4, 5, 5], // Number of enemies attacked simultaneously
        instant: true // Instant damage
    }
};

// Universal upgrade options
const UNIVERSAL_UPGRADES = [
    {
        title: "Increase Attack Power",
        description: "All weapon damage increased by 15%.",
        action: () => {
            game.player.attack = Math.round(game.player.attack * 1.15);
            // Also affects all weapon damage
            for (const weaponType in game.player.weapons) {
                const def = WEAPON_DEFINITIONS[weaponType];
                if (def && def.damage) {
                    def.damage = def.damage.map(d => Math.round(d * 1.15));
                }
            }
        },
    },
    {
        title: "Increase Movement Speed",
        description: "Movement speed increased by 12%.",
        action: () => {
            game.player.speed *= 1.12;
        },
    },
    {
        title: "Increase Experience and Item Collection Range",
        description: "Experience orb and item attraction range increased by 40.",
        action: () => {
            game.player.magnetRadius += 40;
        },
    },
    {
        title: "Increase Maximum Health",
        description: "Maximum health increased by 25, and immediately recover 25 health points.",
        action: () => {
            game.player.maxHp += 25;
            game.player.hp = Math.min(game.player.hp + 25, game.player.maxHp);
        },
    },
    {
        title: "Reduce Weapon Cooldown",
        description: "All weapon cooldowns reduced by 12%.",
        action: () => {
            for (const weaponType in game.player.weapons) {
                const def = WEAPON_DEFINITIONS[weaponType];
                if (def && def.cooldown) {
                    def.cooldown = def.cooldown.map(c => Math.max(8, Math.round(c * 0.88)));
                }
            }
        },
    },
    {
        title: "Enhance Defense",
        description: "Defense increased by 2 points, reducing damage taken.",
        action: () => {
            game.player.defense += 2;
        },
    },
    {
        title: "Luck Boost",
        description: "Item drop rate increased by 30%.",
        action: () => {
            if (!game.player.luckBonus) game.player.luckBonus = 1;
            game.player.luckBonus *= 1.3;
        },
    }
];

// Character-specific upgrade options
const CHARACTER_SPECIFIC_UPGRADES = {
    archer: [
        {
            title: "Spread Shot",
            description: "Unlock spread shot, firing multiple arrows in a fan pattern forward.",
            weaponType: 'spread_shot',
            action: () => {
                if (!game.player.weapons['spread_shot']) {
                    game.player.weapons['spread_shot'] = { level: 1 };
                } else {
                    game.player.weapons['spread_shot'].level++;
                }
            },
        },
        {
            title: "Crossbow",
            description: "Unlock crossbow, shooting in four directions simultaneously.",
            weaponType: 'crossbow',
            action: () => {
                if (!game.player.weapons['crossbow']) {
                    game.player.weapons['crossbow'] = { level: 1 };
                } else {
                    game.player.weapons['crossbow'].level++;
                }
            },
        },
        {
            title: "Double Shot",
            description: "Unlock double shot, each arrow deals double damage to enemies.",
            weaponType: 'double_shot',
            action: () => {
                if (!game.player.weapons['double_shot']) {
                    game.player.weapons['double_shot'] = { level: 1 };
                } else {
                    game.player.weapons['double_shot'].level++;
                }
            },
        },
        {
            title: "Archery Mastery",
            description: "All bow weapons fire rate increased by 25%.",
            action: () => {
                const archerWeapons = ['basic_shot', 'spread_shot', 'crossbow', 'double_shot'];
                archerWeapons.forEach(weaponType => {
                    const def = WEAPON_DEFINITIONS[weaponType];
                    if (def && def.cooldown) {
                        def.cooldown = def.cooldown.map(c => Math.max(5, Math.round(c * 0.75)));
                    }
                });
            },
        }
    ],
    warrior: [
        {
            title: "Berserker Whirlwind",
            description: "Unlock berserker whirlwind, greatly increasing whirlwind attack frequency.",
            weaponType: 'berserker_whirlwind',
            action: () => {
                if (!game.player.weapons['berserker_whirlwind']) {
                    game.player.weapons['berserker_whirlwind'] = { level: 1 };
                } else {
                    game.player.weapons['berserker_whirlwind'].level++;
                }
            },
        },
        {
            title: "Power Whirlwind",
            description: "Unlock power whirlwind, increasing whirlwind area and attack range.",
            weaponType: 'power_whirlwind',
            action: () => {
                if (!game.player.weapons['power_whirlwind']) {
                    game.player.weapons['power_whirlwind'] = { level: 1 };
                } else {
                    game.player.weapons['power_whirlwind'].level++;
                }
            },
        },
        {
            title: "Paralyze Strike",
            description: "Unlock paralyze strike, paralyzing enemies for 2 seconds after attacking.",
            weaponType: 'paralyze_strike',
            action: () => {
                if (!game.player.weapons['paralyze_strike']) {
                    game.player.weapons['paralyze_strike'] = { level: 1 };
                } else {
                    game.player.weapons['paralyze_strike'].level++;
                }
            },
        },
        {
            title: "Life Steal",
            description: "20% of damage dealt is converted to health recovery.",
            action: () => {
                if (!game.player.lifeSteal) game.player.lifeSteal = 0;
                game.player.lifeSteal += 0.2;
            },
        }
    ],
    mage: [
        {
            title: "Small Fireball",
            description: "Unlock small fireball, rapidly firing 2 tracking fireballs.",
            weaponType: 'small_fireball',
            action: () => {
                if (!game.player.weapons['small_fireball']) {
                    game.player.weapons['small_fireball'] = { level: 1 };
                } else {
                    game.player.weapons['small_fireball'].level++;
                }
            },
        },
        {
            title: "Big Fireball",
            description: "Unlock big fireball, firing trackable explosive fireballs.",
            weaponType: 'big_fireball',
            action: () => {
                if (!game.player.weapons['big_fireball']) {
                    game.player.weapons['big_fireball'] = { level: 1 };
                } else {
                    game.player.weapons['big_fireball'].level++;
                }
            },
        },
        {
            title: "Lightning Strike",
            description: "Unlock lightning strike, summoning lightning above enemies.",
            weaponType: 'lightning_strike',
            action: () => {
                if (!game.player.weapons['lightning_strike']) {
                    game.player.weapons['lightning_strike'] = { level: 1 };
                } else {
                    game.player.weapons['lightning_strike'].level++;
                }
            },
        },
        {
            title: "Wisdom",
            description: "All spell damage increased by 30%, mana consumption reduced.",
            action: () => {
                const mageWeapons = ['blizzard', 'small_fireball', 'big_fireball', 'lightning_strike'];
                mageWeapons.forEach(weaponType => {
                    const def = WEAPON_DEFINITIONS[weaponType];
                    if (def && def.damage) {
                        def.damage = def.damage.map(d => Math.round(d * 1.3));
                    }
                });
            },
        }
    ]
};

/**
 * Get upgrade options based on character type
 * @param {number} count - Number of options to select
 * @returns {Array<object>} Array of selected upgrade options
 */
function getRandomLevelUpOptions(count = 3) {
    const characterClass = game.player.characterClass;
    const characterUpgrades = CHARACTER_SPECIFIC_UPGRADES[characterClass] || [];
    
    // Filter available character-specific upgrades (weapons not owned or upgradeable skills)
    const availableCharacterUpgrades = characterUpgrades.filter(upgrade => {
        if (upgrade.weaponType) {
            // If it's a weapon upgrade, check if not owned or can be upgraded
            return !game.player.weapons[upgrade.weaponType] || 
                   game.player.weapons[upgrade.weaponType].level < 6;
        }
        return true; // Non-weapon upgrades are always available
    });
    
    // Convert available upgrades to correct display format
    const formattedCharacterUpgrades = availableCharacterUpgrades.map(upgrade => {
        if (upgrade.weaponType && game.player.weapons[upgrade.weaponType]) {
            // If weapon is already owned, display as upgrade option
            const currentLevel = game.player.weapons[upgrade.weaponType].level;
            const weaponDef = WEAPON_DEFINITIONS[upgrade.weaponType];
            return {
                title: `Upgrade ${weaponDef.name}`,
                description: `${weaponDef.name} level increased to ${currentLevel + 1}.`,
                action: upgrade.action
            };
        }
        return upgrade; // New weapons or non-weapon upgrades remain unchanged
    });
    
    let selectedOptions = [];
    
    // Strategy: prioritize 1-2 character-specific upgrades
    const characterUpgradeCount = Math.min(2, Math.floor(Math.random() * 2) + 1, formattedCharacterUpgrades.length);
    const shuffledCharacterUpgrades = formattedCharacterUpgrades.sort(() => 0.5 - Math.random());
    selectedOptions = selectedOptions.concat(shuffledCharacterUpgrades.slice(0, characterUpgradeCount));
    
    // Fill remaining slots with universal upgrades
    const remainingCount = count - selectedOptions.length;
    if (remainingCount > 0) {
        const shuffledUniversalUpgrades = UNIVERSAL_UPGRADES.sort(() => 0.5 - Math.random());
        selectedOptions = selectedOptions.concat(shuffledUniversalUpgrades.slice(0, remainingCount));
    }
    
    // Ensure enough options
    while (selectedOptions.length < count) {
        const allAvailable = [...formattedCharacterUpgrades, ...UNIVERSAL_UPGRADES];
        const remaining = allAvailable.filter(opt => !selectedOptions.includes(opt));
        if (remaining.length === 0) break;
        selectedOptions.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }
    
    return selectedOptions.slice(0, count);
}