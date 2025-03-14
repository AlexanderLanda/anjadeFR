import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { AuthService } from '../../Core/Service/Implements/AuthService';
import { ComentariosModalComponent } from '../comentarios-modal/comentarios-modal.component';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { Comentario } from '../../Core/Model/ComentarioDto';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-noticias-anjade',
  templateUrl: './noticias-anjade.component.html',
  styleUrls: ['./noticias-anjade.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule ,
    // Otras importaciones necesarias
  ],
})
export class NoticiasAnjadeComponent {
  private noticiaService = inject(NoticiaServiceImpl);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private modalService = inject(NgbModal);


  noticias: Noticia[] = [];
  noticiasOriginales: Noticia[] = []; // Copia de la lista original

  paginaActual = 0;
  tamanioPagina = 10;
  totalPaginas = 0;
  paginas: number[] = [];
  tipoNoticia = '';

  usuarioLogueado = false;
  nuevoComentario: Comentario = { texto: '', idAfiliacion: '' };
  comentarios: { [key: number]: Comentario[] } = {};
  comentarioTexto = '';
  idAfiliacion = '';
  isUserLoggedIn = false;


  constructor() {
    this.route.data.subscribe((data) => {
      this.tipoNoticia = data['tipoNoticia'] || '';
      this.cargarNoticias();
    });
    this.isUserLoggedIn = this.authService.isUserLoggedIn();

    if (this.isUserLoggedIn) {
      this.idAfiliacion = this.authService.getIdAfiliacion();
      console.log(this.idAfiliacion);
    }
    console.log(this.tipoNoticia);
  }

  cargarNoticias() {
    this.noticiaService
      .obtenerNoticias(this.paginaActual, this.tamanioPagina, this.tipoNoticia)
      .subscribe(
        (response: any) => {
          this.noticias = response.content;
          this.noticiasOriginales = [...response.content]; // ✅ Guardamos la copia original
        },
        (error) => {
          console.error('Error al cargar noticias', error);
        }
      );
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarNoticias();
    }
  }

  getImageUrl(noticia: any): string {
    if (noticia.imagenes && noticia.imagenes.length > 0) {
      const imagen = noticia.imagenes[0];
      if (imagen.urlImagen) {
        return imagen.urlImagen;
      } else if (imagen.name) {
        return `ficheros/noticias/${imagen.name}`;
      }
    }
    return 'ficheros/noticias/anjade_icon.jpg';
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

  mostrarComentarios(noticia: Noticia): void {
    if (!noticia.id) {
      console.error('La noticia no tiene un ID válido.');
      return;
    }
    this.noticiaService.obtenerComentarios(noticia.id).subscribe((comentarios) => {
      if (comentarios.length > 0) {
        const modalRef = this.modalService.open(ComentariosModalComponent, {
          size: 'lg' // Aquí puedes especificar el tamaño u otras opciones de configuración.
        });
        
        // Luego, pasas los datos al modalRef
        modalRef.componentInstance.data = {
          comentarios: comentarios,
          noticiaId: noticia.id
        };
      } else {
        alert('No hay comentarios para esta publicación.');
      }
    });
  }

  toggleComentarioForm(noticia: Noticia) {
    noticia.mostrarFormulario = !noticia.mostrarFormulario;
  }

  agregarComentario(noticia: Noticia) {
    if (!this.comentarioTexto || this.comentarioTexto.trim() === '') {
      alert('El comentario es obligatorio.');
      return;
    }

    if (
      !this.isUserLoggedIn &&
      (!this.idAfiliacion || this.idAfiliacion.trim() === '')
    ) {
      alert('El idAfiliacion es obligatorio.');
      return;
    }

    const comentario: Comentario = {
      texto: this.comentarioTexto,
      idAfiliacion: this.isUserLoggedIn ? this.idAfiliacion : this.idAfiliacion,
    };

    console.log('NOTICIA ID: ' + noticia.id);
    if (!noticia.id) {
      console.error('La noticia no tiene un ID válido.');
      return;
    }
    this.noticiaService.agregarComentario(noticia.id, comentario).subscribe(
      (response) => {
        noticia.mostrarFormulario = !noticia.mostrarFormulario;
        console.log('Comentario agregado:', response);
        this.comentarioTexto = '';
        this.idAfiliacion = '';
        window.location.reload();
      },
      (error) => {
        console.error('Error al agregar comentario', error);
      }
    );
  }

  viewDetails(event: Event, id: number) {
    event.preventDefault();
    console.log(id)
    this.router.navigate(['/noticias-reader', id]);
  }
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value.toLowerCase();
    
    if (filtro.trim() === '') {
      this.noticias = [...this.noticiasOriginales]; // ✅ Restauramos la lista original
      return;
    }
  
    this.noticias = this.noticiasOriginales.filter(noticia =>
      noticia.titulo.toLowerCase().includes(filtro) ||
      noticia.descripcion?.toLowerCase().includes(filtro) ||
      noticia.comentarios?.some(comentario =>
        comentario.texto.toLowerCase().includes(filtro)
      )
    );
  }
  
}
