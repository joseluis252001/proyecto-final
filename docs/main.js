/* ========================================
   Breakout Game - Final Version (Con Etiquetas Adicionales)
   ======================================== */

// Evento que espera a que el DOM esté completamente cargado
// Esto garantiza que los elementos HTML estén listos antes de agregar eventos
document.addEventListener("DOMContentLoaded", () => {
    // Manejo del menú desplegable (hamburguesa)
    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.querySelector("nav ul");
    // Alterna la visibilidad del menú al hacer clic en el botón
    menuToggle.addEventListener("click", () => {
        navList.classList.toggle("activo");
    });

    // Gestión del modo oscuro/claro
    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("tema");
    // Verifica si el tema guardado es "oscuro" y lo aplica
    if (savedTheme === "oscuro") {
        document.body.classList.add("oscuro");
        themeToggle.textContent = "🌞 Modo Claro";
    } else {
        themeToggle.textContent = "🌙 Modo Oscuro";
    }

    // Alterna el tema oscuro/claro cuando el botón es presionado
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("oscuro");
        const isDark = document.body.classList.contains("oscuro");
        // Almacena el estado del tema en el almacenamiento local
        localStorage.setItem("tema", isDark ? "oscuro" : "claro");
        themeToggle.textContent = isDark ? "🌞 Modo Claro" : "🌙 Modo Oscuro";
    });

    // Botón para volver al principio de la página
    const scrollToTopBtn = document.getElementById("scrollToTop");
    // Detecta el desplazamiento de la página
    window.addEventListener("scroll", () => {
        // Muestra el botón solo si se ha desplazado más de 300 píxeles
        scrollToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    // Al hacer clic, vuelve a la parte superior con un desplazamiento suave
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
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

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

// Colores y puntos de los bloques
const blockColors = [
    { color: "purple", points: 10 },
    { color: "blue", points: 5 },
    { color: "green", points: 3 },
    { color: "yellow", points: 7 },
    { color: "orange", points: 8 },
    { color: "red", points: 12 },
    { color: "pink", points: 20 },
];

// Ladrillos
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];

// Crear ladrillos
function createBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            const { color, points } = blockColors[Math.floor(Math.random() * blockColors.length)];
            bricks[c][r] = { x: 0, y: 0, status: 1, color, points };
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

//Dibujar la Paleta
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Mueve la paleta
function movePaddle() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
    if (leftPressed && paddleX > 0) paddleX -= 7;
}


// Mueve la pelota
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisión con los bordes
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
    if (ball.y - ball.radius < 0) ball.dy = -ball.dy;

    // Colisión con la plataforma
    if (
        ball.y + ball.radius > canvas.height - paddleHeight &&
        ball.x > paddleX &&
        ball.x < paddleX + paddleWidth
    ) ball.dy = -ball.dy;

    // Colisión con el borde inferior
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        updateLives();
        if (lives === 0) {
            alert("¡Juego terminado!");
            document.location.reload();
        } else {
            resetBall();
        }
    }
}

//resetear posisión de la bola
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = 2 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -2;
}

canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

// Manejo de movimiento táctil
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

function handleTouchStart(e) {
    const touchX = e.touches[0].clientX;
    movePaddleTo(touchX);
}

function handleTouchMove(e) {
    e.preventDefault();  // Evitar el desplazamiento de la página
    const touchX = e.touches[0].clientX;
    movePaddleTo(touchX);
}

function movePaddleTo(x) {
    const rect = canvas.getBoundingClientRect();
    const relativeX = x - rect.left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Dibuja la pelota
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

// Colisiones con ladrillos
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x && ball.x < b.x + brickWidth &&
                    ball.y > b.y && ball.y < b.y + brickHeight
                ) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score += b.points;
                    updateScore();
                    if (checkVictory()) alert("¡Ganaste!");
                }
            }
        }
    }
}

//Llamar funcion actualizar marcador:
function updateScore() {
    const scoreElement = document.getElementById("score");
    console.log("Elemento de puntuación encontrado:", scoreElement);
    console.log("Valor de puntuación antes de actualizar:", score);
    if (scoreElement) {
        scoreElement.textContent = score;
        console.log("Puntuación actualizada a:", score);
    } else {
        console.error("No se encontró el elemento 'score'");
    }
}
//Llamar funcion actualizar perder una vida:
function updateLives() {
    const livesElement = document.getElementById("lives");
    console.log("Elemento de vidas encontrado:", livesElement);
    console.log("Valor de vidas antes de actualizar:", lives);
    if (livesElement) {
        livesElement.textContent = lives;
        console.log("Vidas actualizadas a:", lives);
    } else {
        console.error("No se encontró el elemento 'lives'");
    }
}


//actualizar  marcador
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
    document.getElementById("startScreen").style.display = "none";
    startGame();
});

function updateScore() {
    document.getElementById("score").textContent = score;
}

function updateLives() {
    document.getElementById("lives").textContent = lives;
}



//Dibujar Ladrillos
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
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Verificar victoria
function checkVictory() {
    const allBricksCleared = bricks.flat().every(b => b.status === 0);
    if (allBricksCleared) {
        alert("¡Ganaste!");
        gameRunning = false;  // Detener el juego
        showStartScreen();    // Mostrar pantalla de inicio
    }
    return allBricksCleared;
}

// Mostrar pantalla de inicio
function showStartScreen() {
    const startScreen = document.getElementById("startScreen");
    startScreen.style.display = "block";  // Mostrar el botón de jugar
}

// Dibuja el juego
function draw() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    movePaddle();
    moveBall();
    collisionDetection();
    requestAnimationFrame(draw);
}

// Inicia el juego
function startGame() {
    gameRunning = true;
    createBricks();
    draw();
}

//fin de juego
function showEndScreen() {
    const endScreen = document.getElementById("endScreen");
    endScreen.style.display = "block";
    const endMessage = document.getElementById("endMessage");
    endMessage.textContent = "¡Juego terminado! Puntuación: " + score;
}