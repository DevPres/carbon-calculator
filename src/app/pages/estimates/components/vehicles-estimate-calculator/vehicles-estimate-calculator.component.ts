import { ChangeDetectionStrategy, Component, Input, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from '../calculator.abstract';
import { CalculatorEnum, TotalEstimate, VehicleEstimate, VehiclesEstimate } from 'src/app/interfaces/app.interface';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { EstimatesApiService } from '../../estimates.service';
import { toSignal } from '@angular/core/rxjs-interop';
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

    @Input({required: true}) estimate!: TotalEstimate


    calculatorKey = CalculatorEnum.vehicles

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
    private store = inject(Store);
    private apiService = inject(EstimatesApiService);

    private takeUntilDestroyed = untildestroyed();

    private calculateVehicleEstimate$$ = new ReplaySubject<number>();

    isCalculatingEstimate: WritableSignal<{ calculating: boolean, index: number | null }> = signal({calculating: false, index: null});
    vehicleMakes = this.store.selectSignal(estimateFeature.selectVehicleMakes);
    vehicleModels = this.store.selectSignal(estimateFeature.selectVehicleModels);


    ngOnInit(): void {

      this.store.dispatch(EstimateActions.loadingVehicleMakes());
      let vehicles = this.estimate.vehiclesEstimate.vehicles;

      if(vehicles.length) {
        this.vehicles.clear();
        vehicles.forEach(vehicle => {
          this.vehicles.push(new FormGroup({
            distance_unit: new FormControl("km"),
            vehicle_make_id: new FormControl(vehicle.vehicle_make_id),
            vehicle_model_id: new FormControl(vehicle.vehicle_model_id),
            vehicle_year: new FormControl(vehicle.vehicle_year),
            distance_value: new FormControl(vehicle.distance_value),
            emissions: new FormControl(vehicle.emissions),
          }),{emitEvent: false})

        });
      } else {
        this.vehicles.push(new FormGroup({
          distance_unit: new FormControl("km"),
          vehicle_make_id: new FormControl(""),
          vehicle_model_id: new FormControl(""),
          vehicle_year: new FormControl(null),
          distance_value: new FormControl(""),
          emissions: new FormControl(null),
        }),{emitEvent: false})
      }

      this.calculateVehicleEstimate$$.pipe(
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
        this.takeUntilDestroyed(),
      ).subscribe();

      this.vehicles.valueChanges.pipe(
        this.takeUntilDestroyed(),
        debounceTime(300),
      ).subscribe(()=>this.syncEstimate());
    }

    syncEstimate(): void {
      this.store.dispatch(EstimateActions.syncVehiclesEstimate({ vehiclesEstimate: this.vehiclesEstimate }));
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

    clearModel(formIndex: number): void {
      this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_model_id')?.setValue("");
      this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_year')?.setValue(null);
    }

    setModelYear(formIndex: number): void {
      let makeId = this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_make_id')?.value;
      let modelId = this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_model_id')?.value;
      let year = this.vehicleModels()[makeId].find(model => model.id == modelId)?.year;
      this.form.get('vehicles')?.get(formIndex.toString())?.get('vehicle_year')?.setValue(year);
    }

    onCalculateVehicleEstimate(formIndex:number): void {
      this.calculateVehicleEstimate$$.next(formIndex)
    }

    onAddVehicle(): void {
      this.vehicles.push(new FormGroup({
        distance_unit: new FormControl("km"),
        vehicle_make_id: new FormControl(""),
        vehicle_model_id: new FormControl(""),
        vehicle_year: new FormControl(null),
        distance_value: new FormControl(""),
        emissions: new FormControl(null),
      }))
    }

    onRemoveVehicle(formIndex: number): void {
      this.vehicles.removeAt(formIndex);
    }
}
