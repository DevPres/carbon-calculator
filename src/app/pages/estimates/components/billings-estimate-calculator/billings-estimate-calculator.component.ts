import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billings-estimate-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billings-estimate-calculator.component.html',
  styleUrls: ['./billings-estimate-calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingsEstimateCalculatorComponent {

}
