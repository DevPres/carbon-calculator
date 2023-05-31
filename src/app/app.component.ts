import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { EstimateActions } from './app.store';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LayoutComponent } from './components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSlideToggleModule, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'carbon-calculator';

  constructor(private store: Store) {}

  ngOnInit() {
    console.log(this.store);
    this.store.dispatch(EstimateActions.addingEstimate({ estimate: { id: 1, name: 'test' } }));
  }
}
