import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { CommonModule,Location } from '@angular/common';

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
        return `imagen/noticias/${imagen.name}`;
      }
    }
    return 'imagen/noticias/anjade_icon.jpg';
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

}
