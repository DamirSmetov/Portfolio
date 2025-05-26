import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HttpClient } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';

// Import your components

// Import your services (optional, or use providedIn: 'root')

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClient, 
    FormsModule, // Optional: useful for ngModel, etc.
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
