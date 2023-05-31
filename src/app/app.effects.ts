import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EstimateActions } from './app.store';
import { tap } from 'rxjs';

export const addEstimate = createEffect(
  (
    actions$ = inject(Actions),
  ) => {
    return actions$.pipe(
      ofType(EstimateActions.addingEstimate),
    );
  },
  { functional: true, dispatch: false }
);


