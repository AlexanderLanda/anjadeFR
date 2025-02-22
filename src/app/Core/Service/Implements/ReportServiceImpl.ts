// report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ReportDto } from '../../Model/ReportDto';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'



@Injectable({
  providedIn: 'root'
})
export class ReportServiceImpl {
  private apiUrl = environment.apiUrl + 'api/v1/reports';

  constructor(private http: HttpClient) { }

  createReport(report: ReportDto): Observable<ReportDto> {
    const formData: FormData = new FormData();
    report.attachments.forEach(file => console.log("file subidos antes de llamar backend:" + file.name))

    formData.append('json', JSON.stringify(report));
    report.attachments.forEach(file => formData.append('files', file, file.name));
    return this.http.post<ReportDto>(`${this.apiUrl}`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError('Hubo un error en la solicitud. Por favor, inténtelo de nuevo más tarde.');

  }

  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getReportById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getAttachments(reportId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}api/v1/attachments/report/${reportId}`);
  }

  updateReport(formData: FormData): Observable<ReportDto> {
    return this.http.put<ReportDto>(`${this.apiUrl}/update`, formData);
  }


  async generateAndDownloadReport(
    dataSource: MatTableDataSource<ReportDto>,
    download: boolean = true
  ): Promise<Blob | null> {
    // Obtener todos los reportes seleccionados
    const selectedReports = dataSource.filteredData.filter((repo) => repo.selected);
  
    // Validar si hay reportes seleccionados
    if (selectedReports.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe seleccionar al menos un Reporte.',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return null;
    }
  
    // Crear un ZIP que contenga todos los reportes y sus archivos adjuntos
    const zip = new JSZip();
  
    try {
      // Procesar cada reporte seleccionado
      for (const report of selectedReports) {
        // Obtener los detalles completos del reporte
        const detailedReport: ReportDto | null = await this.loadReportDetails(report.id);
  
        if (!detailedReport) {
          console.error(`Error: No se pudo cargar el reporte con ID ${report.id}`);
          continue; // Saltar este reporte y continuar con los demás
        }
  
        const folderName = `${detailedReport.referenciaReporte}`;
        const pdfFileName = `${detailedReport.referenciaReporte}.pdf`;
  
        // Crear el PDF y validar que no sea null
        const pdfBlob = await this.generateReportPDF(detailedReport);
        if (!(pdfBlob instanceof Blob)) {
          console.error("No se pudo generar el PDF para el reporte:", detailedReport.referenciaReporte);
          continue; // Saltar este reporte y continuar con los demás
        }
  
        // Agregar el PDF al ZIP
        zip.file(`${folderName}/${pdfFileName}`, pdfBlob);
  
        // Descargar y agregar los archivos adjuntos al ZIP
        for (const [index, file] of (detailedReport.attachments || []).entries()) {
          const fileData = await this.downloadFile(file);
          if (fileData instanceof Blob) {
            zip.file(`${folderName}/adjuntos/${index + 1}-${this.getName(file)}`, fileData);
          } else {
            console.error('No se pudo descargar el archivo:', file.name);
          }
        }
      }
  
      // Generar el ZIP final
      const zipBlob = await zip.generateAsync({ type: 'blob' });
  
      // Si es para descargar el ZIP
      if (download) {
        saveAs(zipBlob, 'reportes.zip');
        return null; // No retornar nada cuando se descarga
      } else {
        return zipBlob; // Retornar el Blob para otras acciones, como enviar por correo
      }
  
    } catch (error) {
      console.error('Error procesando los reportes:', error);
      return null;
    }
  }
  




  async loadReportDetails(id?: number): Promise<ReportDto | null> {
    if (id === undefined) {
      console.error("El ID del reporte es undefined.");
      return null; // Retornar null o manejar de otra forma
    }
    try {
      const report = await this.getReportById(id).toPromise(); // Convertimos a Promise
      const attachments = await this.loadAttachments(id);

      report.attachments = attachments || [];
      return report;
    } catch (error) {
      console.error('Error fetching report details:', error);
      throw error;
    }
  }

  async loadAttachments(reportId: number): Promise<File[]> {
    try {
      const data = await this.getAttachments(reportId).toPromise();
      return data || [];
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
  }

  generateReportPDF(detailedReport: ReportDto): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new jsPDF();

        // Cargar imagen Base64 (reemplaza con la tuya)
        const footerImage = 'iconos/anjade_icon.jpg'; // Agrega tu imagen en Base64 aquí

        const footerHeight = 30; // Espacio reservado para la imagen
        const imageSize = 25; // Tamaño del icono 25x25
        const pageHeight = doc.internal.pageSize.height;

        doc.setFont('helvetica');
        doc.setFontSize(12);

        // Encabezado
        doc.setFillColor(50, 50, 50);
        doc.setTextColor(255, 255, 255);
        doc.rect(10, 10, 190, 10, 'F');
        doc.text('Detalles del Reporte', 15, 17);

        // Contenido
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        let yPosition = 30;
        const maxContentHeight = pageHeight - footerHeight; // Reservamos espacio para el pie de página

        doc.text(`ID: ${detailedReport?.referenciaReporte}`, 15, yPosition);
        doc.text(`Afiliación ID: ${detailedReport?.afiliacionId || 'N/A'}`, 75, yPosition);
        doc.text(`Nombre: ${(detailedReport?.nombre + " " + detailedReport?.apellidos) || 'N/A'}`, 125, yPosition);

        yPosition += 8;
        doc.text(`Teléfono: ${detailedReport?.telefono || 'N/A'}`, 15, yPosition);
        doc.text(`Deporte: ${detailedReport?.deporte?.nombre || 'N/A'}`, 75, yPosition);
        doc.text(`Provincia: ${detailedReport?.provincia?.descripcion || 'N/A'}`, 125, yPosition);

        yPosition += 8;
        doc.text(`Email: ${detailedReport?.email || 'N/A'}`, 15, yPosition);


        // Descripción
        yPosition += 10;
        doc.setFillColor(100, 100, 100);
        doc.setTextColor(255, 255, 255);
        doc.rect(10, yPosition, 190, 8, 'F');
        doc.text('Descripción:', 15, yPosition + 5);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        yPosition += 12;

        let textLines = doc.splitTextToSize(detailedReport?.descripcion || 'Sin descripción', 180);
        let lineHeight = 5;

        for (let i = 0; i < textLines.length; i++) {
          if (yPosition + lineHeight > maxContentHeight) { // Considerar el espacio del footer
            this.addFooter(doc, footerImage, imageSize, pageHeight);
            doc.addPage();
            yPosition = 20;
          }
          doc.text(textLines[i], 15, yPosition);
          yPosition += lineHeight;
        }

        // Archivos adjuntos
        yPosition += 10;
        doc.setFillColor(100, 100, 100);
        doc.setTextColor(255, 255, 255);
        doc.rect(10, yPosition, 190, 8, 'F');
        doc.text('Archivos Adjuntos:', 15, yPosition + 5);
        yPosition += 10;

        const attachments = detailedReport?.attachments || [];
        const tableData = attachments.map((file, index) => [index + 1, this.getName(file) || 'Sin nombre']);

        if (attachments.length > 0) {
          if (yPosition + 20 > maxContentHeight) {
            this.addFooter(doc, footerImage, imageSize, pageHeight);
            doc.addPage();
            yPosition = 20;
          }
          (doc as any).autoTable({
            startY: yPosition + 5,
            head: [['#', 'Nombre del archivo']],
            body: tableData,
          });
        } else {
          doc.text('No hay archivos adjuntos.', 15, yPosition + 15);
        }

        // Agregar footer en la última página
        this.addFooter(doc, footerImage, imageSize, pageHeight);

        const pdfBlob = doc.output('blob');
        if (pdfBlob instanceof Blob) {
          resolve(pdfBlob);
        } else {
          reject(new Error("Error al generar el PDF: no se obtuvo un Blob válido"));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async downloadFile(file: any): Promise<Blob | undefined> {
    if (!file || !file.data || !file.fileName || !file.fileType) {
      console.error('Archivo inválido', file);
      return;
    }
    const blob = this.base64ToBlob(file.data, file.fileType);

    if (!blob) {
      console.error('No se pudo convertir a Blob:', file);
      return;
    }

    return blob;
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

  // Función para agregar el footer con la imagen
  private addFooter(doc: jsPDF, imageBase64: string, size: number, pageHeight: number) {
    const xPosition = (doc.internal.pageSize.width / 2) - (size / 2); // Centrar la imagen
    const yPosition = pageHeight - size - 5; // Dejar margen inferior
    doc.addImage(imageBase64, 'PNG', xPosition, yPosition, size, size);
  }

  getName(file: any): string | undefined {
    return file.fileName;
  }
}
