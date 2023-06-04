import { ChangeDetectionStrategy, Component, Input, inject, effect, DestroyRef, Signal, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { VehiclesEstimateCalculatorComponent } from './components/vehicles-estimate-calculator/vehicles-estimate-calculator.component';
import { Store } from '@ngrx/store';
import { AppActions, selectEstimates } from 'src/app/app.store';
import { Observable, ReplaySubject, first, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EstimateActions, estimateFeature } from './estimate.store';
import { untildestroyed } from 'src/app/utils/function';
import { TotalEstimate } from 'src/app/interfaces/app.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BillingsEstimateCalculatorComponent } from './components/billings-estimate-calculator/billings-estimate-calculator.component';

@Component({
  selector: 'app-estimates',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, VehiclesEstimateCalculatorComponent, BillingsEstimateCalculatorComponent ],
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

  readonly estimate$: Observable<TotalEstimate | null> = this.store.select(selectEstimates).pipe(
    tap(() => console.log('passo select' )),
    map(estimates => estimates.find(estimate => estimate.id === this.id) || null),
  );

  readonly selectedEstimate: Signal<TotalEstimate | null> = this.store.selectSignal(estimateFeature.selectSelectedEstimate);
  readonly isUnsaved: Signal<boolean> = this.store.selectSignal(estimateFeature.selectSelectedEstimateUnsaved);

  resetChanges$ = new ReplaySubject<void>();


  ngOnInit(): void {
    console.log('ngOnInit EstimatesComponent')
    this.store.dispatch(EstimateActions.loadingVehicleMakes());

    this.estimate$.pipe(
      first(),
    ).subscribe((estimate: TotalEstimate | null) => {
      if(!estimate) {
        this.router.navigate(['/home']);
        return;
      }
      this.store.dispatch(EstimateActions.loadSelectedEstimate( estimate ));
    });
  }

  onSaveChanges(): void {
    this.store.dispatch(EstimateActions.savingEstimate(this.selectedEstimate() as TotalEstimate));
  }

  onDeleteChanges(): void {
    this.resetChanges();
  }

  resetChanges() {
    this.resetChanges$.next()
    this.store.dispatch(EstimateActions.resettingEstimate());
  }

}
