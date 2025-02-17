import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { ReportServiceImpl } from '../../Core/Service/Implements/ReportServiceImpl';
import { DeporteServiceImpl } from '../../Core/Service/Implements/DeporteServiceImpl';
import { ProvinciasServiceImpl } from '../../Core/Service/Implements/ProvinciasServiceImpl';
import { HttpErrorResponse } from '@angular/common/http';
import { ProvinciaDto } from '../../Core/Model/ProvinciaDto';
import { DeportesDto } from '../../Core/Model/DeportesDto';
import { ReportDto } from '../../Core/Model/ReportDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css'],
  standalone: true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule]
})
export class ReportFormComponent implements OnInit {
  reportForm: FormGroup;
  files: File[] = [];
  formError: string = '';
  selectedProvincia = '';
  selectedDeporte = '';
  provincias: ProvinciaDto[] | undefined;
  deportes: DeportesDto[] | undefined;
  cargando = false; 
  mensajeExito = ''; 

  private reportService = inject(ReportServiceImpl);
  private deportesService = inject(DeporteServiceImpl);
  private provinciasService = inject(ProvinciasServiceImpl);
  private fb = inject(FormBuilder);

  constructor() {
    this.reportForm = this.fb.group({
      afiliacionId: [''],
      nombre: [''],
      apellidos: [''],
      descripcion: [''],
      email: ['', Validators.email],
      telefono: [''],
      provincia: ['', [Validators.required]],
      deporte: ['', [Validators.required]],
    }, { validator: this.customValidator });
  }

  ngOnInit() {
    this.cargarDeportesComboBox();
    this.cargarProvinciasComboBox();
  }

  customValidator(group: FormGroup) {
    const afiliacionId = group.get('afiliacionId')?.value;
    const nombre = group.get('nombre')?.value;
    const email = group.get('email')?.value;
    const telefono = group.get('telefono')?.value;
    const provincia = group.get('provincia')?.value;
    const deporte = group.get('deporte')?.value;

    const errors: { [key: string]: any } = {};  // Puedes usar 'any' si no conoces las claves con anticipación

    if (!(afiliacionId || (nombre && email) || (nombre && telefono))) {
      errors['invalidIdentification'] = true;
    }

    if (!provincia || !deporte) {
      errors['invalidSelection'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
  }

  onSubmit() {
    if (this.reportForm.valid) {
      this.cargando = true; 
      this.mensajeExito = ''; 
      const report: ReportDto = {
        ...this.reportForm.value,
        attachments: this.files
      };

      if (typeof this.provincias !== 'undefined') {
        const provinciasObject = this.provincias.find(loc => loc.id === Number(report.provincia));
        console.info(provinciasObject)
        if (provinciasObject) {
          report.provincia = provinciasObject;
        }
      }

      if (typeof this.deportes !== 'undefined') {
        const deportesObject = this.deportes.find(loc => loc.id === Number(report.deporte));
        console.info(deportesObject)
        if (deportesObject) {
          report.deporte = deportesObject;
        }
      }

      this.reportService.createReport(report).subscribe({
        next: (response) => {
          this.cargando = false; 
          this.mensajeExito = 'Creacion de Reporte sobre suceso correctamente';
          this.reportForm.reset();
          console.log('Reporte enviado con éxito', response);
        },
        error: (error: HttpErrorResponse) => {
          this.cargando = false; 
          console.error('Error al enviar el reporte', error);
          if (error.status === 0) {
            console.error('Ha ocurrido un error de red. Por favor, verifica tu conexión.');
          } else {
            console.error(`Backend retornó código ${error.status}, cuerpo era: ${error.error}`);
          }
        }
      });
    } else {
      const errors = this.reportForm.errors;
      if (errors &&errors['invalidIdentification']) {
        this.cargando = false; 
        console.error('Por favor, complete el ID de Afiliación, o el Nombre junto con el Email o Teléfono.');
        alert('Por favor, complete el ID de Afiliación, o el Nombre junto con el Email o Teléfono.');
      }
      if (errors && errors['invalidSelection']) {
        this.cargando = false; 
        console.error('Por favor, seleccione una provincia y un deporte.');
        alert('Es obligatorio seleccionar una provincia y un deporte para crear el reporte.');
      }
    }
  }

  cargarDeportesComboBox() {
    this.deportesService.getDeportes().subscribe(deportes => {
      this.deportes = deportes;
    })
  }

  cargarProvinciasComboBox() {
    this.provinciasService.getProvincias().subscribe(provincias => {
      this.provincias = provincias;
    })
  }
}
