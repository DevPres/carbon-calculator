import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppActions } from './app.store';
import { map, tap, withLatestFrom } from 'rxjs';
import { CalculatorEnum, TotalEstimate, VehicleEstimate } from './interfaces/app.interface';
import { generateUUID } from './utils/function';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { EstimateActions } from '@pages/estimates/estimate.store';

export const createEmptyEstimate = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router)
   ) => {
    return actions$.pipe(
      ofType(AppActions.creatingEmptyEstimate),
      map(() => {
        return AppActions.addEstimate({
          id: generateUUID(),
          name: 'Nuova stima',
          emissions: 0,
          vehiclesEstimate: {
            type: CalculatorEnum.vehicles,
            vehicles: [] as VehicleEstimate[]

          }
        } as TotalEstimate)
      }),
      tap(({ id }) => {
        router.navigate(['/estimates', id])
      })
    );
  },
  { functional: true}
);




