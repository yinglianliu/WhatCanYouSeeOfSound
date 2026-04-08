/* ============================================================
   lively.js — Lively visual pattern (radiating lines + dot background)
   Uses vizSize (global) instead of width/height for square canvas
   ============================================================ */

function drawLivelyPattern(amp, potToWidth, widthToPot, widthToPot2) {
  // Semi-transparent overlay for trail effect
  rectMode(CORNER);
  noStroke();
  fill(widthToPot, widthToPot2, int(255 - 255 * amp), 10);
  rect(0, 0, vizSize, vizSize);

  // Draw radiating lines
  strokeWeight(random(1, 2));
  stroke(255);

  const deg = map(potToWidth, 0, vizSize, 120, 1);

  for (let i = 0; i < 360; i += deg) {
    push();
      translate(vizSize / 2, vizSize / 2);
      const angle = radians(i);
      rotate(angle);
      line(vizSize / 2 - amp * vizSize / 2, 0, amp * vizSize / 2, amp * vizSize / 2);
    pop();
  }

  // Background dot grid
  _drawPointBackground(amp);
}

function _drawPointBackground(amp) {
  const a = 100;
  const b = 27;
  const c = 18;
  const step = 50;
  const sz = vizSize;

  // Horizontal band (middle section, full width)
  for (let i = 20; i <= sz - 10; i += step) {
    for (let j = sz / 6 * 2 + 10; j <= sz / 6 * 4 - 10; j += step) {
      stroke(255, amp * a);
      strokeWeight(noise(amp) * random(c, b));
      point(i, j);
    }
  }

  // Vertical band, top section
  for (let i = sz / 6 * 2 + 20; i <= sz / 6 * 4 - 20; i += step) {
    for (let j = 20; j <= sz / 6 * 2 - 20; j += step) {
      stroke(255, amp * a);
      strokeWeight(noise(amp) * random(c, b));
      point(i, j);
    }
  }

  // Vertical band, bottom section
  for (let i = sz / 6 * 2 + 20; i <= sz / 6 * 4 - 20; i += step) {
    for (let j = sz / 6 * 4 + 20; j <= sz - 20; j += step) {
      stroke(255, amp * a);
      strokeWeight(noise(amp) * random(c, b));
      point(i, j);
    }
  }
}
