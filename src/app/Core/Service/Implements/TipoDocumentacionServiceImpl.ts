import { Observable } from "rxjs";
import { TipoDocumentoDto } from "../../Model/TipoDocumentoDto";
import { TipoDocumentacionService } from "../TipoDocumentacionService";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';



@Injectable({
    providedIn: 'root'
  })
  export class TipoDocumentacionServiceImpl implements TipoDocumentacionService {
    private apiUrl = environment.apiUrl+'api/v1/tipodocumento'; // URL del servicio en Spring Boot
    
    
    constructor(private http: HttpClient) { }
    getTipoDocumentacion(): Observable<TipoDocumentoDto[]> {
      console.log('apiUrl tipo documento',this.apiUrl);
      return this.http.get<TipoDocumentoDto[]>(this.apiUrl);
    }
  
  
  }