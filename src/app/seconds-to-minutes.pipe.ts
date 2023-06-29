import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToMinutes'
})
export class SecondsToMinutesPipe implements PipeTransform {
  transform(value: number): string {
    const flooredValue = Math.floor(value)
    const minutes: number = Math.floor(flooredValue / 60);
    const seconds: number = flooredValue % 60;
    const formattedMinutes: string = this.padNumber(minutes);
    const formattedSeconds: string = this.padNumber(seconds);
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  private padNumber(number: number): string {
    return number.toString().padStart(2, '0');
  }
}
