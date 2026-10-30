// Dynamic cinematic screen texture generator using HTML5 Canvas
// Renders rich animated movie visuals (stars, nebula, neon grids, cinematic titles, light beams)
// that naturally reflect light throughout the 3D theater.

export class ScreenCanvasTexture {
  constructor(width = 1024, height = 512) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.time = 0;
    this.movieTitle = 'Dune: Part Two';
    this.movieTagline = 'LONG LIVE THE FIGHTERS';
    this.accentColor = '#f59e0b';
    this.isPlaying = true;
    this.trailerStyle = 'dune-2'; // 'dune-2', 'interstellar', 'cyberpunk-2099', 'oppenheimer'
  }

  setMovie(movie) {
    if (!movie) return;
    this.movieTitle = movie.title;
    this.movieTagline = movie.tagline || 'IN CINEMAS NOW';
    this.accentColor = movie.accentColor || '#f59e0b';
    this.trailerStyle = movie.id || 'dune-2';
  }

  togglePlay(forceState) {
    this.isPlaying = forceState !== undefined ? forceState : !this.isPlaying;
    return this.isPlaying;
  }

  update(delta = 0.016) {
    if (!this.isPlaying) return false;
    this.time += delta;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear background
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, w, h);

    if (this.trailerStyle === 'interstellar') {
      this.drawInterstellarScene(ctx, w, h);
    } else if (this.trailerStyle === 'cyberpunk-2099') {
      this.drawCyberpunkScene(ctx, w, h);
    } else if (this.trailerStyle === 'oppenheimer') {
      this.drawOppenheimerScene(ctx, w, h);
    } else {
      this.drawDuneScene(ctx, w, h);
    }

    // Cinema Letterbox Bars (subtle 2.39:1 aspect ratio aesthetic)
    ctx.fillStyle = '#000000';
    const barHeight = h * 0.08;
    ctx.fillRect(0, 0, w, barHeight);
    ctx.fillRect(0, h - barHeight, w, barHeight);

    // Audio / format badge watermark in corner
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('IMAX® LASER 4K', 40, barHeight + 35);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '12px sans-serif';
    ctx.fillText('12.1 IMMERSIVE AUDIO', 40, barHeight + 52);

    // Rec dot animation
    const blink = Math.sin(this.time * 4) > 0;
    if (blink) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(w - 70, barHeight + 35, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px monospace';
    ctx.fillText('TRAILER', w - 55, barHeight + 39);
    ctx.restore();

    return true; // indicates canvas was updated
  }

  drawDuneScene(ctx, w, h) {
    const t = this.time;

    // Glowing sun / spice atmosphere
    const grad = ctx.createRadialGradient(
      w * 0.5 + Math.sin(t * 0.5) * 80,
      h * 0.45,
      20,
      w * 0.5,
      h * 0.5,
      w * 0.7
    );
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.2, '#f59e0b');
    grad.addColorStop(0.5, '#b45309');
    grad.addColorStop(0.8, '#451a03');
    grad.addColorStop(1, '#090503');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Dunes silhouette waves
    for (let layer = 1; layer <= 4; layer++) {
      ctx.fillStyle = `rgba(${30 - layer * 5}, ${15 - layer * 3}, ${8}, ${0.85 + layer * 0.04})`;
      ctx.beginPath();
      ctx.moveTo(0, h);
      const layerOffset = layer * 40;
      const speed = 0.3 / layer;
      for (let x = 0; x <= w; x += 20) {
        const y =
          h * 0.55 +
          layerOffset +
          Math.sin(x * 0.004 + t * speed + layer) * 45 +
          Math.cos(x * 0.009 - t * speed) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    }

    // Floating spice particles
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 40; i++) {
      const px = (Math.sin(i * 99 + t * 0.4) * 0.5 + 0.5) * w;
      const py = ((i * 37 + t * (20 + (i % 15))) % (h * 0.7)) + h * 0.15;
      const size = (i % 3) + 1.2;
      const alpha = Math.sin(t * 2 + i) * 0.4 + 0.6;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Cinematic Title typography
    this.drawCinematicTitle(ctx, w, h, 'D U N E', 'PART TWO • ONLY IN THEATRES', '#fef3c7');
  }

  drawInterstellarScene(ctx, w, h) {
    const t = this.time;

    // Deep space gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#030712');
    bgGrad.addColorStop(0.5, '#0c1a30');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Accretion disk of Gargantua
    const cx = w * 0.5;
    const cy = h * 0.48;

    ctx.save();
    ctx.translate(cx, cy);

    // Glowing disk rings
    for (let r = 160; r >= 60; r -= 15) {
      ctx.strokeStyle = `rgba(56, 189, 248, ${(170 - r) / 280})`;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.8, r * 0.5, Math.sin(t * 0.1) * 0.1, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Black hole sphere
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 2);
    ctx.fill();

    // Event horizon photon ring
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, 76, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Starfield
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 137.5) % w);
      const sy = ((i * 269.3 + t * 4) % h);
      const twinkle = Math.sin(t * 3 + i) * 0.5 + 0.5;
      ctx.globalAlpha = twinkle * 0.8;
      ctx.fillRect(sx, sy, 1.8, 1.8);
    }
    ctx.globalAlpha = 1.0;

    this.drawCinematicTitle(ctx, w, h, 'INTERSTELLAR', '10TH ANNIVERSARY • IN 70MM IMAX', '#e0f2fe');
  }

  drawCyberpunkScene(ctx, w, h) {
    const t = this.time;

    // Dark neon sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#110524');
    sky.addColorStop(0.6, '#280c44');
    sky.addColorStop(1, '#080112');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Grid perspective floor
    ctx.save();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.45;
    const horizon = h * 0.55;

    // Radiating lines
    for (let x = -w * 0.5; x <= w * 1.5; x += 60) {
      ctx.beginPath();
      ctx.moveTo(w * 0.5, horizon);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Horizontal grid lines moving forward
    const gridSpeed = (t * 80) % 30;
    for (let y = 0; y < 12; y++) {
      const lineY = horizon + Math.pow(y / 11, 2) * (h - horizon) + gridSpeed * (y / 11);
      if (lineY <= h) {
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(w, lineY);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Neon synth sun
    const sunGrad = ctx.createLinearGradient(0, h * 0.2, 0, horizon);
    sunGrad.addColorStop(0, '#ec4899');
    sunGrad.addColorStop(0.6, '#f43f5e');
    sunGrad.addColorStop(1, '#fbbf24');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w * 0.5, horizon, 110, Math.PI, 0);
    ctx.fill();

    this.drawCinematicTitle(ctx, w, h, 'NEO TOKYO 2099', 'A CYBERPUNK EXPERIENCE • DOLBY CINEMA', '#f472b6');
  }

  drawOppenheimerScene(ctx, w, h) {
    const t = this.time;

    // Nuclear firestorm swirl
    const fire = ctx.createRadialGradient(
      w * 0.5,
      h * 0.45,
      30,
      w * 0.5,
      h * 0.45,
      w * 0.65
    );
    fire.addColorStop(0, '#ffffff');
    fire.addColorStop(0.15, '#fed7aa');
    fire.addColorStop(0.4, '#ea580c');
    fire.addColorStop(0.7, '#7c2d12');
    fire.addColorStop(1, '#090503');
    ctx.fillStyle = fire;
    ctx.fillRect(0, 0, w, h);

    // Turbulent particles
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 35; i++) {
      const angle = i * 0.35 + t * 0.8;
      const dist = 50 + (i * 12) + Math.sin(t * 2 + i) * 20;
      const px = w * 0.5 + Math.cos(angle) * dist;
      const py = h * 0.45 + Math.sin(angle) * (dist * 0.6);
      ctx.fillStyle = i % 2 === 0 ? '#ffedd5' : '#f97316';
      ctx.beginPath();
      ctx.arc(px, py, 6 + (i % 8), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    this.drawCinematicTitle(ctx, w, h, 'OPPENHEIMER', 'NOW PLAYING • FILMED FOR IMAX', '#fed7aa');
  }

  drawCinematicTitle(ctx, w, h, title, subtitle, textColor) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;

    // Main title
    ctx.fillStyle = textColor;
    ctx.font = '900 48px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '12px';
    ctx.fillText(title, w * 0.5, h * 0.45);

    // Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.font = '600 16px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText(subtitle, w * 0.5, h * 0.56);

    ctx.restore();
  }
}

