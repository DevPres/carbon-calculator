import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { environment } from "environment";


export function TokenInterceptor(req: HttpRequest<unknown>,
next: HttpHandlerFn){
    const clonedRequest = req.clone({ setHeaders: {
      Authorization: `Bearer ${environment.CARBON_API_KEY}`
    }});
    return next(clonedRequest)

}
