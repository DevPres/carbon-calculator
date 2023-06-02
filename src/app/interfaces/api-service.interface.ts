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

