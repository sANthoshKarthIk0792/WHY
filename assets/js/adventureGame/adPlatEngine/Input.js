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
        attack: false,
        basicSkill: false,
        specialSkill: false,
        ultimateSkill: false,
        
        // Player 2 controls (Arrow keys)
        up2: false,
        down2: false,
        left2: false,
        right2: false,
        attack2: false,
        basicSkill2: false,
        specialSkill2: false,
        ultimateSkill2: false,
        
        // Player 2 skill keys (, . /)
        basicSkillKey2: false,
        specialSkillKey2: false,
        ultimateSkillKey2: false
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
            if (['w', 'a', 's', 'd', ' ', 'q', 'e', 'r', 'p', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ',', '.', '/'].includes(e.key)) {
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
        // Main menu buttons
        document.getElementById('singleplayer-btn').addEventListener('click', () => {
            this.game.setGameState(CONFIG.STATES.CHARACTER_SELECT);
            this.game.isMultiplayer = false;
        });
        
        document.getElementById('multiplayer-btn').addEventListener('click', () => {
            this.game.setGameState(CONFIG.STATES.CHARACTER_SELECT);
            this.game.isMultiplayer = true;
        });
        
        document.getElementById('settings-btn').addEventListener('click', () => {
            // Toggle debug mode for now
            CONFIG.GAME.DEBUG_MODE = !CONFIG.GAME.DEBUG_MODE;
            alert('Debug mode: ' + (CONFIG.GAME.DEBUG_MODE ? 'Enabled' : 'Disabled'));
        });
        
        // Character select buttons
        document.getElementById('start-game-btn').addEventListener('click', () => {
            const selectedCard = document.querySelector('.character-card.selected');
            if (selectedCard) {
                const characterType = selectedCard.dataset.character.toUpperCase();
                this.game.startGame(characterType, this.game.isMultiplayer);
            } else {
                alert('Please select a character');
            }
        });
        
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            this.game.setGameState(CONFIG.STATES.MAIN_MENU);
        });
        
        // Character cards
        const characterCards = document.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                characterCards.forEach(c => c.classList.remove('selected'));
                // Add selected class to clicked card
                card.classList.add('selected');
            });
        });
        
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
                
                // Player 2 controls (Arrow keys)
                case 'ArrowUp':
                    this.keys.up2 = true;
                    break;
                case 'ArrowDown':
                    this.keys.down2 = true;
                    break;
                case 'ArrowLeft':
                    this.keys.left2 = true;
                    break;
                case 'ArrowRight':
                    this.keys.right2 = true;
                    break;
                
                // Shared controls (Space for attack)
                case 't':
                    this.keys.attack = true;
                    break;
                case 'm':
                    this.keys.attack2 = true;
                    break;
                
                // Player 1 skill keys (Q/E/R)
                case 'q':
                    this.keys.basicSkill = true;
                    break;
                case 'e':
                    this.keys.specialSkill = true;
                    break;
                case 'r':
                    this.keys.ultimateSkill = true;
                    break;
                
                // Player 2 skill keys (, . /)
                case ',':
                    this.keys.basicSkill2 = true;
                    this.keys.basicSkillKey2 = true;
                    break;
                case '.':
                    this.keys.specialSkill2 = true;
                    this.keys.specialSkillKey2 = true;
                    break;
                case '/':
                    this.keys.ultimateSkill2 = true;
                    this.keys.ultimateSkillKey2 = true;
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
            
            // Player 2 controls (Arrow keys)
            case 'ArrowUp':
                this.keys.up2 = false;
                break;
            case 'ArrowDown':
                this.keys.down2 = false;
                break;
            case 'ArrowLeft':
                this.keys.left2 = false;
                break;
            case 'ArrowRight':
                this.keys.right2 = false;
                break;
            
            // Shared controls (Space for attack)
            case 't':
                this.keys.attack = false;
                break;
            case 'm':
                this.keys.attack2 = false;
                break;
            
            // Player 1 skill keys (Q/E/R)
            case 'q':
                this.keys.basicSkill = false;
                break;
            case 'e':
                this.keys.specialSkill = false;
                break;
            case 'r':
                this.keys.ultimateSkill = false;
                break;
            
            // Player 2 skill keys (, . /)
            case ',':
                this.keys.basicSkill2 = false;
                this.keys.basicSkillKey2 = false;
                break;
            case '.':
                this.keys.specialSkill2 = false;
                this.keys.specialSkillKey2 = false;
                break;
            case '/':
                this.keys.ultimateSkill2 = false;
                this.keys.ultimateSkillKey2 = false;
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
        this.keys.attack = false;
        this.keys.basicSkill = false;
        this.keys.specialSkill = false;
        this.keys.ultimateSkill = false;
    }
};