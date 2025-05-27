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

let spacing = 30;
let baseSizes = [0, 5, 19, 22];

let bgColor = '#FFFFFF';
let plusColor = '#0000FF';

const colors = [
  '#040066', '#0000FF', '#00D4FF', '#00C167',
  '#D3BEEC', '#FFD81D', '#FF872A', '#FFFFFF'
];

let swatchButtonBg, swatchButtonPlus;
let swatchMenuBg, swatchMenuPlus;
let swatchElementsBg = [];
let swatchElementsPlus = [];
let selectedColorBg = '#FFFFFF';
let selectedColorPlus = '#0000FF';

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);

  createColorSwatch('bg', 20, 20);
  createColorSwatch('plus', 20, 70);
}

function draw() {
  background(bgColor);
  fill(plusColor);

  let cols = layout[0].length;
  let rows = layout.length;
  let layoutWidth = cols * spacing;
  let layoutHeight = rows * spacing;
  let xOffset = (width - layoutWidth) / 2;
  let yOffset = (height - layoutHeight) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let value = layout[row][col];
      if (value === 0) continue;

      let baseSize = baseSizes[value];
      let sparkle = sin(frameCount * 0.033 + row + col) * 6;
      let size = baseSize + sparkle;

      let x = col * spacing + xOffset;
      let y = row * spacing + yOffset;

      drawPlus(x, y, size);
    }
  }
}

function drawPlus(x, y, s) {
  let unit = s / 5;
  let thickness = unit;
  let length = unit * 5;

  rect(x, y, thickness, length); // Vertical bar
  rect(x, y, length, thickness); // Horizontal bar
}

function createColorSwatch(type, posX, posY) {
  let selectedColor = type === 'bg' ? selectedColorBg : selectedColorPlus;
  let zIndex = type === 'bg' ? '10' : '5';

  let swatchButton = createDiv('')
    .style('width', '30px')
    .style('height', '30px')
    .style('border-radius', '50%')
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
      .style('border-radius', '50%')
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
  let layoutWidth = cols * spacing;
  let layoutHeight = rows * spacing;
  let xOffset = (width - layoutWidth) / 2;
  let yOffset = (height - layoutHeight) / 2;

  svg.push('<?xml version="1.0" encoding="UTF-8" standalone="no"?>');
  svg.push(`<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}">`);
  svg.push(`<rect width="${width}" height="${height}" fill="${bgColor}" />`);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let value = layout[row][col];
      if (value === 0) continue;

      let baseSize = baseSizes[value];
      let sparkle = sin(frameCount * 0.033 + row + col) * 6;
      let size = baseSize + sparkle;

      let x = col * spacing + xOffset;
      let y = row * spacing + yOffset;

      let unit = size / 5;
      let barThickness = unit;
      let barLength = unit * 5;

      // Vertical bar
      svg.push(`<rect x="${x - barThickness / 2}" y="${y - barLength / 2}" width="${barThickness}" height="${barLength}" fill="${plusColor}" />`);
      // Horizontal bar
      svg.push(`<rect x="${x - barLength / 2}" y="${y - barThickness / 2}" width="${barLength}" height="${barThickness}" fill="${plusColor}" />`);
    }
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