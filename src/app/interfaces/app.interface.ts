export interface TotalEstimate {
  id: number;
  name: string;
  description?: string;
  emissions?: number;
};

export interface EstimateBase {
  type: CalculatorType;
  totalEstimate: number;
}

export interface VehiclesEstimate extends EstimateBase {
  type: CalculatorEnum.vehicles;
  vehicles: VehicleEstimate[];
}

export interface VehicleEstimate {
  distance_value: number;
  vehicle_make_id: string;
  vehicle_model_id: string;
  vehicle_year: number;
  distance_unit: string;
  estimate: number;
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
