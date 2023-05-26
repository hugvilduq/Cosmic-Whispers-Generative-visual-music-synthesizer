
let gridOffset = 0;

// Space between the two planes
let spaceMargin=150

// Space between each gridline
let spacing = 50;

// Angle to create perspective higher -> more in the ground
let flattenPerspective = 60;

// Animation speed
let backgroundSpeed = 0.1;

function setupBackground() {
  createGradient();

}

function updateSpeed() {
  backgroundSpeed = speedSlider.value(); // Update the speed variable with the slider value
  flattenPerspective= speedSlider.value()*100+50
  spaceMargin= (speedSlider.value())*(-15) + 170
}

function createGradient() {
  gradient = createGraphics(width, height);
  gradient.clear();
  let gHorizon = color(0, 0, 0, 150);
  let gBottom = color(0, 0, 0, 0);

  for (let i = 0; i < height; i++) {
    gradient.stroke(lerpColor(gHorizon, gBottom, i / height));
    gradient.line(0, i, width, i);
  }
}


function drawBackground() {
  const vanishingPoint = height/2;
  let horizon=vanishingPoint;
  background(32, 13, 58,50);
  horizon=vanishingPoint+spaceMargin;

  // Draw vertical lines in perspective
  for (let x = -spacing; x <= width + spacing; x += spacing) {
    // Increase the spacing multiply to increase perspective
    let startX = map(x, -spacing, width + spacing, -spacing * flattenPerspective, width + spacing * flattenPerspective);
    let endX = map(x, -spacing, width + spacing, -spacing, width + spacing);
    stroke(70, 206, 189, 100);
    strokeWeight(2);
    line(endX, horizon, startX, height);
  }

  // Draw horizontal lines
  gridOffset = (gridOffset + backgroundSpeed) % spacing;
  for (let y = horizon + gridOffset; y <= height; y += spacing) {
    let opacity = map(y, horizon, height, 0, 255);
    stroke(70, 206, 189, opacity);
    strokeWeight(2);
    line(0, y, width, y);
  }
  

  // Draw horizon line
  stroke(70, 206, 189, 50);
  strokeWeight(1);
  line(0, horizon, width, horizon);



  // Draw the original image
  drawInverted();
  image(gradient, 0, 0);
}


function drawInverted() {
  const vanishingPoint = height/2;
let horizon=vanishingPoint;
  horizon=vanishingPoint-spaceMargin;

  // Draw inverted vertical lines in perspective
  for (let x = -spacing; x <= width + spacing; x += spacing) {
    // Increase the spacing multiply to increase perspective
    let startX = map(x, -spacing, width + spacing, -spacing * flattenPerspective, width + spacing * flattenPerspective);
    let endX = map(x, -spacing, width + spacing, -spacing, width + spacing);
    stroke(70, 206, 189, 100);
    strokeWeight(2);
    line(endX, horizon, startX, 0);
  }

  // Draw inverted horizontal lines
  let invertedGridOffset = (gridOffset - backgroundSpeed) % spacing;
  for (let y = horizon - invertedGridOffset; y >= 0; y -= spacing) {
    let opacity = map(y, 0, horizon, 255, 0);
    stroke(70, 206, 189, opacity);
    strokeWeight(2);
    line(0, y, width, y);
  }

  // Draw inverted horizon line
  stroke(70, 206, 189, 50);
  strokeWeight(1);
  line(0, horizon, width, horizon);
}

