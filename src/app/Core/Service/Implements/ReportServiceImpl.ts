// report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ReportDto } from '../../Model/ReportDto';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { UsuariosDto } from '../../Model/UsuariosDto';


@Injectable({
  providedIn: 'root'
})
export class ReportServiceImpl {
   private apiUrl = environment.apiUrl+'api/v1/reports';

  constructor(private http: HttpClient) { }

  createReport(report: ReportDto): Observable<ReportDto> {
    const formData: FormData = new FormData();
    report.attachments.forEach(file => console.log("file subidos antes de llamar backend:"+file.name))

    formData.append('json', JSON.stringify(report));
    report.attachments.forEach(file => formData.append('files', file, file.name));
    return this.http.post<ReportDto>(`${this.apiUrl}`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError('Hubo un error en la solicitud. Por favor, inténtelo de nuevo más tarde.');
 
  }

  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getReportById(id: number): Observable<any> {
    console.log("getReportByIDURL:"+this.apiUrl+"/"+id)
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAttachments(reportId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}api/v1/attachments/report/${reportId}`);
  }
}
