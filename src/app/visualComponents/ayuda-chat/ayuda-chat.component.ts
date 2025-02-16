import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Ayuda } from '../../Core/Model/AyudaDto';
import { AyudaService } from '../../Core/Service/Implements/AyudaService';


@Component({
  selector: 'app-ayuda-chat',
  templateUrl: './ayuda-chat.component.html',
  styleUrls: ['./ayuda-chat.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]

})
export class AyudaChatComponent implements OnInit {
  ayudas: Ayuda[] = [];
  moduloActual: string = '';

  isChatbotOpen = false; // Estado del chatbot
  
  selectedAnswer: string | null = null;
  private ayudaService = inject(AyudaService);
  private router = inject(Router);

  constructor( ) {}

  ngOnInit(): void {
    // Suscribirse a los eventos del router
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.urlAfterRedirects)
        this.actualizarModuloActual(event.urlAfterRedirects);
      }
    });

    // Cargar las ayudas del módulo inicial
    this.actualizarModuloActual(this.router.url);
  }
  // Abrir/cerrar el chatbot
  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen;
    this.selectedAnswer = null; // Resetear la respuesta seleccionada
  }

  // Mostrar la respuesta a una pregunta
  selectQuestion(question: { respuesta: string | null; } ) {
    this.selectedAnswer = question.respuesta;
  }
  actualizarModuloActual(url: string): void {
    // Derivar el módulo a partir de la URL
    const rutaPartes = url.split('/');
    this.moduloActual = rutaPartes[1] || 'home'; // Asume 'home' si no hay segmento de módulo

    // Cargar las ayudas del módulo actual
    this.cargarAyudasPorModulo(this.moduloActual);
  }

  cargarAyudasPorModulo(modulo: string): void {
    this.ayudaService.getAyudasByModulo(modulo).subscribe(
      (data: Ayuda[]) => {
        this.ayudas = data;
        console.log('cargar las ayudas:', data);
      },
      (error: any) => {
        console.error('Error al cargar las ayudas:', error);
        this.ayudas = []; // En caso de error, mantenemos el arreglo vacío
      }
    );
  }

}
