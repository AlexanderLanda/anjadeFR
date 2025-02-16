import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AfiliadosCategoriasService } from '../AfiliadosCategoriasService';
import { AfiliadosCategoriasDto } from '../../Model/AfiliadosCategoriasDto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AfiliadosCategoriasServiceImpl implements AfiliadosCategoriasService {
  private apiUrl = environment.apiUrl+'api/v1/afiliadoscategoria'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) { }
  getAfiliadosCategorias(): Observable<AfiliadosCategoriasDto[]> {
    return this.http.get<AfiliadosCategoriasDto[]>(this.apiUrl);
  }


}