import { HttpClient } from "@angular/common/http";
import { FederacionDto } from "../../Model/FederacionDto";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class FederacionServiceImpl implements FederacionServiceImpl {
    private apiUrl = environment.apiUrl+'api/v1/federacion'; // URL del servicio en Spring Boot
  
    constructor(private http: HttpClient) { }
    getFederaciones(): Observable<FederacionDto[]> {
      return this.http.get<FederacionDto[]>(this.apiUrl);
    }
}