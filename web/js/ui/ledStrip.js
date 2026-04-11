/* ============================================================
   ledStrip.js — Simulated LED strips adjacent to square canvas
   Minimalist white/gray scale with glowing blur effect
   ============================================================ */

const LED_COUNT = 18;

/**
 * Draw two vertical LED strips on the inner edges of the side panels,
 * right next to the square canvas.
 */
function drawLedStrips(amp, valueOfAmp, widthToPot, widthToPot2, themeTransition = 0) {
  const ledH = vizSize / LED_COUNT;
  const ledW = 9; // Core width reverted to 1.5x original
  const gap = 12; // Distance from square canvas
  const ctx = drawingContext;

  const leftX = vizX - gap - ledW;
  const rightX = vizX + vizSize + gap;

  push();
  rectMode(CORNER);
  noStroke();

  for (let i = 0; i < LED_COUNT; i++) {
    const y = vizY + i * ledH;
    let r, g, b, alphaMult;

    // Base canvas color synced with mouse/parameter logic
    const baseR = widthToPot;
    const baseG = widthToPot2;
    const baseB = constrain(255 - 255 * amp, 0, 255);

    // Dynamic color tuning based on amplitude while retaining canvas hue logic
    if (valueOfAmp > 90) {
      r = map(valueOfAmp, 90, 255, baseR, 255);
      g = map(valueOfAmp, 90, 255, baseG, 255);
      b = map(valueOfAmp, 90, 255, baseB, 255);
      alphaMult = map(valueOfAmp, 90, 255, 0.6, 1.0);
    } else if (valueOfAmp > 0) {
      r = baseR;
      g = baseG;
      b = baseB;
      alphaMult = map(valueOfAmp, 0, 90, 0.2, 0.6);
    } else {
      r = baseR * 0.25;
      g = baseG * 0.25;
      b = baseB * 0.25;
      alphaMult = 0.08;
    }

    // 1. Base Layer: Lerp between Light (Warm Yellow) and Dark (Moody Deep Violet)
    const tr = lerp(255, 60, themeTransition);
    const tg = lerp(200, 20, themeTransition);
    const tb = lerp(80, 100, themeTransition);
    const ta = lerp(20, 30, themeTransition); 

    ctx.shadowBlur = 30;
    ctx.shadowColor = `rgba(${int(tr)}, ${int(tg)}, ${int(tb)}, 0.4)`;
    fill(tr, tg, tb, ta); 
    // Base layer preserved at 3x width (30px) and centered using -10.5 offset
    rect(leftX - 10.5, y, 30, ledH - 2, 1);
    rect(rightX - 10.5, y, 30, ledH - 2, 1);

    // 2. Chameleon Active Core
    const alpha = 255 * alphaMult;

    ctx.shadowBlur = 15 + amp * 20;
    ctx.shadowColor = `rgba(${int(r)}, ${int(g)}, ${int(b)}, ${alphaMult * 0.7})`;

    fill(r, g, b, alpha * 0.3);
    // Glow layer preserved matching 3x scale logic
    rect(leftX - 8.5, y + 1, 26, ledH - 4, 1);
    rect(rightX - 8.5, y + 1, 26, ledH - 4, 1);

    ctx.shadowBlur = 8 + amp * 12;
    ctx.shadowColor = `rgba(${int(r)}, ${int(g)}, ${int(b)}, ${alphaMult})`;

    fill(r, g, b, alpha);
    rect(leftX, y + 2, ledW, ledH - 6, 0); // Brutalist sharp core (1.5x width)
    rect(rightX, y + 2, ledW, ledH - 6, 0);
  }

  ctx.shadowBlur = 0;
  pop();
}
