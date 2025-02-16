import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import * as pdfjsLib from 'pdfjs-dist';
import { Location } from '@angular/common';
import { inject } from '@angular/core';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css'],
  standalone: true
})
export class ReportDetailsComponent implements OnInit {
  report: any;
  attachments: any[] = [];
  paginatedFiles: any[] = [];
  isLoading: boolean = true;
  loadingProgress: number = 0;
  currentPage: number = 1;
  pageSize: number = 4;
  totalPages: number = 0;

  private reportService = inject(ReportServiceImpl);
  private location = inject(Location);
  private route = inject(ActivatedRoute);

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.js';
  }

  ngOnInit() {
    const reportId = this.route.snapshot.paramMap.get('id');
    if (reportId) {
      this.loadReportDetails(+reportId);
    }
  }

  loadReportDetails(id: number) {
    this.reportService.getReportById(id).subscribe(
      (data) => {
        this.report = data;
        this.loadAttachments(id);
      },
      (error) => {
        console.error('Error fetching report details:', error);
      }
    );
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
      const loadingTask = pdfjsLib.getDocument({data: atob(file.data)});
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
      return 'assets/iconos/word-icon.png';
    }
    return 'assets/icons/file-icon.png';
  }

  updatePaginatedFiles() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedFiles = this.attachments.slice(startIndex, startIndex + this.pageSize);
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

  goBack(): void {
    this.location.back();
  }

  editar(): void {}
}
