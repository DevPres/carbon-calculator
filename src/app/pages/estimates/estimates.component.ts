import { ChangeDetectionStrategy, Component, Input, inject, effect, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { VehiclesEstimateCalculatorComponent } from './components/vehicles-estimate-calculator/vehicles-estimate-calculator.component';
import { Store } from '@ngrx/store';
import { AppActions, selectEstimates } from 'src/app/app.store';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EstimateActions, estimateFeature } from './estimate.store';
import { untildestroyed } from 'src/app/utils/function';
import { TotalEstimate } from 'src/app/interfaces/app.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-estimates',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, VehiclesEstimateCalculatorComponent ],
  templateUrl: './estimates.component.html',
  styleUrls: ['./estimates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimatesComponent {
  @Input() id!: string;

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly untilDestroyed = untildestroyed();

  readonly estimate$: Observable<TotalEstimate | undefined> = this.store.select(selectEstimates).pipe(
    map(estimates => estimates.find(estimate => estimate.id === this.id)),
  );

  readonly selectedEstimate = this.store.selectSignal(estimateFeature.selectSelectedEstimate);

  readonly isUnsaved = this.store.selectSignal(estimateFeature.selectSelectedEstimateUnsaved);

  ngOnInit() {
    this.estimate$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((estimate: TotalEstimate | undefined) => {
      if(!estimate) this.router.navigate(['/home']);
      else this.store.dispatch(EstimateActions.loadSelectedEstimate( estimate ));
    });
  }

  onSaveChanges() {
    this.store.dispatch(AppActions.saveChangeOnEstimateById(this.selectedEstimate() as TotalEstimate));
  }

}
