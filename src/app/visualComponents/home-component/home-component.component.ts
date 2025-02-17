import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { JuntaDirectivaComponent } from "../junta-directiva/junta-directiva.component";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChristmasModalContentComponent } from '../christmas-modal-content.component';
import { AyudaChatComponent } from '../ayuda-chat/ayuda-chat.component';
import { RegistroComponent } from '../registro/registro.component';

@Component({
  selector: 'app-home-component',
  standalone: true,
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css'],
  imports: [RouterModule]
})
export class HomeComponentComponent {
  private router = inject(Router);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    const modalShown = localStorage.getItem('modalShown');
    // Abre el modal programáticamente
    
    /*this.openChristmasModal();
    if (!modalShown) {
      // Marca que el modal fue mostrado
      localStorage.setItem('modalShown', 'true');

      // Abre el modal programáticamente
      this.openChristmasModal();
    }*/
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }

}
