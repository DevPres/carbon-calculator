import { Observable } from "rxjs";
import { TotalEstimate, VehiclesEstimate } from "./interfaces/app.interface";
import { createActionGroup, createReducer, createSelector, emptyProps, on, props } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';
import { EstimateActions } from "@pages/estimates/estimate.store";

export interface AppState {
  estimates: TotalEstimate[];
  selectedEstimateId: string | null;
}



export const initialState: AppState = {
  estimates : [],
  selectedEstimateId: null,
};


export const AppActions = createActionGroup({
  source: '[Home Page]',
  events: {
    'Adding Estimate': props<TotalEstimate>(),
    'Removing Estimate': props<{ id: number }>(),
    'Creating Empty Estimate': emptyProps(),
  },
});


export const appReducer = createReducer(
  initialState,
  on(AppActions.addingEstimate, (state, { id, name, description, emissionsKg, vehiclesEstimate, billsEstimate } ) =>({
    ...state,
    estimates: [
      ...state.estimates,
      {
        id,
        name,
        description,
        emissionsKg,
        vehiclesEstimate,
        billsEstimate
      },
    ],
  })),
  on(EstimateActions.savingEstimate, (state, { id, name, description, emissionsKg, vehiclesEstimate, billsEstimate}) => {
    const oldEstimate = state.estimates.find(estimate => estimate.id === id);
    const newEstimate = { id, name, description, emissionsKg, vehiclesEstimate, billsEstimate } as TotalEstimate;
    if (oldEstimate) {
      return ({
        ...state,
        estimates: state.estimates.map(estimate => estimate.id === id ? newEstimate : estimate),
      })
    }
    return ({
      ...state,
      estimates: [
        ...state.estimates,
        newEstimate,
      ]
    })

  }),
  on(EstimateActions.deletingEstimate, (state, { id }) => ({
    ...state,
    estimates: state.estimates.filter(estimate => estimate.id !== id),
  })),
  on(EstimateActions.loadSelectedEstimate, (state, { id }) => ({
    ...state,
    selectedEstimateId: id,
  })),

);



export const selectApp = (state: {appState: AppState}) => state.appState;

export const selectEstimates = createSelector(
  selectApp,
  (state: AppState) => state.estimates
);

export const selectSelectedEstimateId = createSelector(
  selectApp,
  (state: AppState) => state.selectedEstimateId
);



