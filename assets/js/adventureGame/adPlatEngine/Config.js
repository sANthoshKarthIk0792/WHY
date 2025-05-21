/**
 * End Ship Platformer Game Configuration
 * Contains all game constants and settings
 */

// Platform configurations
const PLATFORM_CONFIGS = {
    END: [
        { x: 0, y: 800, width: 400, height: 20 }, //modify this to match up with whatever end ship sprite we end up using (or vice versa idgaf)
        { x: 1520, y: 800, width: 400, height: 20 },
        { x: 600, y: 650, width: 300, height: 20 },
        { x: 1020, y: 650, width: 300, height: 20 },
        { x: 860, y: 500, width: 200, height: 20 },
    ]
};

let currentPlatformConfig = 'END';

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
window.PLATFORM_CONFIGS = PLATFORM_CONFIGS;
// window.setPlatformConfig = setPlatformConfig;
// window.getCurrentPlatformConfig = getCurrentPlatformConfig;