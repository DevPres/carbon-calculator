import { Observable } from "rxjs";
import { Estimate } from "./interfaces/app.interface";
import { createActionGroup, createReducer, createSelector, on, props } from '@ngrx/store';

export interface AppState {
  estimates: Estimate[];
}



export const initialState: Estimate[] = [];


export const AppActions = createActionGroup({
  source: '[Home Page]',
  events: {
    'Adding Estimate': props<{ estimate: Estimate}>(),
    'Removing Estimate': props<{ id: number }>(),
  },
});

export const appReducer = createReducer(
  initialState,
  on(AppActions.addingEstimate, (state, { estimate }) =>
    [...state, estimate],
  ),
);



export const selectApp = (state: AppState) => state;

export const selectEstimates = createSelector(
  selectApp,
  (state: AppState) => state.estimates
);

