/* ========================================
   main.js
   Controla el menú hamburguesa y modo oscuro
   ======================================== */

// Espera a que todo el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    // Botón para abrir/cerrar el menú
    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.querySelector("nav ul");

    // Evento para mostrar u ocultar el menú en móviles
    menuToggle.addEventListener("click", () => {
        navList.classList.toggle("activo");
    });

    // Botón para alternar modo claro/oscuro
    const themeToggle = document.getElementById("theme-toggle");

    // Verifica si el usuario ya tiene un tema guardado
    const savedTheme = localStorage.getItem("tema");
    if (savedTheme === "oscuro") {
        document.body.classList.add("oscuro");
        themeToggle.textContent = "🌞 Modo Claro";
    } else {
        themeToggle.textContent = "🌙 Modo Oscuro";
    }

    // Evento para cambiar entre modo claro y oscuro
    themeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("oscuro")) {
            document.body.classList.remove("oscuro");
            localStorage.setItem("tema", "claro");
            themeToggle.textContent = "🌙 Modo Oscuro";
        } else {
            document.body.classList.add("oscuro");
            localStorage.setItem("tema", "oscuro");
            themeToggle.textContent = "🌞 Modo Claro";
        }
    });

    // Botón para volver arriba (scrollToTop)
    const scrollToTopBtn = document.getElementById("scrollToTop");

    // Mostrar botón cuando el usuario baja
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });

    // Volver arriba cuando se hace clic en el botón
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// ===============================
// Breakout Game Implementation
// ===============================

const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let score = 0;
let lives = 3;

// Pelota
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

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

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Eventos de teclado
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// Dibuja la pelota
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
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

// Detección de colisiones
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          document.getElementById("score").textContent = score;
          if (score === brickRowCount * brickColumnCount) {
            alert("¡Felicidades! Has ganado.");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Dibuja la puntuación y vidas
function drawScore() {
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
}

// Función principal de dibujo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("Fin del juego");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();

