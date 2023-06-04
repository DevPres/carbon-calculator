import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorEnum, TotalEstimate, VehicleEstimate, VehiclesEstimate } from 'src/app/interfaces/app.interface';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { EstimatesApiService } from '../../estimates.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, ReplaySubject, catchError, debounceTime, finalize, of, retry, switchMap, takeUntil, tap } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { EstimateActions, estimateFeature } from '@pages/estimates/estimate.store';
import { FilterByMakeId } from '@pages/estimates/pipes/filter-by-make-id.pipe';
import { untildestroyed } from 'src/app/utils/function';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppActions } from 'src/app/app.store';


@Component({
  selector: 'app-vehicles-estimate-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, FilterByMakeId, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './vehicles-estimate-calculator.component.html',
  styleUrls: ['./vehicles-estimate-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesEstimateCalculatorComponent {

    @Input({required: true}) set estimate(value: TotalEstimate | null) {
       let vehicles = value && value.vehiclesEstimate.vehicles || [];
      this.createForm(vehicles)
      this.initialData = vehicles;
    }

    @Input() resetChanges$!: ReplaySubject<void>;

    public form = new FormGroup({
      vehicles: new FormArray([])
    });


    get vehicles(): FormArray {
      return this.form.get('vehicles') as FormArray;
    }

    get totalEmissions(): number {
      return this.vehicles.value.reduce((acc: number, vehicle: VehicleEstimate) => {
        return acc + vehicle.emissions;
      }, 0)
    }

    get vehiclesEstimate(): VehiclesEstimate {
      return ({
        type: CalculatorEnum.vehicles,
        totalEmissions: this.totalEmissions,
        totalVehicles: this.vehicles.value.length,
        totalDistanceKm: this.vehicles.value.reduce((acc: number, vehicle: VehicleEstimate) => {
          return acc + vehicle.distance_value;
        }, 0),
        vehicles: this.vehicles.value
      })
    }

    get lastRowIsEmpty(): boolean {
      let lastRow = this.vehicles.at(-1).value;
      return !lastRow.vehicle_make_id.length && !lastRow.distance_value || false
    }
    private readonly store = inject(Store);
    private readonly apiService = inject(EstimatesApiService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly cd = inject(ChangeDetectorRef);


    private calculateEstimate$$ = new ReplaySubject<number>();

    isCalculatingEstimate: WritableSignal<{ calculating: boolean, index: number | null }> = signal({calculating: false, index: null});
    vehicleMakes = this.store.selectSignal(estimateFeature.selectVehicleMakes);
    vehicleModels = this.store.selectSignal(estimateFeature.selectVehicleModels);
    initialData!: VehicleEstimate[];


    ngOnInit(): void {

      this.calculateEstimate$$.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((formIndex) => this.isCalculatingEstimate.mutate(v=> {v.calculating = true; v.index = formIndex})),
        switchMap(formIndex => {
          let { distance_unit, distance_value, vehicle_model_id } = this.form.get('vehicles')?.get(formIndex.toString())?.value;

          return this.apiService.calculateVehicleEmissions({ distance_unit, distance_value, vehicle_model_id}).pipe(
            retry(3),
            tap(estimate => {
              let estimateKg = estimate.data.attributes.carbon_kg;
              this.form.get('vehicles')?.get(formIndex.toString())?.get('emissions')?.setValue(estimateKg);
            }),
            catchError((err) => of(this.store.dispatch(AppActions.occuringError()))),
            finalize(() =>
              setTimeout(() =>
                     this.isCalculatingEstimate.mutate(v => {v.calculating = false; v.index = null})
              ,1000)
            )
          )
        }),
      ).subscribe();

      this.resetChanges$.pipe(
        takeUntilDestroyed(this.destroyRef),

      ).subscribe(() => {
        this.createForm(this.initialData);
        this.syncEstimate();
        this.cd.detectChanges()
      })

      this.vehicles.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
      ).subscribe(()=>this.syncEstimate());
    }


    private createForm(data: VehicleEstimate[], emit = false): void {
      this.vehicles.clear({emitEvent: emit});
      if(data.length) {
        data.forEach(vehicle => {
          this.addRow(vehicle);
        })
      } else {
        this.addRow(null);
      }

    }

    private addRow(data: VehicleEstimate | null, emit = false): void {
      this.vehicles.push(new FormGroup({
        distance_unit: new FormControl("km"),
        vehicle_make_id: new FormControl(data?.vehicle_make_id || "", [Validators.required]),
        vehicle_model_id: new FormControl(data?.vehicle_model_id || "", [Validators.required]),
        vehicle_year: new FormControl(data?.vehicle_year || null),
        distance_value: new FormControl(data?.distance_value || null, [Validators.required, Validators.min(1)]),
        emissions: new FormControl(data?.emissions || null),
      }),{emitEvent: emit})

    }

    private syncEstimate(): void {
      this.store.dispatch(EstimateActions.syncVehiclesEstimate({ vehiclesEstimate: this.vehiclesEstimate }));
    }

    private setModelYear(formIndex: number): void {
      let makeId = this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_make_id')?.value;
      let modelId = this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_model_id')?.value;
      let year = this.vehicleModels()[makeId].find(model => model.id == modelId)?.year;
      this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_year')?.setValue(year);
    }

    private clearModel(formIndex: number): void {
      this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_model_id')?.setValue("");
      this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_year')?.setValue(null);
    }
    onMakeSelected($ev: MatSelectChange, formIndex: number): void {
      let makeid = $ev.value
      this.clearModel(formIndex);
      if(makeid in this.vehicleModels()) return;
      this.store.dispatch(EstimateActions.loadingModelsByMake({ makeId: makeid }));
    }

    onModelSelected($ev: MatSelectChange, formIndex: number): void {
      this.setModelYear(formIndex);
    }

    onCalculateEstimate(formIndex:number): void {
      this.calculateEstimate$$.next(formIndex)
    }

    onAddRow(): void {
      if(this.lastRowIsEmpty) return;
      this.addRow(null);
    }

    onRemoveRow(formIndex: number): void {
      this.vehicles.removeAt(formIndex);
      if(this.vehicles.length == 0) {
        this.addRow(null);
      }
    }
}
