import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comentario } from '../../Core/Model/ComentarioDto';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { AuthService } from '../../Core/Service/Implements/AuthService';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-comentarios-modal',
  templateUrl: './comentarios-modal.component.html',
  styleUrls: ['./comentarios-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule
  ]
})
export class ComentariosModalComponent implements OnInit {

  @Input() comentariosAEditar: any; // Recibe la noticia para editar
  @Output() comentariosEditados = new EventEmitter<Comentario[]>(); // Evento para notificar al padre
  esEdicion: boolean = false; // Saber si está en modo edición

  data?: { comentarios: Comentario[], noticiaId: number, esEdicion: boolean };
  comentariosConNombres: Comentario[] = [];
  comentarioTexto: string = '';
  idAfiliacion: string = ''; // Para el idAfiliacion si no está logueado
  isUserLoggedIn: boolean = false; // Determina si el usuario está logueado
  crearComentario: boolean = false;
  isSendingComment: boolean = false;
  comentarios: Comentario[] = [];
  noticiaId: number = 0;



  private dialog = inject(MatDialog); // Inyecta MatDialog usando la función inject
  private noticiaService = inject(NoticiaServiceImpl); // Inyecta NoticiaServiceImpl usando la función inject
  private authService = inject(AuthService); // Inyecta AuthService usando la función inject
  private usuariosService = inject(UsuariosServiceImpl); // Inyecta UsuariosServiceImpl usando la función inject
  private modalService = inject(NgbModal);


  constructor(public activeModal: NgbActiveModal
    //public dialogRef: MatDialogRef<ComentariosModalComponent>,
    /*
    @Inject(MAT_DIALOG_DATA) public data: { comentarios: Comentario[], noticiaId: number }
 */ ) { }

  ngOnInit() {
    this.isSendingComment = true;
    this.isUserLoggedIn = this.authService.isUserLoggedIn();
    // Si está logueado, obtenemos el idAfiliacion del usuario
    if (this.isUserLoggedIn) {
      this.idAfiliacion = this.authService.getIdAfiliacion(); // Obtener idAfiliacion desde el servicio
    }
    if (this.data && this.data.noticiaId) {
      this.noticiaId = this.data.noticiaId;
    }
    if (this.data && this.data.esEdicion) {
      this.esEdicion = this.data.esEdicion;
    }
    if (this.data && this.data.comentarios) {
      this.comentarios = this.data?.comentarios || [];

      const observables: Record<string, Observable<any>> = {};

      this.data?.comentarios
        .filter(comentario => comentario.idAfiliacion !== undefined)
        .forEach((comentario, index) => {
          observables[`comentario-${index}`] = this.usuariosService
            .getNameUserById(comentario.idAfiliacion!)
            .pipe(
              map(nombre => ({ ...comentario, nombre }))
            );
        });

      // Aseguramos que 'observables' nunca sea undefined
      if (Object.keys(observables).length > 0) {
        forkJoin(observables).subscribe(comentariosConNombres => {
          this.comentariosConNombres = Object.values(comentariosConNombres);
          console.log("Comentarios con nombres:", this.comentariosConNombres);
        });
      } else {
        console.log("No se encontraron comentarios con idAfiliacion.");
        this.comentariosConNombres = [];
      }
    }
    this.isSendingComment = false;

  }

  // Cerrar la modal
  onClose(): void {
    this.activeModal.dismiss();
  }


  toggleComentarioForm() {
    //noticia.mostrarFormulario = !noticia.mostrarFormulario;

    this.crearComentario = true;

  }

  agregarComentario(idNoticia: number) {
    // Validar que el comentario no está vacío y el idAfiliacion esté presente si el usuario no está logueado
    if (!this.comentarioTexto || (this.comentarioTexto.trim() === '')) {
      Swal.fire({
        title: 'Error!',
        text: 'El comentario es obligatorio.',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if (!this.isUserLoggedIn && (!this.idAfiliacion || this.idAfiliacion.trim() === '')) {
      Swal.fire({
        title: 'Error!',
        text: 'El "Número de Afiliación" es obligatorio.',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    // Establece el estado del spinner
    this.isSendingComment = true;
    const comentario: Comentario = {
      texto: this.comentarioTexto,
      idAfiliacion: this.isUserLoggedIn ? this.idAfiliacion : this.idAfiliacion
    };
    this.crearComentario = false;
    console.log("NOTICIA ID: " + idNoticia)
    // Llamar al servicio para agregar el comentario
    this.noticiaService.agregarComentario(idNoticia, comentario).subscribe({ // Se usa la sintaxis de objeto para manejar la respuesta del observable
      next: (response) => { // Maneja la respuesta exitosa
        this.isSendingComment = false;
        console.log('Comentario agregado:', response);
        this.data?.comentarios.push(response);
        this.comentarioTexto = '';
        this.idAfiliacion = '';
        this.activeModal.close();

        this.dialog.open(ComentariosModalComponent, {
          data: {
            comentarios: this.data?.comentarios,
            noticiaId: this.data?.noticiaId,
          }
        });
      },
      error: (error) => { // Maneja el error
        console.error('Error al agregar comentario', error);
        this.isSendingComment = false;
      }
    });
  }

  // Método para actualizar los comentarios y cerrar la modal
  actualizarComentarios() {
    this.isSendingComment = true;
    this.noticiaService.actualizarComentarios(this.noticiaId, this.comentarios).subscribe({
      next: (response) => {
        console.log('Comentarios actualizados:', response);
        this.isSendingComment = false;
        // Emitir el evento para notificar que los comentarios han sido actualizados
        this.comentariosEditados.emit();
        this.activeModal.close();
      },
      error: (error) => {
        console.error('Error al actualizar comentarios', error);
        this.isSendingComment = false;
      }
    });
  }
  trackComentario(index: number, comentario: Comentario): number {
    return comentario['idComentario']; // Usamos corchetes para acceder a la propiedad 'idComentario'
  }

  close(): void {
    this.activeModal.dismiss();
  }

  eliminarComentario(id: number) {
    if(id){
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.noticiaService.deleteComentarios(id).subscribe({
            next: (response) => {
              Swal.fire('Eliminado', response.mensaje, 'success');
              this.noticiaService.obtenerComentarios(this.noticiaId).subscribe((comentarios) => {
                if (comentarios.length > 0) {
                this.comentarios = comentarios;
                }  
                });
            },
            error: (error) => {
              Swal.fire('Error', 'No se pudo eliminar el reporte', 'error');
            }
          });
        }
      });
    }
    
  }
}
