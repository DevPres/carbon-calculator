import { ChangeDetectionStrategy, Component, Input, inject, effect, DestroyRef, Signal, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { VehiclesEstimateCalculatorComponent } from './components/vehicles-estimate-calculator/vehicles-estimate-calculator.component';
import { Store } from '@ngrx/store';
import { AppActions, selectEstimates } from 'src/app/app.store';
import { Observable, ReplaySubject, filter, first, map, shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EstimateActions, estimateFeature } from './estimate.store';
import { untildestroyed } from 'src/app/utils/function';
import { TotalEstimate } from 'src/app/interfaces/app.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BillsEstimateCalculatorComponent } from './components/bills-estimate-calculator/bills-estimate-calculator.component';
import { EstimatePreviewComponent } from './components/estimate-preview/estimate-preview.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-estimates',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, MatButtonModule, VehiclesEstimateCalculatorComponent, BillsEstimateCalculatorComponent, EstimatePreviewComponent ],
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
    map(estimates => estimates.find(estimate => estimate.id === this.id) || null),
  );

  readonly selectedEstimate: Signal<TotalEstimate | null> = this.store.selectSignal(estimateFeature.selectSelectedEstimate);
  readonly isUnsaved: Signal<boolean> = this.store.selectSignal(estimateFeature.selectSelectedEstimateUnsaved);

  resetChanges$ = new ReplaySubject<void>();


  ngOnInit(): void {
    this.store.select(estimateFeature.selectFormConfig).pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(formConfig => !formConfig.vehicleMakes.length)
    ).subscribe(() => this.store.dispatch(EstimateActions.loadingVehicleMakes()));

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

  onDeleteEstimate(): void {
    this.store.dispatch(EstimateActions.deletingEstimate({ id: this.id }));
    this.router.navigate(['/home']);
  }

  resetChanges() {
    this.store.dispatch(EstimateActions.resettingEstimate());
    this.resetChanges$.next()
  }

}
