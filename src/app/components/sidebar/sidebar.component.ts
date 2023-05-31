import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { EstimateActions, selectEstimates } from 'src/app/app.store';
import { Observable } from 'rxjs';
import { Estimate } from 'src/app/interfaces/estimate.interface';
import { EstimatePreviewComponent } from './estimate-preview/estimate-preview.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,  MatButtonModule, MatIconModule, EstimatePreviewComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private store = inject(Store);
  public estimates: Signal<Estimate[]> = this.store.selectSignal(selectEstimates);

  ngOnInit(): void {
    this.store.dispatch(EstimateActions.addingEstimate({ estimate: { id: 1, name: 'Estimate 1', description: 'Estimate 1 description' } }));
    this.store.dispatch(EstimateActions.addingEstimate({ estimate: { id: 2, name: 'Estimate 2', description: 'Estimate 2 description' } }));
    console.log(this.estimates())
  }

}