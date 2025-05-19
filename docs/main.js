/* ========================================
   Breakout Game - Updated and Optimized
   ======================================== */

// Espera a que todo el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    // Menú hamburguesa
    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.querySelector("nav ul");
    menuToggle.addEventListener("click", () => {
        navList.classList.toggle("activo");
    });

    // Modo oscuro
    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("tema");
    if (savedTheme === "oscuro") {
        document.body.classList.add("oscuro");
        themeToggle.textContent = "🌞 Modo Claro";
    } else {
        themeToggle.textContent = "🌙 Modo Oscuro";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("oscuro");
        const isDark = document.body.classList.contains("oscuro");
        localStorage.setItem("tema", isDark ? "oscuro" : "claro");
        themeToggle.textContent = isDark ? "🌞 Modo Claro" : "🌙 Modo Oscuro";
    });

    // Botón para volver arriba
    const scrollToTopBtn = document.getElementById("scrollToTop");
    window.addEventListener("scroll", () => {
        scrollToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
/* ===============================
   Breakout Game Implementation
   =============================== */

const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let score = 0;
let lives = 3;
let gameRunning = false;

// Pelota
const ballRadius = 10;
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 2,
    dy: -2,
    radius: ballRadius,
};

// Paleta
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Control de teclas
let rightPressed = false;
let leftPressed = false;

// Ladrillos
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];

function createBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Eventos de teclado
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

// Dibuja la pelota
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

// Dibuja la paleta
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

// Dibuja los ladrillos
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#ff6666";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Función principal de dibujo
function draw() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    requestAnimationFrame(draw);
}

// Función para iniciar el juego
function startGame() {
    gameRunning = true;
    createBricks();
    draw();
}

// Botón de inicio
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
    document.getElementById("startScreen").style.display = "none";
    startGame();
});