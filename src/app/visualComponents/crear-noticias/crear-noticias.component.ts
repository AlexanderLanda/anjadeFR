import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-noticias',
  templateUrl: './crear-noticias.component.html',
  styleUrls: ['./crear-noticias.component.css'],standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CrearNoticiasComponent implements OnInit {
  noticiaForm: FormGroup;
  archivos: File[] = []; // Almacena los archivos seleccionados
  cargando = false; // Indicador de carga
  mensajeExito = ''; // Mensaje de éxito

  constructor(
    private formBuilder: FormBuilder,
    private noticiaService: NoticiaServiceImpl
  ) {
    this.noticiaForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      linkOriginal: ['', Validators.required],
      tipo: ['', Validators.required],
      imagenesLinks: ['']
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.noticiaForm.valid) {
      this.cargando = true;
      this.mensajeExito = '';
      const noticiaData = this.noticiaForm.value;
      const imagenesArray = noticiaData.imagenesLinks.split(',').map((link: string) => link.trim());

      this.noticiaService.crearNoticia({ ...noticiaData, imagenes: imagenesArray }).subscribe(
        response => {
          this.cargando = false;
          this.mensajeExito = 'Noticia insertada correctamente';
          this.noticiaForm.reset();
          console.log('Noticia creada', response);
        },
        error => {
          console.error('Error al crear la noticia', error);
          this.cargando = false;
        }
      );
    }
  }
}