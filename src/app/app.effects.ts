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
      tap((x) => console.log('x',x))
    );
  },
  { functional: true, dispatch: false }
);


