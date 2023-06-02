import { Directive, Input, Signal, WritableSignal, signal } from '@angular/core';
import { CalculatorType, VehiclesEstimate } from 'src/app/interfaces/app.interface';


@Directive()
export abstract class CalculatorComponent {
    @Input() estimate!: VehiclesEstimate | null

    abstract calculatorKey: CalculatorType
    public calculatedEstimate: WritableSignal<VehiclesEstimate | null> = signal(null);

    ngOnInit(): void {
      if(this.estimate && this.estimate.type !== this.calculatorKey) {
        console.error(`CalculatorComponent: Needed a ${this.calculatorKey} estimate, but got a ${this.estimate.type} estimate instead.`)
      }
    }

    abstract syncEstimate(): void
}
