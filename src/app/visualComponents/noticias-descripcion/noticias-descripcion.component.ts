import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ReportDto } from '../../Core/Model/ReportDto';


@Component({
  selector: 'app-noticias-descripcion',
  imports: [QuillModule,CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './noticias-descripcion.component.html',
  styleUrl: './noticias-descripcion.component.css'
})
export class NoticiasDescripcionComponent implements OnChanges{

    @Output() reportUpdated = new EventEmitter<string>();
  

  descripcionTemporal: string = ''; // Variable para la descripción en el modal
  quillConfig = {
    theme: 'snow', // Asegura que el tema de Quill sea el correcto
      toolbar: [
        ['bold', 'italic', 'underline'], // Negrita, cursiva y subrayado
        [{ list: 'ordered' }, { list: 'bullet' }], // Listas ordenadas y desordenadas
        ['link'], // Agregar enlaces
        ['clean'] // Botón para limpiar formato
      ]
    };

    ngOnInit() {
     // this.initForm();
       // Añadimos la clase 'modal-open' al body cuando la modal se muestra
       document.body.classList.add('modal-open');
    }

    ngOnChanges(changes: SimpleChanges): void {
      throw new Error('Method not implemented.');
    }

    guardarDescripcion() {
      this.reportUpdated.emit(this.descripcionTemporal);

      // Guardar el contenido del modal en el formulario
     // this.noticiaForm.patchValue({ descripcion: this.descripcionTemporal });
      //this.modalInstance.hide();
    }
   
}
