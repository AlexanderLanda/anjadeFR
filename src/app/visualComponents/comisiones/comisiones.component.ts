import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importamos CommonModule para directivas comunes
import { FormsModule } from '@angular/forms'; // Importamos FormsModule si se usa ngModel

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.css'],
  standalone: true, // Declaramos el componente como standalone
  imports: [CommonModule, FormsModule] 
})
export class ComisionesComponent implements OnInit {

  aux ={"apellidos":"Any","nombre":"Any","documento":"Eeed","fechaNacimiento":"2024-10-03","tipoDocumento":{"id":1,"descripcion":"DNI"},"direccion":"Any","codigoPostal":"12312","localidad":"Any","provincia":{"id":2,"descripcion":"Albacete"},"correo":"any@any.com","telefono":"123123123","deporte":{"id":44,"nombre":"Futbol"},"afiliadosFuncion":{"id":7,"descripcion":"Delegado(a)"},"afiliadosCategoria":{"id":2,"descripcion":"Profesional"},"tipoPago":{"id":4,"descripcion":"Caja"},"situacionActual":"Ex","usuariorol":{"id":"3","descripcion":"afiliados"}};


  constructor(  ) { }

  ngOnInit(): void {
    this.cargarDeportesComboBox();
  }

  cargarDeportesComboBox() {
  
  }

  botonPrueba(){
  }
}
