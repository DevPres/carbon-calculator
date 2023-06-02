import { Input, Pipe, PipeTransform } from "@angular/core";
import { VehicleModel } from "src/app/interfaces/app.interface";

@Pipe({
    name: 'filterByMakeId',
    standalone: true,
})
export class FilterByMakeId implements PipeTransform {


    transform(value: {[key:string]: VehicleModel[]}, makeId: string): VehicleModel[] {
        if(!makeId) return [];
        return value[makeId] || [];
    }
}
