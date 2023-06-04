import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppActions } from './app.store';
import { map, tap, withLatestFrom } from 'rxjs';
import { BillEstimate,  CalculatorEnum, TotalEstimate, VehicleEstimate } from './interfaces/app.interface';
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
            totalVehicles: 0,
            totalDistanceKm: 0,
            totalEmissions: 0,
            vehicles: []
          },
          billsEstimate: {
            type: CalculatorEnum.bills,
            totalEmissions: 0,
            totalBills: 0,
            totalElectricityMwh: 0,
            bills: []
          }
      })
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




