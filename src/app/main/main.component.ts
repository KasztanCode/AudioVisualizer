import {
	Component,
	ViewChild,
	ElementRef,
	AfterViewInit,
	HostListener,
} from '@angular/core';

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
	ngAfterViewInit() {
		this.audioPlayer.nativeElement.addEventListener('loadedmetadata', () => {
			this.durationInSeconds = this.audioPlayer.nativeElement.duration;
		});
		this.audioPlayer.nativeElement.volume = this.volume;
		this.findDivsEdges(this.progressbar);
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
			this.cutFrequenciesArray = this.frequenciesArray.slice(30,390)

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
	togglePlay() {
		if (this.isPlaying) {
			this.audioPlayer.nativeElement.pause();
			this.isPlaying = false;
			this.stopTimer();
		} else {
			this.audioPlayer.nativeElement.play();
			this.isPlaying = true;
			this.startTimer();
			this.startAudioAnalysis();
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
