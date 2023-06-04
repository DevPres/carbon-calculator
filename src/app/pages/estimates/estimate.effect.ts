import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, map, of, retry, switchMap, tap, withLatestFrom } from 'rxjs';
import { EstimateActions } from './estimate.store';
import { EstimatesApiService } from './estimates.service';
import { VehicleMake, VehicleModel } from 'src/app/interfaces/app.interface';
import { AppActions  } from 'src/app/app.store';
import { ROUTER_REQUEST } from '@ngrx/router-store';


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
          catchError(() => EMPTY)
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
      ofType(EstimateActions.loadingModelsByMake),
      switchMap(({ makeId }) =>
        apiService.getVehicleModelsByMake(makeId).pipe(
          map((res) =>
            res.reduce((acc,curr) => {
              return [
                ...acc,
                {
                  id: curr.data.id,
                  name: curr.data.attributes.name,
                  year: curr.data.attributes.year
                } as VehicleModel
              ]
            },[] as VehicleModel[])
          ),
          map((vehicleModels: VehicleModel[]) => EstimateActions.loadedModelsByMake({ makeId, models: vehicleModels })),
          retry(3),
          //HANDLE ERROR
          catchError(() => EMPTY)
        )
      )
    );
  },
  { functional: true }
);


