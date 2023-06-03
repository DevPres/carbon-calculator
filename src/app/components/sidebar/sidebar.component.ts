import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppActions, selectEstimates } from 'src/app/app.store';
import { Observable } from 'rxjs';
import { TotalEstimate } from 'src/app/interfaces/app.interface';
import { EstimatePreviewComponent } from './estimate-preview/estimate-preview.component';
import { CreateEstimateDialogComponent } from '../create-estimate-dialog/create-estimate-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,  MatButtonModule, MatIconModule, EstimatePreviewComponent, MatDialogModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() sidebarOpen!: WritableSignal<boolean>;

  private store = inject(Store);
  public estimates: Signal<TotalEstimate[]> = this.store.selectSignal(selectEstimates);

  constructor(public dialog: MatDialog) {}

  onCloseSidebar(): void {
    this.sidebarOpen.update(v => false);
  }

  onAddEstimate(): void {
    const dialogRef = this.dialog.open(CreateEstimateDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.store.dispatch(AppActions.creatingEmptyEstimate())
      }
    });
  }

}
