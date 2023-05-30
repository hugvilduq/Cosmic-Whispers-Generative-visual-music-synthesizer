window.onload = function () {
  let synthFrame = document.getElementById('synth-iframe');
  synthFrame.style.visibility = 'hidden';
    let button = document.getElementById('collapse-btn')
    button.addEventListener('click', function () {
      event.stopPropagation(); 
      let synthFrame = document.getElementById('synth-iframe');
        if (synthFrame.style.visibility !== 'hidden') {
            synthFrame.style.visibility = 'hidden';
        } else {
            synthFrame.style.visibility = 'visible';
        }
    });
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  
  let backgroundImage;
  function preload() {
    backgroundImage = loadImage('../../img/space-bg.jpg');
  }
  

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
        activeSynth = thereminSynth;

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
    }

    else { // interactionMode == Create
        activeSynth = polySynth;
        drawOctaveOffsetToolbar();
        drawScaleToolbar();
        thereminSynth.triggerRelease(Tone.now());
    }


}

window.onload = function () {
  let synthFrame = document.getElementById('synth-iframe');
  synthFrame.style.visibility = 'hidden';
  let button = document.getElementById('collapse-btn');
  button.addEventListener('click', function () {
    event.stopPropagation();
    let synthFrame = document.getElementById('synth-iframe');
    if (synthFrame.style.visibility !== 'hidden') {
      synthFrame.style.visibility = 'hidden';
    } else {
      synthFrame.style.visibility = 'visible';
    }
  });

  // Add an event listener to the reset button
  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', function(event) {
    event.stopPropagation(); // prevent event from reaching the canvas
    whiteDots = []; // clear out the whiteDots array
    octaveGenerators = []; // clear out the octaveGenerators array
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.start();
  });
}




function updateBackgroundSpeed() {
    // Update the speed variable based on the number of dots
    backgroundSpeed = map(numDots, 0, maxDots, 0.1, 10);
  
  }
  
  
  
  
  
  function mouseClicked() {
    if (interactionMode === "create") {
      if (keyIsDown(SHIFT)) {
        const newOctaveGenerator = new OctaveGenerator(mouseX, mouseY);
        octaveGenerators.push(newOctaveGenerator);
      } else {
        // Check if user clicks a dot
        let clickedDotIndex = -1;
        
        // If toolbar or octave offset toolbar was clicked, return early
        if (handleToolbarClick() || handleOctaveOffsetToolbarClick()) {
          return;
        }
  
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
