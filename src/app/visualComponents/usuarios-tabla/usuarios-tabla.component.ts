import { Component, OnInit, AfterViewInit, ViewChild, inject } from '@angular/core';
import { UsuariosDto } from '../../Core/Model/UsuariosDto';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { AfiliadosFuncionDto } from '../../Core/Model/AfiliadosFuncionDto';
import { AfiliadosFuncionServiceImpl } from '../../Core/Service/Implements/AfiliadosFuncionServiceImpl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ModalEditarComponent } from '../modal-editar/modal-editar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../Core/Service/Implements/DataService';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

import * as GENERIC_CONST from '../../constants/genericconstant';
import { AuthService } from '../../Core/Service/Implements/AuthService';
import { Router } from '@angular/router';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { SendEmailServiceImpl } from '../../Core/Service/Implements/SendEmailServiceImpl';
import { environment } from '../../../environments/environment';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';




/**
 * @title Table with pagination
 */

@Component({
  selector: 'app-usuarios-tabla',
  templateUrl: './usuarios-tabla.component.html',
  styleUrls: ['./usuarios-tabla.component.css'],
  standalone: true,
  imports: [
    // ... otros módulos
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    CommonModule,
    FormsModule
  ]
})
export class UsuariosTablaComponent implements AfterViewInit {



  displayedColumns: string[] = ['idAfiliacion', 'apellidos', 'nombre', 'funcion', 'estadoFuncion', 'categoria', 'deporte', 'provincia', 'estado', 'rolAfiliado', 'editar'];
  listadoUsuarios: UsuariosDto[] | undefined;
  listadoUsuariosFiltrados: UsuariosDto[] | undefined;
  dataSource: MatTableDataSource<UsuariosDto>;
  userlogin: UsuariosDto | undefined | null;
  selectedFuncion: number | undefined;
  afiliadosFunciones: AfiliadosFuncionDto[] | undefined;
  readonly PENDIENTE_DE_PAGO_ID = 3

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort | null = null;

  private usuariosService = inject(UsuariosServiceImpl);
  private emailService = inject(SendEmailServiceImpl);
  private afiliadosFuncionService = inject(AfiliadosFuncionServiceImpl);
  private dialog = inject(MatDialog);
  private dataService = inject(DataService);
  private modalService = inject(NgbModal);
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);



  constructor(
    private _liveAnnouncer: LiveAnnouncer,
  ) {
    this.dataSource = new MatTableDataSource<UsuariosDto>([]);
  }

  ngOnInit() {
    this.userlogin = this.authService.getCurrentUser();
    this.dataService.data$.subscribe((updated: any) => {
      if (updated) {
        this.cargarListadoDeUsuarios();
      }
    });
    this.cargarListadoDeUsuarios();
    this.cargarFuncionesDeAfiliadosComboBox();
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPaginatedData(): any[] {
    const startIndex = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0;
    const endIndex = startIndex + (this.paginator ? this.paginator.pageSize : 10);
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  editarFila(element: any): void {
    /*
    const dialogRef = this.dialog.open(ModalEditarComponent, {
      data: { fila: element }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrada');
    });
*/
    const modalRef = this.modalService.open(ModalEditarComponent);
    modalRef.componentInstance.data = element;
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

  getEstadoCuentaClass(estado: number): string {
    if (estado === 3) {
      return 'table-danger'; // Si el estado es 1, devuelve la clase 'estado-rojo'
    } else if (estado === 4) {
      return 'table-warning'; // Si el estado es 2, devuelve la clase 'estado-amarillo'
    } else {
      return ''; // Si el estado no es 1 ni 2, no se aplica ninguna clase adicional
    }
  }

  cargarListadoDeUsuarios() {

    this.usuariosService.getUsuarios().subscribe(usuarios => {
      this.listadoUsuarios = usuarios.filter(usuario => usuario.estadoCuenta.id !== GENERIC_CONST.ESTADO_USUARIO_DENEGADO && usuario.usuariorol.id !== GENERIC_CONST.USER_ADMIN_ROL);
      this.dataSource.data = this.listadoUsuarios;
      this.dataSource.paginator = this.paginator; // Asegúrate de actualizar el paginador después de cargar los datos
      this.dataSource.sort = this.sort; // Asegúrate de actualizar el ordenamiento después de cargar los datos
      console.log(this.listadoUsuarios);
    });

  }



  cargarFuncionesDeAfiliadosComboBox() {

    this.afiliadosFuncionService.getAfiliadosFuncion().subscribe(afiliadosRoles => {
      this.afiliadosFunciones = afiliadosRoles;
    })
  }


  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  customFilterPredicate(data: UsuariosDto, filter: string): boolean {
    const flatData = this.flattenObject(data);
    const dataStr = Object.values(flatData).join(' ').toLowerCase();
    return dataStr.includes(filter);
  }

  flattenObject(obj: any): any {
    const result: any = {};

    function recurse(cur: any, prop: string) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        for (let i = 0; i < cur.length; i++) {
          recurse(cur[i], prop ? `${prop}[${i}]` : `${i}`);
        }
        if (cur.length === 0) {
          result[prop] = [];
        }
      } else {
        let isEmpty = true;
        for (const p in cur) {
          if (cur.hasOwnProperty(p)) {
            isEmpty = false;
            recurse(cur[p], prop ? `${prop}.${p}` : p);
          }
        }
        if (isEmpty && prop) {
          result[prop] = {};
        }
      }
    }

    recurse(obj, "");
    return result;
  }
  downloadExcel() {
    if (!this.listadoUsuarios || this.listadoUsuarios.length === 0) {
      console.error('No hay datos para exportar');
      return;
    }

    // Función auxiliar para formatear fechas
    const formatDate = (date: string | Date | undefined): string => {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // Retorna solo la parte de la fecha
    };

    type RowData = Record<string, string | undefined>; // Permite claves dinámicas
    const data: RowData[] = this.listadoUsuarios
      .filter(user => user.usuariorol?.descripcion !== 'administrador')
      .map(user => ({
        Nombre: user.nombre,
        Apellidos: user.apellidos,
        'Fecha de Nacimiento': formatDate(user.fechaNacimiento),
        Dirección: user.direccion,
        Correo: user.correo,
        Deporte: user.deporte?.nombre || '',
        Localidad: user.localidad || '',
        Provincia: user.provincia?.descripcion || '',
        'Tipo de Documento': user.tipoDocumento?.descripcion || '',
        Documento: user.documento,
        'C.P': user.codigoPostal,
        Teléfono: user.telefono,
        'Función': user.afiliadosFuncion?.descripcion || '',
        'Categoría': user.afiliadosCategoria?.descripcion || '',
        'Rol de Usuario': user.usuariorol?.descripcion || '',
        'Fecha de Afiliación': formatDate(user.fechaAfiliacion),
        'Situación Actual': user.situacionActual,
        'Pago': user.tipoPago?.descripcion || '',
        'ID de Afiliación': user.idAfiliacion
      }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Estilo para el encabezado
    const headerStyle = {
      fill: { fgColor: { rgb: "90EE90" } }, // Color verde claro
      font: { bold: true },
      alignment: { horizontal: "center" }
    };

    // Aplicar estilo al encabezado
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = headerStyle;
    }

    // Ajustar el ancho de las columnas
    const columnsWidth = data.reduce<number[]>((width, row) => {
      Object.keys(row).forEach((key, i) => {
        const cellLength = row[key] ? row[key]!.toString().length : 10;
        width[i] = Math.max(width[i] || 0, cellLength);
      });
      return width;
    }, []);

    worksheet['!cols'] = columnsWidth.map(w => ({ width: w + 2 })); // +2 para un poco de padding

    const workbook: XLSX.WorkBook = { Sheets: { 'Usuarios': worksheet }, SheetNames: ['Usuarios'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Listado_Usuarios.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  viewUserDetails(userId: number) {
    this.router.navigate(['/user-details', userId]);
  }

  // Método para verificar si todas las filas visibles están seleccionadas
  areAllVisibleRowsSelected(): boolean {
    return this.getPaginatedData().every(row => row.selected);
  }


  // Método para obtener usuarios seleccionados
  getSelectedUsers(): UsuariosDto[] {
    return this.dataSource.filteredData.filter(row => row.selected);
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
    const selectedUsers = this.dataSource.filteredData.filter((user) => user.selected);
    if (selectedUsers.length === 0) {
      alert('Debe seleccionar al menos un afiliado.');
      return;
    }
    const modalRef = this.modalService.open(EmailModalComponent, { size: 'lg' });
    modalRef.componentInstance.selectedUsers = selectedUsers;

    modalRef.result.then((emailData) => {
      if (emailData) {
        this.emailService.sendEmail(emailData).subscribe({
          next: () => alert('Correos enviados correctamente.'),
          error: (err) => alert('Error al enviar correos: ' + err.message),
        });
      }
    });
  }

  sendEmailToBackend(emailData: any): void {
    const formData = new FormData();
    formData.append('content', emailData.content);
    emailData.attachments.forEach((file: File, index: number) => {
      formData.append(`attachment${index}`, file);
    });
    formData.append('users', JSON.stringify(emailData.users));

    this.emailService.sendEmail(formData).subscribe(
      response => console.log('Correo enviado con éxito', response),
      error => console.error('Error al enviar el correo', error)
    );
  }

  enviarRecordatorioPago(): void {
    this.http.post(environment.apiUrl + 'api/v1/sendPaymentReminderEmail', {
      estadoPendienteId: this.PENDIENTE_DE_PAGO_ID
    }).subscribe(
      (response: any) => {
        if (response && response.error === false) {
          alert(response.message || 'Recordatorios enviados con éxito');
        } else {
          alert('Hubo un problema al enviar los recordatorios');
        }
      },
      (error) => {
        console.error('Error al intentar enviar el recordatorio:', error);
        alert('Hubo un error en la comunicación con el servidor');
      }
    );
  }

}
