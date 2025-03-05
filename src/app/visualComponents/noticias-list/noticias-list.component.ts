import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Noticia } from '../../Core/Model/NoticiaDto';
import { ReportDto } from '../../Core/Model/ReportDto';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import { SendEmailServiceImpl } from '../../Core/Service/Implements/SendEmailServiceImpl';
import { NoticiaServiceImpl } from '../../Core/Service/Implements/NoticiaServiceImpl';
import Swal from 'sweetalert2';
import { CrearNoticiasComponent } from "../noticias-crear/crear-noticias.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-noticias-list',
  imports: [CommonModule, MatPaginatorModule, MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule, MatProgressBarModule, CrearNoticiasComponent,MatDialogModule],
  templateUrl: './noticias-list.component.html',
  styleUrl: './noticias-list.component.css'
})
export class NoticiasListComponent {


   noticias: any[] = [];
    dataSource: MatTableDataSource<Noticia>;
  
    displayedColumns: string[] = ['idAfiliacion', 'apellidos', 'nombre', 'funcion', 'estadoFuncion', 'categoria', 'deporte', 'provincia', 'estado', 'rolAfiliado', 'editar'];
    listadoNoticias: Noticia[] = [];
  
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort) sort: MatSort | null = null;
    private modalService = inject(NgbModal);
    private emailService = inject(SendEmailServiceImpl);
    
    isLoading = false;
    mostrarFormulario = false;
    noticiaSeleccionada : any;
  
    constructor(private noticiaService: NoticiaServiceImpl, private router: Router,private dialog: MatDialog) {
      this.dataSource = new MatTableDataSource<Noticia>([]);
    }
  
    ngOnInit() {
      this.cargarListadoDeNoticias();
      this.dataSource.filterPredicate = this.createFilter();
  
  
    }
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
  
    cargarListadoDeNoticias() {
      this.noticiaService.obtenerTodasNoticias().subscribe(news => {
        this.listadoNoticias = news;
        this.dataSource.data = this.listadoNoticias;
        this.dataSource.paginator = this.paginator; // Asegúrate de actualizar el paginador después de cargar los datos
        this.dataSource.sort = this.sort; // Asegúrate de actualizar el ordenamiento después de cargar los datos
      });
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

    viewDetails(noticia:any){
     const notice= this.noticiaService.obtenerNoticiasByID(noticia)
     let propia = noticia.propia ? 'Propia' : 'Externa' 
     if(propia === 'Propia'){
      window.location.href = `/noticias-reader/${noticia.id}`;
     }
     else{
      window.open(noticia.linkOriginal, '_blank');     
    }
    }

    
    editarNoticia(noticia: any) {
      this.noticiaSeleccionada = noticia; // Guarda la noticia seleccionada
      this.mostrarFormulario = true; // Muestra el formulario
    }
    
  
    eliminarNoticia(id: number) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.noticiaService.eliminarNoticia(id).subscribe({
            next: (response) => {
              Swal.fire('Eliminado', response.mensaje, 'success');
              this.cargarListadoDeNoticias();
            },
            error: (error) => {
              Swal.fire('Error', 'No se pudo eliminar el reporte', 'error');
            }
      });
    }
  });
}

insertarNoticia(){
  this.router.navigate(['/crear-noticia']);

}
abrirModal(componentName: string, noticiaSeleccionada?: any): void {
  if (componentName === 'crear-noticia') {
    this.dialog.open(CrearNoticiasComponent, {
      width: '500px', // Ajusta según sea necesario
      disableClose: true, // Opcional, para evitar que se cierre al hacer clic afuera
      hasBackdrop: true, // Asegura que tenga un fondo oscuro
      panelClass: 'custom-modal-container' // Opcional, si necesitas CSS extra
    });
  } else {
    this.router.navigate([componentName]);
  }
}

cerrarFormulario() {
  this.mostrarFormulario = false; // Cierra el formulario al recibir el evento
  window.location.reload();

}

cerrarModal(): void {
  const modal = document.getElementById('modalCrearNoticia');
  if (modal) modal.style.display = 'none';
}

}
