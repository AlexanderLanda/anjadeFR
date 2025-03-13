import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Noticia } from '../../Model/NoticiaDto';
import { environment } from '../../../../environments/environment';
import { Comentario } from '../../Model/ComentarioDto';

@Injectable({
  providedIn: 'root'
})
export class NoticiaServiceImpl {
  
  
  private apiUrl = environment.apiUrl + 'api/v1/noticias';

  constructor(private http: HttpClient) { }

  // Método para crear una noticia con imágenes
  crearNoticia(noticiaData: FormData): Observable<Noticia> {
    return this.http.post<Noticia>(this.apiUrl, noticiaData);
  }

  // Método para obtener noticias
  obtenerNoticias(pagina: number, tamanio: number, tipo?: string): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanio', tamanio.toString());

    if (tipo) {
      params = params.set('tipo', tipo);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Método para obtener todas las noticias
  obtenerTodasNoticias(): Observable<Noticia[]> {
    const url = `${this.apiUrl}/all`;
    return this.http.get<Noticia[]>(url);
  }

  obtenerNoticiasByID(noticiaId: number): Observable<Noticia> {
    const url = `${this.apiUrl}/${noticiaId}`;
    return this.http.get<any>(url);
  }

  obtenerComentarios(noticiaId: number): Observable<Comentario[]> {
    const url = `${this.apiUrl}/${noticiaId}/comentarios`;
    return this.http.get<Comentario[]>(url);
  }

  agregarComentario(noticiaId: number, comentario: Comentario): Observable<Comentario> {
    const url = `${this.apiUrl}/${noticiaId}/comentarios`;
    console.log("COmentario a back:  "+comentario)
    return this.http.post<Comentario>(url, comentario);
  }

  eliminarNoticia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'json' });
  }
  actualizarNoticia(id: number, noticia: any) {
    return this.http.put(`${this.apiUrl}/${id}`, noticia);
  }

  actualizarComentarios(noticiaId: number, comentarios: Comentario[]) {
    const url = `${this.apiUrl}/${noticiaId}/comentarios`;
    console.log("COmentario a back:  "+comentarios)
    return this.http.put<Comentario[]>(url, comentarios);
  }

  deleteComentarios(id: number) : Observable<any> {
    const url = `${this.apiUrl}/${id}/comentarios`;
    return this.http.delete<Comentario>(url);
  }
  
}