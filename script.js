// Game variables
let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let timeLeft = 30;
let gameActive = false;
let gamePaused = false;
let gameInterval;
let musicPlaying = false;

// Elements
const target = document.getElementById("target");
const startButton = document.getElementById("startGame");
const pauseButton = document.getElementById("pauseGame");
const musicButton = document.getElementById("toggleMusic");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const highScoreDisplay = document.getElementById("highScore");
const leaderboardList = document.getElementById("leaderboard-list");

// Audio Elements
const clickSound = new Audio("sounds/click.mp3");
const gameOverSound = new Audio("sounds/game-over.mp3");
const backgroundMusic = new Audio("sounds/background-music.mp3");
backgroundMusic.loop = true;

// Display stored high score
highScoreDisplay.innerText = highScore;

// Function to start the game
function startGame() {
    if (gameActive) return;

    console.log("Game Started!"); // Debugging log

    gameActive = true;
    gamePaused = false;
    score = 0;
    timeLeft = 30;
    scoreDisplay.innerText = score;
    timerDisplay.innerText = timeLeft;
    startButton.disabled = true;
    startButton.innerText = "Game in Progress...";
    pauseButton.innerText = "Pause";

    // Start the countdown timer
    gameInterval = setInterval(() => {
        if (!gamePaused && gameActive) {
            timeLeft--;
            timerDisplay.innerText = timeLeft;

            if (timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);

    spawnTarget(); // Ensure the target appears at the start
}

// Function to pause/resume the game
pauseButton.addEventListener("click", function () {
    if (!gameActive) return; // Prevent pausing if the game isn't active
    gamePaused = !gamePaused;
    pauseButton.innerText = gamePaused ? "Resume" : "Pause";
});

// Function to end the game
function endGame() {
    if (!gameActive) return; // Prevent multiple calls
    console.log("Game Over!");

    gameActive = false;
    clearInterval(gameInterval);
    target.style.display = "none";
    startButton.disabled = false;
    startButton.innerText = "Start Game";
    gameOverSound.play();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreDisplay.innerText = highScore;
    }

    updateLeaderboard(score);
}

// Function to spawn targets
function spawnTarget() {
    if (!gameActive || gamePaused || target.style.display === "block") return;

    console.log("Spawning Target..."); // Debugging log

    let board = document.querySelector(".game-board");
    let boardWidth = board.clientWidth;
    let boardHeight = board.clientHeight;
    let targetSize = 50;

    let randomX = Math.floor(Math.random() * (boardWidth - targetSize));
    let randomY = Math.floor(Math.random() * (boardHeight - targetSize));

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
    target.style.display = "block";

    setTimeout(() => {
        if (gameActive && !gamePaused) {
            target.style.display = "none";
            spawnTarget();
        }
    }, Math.max(800 - score * 10, 300));
}

// Target click event
target.addEventListener("click", function () {
    if (!gameActive || gamePaused) return;

    console.log("Target Clicked!"); // Debugging log

    clickSound.play();
    score++;
    scoreDisplay.innerText = score;

    target.style.display = "none";
    spawnTarget();
});

// Function to update leaderboard
function updateLeaderboard(newScore) {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push(newScore);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);
    localStorage.setItem("leaderboard", JSON.stringify(scores));

    leaderboardList.innerHTML = "";
    scores.forEach((score, index) => {
        let listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.innerText = `#${index + 1} - ${score} points`;
        leaderboardList.appendChild(listItem);
    });
}

// Background Music Toggle
musicButton.addEventListener("click", () => {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicButton.innerText = "🔇 Music Off";
    } else {
        backgroundMusic.play();
        musicButton.innerText = "🔊 Music On";
    }
    musicPlaying = !musicPlaying;
});

// Attach event listener to start button
startButton.addEventListener("click", startGame);
