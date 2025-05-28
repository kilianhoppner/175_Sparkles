// === Constants ===
const SPARKLE_SPEED = 0.05;
const SPARKLE_AMPLITUDE = 2;
const OPACITY_SPEED = 0.04;
const OPACITY_MIN = 180;
const OPACITY_MAX = 255;
const GLOW_OFFSET_MULTIPLIER = 3;

const SPACING = 25;
const BASE_SIZES = [0, 5, 15, 21];

const SWATCH_SIZE = 30;
const SWATCH_BORDER_RADIUS = '50%';

// === Sparkle Constants ===
const SPARKLE_COUNT = 5;
const SPARKLE_SIZE_MIN = 8;
const SPARKLE_SIZE_MAX = 23;
const SPARKLE_RADIUS_MIN = 100;
const SPARKLE_RADIUS_MAX = 300;
const SPARKLE_OPACITY_MIN = 50;
const SPARKLE_OPACITY_MAX = 200;
const SPARKLE_FLOAT_SPEED = 0.05;

// === Layout ===
const layout = [
  [0,0,0,1,1,0,0,   1,1,1,1,1,1,1,   0,1,1,1,1,1,1],
  [0,1,2,3,3,0,0,   2,3,3,3,3,3,2,   1,3,3,3,3,3,3],
  [1,2,2,2,2,0,0,   0,1,1,1,1,3,2,   1,3,1,0,0,0,0],
  [1,1,1,2,3,0,0,   0,0,0,0,3,2,1,   1,3,1,1,0,0,0],
  [0,0,0,2,3,0,0,   0,0,0,2,3,1,0,   1,3,3,3,3,3,1],
  [0,0,0,2,3,0,0,   0,0,1,3,1,0,0,   1,1,1,1,1,2,3],
  [0,0,0,2,3,0,0,   0,0,3,2,0,0,0,   0,0,0,0,0,2,3],
  [0,0,0,2,3,0,0,   0,1,3,2,0,0,0,   1,1,1,1,1,2,3],
  [1,2,2,2,3,2,2,   0,1,3,2,0,0,0,   1,3,3,3,3,3,1],
  [1,1,1,1,1,1,1,   0,1,1,1,0,0,0,   0,1,1,1,1,1,0]
];

// === Colors ===
let bgColor = '#040066';
let plusColor = '#0000FF';

const colors = [
  '#040066', '#0000FF', '#00D4FF', '#00C167',
  '#D3BEEC', '#FFD81D', '#FF872A', '#FFFFFF'
];

let swatchButtonBg, swatchButtonPlus;
let swatchMenuBg, swatchMenuPlus;
let swatchElementsBg = [];
let swatchElementsPlus = [];
let selectedColorBg = '#040066';
let selectedColorPlus = '#0000FF';

// === Sparkles ===
let sparkles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
  createColorSwatch('bg', 20, 20);
  createColorSwatch('plus', 20, 70);

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    sparkles.push(generateSparkle(true)); // true = random phase start
  }
}

function draw() {
  background(bgColor);
  let cols = layout[0].length;
  let rows = layout.length;
  let layoutWidth = cols * SPACING;
  let layoutHeight = rows * SPACING;
  let xOffset = (width - layoutWidth) / 2;
  let yOffset = (height - layoutHeight) / 2;

  // Draw grid pluses
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let value = layout[row][col];
      if (value === 0) continue;

      let baseSize = BASE_SIZES[value];
      let sparkle = sin(frameCount * SPARKLE_SPEED + row + col) * SPARKLE_AMPLITUDE;
      let size = baseSize + sparkle;

      let alpha = map(
        sin(frameCount * OPACITY_SPEED + (row + col) * GLOW_OFFSET_MULTIPLIER),
        -1, 1,
        OPACITY_MIN, OPACITY_MAX
      );

      let x = col * SPACING + xOffset;
      let y = row * SPACING + yOffset;

      drawPlus(x, y, size, alpha);
    }
  }

  // Draw and animate sparkles
  for (let i = 0; i < sparkles.length; i++) {
    let s = sparkles[i];
    s.phase += SPARKLE_FLOAT_SPEED;

    let flicker = sin(s.phase - HALF_PI);
    let alpha = map(flicker, -1, 1, SPARKLE_OPACITY_MIN, SPARKLE_OPACITY_MAX);
    drawPlus(s.x, s.y, s.size, alpha);

    if (s.phase >= TWO_PI) {
      sparkles[i] = generateSparkle(false); // reset to new sparkle (phase = 0)
    }
  }
}

function drawPlus(x, y, s, a) {
  let unit = s / 5;
  fill(red(plusColor), green(plusColor), blue(plusColor), a);

  beginShape();
  vertex(x - 2.5 * unit, y - 0.5 * unit);
  vertex(x - 0.5 * unit, y - 0.5 * unit);
  vertex(x - 0.5 * unit, y - 2.5 * unit);
  vertex(x + 0.5 * unit, y - 2.5 * unit);
  vertex(x + 0.5 * unit, y - 0.5 * unit);
  vertex(x + 2.5 * unit, y - 0.5 * unit);
  vertex(x + 2.5 * unit, y + 0.5 * unit);
  vertex(x + 0.5 * unit, y + 0.5 * unit);
  vertex(x + 0.5 * unit, y + 2.5 * unit);
  vertex(x - 0.5 * unit, y + 2.5 * unit);
  vertex(x - 0.5 * unit, y + 0.5 * unit);
  vertex(x - 2.5 * unit, y + 0.5 * unit);
  endShape(CLOSE);
}

function generateSparkle(randomPhase = false) {
  let angle = random(TWO_PI);
  let radius = random(SPARKLE_RADIUS_MIN, SPARKLE_RADIUS_MAX);
  let x = width / 2 + cos(angle) * radius;
  let y = height / 2 + sin(angle) * radius;

  return {
    x: x,
    y: y,
    size: random(SPARKLE_SIZE_MIN, SPARKLE_SIZE_MAX),
    phase: randomPhase ? random(TWO_PI) : 0
  };
}

function createColorSwatch(type, posX, posY) {
  let selectedColor = type === 'bg' ? selectedColorBg : selectedColorPlus;
  let zIndex = type === 'bg' ? '10' : '5';

  let swatchButton = createDiv('')
    .style('width', SWATCH_SIZE + 'px')
    .style('height', SWATCH_SIZE + 'px')
    .style('border-radius', SWATCH_BORDER_RADIUS)
    .style('background-color', selectedColor)
    .style('border', '2px solid #333')
    .style('cursor', 'pointer')
    .position(posX, posY);

  let swatchMenu = createDiv('')
    .style('position', 'absolute')
    .style('top', (posY + 40) + 'px')
    .style('left', posX + 'px')
    .style('background', '#eee')
    .style('padding', '8px')
    .style('border-radius', '8px')
    .style('box-shadow', '0 2px 8px rgba(0,0,0,0.2)')
    .style('grid-template-columns', 'repeat(4, 30px)')
    .style('gap', '8px')
    .style('z-index', zIndex)
    .style('display', 'none');

  let swatchElements = [];

  for (let col of colors) {
    let swatch = createDiv('')
      .style('width', '30px')
      .style('height', '30px')
      .style('border-radius', SWATCH_BORDER_RADIUS)
      .style('background-color', col)
      .style('cursor', 'pointer')
      .style('border', col === selectedColor ? '2px solid red' : '2px solid #333');

    swatch.mousePressed(() => {
      if (type === 'bg') {
        bgColor = col;
        selectedColorBg = col;
        swatchButton.style('background-color', col);
        updateSwatchBorders(swatchElements, selectedColorBg);
      } else {
        plusColor = col;
        selectedColorPlus = col;
        swatchButton.style('background-color', col);
        updateSwatchBorders(swatchElements, selectedColorPlus);
      }
    });

    swatchMenu.child(swatch);
    swatchElements.push(swatch);
  }

  swatchButton.mousePressed(() => {
    if (type === 'bg') {
      swatchMenuPlus.style('display', 'none');
    } else {
      swatchMenuBg.style('display', 'none');
    }

    const isVisible = swatchMenu.style('display') !== 'none';
    swatchMenu.style('display', isVisible ? 'none' : 'grid');
  });

  swatchMenu.parent(document.body);

  if (type === 'bg') {
    swatchButtonBg = swatchButton;
    swatchMenuBg = swatchMenu;
    swatchElementsBg = swatchElements;
  } else {
    swatchButtonPlus = swatchButton;
    swatchMenuPlus = swatchMenu;
    swatchElementsPlus = swatchElements;
  }
}

function updateSwatchBorders(swatchList, selectedColor) {
  for (let swatch of swatchList) {
    const color = swatch.style('background-color');
    if (color === colorString(selectedColor)) {
      swatch.style('border', '2px solid red');
    } else {
      swatch.style('border', '2px solid #333');
    }
  }
}

function colorString(hex) {
  const c = color(hex);
  return `rgb(${red(c)}, ${green(c)}, ${blue(c)})`;
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    exportToSVG();
  }
}

function exportToSVG() {
  let svg = [];

  let cols = layout[0].length;
  let rows = layout.length;
  let layoutWidth = cols * SPACING;
  let layoutHeight = rows * SPACING;
  let xOffset = (windowWidth - layoutWidth) / 2;
  let yOffset = (windowHeight - layoutHeight) / 2;

  svg.push('<?xml version="1.0" encoding="UTF-8" standalone="no"?>');
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${windowWidth}" height="${windowHeight}">`);
  svg.push(`<rect width="${windowWidth}" height="${windowHeight}" fill="${bgColor}" />`);

  // === Grid Pluses ===
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let value = layout[row][col];
      if (value === 0) continue;

      let baseSize = BASE_SIZES[value];
      let sparkle = sin(frameCount * SPARKLE_SPEED + row + col) * SPARKLE_AMPLITUDE;
      let size = baseSize + sparkle;

      let alpha = map(
        sin(frameCount * OPACITY_SPEED + (row + col) * GLOW_OFFSET_MULTIPLIER),
        -1, 1, OPACITY_MIN, OPACITY_MAX
      );
      let fillOpacity = (alpha / 255).toFixed(3);

      let x = col * SPACING + xOffset;
      let y = row * SPACING + yOffset;
      let unit = size / 5;

      let d = `
        M ${x - 2.5 * unit} ${y - 0.5 * unit}
        L ${x - 0.5 * unit} ${y - 0.5 * unit}
        L ${x - 0.5 * unit} ${y - 2.5 * unit}
        L ${x + 0.5 * unit} ${y - 2.5 * unit}
        L ${x + 0.5 * unit} ${y - 0.5 * unit}
        L ${x + 2.5 * unit} ${y - 0.5 * unit}
        L ${x + 2.5 * unit} ${y + 0.5 * unit}
        L ${x + 0.5 * unit} ${y + 0.5 * unit}
        L ${x + 0.5 * unit} ${y + 2.5 * unit}
        L ${x - 0.5 * unit} ${y + 2.5 * unit}
        L ${x - 0.5 * unit} ${y + 0.5 * unit}
        L ${x - 2.5 * unit} ${y + 0.5 * unit}
        Z
      `.trim();

      svg.push(`<path d="${d}" fill="${plusColor}" fill-opacity="${fillOpacity}" />`);
    }
  }

  // === Sparkle Pluses ===
  for (let s of sparkles) {
    let flicker = sin(s.phase - HALF_PI);
    let alpha = map(flicker, -1, 1, SPARKLE_OPACITY_MIN, SPARKLE_OPACITY_MAX);
    let fillOpacity = (alpha / 255).toFixed(3);
    let size = s.size;
    let unit = size / 5;
    let x = s.x;
    let y = s.y;

    let d = `
      M ${x - 2.5 * unit} ${y - 0.5 * unit}
      L ${x - 0.5 * unit} ${y - 0.5 * unit}
      L ${x - 0.5 * unit} ${y - 2.5 * unit}
      L ${x + 0.5 * unit} ${y - 2.5 * unit}
      L ${x + 0.5 * unit} ${y - 0.5 * unit}
      L ${x + 2.5 * unit} ${y - 0.5 * unit}
      L ${x + 2.5 * unit} ${y + 0.5 * unit}
      L ${x + 0.5 * unit} ${y + 0.5 * unit}
      L ${x + 0.5 * unit} ${y + 2.5 * unit}
      L ${x - 0.5 * unit} ${y + 2.5 * unit}
      L ${x - 0.5 * unit} ${y + 0.5 * unit}
      L ${x - 2.5 * unit} ${y + 0.5 * unit}
      Z
    `.trim();

    svg.push(`<path d="${d}" fill="${plusColor}" fill-opacity="${fillOpacity}" />`);
  }

  svg.push('</svg>');

  let blob = new Blob([svg.join('\n')], { type: "image/svg+xml" });
  let url = URL.createObjectURL(blob);

  let link = document.createElement('a');
  link.href = url;
  link.download = 'layout_export.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 100);
}