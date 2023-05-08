class OctaveGenerator {
    constructor(x, y, octaveOffset = settings.octaveOffset) {
      this.x = x;
      this.y = y;
      this.octaveOffset = octaveOffset;
  
      
      this.size = 30;
      this.range = 200;
      this.color = 'orange';
      this.rings = 8;
      this.ringColor = 200;
  
      
      this.startingRingSize = 0;
      this.endingRingSize = this.range; 
  
      this.whiteDots = [];
      this.ringWidth = this.range / this.rings;
      
      if (this.octaveOffset === 0) {
        this.color = 'orange';
      } else if (this.octaveOffset === 1) {
        this.color = 'blue';
      } else if (this.octaveOffset === -1) {
        this.color = 'green';
      }
  
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
      // image(this.texture, this.x - this.size / 2, this.y - this.size / 2);
  
      this.drawRings(currentEighthNote);
      fill(this.color);
      ellipse(this.x, this.y, this.size);
      noFill();
      ellipse(this.x, this.y, this.range * 2);
      
    }
  }
  