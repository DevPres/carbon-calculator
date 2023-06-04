import { Observable } from "rxjs";
import { createActionGroup, createFeature, createReducer, createSelector, emptyProps, on, props } from '@ngrx/store';
import { TotalEstimate, VehicleMake, VehicleModel, VehiclesEstimate } from "src/app/interfaces/app.interface";
import { AppActions } from "src/app/app.store";

export interface EstimateState {
  formConfig: {
    vehicleMakes: VehicleMake[];
    vehicleModels: {
      [key: string]: VehicleModel[];
    }
  },
  selectedEstimate: TotalEstimate | null;
  selectedEstimateUnsaved: boolean;

}


export const initialState: EstimateState = {
  formConfig: {
    vehicleMakes: [],
    vehicleModels: {}
  },
  selectedEstimate: null,
  selectedEstimateUnsaved: false
};


export const EstimateActions = createActionGroup({
  source: '[Estimate Page]',
  events: {
    'Loading Vehicle Makes': emptyProps(),
    'Loaded Vehicle Makes': props<{ makes: VehicleMake[] }>(),
    'Loading Models By Make': props<{ makeId: string }>(),
    'Loaded Models By Make': props<{ makeId: string, models: VehicleModel[] }>(),
    'Load Selected Estimate': props<TotalEstimate>(),
    'Sync Vehicles Estimate': props<{ vehiclesEstimate: VehiclesEstimate }>(),
    'Estimate changed': emptyProps(),
    'Save Estimate': props<TotalEstimate>(),
    'Delete Changes': emptyProps(),
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
  on(EstimateActions.loadSelectedEstimate, (state, { id, name, emissions, vehiclesEstimate  }) => ({
    ...state,
    selectedEstimate: {
      id,
      name,
      emissions,
      vehiclesEstimate
    },
    selectedEstimateUnsaved: false
  })),
  on(EstimateActions.syncVehiclesEstimate, (state, { vehiclesEstimate }) => ({
    ...state,
    selectedEstimate: {
      ...state.selectedEstimate as TotalEstimate,
      vehiclesEstimate: vehiclesEstimate
    },
    selectedEstimateUnsaved: true
  })),
  on(EstimateActions.saveEstimate, (state) => ({
    ...state,
    selectedEstimateUnsaved: false
  }))
);

  export const estimateFeature = createFeature({
    name: 'estimate',
    reducer: estimateReducer,
    extraSelectors: ({ selectFormConfig }) => ({
      selectVehicleMakes: createSelector(selectFormConfig, (formConfig) => formConfig.vehicleMakes),
      selectVehicleModels: createSelector(selectFormConfig, (formConfig) => formConfig.vehicleModels),
    })
  })






