import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppActions, selectEstimates } from 'src/app/app.store';
import { Observable } from 'rxjs';
import { TotalEstimate } from 'src/app/interfaces/app.interface';
import { EstimatePreviewComponent } from './estimate-preview/estimate-preview.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,  MatButtonModule, MatIconModule, EstimatePreviewComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() sidebarOpen!: WritableSignal<boolean>;

  private store = inject(Store);
  public estimates: Signal<TotalEstimate[]> = this.store.selectSignal(selectEstimates);

  onCloseSidebar(): void {
    this.sidebarOpen.update(v => false);
  }

}
