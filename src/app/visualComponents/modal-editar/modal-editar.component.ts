import { Component, Inject, Input, inject } from '@angular/core';
import { AfiliadosFuncionServiceImpl } from '../../Core/Service/Implements/AfiliadosFuncionServiceImpl';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AfiliadosCategoriasServiceImpl } from '../../Core/Service/Implements/AfiliadosCategoriasServiceImpl';
import { UsuarioRolServiceImpl } from '../../Core/Service/Implements/UsuarioRolServiceImpl';
import { ProvinciasServiceImpl } from '../../Core/Service/Implements/ProvinciasServiceImpl';
import { LocalidadServiceImpl } from '../../Core/Service/Implements/LocalidadServiceImpl';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { DeporteServiceImpl } from '../../Core/Service/Implements/DeporteServiceImpl';
import { TipoDocumentacionServiceImpl } from '../../Core/Service/Implements/TipoDocumentacionServiceImpl';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AfiliadosCategoriasDto } from '../../Core/Model/AfiliadosCategoriasDto';
import { AfiliadosFuncionDto } from '../../Core/Model/AfiliadosFuncionDto';
import { DeportesDto } from '../../Core/Model/DeportesDto';
import { FederacionDto } from '../../Core/Model/FederacionDto';
import { LocalidadDto } from '../../Core/Model/LocalidadDto';
import { ProvinciaDto } from '../../Core/Model/ProvinciaDto';
import { TipoDocumentoDto } from '../../Core/Model/TipoDocumentoDto';
import { UsuariosDto } from '../../Core/Model/UsuariosDto';
import { UsuariosRolDto } from '../../Core/Model/UsuariosRolDto';
import { FederacionServiceImpl } from '../../Core/Service/Implements/FederacionServiceImpl';

import { RouterLink } from '@angular/router';
import { EstadosUsuariosDto } from '../../Core/Model/EstadosUsuariosDto';
import { EstadoUsuariosServiceImpl } from '../../Core/Service/Implements/EstadoUsuariosServiceImpl';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../Core/Service/Implements/DataService';
import { ConstantPool } from '@angular/compiler';
import { CuestionarioServiceImpl } from '../../Core/Service/Implements/CuestionarioServiceImpl';

@Component({
  selector: 'app-modal-editar',
  templateUrl: './modal-editar.component.html',
  styleUrls: ['./modal-editar.component.css']
})
export class ModalEditarComponent {



  hide: boolean = true;
  registroForm: FormGroup;
  afiliadosFunciones: AfiliadosFuncionDto[] | undefined;
  usuariosRoles: UsuariosRolDto[] | undefined;
  estadosUsuariosList: EstadosUsuariosDto[] | undefined;
  deportes: DeportesDto[] | undefined;
  categorias: AfiliadosCategoriasDto[] | undefined;
  provincias: ProvinciaDto[] | undefined;
  tiposDocumentaciones: TipoDocumentoDto[] | undefined;
  localidades: LocalidadDto[] | undefined;
  federaciones: FederacionDto[] | undefined;
  filteredLocalidades: LocalidadDto[] | undefined;
  filteredfederacionesList: Observable<FederacionDto[]> | undefined;
  selected = '';
  selectedafiliadosCategoria = '';
  selectedLocalidad = '';
  selectedProvincia = '';
  selectedDeporte = '';
  selectedFuncion = '';
  usuarioRegistrado: UsuariosDto | undefined;
  mostrarFormulario: boolean = false;
  selectedUsuariorol = '';
  filteredDeportes: DeportesDto[] | undefined;;
  newDeporteName = '';
  opciones: string[] = ['Alejandro', 'Alexander', 'Alejandra', 'Alicia', 'Alberto'];
  formaPagosList = [{ "id": 1, "descripcion": "Targeta de Crédito" }, { "id": 2, "descripcion": "Bizum" }, { "id": 3, "descripcion": "Transferencia Bancaria" }, { "id": 4, "descripcion": "Caja" }];
  filteredOptions: Observable<string[]> | undefined;
  selectedFormaPago = '';
  selectedSituacionActual = '';
  activo = "Activo";
  ex = "Ex";
  selectedEstadoUsuario = '';
  showPasswordFields: boolean = false;
  isLoading = false;


  @Input() data: any;

  private dataService = inject(DataService);
  private estadosUsuariosService = inject(EstadoUsuariosServiceImpl);
  private cuestionarioService = inject(CuestionarioServiceImpl);
  private tipoDocumentacionService = inject(TipoDocumentacionServiceImpl);
  private federacionService = inject(FederacionServiceImpl);
  private deportesService = inject(DeporteServiceImpl);
  private usuariosService = inject(UsuariosServiceImpl);
  private localidadService = inject(LocalidadServiceImpl);
  private provinciasService = inject(ProvinciasServiceImpl);
  private usuariosRolService = inject(UsuarioRolServiceImpl);
  private categoriasAfiiadosService = inject(AfiliadosCategoriasServiceImpl);
  private afiliadosFuncionService = inject(AfiliadosFuncionServiceImpl);


  //@Inject(MAT_DIALOG_DATA) public data: any,
  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    public activeModal: NgbActiveModal) {
    this.registroForm = this.formBuilder.group({});
  }



  ngOnInit() {
    console.log("Fecha Afiiacion:" + this.data.fechaAfiliacion);
    this.registroForm = this.formBuilder.group({
      id_user: [this.data.id_user, [Validators.required]],
      apellidos: [this.data.apellidos, [Validators.required]],
      nombre: [this.data.nombre, [Validators.required]],
      documento: [this.data.documento, [Validators.required]],
      fechaNacimiento: [this.data.fechaNacimiento, [Validators.required]],
      tipoDocumento: [this.data.tipoDocumento, [Validators.required]],
      direccion: [this.data.direccion, [Validators.required]],
      codigoPostal: [this.data.codigoPostal, [Validators.required, Validators.pattern('[0-9]*')]],
      localidad: [this.data.localidad, [Validators.required]],
      provincia: [this.data.provincia, [Validators.required]],
      correo: [this.data.correo, [Validators.required, Validators.email]],
      telefono: [this.data.telefono, [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(9), Validators.minLength(9)]],
      deporte: [this.data.deporte, [Validators.required]],
      afiliadosFuncion: [this.data.afiliadosFuncion, [Validators.required]],
      afiliadosCategoria: [this.data.afiliadosCategoria, [Validators.required]],
      password: [this.data.password, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [this.data.password, [Validators.required, Validators.minLength(6)]],
      usuariorol: ['', [Validators.required]],
      tipoPago: [this.data.tipoPago, [Validators.required]],
      estadoCuenta: ['', [Validators.required]],
      situacionActual: [this.data.situacionActual, [Validators.required]],
      idAfiliacion: [this.data.idAfiliacion, [Validators.required]],
      fechaAfiliacion: [this.data.fechaAfiliacion, [Validators.required]],
    }, { validators: this.passwordMatchValidator });
    console.log('Valor de usuariorol:', this.data.usuariorol.id);

    this.cargarFuncionesDeAfiliadosComboBox();
    this.cargarDeportesComboBox();
    this.cargarRolesDeUsuariosComboBox();
    this.cargarProvinciasComboBox();
    this.cargarLocalidadesComboBox();
    this.cargarCategoriasDeAfiliadosComboBox();
    this.cargarFederacionesComboBox();
    this.cargarTiposDocumentacionComboBox();
    this.cargarEstadosUsuariosComboBox();
    this.filteredDeportes = this.deportes?.slice();
    this.registroForm.patchValue({
      usuariorol: this.data.usuariorol?.id,
      estadoCuenta: this.data.estadoCuenta?.id,
    });
    this.checkRoleAndStatus();

  }

  checkRoleAndStatus() {
    const selectedRole = this.registroForm.get('usuariorol')?.value;
    const selectedStatus = this.registroForm.get('estadoCuenta')?.value;
    console.log("rol", selectedRole)
    console.log("estado", selectedStatus)
    // Define the IDs of the roles that should enable the password fields
    const rolesRequiringPassword: string | any[] = [2, 4, 6, 7];//Administrador, comisionado, presidente secretaria, presidente
    const activeStatus = 1; // Assuming 'activo' status has ID 1

    this.showPasswordFields = rolesRequiringPassword.includes(selectedRole) && selectedStatus === activeStatus;

    if (this.showPasswordFields) {
      this.registroForm.get('password')?.enable();
      this.registroForm.get('confirmPassword')?.enable();
    } else {
      this.registroForm.get('password')?.disable();
      this.registroForm.get('confirmPassword')?.disable();
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

    this.afiliadosFuncionService.getAfiliadosFuncion().subscribe(afiliadosRoles => {
      this.afiliadosFunciones = afiliadosRoles;
    })
  }

  cargarEstadosUsuariosComboBox() {

    this.estadosUsuariosService.getAllEstadosUsuarios().subscribe(usuariosEstados => {
      this.estadosUsuariosList = usuariosEstados;
    })
  }

  cargarCategoriasDeAfiliadosComboBox() {

    this.categoriasAfiiadosService.getAfiliadosCategorias().subscribe(afiliadosCategorias => {
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

    this.provinciasService.getProvincias().subscribe(provincias => {
      this.provincias = provincias;
    })
  }

  cargarTiposDocumentacionComboBox() {

    this.tipoDocumentacionService.getTipoDocumentacion().subscribe(tiposDocumentaciones => {
      this.tiposDocumentaciones = tiposDocumentaciones;
    })
  }

  cargarLocalidadesComboBox() {

    this.localidadService.getLocalidades().subscribe(localidades => {
      this.localidades = localidades;
    })
  }

  cargarFederacionesComboBox() {

    this.federacionService.getFederaciones().subscribe(federaciones => {
      this.federaciones = federaciones;
    })
  }



  onRegistro() {

    if (this.registroForm.valid) {
      this.isLoading = true;
      this.registroForm.removeControl('confirmPassword');
      const datosFormulario = this.registroForm.value;
      // Llamar al servicio de la API para enviar los datos
      console.info(datosFormulario)
      // Setteo de los datos de los oject foraneos de usuarios
      // Localidades
      // Provincias
      if (typeof this.provincias !== 'undefined') {
        const provinciasObject = this.provincias.find(loc => loc.id === datosFormulario.provincia);
        console.info(provinciasObject)
        if (provinciasObject) {
          datosFormulario.provincia = provinciasObject;
        }
      }
      // Deportes
      if (typeof this.deportes !== 'undefined') {
        const deportesObject = this.deportes.find(loc => loc.id === datosFormulario.deporte);
        console.info(deportesObject)
        if (deportesObject) {
          datosFormulario.deporte = deportesObject;
        }
      }
      //tipo de Documentacion
      if (typeof this.tiposDocumentaciones !== 'undefined') {
        const tipoDocumentacionObject = this.tiposDocumentaciones.find(loc => loc.id === datosFormulario.tipoDocumento);
        console.info(tipoDocumentacionObject)
        if (tipoDocumentacionObject) {
          datosFormulario.tipoDocumento = tipoDocumentacionObject;
        }
      }
      // AfiliacionFunciones
      if (typeof this.afiliadosFunciones !== 'undefined') {
        const afiliadosFuncionObject = this.afiliadosFunciones.find(loc => loc.id === datosFormulario.afiliadosFuncion);
        console.info(afiliadosFuncionObject)
        if (afiliadosFuncionObject) {
          datosFormulario.afiliadosFuncion = afiliadosFuncionObject;
        }
      }
      // forma pago
      if (typeof this.formaPagosList !== 'undefined') {
        const formaPagoObject = this.formaPagosList.find(loc => loc.id === datosFormulario.tipoPago);
        console.info(formaPagoObject)
        if (formaPagoObject) {
          datosFormulario.tipoPago = formaPagoObject;
        }
      }
      // AfiliacionCategorias
      if (typeof this.categorias !== 'undefined') {
        const categoriasFuncionObject = this.categorias.find(loc => loc.id === datosFormulario.afiliadosCategoria);
        console.info(categoriasFuncionObject)
        if (categoriasFuncionObject) {
          datosFormulario.afiliadosCategoria = categoriasFuncionObject;
        }
      }
      //asigancion de tipo de pago
      if (typeof this.formaPagosList !== 'undefined') {
        const tipoPagoObject = this.formaPagosList.find(loc => loc.id === datosFormulario.tipoPago);
        console.info(tipoPagoObject)
        if (tipoPagoObject) {
          datosFormulario.tipoPago = tipoPagoObject;
        }
      }

      //asigancion de tipo de documento
      if (typeof this.tiposDocumentaciones !== 'undefined') {
        const tipoDocumentoObject = this.tiposDocumentaciones.find(loc => loc.id === datosFormulario.tipoDocumento);
        console.info(tipoDocumentoObject)
        if (tipoDocumentoObject) {
          datosFormulario.tipoDocumento = tipoDocumentoObject;
        }
      }
      //Asignacion estado usuario
      if (typeof this.estadosUsuariosList !== 'undefined') {
        const estadoUsuarioObject = this.estadosUsuariosList.find(loc => loc.id === Number(datosFormulario.estadoCuenta));
        console.info(estadoUsuarioObject)
        if (estadoUsuarioObject) {
          datosFormulario.estadoCuenta = estadoUsuarioObject;
        }
        else {
          datosFormulario.estadoCuenta = this.data.estadoCuenta;
          console.info('Datos usuarioRol por defecto:', datosFormulario.estadoCuenta)
        }
      }
      //Asignacion de usuario rol 

      if (typeof this.usuariosRoles !== 'undefined') {
        const usuariosRoleObject = this.usuariosRoles.find(loc => loc.id === Number(datosFormulario.usuariorol));
        console.info('Datos usuarioRol:', usuariosRoleObject)
        if (usuariosRoleObject) {
          datosFormulario.usuariorol = usuariosRoleObject;
        }
        else {
          datosFormulario.usuariorol = this.data.usuariorol;
          console.info('Datos usuarioRol por defecto:', datosFormulario.usuariorol)
        }
      }

      //Asignacion de id_afiliacion 
      datosFormulario.idAfiliacion = this.data.idAfiliacion;
      console.info('Datos idAfiliacion por defecto:', datosFormulario.idAfiliacion)
      if (datosFormulario.password === undefined) {
        this.registroForm.removeControl('password');
      }
      console.info(datosFormulario)
      this.usuariosService.saveOrUpdate(datosFormulario).subscribe(
        response => {
          this.isLoading = false;
          console.log('Datos registrados con éxito:', response);
          // Aquí puedes agregar cualquier otra lógica después de enviar los datos
          this.usuarioRegistrado = response;
          this.activeModal.close('Close click')
          this.dataService.updateData();
          console.log('Valor formulario:', this.mostrarFormulario);
        },
        error => {
          console.error('Error al registrar los datos:', error);
          // Manejo de errores
        }
      );
    }
    else {
      // El formulario no es válido, puedes mostrar un mensaje de error o realizar otra acción
      console.error('Formulario no válido. Revise los campos.');
      console.log('Estado del formulario:', this.registroForm);
      console.log('Campos inválidos:', this.registroForm.controls);
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        if (control?.invalid) {
          console.error(`Campo inválido: ${key}, errores:`, control.errors);
        }
      });
    }
  }

  onlyNumbersValidator(control: AbstractControl): { [key: string]: any } | null {
    const inputValue: string = control.value;
    if (!/^\d+$/.test(inputValue)) {
      return { 'onlyNumbers': true };
    }
    return null;
  }

  updateLocalidades(provinciaId: number) {
    this.filteredLocalidades = this.localidades?.filter(localidad => localidad.idProvincia.id === provinciaId);
  }



  filterDeportes(value: string) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filteredDeportes = this.deportes?.filter(option => option.nombre.toLowerCase().includes(filterValue));
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

