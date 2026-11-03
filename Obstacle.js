class Obstacle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // 원(공)과 사각형(장애물)의 충돌 검사
  hitsCircle(cx, cy, r) {
    let nx = constrain(cx, this.x, this.x + this.w);
    let ny = constrain(cy, this.y, this.y + this.h);
    let dx = cx - nx;
    let dy = cy - ny;
    return dx * dx + dy * dy < r * r;
  }

  show() {
    noStroke();
    fill(96, 112, 135);
    rect(this.x, this.y, this.w, this.h, 4);

    // 윗면 하이라이트
    fill(135, 152, 178);
    rect(this.x + 3, this.y + 3, this.w - 6, 3, 1.5);
  }
}
