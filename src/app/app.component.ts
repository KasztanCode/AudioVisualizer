import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  audioContext: AudioContext;
  audioBuffer!: AudioBuffer;
  audioSource!: AudioBufferSourceNode;
  durationInSeconds!: number;
  isPlaying: boolean;
  startTime: number;
  elapsedTime: number;

  constructor() {
    this.audioContext = new AudioContext();
    this.loadAudioFile();
    this.isPlaying = false;
    this.startTime = 0;
    this.elapsedTime = 0;
  }

  loadAudioFile() {
    const audioUrl = './assets/skrryt.mp3'; // Replace with the path to your song file
    fetch(audioUrl)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.audioBuffer = audioBuffer;
        this.durationInSeconds = audioBuffer.duration;
        console.log('Song duration:', this.durationInSeconds, 'seconds');
      })
      .catch(error => {
        console.error('Error loading audio file:', error);
      });
  }

  play() {
    if (this.isPlaying) {
      return; // Do nothing if already playing
    }

    this.audioSource = this.audioContext.createBufferSource();
    this.audioSource.buffer = this.audioBuffer;
    this.audioSource.connect(this.audioContext.destination);
    this.audioSource.start(0, this.elapsedTime); // Start from the elapsed time
    this.startTime = this.audioContext.currentTime - this.elapsedTime;
    this.isPlaying = true;
  }

  pause() {
    if (!this.isPlaying) {
      return; // Do nothing if not playing
    }

    this.audioSource.stop();
    this.audioSource.disconnect();
    this.elapsedTime = this.audioContext.currentTime - this.startTime;
    this.isPlaying = false;
  }
}
