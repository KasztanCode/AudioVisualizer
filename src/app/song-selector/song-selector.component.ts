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
			name:'Adam Html',
			path: './assets/Breath.mp3',
			imagePath: './assets/cover.jpg',
			backgroundPath: '../assets/cover.jpg'
		},
		{
			name:'Cypo Html',
			path: './assets/cypoV2.mp3',
			imagePath: './assets/cypo.jpg',
			backgroundPath: '../assets/cypo.jpg'
		},
		{
			name:'Goosebumps',
			path: './assets/goo.mp3',
			imagePath: './assets/cypo.jpg',
			backgroundPath: '../assets/cypo.jpg'
		}
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
