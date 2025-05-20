import GameControl from './GameEngine/GameControl.js';
import Quiz from './Quiz.js';
import Inventory from "./Inventory.js";
import { defaultItems } from "./items.js";
import GameLevelEnd from './GameLevelEnd.js';

class StatsManager {
    constructor(game) {
        this.game = game;
        this.initStatsUI();
        this.createStopwatch();
    }

    async fetchStats(personId) {
        const endpoints = {
            balance: this.game.javaURI + '/rpg_answer/getBalance/' + personId,
            questionAccuracy: this.game.javaURI + '/rpg_answer/getQuestionAccuracy/' + personId
        };
    
        for (let [key, url] of Object.entries(endpoints)) {
            try {
                const response = await fetch(url, this.game.fetchOptions);
                const data = await response.json();
                
                if (key === "questionAccuracy") {
                    const accuracyPercent = Math.round((data ?? 0) * 100);
                    document.getElementById(key).innerHTML = `${accuracyPercent}%`;
                    localStorage.setItem(key, `${accuracyPercent}%`);
                } else {
                    document.getElementById(key).innerHTML = data ?? 0;
                    localStorage.setItem(key, data ?? 0);
                }
            } catch (err) {
                console.error(`Error fetching ${key}:`, err);
            }
        }
    }

    async createStats(stats, gname, uid) {
        try {
            const response = await fetch(`${this.game.javaURI}/createStats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, gname, stats })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error creating stats:", error);
            return "Error creating stats";
        }
    }

    async getStats(uid) {
        try {
            const response = await fetch(`${this.game.javaURI}/getStats/${uid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error fetching stats:", error);
            return "Error fetching stats";
        }
    }

    async updateStats(stats, gname, uid) {
        try {
            const response = await fetch(`${this.game.javaURI}/updateStats`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, gname, stats })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("Error updating stats:", error);
            return "Error updating stats";
        }
    }

    async updateStatsMCQ(questionId, choiceId, personId) {
        try {
            console.log("Submitting answer with:", { questionId, choiceId, personId });
            
            const response = await fetch(this.game.javaURI + '/rpg_answer/submitMCQAnswer', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questionId, personId, choiceId })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            return response;
        } catch (error) {
            console.error("Error submitting MCQ answer:", error);
            throw error;
        }
    }

    async transitionToWallstreet(personId) {
        try {
            const response = await fetch(`${this.game.javaURI}/question/transitionToWallstreet/${personId}`, this.game.fetchOptions);
            if (!response.ok) throw new Error("Failed to fetch questions");
            const questionsAnswered = await response.json();
            return questionsAnswered >= 12;
        } catch (error) {
            console.error("Error transitioning to Wallstreet:", error);
            return null;
        }
    }

    initStatsUI() {
        // Create theme colors for consistent UI
        const themeColor = '#4a86e8'; // Main theme color (blue)
        const themeShadow = 'rgba(74, 134, 232, 0.7)'; // Shadow color matching theme
        
        const statsContainer = document.createElement('div');
        statsContainer.id = 'stats-container';
        statsContainer.style.position = 'fixed';
        statsContainer.style.top = '75px';
        statsContainer.style.right = '10px';
        statsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        statsContainer.style.color = 'white';
        statsContainer.style.padding = '15px';
        statsContainer.style.borderRadius = '10px';
        statsContainer.style.border = `2px solid ${themeColor}`;
        statsContainer.style.boxShadow = `0 0 15px ${themeShadow}`;
        statsContainer.style.fontFamily = "'Montserrat', sans-serif";
    
        statsContainer.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 8px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">💰</span>
                <span>Balance: <span id="balance" style="color: ${themeColor}; font-weight: bold;">0</span></span>
            </div>
            <div style="font-size: 14px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">📊</span>
                <span>Accuracy: <span id="questionAccuracy" style="color: ${themeColor}; font-weight: bold;">0%</span></span>
            </div>
        `;
        
        // Add Google font for better typography
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        document.body.appendChild(statsContainer);
    }
    
    // Create a styled stopwatch
    createStopwatch() {
        // Use the theme color for consistent design
        const themeColor = '#4a86e8';
        const themeShadow = 'rgba(74, 134, 232, 0.7)';
        
        const stopwatchContainer = document.createElement('div');
        stopwatchContainer.id = 'stopwatch-container';
        stopwatchContainer.style.position = 'fixed';
        stopwatchContainer.style.top = '10px';
        stopwatchContainer.style.left = '50%';
        stopwatchContainer.style.transform = 'translateX(-50%)';
        stopwatchContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        stopwatchContainer.style.borderRadius = '20px';
        stopwatchContainer.style.padding = '12px 25px';
        stopwatchContainer.style.boxShadow = `0 0 15px ${themeShadow}`;
        stopwatchContainer.style.zIndex = '1000';
        stopwatchContainer.style.display = 'none'; // Start hidden, will be shown in GameLevelEnd
        stopwatchContainer.style.flexDirection = 'column';
        stopwatchContainer.style.alignItems = 'center';
        stopwatchContainer.style.justifyContent = 'center';
        stopwatchContainer.style.border = `2px solid ${themeColor}`;
        stopwatchContainer.style.fontFamily = "'Montserrat', sans-serif";
        
        // Create the display for the timer
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'timer-display';
        timerDisplay.style.fontFamily = "'Digital-7', monospace";
        timerDisplay.style.fontSize = '32px';
        timerDisplay.style.fontWeight = 'bold';
        timerDisplay.style.color = themeColor;
        timerDisplay.style.textShadow = `0 0 10px ${themeShadow}`;
        timerDisplay.textContent = '00:00.0';
        
        // Create a small container for best time display
        const bestTimeContainer = document.createElement('div');
        bestTimeContainer.id = 'best-time-container';
        bestTimeContainer.style.fontSize = '12px';
        bestTimeContainer.style.color = '#cccccc';
        bestTimeContainer.style.marginTop = '5px';
        
        // Get best time from localStorage
        const bestTime = localStorage.getItem('bestCompletionTime');
        if (bestTime) {
            const formattedBestTime = this.formatTime(parseFloat(bestTime));
            bestTimeContainer.textContent = `BEST: ${formattedBestTime}`;
        } else {
            bestTimeContainer.textContent = 'BEST: --:--.-';
        }
        
        // Label for the stopwatch
        const timerLabel = document.createElement('div');
        timerLabel.textContent = 'TIME';
        timerLabel.style.fontSize = '12px';
        timerLabel.style.fontWeight = 'bold';
        timerLabel.style.color = 'white';
        timerLabel.style.marginBottom = '5px';
        timerLabel.style.letterSpacing = '1px';
        
        // Add custom font for digital look
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.cdnfonts.com/css/digital-7-mono';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        // Assemble the stopwatch
        stopwatchContainer.appendChild(timerLabel);
        stopwatchContainer.appendChild(timerDisplay);
        stopwatchContainer.appendChild(bestTimeContainer);
        document.body.appendChild(stopwatchContainer);
    }
    
    // Helper method to format time consistently
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const tenths = Math.floor((time * 10) % 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
    }
}

class TimeManager {
    constructor(game) {
        this.game = game;
        this.gameTimer = 0;
        this.timerInterval = null;
        this.currentLevelInstance = null;
        this.isStopwatch = true;
        this.isActive = false; // Track if timer is active
    }

    setCurrentLevelInstance(instance) {
        this.currentLevelInstance = instance;
        console.log("Current level instance set:", instance);
        
        // Check if we're in the GameLevelEnd level
        if (instance && instance.constructor.name === 'GameLevelEnd') {
            // Only start the timer in GameLevelEnd level
            this.startStopwatch();
        } else {
            // Stop timer in other levels
            this.stopStopwatch(false); // false = don't show success screen
        }
    }
    
    // Start the stopwatch - only called for GameLevelEnd
        
    startStopwatch() {
        console.log("Starting stopwatch in GameLevelEnd");
        
        // Get the elements
        const timerDisplay = document.getElementById('timer-display');
        const stopwatchContainer = document.getElementById('stopwatch-container');
        
        if (!timerDisplay || !stopwatchContainer) {
            console.error("Timer elements not found in the DOM");
            console.log("Creating stopwatch elements directly");
            
            // Create stopwatch container if it doesn't exist
            const newStopwatchContainer = document.createElement('div');
            newStopwatchContainer.id = 'stopwatch-container';
            newStopwatchContainer.style.position = 'fixed';
            newStopwatchContainer.style.top = '10px';
            newStopwatchContainer.style.left = '50%';
            newStopwatchContainer.style.transform = 'translateX(-50%)';
            newStopwatchContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            newStopwatchContainer.style.color = 'white';
            newStopwatchContainer.style.padding = '10px 20px';
            newStopwatchContainer.style.borderRadius = '10px';
            newStopwatchContainer.style.zIndex = '9999';
            newStopwatchContainer.style.fontFamily = 'monospace';
            newStopwatchContainer.style.fontSize = '20px';
            newStopwatchContainer.style.fontWeight = 'bold';
            newStopwatchContainer.style.border = '2px solid #4a86e8';
            newStopwatchContainer.style.boxShadow = '0 0 10px rgba(74, 134, 232, 0.7)';
            newStopwatchContainer.textContent = '00:00.0';
            document.body.appendChild(newStopwatchContainer);
            
            // Use this new container
            stopwatchContainer = newStopwatchContainer;
            timerDisplay = newStopwatchContainer;
        }
        
        // Make stopwatch visible - use inline style to override any CSS
        stopwatchContainer.style.display = 'block';
        
        // Clear any existing interval
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Set timer to 0
        this.gameTimer = 0;
        if (timerDisplay !== stopwatchContainer) {
            this.updateTimerDisplay(timerDisplay, this.gameTimer);
        } else {
            stopwatchContainer.textContent = '00:00.0';
        }
        
        // Mark timer as active
        this.isActive = true;
        
        // Start the stopwatch (updating every 100ms for smoother display)
        this.timerInterval = setInterval(() => {
            if (this.isActive) {
                this.gameTimer += 0.1;
                
                // Update timer display every 100ms
                if (timerDisplay !== stopwatchContainer) {
                    this.updateTimerDisplay(timerDisplay, this.gameTimer);
                } else {
                    const minutes = Math.floor(this.gameTimer / 60);
                    const seconds = Math.floor(this.gameTimer % 60);
                    const tenths = Math.floor((this.gameTimer * 10) % 10);
                    stopwatchContainer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
                }
            }
        }, 100);
    }
    
    // Stop the stopwatch
    stopStopwatch(completed = true) {
        // Clear the timer interval
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Mark timer as inactive
        this.isActive = false;
        
        // Hide stopwatch if not in GameLevelEnd
        if (!completed && this.currentLevelInstance?.constructor.name !== 'GameLevelEnd') {
            const stopwatchContainer = document.getElementById('stopwatch-container');
            if (stopwatchContainer) {
                stopwatchContainer.style.display = 'none';
            }
        }
        
        // If completed, save the time
        if (completed) {
            this.saveCompletionTime(this.gameTimer);
        }
    }
    
    updateTimerDisplay(display, time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const tenths = Math.floor((time * 10) % 10);
        
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
    }
    
    saveCompletionTime(time) {
        // Get the current best time from localStorage
        const currentBestTime = localStorage.getItem('bestCompletionTime');
        
        // If there's no current best time or the new time is better, save it
        if (!currentBestTime || time < parseFloat(currentBestTime)) {
            localStorage.setItem('bestCompletionTime', time.toString());
            console.log(`New best time saved: ${time} seconds`);
            
            // Return true if this is a new best time
            return true;
        }
        
        // Return false if this is not a new best time
        return false;
    }
    
    getFormattedBestTime() {
        const bestTime = localStorage.getItem('bestCompletionTime');
        if (!bestTime) return 'None';
        
        const time = parseFloat(bestTime);
        return this.formatTime(time);
    }
    
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const tenths = Math.floor((time * 10) % 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
    }
}

class InventoryManager {
    constructor(game) {
        this.game = game;
        this.inventory = Inventory.getInstance();
        this.giveStartingItems();
    }

    giveItem(itemId, quantity = 1) {
        console.log("Giving item:", itemId, "quantity:", quantity);
        const item = defaultItems[itemId];
        if (!item) {
            console.error(`Item ${itemId} not found in defaultItems`);
            return false;
        }

        const itemToAdd = {
            ...item,
            quantity: quantity
        };

        console.log("Adding item to inventory:", itemToAdd);
        return this.inventory.addItem(itemToAdd);
    }

    removeItem(itemId, quantity = 1) {
        return this.inventory.removeItem(itemId, quantity);
    }

    hasItem(itemId) {
        return this.inventory.items.some(item => item.id === itemId);
    }

    getItemQuantity(itemId) {
        const item = this.inventory.items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    }

    giveStartingItems() {
        console.log("Giving starting items to player...");
        
        // Trading items
        this.giveItem('stock_certificate', 5);  // 5 stock certificates
        this.giveItem('bond', 3);               // 3 bonds
        
        // Power-ups
        this.giveItem('trading_boost', 2);      // 2 trading boosts
        this.giveItem('speed_boost', 2);        // 2 speed boosts
        
        // Tools
        this.giveItem('calculator', 1);         // 1 calculator
        this.giveItem('market_scanner', 1);     // 1 market scanner
        
        // Collectibles
        this.giveItem('rare_coin', 1);          // 1 rare coin
        this.giveItem('trading_manual', 1);     // 1 trading manual

        // Add ROI Calculator
        console.log("Adding ROI Calculator...");
        this.giveItem('roi_calculator', 1);     // 1 ROI Calculator
    }
}

class QuizManager {
    constructor(game) {
        this.game = game;
    }

    async fetchQuestionByCategory(category) {
        try {
            const personId = this.game.id;
            const response = await fetch(
                `${this.game.javaURI}/rpg_answer/getQuestion?category=${category}&personid=${personId}`, 
                this.game.fetchOptions
            );
    
            if (!response.ok) throw new Error("Failed to fetch questions");
            const questions = await response.json();
            console.log(questions);
            return questions;
        } catch (error) {
            console.error("Error fetching question by category:", error);
            return null;
        }
    }
    
    async attemptQuizForNpc(npcCategory, callback = null) {
        try {
            const response = await this.fetchQuestionByCategory(npcCategory);
            const allQuestions = response?.questions || [];
    
            if (allQuestions.length === 0) {
                alert(`✅ You've already completed all of ${npcCategory}'s questions!`);
                return;
            }
    
            const quiz = new Quiz();
            quiz.initialize();
            quiz.openPanel(npcCategory, callback, allQuestions);
    
        } catch (error) {
            console.error("Error during NPC quiz attempt:", error);
            alert("⚠️ There was a problem loading the quiz. Please try again.");
        }
    }
}

class Game {
    constructor() {
        console.log("Initializing game...");
        this.environment = null;
        this.path = null;
        this.gameContainer = null;
        this.gameCanvas = null;
        this.pythonURI = null;
        this.javaURI = null;
        this.fetchOptions = null;
        this.uid = null;
        this.id = null;
        this.gname = null;
        this.gameControl = null;

        // Manager instances
        this.statsManager = null;
        this.timeManager = null;
        this.inventoryManager = null;
        this.quizManager = null;
    }

    // Main initialization method
    main(environment) {
        console.log("Setting up game environment...");
        // Store environment properties
        this.environment = environment;
        this.path = environment.path;
        this.gameContainer = environment.gameContainer;
        this.gameCanvas = environment.gameCanvas;
        this.pythonURI = environment.pythonURI;
        this.javaURI = environment.javaURI;
        this.fetchOptions = environment.fetchOptions;

        // Initialize managers
        this.statsManager = new StatsManager(this);
        this.timeManager = new TimeManager(this);
        this.inventoryManager = new InventoryManager(this);
        this.quizManager = new QuizManager(this);

        // Initialize user and game components
        this.initUser();
        
        // Initialize the Game static reference
        this.initialize();
        
        // Start the game
        const gameLevelClasses = environment.gameLevelClasses;
        this.gameControl = new GameControl(this, gameLevelClasses);
        this.gameControl.start();
    }
    
    // Initialize static reference for GameLevelEnd to access
    initialize() {
        // Create a reference to timeManager that GameLevelEnd can access
        Game.timeManager = this.timeManager;
    }

    // Initialize user data
    initUser() {
        const pythonURL = this.pythonURI + '/api/id';
        fetch(pythonURL, this.fetchOptions)
            .then(response => {
                if (response.status !== 200) {
                    console.error("HTTP status code: " + response.status);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.uid = data.uid;
                console.log("User ID:", this.uid);

                const javaURL = this.javaURI + '/rpg_answer/person/' + this.uid;
                return fetch(javaURL, this.fetchOptions);
            })
            .then(response => {
                if (!response || !response.ok) {
                    throw new Error(`Spring server response: ${response?.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data) return;
                this.id = data.id;
                this.statsManager.fetchStats(data.id);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    // Static methods to delegate to appropriate managers
    static main(environment) {
        const game = new Game();
        game.main(environment);
        return game;
    }

    static setCurrentLevelInstance(instance) {
        if (Game.timeManager) {
            Game.timeManager.setCurrentLevelInstance(instance);
        }
    }

    // Delegate methods to appropriate managers
    giveItem(itemId, quantity = 1) {
        return this.inventoryManager.giveItem(itemId, quantity);
    }

    removeItem(itemId, quantity = 1) {
        return this.inventoryManager.removeItem(itemId, quantity);
    }

    hasItem(itemId) {
        return this.inventoryManager.hasItem(itemId);
    }

    getItemQuantity(itemId) {
        return this.inventoryManager.getItemQuantity(itemId);
    }

    attemptQuizForNpc(npcCategory, callback = null) {
        return this.quizManager.attemptQuizForNpc(npcCategory, callback);
    }

    // API wrapper methods
    async createStats(stats, gname, uid) {
        return this.statsManager.createStats(stats, gname, uid);
    }

    async getStats(uid) {
        return this.statsManager.getStats(uid);
    }

    async updateStats(stats, gname, uid) {
        return this.statsManager.updateStats(stats, gname, uid);
    }

    async updateStatsMCQ(questionId, choiceId, personId) {
        return this.statsManager.updateStatsMCQ(questionId, choiceId, personId);
    }

    async transitionToWallstreet(personId) {
        return this.statsManager.transitionToWallstreet(personId);
    }

    async fetchQuestionByCategory(category) {
        return this.quizManager.fetchQuestionByCategory(category);
    }
}

export default Game;