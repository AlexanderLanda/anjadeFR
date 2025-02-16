import { Component } from '@angular/core';

@Component({
  selector: 'app-estatutos',
  templateUrl: './estatutos.component.html',
  styleUrls: ['./estatutos.component.css']
})
export  class EstatutosComponent {

  constructor() {
    // Ruta del documento Word
    const url = '/assets/documentos/estatutos.docx';
    // Descargar el documento Word
    window.location.href = url;
    // Imprimir mensaje en la consola
    console.log('Descarga realizada con éxito');
  }
}
