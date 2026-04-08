/* ============================================================
   rhythmic.js — Rhythmic visual pattern (rotating triangles + particle burst)
   Uses vizSize (global) instead of width/height for square canvas
   ============================================================ */

function drawRhythmicPattern(amp, potToWidth, widthToPot, widthToPot2) {
  // Semi-transparent overlay for trail effect
  rectMode(CORNER);
  noStroke();
  fill(widthToPot, widthToPot2, int(255 - 255 * amp), 10);
  rect(0, 0, vizSize, vizSize);

  // Draw rotating triangles
  noFill();
  strokeWeight(2);
  stroke(255, 255, 255);

  const deg = int(map(potToWidth, 0, vizSize, 90, 1));

  for (let i = 1; i < 360; i += deg) {
    push();
      translate(vizSize / 2, vizSize / 2);
      const angle = radians(i);
      rotate(angle);
      triangle(
        vizSize / 2 - amp * vizSize / 2, 0,
        amp * vizSize / 2, amp * vizSize / 2,
        amp * vizSize / 2 / tan(30), vizSize / 4 * amp
      );
    pop();
  }

  // Particle burst at high amplitude
  _drawParticleBurst(amp);
}

function _drawParticleBurst(amp) {
  if (amp > 0.85) {
    const step = 50;
    for (let i = 0; i < vizSize; i += step) {
      for (let j = 0; j < vizSize; j += step) {
        stroke(255, noise(amp) * 40);
        strokeWeight(amp * 40);
        point(random(i), random(j));
      }
    }
  }
}
