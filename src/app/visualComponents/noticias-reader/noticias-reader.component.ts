import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { CommonModule,Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComentariosModalComponent } from '../comentarios-modal/comentarios-modal.component';

@Component({
  selector: 'app-noticias-reader',
  imports: [CommonModule],
  templateUrl: './noticias-reader.component.html',
  styleUrl: './noticias-reader.component.css'
})
export class NoticiasReaderComponent {

  noticia: Noticia | undefined; // Inicializa como undefined

  private noticiaService = inject(NoticiaServiceImpl);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private modalService = inject(NgbModal);


  constructor() { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Obtiene el ID de la ruta
    if (id) {
      this.noticiaService.obtenerNoticiasByID(Number(id)).subscribe(
        (noticia) => {
          this.noticia = noticia;
          console.log(this.noticia);
          
        },
        (error) => {
          console.error('Error al obtener la noticia:', error);
          // Redirige a una página de error o muestra un mensaje al usuario
        }
      );
    } else {
      // Redirige a una página de error o muestra un mensaje al usuario
    }
  }
  goBack(): void {
    this.location.back();
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
}
