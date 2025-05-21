/**
 * End Ship Platformer - UI Management
 * Handles UI updates and interactions
 */

const UI = {
    /**
     * Initialize UI
     */
    init: function() {
        // Add resize handler
        window.addEventListener('resize', this.adjustForScreenSize);
        this.adjustForScreenSize();
    },
    
    /**
     * Adjust UI elements based on screen size
     */
    adjustForScreenSize: function() {
        const gameContainer = document.querySelector('.game-container');
        
        // Adjust game container width
        if (gameContainer) {
            const maxWidth = Math.min(window.innerWidth * 0.95, CONFIG.CANVAS.WIDTH);
            gameContainer.style.width = `${maxWidth}px`;
        }
    },
    
    /**
     * Show a message in the status bar
     * @param {String} message - Message to display
     * @param {Number} duration - How long to show message (ms)
     */
    showMessage: function(message, duration = 2000) {
        const statusElement = document.getElementById('status-message');
        if (statusElement) {
            // Store original message
            const originalMessage = statusElement.textContent;
            
            // Set new message
            statusElement.textContent = message;
            
            // Reset after duration
            if (duration > 0) {
                setTimeout(() => {
                    statusElement.textContent = originalMessage;
                }, duration);
            }
        }
    },
    
    /**
     * Update health bars
     * @param {Character} player - Player character
     */
    updateHealthBars: function(player) {
        if (player) {
            const playerHealthBar = document.getElementById('player1-health');
            if (playerHealthBar) {
                const healthPercentage = (player.health / player.maxHealth) * 100;
                playerHealthBar.style.width = `${healthPercentage}%`;
                
                // Change color based on health - using End theme colors
                if (healthPercentage < 25) {
                    playerHealthBar.style.backgroundColor = '#df72ff'; // Light pink-purple
                } else if (healthPercentage < 50) {
                    playerHealthBar.style.backgroundColor = '#b342ff'; // Medium purple
                } else {
                    playerHealthBar.style.backgroundColor = '#9b30ff'; // Bright purple
                }
            }
        }
    }
};