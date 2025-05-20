/**
 * CS Fighters - Game Configuration
 * Contains all game constants and settings
 */

// Platform configurations
const PLATFORM_CONFIGS = {
    CLASSIC: [
        { x: 0, y: 800, width: 400, height: 20 },
        { x: 1520, y: 800, width: 400, height: 20 },
        { x: 600, y: 650, width: 300, height: 20 },
        { x: 1020, y: 650, width: 300, height: 20 },
        { x: 860, y: 500, width: 200, height: 20 },
    ],
    
    STAIRCASE: [
        { x: 0, y: 850, width: 350, height: 20 },
        { x: 1570, y: 850, width: 350, height: 20 },
        { x: 400, y: 700, width: 300, height: 20 },
        { x: 1220, y: 700, width: 300, height: 20 },
        { x: 650, y: 550, width: 250, height: 20 },
        { x: 1020, y: 550, width: 250, height: 20 },
        { x: 810, y: 400, width: 300, height: 20 },
    ],
    
    TRIANGLE: [
        { x: 200, y: 800, width: 400, height: 20 },
        { x: 1320, y: 800, width: 400, height: 20 },
        { x: 500, y: 650, width: 300, height: 20 },
        { x: 1120, y: 650, width: 300, height: 20 },
        { x: 760, y: 500, width: 400, height: 20 },
    ],
    
    // MODIFIED: Large open middle with single wide platform
    ARENA: [
        // Edge platforms
        { x: 0, y: 750, width: 350, height: 20 },
        { x: 1570, y: 750, width: 350, height: 20 },
        
        // Single massive central platform
        { x: 460, y: 600, width: 1000, height: 30 },  // Extra thick for emphasis
        
        // High corner platforms
        { x: 100, y: 400, width: 200, height: 20 },
        { x: 1620, y: 400, width: 200, height: 20 },
    ],
    
    COMPETITIVE: [
        { x: 100, y: 800, width: 350, height: 20 },
        { x: 1470, y: 800, width: 350, height: 20 },
        { x: 450, y: 650, width: 300, height: 20 },
        { x: 1170, y: 650, width: 300, height: 20 },
        { x: 300, y: 500, width: 200, height: 20 },
        { x: 1420, y: 500, width: 200, height: 20 },
        { x: 810, y: 550, width: 300, height: 20 },
    ],
    
    // MODIFIED: Open center battlefield with single bridge
    SIMPLE: [
        // Far edge platforms
        { x: 0, y: 800, width: 300, height: 20 },
        { x: 1620, y: 800, width: 300, height: 20 },
        
        // Single wide central bridge
        { x: 360, y: 650, width: 1200, height: 25 },  // Very wide central platform
        
        // Small high platforms at edges
        { x: 200, y: 450, width: 150, height: 20 },
        { x: 1570, y: 450, width: 150, height: 20 },
    ],
    
    TOURNAMENT: [
        { x: 150, y: 750, width: 400, height: 20 },
        { x: 1370, y: 750, width: 400, height: 20 },
        { x: 550, y: 600, width: 200, height: 20 },
        { x: 1170, y: 600, width: 200, height: 20 },
        { x: 760, y: 450, width: 400, height: 20 },
        { x: 450, y: 300, width: 150, height: 20 },
        { x: 1320, y: 300, width: 150, height: 20 },
    ]
};


// Function to get random platform configuration
function getRandomPlatformConfig() {
    const configNames = Object.keys(PLATFORM_CONFIGS);
    const randomIndex = Math.floor(Math.random() * configNames.length);
    const selectedConfig = configNames[randomIndex];
    
    console.log(`Selected platform configuration: ${selectedConfig}`);
    return PLATFORM_CONFIGS[selectedConfig];
}

const CONFIG = {
    // Canvas settings
    CANVAS: {
        WIDTH: 1920,
        HEIGHT: 1080
    },
    
    // Game settings
    GAME: {
        FPS: 60,
        GRAVITY: 0.8,
        DEBUG_MODE: false
    },
    
    // Player settings (base values, will be modified by character choice)
    PLAYER: {
        START_X: 200,
        START_Y: 800,
        WIDTH: 50,
        HEIGHT: 80,
        SPEED: 8,
        JUMP_FORCE: 20,
        MAX_HEALTH: 100,
        PROJECTILE_COOLDOWN: 500 // ms
    },
    
    // Projectile settings (base values, will be modified by character choice)
    PROJECTILE: {
        WIDTH: 30,
        HEIGHT: 10,
        SPEED: 10,
        DAMAGE: 10,
        LIFETIME: 3000 // ms
    },
    
    // Target dummy settings
    TARGET_DUMMY: {
        X: 1600,
        Y: 800,
        WIDTH: 80,
        HEIGHT: 150,
        MAX_HEALTH: 1000,
        REGEN_RATE: 5 // health per second
    },
    
    // Environment settings
    ENVIRONMENT: {
        FLOOR_Y: 980,
        PLATFORMS: getRandomPlatformConfig(), // Randomly selected platforms
        FLOOR_ACTIVE: true,
        PITS: [], // Can add pit locations here
        WALLS: [], // Can add wall locations here
        WORLD_BOUNDS: {
            LEFT: 0,
            RIGHT: 1920,
            TOP: 0,
            BOTTOM: 1080
        }
    },
    
    // Character types
    CHARACTERS: {
        MORT: {
            NAME: "Mort",
            COLOR: "rgba(153, 0, 204, 1.0)",
            PROJECTILE_COLOR: "rgba(204, 0, 255, 1.0)",
            PROJECTILE_SIZE: { width: 16, height: 8 },
            PROJECTILE_SPEED: 30,
            PROJECTILE_DAMAGE: 10,
            PROJECTILE_COOLDOWN: 70,
            PROJECTILE_SPREAD: 5,
            PROJECTILE_COUNT: 1,
            HEALTH_MODIFIER: 1.0,
            SPEED_MODIFIER: 1.0,
            DESCRIPTION: "U alr know..."
        },
        ZHENGLORANT: {
            NAME: "ZhengLorant",
            COLOR: "rgba(255, 51, 0, 1.0)",
            PROJECTILE_COLOR: "rgba(255, 102, 0, 1.0)",
            PROJECTILE_SIZE: { width: 30, height: 15 },
            PROJECTILE_SPEED: 40,
            PROJECTILE_DAMAGE: 80,
            PROJECTILE_COOLDOWN: 1200,
            PROJECTILE_SPREAD: 0,
            PROJECTILE_COUNT: 1,
            HEALTH_MODIFIER: 1.1, 
            SPEED_MODIFIER: 1.1,
            DESCRIPTION: "Chamber Valorant"
        },
        NAMIRA: {
            NAME: "Namira",
            COLOR: "rgba(51, 204, 255, 1.0)",
            PROJECTILE_COLOR: "rgba(102, 255, 255, 1.0)",
            PROJECTILE_SIZE: { width: 20, height: 10 },
            PROJECTILE_SPEED: 15,
            PROJECTILE_DAMAGE: 9,
            PROJECTILE_COOLDOWN: 400,
            PROJECTILE_SPREAD: 10,
            PROJECTILE_COUNT: 3,
            HEALTH_MODIFIER: 0.8,
            SPEED_MODIFIER: 1.15,
            DESCRIPTION: "ZONER ZONER ZONER"
        },
        NIGILEKBAM: {
            NAME: "Nigil Ekbam",
            COLOR: "rgba(0, 153, 51, 1.0)",
            PROJECTILE_COLOR: "rgba(0, 204, 102, 1.0)",
            PROJECTILE_SIZE: { width: 5, height: 5 },
            PROJECTILE_SPEED: 15,
            PROJECTILE_DAMAGE: 4,
            PROJECTILE_COOLDOWN: 700,
            PROJECTILE_SPREAD: 25,
            PROJECTILE_COUNT: 8,
            HEALTH_MODIFIER: 1.2,
            SPEED_MODIFIER: 0.9,
            DESCRIPTION: "Slacker with some serious power"
        }, 
        EAST: {
            NAME: "East Shetanfi",
            COLOR: "rgba(0, 255, 100, 1.0)",
            PROJECTILE_COLOR: "rgba(0, 255, 170, 1.0)",
            PROJECTILE_SIZE: { width: 12, height: 12 },
            PROJECTILE_SPEED: 20,
            PROJECTILE_DAMAGE: 12,
            PROJECTILE_COOLDOWN: 600,
            PROJECTILE_SPREAD: 0,
            PROJECTILE_COUNT: 2,
            HEALTH_MODIFIER: 0.75,
            SPEED_MODIFIER: 1.1,
            DESCRIPTION: "JS GOD, easily distracted by new things to tinker with"
        },
        RUFAT: {
            NAME: "Rufat Banshee",
            COLOR: "rgba(0, 255, 100, 1.0)",
            PROJECTILE_COLOR: "rgba(0, 255, 170, 1.0)",
            PROJECTILE_SIZE: { width: 12, height: 12 },
            PROJECTILE_SPEED: 20,
            PROJECTILE_DAMAGE: 12,
            PROJECTILE_COOLDOWN: 600,
            PROJECTILE_SPREAD: 0,
            PROJECTILE_COUNT: 0,
            HEALTH_MODIFIER: 1.2,
            SPEED_MODIFIER: 1.1,
            DESCRIPTION: "Fat person who takes all the credit for your work and does not know how to code."
        },
        CYBERPATRIOTVET: {
            NAME: "CyberPatriot Vet",
            COLOR: "rgba(0, 0, 0, 1.0)",
            PROJECTILE_COLOR: "rgba(186, 85, 211, 1.0)",
            PROJECTILE_SIZE: { width: 12, height: 8 },
            PROJECTILE_SPEED: 25,
            PROJECTILE_DAMAGE: 20,
            PROJECTILE_COOLDOWN: 650,
            PROJECTILE_SPREAD: 0,
            PROJECTILE_COUNT: 3,
            HEALTH_MODIFIER: 0.9,
            SPEED_MODIFIER: 1.0,
            DESCRIPTION: "Retired CyberPatriot finalist turned artist, master of chaos"
        },
        RACHGPT: {
            NAME: "RachGPT",
            COLOR: "rgba(220, 20, 60, 1.0)",     // Crimson red for melee fighter
            PROJECTILE_COLOR: "rgba(255, 69, 0, 1.0)", // Orange-red for projectiles
            PROJECTILE_SIZE: { width: 18, height: 12 },
            PROJECTILE_SPEED: 30,               // Very fast for shotgun-style attack
            PROJECTILE_DAMAGE: 4,               // Low damage per pellet
            PROJECTILE_COOLDOWN: 180,           // Very fast fire rate for sword-like feel
            PROJECTILE_SPREAD: 60,              // Wide spread for shotgun effect
            PROJECTILE_COUNT: 15,               // Many pellets for wide coverage
            HEALTH_MODIFIER: 1.0,               // avg hp
            SPEED_MODIFIER: 1.2,                // fast melee man
            DESCRIPTION: "Mort's apprentice, his blade challenges both himself and those who dare oppose him"
        }
    },
    
    // Skill settings
    SKILLS: {
        BASIC_COOLDOWN: 6000,    // ms
        SPECIAL_COOLDOWN: 11000, // ms
        ULTIMATE_COOLDOWN: 20000 // ms
    },
    
    // Status effects configuration
    STATUS_EFFECTS: {
        SLOW: {
            MOVEMENT_MODIFIER: 0.4,
            DURATION: 2000 // ms
        },
        MALWARE: {
            DAMAGE_PER_TICK: 0.5,
            TICK_INTERVAL: 50,
            DURATION: 2500,
            EXTENDED_DURATION: 7500
        }
    },
    
    // Game states
    STATES: {
        MAIN_MENU: "main_menu",
        CHARACTER_SELECT: "character_select",
        PLAYING: "playing",
        PAUSED: "paused",
        GAME_OVER: "game_over"
    }
};

// Utility functions for platform management
function setPlatformConfig(configName) {
    if (PLATFORM_CONFIGS[configName]) {
        CONFIG.ENVIRONMENT.PLATFORMS = PLATFORM_CONFIGS[configName];
        console.log(`Platform configuration set to: ${configName}`);
    } else {
        console.error(`Platform configuration "${configName}" not found`);
    }
}

function getCurrentPlatformConfig() {
    const currentPlatforms = CONFIG.ENVIRONMENT.PLATFORMS;
    
    for (const [name, config] of Object.entries(PLATFORM_CONFIGS)) {
        if (JSON.stringify(config) === JSON.stringify(currentPlatforms)) {
            return name;
        }
    }
    return "CUSTOM";
}

// Export for use in other files
window.PLATFORM_CONFIGS = PLATFORM_CONFIGS;
window.setPlatformConfig = setPlatformConfig;
window.getCurrentPlatformConfig = getCurrentPlatformConfig;