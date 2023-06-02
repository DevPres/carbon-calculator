import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ServiceVehicleEstimate, ServiceVehicleEstimateRequest, ServiceVehicleMake, ServiceVehicleModel } from 'src/app/interfaces/api-service.interface';
import { VehicleMake, VehicleModel } from 'src/app/interfaces/app.interface';

@Injectable()
export class EstimatesApiService {

  private baseUrl = "https://www.carboninterface.com/api/v1";

  http = inject(HttpClient);

  getVehicleMakes(): Observable<ServiceVehicleMake[]> {
    return this.http.get<ServiceVehicleMake[]>(`${this.baseUrl}/vehicle_makes`).pipe(
      shareReplay()
    );
  }

  getVehicleModelsByMake(makeId: string): Observable<ServiceVehicleModel[]>  {
    return this.http.get<ServiceVehicleModel[]>(`${this.baseUrl}/vehicle_makes/${makeId}/vehicle_models`)
  }

  calculateVehicleEmissions(vehicle: ServiceVehicleEstimateRequest): Observable<ServiceVehicleEstimate> {
    return this.http.post<ServiceVehicleEstimate>(`${this.baseUrl}/estimates`, {
      type: "vehicle",
      distance_unit: vehicle.distance_unit,
      distance_value: vehicle.distance_value,
      vehicle_model_id: vehicle.vehicle_model_id
    })
  }

}
