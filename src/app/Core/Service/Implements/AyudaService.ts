import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ayuda } from '../../Model/AyudaDto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AyudaService {
    private apiUrl = environment.apiUrl + 'api/v1/ayudas'; // Cambia la URL según tu backend

    constructor(private http: HttpClient) {}
  
    getAllAyudas(): Observable<Ayuda[]> {
      return this.http.get<Ayuda[]>(`${this.apiUrl}`);
    }
  
    getAyudaById(id: number): Observable<Ayuda> {
      return this.http.get<Ayuda>(`${this.apiUrl}/${id}`);
    }
  
    getAyudasByModulo(modulo: string): Observable<Ayuda[]> {
      return this.http.get<Ayuda[]>(`${this.apiUrl}/modulo/${modulo}`);
    }
  
    saveAyuda(ayuda: Ayuda): Observable<Ayuda> {
      return this.http.post<Ayuda>(`${this.apiUrl}`, ayuda);
    }
  
    updateAyuda(id: number, ayuda: Ayuda): Observable<Ayuda> {
      return this.http.put<Ayuda>(`${this.apiUrl}/${id}`, ayuda);
    }
  
    deleteAyuda(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
