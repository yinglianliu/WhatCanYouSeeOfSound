/* ============================================================
   dreampop.js — Dream Pop visual pattern (rotating points + circles)
   Translated from pattern_dreampop() in Processing
   Uses vizSize (global) instead of width/height for square canvas
   ============================================================ */

function drawDreampopPattern(amp, potToWidth, widthToPot, widthToPot2, circles) {
  // Semi-transparent overlay for trail effect
  rectMode(CORNER);
  noStroke();
  fill(widthToPot, widthToPot2, int(255 - 255 * amp), 20);
  rect(0, 0, vizSize, vizSize);

  // Draw rotating points
  noFill();
  strokeWeight(random(2, 10));
  stroke(255);

  const deg = map(potToWidth, 0, vizSize, 30, 1);

  for (let i = 0; i < 360; i += deg) {
    push();
      translate(vizSize / 2, vizSize / 2);
      const angle = radians(i);
      rotate(angle);
      point(vizSize / 2 - amp * vizSize / 2, vizSize / 2 - amp * vizSize / 2);
    pop();
  }

  // Circle overlay at high amplitude
  if (amp > 0.475) {
    for (let i = 0; i < circles.length; i++) {
      circles[i].display(amp);
    }
  }
}
