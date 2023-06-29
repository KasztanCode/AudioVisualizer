import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressbar', { static: false }) progressbar!: ElementRef;

  isPlaying: boolean = false;
  progressPercent: number = 0;
  volume: number = 0.2;
  durationInSeconds: number = 0;
  timer: any;
  isInsideDiv: boolean = false;
  progressLeftX!: number;
  progressRightX!: number;
  highlightedTime: number = 0;
  highlightedPoint!: number;
  viewportWidth!: number;
  viewportHeight!: number;
  highlightedPercent!:number
  isProgressClicked:boolean = false

  ngAfterViewInit() {
    this.audioPlayer.nativeElement.addEventListener('loadedmetadata', () => {
      this.durationInSeconds = this.audioPlayer.nativeElement.duration;
      this.findProgressEdges();
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    this.findProgressEdges();
  }

  findProgressEdges() {
    const progressBarElement: HTMLElement = this.progressbar.nativeElement;
    const rect: DOMRect = progressBarElement.getBoundingClientRect();
    this.progressLeftX = rect.left;
    this.progressRightX = rect.right;
  }

  onProgressClick() {
    this.highlightedPercent = (this.highlightedPoint - this.progressLeftX) / (this.progressRightX - this.progressLeftX)*100;
    this.isProgressClicked = true
    this.audioPlayer.nativeElement.currentTime = this.highlightedTime;
  }

  onMouseEnter(event: MouseEvent) {
    this.isInsideDiv = true;
  }

  onMouseLeave(event: MouseEvent) {
    this.isInsideDiv = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isInsideDiv) {
      this.highlightedPoint = event.clientX;
      this.highlightedTime = this.durationInSeconds * (this.highlightedPoint - this.progressLeftX) / (this.progressRightX - this.progressLeftX);
    }
  }

  play() {
    this.audioPlayer.nativeElement.play();
    this.isPlaying = true;
    this.startTimer();
    this.audioPlayer.nativeElement.volume = this.volume;
  }

  pause() {
    this.audioPlayer.nativeElement.pause();
    this.isPlaying = false;
    this.stopTimer();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  startTimer() {
    this.progressPercent = (this.audioPlayer.nativeElement.currentTime / this.durationInSeconds) * 100;
    this.timer = setInterval(() => {
      this.progressPercent = (this.audioPlayer.nativeElement.currentTime / this.durationInSeconds) * 100;
      if (Math.floor(this.audioPlayer.nativeElement.currentTime) === Math.floor(this.durationInSeconds)) {
        this.stopTimer();
      }
      this.isProgressClicked=false
    }, 10);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  changeVolume() {
    this.audioPlayer.nativeElement.volume = this.volume;
  }
}
