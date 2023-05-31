import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Estimate } from 'src/app/interfaces/estimate.interface';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-estimate-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './estimate-preview.component.html',
  styleUrls: ['./estimate-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimatePreviewComponent {
  @Input() estimate!: Estimate;
}