
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { UsuariosDto } from '../../Core/Model/UsuariosDto';
import { DeporteServiceImpl } from '../../Core/Service/Implements/DeporteServiceImpl';
import { DeportesDto } from '../../Core/Model/DeportesDto';
import { CuestionarioServiceImpl } from '../../Core/Service/Implements/CuestionarioServiceImpl';
import { Router } from '@angular/router';
import { DEPORTES } from '../../constants/deportes';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  standalone: true,
  imports: []
})
export  class FormularioComponent implements OnInit{

  @Input() usuario: UsuariosDto | undefined;
  idAfiliacionExists: boolean = false;
  isLoading = false;
  formularioForm: FormGroup;
  deportes: DeportesDto[] = DEPORTES;
  selectedDeporte : any;
  selectedcolaboracion : boolean | undefined;
  idiomasLista: { id: number, descripcion: string }[] = [
    { id: 1, descripcion: 'Inglés' },
    { id: 2, descripcion: 'Alemán' },
    { id: 3, descripcion: 'Francés' },
    { id: 4, descripcion: 'Español' },
    { id: 5, descripcion: 'Italiano' },
    { id: 6, descripcion: 'Portugués' },
    { id: 7, descripcion: 'Neerlandés (Holandés)' },
    { id: 8, descripcion: 'Polaco' },
    { id: 9, descripcion: 'Sueco' },
    { id: 10, descripcion: 'Danés' },
    { id: 11, descripcion: 'Griego' },
    { id: 12, descripcion: 'Checo' },
    { id: 13, descripcion: 'Rumano' },
    { id: 14, descripcion: 'Húngaro' },
    { id: 15, descripcion: 'Finlandés' },
    { id: 16, descripcion: 'Eslovaco' },
    { id: 17, descripcion: 'Búlgaro' },
    { id: 18, descripcion: 'Croata' },
    { id: 19, descripcion: 'Esloveno' },
    { id: 20, descripcion: 'Lituano' }
  ];
  private formBuilder = inject(FormBuilder);
  private deportesService = inject(DeporteServiceImpl);
  private cuestionarioService = inject(CuestionarioServiceImpl);
  private usuariosService = inject(UsuariosServiceImpl);
  private router = inject(Router);

  constructor(
  ){
    console.log('Datos del usuario:', this.usuario);
    this.formularioForm = this.formBuilder.group({
      nombreApellidos: [this.usuario?.apellidos, [Validators.required]],//tomar de los datos de usuario
      localidad: [this.usuario?.localidad, [Validators.required]],//toar de los datos del usuario
      telefono: [this.usuario?.telefono, [Validators.required]],//tomar de los datos de usuario
      correo: [this.usuario?.correo,[Validators.required]],//tomar de los datos de usuario
      profesionLaboral: ['', [Validators.required]],
      situacionActual: ['', [Validators.required]],
      deporte: ['', [Validators.required]],//dar opcion de dado un deporte elegido , seleccione la categoria y los años de participacion 
      anosActivoCategorias: ['', [Validators.required]],//dar opcion de dado un deporte elegido , seleccione la categoria y los años de participacion
      otrasActividades: ['', [Validators.required]],
      colaborarAsociacion: ['true', Validators.required],//buscar para guardar valor si o no 
      tipoColaboracion: new FormControl({ value: '', disabled: true }, Validators.required),//a partir del valor elegido antes, dar opcion de entrar datos de que le gustaria colaborar
      comisionColaboracion: ['', [Validators.required]],//dar opocion de elegir comisiones en las que le gustaria colaborar
      idiomas: ['Español', Validators.required],//guardar listado de idiomas
      tiempoLibre: ['', [Validators.required]],//buscar para guardar valor si o no 
      desplazamiento: ['', [Validators.required]],//buscar para guardar valor si o no 
      delegacionColaboracion: ['', [Validators.required]],//buscar para guardar valor si o no y una descripcion de lo que quiere
      darClases: [{ value: '', disabled: true }, [Validators.required]],//buscar para guardar valor si o no y una descripcion de lo que quiere
      selectedDarClases: ['false', [Validators.required]],//buscar para guardar valor si o no 
      organizarEventosDeportivos: ['', [Validators.required]],//buscar para guardar valor si o no 
      reunionesAsociacion: ['', [Validators.required]],//buscar para guardar valor si o no 
      mediador: ['', [Validators.required]],//buscar para guardar valor si o no 
      ayudaAgresiones: ['', [Validators.required]],//buscar para guardar valor si o no 
      opinionAsociacion: ['', [Validators.required]],//buscar para guardar valor si o no 
      mejorasAsociacion: ['', [Validators.required]],
      idAfiliacion: ['', [Validators.required]],
      usuarioDto: [this.usuario],
      
      
    });
  }

  ngOnInit() {
    this.cargarDeportesComboBox();
    //Habilitación de ccomponent de colaboración
    this.formularioForm.get('colaborarAsociacion')?.valueChanges.subscribe(value => {
      if (value === "true") {
        this.formularioForm.get('tipoColaboracion')?.enable(); // Habilita el campo
      } else {
        this.formularioForm.get('tipoColaboracion')?.disable(); // Deshabilita el campo
      }
    });
    //Habilitación de ccomponent de dar clases
    this.formularioForm.get('selectedDarClases')?.valueChanges.subscribe(value => {
      if (value === "true") {
        this.formularioForm.get('darClases')?.enable(); // Habilita el campo
      } else {
        this.formularioForm.get('darClases')?.disable(); // Deshabilita el campo
      }
    });
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuario']) {
      console.log('Usuario recibido:', this.usuario);
    }
  }

  cargarDeportesComboBox() {

    this.deportesService.getDeportes().subscribe(deportes => {
      this.deportes = deportes;
    })
  }

  onIdAfiliacionChange() {
    const idAfi = this.formularioForm.get('idAfiliacion')?.value;
    if (idAfi) {
      this.usuariosService.validateIDAfiliacion(idAfi).subscribe(
        exists => {
          this.idAfiliacionExists = exists;
          if (exists) {

            //this.formularioForm.get('idAfiliacion')?.setErrors({ idNotExists: true });
          } else {
            this.formularioForm.get('idAfiliacion')?.setErrors({ idNotExists: true });
            //this.formularioForm.get('idAfiliacion')?.setErrors(null);
          }
        }
      );
    }
  }

  onRegistrarFormulario() {
    this.isLoading = true;
    const datosFormulario = this.formularioForm.value;
    datosFormulario.usuarioDto = this.usuario;
    console.info('Datos usuario de cuestionario:',datosFormulario.usuarioDto)
    console.info('Datos a registrar:',datosFormulario)
    this.cuestionarioService.saveOrUpdate(datosFormulario).subscribe(
      response => {
        this.isLoading = false;
        console.log('Success!', response);
        console.log('Datos registrados con éxito:', response);
        this.router.navigate(['/home']); 
        // Aquí puedes agregar cualquier otra lógica después de enviar los datos
      },
      error => {
        this.isLoading = false;
        console.error('Error!', error);
        console.error('Error al registrar los datos:', error);
        alert('Debe introducir su número de afiliación para poder enviar su cuestionario. Si no le encuetra, dirijase a su correo de bienvenida. Muchas Gracias');
        // Manejo de errores
      }
    );
  }
}
