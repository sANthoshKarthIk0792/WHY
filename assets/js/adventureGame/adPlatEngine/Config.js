/**
 * End Ship Platformer Game Configuration
 * Contains all game constants and settings
 */

// Platform configurations
const PLATFORM_CONFIGS = {
    END: [
        { x: 0, y: 800, width: 400, height: 20 }, // End ship platforms
        { x: 1520, y: 800, width: 400, height: 20 },
        { x: 600, y: 650, width: 300, height: 20 },
        { x: 1020, y: 650, width: 300, height: 20 },
        { x: 860, y: 500, width: 200, height: 20 },
    ]
};

// Track current platform configuration
let currentPlatformConfig = 'END';

// Function to set the current platform configuration
function setPlatformConfig(configName) {
    if (PLATFORM_CONFIGS[configName]) {
        currentPlatformConfig = configName;
        // Update the CONFIG object with the new platform configuration
        CONFIG.ENVIRONMENT.PLATFORMS = PLATFORM_CONFIGS[currentPlatformConfig];
        return true;
    }
    return false;
}

// Function to get the current platform configuration
function getCurrentPlatformConfig() {
    return currentPlatformConfig;
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
    
    // Player settings
    PLAYER: {
        START_X: 200,
        START_Y: 700, // Adjusted to be above the platform
        WIDTH: 50,
        HEIGHT: 80,
        SPEED: 8,
        JUMP_FORCE: 20,
        MAX_HEALTH: 100,
        PROJECTILE_COOLDOWN: 500, // ms
        COLOR: "#9b30ff" // Purple for End theme
    },
    
    // Environment settings
    ENVIRONMENT: {
        FLOOR_Y: 980,
        PLATFORMS: PLATFORM_CONFIGS.END, 
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
    
    // Game states
    STATES: {
        PLAYING: "playing",
        PAUSED: "paused",
        GAME_OVER: "game_over"
    }
};

// Export for use in other files
window.CONFIG = CONFIG;
window.PLATFORM_CONFIGS = PLATFORM_CONFIGS;
window.setPlatformConfig = setPlatformConfig;
window.getCurrentPlatformConfig = getCurrentPlatformConfig;