import { Component, inject, OnInit, TrackByFunction } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UploadFilesServiceImpl } from '../../Core/Service/Implements/UploadFilesServiceImpl';
import { RUTAS_ARCHIVOS } from '../../constants/rutas-archivos.constants';
import { DeportesDto } from '../../Core/Model/DeportesDto';
import { DEPORTES } from '../../constants/deportes';
import { DeporteServiceImpl } from '../../Core/Service/Implements/DeporteServiceImpl';
import { ReglamentosFileServiceImpl } from '../../Core/Service/Implements/ReglamentosFileServiceImpl';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule]
})
export class UploadFilesComponent implements OnInit {
  selectedFiles: File[] = [];
  uploadedFiles: string[] = [];
  selectedDeporte = '';
  deportes: DeportesDto[] =[];
  deportesForm: FormGroup;
  
  

  private deportesService = inject(DeporteServiceImpl);

  constructor(private fileService: UploadFilesServiceImpl, private reglamentosService: ReglamentosFileServiceImpl,    
    private formBuilder: FormBuilder,
  ) {
    this.deportesForm = this.formBuilder.group({
      deporte: ['']  // El campo "deporte" debe existir aquí
    });
    
  }
 
  ngOnInit() {
    //this.listFiles();
    this.cargarDeportesComboBox();
    this.deportesForm.get('deporte')?.valueChanges.subscribe(value => {
      this.selectedDeporte = value;
    });
  }

  // Evento cuando se seleccionan archivos
  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  // Subir archivos al servidor
  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
       Swal.fire({
              title: 'Error!',
              text: 'Por favor, selecciona archivos.',
              icon: 'error',
              confirmButtonText: 'Ok'
            })
      return;
    }
  
    const formDatas = new FormData();
    this.selectedFiles.forEach(file => formDatas.append('files', file,file.name));
    const deporteData = this.deportesForm.value;

    formDatas.append('deporte',this.selectedDeporte);
        // Enviar la actualización al JSON
        this.reglamentosService.saveReglamento(formDatas).subscribe({
          next: () => console.log('JSON actualizado correctamente'),
          error: err => console.error('Error al actualizar el JSON:', err)
        });
        
    // Subir los archivos al servidor
    this.fileService.uploadFiles(this.selectedFiles, RUTAS_ARCHIVOS.REGLAMENTOS).subscribe({
      next: () => {
        alert('Archivos subidos correctamente.');

  
        this.listFiles();
        this.selectedFiles = [];
      },
      error: (err) => console.error('Error al subir archivos:', err)
    });
  }
  
  
  updateFileList(): void {
    const jsonFilePath = RUTAS_ARCHIVOS.REGLAMENTOS_JSON;
  
    // Obtener el JSON actual del servidor
    this.fileService.getJsonFile(jsonFilePath).subscribe({
      next: (fileList: any) => {
        if (!fileList.files) {
          fileList.files = [];
        }
  
        // Agregar los nuevos archivos
        this.selectedFiles.forEach(file => {
          const filePath = `/ficheros/documentos/reglamentos_deportivos/${file.name}`;
          const newFile = {
            name: file.name,
            type: file.type,
            path: filePath,
            deporte: this.selectedDeporte // El deporte seleccionado
          };
          fileList.files.push(newFile);
        });
  
        // Guardar el JSON actualizado
        this.fileService.saveJsonFile(jsonFilePath, fileList).subscribe({
          next: () => console.log('Lista de archivos actualizada correctamente.'),
          error: (err) => console.error('Error al actualizar el archivo JSON:', err)
        });
      },
      error: (err) => console.error('Error al obtener reglamentos-fileList.json:', err)
    });
  }
  

  // Obtener lista de archivos
  listFiles(): void {
    this.fileService.getFilesFromFolder(RUTAS_ARCHIVOS.NOTICIAS).subscribe({
      next: (files) => this.uploadedFiles = files,
      error: (err) => console.error('Error al obtener archivos:', err)
    });
  }
  cargarDeportesComboBox() {

    this.deportesService.getDeportes().subscribe(deportes => {
      this.deportes = deportes;
    })
  }

  trackByFn(index: number, item: DeportesDto) {
    return item.id;
  }
  
  
}
