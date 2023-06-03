import { Directive, Input, Signal, WritableSignal, signal } from '@angular/core';
import { Action } from '@ngrx/store';
import { CalculatorType, TotalEstimate, VehiclesEstimate } from 'src/app/interfaces/app.interface';


@Directive()
export abstract class CalculatorComponent {
    @Input({required: true}) estimate!: TotalEstimate


}
