import { Signal } from '@angular/core';
import { VehicleEstimate } from 'src/app/interfaces/app.interface';



export abstract class CalculatorComponent {

    public emissionEstimate!: Signal<VehicleEstimate>;

    protected abstract calculateEmissionEstimate(): void;

}
