import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorComponent } from '../calculator.abstract';
import { VehicleEstimate } from 'src/app/interfaces/app.interface';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { EstimatesApiService } from '../../estimates.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { EstimateActions, estimateFeature } from '@pages/estimates/estimate.store';

@Component({
  selector: 'app-vehicles-estimate-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './vehicles-estimate-calculator.component.html',
  styleUrls: ['./vehicles-estimate-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesEstimateCalculatorComponent extends CalculatorComponent {

    @Input() estimate: VehicleEstimate | null = null

    public form = new FormGroup({
      vehicles: new FormArray([])
    });


    get vehicles(): FormArray {
      return this.form.get('vehicles') as FormArray;
    }

    private store = inject(Store);


    vehicleMakes = this.store.selectSignal(estimateFeature.selectVehicleMakes);


    ngOnInit(): void {
      this.store.dispatch(EstimateActions.loadingVehicleMakes());
      if(this.estimate) {
        this.vehicles.clear();
        this.estimate.vehicles.forEach(vehicle => {
          this.vehicles.push(new FormGroup({
            distance_unit: new FormControl("km"),
            vehicle_make: new FormControl(vehicle.vehicle_make),
            vehicle_model: new FormControl(vehicle.vehicle_model),
            vehicle_year: new FormControl(vehicle.vehicle_year),
            distance_value: new FormControl(vehicle.distance_value),
            vehicle_model_id: new FormControl(vehicle.vehicle_model_id)
          }))
        });
      } else {
        this.vehicles.push(new FormGroup({
          distance_unit: new FormControl("km"),
          vehicle_make: new FormControl(""),
          vehicle_model: new FormControl(""),
          vehicle_year: new FormControl(null),
          distance_value: new FormControl(""),
          vehicle_model_id: new FormControl("")
        }))
      }

      this.vehicles.valueChanges.subscribe(console.log);
    }

    public calculateEmissionEstimate(): void {
      this.emissionEstimate
      throw new Error('Method not implemented.');
    }

    onMakeSelected($ev: MatSelectChange): void {
      let makeid = $ev.value
    }

}
