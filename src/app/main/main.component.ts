import {Component, ViewChild, ElementRef, AfterViewInit, HostListener} from '@angular/core';
import {SharedService} from "../shared/shared.service";
import * as p5 from 'p5';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit{
	@ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
	@ViewChild('progressbar', { static: false }) progressbar!: ElementRef;

	isPlaying: boolean = false;
	isProgressClicked: boolean = false;
	isInsideDiv: boolean = false;

	volume: number = 0.2;
	durationInSeconds: number = 0;
	timer: any;

	highlightedTime: number = 0;
	highlightedPoint!: number;
	highlightedPercent!: number;

	progressPercent: number = 0;
	progressLeftX!: number;
	progressRightX!: number;

	frequencyDataSize: number = 2048;
	sampleRate!: number;
	frequencyRange!: number;
	frequencyResolution!: number;
	frequenciesArray!: number[];
	AvarageMagnitude!: number;
	cutFrequenciesArray!:number[];
	songPath: any;
	imagePath: any;

	private p5:any;

	constructor(private sharedService: SharedService) { }

	ngAfterViewInit() {
		this.sharedService.variable1$.subscribe(value => {
			this.songPath = value;
			this.audioPlayer.nativeElement.load();
			if (this.isPlaying) {
				this.audioPlayer.nativeElement.play().then(() => {
					console.log('New audio playing.');
					this.startAudioAnalysis();
					this.isPlaying = true;
				}).catch(error => {
					console.error('New audio playback failed.', error);
				});
			} else {
				this.startAudioAnalysis();
			}
		});
		this.sharedService.variable2$.subscribe(value => this.imagePath = value);


		this.audioPlayer.nativeElement.addEventListener('loadedmetadata', () => {
			this.durationInSeconds = this.audioPlayer.nativeElement.duration;
		});
		this.audioPlayer.nativeElement.volume = this.volume;
		this.findDivsEdges(this.progressbar);

		this.createCanvas();

	}

	private createCanvas() {
		const canvasContainer = document.getElementById('canvas-container');

		if (canvasContainer) {
			this.p5 = new p5(this.sketch.bind(this), canvasContainer);
		} else {
			console.error('Cannot find element with id "canvas-container"');
		}
	}

	private sketch(p5Instance: any) {

		const lengths = new Array(360).fill(0);

		p5Instance.setup = () => {
			p5Instance.createCanvas(800, 1000);
			p5Instance.stroke(0); // set the line color to white
			p5Instance.strokeWeight(2); // set the thickness of the line
		};

		p5Instance.draw = () => {
			let innerRadius = 200 + this.AvarageMagnitude/2
			p5Instance.background(255,255,255);
			p5Instance.translate(p5Instance.width / 2, p5Instance.height / 3); // move the origin to the center of the canvas

			for(let i = 0; i < 360; i++) {
				let angle = p5Instance.radians(i);

				// update the lengths array with new line lengths
				lengths[i] = this.cutFrequenciesArray[i]/2;
				lengths[i] = p5Instance.constrain(lengths[i], 0, 100);
				console.log(angle)

				let x1 = innerRadius * p5Instance.sin(angle);
				let y1 = innerRadius * p5Instance.cos(angle);
				let x2 = (innerRadius + lengths[i]) * p5Instance.sin(angle);
				let y2 = (innerRadius + lengths[i]) * p5Instance.cos(angle);

				p5Instance.line(x1, y1, x2, y2);
			}
		};
	}


	startAudioAnalysis() {
		const audioContext = new AudioContext();
		let sourceNode = audioContext.createMediaElementSource(
			this.audioPlayer.nativeElement
		);
		const analyserNode = audioContext.createAnalyser();

		sourceNode.connect(analyserNode);
		analyserNode.connect(audioContext.destination);
		analyserNode.fftSize = this.frequencyDataSize;
		this.sampleRate = audioContext.sampleRate;
		this.frequencyRange = this.sampleRate / 2;
		this.frequencyResolution = this.sampleRate / this.frequencyDataSize;

		const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);

		const analyzeAudio = () => {

			analyserNode.getByteFrequencyData(frequencyData);
			this.frequenciesArray = [...frequencyData];
			this.cutFrequenciesArray = this.frequenciesArray.slice(20,380)

			this.AvarageMagnitude =
				this.frequenciesArray.reduce((a, b) => a + b) /
				this.frequenciesArray.length;

			// Call the analyzeAudio function recursively

			requestAnimationFrame(analyzeAudio);

		};

		analyzeAudio();
	}

	calculateTransformOffset(averageMagnitude: number): string {
		const offset = averageMagnitude / 10; // Adjust the offset calculation as needed
		return `translate(${offset + 35}rem, 0rem)`;
	}

	@HostListener('window:resize', ['$event'])
	onWindowResize(): void {
		this.findDivsEdges(this.progressbar);
	}

	findDivsEdges(div: any) {
		const progressBarElement: HTMLElement = div.nativeElement;
		const rect: DOMRect = progressBarElement.getBoundingClientRect();
		this.progressLeftX = rect.left;
		this.progressRightX = rect.right;
	}

	onProgressClick() {
		this.highlightedPercent =
			((this.highlightedPoint - this.progressLeftX) /
				(this.progressRightX - this.progressLeftX)) *
			100;
		this.isProgressClicked = true;
		this.audioPlayer.nativeElement.currentTime = this.highlightedTime;
	}

	onMouseEnter() {
		this.isInsideDiv = true;
	}

	onMouseLeave() {
		this.isInsideDiv = false;
	}

	onMouseMove(event: MouseEvent) {
		if (this.isInsideDiv) {
			this.highlightedPoint = event.clientX;
			this.highlightedTime =
				(this.durationInSeconds *
					(this.highlightedPoint - this.progressLeftX)) /
				(this.progressRightX - this.progressLeftX);
		}
	}
	togglePlay(): void {
		if (this.isPlaying) {
			this.audioPlayer.nativeElement.pause();
			console.log('Pause');
			this.isPlaying = false;
			this.stopTimer(); // Stop timer when song is paused
		} else {
			this.audioPlayer.nativeElement.play().then(() => {
				console.log('Play started');
				this.startTimer(); // Start timer when song is played
				this.isPlaying = true;
			}).catch(error => {
				console.error('Playback failed.', error);
			});
		}
	}

	startTimer() {
		this.timer = setInterval(() => {
			this.progressPercent =
				(this.audioPlayer.nativeElement.currentTime / this.durationInSeconds) *
				100;
			if (
				Math.floor(this.audioPlayer.nativeElement.currentTime) ===
				Math.floor(this.durationInSeconds)
			) {
				this.isPlaying = false
				this.stopTimer();
			}
			this.isProgressClicked = false;
		}, 1000);
	}

	stopTimer() {
		clearInterval(this.timer);
	}

	changeVolume() {
		this.audioPlayer.nativeElement.volume = this.volume;
	}
}
