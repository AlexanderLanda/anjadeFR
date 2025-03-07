import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UploadFilesServiceImpl } from '../../Core/Service/Implements/UploadFilesServiceImpl';
import { RUTAS_ARCHIVOS } from '../../constants/rutas-archivos.constants';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UploadFilesComponent implements OnInit {
  selectedFiles: File[] = [];
  uploadedFiles: string[] = [];

  constructor(private fileService: UploadFilesServiceImpl) {}
 
  ngOnInit() {
    this.listFiles();
  }

  // Evento cuando se seleccionan archivos
  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  // Subir archivos al servidor
  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      alert('Por favor, selecciona archivos.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('files[]', file));

    // Llamar al servicio para subir los archivos
    this.fileService.uploadFiles(this.selectedFiles,RUTAS_ARCHIVOS.NOTICIAS).subscribe({
      next: () => {
        alert('Archivos subidos correctamente.');
        this.listFiles();
        this.selectedFiles = [];
      },
      error: (err) => console.error('Error al subir archivos:', err)
    });
  }

  // Obtener lista de archivos
  listFiles(): void {
    this.fileService.getFilesFromFolder(RUTAS_ARCHIVOS.NOTICIAS).subscribe({
      next: (files) => this.uploadedFiles = files,
      error: (err) => console.error('Error al obtener archivos:', err)
    });
  }
}
