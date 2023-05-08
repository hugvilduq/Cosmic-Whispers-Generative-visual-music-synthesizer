let thereminSynth;
let freqSlider, volSlider, typeSelect;
let freqLabel, volLabel, typeLabel;
// Option to load sample
// More sound design options.

function setup() {
  createCanvas(600,400);
  frameRate(30);

  // Create a Tone.js synth
  testSynth = new Tone.Synth().toDestination();
  wave = new Tone.Waveform(1024);

  
  // Set the initial position for the controls
  let controlX = width / 10 ;
  let controlY =height - height /4 ;
  let controlSpacing = 40;

  // Create a play button
  playButton = createButton('⏵');
  playButton.position(controlX+10, controlY-20);
  playButton.mousePressed(playSound);
  playButton.addClass('play-button');

  // Create labels and sliders for frequency, volume, and oscillator type


  
  typeLabel = createP('Oscillator');
  typeLabel.position(controlX-140, controlY+80);
  typeLabel.addClass('slider-label');

  typeSelect = createSelect();
  typeSelect.addClass('custom-select');
  typeSelect.option('sine');
  typeSelect.option('square');
  typeSelect.option('triangle');
  typeSelect.option('sawtooth');
  typeSelect.position(controlX, controlY + 60);

  controlX += controlSpacing*2;

  volLabel = createP('Volume');
  volLabel.position(controlX - 50, controlY);
  volLabel.addClass('slider-label');

  volSlider = createSlider(-48, 0, -12, 0.1);
  volSlider.position(controlX, controlY + 20);
  volSlider.addClass('custom-slider');


  controlX += controlSpacing*2;



  // Create labels and sliders for Attack, Decay, Sustain, and Release
  attackLabel = createP('ATT');
  attackLabel.position(controlX, controlY);
  attackLabel.addClass('slider-label');

  attackSlider = createSlider(0, 2, 0.2, 0.1);
  attackSlider.position(controlX, controlY + 20);
  attackSlider.addClass('custom-slider');

  controlX += controlSpacing;

  decayLabel = createP('DEC');
  decayLabel.position(controlX, controlY);
  decayLabel.addClass('slider-label');

  decayLabel.position(controlX, controlY);
  decaySlider = createSlider(0, 2, 0.2, 0.01);
  decaySlider.position(controlX, controlY + 20);
  decaySlider.addClass('custom-slider');

  controlX += controlSpacing;

  sustainLabel = createP('SUS');
  sustainLabel.position(controlX, controlY);
  sustainLabel.addClass('slider-label');

  sustainSlider = createSlider(0, 1, 0.5, 0.01);
  sustainSlider.position(controlX, controlY + 20);
  sustainSlider.addClass('custom-slider');

  controlX += controlSpacing;

  releaseLabel = createP('REL');
  releaseLabel.position(controlX, controlY);
  releaseLabel.addClass('slider-label');

  releaseSlider = createSlider(0, 5, 5, 0.01);
  releaseSlider.position(controlX, controlY + 20);
  releaseSlider.addClass('custom-slider');


}


window.addEventListener('message', (event) => {
  const data = event.data;

  if (data.type === 'thereminSynth') {
      thereminSynth = new Tone.Synth(data.options);
      thereminSynth.toDestination(); // Connect the synth to the audio output
      // Call your function with the reconstructed thereminSynth
      setupSliders(thereminSynth);
  }
});


function draw() {
  background(320);
  drawADSRGraph();
  drawWaveform();

}


function setupSliders(synth) {
  // Create a function to send the updated synth parameters to the parent window
  const sendUpdatedSynth = () => {
    window.parent.postMessage({
      type: 'updatedSynth',
      options: {
        volume: synth.volume.value,
        oscillatorType: synth.oscillator.type,
        envelope: {
          attack: synth.envelope.attack,
          decay: synth.envelope.decay,
          sustain: synth.envelope.sustain,
          release: synth.envelope.release
        }
      }
    }, '*');
  };

  // Update the synth and send the updated parameters when a slider value changes
  volSlider.input(() => {
    synth.volume.value = volSlider.value();
    sendUpdatedSynth();
  });

  typeSelect.changed(() => {
    synth.oscillator.type = typeSelect.value();
    sendUpdatedSynth();
  });

  attackSlider.input(() => {
    synth.envelope.attack = attackSlider.value();
    sendUpdatedSynth();
  });

  decaySlider.input(() => {
    synth.envelope.decay = decaySlider.value();
    sendUpdatedSynth();
  });

  sustainSlider.input(() => {
    synth.envelope.sustain = sustainSlider.value();
    sendUpdatedSynth();
  });

  releaseSlider.input(() => {
    synth.envelope.release = releaseSlider.value();
    sendUpdatedSynth();
  });
}



function drawADSRGraph() {
  // Set up the canvas style
  push();
  translate(width / 8, height / 18); // Update the graph position
  background(23,9,41);

  // Draw grid lines and time labels
  stroke(255, 255, 255, 100);
  strokeWeight(1);
  textSize(12);
  fill(255);
  textAlign(CENTER, CENTER);

  // Display grid values in ms
  for (let i = 0; i <= width / 2 + 150; i += 50) {
    line(i, 0, i, height / 2);
    if (i >= 0) {
      text(i * 10, i, -10);
    }
  }

  for (let i = 0; i <= height / 2; i += 20) {
    line(0, i, width/ 2 + 150, i);
  }

  // Map ADSR values to the graph
  let attackX = map(attackSlider.value(), 0, 2, 0, width / 4);
  let decayX = map(decaySlider.value(), 0, 2, 0, width / 4);
  let sustainY = map(sustainSlider.value(), 0, 1, height / 2, 0);
  let releaseX = map(releaseSlider.value(), 0, 5, 0, width / 4);

  // Draw the ADSR envelope with a futuristic style
  strokeWeight(3);
  stroke(255, 255, 255);
  noFill();


  // Attack region (red)
  stroke(255, 0, 0);
  line(0, height / 2, attackX, 0);

  // Decay region (green)
  stroke(0, 255, 0);
  line(attackX, 0, attackX + decayX, sustainY);

  // Sustain region (blue)
  stroke(0, 0, 255);
  line(attackX + decayX, sustainY, attackX + decayX + releaseX, height / 2);

  // Release region )
  stroke('#2A9D8F');
  line(attackX + decayX + releaseX, height / 2, width / 2, height / 2);

  // Draw gradient areas below each line
  drawGradientArea(0, height / 2, attackX, 0, color('#2A9D8F'), color('#48B9A6'));
  drawGradientArea(attackX, 0, attackX + decayX, sustainY, color('#1D6F67'), color('#2A9D8F'));
  drawGradientArea(attackX + decayX, sustainY, attackX + decayX + releaseX, height / 2, color('#143D3B'), color('#1D6F67'));

  // Draw points at vertices
  fill(255, 255, 255);
  ellipse(0, height / 2, 8);
  ellipse(attackX, 0, 8);
  ellipse(attackX + decayX, sustainY, 8);
  ellipse(attackX + decayX + releaseX, height / 2, 8);

  // Reset canvas style
  pop();
}


// Helper function to draw gradient rectangle with a solid line at the bottom
// Helper function to draw gradient rectangle with a solid line at the bottom
function drawGradientArea(x1, y1, x2, y2, c1, c2) {
  let gradientStep = 0.01;
  noFill();

  for (let i = 0; i <= 1; i += gradientStep) {
    let interColor = lerpColor(c1, c2, i);
    let alphaValue = map(i, 0, 1, 255, 0); // Map the alpha value from 255 to 0
    stroke(interColor._array[0] * 255, interColor._array[1] * 255, interColor._array[2] * 255, alphaValue);
    line(x1, lerp(y1, height / 2, i), x2, lerp(y2, height / 2, i));
  }

  // Draw a solid line at the bottom of the gradient
  stroke(c2);
  line(x1, height / 2, x2, height / 2);
}


function drawWaveform() {
  stroke(255);
  strokeWeight(1);
  noFill();

  // Connect the Waveform object to the synth
  thereminSynth.connect(wave);

  // Update the buffer to get the latest waveform values
  let buffer = wave.getValue();
  push();
  translate(0, height/2);
  beginShape();
  for (let i = 0; i < buffer.length; i++) {
    let x = map(i, 0, buffer.length, 0, width);
    let y = map(buffer[i], -1, 1, height / 4, 0);
    vertex(x, y);
  }
  endShape();
  pop();
}

console.log(thereminSynth)
// Callback function to play the sound
function playSound() {
  thereminSynth.triggerAttackRelease(thereminSynth.frequency.value, '8n');
}

function keyPressed() {
  if (key === ' ') {
    // Trigger the synth when the spacebar is pressed
    testSynth.triggerAttackRelease(testSynth.frequency.value, '8n');
  }
}
