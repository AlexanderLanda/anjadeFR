import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadosUsuariosDto } from '../../Model/EstadosUsuariosDto';
import { EstadoUsuariosService } from '../EstadoUsuariosService';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendEmailServiceImpl {
  private apiUrl = environment.apiUrl+'api/v1'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) { }
  sendErrorEmail(errorInfo: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/send-error-email`, JSON.stringify(errorInfo), { headers });
  }

  sendEmail(data: FormData): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/send-email`, data);
  }
}