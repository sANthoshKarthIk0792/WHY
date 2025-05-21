/**
 * CS Fighters - UI Management
 * Handles UI updates and interactions
 */

const UI = {
    /**
     * Initialize UI
     */
    init: function() {
        // Set up character selection grid
        this.setupCharacterSelection();
        
        // Add resize handler
        window.addEventListener('resize', this.adjustForScreenSize);
        this.adjustForScreenSize();
    },
    
    /**
     * Set up character selection UI
     */
    setupCharacterSelection: function() {
        const characterCards = document.querySelectorAll('.character-card');
        
        // Add descriptions and color styling to cards
        characterCards.forEach(card => {
            const characterType = card.dataset.character.toUpperCase();
            const characterConfig = CONFIG.CHARACTERS[characterType];
            
            if (characterConfig) {
                // Update description
                const descElement = card.querySelector('p');
                if (descElement) {
                    descElement.textContent = characterConfig.DESCRIPTION;
                }
                
                // Set card style based on character color
                card.style.borderColor = characterConfig.COLOR;
                
                // Add highlighting effect on hover
                card.addEventListener('mouseenter', () => {
                    card.style.boxShadow = `0 0 15px ${characterConfig.COLOR}`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.boxShadow = 'none';
                });
            }
        });
        
        // Select first character by default
        if (characterCards.length > 0) {
            characterCards[0].classList.add('selected');
        }
    },
    
    /**
     * Adjust UI elements based on screen size
     */
    adjustForScreenSize: function() {
        const gameContainer = document.querySelector('.game-container');
        const characterGrid = document.querySelector('.character-grid');
        
        if (window.innerWidth < 768) {
            // Mobile layout
            if (characterGrid) {
                characterGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            }
        } else if (window.innerWidth < 1200) {
            // Tablet layout
            if (characterGrid) {
                characterGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            }
        } else {
            // Desktop layout
            if (characterGrid) {
                characterGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            }
        }
        
        // Adjust game container width
        if (gameContainer) {
            const maxWidth = Math.min(window.innerWidth * 0.95, CONFIG.CANVAS.WIDTH);
            gameContainer.style.width = `${maxWidth}px`;
        }
    },
    
    /**
     * Update skill cooldown displays
     * @param {Player} player - Player character
     */
    updateSkillCooldowns: function(player) {
        if (!player) return;
        
        // Basic skill
        this.updateSkillElement(
            'basic-skill',
            player.basicSkillReady,
            player.lastBasicSkillTime,
            CONFIG.SKILLS.BASIC_COOLDOWN
        );
        
        // Special skill
        this.updateSkillElement(
            'special-skill',
            player.specialSkillReady,
            player.lastSpecialSkillTime,
            CONFIG.SKILLS.SPECIAL_COOLDOWN
        );
        
        // Ultimate skill
        this.updateSkillElement(
            'ultimate-skill',
            player.ultimateSkillReady,
            player.lastUltimateSkillTime,
            CONFIG.SKILLS.ULTIMATE_COOLDOWN
        );
    },
    
    /**
     * Update a single skill element
     * @param {String} elementId - Element ID
     * @param {Boolean} isReady - Whether skill is ready
     * @param {Number} lastUseTime - When skill was last used
     * @param {Number} cooldown - Skill cooldown time
     */
    updateSkillElement: function(elementId, isReady, lastUseTime, cooldown) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        if (isReady) {
            element.style.opacity = '1';
            element.style.backgroundColor = 'rgba(85, 85, 85, 1.0)';
            element.textContent = elementId === 'basic-skill' ? 'Q' : elementId === 'special-skill' ? 'E' : 'R';
        } else {
            const elapsedTime = Date.now() - lastUseTime;
            const progress = Math.min(1, elapsedTime / cooldown);
            
            // Visual feedback
            element.style.opacity = '0.5';
            element.style.backgroundColor = 'rgba(51, 51, 51, 1.0)';
            
            // Add cooldown text
            const remainingSeconds = Math.ceil((cooldown - elapsedTime) / 1000);
            element.textContent = remainingSeconds > 0 ? remainingSeconds : 
                elementId === 'basic-skill' ? 'Q' : elementId === 'special-skill' ? 'E' : 'R';
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
     * @param {Character} enemy - Enemy character
     */
    updateHealthBars: function(player, enemy) {
        if (player) {
            const playerHealthBar = document.getElementById('player-health');
            if (playerHealthBar) {
                const healthPercentage = (player.health / player.maxHealth) * 100;
                playerHealthBar.style.width = `${healthPercentage}%`;
                
                // Change color based on health
                if (healthPercentage < 25) {
                    playerHealthBar.style.backgroundColor = 'rgba(231, 76, 60, 1.0)'; // Red
                } else if (healthPercentage < 50) {
                    playerHealthBar.style.backgroundColor = 'rgba(243, 156, 18, 1.0)'; // Orange
                } else {
                    playerHealthBar.style.backgroundColor = 'rgba(46, 204, 113, 1.0)'; // Green
                }
            }
        }
        
        if (enemy) {
            const enemyHealthBar = document.getElementById('enemy-health');
            if (enemyHealthBar) {
                const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
                enemyHealthBar.style.width = `${healthPercentage}%`;
            }
        }
    }
};