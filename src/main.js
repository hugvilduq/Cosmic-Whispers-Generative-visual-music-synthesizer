
let backgroundImage;

function preload() {
  backgroundImage = loadImage('space-bg.jpg');
}


let isMouseDown = false;

document.addEventListener("mousedown", function () {
  isMouseDown = true;
});

document.addEventListener("mouseup", function () {
  isMouseDown = false;
});
let synth;
const root = 48;

const compressor = new Tone.Compressor({
  attack: 0.003,  // In seconds, time taken to reduce gain after signal exceeds the threshold
  release: 0.25,  // In seconds, time taken to increase gain after signal falls below the threshold
  threshold: -24, // In dB, level above which the compression will start to be applied
  ratio: 4,       // Compression ratio, higher values result in more aggressive compression
  knee: 30,       // In dB, width of the transition region around the threshold (0 for hard knee, higher values for softer knee)

}).toDestination();

const reverb = new Tone.Reverb({
  decay: 2,
  preDelay: 0.01,
  wet: 0.5
});

const lowpassFilter = new Tone.Filter({
  type: "lowpass",
  frequency: 1000,
  Q: 1
});

const highpassFilter = new Tone.Filter({
  type: "highpass",
  frequency: 10, // Set the cutoff frequency for the highpass filter
  Q: 1
});

const echo = new Tone.FeedbackDelay('8n', 0.5).toDestination(); // '8n' = 1/8 note delay time, 0.5 = 50% feedback

// const volume = new Tone.Volume({
//   volume: -30, // Initial volume in decibels (dB)
//   mute: false // Set to true to mute the output
// }).toDestination();

const polySynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine', //'sine', 'square', 'triangle','sawtooth'
  },
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.3,
    release: 1,
  },
  volume: -24,
  voiceSteal: true, //prioritise new notes when max polyphony

}).toDestination();

polySynth
  .connect(echo)

// echo.toDestination();
// polySynth.connect(echo).toDestination();



// A more complex Synth with modulation options
// const polySynth = new Tone.FMSynth({
//   harmonicity: 3,
//   modulationIndex: 10,
//   oscillator: {
//     type: 'sine',
//   },
//   envelope: {
//     attack: 0.01,
//     decay: 0.1,
//     sustain: 0.3,
//     release: 1,
//   },
//   modulation: {
//     type: 'square',
//   },
//   modulationEnvelope: {
//     attack: 0.5,
//     decay: 0,
//     sustain: 1,
//     release: 0.5,
//   },
// }).toDestination();




function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  // create synth and scale objects from Tone.js
  synth = new Tone.Synth({
    oscillator: {
      type: "sine", // Use a sawtooth wave for the oscillator
      detune: 10, // Detune the oscillator slightly for a richer sound
    },
    envelope: {
      attack: 0.5, // Increase the attack time for a softer attack
      decay: 0.2, // Decrease the decay time for a sharper decay
      sustain: 0.5, // Decrease the sustain level for a shorter sustain
      release: 15, // Increase the release time for a longer fade out
    },
    volume: -16,
  }).toDestination();
  const echo = new Tone.FeedbackDelay('8n', 0.25).toDestination(); // '8n' = 1/8 note delay time, 0.5 = 50% feedback
  synth
    .connect(echo);

  // Echo
  // const delay = new Tone.FeedbackDelay("1n", 0.25).toDestination();
  // synth.connect(delay);

  // scale = Tone.Frequency("C2").harmonize([0, 2, 3, 7, 9], "m7");

  document.getElementById("mute-button").addEventListener("click", toggleMute);


  // set up Tone.js Transport to play a 4-beat pattern
  Tone.Transport.bpm.value = 120;
  Tone.Transport.timeSignature = 4;
  Tone.Transport.loopEnd = "4m";

  Tone.Transport.start();
  Tone.Transport.scheduleRepeat(onBeat, "8n");

  octaveGenerator = new OctaveGenerator(width / 2, height / 2);

  setupToolbar();
  frameRate(30);
  setupGui();

}

let beatNum;
let currentEighthNote;

function getEigthNoteIndex(positionArray) {
  const bar = parseInt(positionArray[0]) * 8;
  const beat = parseInt(positionArray[1]) * 2;
  const sixteenthNote = parseInt(positionArray[2]) >= 2 ? 1 : 0;
  return (bar + beat + sixteenthNote) % 8;
}
function onBeat(time) {
  
  let currentPosition = Tone.Transport.position.split(":");
  let currentBeat = parseInt(currentPosition[1]);
  
  
  let playingNotes = new Set();
  
  currentEighthNote = getEigthNoteIndex(currentPosition)
  // Loop through each octave generator
  for (const generator of octaveGenerators) {
    // Loop through each white dot in the current generator
    for (const whiteDot of generator.whiteDots) {
      if (whiteDot.beatsToPlay[currentEighthNote]) {
        whiteDot.soundPlayed();
        polySynth.triggerAttackRelease(whiteDot.scaleNote, "16n", time);
        whiteDot.beatsToPlay = new Array(8).fill(false);
        
        // Check if the note is already playing
        if (!playingNotes.has(whiteDot.noteIndex)) {
          // Add the note to the playingNotes set
          playingNotes.add(whiteDot.noteIndex);

          // Trigger the note and remove it from the playingNotes set when the note is released
          polySynth.triggerAttackRelease(whiteDot.scaleNote, "16n", time, undefined, () => {
            playingNotes.delete(whiteDot.noteIndex);
          });

        }
      }
    }
  }
}


let isThereminPlaying = false;
let thereminNote = null;


function draw() {
  image(backgroundImage, 0, 0, width, height);

  background(0, 50);
  drawMetronome();
  for (let whiteDot of whiteDots) {
    whiteDot.update();
    whiteDot.display();
    whiteDot.checkDistance(octaveGenerators, distanceThreshold = 200, lineColor = 200);
  }
  for (const generator of octaveGenerators) {
    generator.display();
    generator.updateWhiteDotsInRange(whiteDots);
    generator.labelWhiteDots();
  }

  // Mouse Over for interacting with star
  let mouseOverDot = false;
  for (let whiteDot of whiteDots) {
    whiteDot.display();

    if (whiteDot.isMouseOver()) {
      mouseOverDot = true;
    }
  }
  if (mouseOverDot) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }


  let currentScale = scales[settings.scale]
  const rootNote = "C4";
  const rootFrequency = Tone.Frequency(rootNote).toFrequency();
  const scaleNotes = currentScale.map(interval => {
    const frequency = rootFrequency * Math.pow(2, interval / 12);
    return Tone.Frequency(frequency).toNote();
  });
  const numRegions = scaleNotes.length;
  const regionWidth = width / numRegions;
  let currentNote;
  let isPlaying = false;


  // Draw gridlines for theremin
  stroke(100);
  for (let i = 1; i < numRegions; i++) {
    line(regionWidth * i, 0, regionWidth * i, height);
  }

  // Theremin mode
  if (interactionMode === "theremin") {
    // Draw a vertical line at the cursor position
    stroke(200);
    line(mouseX, 0, mouseX, height);

    // Map the mouse position to a note in the Pentatonic scale based on the region
    const regionIndex = floor(mouseX / regionWidth);
    const note = scaleNotes[regionIndex];
    const frequency = Tone.Frequency(note).toFrequency();

    // Update current note based on mouse position
    currentNote = frequency;
    // Update synth frequency and trigger attack/release based on mouse state
    if (mouseIsPressed) {
      synth.triggerAttackRelease(currentNote);
      isPlaying = true;
    } else {
      synth.triggerRelease(Tone.now());
      isPlaying = false;
    }
  }else{
      synth.triggerRelease(Tone.now());
  }
}






// array to store white dots
let whiteDots = [];
let octaveGenerators = [];


function mouseClicked() {
  if (interactionMode === "create") {
    if (keyIsDown(SHIFT)) {
      const newOctaveGenerator = new OctaveGenerator(mouseX, mouseY);
      octaveGenerators.push(newOctaveGenerator);
    } else {
      if (isMuteButtonClicked(mouseX, mouseY)) {
        toggleMute();
      } else {
        let clickedDotIndex = -1;
        for (let i = 0; i < whiteDots.length; i++) {
          if (dist(mouseX, mouseY, whiteDots[i].x, whiteDots[i].y) <= whiteDots[i].size / 2) {
            clickedDotIndex = i;
            break;
          }
        }
        if (clickedDotIndex >= 0) {
          whiteDots.splice(clickedDotIndex, 1);
        } else {
          whiteDots.push(new WhiteDot(mouseX, mouseY));
        }
      }
    }
  }
}


function isMuteButtonClicked(x, y) {
  // Add the position and dimensions of your mute button here
  let muteButtonX = 10;
  let muteButtonY = 10;
  let muteButtonWidth = 50;
  let muteButtonHeight = 50;

  return x >= muteButtonX && x <= muteButtonX + muteButtonWidth && y >= muteButtonY && y <= muteButtonY + muteButtonHeight;
}


const scales = {
  Major:            [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23],
  Natural_Minor:    [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22],
  Harmonic_Minor:   [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23],
  Melodic_Minor:    [0, 2, 3, 5, 7, 9, 11, 12, 14, 15, 17, 19, 21, 23],
  Mixolydian:       [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17, 19, 21, 22],
  Phrygian:         [0, 1, 3, 5, 7, 8, 10, 12, 13, 15, 17, 19, 20, 22],
  Lydian:           [0, 2, 4, 6, 7, 9, 11, 12, 14, 16, 18, 19, 21, 23],
  Locrian:          [0, 1, 3, 5, 6, 8, 10, 12, 13, 15, 17, 18, 20, 22],
  Mongolian:        [0, 2, 5, 7, 9, 12, 14, 17, 19, 21, 24, 26, 29, 31],
  Pentatonic_Major: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31],
  Pentatonic_Minor: [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24, 27, 29, 31],
  Overtone:         [0, 4, 7, 10, 12, 14, 16, 19, 22, 24, 26, 28, 31, 34, 36, 38, 40, 43, 46, 48, 50],
  Blues:            [0, 3, 5, 6, 7, 10, 12, 15, 17, 18, 19, 22, 24, 27],
  Chromatic:        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
  Whole_Tone:       [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
};

// An array of 11 colors to choose from
let colors = ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3", "#ff00ff", "#00ffff", "#008000", "#800000"];


// WhiteDot class
class WhiteDot {
  constructor(x, y) {
    // Position attributes
    this.x = x;
    this.y = y;
    // this.radius = radius;
    // this.beat = beat;

    // Original size and size storage
    this.size = random(10, 30);
    this.originalSize = this.size;

    // Animation
    this.animationDuration = 200;
    this.animationStartTime = null;


    // Movement
    this.speed = random(0.2, settings.speed);
    this.angle = random(TWO_PI);

    // Note
    this.playedNote = false;
    this.isPlaying = false;
    this.scale = scales[settings.scale];
    this.noteIndex = int(random(this.scale.length));
    this.midiNote = root + this.scale[this.noteIndex];
    this.scaleNote = Tone.Frequency(this.midiNote, 'midi');

    // Rhythm
    this.beatsToPlay = new Array(8).fill(false);

    this.creationTime = Tone.Transport.seconds;


    const now = Tone.now()

    // Play created note
    polySynth.triggerAttackRelease(this.scaleNote, "0.5n");
    this.calculateTriggerTime(octaveGenerators); // Add this line to set triggerTime

  }

  // update function to change position of white dot
  update() {
    if (!settings.lockNodes) {
      this.x += this.speed * cos(this.angle);
      this.y += this.speed * sin(this.angle);

  // Wrap the position of the dot around the screen
  if (this.x < 0) {
    this.x = width;
  } else if (this.x > width) {
    this.x = 0;
  }

  if (this.y < 0) {
    this.y = height;
  } else if (this.y > height) {
    this.y = 0;
  }
}
  }

  // Mouse over for interacting
  isMouseOver() {
    const distanceToMouse = dist(this.x, this.y, mouseX, mouseY);
    return distanceToMouse < this.size / 2;
  }

  calculateTriggerTime(octaveGenerators) {
    if (!settings.showOctaveGenerator || octaveGenerators.length === 0) return;
    let minDistance = Infinity;
    for (const generator of octaveGenerators) {
      const distance = dist(this.x, this.y, generator.x, generator.y);
      minDistance = min(minDistance, distance);
    }
    const maxDistance = dist(0, 0, width, height);
    const normalizedDistance = minDistance / maxDistance;
    this.triggerTime = Tone.Time("1n").toSeconds() * normalizedDistance;
  }



  // display function to draw the white dot
  display() {
    // Get the color index based on the note index
    let colorIndex = this.noteIndex % colors.length;
    fill(colors[colorIndex]);

    // Size animation when note played
    let displaySize = this.size;
    if (this.isPlaying) {
      if (this.animationStartTime === null) {
        this.animationStartTime = millis();
      }
      const elapsedTime = millis() - this.animationStartTime;
      if (elapsedTime < this.animationDuration) {
        displaySize *= 1.2;
      } else {
        displaySize = this.originalSize;
        this.isPlaying = false;
        this.animationStartTime = null;
      }
    } else {
      displaySize = this.originalSize;
    }

    noStroke();
    ellipse(this.x, this.y, displaySize);
  }

  // Call this method when the sound is played
  soundPlayed() {
    this.isPlaying = true;
    this.animationStartTime = millis();
  }



  // check distance between generators and dots and draw lines if they're close
  checkDistance(generators, distanceThreshold, lineColor) {
    for (let generator of generators) {
      let distance = dist(this.x, this.y, generator.x, generator.y);
      if (distance < distanceThreshold) {
        push(); // Save the current drawing state

        stroke(lineColor);
        // Map distance to stroke weight: maximum weight at 0 distance, minimum weight at the distanceThreshold
        let weight = map(distance, 0, distanceThreshold, 4, 0.5);
        strokeWeight(weight);
        line(this.x, this.y, generator.x, generator.y);
        pop(); // Restore the previous drawing state

      }
    }
  }
}
// end of WhiteDot

class OctaveGenerator {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    
    this.size = 30;
    this.range = 200;
    this.color = 'orange';
    this.rings = 8;
    this.ringColor = 200;
    
    this.startingRingSize = 0;
    this.endingRingSize = this.range; 

    this.whiteDots = [];
    this.ringWidth = this.range / this.rings;
    

      }

  labelWhiteDots() {
    for (const whiteDot of this.whiteDots) {
      const distance = dist(this.x, this.y, whiteDot.x, whiteDot.y);
      const ringIndex = Math.floor(distance / this.ringWidth);
      if (ringIndex >= 0 && ringIndex < 8) {
        whiteDot.beatsToPlay[ringIndex] = true;
      }
    }
  }

  
  // Add a method to check if a WhiteDot is within the range
  isWhiteDotInRange(whiteDot) {
    const distance = dist(this.x, this.y, whiteDot.x, whiteDot.y);
    return distance <= this.range;
  }
  
  updateWhiteDotsInRange(whiteDots) {
    // Clear the current whiteDots array
    this.whiteDots = [];
    // Iterate through the input whiteDots array
    for (const whiteDot of whiteDots) {
      // Check if the whiteDot is within the range of the generator
      if (this.isWhiteDotInRange(whiteDot)) {
        // Add the whiteDot to the generator's whiteDots array
        this.whiteDots.push(whiteDot);
      }
    }
  }

  drawRings(currentEighthNote) {
    for (let i = 1; i <= this.rings; i++) {
    const opacity = (i === currentEighthNote+1) ? 255 : 10; // Set opacity to 255 if it's the current beat, otherwise set it to 50
    
    stroke(this.ringColor, opacity);
    noFill();
    let ringRadius = i * (this.range/this.rings); // Adjust this value to set the distance between rings
    ellipse(this.x, this.y, ringRadius * 2, ringRadius * 2);
    }
  }
  

  // Update the display method to draw the range circle
  display() {
    // currentEighthNote = getEigthNoteIndex(currentPosition)

    this.drawRings(currentEighthNote);
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    noFill();
    ellipse(this.x, this.y, this.range * 2);
  }
}

let beatSize = 30;

// toggleMute function 
let isMuted = false;

function toggleMute() {
  if (isMuted) {
    // unmute the audio
    Tone.Master.mute = false;
    isMuted = false;
  } else {
    // mute the audio
    Tone.Master.mute = true;
    isMuted = true;
  }
}


function drawMetronome() {
  let currentPosition = Tone.Transport.position.split(":");
  let currentBeat = parseInt(currentPosition[1]);
  beatNum = currentBeat; // Add this line to update the beatNum
  
  let metronomeSize = 50;
  if (beatNum === 0) {
    fill(255, 0, 0); // red color for the first beat
  } else {
    if (beatNum === 1) {
      fill(200, 0, 0); // red color for the first beat
    } else {
      if (beatNum === 2) {
        fill(150, 0, 0); // red color for the first beat
      } else {
        fill(100, 0, 0); // white color for the other beats
      }
    }
  }

  ellipse(width / 2, height / 2, metronomeSize);
}

// GUI SETTINGS

// Default settings
const settings = {
  scale: "Mongolian",
  speed: 1,
  lockNodes: true

};

function updateNodeSpeeds() {
  for (let whiteDot of whiteDots) {
    whiteDot.speed = random(0.5, settings.speed);
  }
}


function setupGui() {
  const gui = new dat.GUI({ autoPlace: false });
  gui.domElement.id = 'gui-container';
  document.body.appendChild(gui.domElement);

  const params = {
    bpm: Tone.Transport.bpm.value,
  };


  // BPM
  gui.add(params, 'bpm', 10, 240).step(1).name('BPM').onChange((value) => {
    Tone.Transport.bpm.value = value;
  });

  // Scale option
  gui.add(settings, "scale", Object.keys(scales)).name("Scale");

  // Node speed
  const speedController = gui.add(settings, "speed", 0.01, 2).step(0.01).name("Node Speed");
  speedController.onChange(updateNodeSpeeds);

  // Freeze nodes
  gui.add(settings, "lockNodes").name("Freeze Nodes");


}

function setupToolbar() {
  interactionMode = "create";
  // Add event listeners to the toolbar buttons
  const whiteDotButton = document.getElementById("create-button");
  whiteDotButton.addEventListener("click", () => {
    interactionMode = "create";
    whiteDotButton.classList.add("active"); // Add the "active" class to the button
    thereminButton.classList.remove("active"); // Remove the "active" class from the other button
  });

  const thereminButton = document.getElementById("theremin-button");
  thereminButton.addEventListener("click", () => {
    interactionMode = "theremin";
    thereminButton.classList.add("active"); // Add the "active" class to the button
    whiteDotButton.classList.remove("active"); // Remove the "active" class from the other button
  });

  // Set the initial active button to be the white dot button
  whiteDotButton.classList.add("active");
}