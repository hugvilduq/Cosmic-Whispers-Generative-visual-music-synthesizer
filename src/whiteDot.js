
// WhiteDot class
class WhiteDot {
    constructor(x, y, noteIndex) {
      // Position attributes
      this.x = x;
      this.y = y;
  
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
      this.noteIndex = noteIndex;
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
  
  
  
    updateNoteIndex(scale) {
      this.midiNote = root + scale[this.noteIndex];
      this.scaleNote = Tone.Frequency(this.midiNote, 'midi');
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
  
  
  function updateWhiteDotsScale() {
    const scale = scales[settings.scale];
    for (let whiteDot of whiteDots) {
      whiteDot.updateNoteIndex(scale);
    }
  }
  