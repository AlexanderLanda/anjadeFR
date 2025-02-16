// file.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReglamentosFileServiceImpl {
  constructor(private http: HttpClient) {}

  getFileList(): Observable<any> {
    return this.http.get('assets/documentos/reglamentos-fileList.json');
  }
}
