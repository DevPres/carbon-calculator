import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppActions } from './app.store';
import { map, tap, withLatestFrom } from 'rxjs';
import { BillingEstimate, BillingsEstimate, CalculatorEnum, TotalEstimate, VehicleEstimate } from './interfaces/app.interface';
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
        return AppActions.addingEstimate({
          id: generateUUID(),
          name: 'Nuova stima',
          emissions: 0,
          vehiclesEstimate: {
            type: CalculatorEnum.vehicles,
            totalEmissions: 0,
            vehicles: [] as VehicleEstimate[]
          },
          billingsEstimate: {
            type: CalculatorEnum.billings,
            totalEmissions: 0,
            billings: [] as BillingEstimate[]
          }
      } as TotalEstimate)
      }),
      tap(({ id }) => {
        router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          router.navigate(['/estimates', id]);
        });
      })
    );
  },
  { functional: true}
);




