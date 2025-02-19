import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ReportDto } from '../../Core/Model/ReportDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as pdfjsLib from 'pdfjs-dist';


@Component({
  selector: 'app-report-edit',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './report-edit.component.html',
  styleUrl: './report-edit.component.css'
})
export class ReportEditComponent implements OnChanges {
  @Input() report?: ReportDto;
  @Output() reportUpdated = new EventEmitter<ReportDto>();

  reportForm!: FormGroup;
  newFiles: File[] = [];
  attachments: any[] = [];
  paginatedFiles: any[] = [];
  isFileSectionOpen: boolean = false;



  isLoading: boolean = true;
  loadingProgress: number = 0;
  currentPage: number = 1;
  pageSize: number = 3;
  totalPages: number = 0;
  notificationMessage: any;
  notificationType: any;


  constructor(private fb: FormBuilder, private reportService: ReportServiceImpl) { }

  ngOnInit() {
    this.initForm();
     // Añadimos la clase 'modal-open' al body cuando la modal se muestra
     document.body.classList.add('modal-open');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['report'] && changes['report'].currentValue) {
      this.initForm();
    }
  }

  private initForm() {
    this.reportForm = this.fb.group({
      descripcion: [this.report?.descripcion || '', Validators.required],
      attachments: [this.report?.attachments || []] // Asegura que attachments no sea undefined
    });
    this.attachments = this.report?.attachments || [];
    console.log(this.attachments)
    this.generateThumbnails();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.newFiles.push(files[i]);
    }
  }

  removeAttachment(index: number) {
    if (this.report && this.report.attachments) {
      this.report.attachments.splice(index, 1);
    }
    this.updatePaginatedFiles();
  }

  saveChanges() {
    if (!this.report) {
      console.error('No hay reporte para actualizar');
      return;
    }
  
    const formData = new FormData();
  
    const reportJson = JSON.stringify({
      ...this.report,
      descripcion: this.reportForm.value.descripcion
    });
    formData.append('report', new Blob([reportJson], { type: 'application/json' }));
  
    if (this.newFiles.length > 0) {
      this.newFiles.forEach(file => {
        formData.append('files', file);
      });
    } else {
      formData.append("files", new Blob([], { type: "application/json" }));
    }
  
    console.log("Datos enviados al backend:", formData);
  
    this.reportService.updateReport(formData).subscribe({
      next: (res) => {
        res.isEditing={ success: true, message: "Cambios guardados correctamente." }
        alert("Cambios guardados correctamente.")
        this.reportUpdated.emit(res);
      },
      error: (err) => {
        console.error("Error al guardar:", err);
      }
    });
  }
  
  


  async generateThumbnails() {
    const totalFiles = this.attachments.length;
    for (let i = 0; i < totalFiles; i++) {
      const file = this.attachments[i];
      file.thumbnail = await this.generateThumbnail(file);
      this.loadingProgress = Math.round(((i + 1) / totalFiles) * 100);
    }
    this.initializeFilesDisplay();
    this.isLoading = false;
  }

  initializeFilesDisplay() {
    this.totalPages = Math.ceil(this.attachments.length / this.pageSize);
    this.updatePaginatedFiles();
  }
  async generateThumbnail(file: any): Promise<string> {
    if (file.fileType.startsWith('image/')) {
      return `data:${file.fileType};base64,${file.data}`;
    } else if (file.fileType === 'application/pdf') {
      const loadingTask = pdfjsLib.getDocument({ data: atob(file.data) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context!, viewport: viewport }).promise;
      return canvas.toDataURL();
    } else if (file.fileType === 'application/msword' ||
      file.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return '/iconos/word-icon.png';
    }
    else if (file.fileType === 'application/vnd.ms-excel' ||
      file.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return '/iconos/excel-icon.png';
    }
    return '/icons/file-icon.png';
  }

  loadAttachments(reportId: number) {
    this.reportService.getAttachments(reportId).subscribe(
      (data) => {
        this.attachments = data;
        this.generateThumbnails();
      },
      (error) => {
        console.error('Error fetching attachments:', error);
      }
    );
  }

  updatePaginatedFiles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    //this.paginatedFiles = this.attachments.slice(startIndex, startIndex + this.pageSize);
    this.paginatedFiles = this.attachments.slice(startIndex, startIndex + this.pageSize) || [];
    console.log("attachments" + this.paginatedFiles)
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedFiles();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedFiles();
    }
  }

  openFile(file: any) {
    const blob = this.base64ToBlob(file.data, file.fileType);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  downloadFile(file: any) {
    const blob = this.base64ToBlob(file.data, file.fileType);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  toggleFileSection() {
    this.isFileSectionOpen = !this.isFileSectionOpen;
  }

  ngOnDestroy() {
    // Eliminamos la clase 'modal-open' al cerrar la modal
    document.body.classList.remove('modal-open');
  }
}
