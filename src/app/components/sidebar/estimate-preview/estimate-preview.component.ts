import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TotalEstimate } from 'src/app/interfaces/app.interface';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estimate-preview',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule],
  templateUrl: './estimate-preview.component.html',
  styleUrls: ['./estimate-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EstimatePreviewComponent {
  @Input() estimate!: TotalEstimate;

  get link(): string {
    return `/estimates/${this.estimate.id}`;
  }
}
