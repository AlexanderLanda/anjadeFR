import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators';
import { CuestionarioService } from "../CuestionarioService";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CuestionarioDto } from "../../Model/CuestionarioDto ";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioServiceImpl implements CuestionarioService {
  private apiUrl = environment.apiUrl + 'api/v1/cuestionario'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) { }
  getCuestionario(): Observable<CuestionarioDto[]> {
    return this.http.get<CuestionarioDto[]>(this.apiUrl);
  }

  saveOrUpdate(datosFormulario: any): Observable<CuestionarioDto> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<CuestionarioDto>(`${this.apiUrl}`, datosFormulario, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return error('Hubo un error en la solicitud. Por favor, inténtelo de nuevo más tarde.');
  }
}
