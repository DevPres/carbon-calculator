import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppActions } from './app.store';
import { tap } from 'rxjs';

export const addEstimate = createEffect(
  (
    actions$ = inject(Actions),
  ) => {
    return actions$.pipe(
      ofType(AppActions.addingEstimate),
    );
  },
  { functional: true, dispatch: false }
);


