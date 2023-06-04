import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppActions } from './app.store';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LayoutComponent } from './components/layout/layout.component';
import { HandleErrorService } from './services/handle-error.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  template: `
    <app-layout>
      <router-outlet></router-outlet>
    </app-layout>
  `,
})
export class AppComponent {
  title = 'carbon-calculator';
}
