/**
 * Falling Rose & Marigold Petals Particle Canvas
 * Royal Indian Wedding Animation
 */
class PetalCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.petals = [];
    this.maxPetals = 38;
    this.isRunning = true;

    this.colors = [
      { r: 218, g: 41, b: 67, a: 0.8 },   // Deep Royal Rose
      { r: 243, g: 90, b: 124, a: 0.75 }, // Soft Pink Rose
      { r: 245, g: 158, b: 11, a: 0.85 }, // Golden Marigold (Genda phool)
      { r: 251, g: 191, b: 36, a: 0.8 },  // Bright Marigold Yellow
      { r: 212, g: 175, b: 55, a: 0.7 }   // Royal Gold Shimmer
    ];

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.init();
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createPetal() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * -this.canvas.height,
      size: Math.random() * 12 + 10,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      speedY: Math.random() * 1.4 + 0.8,
      speedX: Math.random() * 1.5 - 0.75,
      angle: Math.random() * 360,
      spinSpeed: (Math.random() - 0.5) * 2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.015,
      shape: Math.random() > 0.4 ? 'rose' : 'marigold'
    };
  }

  init() {
    this.petals = [];
    for (let i = 0; i < this.maxPetals; i++) {
      const petal = this.createPetal();
      petal.y = Math.random() * this.canvas.height;
      this.petals.push(petal);
    }
  }

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.angle * Math.PI) / 180);

    const scaleX = Math.cos(p.wobble);
    ctx.scale(scaleX, 1);

    const { r, g, b, a } = p.color;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.strokeStyle = `rgba(${Math.min(r + 20, 255)}, ${Math.min(g + 20, 255)}, ${b}, ${a * 0.5})`;
    ctx.lineWidth = 0.8;

    ctx.beginPath();
    if (p.shape === 'rose') {
      // Elegant teardrop rose petal shape
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.9, p.size * 0.6, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.6, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
    } else {
      // Frilly marigold petal shape
      ctx.moveTo(0, -p.size * 0.8);
      ctx.quadraticCurveTo(p.size * 0.6, -p.size * 0.2, p.size * 0.5, p.size * 0.8);
      ctx.quadraticCurveTo(0, p.size * 0.5, -p.size * 0.5, p.size * 0.8);
      ctx.quadraticCurveTo(-p.size * 0.6, -p.size * 0.2, 0, -p.size * 0.8);
    }

    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.wobble) * 0.6;
      p.angle += p.spinSpeed;
      p.wobble += p.wobbleSpeed;

      // Wrap around when falling past bottom
      if (p.y > this.canvas.height + 20) {
        this.petals[i] = this.createPetal();
        this.petals[i].y = -20;
      }

      if (p.x > this.canvas.width + 30) p.x = -30;
      if (p.x < -30) p.x = this.canvas.width + 30;

      this.drawPetal(p);
    }

    requestAnimationFrame(this.animate);
  }

  toggle() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      requestAnimationFrame(this.animate);
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    return this.isRunning;
  }
}

window.PetalCanvas = PetalCanvas;
