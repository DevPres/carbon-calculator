import { Observable } from "rxjs";
import { TotalEstimate, VehiclesEstimate } from "./interfaces/app.interface";
import { createActionGroup, createReducer, createSelector, emptyProps, on, props } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';

export interface AppState {
  estimates: TotalEstimate[];
}



export const initialState: TotalEstimate[] = [];


export const AppActions = createActionGroup({
  source: '[Home Page]',
  events: {
    'Add Estimate': props<TotalEstimate>(),
    'Removing Estimate': props<{ id: number }>(),
    'Creating Empty Estimate': emptyProps(),
    'Save Change On Estimate By Id': props<TotalEstimate>(),
  },
});


export const appReducer = createReducer(
  initialState,
  on(AppActions.addEstimate, (state, { id, name, description, emissions, vehiclesEstimate } ) =>
    [
      ...state,
      {
        id,
        name,
        description,
        emissions,
        vehiclesEstimate
      }
    ],
  ),
  on(AppActions.saveChangeOnEstimateById, (state, {id, name, description, emissions, vehiclesEstimate}) => {
    const oldEstimate = state.find(estimate => estimate.id === id);
    const newEstimate = { id, name, description, emissions, vehiclesEstimate } as TotalEstimate;
    if (oldEstimate) {
      return state.map(estimate => estimate.id === id ? newEstimate : estimate);
    }
    return [
      ...state,
      newEstimate,
    ];
  }));



export const selectApp = (state: AppState) => state;

export const selectEstimates = createSelector(
  selectApp,
  (state: AppState) => state.estimates
);



