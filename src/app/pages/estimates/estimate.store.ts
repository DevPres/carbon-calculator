import { Observable } from "rxjs";
import { createActionGroup, createFeature, createReducer, createSelector, emptyProps, on, props } from '@ngrx/store';
import { VehicleMake, VehicleModel } from "src/app/interfaces/app.interface";

export interface EstimateState {
  formConfig: {
    vehicleMakes: VehicleMake[];
    vehicleModels: {
      [key: string]: VehicleModel[];
    }
  }
}


export const initialState: EstimateState = {
  formConfig: {
    vehicleMakes: [],
    vehicleModels: {}
  }
};


export const EstimateActions = createActionGroup({
  source: '[Estimate Page]',
  events: {
    'Loading Vehicle Makes': emptyProps(),
    'Loaded Vehicle Makes': props<{ makes: VehicleMake[] }>(),
    'Loading Models By Make': props<{ makeId: string }>(),
    'Loaded Models By Make': props<{ makeId: string, models: VehicleModel[] }>(),
  },
});



export const estimateReducer = createReducer(
  initialState,
  on(EstimateActions.loadedVehicleMakes, (state, { makes }) => ({
    ...state,
    formConfig: {
      ...state.formConfig,
      vehicleMakes: makes
    }
  })),
  on(EstimateActions.loadedModelsByMake, (state, { makeId, models }) => ({
    ...state,
    formConfig: {
      ...state.formConfig,
      vehicleModels: {
        ...state.formConfig.vehicleModels,
        [makeId]: models
      }
    }
  })),
);

  export const estimateFeature = createFeature({
    name: 'estimate',
    reducer: estimateReducer,
    extraSelectors: ({ selectFormConfig }) => ({
      selectVehicleMakes: createSelector(selectFormConfig, (formConfig) => formConfig.vehicleMakes),
      selectVehicleModels: createSelector(selectFormConfig, (formConfig) => formConfig.vehicleModels),
    })
  })






