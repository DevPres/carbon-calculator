import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-estimate-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './create-estimate-dialog.component.html',
  styleUrls: ['./create-estimate-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEstimateDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateEstimateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  name = new FormControl('');

  get estimateName(): string {
    if(!this.name.value || this.name.value.length === 0) {
      return 'Nuova stima';
    }
    return this.name.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close([close, this.estimateName]);

  }
}
