const layout = [
  //     1                  7                  5
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
let baseSizes = [0, 6, 19, 22];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);
}

function draw() {
  background(255);
  fill(0, 0, 255);

  // Calculate offsets to center the layout
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
  let barThickness = s / 4;
  let barLength = s;

  rect(x, y, barThickness, barLength); // vertical
  rect(x, y, barLength, barThickness); // horizontal
}