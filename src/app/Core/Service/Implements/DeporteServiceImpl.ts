import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AfiliadosFuncionDto } from '../../Model/AfiliadosFuncionDto';
import { DeporteService } from '../DeporteService';
import { DeportesDto } from '../../Model/DeportesDto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeporteServiceImpl implements DeporteService {
  private apiUrl = environment.apiUrl+'api/v1/deportes'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) { }
  getDeportes(): Observable<DeportesDto[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveOrUpdate(datosFormulario: any): Observable<DeportesDto> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<DeportesDto>(`${this.apiUrl}`, datosFormulario, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError('Hubo un error en la solicitud. Por favor, inténtelo de nuevo más tarde.');
  }
}