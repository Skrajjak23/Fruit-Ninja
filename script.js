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
    let missedFruits = 0;
    let highScore = localStorage.getItem('fruitFrenzyHighScore') || 0;
    let animationFrameId;

    // Game Objects
    const gameObjects = []; // Stores fruits and bombs
    const particles = []; // Stores splash particles

    // Swipe/Blade Variables
    let isSwiping = false;
    let currentSwipePath = []; // Stores points of the current swipe
    const bladeColor = 'rgba(255, 255, 255, 0.8)';
    const bladeThickness = 5;

    // Combo System
    let comboCount = 0;
    let lastSliceTime = 0;
    const COMBO_THRESHOLD_MS = 300; // Max time between slices for combo

    // Game Constants
    const GRAVITY = 0.5; // px per frame per frame
    const FRUIT_RADIUS = 30;
    const BOMB_RADIUS = 40;
    const MAX_MISSED_FRUITS_PER_LIFE = 3;
    const FRUIT_SPAWN_INTERVAL_MS = 800; // Initial interval
    let lastSpawnTime = 0;
    let currentSpawnInterval = FRUIT_SPAWN_INTERVAL_MS; // Dynamically adjust this

    // Audio Assets (ensure you have these files in the same directory or adjust paths)
    const sliceSound = new Audio('sounds/slice.mp3');
    const bombSound = new Audio('sounds/bomb.mp3');
    const missSound = new Audio('sounds/miss.mp3');
    const comboSound = new Audio('sounds/combo.mp3');
    const gameOverSound = new Audio('sounds/gameover.mp3');
    const backgroundMusic = new Audio('sounds/music.mp3'); // Loop this
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.4;
    sliceSound.volume = 0.6;
    bombSound.volume = 0.8;
    missSound.volume = 0.6;
    comboSound.volume = 0.7;
    gameOverSound.volume = 0.8;

    // Preload sounds (optional, but good practice for immediate playback)
    [sliceSound, bombSound, missSound, comboSound, gameOverSound, backgroundMusic].forEach(sound => {
        sound.load();
    });

    // --- Game Object Classes ---

    class GameObject {
        constructor(x, y, radius, vx, vy, type, color = 'grey') {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.vx = vx;
            this.vy = vy;
            this.type = type; // 'fruit' or 'bomb'
            this.color = color;
            this.isSliced = false; // For fruits, indicates it has been hit
            this.id = Date.now() + Math.random(); // Unique ID for tracking
        }

        update() {
            this.vy += GRAVITY;
            this.x += this.vx;
            this.y += this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();

            // Simple text for bomb
            if (this.type === 'bomb') {
                ctx.fillStyle = 'white';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💣', this.x, this.y);
            }
        }

        // Checks if a point (px, py) is inside the object's circle
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
            this.vy = (Math.random() - 0.5) * 10; // Random vertical velocity
            this.radius = Math.random() * 5 + 2; // Random size
            this.color = color;
            this.alpha = 1;
            this.life = 60; // Frames until fade
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += GRAVITY / 2; // Slight gravity for particles
            this.alpha -= 1 / this.life;
            this.radius *= 0.98; // Shrink slightly
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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

    function generateRandomColor() {
        const r = Math.floor(Math.random() * 200) + 50;
        const g = Math.floor(Math.random() * 200) + 50;
        const b = Math.floor(Math.random() * 200) + 50;
        return { r, g, b, toString: () => `rgb(${r},${g},${b})` };
    }

    function spawnObject() {
        const x = Math.random() * canvas.width;
        const y = canvas.height + 50; // Start below screen
        const vx = (Math.random() - 0.5) * 10; // Horizontal velocity
        const vy = -(Math.random() * 10 + 15); // Upward velocity

        const isBomb = Math.random() < 0.1; // 10% chance for a bomb

        if (isBomb) {
            gameObjects.push(new GameObject(x, y, BOMB_RADIUS, vx, vy, 'bomb', 'black'));
        } else {
            gameObjects.push(new GameObject(x, y, FRUIT_RADIUS, vx, vy, 'fruit', generateRandomColor()));
        }
    }

    function updateGameObjects(deltaTime) {
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            const obj = gameObjects[i];
            obj.update();

            // Remove objects that fall off-screen or are sliced/exploded
            if (obj.y > canvas.height + obj.radius * 2 || obj.isSliced) {
                if (obj.type === 'fruit' && !obj.isSliced) {
                    // Fruit missed!
                    missedFruits++;
                    missSound.currentTime = 0;
                    missSound.play();
                    updateLivesDisplay();
                    if (missedFruits >= MAX_MISSED_FRUITS_PER_LIFE) {
                        lives--;
                        missedFruits = 0; // Reset for next life
                        updateLivesDisplay();
                        if (lives <= 0) {
                            gameOver();
                            return; // Stop further updates if game is over
                        }
                    }
                }
                gameObjects.splice(i, 1);
            }
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            if (p.alpha <= 0 || p.radius <= 0) {
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
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(currentSwipePath[0].x, currentSwipePath[0].y);
        for (let i = 1; i < currentSwipePath.length; i++) {
            ctx.lineTo(currentSwipePath[i].x, currentSwipePath[i].y);
        }
        ctx.stroke();
    }

    // Line-point distance check for collision
    // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    function distToSegmentSquared(p, v, w) {
        const l2 = (w.x - v.x) * (w.x - v.x) + (w.y - v.y) * (w.y - v.y);
        if (l2 === 0) return Math.sqrt((p.x - v.x) * (p.x - v.x) + (p.y - v.y) * (p.y - v.y)); // v and w are the same point, return distance to point
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = v.x + t * (w.x - v.x);
        const projY = v.y + t * (w.y - v.y);
        return Math.sqrt((p.x - projX) * (p.x - projX) + (p.y - projY) * (p.y - projY));
    }

    function handleSwipe() {
        if (currentSwipePath.length < 2) return;

        let slicedThisSwipe = 0;
        const now = Date.now();
        const isComboPossible = (now - lastSliceTime < COMBO_THRESHOLD_MS);

        // Iterate through game objects and check against each segment of the swipe path
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            const obj = gameObjects[i];
            if (obj.isSliced) continue; // Already sliced

            let hit = false;
            for (let j = 0; j < currentSwipePath.length - 1; j++) {
                const p1 = currentSwipePath[j];
                const p2 = currentSwipePath[j+1];

                const dist = distToSegmentSquared({x: obj.x, y: obj.y}, p1, p2);

                if (dist < obj.radius) { // Collision detected
                    hit = true;
                    break;
                }
            }

            if (hit) {
                obj.isSliced = true; // Mark as sliced for removal

                if (obj.type === 'fruit') {
                    slicedThisSwipe++;
                    score += 10; // Base points

                    // Create splash particles
                    const color = obj.color;
                    for (let k = 0; k < 20; k++) {
                        particles.push(new Particle(obj.x, obj.y, color));
                    }
                    sliceSound.currentTime = 0; // Reset sound for immediate replay
                    sliceSound.play();
                } else if (obj.type === 'bomb') {
                    bombSound.currentTime = 0;
                    bombSound.play();
                    gameOver();
                    return; // Game over, stop processing
                }
            }
        }

        // Apply combo logic after all objects are checked
        if (slicedThisSwipe > 0) {
            lastSliceTime = now;
            comboCount++; // Increment for each successful slice (could be per object, or per swipe)
            score += slicedThisSwipe * 5 * comboCount; // Combo bonus! More fruits + higher combo = more points

            if (comboCount > 1) { // Only play combo sound if it's an actual combo
                comboSound.currentTime = 0;
                comboSound.play();
            }
        } else {
            comboCount = 0; // Reset combo if no fruits sliced in this swipe
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
            localStorage.setItem('fruitFrenzyHighScore', highScore);
        }
        mainMenuHighScoreDisplay.textContent = highScore;
        gameOverHighScoreDisplay.textContent = highScore;
    }

    function showUI(element) {
        element.classList.remove('hidden');
    }

    function hideUI(element) {
        element.classList.add('hidden');
    }

    // --- Game Flow Functions ---

    function resetGame() {
        score = 0;
        lives = 3;
        missedFruits = 0;
        comboCount = 0;
        lastSliceTime = 0;
        currentSpawnInterval = FRUIT_SPAWN_INTERVAL_MS;
        gameObjects.length = 0; // Clear all game objects
        particles.length = 0; // Clear all particles
        updateScoreDisplay();
        updateLivesDisplay();
        updateComboDisplay();
        updateHighScores(); // Ensure high score is up-to-date on restart
        hideUI(mainMenu);
        hideUI(pauseMenu);
        hideUI(gameOverScreen);
        showUI(gameHUD);
    }

    function startGame() {
        if (gameRunning) return; // Prevent multiple starts

        resetGame();
        gameRunning = true;
        gamePaused = false;
        lastSpawnTime = Date.now(); // Initialize spawn timer
        backgroundMusic.play().catch(e => console.log("Music play failed:", e)); // Autoplay might be blocked without user interaction
        requestAnimationFrame(gameLoop);
    }

    function pauseGame() {
        if (!gameRunning || gamePaused) return;

        gamePaused = true;
        cancelAnimationFrame(animationFrameId);
        hideUI(gameHUD);
        showUI(pauseMenu);
        backgroundMusic.pause();
    }

    function resumeGame() {
        if (!gameRunning || !gamePaused) return;

        gamePaused = false;
        hideUI(pauseMenu);
        showUI(gameHUD);
        lastSpawnTime = Date.now(); // Reset spawn timer to avoid huge delta
        backgroundMusic.play();
        requestAnimationFrame(gameLoop);
    }

    function gameOver() {
        gameRunning = false;
        cancelAnimationFrame(animationFrameId);
        hideUI(gameHUD);
        showUI(gameOverScreen);
        finalScoreDisplay.textContent = score;
        updateHighScores();
        gameOverSound.currentTime = 0;
        gameOverSound.play();
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    function returnToMainMenu() {
        gameRunning = false;
        gamePaused = false;
        cancelAnimationFrame(animationFrameId);
        hideUI(gameHUD);
        hideUI(pauseMenu);
        hideUI(gameOverScreen);
        showUI(mainMenu);
        updateHighScores(); // Update high score on main menu
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        gameObjects.length = 0; // Clear objects when returning to menu
        particles.length = 0;
    }

    // --- Main Game Loop ---
    let lastFrameTime = 0;
    function gameLoop(currentTime) {
        if (!gameRunning || gamePaused) {
            lastFrameTime = currentTime; // Keep lastFrameTime updated even when paused
            return;
        }

        const deltaTime = currentTime - lastFrameTime; // Time in milliseconds since last frame
        lastFrameTime = currentTime;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn objects
        if (currentTime - lastSpawnTime > currentSpawnInterval) {
            spawnObject();
            lastSpawnTime = currentTime;
            // Gradually decrease spawn interval to increase difficulty
            currentSpawnInterval = Math.max(200, currentSpawnInterval * 0.99);
        }

        updateGameObjects(deltaTime / 16.666); // Adjust update based on ~60fps (1000ms/60frames)
        drawGameObjects();
        drawBladeTrail();

        // Update HUD
        updateScoreDisplay();
        updateComboDisplay();

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // --- Event Listeners ---

    // Canvas Mouse/Touch Input
    canvas.addEventListener('mousedown', (e) => {
        isSwiping = true;
        currentSwipePath = [{ x: e.clientX, y: e.clientY }];
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isSwiping) {
            currentSwipePath.push({ x: e.clientX, y: e.clientY });
            handleSwipe();
        }
    });

    canvas.addEventListener('mouseup', () => {
        isSwiping = false;
        currentSwipePath = []; // Clear blade trail
        // No fruit sliced in current swipe means combo broken, handled in handleSwipe now
    });

    canvas.addEventListener('mouseleave', () => { // If mouse leaves canvas during swipe
        isSwiping = false;
        currentSwipePath = [];
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior (scrolling, zooming)
        isSwiping = true;
        const touch = e.touches[0];
        currentSwipePath = [{ x: touch.clientX, y: touch.clientY }];
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        if (isSwiping) {
            const touch = e.touches[0];
            currentSwipePath.push({ x: touch.clientX, y: touch.clientY });
            handleSwipe();
        }
    });

    canvas.addEventListener('touchend', () => {
        isSwiping = false;
        currentSwipePath = [];
    });

    // UI Button Listeners
    playButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', pauseGame);
    resumeButton.addEventListener('click', resumeGame);
    restartPauseButton.addEventListener('click', () => {
        hideUI(pauseMenu);
        startGame();
    });
    mainMenuPauseButton.addEventListener('click', returnToMainMenu);
    restartButton.addEventListener('click', startGame);
    mainMenuGameOverButton.addEventListener('click', returnToMainMenu);

    // Initial setup
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Set initial canvas size
    updateHighScores(); // Load and display high score on load
});
