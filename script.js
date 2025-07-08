document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // UI Elements
    const mainMenu = document.getElementById('main-menu');
    const gameHUD = document.getElementById('game-hud');
    const pauseMenu = document.getElementById('pause-menu');
    const gameOverScreen = document.getElementById('game-over-screen');

    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const resumeButton = document.getElementById('resume-button');
    const restartPauseButton = document.getElementById('restart-pause-button');
    const mainMenuPauseButton = document.getElementById('main-menu-pause-button');
    const restartButton = document.getElementById('restart-button');
    const mainMenuGameOverButton = document.getElementById('main-menu-game-over-button');

    const scoreDisplay = document.getElementById('score-display');
    const livesDisplay = document.getElementById('lives-display');
    const comboDisplay = document.getElementById('combo-display');
    const finalScoreDisplay = document.getElementById('final-score-display');
    const mainMenuHighScoreDisplay = document.getElementById('main-menu-high-score');
    const gameOverHighScoreDisplay = document.getElementById('game-over-high-score');

    // Game Variables
    let gameRunning = false;
    let gamePaused = false;
    let score = 0;
    let lives = 3;
    let missedFruits = 0; // Tracks fruits missed within current life
    let highScore = localStorage.getItem('fruitFrenzyHighScore') || 0; // Load high score from local storage
    let animationFrameId; // To control requestAnimationFrame

    // Game Objects Arrays
    const gameObjects = []; // Stores active fruits and bombs
    const particles = []; // Stores splash particles

    // Swipe/Blade Variables
    let isSwiping = false;
    let currentSwipePath = []; // Stores points of the current swipe to draw the blade trail
    const BLADE_TRAIL_MAX_POINTS = 10; // Max points in the trail for performance
    const bladeColor = 'rgba(255, 255, 255, 0.8)'; // White blade
    const bladeThickness = 5;

    // Combo System
    let comboCount = 0;
    let lastSliceTime = 0;
    const COMBO_THRESHOLD_MS = 300; // Max time between slices to maintain a combo

    // Game Constants
    const GRAVITY = 0.5; // Controls how fast objects fall
    const FRUIT_RADIUS = 30; // Size of fruits
    const BOMB_RADIUS = 40; // Size of bombs
    const MAX_MISSED_FRUITS_PER_LIFE = 3; // How many fruits can be missed before losing a life
    const INITIAL_FRUIT_SPAWN_INTERVAL_MS = 800; // Initial delay between fruit spawns
    let lastSpawnTime = 0;
    let currentSpawnInterval = INITIAL_FRUIT_SPAWN_INTERVAL_MS; // Dynamically adjusts with difficulty

    // Audio Assets (Ensure 'sounds' folder exists and contains these MP3 files)
    // You can find free sounds on sites like freesound.org or create simple ones.
    const sliceSound = new Audio('sounds/slice.mp3');
    const bombSound = new Audio('sounds/bomb.mp3');
    const missSound = new Audio('sounds/miss.mp3');
    const comboSound = new Audio('sounds/combo.mp3');
    const gameOverSound = new Audio('sounds/gameover.mp3');
    const backgroundMusic = new Audio('sounds/music.mp3');
    backgroundMusic.loop = true; // Loop background music
    backgroundMusic.volume = 0.4; // Adjust volume levels
    sliceSound.volume = 0.6;
    bombSound.volume = 0.8;
    missSound.volume = 0.6;
    comboSound.volume = 0.7;
    gameOverSound.volume = 0.8;

    // Preload sounds to prevent delay on first play (optional but recommended)
    [sliceSound, bombSound, missSound, comboSound, gameOverSound, backgroundMusic].forEach(sound => {
        sound.load().catch(e => console.warn(`Failed to load audio: ${sound.src}. Error:`, e));
    });

    // --- Game Object Classes ---

    class GameObject {
        constructor(x, y, radius, vx, vy, type, color = 'grey') {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.vx = vx; // velocity X
            this.vy = vy; // velocity Y (negative for upward movement)
            this.type = type; // 'fruit' or 'bomb'
            // For drawing colored circles:
            this.color = color;
            // For drawing split fruit halves (conceptual for now, could be separate objects later)
            this.isSliced = false; // Flag for collision/removal
            this.id = Date.now() + Math.random(); // Unique ID for tracking (useful for complex games)
        }

        update() {
            this.vy += GRAVITY; // Apply gravity
            this.x += this.vx;
            this.y += this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();

            // Simple visual indicator for bomb
            if (this.type === 'bomb') {
                ctx.fillStyle = 'white';
                ctx.font = 'bold 20px Arial'; // Larger font for bomb emoji
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💣', this.x, this.y); // Unicode bomb emoji
            }
        }

        // Checks if a point (px, py) is inside the object's circle (for debugging or simple point checks)
        contains(px, py) {
            const distance = Math.sqrt((px - this.x)**2 + (py - this.y)**2);
            return distance < this.radius;
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 10; // Random horizontal velocity
            this.vy = (Math.random() - 0.5) * 10; // Random vertical velocity (some up, some down)
            this.radius = Math.random() * 5 + 2; // Random size for particle
            // Ensure color is an object with r,g,b for rgba()
            this.color = color;
            this.alpha = 1; // Initial opacity
            this.life = 60; // How many frames the particle lives
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += GRAVITY / 2; // Slight gravity for particles
            this.alpha -= 1 / this.life; // Fade out over time
            this.radius *= 0.98; // Shrink slightly over time
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Use rgba to apply fading alpha
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
            ctx.fill();
            ctx.closePath();
        }
    }

    // --- Game Logic Functions ---

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Generates a random vibrant color object (r, g, b components)
    function generateRandomColor() {
        const colors = [
            {r: 255, g: 80, b: 80},   // Red (Apple/Strawberry)
            {r: 255, g: 165, b: 0},  // Orange
            {r: 255, g: 255, b: 80}, // Yellow (Banana/Lemon)
            {r: 80, g: 200, b: 80},  // Green (Lime/Kiwi skin)
            {r: 120, g: 200, b: 255},// Light Blue (Blueberry concept)
            {r: 200, g: 80, b: 255}  // Purple (Grape concept)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function spawnObject() {
        // Spawn from a random X at the bottom of the screen
        const x = Math.random() * canvas.width;
        const y = canvas.height + 50; // Start below screen to arc upwards

        // Random horizontal velocity (left or right drift)
        const vx = (Math.random() - 0.5) * 10;
        // Random upward velocity
        const vy = -(Math.random() * 10 + 15);

        const isBomb = Math.random() < 0.1; // 10% chance for a bomb

        if (isBomb) {
            gameObjects.push(new GameObject(x, y, BOMB_RADIUS, vx, vy, 'bomb', 'black'));
        } else {
            gameObjects.push(new GameObject(x, y, FRUIT_RADIUS, vx, vy, 'fruit', generateRandomColor()));
        }
    }

    function updateGameObjects(deltaTime) {
        // Iterate backwards to safely remove elements
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            const obj = gameObjects[i];
            obj.update();

            // Check if object went off-screen (missed or just fell)
            if (obj.y > canvas.height + obj.radius * 2) { // Allow some buffer
                if (obj.type === 'fruit' && !obj.isSliced) {
                    // This fruit was missed!
                    missedFruits++;
                    missSound.currentTime = 0;
                    missSound.play();
                    updateLivesDisplay(); // Update hearts in HUD

                    if (missedFruits >= MAX_MISSED_FRUITS_PER_LIFE) {
                        lives--;
                        missedFruits = 0; // Reset missed counter for the new life
                        updateLivesDisplay();
                        if (lives <= 0) {
                            gameOver(); // All lives lost!
                            return; // Stop further updates if game is over
                        }
                    }
                }
                gameObjects.splice(i, 1); // Remove the object
            } else if (obj.isSliced) {
                 // If it's a fruit that was sliced, remove it instantly after splash
                 gameObjects.splice(i, 1);
            }
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            if (p.alpha <= 0 || p.radius <= 0) { // Particles fade or shrink to nothing
                particles.splice(i, 1);
            }
        }
    }

    function drawGameObjects() {
        gameObjects.forEach(obj => obj.draw());
        particles.forEach(p => p.draw());
    }

    function drawBladeTrail() {
        if (currentSwipePath.length < 2) return;

        ctx.strokeStyle = bladeColor;
        ctx.lineWidth = bladeThickness;
        ctx.lineCap = 'round'; // Round ends for blade segments
        ctx.lineJoin = 'round'; // Round joins between segments

        ctx.beginPath();
        // Move to the first point, then draw lines to subsequent points
        ctx.moveTo(currentSwipePath[0].x, currentSwipePath[0].y);
        for (let i = 1; i < currentSwipePath.length; i++) {
            ctx.lineTo(currentSwipePath[i].x, currentSwipePath[i].y);
        }
        ctx.stroke();
    }

    // Function to calculate distance from a point to a line segment
    // Used for precise collision detection of a circular object with a line segment
    // p: point (object center), v1: line start, v2: line end
    function distToSegmentSquared(p, v1, v2) {
        const l2 = (v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y);
        if (l2 === 0) return Math.sqrt((p.x - v1.x) * (p.x - v1.x) + (p.y - v1.y) * (p.y - v1.y)); // v1 and v2 are the same point
        
        // Project point p onto the line defined by v1 and v2
        let t = ((p.x - v1.x) * (v2.x - v1.x) + (p.y - v1.y) * (v2.y - v1.y)) / l2;
        t = Math.max(0, Math.min(1, t)); // Clamp t to [0, 1] to stay within the segment

        // Calculate the closest point on the segment to p
        const projX = v1.x + t * (v2.x - v1.x);
        const projY = v1.y + t * (v2.y - v1.y);

        // Return the distance from p to this closest point
        return Math.sqrt((p.x - projX) * (p.x - projX) + (p.y - projY) * (p.y - projY));
    }

    function handleSwipe() {
        if (currentSwipePath.length < 2) return; // Need at least two points for a segment

        let slicedThisSwipeCount = 0; // How many fruits were sliced in this *single* swipe
        const now = Date.now();

        // Iterate through game objects to check for collisions with the swipe path
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            const obj = gameObjects[i];
            if (obj.isSliced) continue; // Already processed this object

            let hit = false;
            // Check each segment of the swipe path against the object
            for (let j = 0; j < currentSwipePath.length - 1; j++) {
                const p1 = currentSwipePath[j];
                const p2 = currentSwipePath[j+1];

                const dist = distToSegmentSquared({x: obj.x, y: obj.y}, p1, p2);

                if (dist < obj.radius) { // Collision detected!
                    hit = true;
                    break; // No need to check other segments for this object
                }
            }

            if (hit) {
                // An object was hit by the blade
                if (obj.type === 'fruit') {
                    obj.isSliced = true; // Mark fruit as sliced
                    slicedThisSwipeCount++; // Increment count for combo

                    score += 10; // Base points for a fruit
                    
                    // Create visual splash particles
                    const color = obj.color;
                    for (let k = 0; k < 20; k++) {
                        particles.push(new Particle(obj.x, obj.y, color));
                    }
                    sliceSound.currentTime = 0; // Reset sound for immediate replay
                    sliceSound.play();

                } else if (obj.type === 'bomb') {
                    bombSound.currentTime = 0;
                    bombSound.play();
                    gameOver(); // Game over instantly if a bomb is sliced
                    return; // Stop further processing if game over
                }
            }
        }

        // Combo Logic: Apply bonus points based on how many fruits were sliced in this swipe
        if (slicedThisSwipeCount > 0) {
            const now = Date.now();
            if (now - lastSliceTime < COMBO_THRESHOLD_MS) {
                // Combo continues if time between last slice and current swipe is short
                comboCount += slicedThisSwipeCount;
            } else {
                // New combo if too much time has passed
                comboCount = slicedThisSwipeCount;
            }
            lastSliceTime = now; // Update last slice time

            // Calculate combo bonus (example: more fruits in one swipe, or higher combo count, gives more bonus)
            let comboBonus = 0;
            if (comboCount > 1) { // Only award combo bonus if it's actually a combo
                 comboBonus = slicedThisSwipeCount * 5 * Math.min(comboCount, 5); // Max 5x multiplier for combo count
                 score += comboBonus;
                 comboSound.currentTime = 0;
                 comboSound.play();
                 // console.log(`Combo! Sliced ${slicedThisSwipeCount}, Current Combo: ${comboCount}, Bonus: ${comboBonus}`);
            }
        } else {
            // If no fruits sliced in this swipe, break the combo (handled by time check as well)
            // If the swipe was empty, comboCount should probably be reset here too
            if (Date.now() - lastSliceTime >= COMBO_THRESHOLD_MS) {
                comboCount = 0;
            }
        }
    }

    // --- UI Update Functions ---

    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }

    function updateLivesDisplay() {
        livesDisplay.textContent = '❤️ '.repeat(lives);
    }

    function updateComboDisplay() {
        comboDisplay.textContent = comboCount;
    }

    function updateHighScores() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('fruitFrenzyHighScore', highScore); // Save to browser's local storage
        }
        mainMenuHighScoreDisplay.textContent = highScore;
        gameOverHighScoreDisplay.textContent = highScore;
    }

    // Helper functions to show/hide UI elements
    function showUI(element) {
        element.classList.remove('hidden');
    }

    function hideUI(element) {
        element.classList.add('hidden');
    }

    // --- Game Flow Control Functions ---

    function resetGame() {
        score = 0;
        lives = 3;
        missedFruits = 0;
        comboCount = 0;
        lastSliceTime = 0;
        currentSpawnInterval = INITIAL_FRUIT_SPAWN_INTERVAL_MS; // Reset difficulty
        gameObjects.length = 0; // Clear all active game objects
        particles.length = 0; // Clear all particles
        updateScoreDisplay();
        updateLivesDisplay();
        updateComboDisplay();
        updateHighScores(); // Ensure high score is updated on UI
        // Hide all UI screens except the game HUD
        hideUI(mainMenu);
        hideUI(pauseMenu);
        hideUI(gameOverScreen);
        showUI(gameHUD);
    }

    function startGame() {
        if (gameRunning) return; // Prevent accidental multiple game starts

        resetGame(); // Set initial game state
        gameRunning = true;
        gamePaused = false;
        lastSpawnTime = Date.now(); // Initialize spawn timer for the first object
        // Attempt to play background music. It might fail if no user interaction yet.
        backgroundMusic.play().catch(e => console.warn("Background music autoplay prevented:", e));
        
        lastFrameTime = performance.now(); // Initialize lastFrameTime for delta calculation
        animationFrameId = requestAnimationFrame(gameLoop); // Start the game loop
    }

    function pauseGame() {
        if (!gameRunning || gamePaused) return; // Only pause if running and not already paused

        gamePaused = true;
        cancelAnimationFrame(animationFrameId); // Stop the game loop
        hideUI(gameHUD);
        showUI(pauseMenu);
        backgroundMusic.pause();
    }

    function resumeGame() {
        if (!gameRunning || !gamePaused) return; // Only resume if running and paused

        gamePaused = false;
        hideUI(pauseMenu);
        showUI(gameHUD);
        lastSpawnTime = Date.now(); // Reset spawn timer to prevent immediate double spawn after long pause
        backgroundMusic.play().catch(e => console.warn("Background music resume autoplay prevented:", e));
        lastFrameTime = performance.now(); // Reset lastFrameTime to prevent a huge deltaTime after pause
        animationFrameId = requestAnimationFrame(gameLoop); // Resume the game loop
    }

    function gameOver() {
        gameRunning = false;
        cancelAnimationFrame(animationFrameId); // Stop the game loop
        hideUI(gameHUD);
        showUI(gameOverScreen);
        finalScoreDisplay.textContent = score; // Display final score
        updateHighScores(); // Update high score if new one is achieved
        gameOverSound.currentTime = 0; // Play game over sound
        gameOverSound.play();
        backgroundMusic.pause(); // Stop background music
        backgroundMusic.currentTime = 0; // Rewind music for next play
    }

    function returnToMainMenu() {
        gameRunning = false;
        gamePaused = false;
        cancelAnimationFrame(animationFrameId); // Ensure game loop is stopped
        hideUI(gameHUD);
        hideUI(pauseMenu);
        hideUI(gameOverScreen);
        showUI(mainMenu); // Show main menu
        updateHighScores(); // Ensure high score is reflected on main menu
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        gameObjects.length = 0; // Clear all objects from screen
        particles.length = 0;
    }

    // --- Main Game Loop ---
    let lastFrameTime = 0; // To calculate deltaTime between frames
    function gameLoop(currentTime) {
        if (!gameRunning || gamePaused) {
            lastFrameTime = currentTime; // Keep lastFrameTime updated even if not actively playing
            return;
        }

        const deltaTime = currentTime - lastFrameTime; // Time elapsed since last frame (in milliseconds)
        lastFrameTime = currentTime;

        // Clear the entire canvas for the next frame's drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn new objects based on time interval
        if (currentTime - lastSpawnTime > currentSpawnInterval) {
            spawnObject();
            lastSpawnTime = currentTime;
            // Increase difficulty by reducing spawn interval, but not below 200ms
            currentSpawnInterval = Math.max(200, currentSpawnInterval * 0.99);
        }

        // Update all game objects and particles (divide by ~16.666ms to normalize to 60fps)
        updateGameObjects(deltaTime / 16.666);
        drawGameObjects(); // Draw all updated objects and particles
        drawBladeTrail(); // Draw the current swipe path

        // Update HUD elements
        updateScoreDisplay();
        updateComboDisplay();

        // Request the next animation frame to keep the loop going
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // --- Event Listeners ---

    // Canvas Mouse Input (for Desktop)
    canvas.addEventListener('mousedown', (e) => {
        if (!gameRunning || gamePaused) return; // Only process if game is active
        isSwiping = true;
        currentSwipePath = [{ x: e.clientX, y: e.clientY }];
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isSwiping) {
            currentSwipePath.push({ x: e.clientX, y: e.clientY });
            // Keep swipe path limited for performance and smooth trail
            if (currentSwipePath.length > BLADE_TRAIL_MAX_POINTS) {
                currentSwipePath.shift(); // Remove oldest point
            }
            handleSwipe(); // Check for collisions on every movement
        }
    });

    canvas.addEventListener('mouseup', () => {
        isSwiping = false;
        currentSwipePath = []; // Clear blade trail when swipe ends
    });

    canvas.addEventListener('mouseleave', () => { // If mouse moves out of canvas during a swipe
        isSwiping = false;
        currentSwipePath = [];
    });

    // Canvas Touch Input (for Mobile)
    canvas.addEventListener('touchstart', (e) => {
        if (!gameRunning || gamePaused) return;
        e.preventDefault(); // Prevent default touch behaviors (scrolling, zooming)
        isSwiping = true;
        const touch = e.touches[0]; // Get the first touch point
        currentSwipePath = [{ x: touch.clientX, y: touch.clientY }];
    }, { passive: false }); // Use passive: false to allow preventDefault

    canvas.addEventListener('touchmove', (e) => {
        if (isSwiping) {
            e.preventDefault(); // Prevent default touch behaviors
            const touch = e.touches[0];
            currentSwipePath.push({ x: touch.clientX, y: touch.clientY });
            if (currentSwipePath.length > BLADE_TRAIL_MAX_POINTS) {
                currentSwipePath.shift();
            }
            handleSwipe();
        }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        isSwiping = false;
        currentSwipePath = [];
    });

    // UI Button Listeners
    playButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', pauseGame);
    resumeButton.addEventListener('click', resumeGame);
    restartPauseButton.addEventListener('click', () => {
        // This button restarts the game from the pause menu
        hideUI(pauseMenu);
        startGame();
    });
    mainMenuPauseButton.addEventListener('click', returnToMainMenu);
    restartButton.addEventListener('click', startGame); // For game over screen restart
    mainMenuGameOverButton.addEventListener('click', returnToMainMenu);

    // Initial setup when the page loads
    window.addEventListener('resize', resizeCanvas); // Adjust canvas size on window resize
    resizeCanvas(); // Set initial canvas size when script loads
    updateHighScores(); // Load and display high score on initial load
});
