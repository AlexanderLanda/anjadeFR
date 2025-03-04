import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { createSwapy } from 'swapy';
import { UsuariosTablaComponent } from "../usuarios-tabla/usuarios-tabla.component";
import { ReportListComponent } from "../report-list/report-list.component";
import { CrearNoticiasComponent } from "../noticias-crear/crear-noticias.component";

@Component({
  selector: 'app-admin-main',
  imports: [],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css'
})
export class AdminMainComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      const container = document.querySelector('.container');
      if (container) {  
        createSwapy(container as HTMLElement, {
          animation: 'spring'
        });
      } else {
        console.error("No se encontró el elemento con la clase '.container'");
      }

      // Asignar imágenes de fondo a cada recuadro
      document.querySelectorAll('.swapy-item').forEach(item => {
        const bgImage = (item as HTMLElement).dataset['bg'];
        if (bgImage) {
          (item as HTMLElement).style.backgroundImage = `url('imagen/capturas/${bgImage}')`;
        }

        // Agregar evento de clic para navegar
        item.addEventListener('click', () => {
          const componentName = (item as HTMLElement).dataset['component'];
          if (componentName) {
            this.navigateToComponent(componentName);
          }
        });
      });
    });
  }

  navigateToComponent(componentName: string): void {
    const rutas: { [key: string]: string } = {
      'listausuarios': '/listausuarios',
      'report': '/report',
      'crear-noticia': '/crear-noticia',
      'junta': '/junta',
      'otro-componente': '/otro-componente'
    };

    if (rutas[componentName]) {
      this.router.navigate([rutas[componentName]]);
    } else {
      console.warn(`Componente desconocido: ${componentName}`);
    }
  }
}
