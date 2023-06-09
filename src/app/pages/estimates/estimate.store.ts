import { Observable } from "rxjs";
import { createActionGroup, createFeature, createReducer, createSelector, emptyProps, on, props } from '@ngrx/store';
import { BillsEstimate, TotalEstimate, VehicleMake, VehicleModel, VehiclesEstimate } from "src/app/interfaces/app.interface";
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
    'Sync Bills Estimate': props<{ billsEstimate: BillsEstimate }>(),
    'Updated Total Emissions': emptyProps(),
    'Estimate changed': emptyProps(),
    'Saving Estimate': props<TotalEstimate>(),
    'Resetting Estimate': emptyProps(),
    'Deleting Estimate': props<{ id: string }>(),
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
  on(EstimateActions.loadSelectedEstimate, (state, { id, name, emissionsKg, vehiclesEstimate, billsEstimate  }) => ({
    ...state,
    selectedEstimate: {
      id,
      name,
      emissionsKg,
      vehiclesEstimate,
      billsEstimate
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
  on(EstimateActions.syncBillsEstimate, (state, { billsEstimate }) => ({
    ...state,
    selectedEstimate: {
      ...state.selectedEstimate as TotalEstimate,
      billsEstimate: billsEstimate,
    },
    selectedEstimateUnsaved: true,
  })),
  on(EstimateActions.updatedTotalEmissions, (state) => {
    let emissionsVehicles = state.selectedEstimate?.vehiclesEstimate?.totalEmissions || 0;
    let emissionsBills = state.selectedEstimate?.billsEstimate?.totalEmissions || 0;
    return ({
      ...state,
      selectedEstimate: {
        ...state.selectedEstimate as TotalEstimate,
        emissionsKg: emissionsVehicles + emissionsBills
      }
    })
  }),
  on(EstimateActions.savingEstimate, (state) => ({
    ...state,
    selectedEstimateUnsaved: false
  })),
  on(EstimateActions.resettingEstimate, (state) => ({
    ...state,
    selectedEstimate: {
      ...state.selectedEstimate as TotalEstimate,
      emissionsKg: 0,
    },
    selectedEstimateUnsaved: false,
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






