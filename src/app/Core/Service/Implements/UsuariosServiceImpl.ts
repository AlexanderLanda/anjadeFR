import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UsuariosRolDto } from '../../Model/UsuariosRolDto';
import { UsuarioRolService } from '../UsuarioRolService';
import { UsuariosService } from '../UsuariosService';
import { UsuariosDto } from '../../Model/UsuariosDto';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsuariosServiceImpl implements UsuariosService {
  apiUserUrl = environment.apiUrl + 'api/v1/users';// URL del servicio en Spring Boot
  private usuario: any;


  constructor(private http: HttpClient) { }



  getUsuarios(): Observable<UsuariosDto[]> {
    return this.http.get<UsuariosDto[]>(this.apiUserUrl);
  }

  saveOrUpdate(datosFormulario: any): Observable<UsuariosDto> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<UsuariosDto>(`${this.apiUserUrl}`, datosFormulario, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError('Hubo un error en la solicitud. Por favor, inténtelo de nuevo más tarde.');
  }

  setUsuario(usuario: any) {
    this.usuario = usuario;
  }

  getUsuario() {
    return this.usuario;
  }

  validateEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(`${this.apiUserUrl}/validate-email`, { params });
  }

  validateIDAfiliacion(id: string): Observable<boolean> {
    const params = new HttpParams().set('id', id);
    return this.http.get<boolean>(`${this.apiUserUrl}/validate-idAfiliacion`, { params });
  }

  checkNumeroAfiliacionExists(numeroAfiliacion: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUserUrl}/checkNumeroAfiliacion/${numeroAfiliacion}`);
  }

  getUserById(id: number): Observable<UsuariosDto> {
    return this.http.get<UsuariosDto>(`${this.apiUserUrl}/${id}`);
  }
  getNameUserById(id: String): Observable<String> {
    return this.http.get<String>(`${this.apiUserUrl}/getname/${id}`);
  }
  

}