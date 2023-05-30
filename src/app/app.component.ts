import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { EstimateActions } from './app.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'carbon-calculator';

  constructor(private store: Store) {}

  ngOnInit() {
    console.log(this.store);
    this.store.dispatch(EstimateActions.addingEstimate({ estimate: { id: 1, name: 'test' } }));
  }
}
