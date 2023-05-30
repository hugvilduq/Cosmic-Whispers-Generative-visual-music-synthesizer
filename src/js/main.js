function setup() {
  createCanvas(windowWidth, windowHeight);
  setupBackground();

  // set up Tone.js Transport to play a 4-beat pattern
  Tone.Transport.bpm.value = 120;
  Tone.Transport.timeSignature = 4;
  Tone.Transport.loopEnd = "4m";

  Tone.Transport.start();
  Tone.Transport.scheduleRepeat(onBeat, "8n");

  setupToolbar();
  frameRate(30);
  setupGui();

}