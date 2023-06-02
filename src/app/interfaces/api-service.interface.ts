export interface ServiceVehicleMake {
  data: {
    attributes: {
      name: string;
      number_of_models: number;
    };
    id: string;
    type: string;
  }
};


export interface ServiceVehicleModel {
  data: {
    attributes: {
      name: string;
      year: number;
      vehicle_make: string;
    };
    id: string;
    type: string;
  }
};

export interface ServiceVehicleEstimate {
  data: {
    id: string;
    type: string;
    attributes: {
      distance_value: number;
      vehicle_make: string;
      vehicle_model: string;
      vehicle_year: number;
      vehicle_model_id: string;
      distance_unit: string;
      estimated_at: string;
      carbon_g: number;
      carbon_lb: number;
      carbon_kg: number;
      carbon_mt: number;
    }
  }
}

export interface ServiceVehicleEstimateRequest {
  type: "vehicle";
  distance_unit: string;
  distance_value: number;
  vehicle_model_id: string;
}
