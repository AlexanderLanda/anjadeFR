import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProvinciaDto } from '../../Model/ProvinciaDto';
import { ProvinciasService } from '../ProvinciasService';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasServiceImpl implements ProvinciasService {
  private apiUrl = environment.apiUrl+'api/v1/provincia'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) { }
  getProvincias(): Observable<ProvinciaDto[]> {
    return this.http.get<ProvinciaDto[]>(this.apiUrl);
  }


}