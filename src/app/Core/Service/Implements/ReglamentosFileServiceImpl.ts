// file.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ReglamentoDto } from '../../Model/ReglamentoDto';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReglamentosFileServiceImpl {

  private apiUrl = environment.apiUrl+'api/v1/reglamentos'; // URL del servicio en Spring Boot

  
  constructor(private http: HttpClient) {}

  getFileList(): Observable<any> {
    return this.http.get('ficheros/documentos/reglamentos-fileList.json');
  }

  getReglamentos(): Observable<ReglamentoDto[]> {
    const url = `${this.apiUrl}/all`;
    return this.http.get<any>(url);
  }
  saveReglamento(reglamento: any): Observable<ReglamentoDto[]> {
    return this.http.post<ReglamentoDto[]>(`${this.apiUrl}`, reglamento).pipe(
          catchError(this.handleError)
        );

        
  }

  deleteReglamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private handleError(error: any) {
      console.error('Error en la solicitud:', error);
      return throwError(error);
    }
}
