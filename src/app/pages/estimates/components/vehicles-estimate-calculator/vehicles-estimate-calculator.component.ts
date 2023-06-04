import { ChangeDetectionStrategy, Component, DestroyRef, Input, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from '../calculator.abstract';
import { CalculatorEnum, TotalEstimate, VehicleEstimate, VehiclesEstimate } from 'src/app/interfaces/app.interface';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { EstimatesApiService } from '../../estimates.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, ReplaySubject, catchError, debounceTime, finalize, retry, switchMap, takeUntil, tap } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { EstimateActions, estimateFeature } from '@pages/estimates/estimate.store';
import { FilterByMakeId } from '@pages/estimates/pipes/filter-by-make-id.pipe';
import { untildestroyed } from 'src/app/utils/function';
import { ServiceVehicleEstimateRequest } from 'src/app/interfaces/api-service.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


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
      console.log('estimate input', value)
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


    private takeUntilDestroyed = untildestroyed();

    private calculateVehicleEstimate$$ = new ReplaySubject<number>();

    isCalculatingEstimate: WritableSignal<{ calculating: boolean, index: number | null }> = signal({calculating: false, index: null});
    vehicleMakes = this.store.selectSignal(estimateFeature.selectVehicleMakes);
    vehicleModels = this.store.selectSignal(estimateFeature.selectVehicleModels);
    initialData: any;


    ngOnInit(): void {

      this.calculateVehicleEstimate$$.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((formIndex) => this.isCalculatingEstimate.mutate(v=> {v.calculating = true; v.index = formIndex})),
        switchMap(formIndex => {
          let { type, distance_unit, distance_value, vehicle_model_id } = this.form.get('vehicles')?.get(formIndex.toString())?.value;

          return this.apiService.calculateVehicleEmissions({ type, distance_unit, distance_value, vehicle_model_id}).pipe(
            retry(3),
            tap(estimate => {
              let estimateKg = estimate.data.attributes.carbon_kg;
              this.form.get('vehicles')?.get(formIndex.toString())?.get('emissions')?.setValue(estimateKg);
            }),
            //HANDLE ERROR
            catchError(err => EMPTY),
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
        console.log('reset changes')
        this.createForm(this.initialData)
      })

      this.vehicles.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
      ).subscribe(()=>this.syncEstimate());
    }


    private createForm(vehicles: VehicleEstimate[], emit = false): void {
      this.vehicles.clear({emitEvent: emit});
      if(vehicles.length) {
        vehicles.forEach(vehicle => {
          this.addVeichleRow(vehicle);
        })
      } else {
        this.addVeichleRow(null);
      }

    }

    private addVeichleRow(veichle: VehicleEstimate | null, emit = false): void {
      this.vehicles.push(new FormGroup({
        distance_unit: new FormControl("km"),
        vehicle_make_id: new FormControl(veichle?.vehicle_make_id || ""),
        vehicle_model_id: new FormControl(veichle?.vehicle_model_id || ""),
        vehicle_year: new FormControl(veichle?.vehicle_year || null),
        distance_value: new FormControl(veichle?.distance_value || 0),
        emissions: new FormControl(veichle?.emissions || null),
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

    onCalculateVehicleEstimate(formIndex:number): void {
      this.calculateVehicleEstimate$$.next(formIndex)
    }

    onAddVehicle(): void {
      if(this.lastRowIsEmpty) return;
      this.addVeichleRow(null);
    }

    onRemoveVehicle(formIndex: number): void {
      this.vehicles.removeAt(formIndex);
    }
}
