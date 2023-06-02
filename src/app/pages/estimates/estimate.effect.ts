import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, retry, switchMap, tap } from 'rxjs';
import { EstimateActions } from './estimate.store';
import { EstimatesApiService } from './estimates.service';
import { VehicleMake } from 'src/app/interfaces/app.interface';

export const loadVehicleMakes = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(EstimatesApiService),
  ) => {
    return actions$.pipe(
      ofType(EstimateActions.loadingVehicleMakes),
      switchMap(() =>
        apiService.getVehicleMakes().pipe(
          map((res) =>
            res.reduce((acc,curr) => {
              return [
                ...acc,
                {
                  id: curr.data.id,
                  name: curr.data.attributes.name,
                  numberOfModels: curr.data.attributes.number_of_models
                } as VehicleMake
              ]
            },[] as VehicleMake[])
          ),
          map((vehicleMakes: VehicleMake[]) => EstimateActions.loadedVehicleMakes({ makes: vehicleMakes })),
          retry(3),
          //HANDLE ERROR
        )
      )
    );
  },
  { functional: true }
);

export const loadVehicleModel = createEffect(
  (
    actions$ = inject(Actions),
    apiService = inject(EstimatesApiService),
  ) => {
    return actions$.pipe(
      ofType(EstimateActions.loadedModelsByMake),
      switchMap(({ makeId }) =>
        apiService.getVehicleModelsByMake(makeId).pipe(
          retry(3),
          //HANDLE ERROR
        )
      )
    );
  },
  { functional: true }
);

