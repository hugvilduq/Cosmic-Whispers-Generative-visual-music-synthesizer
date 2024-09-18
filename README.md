Cosmic Whispers
Cosmic Whispers is a visual synthesizer inspired by the beauty and mystery of the cosmos. It is built using p5.js and Tone.js to provide users with an immersive, interactive experience where visual animations combine with musical synthesis to create a unique musical sandbox.

This project is part of a Bachelor's Thesis in Computer Science, focusing on creative programming and the intersection between visual art and sound synthesis. The main objective is to inspire musicians, artists, and sound enthusiasts to explore new possibilities, create innovative musical patterns, and enjoy the harmony between visuals and sound.

Visit the live version here: [Cosmic Whispers](https://cosmicwhispers.000webhostapp.com/)

## Table of Contents
- Introduction
- Features
- Getting Started
- Usage
- User Interactions
- Sound Design
- Installation
- Technologies Used
- Future Implementations
- Credits
- License

## Introduction
Cosmic Whispers is a creative programming platform that merges graphic animation and music synthesis through the use of two powerful JavaScript libraries: p5.js (for visuals) and Tone.js (for sound synthesis). It offers a visually engaging and intuitive interface where users can create musical patterns through interactive visual elements.

This project combines art and technology to provide users with a creative playground that emphasizes the relationship between movement on the canvas and sound. Through simple interactions and parameter adjustments, users can generate soundscapes influenced by the behavior of graphical objects on the screen.

## Features
Interactive Visual Synthesizer: Create generators and notes by clicking on the canvas, which correspond to different tones.
Random Music Generation: Leverage intuitive algorithms to generate random and evolving musical patterns.
Customizable Parameters: Fine-tune musical parameters using a user-friendly dat.gui interface.
Real-time Sound and Animation: See how your adjustments affect the behavior of on-screen elements and the synthesized sound in real time.
Visual Aesthetic Inspired by the Cosmos: Enjoy a beautifully designed interface with cosmic-inspired visual elements, creating an immersive and meditative experience.

## Getting Started
To get started with Cosmic Whispers, you can either visit the live demo or clone this repository to run it locally on your machine.

### Prerequisites
- Web Browser: A modern web browser with support for the Web Audio API and Canvas API (e.g., Chrome, Firefox).
- Node.js (optional): If you want to modify the code locally and use a server to run the application.

## Usage
Cosmic Whispers allows you to generate music based on visual interaction. Follow these steps to create your unique soundscapes:

### User Interactions
- Shift + Click: Create music generators on the canvas, which are visual nodes that move and interact with each other, producing sound based on their position and behavior.
- Click: Place notes on the canvas by selecting a note from the row below and clicking in the desired position.
- Parameter Adjustments: Use the dat.gui interface on the top-left to control the behavior of the nodes, adjust pitch, and modify sound parameters.
- Sound Design
Open the Sound Design Panel located at the bottom-right corner to modify the sound settings.
Use sliders to adjust the Attack, Decay, Sustain, and Release (ADSR) envelope settings for each synth.
Experiment with different waveforms (sine, square, triangle) and oscillator types to create different tonal textures.

## Technologies Used
- p5.js: A JavaScript library for creative coding, used for canvas rendering and visual interactions.
- Tone.js: A powerful Web Audio library, used for synthesizing music and managing sound interactions.
- dat.GUI: A lightweight GUI controller, used to provide an intuitive interface for parameter manipulation.
- HTML/CSS: For structuring and styling the user interface.
- JavaScript (ES6): For implementing core logic, event handling, and interactivity.

## Future Implementations
Looking forward, Cosmic Whispers could be expanded in several directions to provide users with more powerful features and greater creative control:

- Advanced Music Sequencer: Add a step sequencer to allow users to compose structured musical patterns.
- MIDI Support: Allow users to control the synthesizer with an external MIDI device for a more tactile experience.
- Effect Modules: Implement more audio effects such as Reverb, Delay, Chorus, or Distortion to enhance sound manipulation.
- Preset Library: Develop a system where users can save and share custom presets or sound configurations.
- Sample Import: Let users import their own sound samples and manipulate them within the Cosmic Whispers environment.
- Recording and Exporting: Enable users to record their sessions and export them as audio files (e.g., .wav or .mp3).
- Collaborative Soundscapes: Implement real-time collaboration, where multiple users can create music together in the same canvas.
- Dynamic Visual Effects: Add more advanced, interactive, and dynamic visualizations that respond to the audio output in real time.

I'm openly accepting pull requests - Feel free to be creative!

### Credits
Author: Hugo Villanueva – LinkedIn | GitHub
Thesis Supervisor: Professor Name – Universidad de Sevilla
Libraries Used:
- p5.js
- Tone.js
- dat.GUI





