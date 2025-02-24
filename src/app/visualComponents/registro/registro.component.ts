import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AfiliadosFuncionDto } from '../../Core/Model/AfiliadosFuncionDto';
import { AfiliadosFuncionServiceImpl } from '../../Core/Service/Implements/AfiliadosFuncionServiceImpl';
import { UsuarioRolServiceImpl } from '../../Core/Service/Implements/UsuarioRolServiceImpl';
import { DeporteServiceImpl } from '../../Core/Service/Implements/DeporteServiceImpl';
import { UsuariosDto } from '../../Core/Model/UsuariosDto';
import { DeportesDto } from '../../Core/Model/DeportesDto';
import { UsuariosRolDto } from '../../Core/Model/UsuariosRolDto';
import { AfiliadosCategoriasDto } from '../../Core/Model/AfiliadosCategoriasDto';
import { ProvinciaDto } from '../../Core/Model/ProvinciaDto';
import { LocalidadDto } from '../../Core/Model/LocalidadDto';
import { ProvinciasServiceImpl } from '../../Core/Service/Implements/ProvinciasServiceImpl';
import { LocalidadServiceImpl } from '../../Core/Service/Implements/LocalidadServiceImpl';
import { AfiliadosCategoriasServiceImpl } from '../../Core/Service/Implements/AfiliadosCategoriasServiceImpl';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { FederacionDto } from '../../Core/Model/FederacionDto';
import { FederacionServiceImpl } from '../../Core/Service/Implements/FederacionServiceImpl';
import { TipoDocumentoDto } from '../../Core/Model/TipoDocumentoDto';
import { TipoDocumentacionServiceImpl } from '../../Core/Service/Implements/TipoDocumentacionServiceImpl';
import { PaymentService } from '../../Core/Service/PaymentService';
import { OriginInterceptor } from '../../Core/OriginInterceptor';
import { PROVINCIAS } from '../../constants/provinces';
import { CATEGORIAS } from '../../constants/afiliadoscategoria';
import { DEPORTES } from '../../constants/deportes';
import { FUNCIONES } from '../../constants/afiliadosFunciones';
import { SendEmailServiceImpl } from '../../Core/Service/Implements/SendEmailServiceImpl';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OriginInterceptor,
      multi: true,
    },
    AfiliadosFuncionServiceImpl,
    UsuarioRolServiceImpl,
    DeporteServiceImpl,
    ProvinciasServiceImpl,
    LocalidadServiceImpl,
    AfiliadosCategoriasServiceImpl,
    UsuariosServiceImpl,
    FederacionServiceImpl,
    TipoDocumentacionServiceImpl,
    PaymentService,
    SendEmailServiceImpl,
    FormBuilder,
    Router,
  ],
  imports: [
CommonModule,ReactiveFormsModule    ],
})
export class RegistroComponent {
  emailExists = false;
  hide = true;
  registroForm: FormGroup;
  afiliadosFunciones: AfiliadosFuncionDto[] = FUNCIONES;
  usuariosRoles?: UsuariosRolDto[];
  deportes: DeportesDto[] = DEPORTES;
  categorias: AfiliadosCategoriasDto[] = CATEGORIAS;
  provincias: ProvinciaDto[] = PROVINCIAS;
  tiposDocumentaciones = [
    { id: 1, descripcion: 'DNI' },
    { id: 2, descripcion: 'NIE' },
    { id: 3, descripcion: 'Pasaporte' },
  ];
  localidades?: LocalidadDto[];
  federaciones?: FederacionDto[];
  filteredLocalidades?: LocalidadDto[];
  filteredfederacionesList?: Observable<FederacionDto[]>;
  selected = '';
  selectedafiliadosCategoria = '';
  selectedTipoDocumento = '';
  selectedLocalidad = '';
  selectedProvincia = '';
  selectedDeporte = '';
  selectedFuncion = '';
  usuarioRegistrado?: UsuariosDto;
  mostrarFormulario = false;
  selectedUsuariorol = '';
  filteredDeportes?: DeportesDto[];
  afiliadosCategoria?: FormControl;
  isLoading = false;
  newDeporteName = '';
  formaPagosList = [
    { id: 1, descripcion: 'Tarjeta de Crédito' },
    { id: 2, descripcion: 'Bizum' },
    { id: 3, descripcion: 'Transferencia Bancaria' },
    { id: 4, descripcion: 'Caja' },
  ];
  filteredOptions?: Observable<string[]>;
  selectedFormaPago = '';
  selectedSituacionActual = '';
  activo = 'Activo';
  ex = 'Ex';

  // Objeto de mapeo de claves técnicas a nombres legibles
  camposLegibles: { [key: string]: string } = {
    apellidos: 'Apellidos',
    nombre: 'Nombre',
    documento: 'Número de Documentación',
    fechaNacimiento: 'Fecha de Nacimiento',
    tipoDocumento: 'Tipo de Documentación',
    direccion: 'Dirección',
    codigoPostal: 'Código Postal',
    localidad: 'Localidad',
    provincia: 'Provincia',
    correo: 'Email',
    telefono: 'Teléfono',
    deporte: 'Deporte',
    afiliadosFuncion: 'Actividad',
    afiliadosCategoria: 'Categoría',
    tipoPago: 'Forma de Pago',
    situacionActual: 'Situación Actual',
    // Agrega aquí los nombres legibles para los demás campos del formulario
  };

  private formBuilder = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private afiliadosFuncionService = inject(AfiliadosFuncionServiceImpl);
  private categoriasAfiliadosService = inject(AfiliadosCategoriasServiceImpl);
  private usuariosRolService = inject(UsuarioRolServiceImpl);
  private provinciasService = inject(ProvinciasServiceImpl);
  private localidadService = inject(LocalidadServiceImpl);
  private usuariosService = inject(UsuariosServiceImpl);
  private deportesService = inject(DeporteServiceImpl);
  private federacionService = inject(FederacionServiceImpl);
  private tipoDocumentacionService = inject(TipoDocumentacionServiceImpl);
  private router = inject(Router);
  private http = inject(HttpClient);

  

  constructor() {
    this.registroForm = this.formBuilder.group({
      apellidos: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      tipoDocumento: [this.tiposDocumentaciones[0].id],
      direccion: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.pattern('[0-9]*'), this.onlyNumbersValidator]],
      localidad: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]*'), this.onlyNumbersValidator, Validators.maxLength(9), Validators.minLength(9)]],
      deporte: ['', [Validators.required]],
      afiliadosFuncion: ['', [Validators.required]],
      afiliadosCategoria: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      tipoPago: ['', [Validators.required]],
      situacionActual: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });

    this.registroForm.get('tipoPago')?.valueChanges.subscribe(value => {
      this.selectedFormaPago = value;
    });
  }



  ngOnInit() {
    this.cargarFuncionesDeAfiliadosComboBox();
    this.cargarDeportesComboBox();
    this.cargarRolesDeUsuariosComboBox();
    this.cargarProvinciasComboBox();
    this.cargarLocalidadesComboBox();
    //this.cargarCategoriasDeAfiliadosComboBox();
    this.cargarFederacionesComboBox();
    this.cargarTiposDocumentacionComboBox();
  }

  onEmailChange() {
    const email = this.registroForm.get('correo')?.value;
    if (email) {
      this.usuariosService.validateEmail(email).subscribe(
        exists => {
          this.emailExists = exists;
          if (exists) {
            this.registroForm.get('correo')?.setErrors({ emailExists: true });
          } else {
            this.registroForm.get('correo')?.setErrors(null);
          }
        }
      );
    }
  }
  onDeporteInput(): void {
    const inputValue = this.registroForm.get('deporte')?.value;
    if (inputValue) {
      this.filteredDeportes = this.deportes.filter(deporte =>
        deporte.nombre.toLowerCase().includes(inputValue.toLowerCase())
      );
    } else {
      this.filteredDeportes = [];
    }
  }

  searchDeporte = (text: string) => {
    return this.deportes?.filter(deporte => deporte.nombre.toLowerCase().includes(text.toLowerCase()));
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  cargarFuncionesDeAfiliadosComboBox() {

    /*
    this.afiliadosFuncionService.getAfiliadosFuncion().subscribe(afiliadosRoles => {
      this.afiliadosFunciones = afiliadosRoles;
      console.log(afiliadosRoles);
    })*/
  }

  cargarCategoriasDeAfiliadosComboBox() {

    this.categoriasAfiliadosService.getAfiliadosCategorias().subscribe(afiliadosCategorias => {
      this.categorias = afiliadosCategorias;
    })
  }

  cargarRolesDeUsuariosComboBox() {

    this.usuariosRolService.getUsuariosRoles().subscribe(usuariosRoles => {
      this.usuariosRoles = usuariosRoles;
    })
  }

  cargarDeportesComboBox() {

    this.deportesService.getDeportes().subscribe(deportes => {
      this.deportes = deportes;
    })
  }

  cargarProvinciasComboBox() {

    /*
    this.provinciasService.getProvincias().subscribe(provincias => {
      this.provincias = provincias;
    })*/

  }

  cargarTiposDocumentacionComboBox() {

    this.tipoDocumentacionService.getTipoDocumentacion().subscribe(tiposDocumentaciones => {
      this.tiposDocumentaciones = tiposDocumentaciones;
    })
  }

  cargarLocalidadesComboBox() {
    /*
        this.localidadService.getLocalidades().subscribe(localidades => {
          this.localidades = localidades;
        })*/

  }

  cargarFederacionesComboBox() {

    this.federacionService.getFederaciones().subscribe(federaciones => {
      this.federaciones = federaciones;
    })
  }

  onRegistro() {
    this.registroForm.removeControl('confirmPassword');
    this.registroForm.removeControl('password');

    if (this.registroForm.valid && this.emailExists !== true) {

      this.isLoading = true;

      const datosFormulario = this.registroForm.value;
     
      if (typeof this.provincias !== 'undefined') {
        const provinciasObject = this.provincias.find(loc => loc.id === Number(datosFormulario.provincia));
        if (provinciasObject) {
          datosFormulario.provincia = provinciasObject;
        }
      }
      if (typeof this.deportes !== 'undefined') {
        this.deportesService.getDeportes().subscribe(deportes => {
          this.deportes = deportes;
        })
        const deportesObject = this.deportes.find(loc => loc.nombre === datosFormulario.deporte);
        if (deportesObject) {
          datosFormulario.deporte = deportesObject;
        }
        else {
          var deporteDto: DeportesDto = {
            id: 0, 
            nombre: datosFormulario.deporte
          };
          datosFormulario.deporte = deporteDto;
          
        }
      }
        if (typeof this.tiposDocumentaciones !== 'undefined') {
          const tipoDocumentacionObject = this.tiposDocumentaciones.find(loc => loc.id === datosFormulario.tipoDocumento);
          if (tipoDocumentacionObject) {
            datosFormulario.tipoDocumento = tipoDocumentacionObject;
          }
        }
        if (typeof this.afiliadosFunciones !== 'undefined') {
          const afiliadosFuncionObject = this.afiliadosFunciones.find(loc => loc.id === Number(datosFormulario.afiliadosFuncion));
          if (afiliadosFuncionObject) {
            datosFormulario.afiliadosFuncion = afiliadosFuncionObject;
          }
        }
        if (typeof this.formaPagosList !== 'undefined') {
          const formaPagoObject = this.formaPagosList.find(loc => loc.id === datosFormulario.tipoPago);
          
          if (formaPagoObject) {
            datosFormulario.tipoPago = formaPagoObject;
          }
        }
        if (typeof this.categorias !== 'undefined') {
          const categoriasFuncionObject = this.categorias.find(loc => loc.id === Number(datosFormulario.afiliadosCategoria));
        
          if (categoriasFuncionObject) {
            datosFormulario.afiliadosCategoria = categoriasFuncionObject;
          }
        }
        datosFormulario.usuariorol = { id: "3", descripcion: "afiliados" };
        if (typeof this.formaPagosList !== 'undefined') {
          const tipoPagoObject = this.formaPagosList.find(loc => loc.id === datosFormulario.tipoPago);
      
          if (tipoPagoObject) {
            datosFormulario.tipoPago = tipoPagoObject;
          }
        }
        if (typeof this.tiposDocumentaciones !== 'undefined') {
          const tipoDocumentoObject = this.tiposDocumentaciones.find(loc => loc.id === Number(datosFormulario.tipoDocumento));
      
          if (tipoDocumentoObject) {
            datosFormulario.tipoDocumento = tipoDocumentoObject;
          }
        }
        this.usuariosService.saveOrUpdate(datosFormulario).subscribe(
          response => {
        
            this.usuarioRegistrado = response;
            this.usuariosService.setUsuario(response);
            if (datosFormulario.tipoPago.id === 1 || datosFormulario.tipoPago.id === 2) {
              //PAGO POR TARGETA DE CREDITO O BIZUM
              this.paymentService.pay(datosFormulario.tipoPago.id, response.idAfiliacion);
              this.isLoading = false;
            }
            else {
              this.mostrarFormulario = true;
              this.isLoading = false;
              this.router.navigate(['/formulario']);
            }
          },
          error => {
            this.isLoading = false;
            this.router.navigate(['/alert-safari']);
          }
        );
      }
      else {
        // Identificar y mostrar el primer campo inválido
        const campoInvalido = Object.keys(this.registroForm.controls).find(key => this.registroForm.get(key)?.invalid);
        if (campoInvalido && this.camposLegibles[campoInvalido]) {
          const nombreCampo = this.camposLegibles[campoInvalido];
          Swal.fire({
            title: 'Error!',
            text: `El campo " ${nombreCampo} " tiene error o esta vacio.`,
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        } 
        else {
          Swal.fire({
            title: 'Error!',
            text: 'El formulario no es válido, Debe completar todos los datos de caracter obligatorios(*) o el correo ya existe.',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
      }
    }
    onlyNumbersValidator(control: AbstractControl): { [key: string]: any } | null {
      const inputValue: string = control.value;
      if (!/^\d+$/.test(inputValue)) {
        return { 'onlyNumbers': true };
      }
      return null;
    }

    updateLocalidades() {
      console.log("SELECCION PROVINCIA: ", this.registroForm.value.afiliadosCategoria)
      //this.registroForm.value.localidad.id=this.registroForm.value.provincia.id
      const provinciaId = Number(this.registroForm.value.provincia); // Convertir el valor a número
      this.filteredLocalidades = this.localidades?.filter(loc => loc.id === provinciaId);
      console.info("Localidad", this.filteredLocalidades)
    }

    seleccionarDeporte(deporte: DeportesDto) {
      this.registroForm.get("deporte")?.setValue(deporte.nombre);
      this.filteredDeportes = [];
    }

    filterDeportes(event : Event){
      this.filteredDeportes = this.deportes?.slice();
      const filtro = (event?.target as HTMLInputElement).value;
      if (filtro) {
        const filterValue = filtro.toLowerCase();
        this.filteredDeportes = this.deportes?.filter(option => option.nombre.toLowerCase().includes(filterValue));
        this.filterDeportes.length
      } else {
        this.filteredDeportes = this.deportes?.slice(); // Si no hay valor, muestra todos los deportes
      }
    }

    realizarPago() {
      const datosPago = {
        Ds_Merchant_MerchantCode: '363273228',
        Ds_Merchant_Terminal: '1',
        Ds_Merchant_Currency: '978',
        Ds_Merchant_Amount: '1000', // Monto del pago en céntimos (en este caso 10 euros)
        Ds_Merchant_Order: this.generarNumeroPedido()
      };

      // Enviar los datos al servidor para procesar el pago
      this.http.post<string>('http://localhost:8080/procesar_pago', datosPago)
        .subscribe(
          (redirectUrl) => {
            // Redirigir al formulario de pago de Redsys
            window.location.href = redirectUrl;
          },
          (error) => {
            console.error('Error al procesar el pago:', error);
          }
        );
    }

    generarNumeroPedido(): string {
      // Generar un número de pedido único
      return 'PEDIDO_' + Math.random().toString(36).substr(2, 9);
    }
  }



