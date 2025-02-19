import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReportDto } from '../../Core/Model/ReportDto';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import JSZip, { forEach } from 'jszip';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule]
})
export class ReportListComponent implements OnInit {
  reports: any[] = [];
  dataSource: MatTableDataSource<ReportDto>;

  displayedColumns: string[] = ['idAfiliacion', 'apellidos', 'nombre', 'funcion', 'estadoFuncion', 'categoria', 'deporte', 'provincia', 'estado', 'rolAfiliado', 'editar'];
  listadoReportes: ReportDto[] | undefined;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private reportService: ReportServiceImpl, private router: Router) {
    this.dataSource = new MatTableDataSource<ReportDto>([]);
  }

  ngOnInit() {
    this.loadReports();
    this.cargarListadoDeReportes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadReports() {
    this.reportService.getAllReports().subscribe(
      (data) => {
        this.reports = data;
      },
      (error) => {
        console.error('Error fetching reports:', error);
      }
    );
  }

  async loadReportDetails(id?: number): Promise<ReportDto | null> {
    if (id === undefined) {
      console.error("El ID del reporte es undefined.");
      return null; // Retornar null o manejar de otra forma
    }
    try {
      const report = await this.reportService.getReportById(id).toPromise(); // Convertimos a Promise
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
      const data = await this.reportService.getAttachments(reportId).toPromise();
      return data || [];
    } catch (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
  }


  viewDetails(reportId: number) {
    this.router.navigate(['/report-details', reportId]);
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  getPaginatedData(): any[] {
    const startIndex = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0;
    const endIndex = startIndex + (this.paginator ? this.paginator.pageSize : 10);
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  cargarListadoDeReportes() {
    this.reportService.getAllReports().subscribe(reports => {
      this.listadoReportes = reports;
      this.dataSource.data = this.listadoReportes;
      this.dataSource.paginator = this.paginator; // Asegúrate de actualizar el paginador después de cargar los datos
      this.dataSource.sort = this.sort; // Asegúrate de actualizar el ordenamiento después de cargar los datos
    });
  }

  async generateAndDownloadReport() {
    const selectedReport = this.dataSource.filteredData.filter((repo) => repo.selected);
    if (selectedReport.length === 0) {
      alert('Debe seleccionar al menos un reporte.');
      return;
    }

    for (const report of selectedReport) {
      try {
        // Esperamos obtener el reporte con todos sus detalles y adjuntos
        const detailedReport = await this.loadReportDetails(report.id);

        const zip = new JSZip();
        const folderName = `${detailedReport?.referenciaReporte}`;
        const pdfFileName = `${detailedReport?.referenciaReporte}.pdf`;

        // Crear un nuevo documento PDF
        const doc = new jsPDF();
        doc.text(`Reporte: ${detailedReport?.referenciaReporte}`, 10, 10);

        // Generar tabla con archivos adjuntos
        const attachments = detailedReport?.attachments || [];
        const tableData = attachments.map((file, index) => [index + 1, file.name]);

        // Agregar la tabla al PDF con autoTable
        (doc as any).autoTable({
          head: [['#', 'Nombre del archivo']],
          body: tableData,
        });

        // Convertir el PDF a Blob y agregarlo al ZIP
        const pdfBlob = doc.output('blob');
        zip.file(`${folderName}/${pdfFileName}`, pdfBlob);

        // Descargar los archivos adjuntos y agregarlos al ZIP
        for (const [index, file] of attachments.entries()) {
          const fileData = await this.downloadFile(file);  
          if (fileData) {
            zip.file(`${folderName}/adjuntos/${index + 1}-${this.getName(file)}`, fileData);
          } else {
            console.error('No se pudo descargar el archivo:', file.name);
          }
        }

        // Generar y descargar el ZIP
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `${folderName}.zip`);

        console.log(`Archivo ZIP generado para: ${detailedReport?.referenciaReporte}`);
      } catch (error) {
        console.error(`Error procesando el reporte ${report.id}:`, error);
      }
    }
  }

  getName(file:any): string|undefined{
    return file.fileName;
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
  


  /* async downloadFile(file: any): Promise<Blob | undefined> {
    // Verifica que las propiedades necesarias estén presentes
    if (!file || !file.data || !file.fileName || !file.fileType) {
      console.error('Archivo inválido', file);
      return;
    }

    // Convertir base64 a Blob
    const blob = this.base64ToBlob(file.data, file.fileType);

    // Asegurarse de que el nombre del archivo esté correctamente asignado
    const fileName = file.fileName || 'archivo_sin_nombre';
    console.log(`Descargando archivo: ${fileName}`);

    // Crear un objeto URL para el archivo y simular la descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;  // Asignar el nombre correcto del archivo
    link.click();
    URL.revokeObjectURL(url);
    return;
  }*/


  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }
  toggleSelectAll(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      const isChecked = input.checked;
      this.dataSource.filteredData.forEach((user) => (user.selected = isChecked));
    }
  }

  allRowsSelected(): boolean {
    return this.dataSource.filteredData.every((user) => user.selected);
  }
  /*
    async downloadFile(url: string): Promise<Blob> {
      try {
        const response = await fetch(url);
        return await response.blob();
      } catch (error) {
        console.error('Error descargando el archivo:', error);
        throw error;
      }
    }*/
}
