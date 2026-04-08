/* ============================================================
   clock.js — Digital clock + weather info display
   ============================================================ */

/**
 * Draw the clock page: digital time, weather info, bouncing rectangle.
 * @param {object|null} weatherData - weather info from API
 * @param {boolean} weatherLoading - whether weather is still loading
 * @param {object} bounce - { x, y, vx, vy } bouncing rectangle state
 */
function drawClockPage(weatherData, weatherLoading, bounce) {
  background(0);

  const cx = width / 2;

  // ---- Bouncing rectangle (from original) ----
  bounce.x += bounce.vx;
  bounce.y += bounce.vy;

  const marginX = width * 0.08;
  const marginY = height * 0.3;
  const boxW = width * 0.84;
  const boxH = height * 0.38;

  // Playful naughty box boundary checks
  if (bounce.x > marginX + boxW - 50) {
    bounce.x = marginX + boxW - 50;
    bounce.vx *= -1;     // Reverse horizontal
    bounce.vy += random(-2, 2); // Playful angle shift
  } else if (bounce.x < marginX) {
    bounce.x = marginX;
    bounce.vx *= -1;
    bounce.vy += random(-2, 2);
  }

  if (bounce.y > marginY + boxH - 20) {
    bounce.y = marginY + boxH - 20;
    bounce.vy *= -1;     // Reverse vertical
    bounce.vx += random(-2, 2);
  } else if (bounce.y < marginY) {
    bounce.y = marginY;
    bounce.vy *= -1;
    bounce.vx += random(-2, 2);
  }

  // Constrain velocity to keep it snappy but not crazy fast or dead slow
  bounce.vx = constrain(bounce.vx, -12, 12);
  bounce.vy = constrain(bounce.vy, -12, 12);
  
  // Prevent it from hovering straight and boring
  if (abs(bounce.vx) < 3) bounce.vx = (bounce.vx >= 0 ? 1 : -1) * random(3, 6);
  if (abs(bounce.vy) < 3) bounce.vy = (bounce.vy >= 0 ? 1 : -1) * random(3, 6);

  // Outer border rectangle
  rectMode(CORNER);
  strokeWeight(2);
  stroke(250, 175);
  fill(255, 20);
  rect(marginX - 20, marginY - 20, boxW + 40, boxH + 40, 28);

  // Background rectangle
  noStroke();
  fill(255, 20);
  rect(marginX, marginY, boxW, boxH);

  // Second counter bar
  const sc = second();
  const scMap = map(sc, 0, 60, 0, boxW);
  fill(20, map(sc, 0, 60, 50, 150), map(sc, 0, 60, 100, 20));
  rect(marginX, marginY, scMap, boxH);

  // Bouncing white rectangle
  fill(255);
  rect(bounce.x, bounce.y, 50, 20);

  // ---- Digital Clock ----
  const hr = hour();
  const mn = minute();
  const scVal = second();
  const timeStr = nf(hr, 2) + ' : ' + nf(mn, 2) + ' : ' + nf(scVal, 2);

  fill(250);
  noStroke();
  textFont('Orbitron');
  textAlign(CENTER, CENTER);
  textSize(min(width / 7, 120));
  text(timeStr, cx, marginY + boxH / 2);

  // ---- Weather Info (above the clock box) ----
  textFont('Inter');
  textAlign(CENTER, CENTER);

  if (weatherLoading) {
    fill(255, 120);
    textSize(min(width / 40, 18));
    text('Fetching weather...', cx, marginY - 80);
  } else if (weatherData) {
    // Weather emoji + description
    textSize(min(width / 25, 32));
    fill(255, 220);
    text(weatherData.emoji + '  ' + weatherData.description, cx, marginY - 110);

    // Temperature + City
    textSize(min(width / 35, 22));
    fill(255, 160);
    text(
      weatherData.temperature + weatherData.temperatureUnit + '  ·  ' + weatherData.city,
      cx, marginY - 70
    );

    // Mood hint
    textSize(min(width / 50, 15));
    fill(255, 80);
    const moodLabel = {
      dreampop: '🌊 Dream Pop mood detected',
      lively: '🎸 Lively mood detected',
      rhythmic: '⚡ Rhythmic mood detected'
    };
    text(moodLabel[weatherData.mood] || '', cx, marginY - 40);
  }

  // ---- Start Experience Button ----
  const btnW = 260;
  const btnH = 56;
  const btnX = cx - btnW / 2;
  const btnY = marginY + boxH + 60;

  // Button hover detection
  const isHover = mouseX > btnX && mouseX < btnX + btnW
               && mouseY > btnY && mouseY < btnY + btnH;

  // Button glow
  if (isHover) {
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.4)';
  }

  rectMode(CORNER);
  noStroke();
  fill(isHover ? 255 : 240);
  rect(btnX, btnY, btnW, btnH, btnH / 2);

  drawingContext.shadowBlur = 0;

  fill(0);
  textFont('Inter');
  textSize(min(width / 50, 16));
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('START EXPERIENCE', cx, btnY + btnH / 2);
  textStyle(NORMAL);

  // Return button bounds for click detection
  return { btnX, btnY, btnW, btnH };
}
