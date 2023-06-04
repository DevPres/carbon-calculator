import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HandleErrorService {

  private readonly router = inject(Router)

  constructor(private snackBar: MatSnackBar) {}
  handleApiError(): void {
    this.router.navigate(['/home']);
    this.snackBar.open('Qualcosa é andato storto, riprova più tardi', 'Chiudi')
  }

}
