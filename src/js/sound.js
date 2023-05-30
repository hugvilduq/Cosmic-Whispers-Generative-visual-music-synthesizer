const root = 60;

// Note Synth
let polySynth = new Tone.PolySynth(Tone.FMSynth, {

  "harmonicity": 8,
  "modulationIndex": 2,
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.01,
    "decay": 2,
    "sustain": 0.1,
    "release": 1
  },
  "modulation": {
    "type": "square"
  },
  "modulationEnvelope": {
    "attack": 0.002,
    "decay": 0.2,
    "sustain": 0,
    "release": 0.2
  }
}).toDestination();

// Additional modules for the synth

// Compressor to clean the audio peaks
const compressor = new Tone.Compressor({
  attack: 0.003,  
  release: 0.25,
  threshold: -24, 
  ratio: 4,      
  knee: 30,      
}).toDestination();

// Reverb
const reverb = new Tone.Reverb({
  decay: 2,
  preDelay: 0.01,
  wet: 0.5
});

// Clean low frequencies
const lowpassFilter = new Tone.Filter({
  type: "lowpass",
  frequency: 50,
  Q: 1
});

// Clean high frequencies
const highpassFilter = new Tone.Filter({
  type: "highpass",
  frequency: 1000,
  Q: 100
});

// Echo
const echo = new Tone.FeedbackDelay('8n', 0.25).toDestination(); 

polySynth
.connect(compressor)
  .connect(reverb)
  .connect(echo)
  .connect(lowpassFilter)
  .connect(highpassFilter)

// Theremin Synthesizer
let thereminSynth;
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


let beatNum;
let currentEighthNote;

// Default settings
const settings = {
  scale: "Mongolian",
  speed: 1,
  lockNodes: true,
  octaveOffset: 0,
};

const iframe = document.getElementById('synth-iframe');


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
  Random: getRandomIntervals(),
};


function getRandomIntervals() {
  const numNotes = Math.floor(Math.random() * 10) + 7; // Random number of notes between 10 and 17
  const intervals = [0]; // The first note is always 0

  for (let i = 1; i < numNotes; i++) {
    const prevInterval = intervals[i - 1];
    const newInterval = prevInterval + Math.floor(Math.random() * 4) + 1; // Random interval between 1 and 3 semitones
    intervals.push(newInterval);
  }

  return intervals;
}


let isThereminPlaying = false;
let thereminNote = null;

let currentScale = scales[settings.scale]
let rootNote = "C4";
let rootFrequency = Tone.Frequency(rootNote).toFrequency();
let scaleNotes = currentScale.map(interval => {
  let frequency = rootFrequency * Math.pow(2, interval / 12);
  return Tone.Frequency(frequency).toNote();
});
let numRegions = scaleNotes.length;
let activeSynth;
function getEigthNoteIndex(positionArray) {
  const bar = parseInt(positionArray[0]) * 8;
  const beat = parseInt(positionArray[1]) * 2;
  const sixteenthNote = parseInt(positionArray[2]) >= 2 ? 1 : 0;
  return (bar + beat + sixteenthNote) % 8;
}

let beatCount = 0;
let previousEighthNote = -1; 

function onBeat(time) {
  console.log(currentEighthNote);
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

        // Check if the note is already playing, in that case it wont play
        if (!playingNotes.has(noteKey)) {
          playingNotes.add(noteKey);

          polySynth.triggerAttackRelease(noteWithOffset, "16n", time, undefined, () => {
            playingNotes.delete(noteKey);
          });

        }
      }
    }
  }

  
  // If the beat counter gets stuck, reset the Transport
  if (previousEighthNote === currentEighthNote) {
    resetTransport();
    previousEighthNote = -1; 
    return;
  } else {
    previousEighthNote = currentEighthNote;
  }
}

function resetTransport() {
  Tone.Transport.stop();
  Tone.Transport.position = 0;
  Tone.Transport.start();
}



// Get a reference to the iframe
const activeSynthData = {
  type: 'thereminSynth',
  options: thereminSynth.get()
};


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

