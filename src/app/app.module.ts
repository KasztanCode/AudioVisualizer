import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SecondsToMinutesPipe } from './seconds-to-minutes.pipe';
import {NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { SongSelectorComponent } from './song-selector/song-selector.component';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    SecondsToMinutesPipe,
    SongSelectorComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    NgOptimizedImage,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
