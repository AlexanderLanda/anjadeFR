import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from '../../../../environments/environment';
import { TipoDocumentoDto } from "../../Model/TipoDocumentoDto";
import { TipoDocumentacionService } from "../TipoDocumentacionService";

@Injectable({
    providedIn: 'root'
  })
  export class UploadFilesServiceImpl {
    private apiUrl = environment.apiUrlfront; // URL del servicio en Spring Boot
    
    
    constructor(private http: HttpClient) { }
    
  // Función para obtener los archivos
  getFiles(ruta : string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/listar.php`+ruta);
  }

  /**
   * Obtener archivos de una carpeta específica
   * @param carpeta Nombre de la carpeta dentro de "ficheros/"
   */
  getFilesFromFolder(carpeta: string): Observable<string[]> {
    const url = `${this.apiUrl}/listar.php?ruta=ficheros/${encodeURIComponent(carpeta)}`;
    return this.http.get<string[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getFilesFromName(carpeta: string, name: string): Observable<string[]> {
    const url = `${this.apiUrl}/listar.php?ruta=ficheros/${encodeURIComponent(carpeta)}&archivo=${encodeURIComponent(carpeta)}`;
    return this.http.get<string[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores en las peticiones HTTP
   */
  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError(error);
  }


  uploadFiles(files: File[], carpeta: string): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file));
    formData.append('ruta', `ficheros/${carpeta}`);
    const url = `${this.apiUrl}/upload.php`;

    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError)
    );
  }
  
  getJsonFile(filePath: string) {
    return this.http.get<any>(filePath);
  }
  
  saveJsonFile(filePath: string, data: any) {
    return this.http.put(filePath, data);
  }
  updateJsonFile(newFiles: any) {
    const url = `${this.apiUrl}/update-json.php`;
    return this.http.post(url, newFiles);
  }
    
  
  }