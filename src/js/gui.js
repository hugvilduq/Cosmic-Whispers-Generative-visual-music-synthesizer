
// GUI SETTINGS

let selectedNoteIndex = 0;

const toolbarX = 10;
const circleSize = 40;


function drawOctaveOffsetToolbar() {
  const toolbarX = 50;
  const toolbarY = 500;
  const circleSize = 30;
  const circleSpacing = 10;
  const octaveOffsets = [-1, 0, 1];

  for (let i = 0; i < octaveOffsets.length; i++) {
    const circleX = toolbarX;
    const circleY = toolbarY + (circleSize + circleSpacing) * i;

    if (octaveOffsets[i] === settings.octaveOffset) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }

    ellipse(circleX, circleY, circleSize);
    fill(0);
    text(octaveOffsets[i], circleX - 3, circleY + 3);
  }
}

function handleOctaveOffsetToolbarClick() {
  const toolbarX = 50;
  const toolbarY = 500;
  const circleSize = 30;
  const circleSpacing = 10;
  const octaveOffsets = [-1, 0, 1];

  for (let i = 0; i < octaveOffsets.length; i++) {
    const circleX = toolbarX;
    const circleY = toolbarY + (circleSize + circleSpacing) * i;

    if (
      mouseX >= circleX - circleSize / 2 &&
      mouseX <= circleX + circleSize / 2 &&
      mouseY >= circleY - circleSize / 2 &&
      mouseY <= circleY + circleSize / 2
    ) {
      settings.octaveOffset = octaveOffsets[i];
      return true; // Toolbar was clicked, return true
    }
  }
  return false; // Toolbar was not clicked, return false
}


function drawScaleToolbar() {
  const regionWidth = width / numRegions;
  const toolbarY = height - 100;


  for (let i = 0; i < scales[settings.scale].length; i++) {
    const circleX = (regionWidth * i) + (regionWidth / 2); // Center the circle within the region
    const circleY = toolbarY;

    if (i === selectedNoteIndex) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }

    ellipse(circleX, circleY, circleSize);
  }
}
let toolbarClicked = false;

function handleToolbarClick() {
  const regionWidth = width / numRegions;
  const toolbarY = height - 100;

  for (let i = 0; i < scales[settings.scale].length; i++) {
    const circleX = (regionWidth * i) + (regionWidth / 2); 
    const circleY = toolbarY;

    if (
      mouseX >= circleX - circleSize / 2 &&
      mouseX <= circleX + circleSize / 2 &&
      mouseY >= circleY - circleSize / 2 &&
      mouseY <= circleY + circleSize / 2
    ) {
      selectedNoteIndex = i;
      return true; // Toolbar was clicked, return true
    }
  }
  return false; // Toolbar was not clicked, return false
}


function updateNodeSpeeds() {
  for (let whiteDot of whiteDots) {
    whiteDot.speed = random(settings.speed-1, settings.speed);
  }
}


function setupGui() {
  const gui = new dat.GUI({ autoPlace: false });
  gui.domElement.id = 'gui-container';
  document.body.appendChild(gui.domElement);



  const params = {
    bpm: Tone.Transport.bpm.value,
    volume: 50

  };


  // BPM
  gui.add(params, 'bpm', 10, 240).step(1).name('BPM').onChange((value) => {
    Tone.Transport.bpm.value = value;
  });

  // Scale option
  gui.add(settings, "scale", Object.keys(scales)).name("Scale").onChange(() => {
    if (settings.scale === "Random") {
      scales.Random = getRandomIntervals();
    }
    // Update the current scale
    currentScale = scales[settings.scale];
    updateWhiteDotsScale();

    // Recalculate the notes in the scale and the number of regions
    scaleNotes = currentScale.map(interval => {
      let frequency = rootFrequency * Math.pow(2, interval / 12);
      return Tone.Frequency(frequency).toNote();
    });

    numRegions = scaleNotes.length;

    // Reset the selected note index
    selectedNoteIndex = 0;
  });

  // Node speed
  const speedController = gui.add(settings, "speed", 0.01, 5).step(0.01).name("Node Speed");
  speedController.onChange(updateNodeSpeeds);

  // Freeze nodes
  gui.add(settings, "lockNodes").name("Freeze Nodes");


}


function setupToolbar() {
  interactionMode = "create";

  let isMuted = false;

  const muteButton = document.getElementById("mute-button");
  muteButton.addEventListener("click", (event) => {
    event.stopPropagation(); // prevent event from reaching the canvas
    isMuted = !isMuted; // Toggle the mute state

    if (isMuted) {
      muteButton.classList.add("active");
      Tone.Destination.mute = true;
    } else {
      muteButton.classList.remove("active");
      Tone.Destination.mute = false;
    }
  });
  const whiteDotButton = document.getElementById("create-button");
  whiteDotButton.addEventListener("click", (event) => {
    event.stopPropagation();
    interactionMode = "create";
    whiteDotButton.classList.add("active"); 
    thereminButton.classList.remove("active"); 
  });

  const thereminButton = document.getElementById("theremin-button");
  thereminButton.addEventListener("click", (event) => {
    event.stopPropagation();
    interactionMode = "theremin";
    thereminButton.classList.add("active"); 
    whiteDotButton.classList.remove("active"); 
  });

  whiteDotButton.classList.add("active");
}
 
