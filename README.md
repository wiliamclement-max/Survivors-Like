# Survivors-Like - Vampire Survivors Style Game

A browser-based survival game inspired by Vampire Survivors, built with vanilla JavaScript, HTML5 Canvas, and CSS.

## Features

- **Multiple Character Classes**: Warrior, Archer, and Mage with unique abilities
- **Weapon System**: Various weapons including ranged, melee, area effects, and summons
- **Upgrade System**: Level up and choose from character-specific and universal upgrades
- **Enemy AI**: Smart enemy spawning and behavior
- **Visual Effects**: Particles, explosions, and special attack animations
- **Responsive Design**: Scales to different screen sizes

## Character Classes

### Warrior
- **Initial Weapon**: Whirlwind (360° melee attack)
- **Special Abilities**: Berserker Whirlwind, Power Whirlwind, Paralyze Strike
- **Playstyle**: Close combat with high damage and life steal

### Archer
- **Initial Weapon**: Basic Shot
- **Special Abilities**: Spread Shot, Crossbow, Double Shot
- **Playstyle**: Ranged combat with piercing and multi-shot capabilities

### Mage
- **Initial Weapon**: Blizzard (area damage over time)
- **Special Abilities**: Lightning Strike, Small Fireball, Big Fireball
- **Playstyle**: Area effects and magical attacks

## Weapon Types

- **Ranged**: Bullets with various properties (tracking, piercing, explosive)
- **Melee**: Close-range attacks with different patterns
- **Area Effects**: Persistent damage zones (blizzard, poison, black hole)
- **Summons**: AI companions that fight alongside the player

## How to Play

1. Open `index.html` in a web browser
2. Select your character class
3. Use WASD or arrow keys to move
4. Weapons fire automatically
5. Collect experience orbs to level up
6. Choose upgrades to become stronger
7. Survive as long as possible!

## Project Structure

```
survivors-like/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Game styling
├── js/
│   ├── main.js            # Entry point and game initialization
│   ├── config.js          # Game configuration and constants
│   ├── data.js            # Weapon definitions and upgrade options
│   ├── utils.js           # Utility functions
│   ├── effects.js         # Visual effects system
│   ├── game-core.js       # Core game loop and state management
│   ├── game-state.js      # Game state and UI management
│   ├── level-system.js    # Level up and upgrade system
│   ├── score-system.js    # High score management
│   ├── player.js          # Player logic and controls
│   ├── enemies.js         # Enemy AI and spawning
│   ├── attacks.js         # Weapon and attack systems
│   ├── items.js           # Item drops and collection
│   ├── updates.js         # Game object update logic
│   ├── collisions.js      # Collision detection
│   └── render.js          # Rendering and graphics
└── CODE_STRUCTURE.md      # Detailed code architecture
```

## Development

The game is built with a modular architecture:

- **Core Layer**: Configuration and data definitions
- **Utility Layer**: Helper functions and effects
- **Game Systems**: Player, enemies, weapons, items
- **State Management**: Game state, levels, scoring
- **Rendering**: Canvas-based graphics and UI

## Recent Updates

- Fixed area effect weapons (blizzard, lightning) not disappearing
- Improved melee attack lifecycle management
- Enhanced visual effects and particle systems
- Optimized collision detection
- Added comprehensive debugging system

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

Requires HTML5 Canvas support.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to submit issues and pull requests to improve the game!

## Acknowledgments

- Inspired by Vampire Survivors
- Built with vanilla JavaScript for educational purposes
- Developed with assistance from Claude AI 