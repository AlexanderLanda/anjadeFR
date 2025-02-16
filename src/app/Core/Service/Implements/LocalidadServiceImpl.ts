import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalidadDto } from '../../Model/LocalidadDto';
import { LocalidadService } from '../LocalidadService';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalidadServiceImpl implements LocalidadService {
  private apiUrl = environment.apiUrl+'api/v1/localidad'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) { }
  getLocalidades(): Observable<LocalidadDto[]> {
    return this.http.get<LocalidadDto[]>(this.apiUrl);
  }


}