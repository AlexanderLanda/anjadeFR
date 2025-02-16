import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class OriginInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Obtener la URL de origen de la solicitud
    const origin = request.urlWithParams;
    console.log('La solicitud se originó desde:', origin);

    // Continuar con la solicitud
    return next.handle(request);
  }
}
