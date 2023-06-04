import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { AppActions, selectEstimates, selectSelectedEstimateId } from 'src/app/app.store';
import { Observable } from 'rxjs';
import { TotalEstimate } from 'src/app/interfaces/app.interface';
import { EstimatePreviewComponent } from './estimate-preview/estimate-preview.component';
import { CreateEstimateDialogComponent } from '../create-estimate-dialog/create-estimate-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,  MatButtonModule, MatIconModule, EstimatePreviewComponent, MatDialogModule, MatListModule, MatDividerModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() sidebarOpen!: WritableSignal<boolean>;

  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);

  public estimates: Signal<TotalEstimate[]> = this.store.selectSignal(selectEstimates);
  public selectedEstimateId: Signal<string | null> = this.store.selectSignal(selectSelectedEstimateId)

  ngOnInit(): void {
  }

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
