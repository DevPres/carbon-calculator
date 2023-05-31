import { Observable } from "rxjs";
import { Estimate } from "./interfaces/estimate.interface";
import { createActionGroup, createReducer, createSelector, on, props } from '@ngrx/store';

export interface AppState {
  estimates: Estimate[];
}



export const initialState: Estimate[] = [];


export const EstimateActions = createActionGroup({
  source: '[Home Page]',
  events: {
    'Adding Estimate': props<{ estimate: Estimate}>(),
    'Removing Estimate': props<{ id: number }>(),
  },
});

export const estimateReducer = createReducer(
  initialState,
  on(EstimateActions.addingEstimate, (state, { estimate }) => ({
    ...state,
    estimates: [...state, estimate],
  })),
);



export const selectApp = (state: AppState) => state;

export const selectEstimates = createSelector(
  selectApp,
  (state: AppState) => {console.log(state); return state.estimates}
);

