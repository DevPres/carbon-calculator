export interface TotalEstimate {
  id: string;
  name: string;
  description?: string;
  emissions: number;
  vehiclesEstimate: VehiclesEstimate;
};

export interface EstimateBase {
  type: CalculatorType;
  totalEmissions: number;
}

export interface VehiclesEstimate extends EstimateBase {
  type: CalculatorEnum.vehicles;
  vehicles: VehicleEstimate[];
}

export interface VehicleEstimate {
  distance_unit: string;
  distance_value: number;
  vehicle_make_id: string;
  vehicle_model_id: string;
  vehicle_year: number;
  emissions: number;
}


export interface VehicleMake {
  id: string;
  name: string;
  numberOfModels: number;
}


export interface VehicleModel {
  id: string;
  name: string;
  year: number;
}

export enum CalculatorEnum {
  vehicles = 'vehicles',
}

export type CalculatorType = `${CalculatorEnum}`;
