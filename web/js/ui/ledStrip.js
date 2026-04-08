/* ============================================================
   ledStrip.js — Simulated LED strips adjacent to square canvas
   Minimalist white/gray scale with glowing blur effect
   ============================================================ */

const LED_COUNT = 18;

/**
 * Draw two vertical LED strips on the inner edges of the side panels,
 * right next to the square canvas.
 */
function drawLedStrips(amp, valueOfAmp, widthToPot, widthToPot2) {
  const ledH = vizSize / LED_COUNT;
  const ledW = 6;
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
      // High intensity: flash towards pure white
      r = map(valueOfAmp, 90, 255, baseR, 255);
      g = map(valueOfAmp, 90, 255, baseG, 255);
      b = map(valueOfAmp, 90, 255, baseB, 255);
      alphaMult = map(valueOfAmp, 90, 255, 0.6, 1.0);
    } else if (valueOfAmp > 0) {
      // Medium/Low intensity: standard base color
      r = baseR;
      g = baseG;
      b = baseB;
      alphaMult = map(valueOfAmp, 0, 90, 0.2, 0.6);
    } else {
      // Idle state: very dim, deeply tinted canvas hue
      r = baseR * 0.25;
      g = baseG * 0.25;
      b = baseB * 0.25;
      alphaMult = 0.08;
    }

    const alpha = 255 * alphaMult;

    // Glow layer (larger, blurred)
    ctx.shadowBlur = 15 + amp * 20;
    ctx.shadowColor = `rgba(${int(r)}, ${int(g)}, ${int(b)}, ${alphaMult * 0.7})`;

    fill(r, g, b, alpha * 0.3);
    rect(leftX - 4, y + 1, ledW + 8, ledH - 2, 5);
    rect(rightX - 4, y + 1, ledW + 8, ledH - 2, 5);

    // Core LED (brighter)
    ctx.shadowBlur = 8 + amp * 12;
    ctx.shadowColor = `rgba(${int(r)}, ${int(g)}, ${int(b)}, ${alphaMult})`;

    fill(r, g, b, alpha);
    rect(leftX, y + 2, ledW, ledH - 4, 3);
    rect(rightX, y + 2, ledW, ledH - 4, 3);
  }

  ctx.shadowBlur = 0;
  pop();
}
