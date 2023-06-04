import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillEstimate, BillsEstimate, CalculatorEnum, TotalEstimate } from 'src/app/interfaces/app.interface';
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
import { COUNTRIES } from 'src/app/utils/countries.model';

@Component({
  selector: 'app-bills-estimate-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './bills-estimate-calculator.component.html',
  styleUrls: ['./bills-estimate-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillsEstimateCalculatorComponent {
    @Input({required: true}) set estimate(value: TotalEstimate | null) {
      let bills = value && value.billsEstimate.bills || [];
      this.createForm(bills)
      this.initialData = bills;
    }

    @Input() resetChanges$!: ReplaySubject<void>;

    public form = new FormGroup({
      bills: new FormArray([])
    });

    get bills(): FormArray {
      return this.form.get('bills') as FormArray;
    }

    get totalEmissions(): number {
      return this.bills.value.reduce((acc: number, bill: BillEstimate) => {
        return acc + bill.emissions;
      }, 0)
    }

    get billsEstimate(): BillsEstimate {
      return ({
        type: CalculatorEnum.bills,
        totalBills: this.bills.length,
        totalElectricityMwh: this.bills.value.reduce((acc: number, bill: BillEstimate) => {
          return acc + bill.electricity_value;
        }, 0),
        totalEmissions: this.totalEmissions,
        bills: this.bills.value
      })
    }

    get lastRowIsEmpty(): boolean {
      let lastRow = this.bills.at(-1).value;
      return !lastRow.country.length && !lastRow.electricity_value || false
    }

    private readonly store = inject(Store);
    private readonly apiService = inject(EstimatesApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly cd = inject(ChangeDetectorRef);

    private calculateEstimate$$ = new ReplaySubject<number>();

    isCalculatingEstimate: WritableSignal<{ calculating: boolean, index: number | null }> = signal({calculating: false, index: null});

    countries: {code: string, name: string}[] = COUNTRIES;
    initialData: BillEstimate[] = [];

    ngOnInit(): void {
      this.calculateEstimate$$.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((formIndex) => this.isCalculatingEstimate.mutate(v=> {v.calculating = true; v.index = formIndex})),
        switchMap((formIndex) => {
          let { electricity_value, country } = this.bills.at(formIndex).value;
          return this.apiService.calculateBillEmissions({electricity_value, country}).pipe(
            retry(3),
            tap(estimate => {
              let estimateKg = estimate.data.attributes.carbon_kg;
              this.form.get('bills')?.get(formIndex.toString())?.get('emissions')?.setValue(estimateKg);
            }),
            catchError((err) => EMPTY),
            finalize(() =>
              setTimeout(() =>
                this.isCalculatingEstimate.mutate(v => {v.calculating = false; v.index = null})
              ,1000)
            )
          )
        })
      ).subscribe();

      this.resetChanges$.pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(() => {
        console.log('reset changes')
        this.createForm(this.initialData)
        this.syncEstimate();
        this.cd.detectChanges()
      })

      this.bills.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
      ).subscribe(()=>this.syncEstimate());
  }

   private createForm(data: BillEstimate[], emit = false): void {
      this.bills.clear({emitEvent: emit});
      if(data.length) {
        data.forEach(vehicle => {
          this.addRow(vehicle);
        })
      } else {
        this.addRow(null);
      }
   }

   private addRow(data: BillEstimate | null, emit = false): void {
      this.bills.push(new FormGroup({
        country: new FormControl(data?.country ||""),
        electricity_value: new FormControl(data?.electricity_value || 0),
        emissions: new FormControl(data?.emissions || null),
      }),{emitEvent: emit})
  }

  private syncEstimate(): void {
      this.store.dispatch(EstimateActions.syncBillsEstimate({ billsEstimate: this.billsEstimate }));
  }

  onCalculateEstimate(formIndex:number): void {
      this.calculateEstimate$$.next(formIndex)
  }

  onAddRow(): void {
    if(this.lastRowIsEmpty) return;
    this.addRow(null);
  }

  onRemoveRow(formIndex: number): void {
    this.bills.removeAt(formIndex);
  }





}
