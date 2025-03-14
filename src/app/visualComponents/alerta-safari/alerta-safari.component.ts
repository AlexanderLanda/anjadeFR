import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JD_DATA } from '../../constants/juntaDirectivaData';

@Component({
  selector: 'app-alerta-safari',
  templateUrl: './alerta-safari.component.html',
  styleUrls: ['./alerta-safari.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export  class AlertaSafariComponent {

  miembros = JD_DATA.miembros;

constructor(private router: Router,){}



isHovered = false;

activeIndex = 0;
ngOnInit(): void {
 this.setInitialActiveMember();
}

// Función que se asegura de que Urizar esté primero en la vista
private setInitialActiveMember() {
  const urizarIndex = this.miembros.findIndex(m => m.cargo === 'Presidente');
  if (urizarIndex !== -1) {
    this.activeIndex = urizarIndex; // Establecer el índice a la posición de Urizar
  }
}// Método para avanzar al siguiente miembro
nextMember() {
  this.activeIndex = (this.activeIndex + 1) % this.miembros.length;
}

// Método para retroceder al miembro anterior
previousMember() {
  this.activeIndex = (this.activeIndex - 1 + this.miembros.length) % this.miembros.length;
}

// Método para verificar si el miembro actual es el activo
isActive(index: number): boolean {
  return index === this.activeIndex;
}

  updateCarousel() {
    const wrapper = document.querySelector('.card-wrapper');
    const offset = -this.activeIndex * 640; // Ajustar según el tamaño de las tarjetas
    wrapper?.setAttribute('style', `transform: translateX(${offset}px)`);
  }
  
}
