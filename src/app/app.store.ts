import { Observable } from "rxjs";
import { TotalEstimate, VehiclesEstimate } from "./interfaces/app.interface";
import { createActionGroup, createReducer, createSelector, emptyProps, on, props } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';
import { EstimateActions } from "@pages/estimates/estimate.store";

export interface AppState {
  estimates: TotalEstimate[];
}



export const initialState: TotalEstimate[] = [];


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
  on(AppActions.addingEstimate, (state, { id, name, description, emissions, vehiclesEstimate, billingsEstimate } ) =>
    [
      ...state,
      {
        id,
        name,
        description,
        emissions,
        vehiclesEstimate,
        billingsEstimate
      }
    ],
  ),
  on(EstimateActions.savingEstimate, (state, {id, name, description, emissions, vehiclesEstimate, billingsEstimate}) => {
    const oldEstimate = state.find(estimate => estimate.id === id);
    const newEstimate = { id, name, description, emissions, vehiclesEstimate, billingsEstimate } as TotalEstimate;
    if (oldEstimate) {
      return state.map(estimate => estimate.id === id ? newEstimate : estimate);
    }
    return [
      ...state,
      newEstimate,
    ];
  }),

);



export const selectApp = (state: AppState) => state;

export const selectEstimates = createSelector(
  selectApp,
  (state: AppState) => state.estimates
);



