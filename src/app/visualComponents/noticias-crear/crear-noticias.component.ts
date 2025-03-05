import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { QuillModule } from 'ngx-quill';
import { NoticiasDescripcionComponent } from "../noticias-descripcion/noticias-descripcion.component";
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';



@Component({
  selector: 'app-crear-noticias',
  templateUrl: './crear-noticias.component.html',
  styleUrls: ['./crear-noticias.component.css'], standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NoticiasDescripcionComponent,MatDialogModule]
})
export class CrearNoticiasComponent implements OnInit {

  @Input() noticiaAEditar: any; // Recibe la noticia para editar
  @Output() formularioCerrado = new EventEmitter<void>(); // Evento para notificar al padre
  esEdicion: boolean = false; // Saber si está en modo edición


  noticiaForm: FormGroup;
  archivos: File[] = []; // Almacena los archivos seleccionados
  cargando = false; // Indicador de carga
  mensajeExito = ''; // Mensaje de éxito
  isChecked: boolean = false;
  isEditing = false;
  updateDescripcion = '';


  private modalInstance: any;


  constructor(
    private formBuilder: FormBuilder,
    private noticiaService: NoticiaServiceImpl,
    private router: Router,
  ) {
    this.noticiaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      linkOriginal: [''],
      tipo: ['', Validators.required],
      imagenesLinks: [''],
      isPropia: [],
      descripcion: ['']
    });
  }
  ngOnInit(): void {
    if (this.noticiaAEditar) {
      console.log(this.noticiaAEditar.comentarios.length)
      this.esEdicion = true;
      this.noticiaForm.patchValue(this.noticiaAEditar);
      this.noticiaForm.get('imagenesLinks')?.setValue(this.noticiaAEditar.imagenes[0].urlImagen) // Llena el formulario con los datos
      this.isChecked = this.noticiaAEditar.isPropia;
    }

    this.noticiaForm.get('fuentePropia')?.valueChanges.subscribe(value => {
      if (value) {
        this.noticiaForm.get('linkOriginal')?.clearValidators();
        this.noticiaForm.get('descripcion')?.setValidators(Validators.required);
      } else {
        this.noticiaForm.get('linkOriginal')?.setValidators(Validators.required);
        this.noticiaForm.get('descripcion')?.clearValidators();
      }
      this.noticiaForm.get('linkOriginal')?.updateValueAndValidity();
      this.noticiaForm.get('descripcion')?.updateValueAndValidity();
    });
    const modalElement = document.getElementById('descripcionModal');
  }

  onSubmit() {

    Swal.fire({
      title: "Esta seguro que desea crear y publicar esta noticia?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (this.noticiaForm.valid) {
          this.cargando = true;
          this.mensajeExito = '';
          const noticiaData = this.noticiaForm.value;
          noticiaData.isPropia = this.isChecked;
          const imagenesArray = noticiaData.imagenesLinks.split(',').map((link: string) => link.trim());

          if (this.esEdicion) {
            // Si está en modo edición
            this.noticiaService.actualizarNoticia(this.noticiaAEditar.id,{ ...noticiaData, imagenes: imagenesArray }).subscribe(
              response => {
                console.error('Noticia actualizada correctamente', response);

                this.cargando = false;
                Swal.fire("Noticia actualizada correctamente!", "", "success");
                this.router.navigate(['/admin-noticia']); 
                this.formularioCerrado.emit();
              },
              error => {
                console.error('Error al actualizar la noticia', error);
                this.cargando = false;
                Swal.fire("Error al actualizar la noticia", "", "error");
              }
            );
          } else {

            this.noticiaService.crearNoticia({ ...noticiaData, imagenes: imagenesArray }).subscribe(
              response => {
                this.cargando = false;
                this.mensajeExito = 'Noticia insertada correctamente';
                this.noticiaForm.reset();
                Swal.fire("Noticia publicada correctamente!", "", "success");
                this.formularioCerrado.emit();
              },
              error => {
                console.error('Error al crear la noticia', error);
                this.cargando = false;
                Swal.fire({
                  title: 'Error!',
                  text: 'No se puedo crear la noticia. Inténtelo más tarde',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                })
              }
            );
          }
        }
      } else if (result.isDenied) {
        Swal.fire("La noticia no ha sido publicada.", "", "info");
        this.formularioCerrado.emit();
        this.isEditing=false
      }
    });


  }
  onCheckboxChange() {
    if (!this.isChecked) {
      this.isChecked = true;
      console.log('Checkbox marcado');
      // Realiza acciones cuando el checkbox está marcado
    } else {
      this.isChecked = false;
      console.log('Checkbox desmarcado');
      // Realiza acciones cuando el checkbox está desmarcado
    }
  }

  handleReportUpdated(updatedReport: any | null) {
    if (updatedReport) {
      this.updateDescripcion = updatedReport;
      this.noticiaForm.get('descripcion')?.setValue(this.updateDescripcion);
    }
    this.isEditing = false;
  }
  editarComentarios(noticia: any) {
    console.log('Editar comentarios de:', noticia);
    // Aquí puedes abrir un modal o mostrar un formulario para editar los comentarios
  }
}