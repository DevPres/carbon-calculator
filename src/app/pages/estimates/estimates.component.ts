import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-estimates',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule],
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
