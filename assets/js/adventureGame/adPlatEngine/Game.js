/**
 * CS Fighters - Game Engine
 * Main game logic and rendering
 */

class Game {
    constructor() {
        // Initialize canvas
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on window size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Camera (for larger arena)
        this.camera = {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height,
            following: null // Object to follow
        };
        
        // Game state
        this.currentState = CONFIG.STATES.MAIN_MENU;
        this.lastTime = 0;
        this.animationFrameId = null;
        this.statusMessage = document.getElementById('status-message');
        
        // Game objects
        this.player = null;
        this.targetDummy = null;
        this.selectedCharacterType = 'PYRO'; // Default character
        
        // Initialize input handler
        InputHandler.init(this);
        
        // Show main menu
        this.showMainMenu();
        
        // Make game instance globally accessible (for projectile manager)
        window.game = this;
        
        // Start game loop
        this.gameLoop(performance.now());
    }
    
    /**
     * Sets the game state and updates UI
     * @param {String} state - New game state
     */
    setGameState(state) {
        this.currentState = state;
        
        // Hide all screens
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('character-select').classList.add('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        
        // Show appropriate screen
        switch (state) {
            case CONFIG.STATES.MAIN_MENU:
                document.getElementById('main-menu').classList.remove('hidden');
                break;
            case CONFIG.STATES.CHARACTER_SELECT:
                document.getElementById('character-select').classList.remove('hidden');
                break;
            case CONFIG.STATES.PLAYING:
                document.getElementById('game-screen').classList.remove('hidden');
                break;
            case CONFIG.STATES.PAUSED:
                document.getElementById('game-screen').classList.remove('hidden');
                document.getElementById('pause-screen').classList.remove('hidden');
                break;
        }
    }
    
    /**
     * Shows main menu
     */
    showMainMenu() {
        this.setGameState(CONFIG.STATES.MAIN_MENU);
        
        // Clear any existing game objects
        this.player = null;
        this.targetDummy = null;
        ProjectileManager.clear();
    }
    
    /**
     * Starts the game with selected character
     * @param {String} characterType - Character type from CONFIG.CHARACTERS
     * @param {Boolean} isMultiplayer - Indicates if the game is multiplayer
     */
    startGame(characterType, isMultiplayer = false) {
        // Set state
        this.setGameState(CONFIG.STATES.PLAYING);
        this.statusMessage.textContent = 'Fight!';
        
        // Store selected character
        this.selectedCharacterType = characterType || 'PYRO';
        
        if (isMultiplayer) {
            // Create both players with different starting positions
            this.player1 = new Player(characterType, 1);
            this.player2 = new Player(characterType, 2);
            
            // Set player references to game
            this.player1.setGameReference(this);
            this.player2.setGameReference(this);
            
            // Set initial positions
            this.player1.x = CONFIG.PLAYER.START_X;
            this.player1.y = CONFIG.ENVIRONMENT.FLOOR_Y - this.player1.height;
            
            this.player2.x = CONFIG.CANVAS.WIDTH - CONFIG.PLAYER.START_X - CONFIG.PLAYER.WIDTH;
            this.player2.y = CONFIG.ENVIRONMENT.FLOOR_Y - this.player2.height;
            
            // Set camera to follow both players
            this.camera.following = [this.player1, this.player2];
            
            // Set player names in UI
            document.getElementById('player1-name').textContent = this.player1.name;
            document.getElementById('player2-name').textContent = this.player2.name;
            
            // Reset health bars
            document.getElementById('player1-health').style.width = '100%';
            document.getElementById('player2-health').style.width = '100%';
        } else {
            // Single player mode with target dummy
            this.player1 = new Player(characterType, 1);
            this.targetDummy = new TargetDummy();
            
            // Set player references to game
            this.player1.setGameReference(this);
            this.targetDummy.setGameReference(this);
            
            // Set initial positions
            this.player1.x = CONFIG.PLAYER.START_X;
            this.player1.y = CONFIG.ENVIRONMENT.FLOOR_Y - this.player1.height;
            
            this.targetDummy.x = CONFIG.TARGET_DUMMY.X;
            this.targetDummy.y = CONFIG.ENVIRONMENT.FLOOR_Y - this.targetDummy.height;
            
            // Set camera to follow player
            this.camera.following = [this.player1];
            
            // Set player name in UI
            document.getElementById('player1-name').textContent = this.player1.name;
            document.getElementById('player2-name').textContent = 'Target Dummy';
            
            // Reset health bars
            document.getElementById('player1-health').style.width = '100%';
            document.getElementById('player2-health').style.width = '100%';
        }
        
        // Clear input state and projectiles
        InputHandler.clearAll();
        ProjectileManager.clear();
    }
    
    /**
     * Pauses the game
     */
    pauseGame() {
        if (this.currentState === CONFIG.STATES.PLAYING) {
            this.setGameState(CONFIG.STATES.PAUSED);
        }
    }
    
    /**
     * Resumes the game
     */
    resumeGame() {
        if (this.currentState === CONFIG.STATES.PAUSED) {
            this.setGameState(CONFIG.STATES.PLAYING);
            this.lastTime = performance.now();
        }
    }
    
    /**
     * Exits game and returns to main menu
     */
    exitToMenu() {
        this.showMainMenu();
    }
    
    /**
     * Update camera position to follow target
     */
    updateCamera() {
        if (!this.camera.following || !this.camera.following[0] || !this.camera.following[1]) return;
        
        // Calculate center point between both players
        const centerX = (this.camera.following[0].x + this.camera.following[1].x) / 2;
        const centerY = (this.camera.following[0].y + this.camera.following[1].y) / 2;
        
        // Calculate camera position
        const cameraX = centerX - (this.canvas.width / 2);
        const cameraY = centerY - (this.canvas.height / 2);
        
        // Keep camera within bounds
        this.camera.x = Utils.clamp(
            cameraX,
            0,
            Math.max(0, CONFIG.CANVAS.WIDTH - this.canvas.width)
        );
        
        this.camera.y = Utils.clamp(
            cameraY,
            0,
            Math.max(0, CONFIG.CANVAS.HEIGHT - this.canvas.height)
        );
    }
    
    /**
     * Main game loop
     * @param {Number} timestamp - Current time
     */
    gameLoop(timestamp) {
        // Calculate delta time (time since last frame)
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(58, 58, 58, 1.0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Handle game states
        switch (this.currentState) {
            case CONFIG.STATES.PLAYING:
                this.updateGame(deltaTime);
                this.updateCamera();
                this.drawGame(); // Draw everything with proper camera transformation
                break;
                
            case CONFIG.STATES.PAUSED:
                this.drawGame(); // Draw current state without updating
                break;
                
            case CONFIG.STATES.MAIN_MENU:
            case CONFIG.STATES.CHARACTER_SELECT:
                // These screens are handled by HTML/CSS
                break;
        }
        
        // Continue the loop
        this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * Updates game state
     * @param {Number} deltaTime - Time since last frame
     */
    updateGame(deltaTime) {
        if (this.currentState !== CONFIG.STATES.PLAYING || !this.player1) return;
        
        // Handle player input
        this.handlePlayerInput();
        
        // Update game objects
        this.player1.update();
        
    }
    
    /**
     * Handle player input from keyboard
     */
    handlePlayerInput() {
        if (!this.player1 || !this.player2) return;
        
        // Movement
        if (InputHandler.keys.up) {
            this.player1.jump();
        }
        
        if (InputHandler.keys.left) {
            this.player1.moveLeft();
        } else if (InputHandler.keys.right) {
            this.player1.moveRight();
        } else {
            this.player1.stopMoving();
        }
    }
    
    /**
     * Draws game objects
     */
    drawGame() {
        // Save the canvas state
        this.ctx.save();
        
        // Apply camera transform
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Draw floor
        this.ctx.fillStyle = 'rgba(85, 85, 85, 1.0)';
        this.ctx.fillRect(0, CONFIG.ENVIRONMENT.FLOOR_Y, CONFIG.CANVAS.WIDTH, CONFIG.CANVAS.HEIGHT - CONFIG.ENVIRONMENT.FLOOR_Y);
        
        // Check if pits exist and draw them
        if (CONFIG.ENVIRONMENT.PITS && Array.isArray(CONFIG.ENVIRONMENT.PITS)) {
            // Draw pits (erase parts of the floor)
            this.ctx.globalCompositeOperation = 'destination-out';
            for (const pit of CONFIG.ENVIRONMENT.PITS) {
                this.ctx.fillRect(pit.x, pit.y, pit.width, pit.height);
            }
            this.ctx.globalCompositeOperation = 'source-over';
        }
        
        // Draw platforms
        this.ctx.fillStyle = 'rgba(119, 119, 119, 1.0)';
        for (const platform of CONFIG.ENVIRONMENT.PLATFORMS) {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
        
        // Draw walls if they exist
        if (CONFIG.ENVIRONMENT.WALLS && Array.isArray(CONFIG.ENVIRONMENT.WALLS)) {
            this.ctx.fillStyle = 'rgba(60, 60, 60, 1.0)';
            for (const wall of CONFIG.ENVIRONMENT.WALLS) {
                this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
            }
        }
        
        // Draw game objects
        if (this.player1) this.player1.draw(this.ctx);
        
        // Restore the canvas state
        this.ctx.restore();
    }
}