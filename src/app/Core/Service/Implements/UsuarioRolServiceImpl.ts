import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuariosRolDto } from '../../Model/UsuariosRolDto';
import { UsuarioRolService } from '../UsuarioRolService';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolServiceImpl implements UsuarioRolService {
  private apiUrl = environment.apiUrl+'api/v1/usuariosrol'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) { }
  getUsuariosRoles(): Observable<UsuariosRolDto[]> {
    return this.http.get<UsuariosRolDto[]>(this.apiUrl);
  }


}