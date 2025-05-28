# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-19

### Added
- Initial release of Survivors-Like
- Three character classes: Warrior, Archer, and Mage
- Multiple weapon types: ranged, melee, area effects, and summons
- Character-specific and universal upgrade system
- Enemy AI with different types and behaviors
- Wave-based progression system
- High score tracking
- Responsive design for different screen sizes
- Particle effects and visual enhancements
- Pause functionality
- Fullscreen support

### Features
- **Character Classes**:
  - Warrior: Melee specialist with high defense and health
  - Archer: Ranged fighter with high attack speed and mobility
  - Mage: Magic user with powerful area attack abilities

- **Weapon System**:
  - Ranged weapons: Basic Shot, Spread Shot, Piercing Shot, Homing Missile
  - Melee weapons: Whirlwind, Moon Slash, Thrust
  - Area effects: Blizzard, Toxic Cloud, Black Hole, Lightning Strike
  - Summons: Fairy, Guardian Shield, Seeking Bee, Phantom Warrior

- **Character-Specific Abilities**:
  - Warrior: Berserker Whirlwind, Power Whirlwind, Paralyze Strike, Life Steal
  - Archer: Crossbow, Double Shot, Archery Mastery
  - Mage: Small Fireball, Big Fireball, Wisdom

- **Game Systems**:
  - Experience and leveling system
  - Item drops and collection
  - Enemy spawning and AI
  - Collision detection
  - Visual effects and particles
  - High score persistence

### Technical
- Built with vanilla JavaScript, HTML5 Canvas, and CSS
- Modular architecture with separated concerns
- Responsive design supporting various screen sizes
- Modern UI with CSS animations and effects
- Local storage for high scores

### Fixed
- Menu overlap bug when restarting game
- Area effect weapons (blizzard, lightning) not disappearing properly
- Melee attack lifecycle management issues
- Distance function naming inconsistencies
- Rendering transparency calculations

### Code Structure
- Refactored from single file to modular architecture
- Separated core systems into dedicated modules
- Improved maintainability and extensibility
- Added comprehensive documentation
- Implemented proper error handling and debugging 