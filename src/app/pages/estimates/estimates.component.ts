import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estimates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estimates.component.html',
  styleUrls: ['./estimates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimatesComponent {
  @Input() id?: string;

  ngOnInit() {
    if(this.id) {
      console.log(this.id);
    }
  }

}
