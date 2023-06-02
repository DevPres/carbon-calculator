import { Observable } from "rxjs";
import { TotalEstimate } from "./interfaces/app.interface";
import { createActionGroup, createReducer, createSelector, on, props } from '@ngrx/store';

export interface AppState {
  estimates: TotalEstimate[];
}



export const initialState: TotalEstimate[] = [];


export const AppActions = createActionGroup({
  source: '[Home Page]',
  events: {
    'Adding Estimate': props<{ estimate: TotalEstimate}>(),
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

