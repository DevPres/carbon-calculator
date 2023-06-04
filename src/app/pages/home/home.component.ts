import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppActions } from 'src/app/app.store';
import { CreateEstimateDialogComponent } from 'src/app/components/create-estimate-dialog/create-estimate-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(Store);

  onCreateNewEstimate(): void {
    const dialogRef = this.dialog.open(CreateEstimateDialogComponent);

    dialogRef.afterClosed().subscribe(([close, name]) => {
      if(close) {
        this.store.dispatch(AppActions.creatingEmptyEstimate({ name }))
      }
    });

  }

}
