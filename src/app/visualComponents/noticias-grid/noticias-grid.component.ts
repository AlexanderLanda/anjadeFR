import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { AuthService } from '../../Core/Service/Implements/AuthService';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noticias-grid',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './noticias-grid.component.html',
  styleUrls: ['./noticias-grid.component.css'],
})
export class NoticiasGridComponent implements OnInit {
  private noticiaService = inject(NoticiaServiceImpl);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  noticias: Noticia[] = [];
  paginaActual = 0;
  noticiasPorPagina = 9;
  totalPaginas = 0;
  noticiasPaginadas: Noticia[] = [];
  tipoNoticia = '';
  paginas: number[] = [];

  

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.tipoNoticia = data['tipoNoticia'] || '';
      this.cargarNoticias();
    });
    this.ordenarNoticiasPorFecha();
    this.calcularPaginacion();
  }

  cargarNoticias() {
    this.noticiaService
      .obtenerNoticias(this.paginaActual, this.noticiasPorPagina, this.tipoNoticia)
      .subscribe(
        (response: any) => {
          this.noticias = response.content;
          console.log(this.noticias);
          this.noticiasPaginadas = this.noticias.slice(0, 8);
        },
        (error) => {
          console.error('Error al cargar noticias', error);
        }
      );
  }

  ordenarNoticiasPorFecha(): void {
    this.noticias.sort(
      (a, b) =>{
        const fechaA = a.fechaInsercion ? new Date(a.fechaInsercion).getTime() : 0;
    const fechaB = b.fechaInsercion ? new Date(b.fechaInsercion).getTime() : 0;
    
    return fechaB - fechaA;
  });
  }

  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.noticias.length / this.noticiasPorPagina);
    this.cambiarPagina(0);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPaginas) return;

    this.paginaActual = pagina;
    const inicio = pagina * this.noticiasPorPagina;
    const fin = inicio + this.noticiasPorPagina;
    this.noticiasPaginadas = this.noticias.slice(inicio, fin);
  }

  getImageUrl(noticia: any): string {
    if (noticia.imagenes && noticia.imagenes.length > 0) {
      const imagen = noticia.imagenes[0];
      if (imagen.urlImagen) {
        return imagen.urlImagen;
      } else if (imagen.name) {
        return `imagen/noticias/${imagen.name}`;
      }
    }
    return 'imagen/noticias/default.jpg';
  }

  handleImageError(noticia: any) {
    if (noticia.imagenes && noticia.imagenes.length > 0) {
      const imagen = noticia.imagenes[0];
      if (imagen.urlImagen) {
        console.log(
          `La imagen ${imagen.urlImagen} no se pudo cargar. Intentando con la imagen local.`
        );
        imagen.urlImagen = null;
      }
    }
  }
  trackQuestion(index: number, question: any) {
    return question.id; // Retorna un identificador único para cada pregunta
  }

  viewDetails(event: Event, id: number) {
    event.preventDefault();
    console.log(id)
    this.router.navigate(['/noticias-reader', id]);
  }
}
