import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
	private variable1 = new BehaviorSubject<any>(null);
	private variable2 = new BehaviorSubject<any>(null);
	private variable3 = new BehaviorSubject<any>(null);

	variable1$ = this.variable1.asObservable();
	variable2$ = this.variable2.asObservable();
	variable3$ = this.variable3.asObservable();

	constructor() { }

	setVariables(songPath: any, imagePath: any, backgroundPath: any): void {
		this.variable1.next(songPath);
		this.variable2.next(imagePath);
		this.variable3.next(backgroundPath);
	}
}
