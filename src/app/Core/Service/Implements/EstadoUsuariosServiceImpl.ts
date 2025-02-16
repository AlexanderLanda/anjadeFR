import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstadosUsuariosDto } from '../../Model/EstadosUsuariosDto';
import { EstadoUsuariosService } from '../EstadoUsuariosService';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoUsuariosServiceImpl implements EstadoUsuariosService {
  private apiUrl = environment.apiUrl+'api/v1/estadosusuario'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) { }
  getAllEstadosUsuarios(): Observable<any> {
    return this.http.get<EstadosUsuariosDto[]>(this.apiUrl);
  }
}