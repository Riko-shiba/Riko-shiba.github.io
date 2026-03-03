// ===== Canvas Setup =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== Game States =====
const STATE = {
START: "START",
PLAYING: "PLAYING",
GAME_OVER: "GAME_OVER"
};

let currentState = STATE.START;

// ===== Player Class =====
class Player {
constructor() {
this.width = 60;
this.height = 60;
this.x = canvas.width / 2 - this.width / 2;
this.y = canvas.height - 100;
this.speed = 8;
}

draw() {
ctx.fillStyle = "cyan";
ctx.fillRect(this.x, this.y, this.width, this.height);
}

move(direction) {
if (direction === "left" && this.x > 0) {
this.x -= this.speed;
}
if (direction === "right" && this.x < canvas.width - this.width) {
this.x += this.speed;
}
}
}

// ===== Falling Object Class =====
class FallingObject {
constructor(type) {
this.size = 30;
this.x = Math.random() * (canvas.width - this.size);
this.y = -this.size;
this.speed = 5 + Math.random() * 3;
this.type = type; // "good" or "bad"
}

draw() {
ctx.fillStyle = this.type === "good" ? "yellow" : "red";
ctx.beginPath();
ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
ctx.fill();
}

update() {
this.y += this.speed;
}
}

// ===== Game Variables =====// 
let player = new Player();
let objects = [];
let score = 0;
let lives = 3;
let difficultyTimer = 0;

// ===== Input Handling (Touch & Click) =====
canvas.addEventListener("touchmove", (e) => {
const touchX = e.touches[0].clientX;
player.x = touchX - player.width / 2;
});

canvas.addEventListener("mousemove", (e) => {
player.x = e.clientX - player.width / 2;
});

canvas.addEventListener("click", () => {
if (currentState === STATE.START) {
currentState = STATE.PLAYING;
} else if (currentState === STATE.GAME_OVER) {
restartGame();
}
});

// ===== Collision Detection =====
function checkCollision(rect, circle) {
return (
circle.x < rect.x + rect.width &&
circle.x + circle.size > rect.x &&
circle.y < rect.y + rect.height &&
circle.y + circle.size > rect.y
);
}

// ===== Game Loop =====
function gameLoop() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

if (currentState === STATE.START) {
drawText("Tap to Start", canvas.width / 2, canvas.height / 2);
}

else if (currentState === STATE.PLAYING) {
player.draw();
spawnObjects();
updateObjects();
drawScore();
}

else if (currentState === STATE.GAME_OVER) {
drawText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50);
drawText("Tap to Restart", canvas.width / 2, canvas.height / 2);
}

requestAnimationFrame(gameLoop);
}

function drawText(text, x, y) {
ctx.fillStyle = "white";
ctx.font = "40px Arial";
ctx.textAlign = "center";
ctx.fillText(text, x, y);
}

// ===== Spawn Objects =====
function spawnObjects() {
difficultyTimer++;

if (Math.random() < 0.02 + difficultyTimer / 10000) {
const type = Math.random() < 0.7 ? "good" : "bad";
objects.push(new FallingObject(type));
}
}

// ===== Update Objects =====
function updateObjects() {
for (let i = objects.length - 1; i >= 0; i--) {
objects[i].update();
objects[i].draw();

if (checkCollision(player, objects[i])) {
if (objects[i].type === "good") {
score += 10;
} else {
lives--;
}
objects.splice(i, 1);
}

if (objects[i] && objects[i].y > canvas.height) {
objects.splice(i, 1);
}
}

if (lives <= 0) {
currentState = STATE.GAME_OVER;
}
}

// ===== UI =====
function drawScore() {
ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText("Score: " + score, 80, 30);
ctx.fillText("Lives: " + lives, 80, 60);
}

// ===== Restart =====
function restartGame() {
score = 0;
lives = 3;
objects = [];
difficultyTimer = 0;
currentState = STATE.PLAYING;
}

// ===== Start Game Loop =====
gameLoop();

