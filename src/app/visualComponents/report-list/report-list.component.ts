import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { SendEmailServiceImpl } from '../../Core/Service/Implements/SendEmailServiceImpl';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2'
import { ReportEditComponent } from "../report-edit/report-edit.component";


@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule, MatProgressBarModule, ]
})
export class ReportListComponent implements OnInit {
  report: any;
  isEditing = false;

  reports: any[] = [];
  dataSource: MatTableDataSource<ReportDto>;

  displayedColumns: string[] = ['idAfiliacion', 'apellidos', 'nombre', 'funcion', 'estadoFuncion', 'categoria', 'deporte', 'provincia', 'estado', 'rolAfiliado', 'editar'];
  listadoReportes: ReportDto[] | undefined;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | null = null;
  private modalService = inject(NgbModal);
  private emailService = inject(SendEmailServiceImpl);
  
  isLoading = false;
  

  constructor(private reportService: ReportServiceImpl, private router: Router) {
    this.dataSource = new MatTableDataSource<ReportDto>([]);
  }

  ngOnInit() {
    this.loadReports();
    this.cargarListadoDeReportes();
    this.dataSource.filterPredicate = this.createFilter();


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

  eliminarReporte(id: number) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
                if (result.isConfirmed) {
                  this.reportService.eliminarReporte(id).subscribe({
                    next: (response) => {
                      Swal.fire('Eliminado', response.mensaje, 'success');
                      this.cargarListadoDeReportes();
                    },
                    error: (error) => {
                      Swal.fire('Error', 'No se pudo eliminar el reporte', 'error');
                    }
                  });
                }
              });
      }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data: any, filter: string): boolean {
      const searchTerms = filter.toLowerCase();
      return Object.keys(data).some((key) => {
        if (typeof data[key] === 'object' && data[key] !== null) {
          // Buscar en propiedades 'nombre' o 'descripcion' de objetos
          return ['nombre', 'descripcion', 'estado'].some(prop =>
            data[key][prop] && data[key][prop].toString().toLowerCase().includes(searchTerms)
          );
        } else if (typeof data[key] === 'string') {
          return data[key].toLowerCase().includes(searchTerms);
        } else if (data[key] !== null && data[key] !== undefined) {
          // Para otros tipos de datos, convertir a string
          return data[key].toString().toLowerCase().includes(searchTerms);
        }
        return false;
      });
    }
    return filterFunction;
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

   async generateAndDownloadReport() : Promise<void> {
    this.isLoading = true;
       await this.reportService.generateAndDownloadReport(this.dataSource,true);
       this.isLoading = false;
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

   openEmailModal(): void {
      const reportData = this.dataSource.filteredData.filter((repo) => repo.selected);
      if (reportData.length === 0) {
         Swal.fire({
                              title: 'Error!',
                              text: 'Debe seleccionar al menos un Reporte.',
                              icon: 'error',
                              confirmButtonText: 'Ok'
                            })
        return;
      }
      const modalRef = this.modalService.open(EmailModalComponent, { size: 'lg' });
      modalRef.componentInstance.reportData = reportData;
      modalRef.componentInstance.isReportMode = true;
  
      modalRef.result.then((emailData) => {
        if (emailData) {
          this.isLoading=true;
          this.emailService.sendEmail(emailData).subscribe({
            next: () => {
              Swal.fire({
                                    title: 'Enviado!',
                                    text: 'Correos enviados correctamente.',
                                    icon: 'success',
                                    confirmButtonText: 'Ok'
                                  })
            },
            error: (err) => {
              Swal.fire({
                                    title: 'Error!',
                                    text: 'Error al enviar correos: ',
                                    icon: 'error',
                                    confirmButtonText: 'Ok'
                                  })
            } 
          });
        }
        this.isLoading=false;
      });
    }
    handleReportUpdated(updatedReport: ReportDto | null) {
      if (updatedReport) {
        this.report = updatedReport;
        location.reload(); // Recarga la página completamente
      }
      this.isEditing = false;
    }
}
