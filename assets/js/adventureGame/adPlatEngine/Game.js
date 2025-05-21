/**
 * Platformer Game Engine
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
    
        // Game state
        this.currentState = CONFIG.STATES.PLAYING;
        this.lastTime = 0;
        
        // Game objects
        this.player = null;
        //room for enemies here
        
        // Initialize input handler
        InputHandler.init(this);
        // Make game instance globally accessible
        window.game = this;
        
        // Start game loop
        this.gameLoop(performance.now());
    }
    
    /**
     * Sets the game state and updates UI
     * @param {String} state - New game state
     * 
     */
    setGameState(state) {
        this.currentState = state;
    
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        
        // Show appropriate screen
        switch (state) {
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
        //replace this comment with somethign to return the player to gamelevelend or wheverer they enter the game from
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
                this.drawGame(); // Draw everything with proper camera transformation
                break;
                
            case CONFIG.STATES.PAUSED:
                this.drawGame(); // Draw current state without updating
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