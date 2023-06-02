export interface TotalEstimate {
  id: number;
  name: string;
  description?: string;
  emissions?: number;
};

export interface VehicleEstimate {
  estimateType: 'byVehicles';
  vehicles: {
    distance_value: number;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: number;
    vehicle_model_id: string;
    distance_unit: string;
    estimate: number;
  }[];
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
