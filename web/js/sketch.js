/* ============================================================
   sketch.js — Main p5.js entry point
   State machine, audio management, square canvas layout
   ============================================================ */

// ======================== STATE ========================

let page = 'clock';       // 'clock' | 'loading_music' | 'visualizer'
let mood = 'dreampop';    // 'dreampop' | 'lively' | 'rhythmic'
let weatherData = null;
let weatherLoading = true;

// ======================== LAYOUT ========================

let vizX, vizY, vizSize;  // square visualization area
const MIN_PANEL_WIDTH = 140;

function _calculateLayout() {
  // Square canvas: as large as possible, leaving room for side panels
  vizSize = min(height - 40, width - MIN_PANEL_WIDTH * 2);
  vizSize = max(vizSize, 200);
  vizX = (width - vizSize) / 2;
  vizY = (height - vizSize) / 2;
}

// ======================== AUDIO ========================

const SONG_NUM = 4;
const MOODS = ['dreampop', 'lively', 'rhythmic'];
const MOOD_LABELS = {
  dreampop: '🌊 Dream Pop',
  lively:   '🎸 Lively',
  rhythmic: '⚡ Rhythmic'
};

const SONG_NAMES = {
  dreampop: [
    'Hurts to Love – Beach House',
    'Space Song – Beach House',
    'Lemon Glow – Beach House',
    'Over and Over – Beach House'
  ],
  lively: [
    'Ohayoo Ohio – Pink Martini',
    'Hanuman – Rodrigo y Gabriela',
    'Rebirth of Cool – DJ Cam',
    'Canals – Joakim Karud'
  ],
  rhythmic: [
    'Austerlitz – Jo Blankenburg',
    'Kaligula – Jo Blankenburg',
    'Trigger Nation – Jo Blankenburg',
    'Radioactive – Imagine Dragons'
  ]
};

let songs = { dreampop: [], lively: [], rhythmic: [] };
let amplitudeAnalyzer = null;
let songIndex = 0;
let amp = 0;
let valueOfAmp = 0;

let loadingProgress = { loaded: 0, total: 0 };
let pendingMoodToPlay = null;

// ======================== CONTROLS ========================

let potToWidth = 0;
let widthToPot = 128;
let widthToPot2 = 128;

let lastMouseMove = 0;
const IDLE_TIMEOUT = 5000;

// ======================== VISUALS ========================

let circles = [];
let bounce = { x: 100, y: 200, vx: 3.5, vy: 4.5 };
let clockBtn = null;
let moodBtns = [];
let backBtn = null;
let nextBtn = null;
let fadeAlpha = 0;
let fadeTarget = 0;
let fadeCallback = null;

// ======================== p5.js LIFECYCLE ========================

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Inter');
  lastMouseMove = millis();
  _calculateLayout();

  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.add('hidden');

  fetchWeather().then(data => {
    weatherData = data;
    weatherLoading = false;
    mood = data.mood;
    console.log('Weather:', data.description, '→ Mood:', mood);
  });

  amplitudeAnalyzer = new p5.Amplitude();
}

function draw() {
  // ---- Mouse in viz area check ----
  const mouseInViz = mouseX >= vizX && mouseX <= vizX + vizSize
                  && mouseY >= vizY && mouseY <= vizY + vizSize;
  const isIdle = (millis() - lastMouseMove > IDLE_TIMEOUT) || !mouseInViz;

  // Map mouse position relative to square canvas (0..vizSize)
  const controlX = isIdle ? vizSize / 2 : constrain(mouseX - vizX, 0, vizSize);
  const controlY = isIdle ? vizSize / 2 : constrain(mouseY - vizY, 0, vizSize);

  potToWidth = controlX;
  widthToPot  = int(map(controlY, 0, vizSize, 0, 255));
  widthToPot2 = int(map(controlY, 0, vizSize, 255, 0));

  // ---- Get current amplitude ----
  if (page === 'visualizer' && amplitudeAnalyzer) {
    amp = amplitudeAnalyzer.getLevel();
  } else {
    amp *= 0.95;
  }
  valueOfAmp = int(map(amp, 0, 1, 0, 255));

  // ---- Render current page ----
  if (page === 'clock') {
    clockBtn = drawClockPage(weatherData, weatherLoading, bounce);
  } else if (page === 'loading_music') {
    _drawLoadingPage();
  } else if (page === 'visualizer') {
    _drawVisualizerPage();
  }

  // ---- Fade overlay ----
  if (fadeAlpha > 0) {
    noStroke();
    fill(0, fadeAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
  }
  if (fadeAlpha !== fadeTarget) {
    fadeAlpha = lerp(fadeAlpha, fadeTarget, 0.1);
    if (abs(fadeAlpha - fadeTarget) < 2) {
      fadeAlpha = fadeTarget;
      if (fadeCallback) {
        fadeCallback();
        fadeCallback = null;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  _calculateLayout();
  if (circles.length > 0) {
    circles = createCircles(250);
  }
}

// ======================== MOUSE INTERACTION ========================

function mouseMoved() {
  lastMouseMove = millis();
}

function mouseDragged() {
  lastMouseMove = millis();
}

function mousePressed() {
  lastMouseMove = millis();
  if (page === 'clock') {
    _handleClockClick();
  } else if (page === 'visualizer') {
    _handleVisualizerClick();
  }
}

// ======================== CLOCK PAGE ========================

function _handleClockClick() {
  if (!clockBtn) return;
  const { btnX, btnY, btnW, btnH } = clockBtn;
  if (mouseX > btnX && mouseX < btnX + btnW &&
      mouseY > btnY && mouseY < btnY + btnH) {
    _startExperience();
  }
}

function _startExperience() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  if (circles.length === 0) {
    circles = createCircles(250);
  }
  _loadMoodSongs(mood);
  if (_isMoodLoaded(mood)) {
    _transitionToVisualizer();
  } else {
    page = 'loading_music';
    pendingMoodToPlay = mood;
  }
}

// ======================== AUDIO MANAGEMENT ========================

function _loadMoodSongs(moodName) {
  if (songs[moodName].length > 0) return;
  loadingProgress = { loaded: 0, total: SONG_NUM };
  for (let i = 0; i < SONG_NUM; i++) {
    const path = `public/music/${moodName}${i}.m4a`;
    songs[moodName][i] = loadSound(path,
      () => {
        loadingProgress.loaded++;
        console.log(`Loaded: ${moodName}${i}.m4a (${loadingProgress.loaded}/${loadingProgress.total})`);
        if (pendingMoodToPlay === moodName && _isMoodLoaded(moodName)) {
          _transitionToVisualizer();
          pendingMoodToPlay = null;
        }
      },
      (err) => {
        console.error(`Failed to load ${moodName}${i}.m4a:`, err);
        loadingProgress.loaded++;
      }
    );
  }
}

function _isMoodLoaded(moodName) {
  if (songs[moodName].length < SONG_NUM) return false;
  return songs[moodName].every(s => s && s.isLoaded());
}

function _stopAllSongs() {
  for (const m of MOODS) {
    for (const s of songs[m]) {
      if (s && s.isPlaying()) s.stop();
    }
  }
}

function _playCurrentSong() {
  _stopAllSongs();
  if (songs[mood][songIndex] && songs[mood][songIndex].isLoaded()) {
    songs[mood][songIndex].play();
  }
}

// ======================== LOADING PAGE ========================

function _drawLoadingPage() {
  background(0);
  textAlign(CENTER, CENTER);
  noStroke();

  const cx = width / 2;
  const cy = height / 2;
  const ringR = 30;
  const angle = (millis() / 500) % TWO_PI;

  noFill();
  strokeWeight(3);
  stroke(255, 40);
  ellipse(cx, cy, ringR * 2, ringR * 2);
  stroke(255, 200);
  arc(cx, cy, ringR * 2, ringR * 2, angle, angle + PI * 0.7);

  noStroke();
  fill(255);
  textFont('Orbitron');
  textSize(min(width / 40, 20));
  text('Loading music...', cx, cy + ringR + 40);

  fill(255, 120);
  textFont('Inter');
  textSize(min(width / 50, 15));
  text(loadingProgress.loaded + ' / ' + loadingProgress.total + ' files', cx, cy + ringR + 70);

  fill(255, 60);
  textSize(min(width / 55, 13));
  text(MOOD_LABELS[mood] || mood, cx, cy + ringR + 100);
}

// ======================== VISUALIZER PAGE ========================

function _transitionToVisualizer() {
  fadeTarget = 255;
  fadeCallback = () => {
    page = 'visualizer';
    background(0); // Clear canvas to remove any clock page artifacts
    songIndex = floor(random(SONG_NUM));
    _playCurrentSong();
    fadeTarget = 0;
  };
}

function _drawVisualizerPage() {
  // 1. Draw opaque background for everything OUTSIDE the square canvas
  //    This clears side panels + top/bottom margins each frame
  //    while the square area retains its previous frame (trails persist)
  noStroke();
  rectMode(CORNER);
  fill(12, 12, 15);
  rect(0, 0, vizX, height);                                // left
  rect(vizX + vizSize, 0, width - vizX - vizSize, height); // right
  rect(vizX, 0, vizSize, vizY);                             // top
  rect(vizX, vizY + vizSize, vizSize, height - vizY - vizSize); // bottom

  // 2. Draw frosted glass side panels
  _drawSidePanels();

  // 3. Draw pattern (clipped to square canvas, translated so 0,0 = square origin)
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(vizX, vizY, vizSize, vizSize);
  drawingContext.clip();
  translate(vizX, vizY);

  if (mood === 'dreampop') {
    drawDreampopPattern(amp, potToWidth, widthToPot, widthToPot2, circles);
  } else if (mood === 'lively') {
    drawLivelyPattern(amp, potToWidth, widthToPot, widthToPot2);
  } else if (mood === 'rhythmic') {
    drawRhythmicPattern(amp, potToWidth, widthToPot, widthToPot2);
  }

  drawingContext.restore();
  pop();



  // 5. LED strips (positioned adjacent to square, drawn on main canvas)
  drawLedStrips(amp, valueOfAmp, widthToPot, widthToPot2);

  // 6. UI elements on side panels
  _drawVisualizerUI();
}

function _drawSidePanels() {
  const panelL = vizX;
  const panelR = width - vizX - vizSize;

  noStroke();
  rectMode(CORNER);

  // Layer: Subtle color tint from current pattern background
  const tintAlpha = 12 + amp * 25;
  fill(widthToPot * 0.3, widthToPot2 * 0.3, (255 - 255 * amp) * 0.3, tintAlpha);
  rect(0, 0, panelL, height);
  rect(vizX + vizSize, 0, panelR, height);

  // Layer: Subtle white frost
  fill(255, 255, 255, 6 + amp * 4);
  rect(0, 0, panelL, height);
  rect(vizX + vizSize, 0, panelR, height);
}

function _drawVisualizerUI() {
  const ledAreaW = 30; // Space reserved for LEDs
  const panelL = vizX - ledAreaW; // Width available for text
  const panelR = width - (vizX + vizSize) - ledAreaW;
  const panelRX = vizX + vizSize + ledAreaW;
  const panelCenterL = panelL / 2;
  const panelCenterR = panelRX + panelR / 2;
  const pad = 20;

  const sL = panelL / 150;
  const sR = panelR / 150;
  const centerY = vizY + vizSize / 2;

  // Calculate generic button block heights to sync left/right vertical alignment
  const moodBtnW = max(panelR * 0.60, 50); // Smaller box
  const moodBtnH = max(moodBtnW * 0.35, 22);
  const moodGap = 6;
  const navBtnW = max(panelR * 0.25, 30);
  const navBtnH = max(navBtnW * 0.70, 24);
  const navGap = 6;
  const totalStackH = (moodBtnH * 3 + moodGap * 2) + 20 + navBtnH; // 20 is gap between mood and nav
  const startY = vizY + (vizSize - totalStackH) / 2;

  // ===================== LEFT PANEL — INFO TEXT =====================

  noStroke();
  textFont('Inter');

  // 1. Weather (Aligned vertically with the top of the right mood buttons)
  if (weatherData) {
    textAlign(CENTER, TOP);
    fill(255, 120);
    textSize(max(10 * sL, 8));
    text(
      weatherData.emoji + ' ' + weatherData.temperature + weatherData.temperatureUnit + '  ' + weatherData.description,
      panelCenterL, startY
    );
  }

  // 2. Mood & Song (Center-aligned starting at vertical midpoint)
  // Mood text takes ~2/3 of left info width (approximated by text size)
  fill(255, 200);
  textAlign(CENTER, BOTTOM);
  textSize(max(panelL * 0.15, 16)); // Sized proportionally to width
  textStyle(BOLD);
  text(MOOD_LABELS[mood] || mood, panelCenterL, centerY - 8);
  textStyle(NORMAL);

  const songName = SONG_NAMES[mood] ? SONG_NAMES[mood][songIndex] : '';
  fill(255, 110);
  textSize(max(panelL * 0.065, 9)); // Slightly smaller than before
  textAlign(CENTER, TOP);
  // Using bounding box with padding to enforce word-wrapping and keep it away from edges
  text(songName, pad, centerY + 12, panelL - pad * 2, 80);

  // 3. Clock (Bottom)
  const hr = hour();
  const mn = minute();
  const sc = second();
  const timeStr = nf(hr, 2) + ':' + nf(mn, 2) + ':' + nf(sc, 2);
  fill(255, 80);
  textFont('Orbitron');
  textSize(max(10 * sL, 8));
  textAlign(CENTER, BOTTOM);
  text(timeStr, panelCenterL, vizY + vizSize - pad);
  textFont('Inter');

  // ===================== RIGHT PANEL — BUTTONS =====================

  // Mood switch buttons
  moodBtns = [];
  const icons = { dreampop: '🌊', lively: '🎸', rhythmic: '⚡' };
  const labels = { dreampop: 'Dream', lively: 'Lively', rhythmic: 'Rhythm' };

  for (let i = 0; i < MOODS.length; i++) {
    const m = MOODS[i];
    const bx = panelCenterR - moodBtnW / 2;
    const by = startY + i * (moodBtnH + moodGap);
    const isActive = m === mood;
    const isHover = mouseX > bx && mouseX < bx + moodBtnW
                 && mouseY > by && mouseY < by + moodBtnH;

    noStroke();
    if (isActive) {
      fill(255, 200);
    } else if (isHover) {
      fill(255, 55);
    } else {
      fill(255, 18);
    }
    rect(bx, by, moodBtnW, moodBtnH, 8);

    fill(isActive ? 10 : 255);
    textAlign(CENTER, CENTER);
    textSize(max(10 * sR, 8));
    textStyle(isActive ? BOLD : NORMAL);
    text(icons[m] + ' ' + labels[m], bx + moodBtnW / 2, by + moodBtnH / 2);
    textStyle(NORMAL);

    moodBtns.push({ x: bx, y: by, w: moodBtnW, h: moodBtnH, mood: m });
  }

  // Navigation buttons
  const navY = startY + (moodBtnH * 3 + moodGap * 2) + 20; // 20px below mood buttons
  const navTotalW = navBtnW * 2 + navGap;
  const navStartX = panelCenterR - navTotalW / 2;

  // Back button
  const backX = navStartX;
  const backHover = mouseX > backX && mouseX < backX + navBtnW
                 && mouseY > navY && mouseY < navY + navBtnH;
  noStroke();
  fill(255, backHover ? 60 : 20);
  rect(backX, navY, navBtnW, navBtnH, 8);
  fill(255, backHover ? 250 : 150);
  textSize(max(14 * sR, 10));
  textAlign(CENTER, CENTER);
  text('←', backX + navBtnW / 2, navY + navBtnH / 2);
  backBtn = { x: backX, y: navY, w: navBtnW, h: navBtnH };

  // Next song button
  const nextX = backX + navBtnW + navGap;
  const nextHover = mouseX > nextX && mouseX < nextX + navBtnW
                 && mouseY > navY && mouseY < navY + navBtnH;
  fill(255, nextHover ? 60 : 20);
  rect(nextX, navY, navBtnW, navBtnH, 8);
  fill(255, nextHover ? 250 : 150);
  textSize(max(12 * sR, 10));
  text('⏭', nextX + navBtnW / 2, navY + navBtnH / 2);
  nextBtn = { x: nextX, y: navY, w: navBtnW, h: navBtnH };
}

// ======================== VISUALIZER INTERACTION ========================

function _handleVisualizerClick() {
  // Mood buttons (right panel)
  for (const btn of moodBtns) {
    if (mouseX > btn.x && mouseX < btn.x + btn.w &&
        mouseY > btn.y && mouseY < btn.y + btn.h) {
      if (btn.mood !== mood) _switchMood(btn.mood);
      return;
    }
  }
  // Back button (left panel)
  if (backBtn &&
      mouseX > backBtn.x && mouseX < backBtn.x + backBtn.w &&
      mouseY > backBtn.y && mouseY < backBtn.y + backBtn.h) {
    _backToClock();
    return;
  }
  // Next song button (left panel)
  if (nextBtn &&
      mouseX > nextBtn.x && mouseX < nextBtn.x + nextBtn.w &&
      mouseY > nextBtn.y && mouseY < nextBtn.y + nextBtn.h) {
    _nextSong();
    return;
  }
}

function _switchMood(newMood) {
  _loadMoodSongs(newMood);
  if (_isMoodLoaded(newMood)) {
    _stopAllSongs();
    mood = newMood;
    songIndex = floor(random(SONG_NUM));
    _playCurrentSong();
  } else {
    _stopAllSongs();
    mood = newMood;
    pendingMoodToPlay = newMood;
    page = 'loading_music';
  }
}

function _nextSong() {
  if (!_isMoodLoaded(mood)) return;
  _stopAllSongs();
  songIndex = (songIndex + 1) % SONG_NUM;
  _playCurrentSong();
}

function _backToClock() {
  fadeTarget = 255;
  fadeCallback = () => {
    _stopAllSongs();
    page = 'clock';
    amp = 0;
    fadeTarget = 0;
  };
}

// ======================== KEYBOARD SHORTCUTS ========================

function keyPressed() {
  if (page === 'visualizer') {
    if (key === 's' || key === 'S') saveCanvas('WhatCanYouSeeOfSound', 'png');
    if (key === '1') _switchMood('dreampop');
    if (key === '2') _switchMood('lively');
    if (key === '3') _switchMood('rhythmic');
    if (key === ' ') _nextSong();
    if (keyCode === ESCAPE) _backToClock();
  }
}
