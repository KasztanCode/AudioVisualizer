import {Component ,AfterViewInit} from '@angular/core';
import {SharedService} from "./shared/shared.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit{
	constructor(private sharedService: SharedService) { }

	backgroundPath:any;

	ngAfterViewInit() {
		this.sharedService.variable3$.subscribe(value => this.backgroundPath = value);
	}
}
