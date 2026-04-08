/* ============================================================
   circle.js — Circle class for Dream Pop visual
   Uses vizSize (global) for positioning
   ============================================================ */

class Circle {
  constructor(x, y, diameter, transparency) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.transparency = transparency;
  }

  display(amp) {
    noStroke();
    fill(255, random(this.transparency * amp));
    ellipse(this.x, this.y, this.diameter * amp, this.diameter * amp);
  }
}

/**
 * Create an array of Circle objects for the dreampop pattern.
 * Positions are relative to the square viz area (0,0 to vizSize,vizSize).
 */
function createCircles(count) {
  const circles = [];
  for (let i = 0; i < count; i++) {
    circles.push(new Circle(
      int(random(50, vizSize - 50)),
      int(random(vizSize / 2 - 20, vizSize / 2 + 20)),
      int(random(5, 300)),
      int(random(5, 30))
    ));
  }
  return circles;
}
