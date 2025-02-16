import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserCuestionarioServiceImpl {
    private apiUrl = environment.apiUrl + 'api/v1/user-cuestionario'; // URL del servicio en Spring Boot

  constructor(private http: HttpClient) {}

  getCuestionarioByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  hasCuestionario(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${userId}`);
  }
}