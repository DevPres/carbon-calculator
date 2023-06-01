import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { ServiceVehicleMake } from 'src/app/interfaces/api-service.interface';
import { VehicleMake } from 'src/app/interfaces/app.interface';

@Injectable()
export class EstimatesService {

  private baseUrl = "https://www.carboninterface.com/api/v1";
  http = inject(HttpClient);


  getVehicleMakes() {
    return this.http.get<ServiceVehicleMake[]>(`${this.baseUrl}/vehicle_makes`).pipe(
      map((res) =>
        res.reduce((acc,curr) => {
          return [
            ...acc,
            {
              id: curr.data.id,
              name: curr.data.attributes.name,
              numberOfModels: curr.data.attributes.number_of_models
            } as VehicleMake
          ]
        },[] as VehicleMake[])
      ),
      shareReplay()
    );
  }
  //return res.reduce((acc, cur) => {
  //  return [
  //    ...acc,
  //    {
  //      id: cur.data.id,
  //      name: cur.data.attributes.name,
  //      numberOfModels: cur.data.attributes.number_of_models
  //    }
  //  ]
  //}, []);
}
