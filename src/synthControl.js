// synthControl.js
function setupSliders(synth) {
    // Your existing slider setup code goes here
  
    // Replace the local synth references with the passed-in synth
    synth.frequency.value = 440;
    synth.volume.value = volSlider.value();
    synth.oscillator.type = typeSelect.value();
  
    synth.envelope.attack = attackSlider.value();
    synth.envelope.decay = decaySlider.value();
    synth.envelope.sustain = sustainSlider.value();
    synth.envelope.release = releaseSlider.value();
  }

function test(){
    console.log("hi");
}