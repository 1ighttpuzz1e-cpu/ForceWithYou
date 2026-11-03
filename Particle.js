class Particle {
  constructor(mass = 1, c = color(0)) {
    this.mass = mass;
    this.w = 32 * Math.sqrt(this.mass);

    this.pos = createVector(width / 2, height / 3);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.c = c;

    this.floorY = height; // 바닥의 y 위치 (게임에서는 지면 위쪽)
    this.bounce = 0.98; // 벽에 부딪힐 때 남는 속도의 비율
    this.minBounce = 10; // 바닥에서 튕겨 오르는 최소 속도
    this.jumpBoost = 0; // 스페이스바를 누르면 추가되는 점프력
  }

  // 힘을 질량으로 나눠서 가속도로 바꾼다. (F = ma)
  addForce(aForce) {
    this.acc.add(p5.Vector.div(aForce, this.mass));
  }

  update() {
    // 저항: 아주 약하게 (옆으로 미끄러지는 운동이 오래 유지되도록)
    let drag = this.vel.copy().mult(-0.002);
    this.addForce(drag);

    this.vel.add(this.acc);
    this.vel.limit(20);
    this.pos.add(this.vel);

    // 힘은 매 프레임 새로 계산한다
    this.acc.set(0, 0);
    this.checkEdge();
  }

  checkEdge() {
    let r = this.w / 2;

    // 바닥: 속도가 줄어도 항상 minBounce 이상으로 다시 튕겨 오른다
    if (this.pos.y + r > this.floorY) {
      this.pos.y = this.floorY - r;
      let speed = Math.max(Math.abs(this.vel.y) * this.bounce, this.minBounce);
      this.vel.y = -(speed + this.jumpBoost);
    }
    if (this.pos.y - r < 0) {
      this.pos.y = r;
      this.vel.y *= -this.bounce;
    }
    if (this.pos.x + r > width) {
      this.pos.x = width - r;
      this.vel.x *= -this.bounce;
    }
    if (this.pos.x - r < 0) {
      this.pos.x = r;
      this.vel.x *= -this.bounce;
    }
  }

  show() {
    // 점프력이 올라가 있는 동안 얇은 링으로 표시
    if (this.jumpBoost > 0) {
      noFill();
      stroke(90, 120, 210, 130);
      strokeWeight(2);
      circle(this.pos.x, this.pos.y, this.w + 10);
    }

    noStroke();
    fill(this.c);
    circle(this.pos.x, this.pos.y, this.w);
  }
}
