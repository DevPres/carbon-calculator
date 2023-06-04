import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingEstimate, BillingsEstimate, CalculatorEnum, TotalEstimate } from 'src/app/interfaces/app.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { Store } from '@ngrx/store';
import { EstimatesApiService } from '@pages/estimates/estimates.service';
import { EMPTY, ReplaySubject, catchError, debounceTime, finalize, retry, switchMap, tap } from 'rxjs';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EstimateActions } from '@pages/estimates/estimate.store';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-billings-estimate-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './billings-estimate-calculator.component.html',
  styleUrls: ['./billings-estimate-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingsEstimateCalculatorComponent {
    @Input({required: true}) set estimate(value: TotalEstimate | null) {
      let billings = value && value.billingsEstimate.billings || [];
      this.createForm(billings)
      this.initialData = billings;
    }

    @Input() resetChanges$!: ReplaySubject<void>;

    public form = new FormGroup({
      billings: new FormArray([])
    });

    get billings(): FormArray {
      return this.form.get('billings') as FormArray;
    }

    get totalEmissions(): number {
      return this.billings.value.reduce((acc: number, billing: BillingEstimate) => {
        return acc + billing.emissions;
      }, 0)
    }

    get billingsEstimate(): BillingsEstimate {
      return ({
        type: CalculatorEnum.billings,
        totalEmissions: this.totalEmissions,
        billings: this.billings.value
      })
    }

    get lastRowIsEmpty(): boolean {
      let lastRow = this.billings.at(-1).value;
      return !lastRow.country.length && !lastRow.electricity_value || false
    }

    private readonly store = inject(Store);
    private readonly apiService = inject(EstimatesApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly cd = inject(ChangeDetectorRef);

    private calculateEstimate$$ = new ReplaySubject<number>();

    isCalculatingEstimate: WritableSignal<{ calculating: boolean, index: number | null }> = signal({calculating: false, index: null});

    countries: {id: string, name: string}[] = [];
    initialData: BillingEstimate[] = [];

    ngOnInit(): void {
      this.calculateEstimate$$.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((formIndex) => this.isCalculatingEstimate.mutate(v=> {v.calculating = true; v.index = formIndex})),
        switchMap((formIndex) => {
          let { electricity_value, country } = this.billings.at(formIndex).value;
          return this.apiService.calculateBillingEmissions({electricity_value, country}).pipe(
            retry(3),
            tap(estimate => {
              let estimateKg = estimate.data.attributes.carbon_kg;
              this.form.get('billings')?.get(formIndex.toString())?.get('emissions')?.setValue(estimateKg);
            }),
            catchError((err) => EMPTY)
          )
          finalize(() =>
            setTimeout(() =>
              this.isCalculatingEstimate.mutate(v => {v.calculating = false; v.index = null})
            ,1000)
          )
        })
      ).subscribe();

      this.resetChanges$.pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(() => {
        console.log('reset changes')
        this.createForm(this.initialData)
        this.cd.detectChanges()
      })

      this.billings.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
      ).subscribe(()=>this.syncEstimate());
  }

   private createForm(data: BillingEstimate[], emit = false): void {
      this.billings.clear({emitEvent: emit});
      if(data.length) {
        data.forEach(vehicle => {
          this.addRow(vehicle);
        })
      } else {
        this.addRow(null);
      }
   }

   private addRow(data: BillingEstimate | null, emit = false): void {
      this.billings.push(new FormGroup({
        country: new FormControl(""),
        electricity_value: new FormControl(data?.electricity_value || 0),
        emissions: new FormControl(data?.emissions || null),
      }),{emitEvent: emit})
  }

  private syncEstimate(): void {
      this.store.dispatch(EstimateActions.syncBillingsEstimate({ billingsEstimate: this.billingsEstimate }));
  }

  onCalculateEstimate(formIndex:number): void {
      this.calculateEstimate$$.next(formIndex)
  }

  onAddRow(): void {
    if(this.lastRowIsEmpty) return;
    this.addRow(null);
  }

  onRemoveRow(formIndex: number): void {
    this.billings.removeAt(formIndex);
  }





}
