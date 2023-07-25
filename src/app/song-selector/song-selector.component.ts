import {Component, OnInit} from '@angular/core';
import {SharedService} from "../shared/shared.service";

@Component({
  selector: 'app-song-selector',
  templateUrl: './song-selector.component.html',
  styleUrls: ['./song-selector.component.scss']
})
export class SongSelectorComponent implements OnInit{
	songs:any[] = [
		{
			name:'Song',
			path: './assets/Breath.mp3',
			imagePath: './assets/photo-placeholder-icon-17-3692647226.jpg',
			backgroundPath: '../assets/placeholder_template-2067894904.jpg'
		},
		{
			name:'Song',
			path: './assets/Breath.mp3',
			imagePath: './assets/photo-placeholder-icon-17-3692647226.jpg',
			backgroundPath: '../assets/placeholder_template-2067894904.jpg'
		},
		{
			name:'Song',
			path: './assets/Breath.mp3',
			imagePath: './assets/photo-placeholder-icon-17-3692647226.jpg',
			backgroundPath: '../assets/placeholder_template-2067894904.jpg'
		},
		{
			name:'Song',
			path: './assets/Breath.mp3',
			imagePath: './assets/photo-placeholder-icon-17-3692647226.jpg',
			backgroundPath: '../assets/placeholder_template-2067894904.jpg'
		},

	]

	highlightedButton!:number;
	ngOnInit() {
		this.buttonClick(this.songs[0].path,this.songs[0].imagePath,this.songs[0].backgroundPath, 0);
	}

	buttonClick(songPath: any, imagePath: any, backgroudPath: any, index:number): void {
		this.sharedService.setVariables(songPath, imagePath, backgroudPath);
		this.highlightedButton = index;
	}
	constructor(private sharedService: SharedService) {}

}
