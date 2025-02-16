import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comentario } from '../../Core/Model/ComentarioDto';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { AuthService } from '../../Core/Service/Implements/AuthService';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
  comentariosConNombres: Comentario[] = [];
  comentarioTexto: string = '';
  idAfiliacion: string = ''; // Para el idAfiliacion si no está logueado
  isUserLoggedIn: boolean = false; // Determina si el usuario está logueado
  crearComentario: boolean = false;
  isSendingComment: boolean = false;

  private dialog = inject(MatDialog); // Inyecta MatDialog usando la función inject
  private noticiaService = inject(NoticiaServiceImpl); // Inyecta NoticiaServiceImpl usando la función inject
  private authService = inject(AuthService); // Inyecta AuthService usando la función inject
  private usuariosService = inject(UsuariosServiceImpl); // Inyecta UsuariosServiceImpl usando la función inject

  constructor(
    public dialogRef: MatDialogRef<ComentariosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comentarios: Comentario[], noticiaId: number }
  ) {}

  ngOnInit() {

    this.isUserLoggedIn = this.authService.isUserLoggedIn();

    // Si está logueado, obtenemos el idAfiliacion del usuario
    if (this.isUserLoggedIn) {
      this.idAfiliacion = this.authService.getIdAfiliacion(); // Obtener idAfiliacion desde el servicio
      console.log(this.idAfiliacion)
    }
    // Crea los observables para cada comentario
    const observables = this.data.comentarios
  .filter(comentario => comentario.idAfiliacion !== undefined)
  .map(comentario =>
    this.usuariosService.getNameUserById(comentario.idAfiliacion!).pipe(
      map(nombre => ({ ...comentario, nombre }))
    )
  );


    // Espera a que todos los observables se resuelvan
    forkJoin(observables).subscribe(comentariosConNombres => {
      this.comentariosConNombres = comentariosConNombres; // Asigna los comentarios con nombres
      console.log("comentarios con nombres"+this.comentariosConNombres); // Verifica los resultados
    });
    console.log(this.data.comentarios)
  }

  // Cerrar la modal
  onClose(): void {
    this.dialogRef.close();
  }


  toggleComentarioForm() {
    //noticia.mostrarFormulario = !noticia.mostrarFormulario;
  
  this.crearComentario = true;

  }

  agregarComentario(idNoticia: number) {
    // Validar que el comentario no está vacío y el idAfiliacion esté presente si el usuario no está logueado
    if (!this.comentarioTexto || (this.comentarioTexto.trim() === '')) {
      alert("El comentario es obligatorio.");
      return;
    }

    if (!this.isUserLoggedIn && (!this.idAfiliacion || this.idAfiliacion.trim() === '')) {
      alert("El idAfiliacion es obligatorio.");
      return;
    }

    // Establece el estado del spinner
    this.isSendingComment = true;
    const comentario: Comentario = {
      texto: this.comentarioTexto,
      idAfiliacion: this.isUserLoggedIn ? this.idAfiliacion : this.idAfiliacion
    };
    this.crearComentario = false;
    console.log("NOTICIA ID: "+idNoticia)
    // Llamar al servicio para agregar el comentario
    this.noticiaService.agregarComentario(idNoticia, comentario).subscribe({ // Se usa la sintaxis de objeto para manejar la respuesta del observable
      next: (response) => { // Maneja la respuesta exitosa
        this.isSendingComment = false;
        console.log('Comentario agregado:', response);
        this.data.comentarios.push(response);
        this.comentarioTexto = '';
        this.idAfiliacion = '';
        this.dialogRef.close();

        this.dialog.open(ComentariosModalComponent, {
          data: {
            comentarios: this.data.comentarios,
            noticiaId: this.data.noticiaId,
          }
        });
      },
      error: (error) => { // Maneja el error
        console.error('Error al agregar comentario', error);
        this.isSendingComment = false;
      }
    });
  }
}
