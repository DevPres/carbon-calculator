import { Estimate } from "./interfaces/estimate.interface";
import { createActionGroup, createReducer, createSelector, on, props } from '@ngrx/store';

export interface AppState {
  estimates: Estimate[];
}



export const initialState: AppState = {
  estimates: [],
};



export const appReducer = createReducer(
  initialState,
);



export const selectApp = (state: AppState) => state;

export const selectEstimates = createSelector(
  selectApp,
  (state: AppState) => state.estimates
);

export const EstimateActions = createActionGroup({
  source: '[Home Page]',
  events: {
    'Adding Estimate': props<{ estimate: Estimate}>(),
    'Removing Estimate': props<{ id: number }>(),
  },
});
