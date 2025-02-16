import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AfiliadosFuncionDto } from '../../Model/AfiliadosFuncionDto';
import { AfiliadosFuncionService } from '../AfiliadosFuncionService';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AfiliadosFuncionServiceImpl implements AfiliadosFuncionService {
  private apiUrl = environment.apiUrl+'api/v1/afiliadosfuncion'; // URL del servicio en Spring Boot
  constructor(private http: HttpClient) { }
  getAfiliadosFuncion(): Observable<AfiliadosFuncionDto[]> {
  console.log(this.apiUrl);
    return this.http.get<AfiliadosFuncionDto[]>(this.apiUrl);
  }


}