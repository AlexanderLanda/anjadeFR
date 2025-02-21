import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import { forEach } from 'jszip';
import { ReportDto } from '../../Core/Model/ReportDto';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EmailModalComponent {
  @Input() selectedUsers: any[] = [];
  @Input() reportData:any[] = [];  // Los datos del reporte pasados al componente
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  emailSubject = '';
  emailBody = '';
  emailAttachments: File[] = [];
  isReportMode = false; // Indica si estamos en modo reporte
  inputEmail = ''; // Campo para ingresar destinatarios en modo reporte

  constructor(public activeModal: NgbActiveModal, private reportService: ReportServiceImpl) {}

  ngOnInit(): void {
    if (this.reportData) {
      this.dataSource = new MatTableDataSource(this.reportData);
      this.isReportMode = true; 
      const referenceNumbers = this.reportData.map((report: { referenciaReporte: any; }) => report.referenciaReporte);

      // Crear el asunto con las referencias
      const subject = `Referencias: ${referenceNumbers.join(', ')}`;
      this.emailSubject = `Informe de reportes: ${referenceNumbers
        }`;
    }
  }

  handleFileInput(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.emailAttachments = [...this.emailAttachments, ...Array.from(files)];    }
  }

  async sendEmail(): Promise<void> {
    const userMessage = this.emailBody;  
    const footerMessage = `           **************Adjunto carpeta report.zip con los reportes.************ `;
    const fullMessage = userMessage + footerMessage;

    const formData = new FormData();
    formData.append('subject', this.emailSubject);
    
    formData.append('body', fullMessage);
    

    let recipients = [];
    if (this.isReportMode) {
      // Si estamos en modo reporte, tomamos los correos ingresados manualmente
      recipients = this.inputEmail.split(',').map(email => email.trim());
    } else {
      // Modo normal: Tomamos los correos de los usuarios seleccionados
      recipients = this.selectedUsers.map(u => u.correo);
    }
    formData.append('recipients', JSON.stringify(recipients));

    // Si es un reporte, generamos el ZIP y lo adjuntamos
    if (this.isReportMode && this.reportData) {
      if (!Array.isArray(recipients) || recipients.length === 0 || !recipients  [0]) {
        alert("Debe escribir un destinatario obligatoriamente.");
        return;
      }

      const zipBlob = await this.reportService.generateAndDownloadReport(this.dataSource,false);
      if(zipBlob!=null){
        const zipFile = new File([zipBlob], `Report.zip`, { type: 'application/zip' });
      this.emailAttachments.push(zipFile);
      }
      
    }

    // Adjuntar archivos adicionales
    this.emailAttachments.forEach(file => formData.append('attachments', file));

    this.activeModal.close(formData);
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
