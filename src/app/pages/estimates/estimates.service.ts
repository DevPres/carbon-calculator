import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ServiceBillingEstimate, ServiceVehicleEstimate, ServiceVehicleMake, ServiceVehicleModel } from 'src/app/interfaces/api-service.interface';
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

  calculateVehicleEmissions(vehicle: {distance_unit: string, distance_value: string, vehicle_model_id: string}): Observable<ServiceVehicleEstimate> {
    return this.http.post<ServiceVehicleEstimate>(`${this.baseUrl}/estimates`, {
      type: "vehicle",
      distance_unit: vehicle.distance_unit,
      distance_value: vehicle.distance_value,
      vehicle_model_id: vehicle.vehicle_model_id
    })
  }

  calculateBillEmissions(bill: { country: string,  electricity_value: number }): Observable<ServiceBillingEstimate> {
    return this.http.post<ServiceBillingEstimate>(`${this.baseUrl}/estimates`, {
      type: "electricity",
      country: bill.country,
      electricity_unit: 'mwh',
      electricity_value: bill.electricity_value
    })
  }

}
