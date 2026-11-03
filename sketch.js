const GROUND_H = 48; // 바닥(지면)의 두께
const GRAVITY = 0.4;
const JUMP_BOOST = 4; // 스페이스바를 누를 때 추가되는 점프력
const MOVE_SPEED = 7; // 좌우로 낼 수 있는 최대 속도

const SCROLL_BASE = 2.5; // 처음 장애물이 다가오는 속도
const SCROLL_MAX = 3; // 시간이 지나면 추가되는 최대 속도

let ball;
let obstacles = [];

let playing = true;
let startFrame = 0;
let timeAlive = 0; // 살아남은 시간(초)
let distance = 0; // 진행한 거리(px)
let spawnCooldown = 0;

function setup() {
  createCanvas(640, 360);
  resetGame();
}

function resetGame() {
  ball = new Particle(1, color(35));
  ball.pos.set(250, height * 0.25);
  ball.floorY = height - GROUND_H; // 공이 튕기는 바닥

  obstacles = [];

  playing = true;
  startFrame = frameCount;
  timeAlive = 0;
  distance = 0;
  spawnCooldown = 90; // 시작하고 잠시 여유를 준다
}

function draw() {
  background(235);

  let groundY = height - GROUND_H;

  if (playing) {
    timeAlive = (frameCount - startFrame) / 60;
    let scrollSpeed = SCROLL_BASE + min(timeAlive * 0.15, SCROLL_MAX);
    distance += scrollSpeed;

    // 장애물이 오른쪽에서 계속 다가온다
    for (let o of obstacles) {
      o.x -= scrollSpeed;
    }
    obstacles = obstacles.filter((o) => o.x + o.w > -30);

    spawnCooldown -= 1;
    if (spawnCooldown <= 0) {
      spawnObstacle();
      spawnCooldown = random(55, 90);
    }

    // ← → : 좌우 이동 (키를 떼도 관성으로 계속 미끄러진다)
    let dir = 0;
    if (keyIsDown(LEFT_ARROW)) dir -= 1;
    if (keyIsDown(RIGHT_ARROW)) dir += 1;

    if (dir !== 0) {
      let targetVX = dir * MOVE_SPEED;
      ball.addForce(createVector((targetVX - ball.vel.x) * 0.15 * ball.mass, 0));
    }

    // SPACE / ↑ : 더 높이 점프
    ball.jumpBoost = keyIsDown("Space") || keyIsDown(UP_ARROW) ? JUMP_BOOST : 0;

    // ↓ : 빠르게 떨어지기
    if (keyIsDown(DOWN_ARROW)) {
      ball.addForce(createVector(0, 0.6 * ball.mass, 0));
    }

    // 중력
    ball.addForce(createVector(0, GRAVITY * ball.mass));

    ball.update();

    // 장애물에 닿으면 게임 오버 (판정은 공보다 조금 작게)
    for (let o of obstacles) {
      if (o.hitsCircle(ball.pos.x, ball.pos.y, ball.w / 2 - 6)) {
        playing = false;
        ball.jumpBoost = 0;
        break;
      }
    }
  }

  drawGround(groundY);

  for (let o of obstacles) {
    o.show();
  }

  drawShadow(groundY);
  ball.show();

  drawHud();

  if (!playing) {
    drawGameOver();
  }
}

function spawnObstacle() {
  let w = random(40, 70);
  let h = 10;
  let y = random(150, 250);

  obstacles.push(new Obstacle(width + 20, y, w, h));
}

function drawGround(groundY) {
  noStroke();
  fill(205, 218, 210);
  rect(0, groundY, width, GROUND_H);

  // 바닥이 흘러가는 느낌을 주는 무늬
  fill(190, 205, 196);
  let offset = distance % 40;
  for (let x = -offset; x < width; x += 40) {
    rect(x, groundY + 10, 18, GROUND_H - 20, 3);
  }

  stroke(120, 150, 135);
  strokeWeight(3);
  line(0, groundY, width, groundY);
}

function drawShadow(groundY) {
  // 높이 날수록 그림자가 작고 옅게
  let h = constrain(groundY - ball.pos.y, 0, 260);
  let s = map(h, 0, 260, ball.w * 1.1, ball.w * 0.5);

  noStroke();
  fill(60, 70, 65, 40);
  ellipse(ball.pos.x, groundY + 6, s, s * 0.32);
}

function drawHud() {
  noStroke();
  fill(120);
  textAlign(LEFT, TOP);
  textSize(12);
  text("← → 이동 · SPACE / ↑ 점프 · ↓ 빠른 낙하", 12, 12);

  fill(145);
  text("장애물을 피하세요", 12, 30);

  textAlign(RIGHT, TOP);
  fill(70);
  textSize(16);
  text(`${Math.floor(distance / 10)}m`, width - 12, 10);
  fill(145);
  textSize(12);
  text(`${timeAlive.toFixed(1)}초`, width - 12, 32);
  textAlign(LEFT, TOP);
}

function drawGameOver() {
  noStroke();
  fill(235, 235, 235, 210);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);

  fill(60);
  textSize(30);
  text("GAME OVER", width / 2, height / 2 - 34);

  fill(110);
  textSize(14);
  text(
    `기록 ${Math.floor(distance / 10)}m · ${timeAlive.toFixed(1)}초`,
    width / 2,
    height / 2 + 4
  );

  fill(90, 120, 210);
  textSize(14);
  text("클릭해서 다시 시작", width / 2, height / 2 + 34);

  textAlign(LEFT, TOP);
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  if (!playing) {
    resetGame();
  }
}

function keyPressed() {
  // 화살표 키로 페이지가 스크롤되지 않도록
  if (key === " " || key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
    return false;
  }
}
