import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { estimateFeature } from '@pages/estimates/estimate.store';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-estimate-preview',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatListModule],
  templateUrl: './estimate-preview.component.html',
  styleUrls: ['./estimate-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimatePreviewComponent {
  private readonly store = inject(Store);

  readonly estimate = this.store.selectSignal(estimateFeature.selectSelectedEstimate);

  vehiclesNumber = computed(() => {
    let vehicles = this.estimate()?.vehiclesEstimate?.vehicles;
    if (!vehicles) return 0;
    return vehicles.filter(vehicle => vehicle.emissions > 0).length;
  });

  billsNumber = computed(() => {
    let bills = this.estimate()?.billsEstimate?.bills
    if (!bills) return 0;
    return bills.filter(bills => bills.emissions > 0).length;
  });

}
