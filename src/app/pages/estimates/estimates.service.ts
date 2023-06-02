import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ServiceVehicleMake, ServiceVehicleModel } from 'src/app/interfaces/api-service.interface';
import { VehicleMake, VehicleModel, VehicleModelMap } from 'src/app/interfaces/app.interface';

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
}
