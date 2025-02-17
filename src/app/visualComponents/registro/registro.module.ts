import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroComponent } from './registro.component';

@NgModule({
  imports: [CommonModule], // Agrega otros módulos necesarios
  exports: [RegistroComponent] // Exporta el componente si es necesario
})
export class RegistroModule {}
