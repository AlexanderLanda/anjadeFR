import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-christmas-modal-content',
  template: `
    <div class="modal-body text-center">
      <img src="assets/imagen/navidad-anjade.jpg" alt="Feliz Navidad" class="img-fluid mb-3">
    </div>
  `,
  styles: [
    `
      .modal-body {
        padding: 20px;
      }
    `,
  ],
})
export class ChristmasModalContentComponent {
  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
