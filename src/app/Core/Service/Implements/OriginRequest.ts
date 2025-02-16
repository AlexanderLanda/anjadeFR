import { HttpClient } from "@angular/common/http";
import { environment } from '../../../../environments/environment';
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class OriginRequest  {
    private apiUrl = environment.apiUrl+'api/v1/apiendpoint'; // URL del servicio en Spring Boot
    constructor(private http: HttpClient) { }
    getorigin(): Observable<any[]> {
    console.log(this.apiUrl);
      return this.http.get<any>(this.apiUrl);
    }
}
  