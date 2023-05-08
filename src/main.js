
let backgroundImage;
let activeSynth;
function preload() {
  backgroundImage = loadImage('../space-bg.jpg');
}


let isMouseDown = false;

document.addEventListener("mousedown", function () {
  isMouseDown = true;
});

document.addEventListener("mouseup", function () {
  isMouseDown = false;
});


let thereminSynth;
const root = 60;

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


let polySynth = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: 'sine', //'sine', 'square', 'triangle','sawtooth'
  },
  envelope: {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.3,
    release: 1,
  },
  volume: -12,
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




  // create synth and scale objects from Tone.js
  thereminSynth = new Tone.Synth({
    oscillator: {
      type: "sine", // Use a sawtooth wave for the oscillator
      detune: 10, // Detune the oscillator slightly for a richer sound
    },
    envelope: {
      attack: 0.2, // Increase the attack time for a softer attack
      decay: 0.2, // Decrease the decay time for a sharper decay
      sustain: 0.5, // Decrease the sustain level for a shorter sustain
      release: 15, // Increase the release time for a longer fade out
    },
    volume: -16,
  }).toDestination();

  const thereminEcho = new Tone.FeedbackDelay('8n', 0.25).toDestination(); // '8n' = 1/8 note delay time, 0.5 = 50% feedback

  thereminSynth
    .connect(thereminEcho);




function setup() {
  createCanvas(windowWidth, windowHeight);
  setupBackground();
  background(0);

  // Echo
  // const delay = new Tone.FeedbackDelay("1n", 0.25).toDestination();
  // synth.connect(delay);

  // scale = Tone.Frequency("C2").harmonize([0, 2, 3, 7, 9], "m7");


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
// Default settings
const settings = {
  scale: "Mongolian",
  speed: 1,
  lockNodes: true,
  octaveOffset: 0

};

const iframe = document.getElementById('synth-iframe');
const button = document.getElementById('collapse-btn');

button.addEventListener('click', () => {
  iframe.classList.toggle('collapsed');
});

const scales = {
  Major: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23],
  Natural_Minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22],
  Harmonic_Minor: [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23],
  Melodic_Minor: [0, 2, 3, 5, 7, 9, 11, 12, 14, 15, 17, 19, 21, 23],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17, 19, 21, 22],
  Phrygian: [0, 1, 3, 5, 7, 8, 10, 12, 13, 15, 17, 19, 20, 22],
  Lydian: [0, 2, 4, 6, 7, 9, 11, 12, 14, 16, 18, 19, 21, 23],
  Locrian: [0, 1, 3, 5, 6, 8, 10, 12, 13, 15, 17, 18, 20, 22],
  Mongolian: [0, 2, 5, 7, 9, 12, 14, 17, 19, 21, 24, 26, 29, 31],
  Pentatonic_Major: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31],
  Pentatonic_Minor: [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24, 27, 29, 31],
  Overtone: [0, 4, 7, 10, 12, 14, 16, 19, 22, 24, 26, 28, 31, 34, 36, 38, 40, 43, 46, 48, 50],
  Blues: [0, 3, 5, 6, 7, 10, 12, 15, 17, 18, 19, 22, 24, 27],
  Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
  Whole_Tone: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
};


function getEigthNoteIndex(positionArray) {
  const bar = parseInt(positionArray[0]) * 8;
  const beat = parseInt(positionArray[1]) * 2;
  const sixteenthNote = parseInt(positionArray[2]) >= 2 ? 1 : 0;
  return (bar + beat + sixteenthNote) % 8;
}

function onBeat(time) {

  let currentPosition = Tone.Transport.position.split(":");
  let playingNotes = new Set();

  currentEighthNote = getEigthNoteIndex(currentPosition)
  // Loop through each octave generator
  for (const generator of octaveGenerators) {
    // Loop through each white dot in the current generator
    for (const whiteDot of generator.whiteDots) {
      if (whiteDot.beatsToPlay[currentEighthNote]) {
        whiteDot.soundPlayed();
        whiteDot.beatsToPlay = new Array(8).fill(false);

        // Calculate the note with the octave offset
        const noteWithOffset = Tone.Frequency(whiteDot.scaleNote).transpose(12 * generator.octaveOffset).toNote();

        // Create a unique key for the playingNotes set
        const noteKey = `${whiteDot.noteIndex}_${generator.octaveOffset}`;

        // Check if the note is already playing
        if (!playingNotes.has(noteKey)) {
          // Add the note to the playingNotes set
          playingNotes.add(noteKey);

          // Trigger the note and remove it from the playingNotes set when the note is released
          polySynth.triggerAttackRelease(noteWithOffset, "16n", time, undefined, () => {
            playingNotes.delete(noteKey);
          });

        }
      }
    }
  }
}




let isThereminPlaying = false;
let thereminNote = null;






let currentScale = scales[settings.scale]
const rootNote = "C4";
const rootFrequency = Tone.Frequency(rootNote).toFrequency();
const scaleNotes = currentScale.map(interval => {
  const frequency = rootFrequency * Math.pow(2, interval / 12);
  return Tone.Frequency(frequency).toNote();
});
const numRegions = scaleNotes.length;



function draw() {
  image(backgroundImage, 0, 0, width, height);
  drawBackground();

  numDots = whiteDots.length;
  maxDots = 75;

  backgroundSpeed = 10;
  updateBackgroundSpeed();

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



  let currentNote;
  let isPlaying = false;

  let currentScale = scales[settings.scale]
  const scaleNotes = currentScale.map(interval => {
    const frequency = rootFrequency * Math.pow(2, interval / 12);
    return Tone.Frequency(frequency).toNote();
  });
  const numRegions = scaleNotes.length;

  const regionWidth = width / numRegions;
  // Draw gridlines for theremin
  stroke(100);
  for (let i = 1; i < numRegions; i++) {
    line(regionWidth * i, 0, regionWidth * i, height);
  }


  // Theremin mode
  if (interactionMode === "theremin") {
    activeSynth=thereminSynth;

    // Draw a vertical line at the cursor position
    stroke(200);
    line(mouseX, 0, mouseX, height);

    // Map the mouse position to a note in the Pentatonic scale based on the region
    const regionIndex = floor(mouseX / regionWidth);
    // Higher mouse y=> Higher volume
    let volume = map(mouseY, height, 0, -48, 0);

    const note = scaleNotes[regionIndex];
    const frequency = Tone.Frequency(note).toFrequency();

    // Update current note based on mouse position
    currentNote = frequency;
    // Update synth frequency and trigger attack/release based on mouse state
    if (mouseIsPressed) {
      thereminSynth.triggerAttackRelease(currentNote);
      thereminSynth.volume.value = volume;
      isPlaying = true;
    } else {
      thereminSynth.triggerRelease(Tone.now());
      isPlaying = false;
    }
  } else { // interactionMode == Create
    activeSynth=polySynth;
    drawOctaveOffsetToolbar();
    drawScaleToolbar();
    thereminSynth.triggerRelease(Tone.now());
  }

  
}

    // Get a reference to the iframe
    const activeSynthData = {
      type: 'thereminSynth',
      options: thereminSynth.get()
    };
    console.log(activeSynth)

  window.addEventListener('message', (event) => {
    const data = event.data;
  
    if (data.type === 'updatedSynth') {
      activeSynth.volume.value = data.options.volume;
      activeSynth.oscillator.type = data.options.oscillatorType;
      activeSynth.envelope.attack = data.options.envelope.attack;
      activeSynth.envelope.decay = data.options.envelope.decay;
      activeSynth.envelope.sustain = data.options.envelope.sustain;
      activeSynth.envelope.release = data.options.envelope.release;
    }
  });

const synthIframe = document.getElementById('synth-iframe');

// Wait for the iframe content to load
synthIframe.addEventListener('load', () => {
  // Send the activeSynthData object as a message to the iframe
  synthIframe.contentWindow.postMessage(activeSynthData, '*');
});


// array to store white dots
let whiteDots = [];
let octaveGenerators = [];


// backgroundSpeed = map(numDots, 0, maxDots, 0.1, 10);

function updateBackgroundSpeed() {
  backgroundSpeed = map(numDots, 0, maxDots, 0.1, 10); // Update the speed variable based on the number of dots
  // flattenPerspective = backgroundSpeed * 100 + 50;
  // spaceMargin = (backgroundSpeed) * (-15) + 170;
  // spacing = backgroundSpeed * 2 + 20;
}





function mouseClicked() {
  if (interactionMode === "create") {
    if (keyIsDown(SHIFT)) {
      const newOctaveGenerator = new OctaveGenerator(mouseX, mouseY);
      octaveGenerators.push(newOctaveGenerator);
    } else {
      // Check if user clicks a dot
      let clickedDotIndex = -1;
      handleToolbarClick();
      handleOctaveOffsetToolbarClick();


      for (let i = 0; i < whiteDots.length; i++) {
        if (dist(mouseX, mouseY, whiteDots[i].x, whiteDots[i].y) <= whiteDots[i].size / 2) {
          clickedDotIndex = i;
          break;
        }
      }
      // If user clicks a dot, remove it
      if (clickedDotIndex >= 0) {
        whiteDots.splice(clickedDotIndex, 1);
      } else {
        whiteDots.push(new WhiteDot(mouseX, mouseY, selectedNoteIndex));
      }
    }
  }
}


// An array of 11 colors to choose from
let colors = ["#ff00ff", "#00ffea", "#5effff", "#FF9A8C", "#94FBAB", "#FD7E14", "#2D3748", "#FFC2E7", "#0092FF"];

function drawMetronome() {
  let currentPosition = Tone.Transport.position.split(":");
  let currentBeat = parseInt(currentPosition[1]);
  beatNum = currentBeat;

  let metronomeSize = 50;
  switch (beatNum) {
    case 0:
      fill(255, 0, 0); //red color for the first beat
      break;
    case 1:
      fill(202, 0, 0);
      break;
    case 2:
      fill(155, 0, 0);
      break;
    default:
      fill(102, 0, 0);
  }

  ellipse(width / 2, height / 2, metronomeSize);
}
