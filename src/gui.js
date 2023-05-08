
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
      break;
    }
  }
}


function drawScaleToolbar() {
  const regionWidth = width / numRegions;
  const toolbarY = height-100;
  
  
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

function handleToolbarClick() {

  const regionWidth = width / numRegions;
  const toolbarY = height-100;


  for (let i = 0; i < scales[settings.scale].length; i++) {
    const circleX = (regionWidth * i) + (regionWidth / 2); // Center the circle within the region
    const circleY = toolbarY;

    if (
      mouseX >= circleX - circleSize / 2 &&
      mouseX <= circleX + circleSize / 2 &&
      mouseY >= circleY - circleSize / 2 &&
      mouseY <= circleY + circleSize / 2
    ) {
      selectedNoteIndex = i;
      break;
    }
  }
}






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
  gui.add(settings, "scale", Object.keys(scales)).name("Scale").onChange(() => {
    updateWhiteDotsScale();
  });

  // Node speed
  const speedController = gui.add(settings, "speed", 0.01, 2).step(0.01).name("Node Speed");
  speedController.onChange(updateNodeSpeeds);

  // Freeze nodes
  gui.add(settings, "lockNodes").name("Freeze Nodes");


}

function setupToolbar() {
  interactionMode = "create";

  let isMuted = false;

  const muteButton = document.getElementById("mute-button");
  muteButton.addEventListener("click", () => {
    isMuted = !isMuted; // Toggle the mute state

    if (isMuted) {
      muteButton.classList.add("active"); 
      Tone.Destination.mute = true;
    } else {
      muteButton.classList.remove("active"); 
      Tone.Destination.mute = false;
    }});
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

