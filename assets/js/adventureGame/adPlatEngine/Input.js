/**
 * CS Fighters - Input Handler
 * Manages keyboard input and UI interactions
 */

const InputHandler = {
    // State of keys for both players
    keys: {
        // Player 1 (WASD)
        up: false,
        down: false,
        left: false,
        right: false,
    },
    
    /**
     * Initialize input handling
     * @param {Game} game - Game instance
     */
    init: function(game) {
        this.game = game;
        
        // Key down event
        window.addEventListener('keydown', (e) => {
            // Prevent default behavior for game keys
            if (['w', 'a', 's', 'd', ' ', 'q', 'e', 'r', 'p', 'Escape'].includes(e.key)) {
                e.preventDefault();
            }
            
            this.handleKeyDown(e.key);
        });
        
        // Key up event
        window.addEventListener('keyup', (e) => {
            this.handleKeyUp(e.key);
        });
        
        // Set up UI button event listeners
        this.setupUIButtons();
    },
    
    /**
     * Setup all UI button event listeners
     */
    setupUIButtons: function() {
        // Game screen buttons
        document.getElementById('pause-btn').addEventListener('click', () => {
            if (this.game.currentState === CONFIG.STATES.PLAYING) {
                this.game.pauseGame();
            }
        });
        
        // Pause screen buttons
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.game.resumeGame();
        });
        
        document.getElementById('exit-to-menu-btn').addEventListener('click', () => {
            this.game.exitToMenu();
        });
    },
    
    /**
     * Handle key down events
     * @param {String} key - Key pressed
     */
    handleKeyDown: function(key) {
        // Only process keys if game is in playing state
        if (this.game.currentState === CONFIG.STATES.PLAYING) {
            switch (key) {
                // Player 1 controls (WASD)
                case 'w':
                    this.keys.up = true;
                    break;
                case 's':
                    this.keys.down = true;
                    break;
                case 'a':
                    this.keys.left = true;
                    break;
                case 'd':
                    this.keys.right = true;
                    break;
                
                case 'p':
                    if (this.game.currentState === CONFIG.STATES.PLAYING) {
                        this.game.pauseGame();
                    }
                    break;
                case 'Escape':
                    if (this.game.currentState === CONFIG.STATES.PLAYING) {
                        this.game.pauseGame();
                    }
                    break;
            }
        }
    },
    
    /**
     * Handle key up events
     * @param {String} key - Key released
     */
    handleKeyUp: function(key) {
        switch (key) {
            // Player 1 controls (WASD)
            case 'w':
                this.keys.up = false;
                break;
            case 's':
                this.keys.down = false;
                break;
            case 'a':
                this.keys.left = false;
                break;
            case 'd':
                this.keys.right = false;
                break;
        }
    },
    
    /**
     * Clears all input states
     */
    clearAll: function() {
        this.keys.up = false;
        this.keys.down = false;
        this.keys.left = false;
        this.keys.right = false;
    }
};