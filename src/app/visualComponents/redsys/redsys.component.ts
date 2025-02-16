import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../Core/Service/PaymentService';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { environment } from '../../../environments/environment';
import { OriginRequest } from '../../Core/Service/Implements/OriginRequest';


@Component({
  selector: 'app-redsys',
  templateUrl: './redsys.component.html',
  styleUrls: ['./redsys.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export  class RedsysComponent {

  selectedTipoDocumento="Tipo de Documento";
   usuario = {
  "id_user": 36,
  "nombre": "ccc",
  "apellidos": "Cuestionarios Pruebas",
  "fechaNacimiento": "2024-05-09T22:00:00.000+00:00",
  "direccion": "ccc",
  "correo": "ccc@ccc.c",
  "deporte": {
    "id": 37,
    "nombre": "Bádminton"
  },
  "localidad": {
    "id": 3,
    "descripcion": "Alicante",
    "idProvincia": {
      "id": 3,
      "descripcion": "Alicante"
    }
  },
  "documento": "ccc",
  "codigoPostal": "12312",
  "provincia": {
    "id": 3,
    "descripcion": "Alicante"
  },
  "telefono": "123123123",
  "afiliadosFuncion": {
    "id": 3,
    "descripcion": "Juez(a) de mesa"
  },
  "afiliadosCategoria": {
    "id": 2,
    "descripcion": "Profesional"
  },
  "usuariorol": {
    "id": 3,
    "descripcion": "afiliados"
  },
  "estadoCuenta": {
    "id": 3,
    "estado": "pendiente de pago"
  },
  "observaciones": null,
  "password": "",
  "fechaAfiliacion": "2024-05-22T12:39:07.719+00:00",
  "federacion": "",
  "tipoPago": {
    "id": 3,
    "descripcion": "Transferencia Bancaria"
  },
  "tipoDocumento": {
    "id": 1,
    "descripcion": "DNI"
  },
  "situacionActual": "Ex"
};
 
   // Inyección de dependencias utilizando la función inject
   private paymentService = inject(PaymentService);
   private usuariosService = inject(UsuariosServiceImpl);
   private originServiceImpl = inject(OriginRequest);
   private http = inject(HttpClient);
   
  pay() {
    this.usuariosService.setUsuario(this.usuario);
    this.paymentService.createPayment(1,"A438887").subscribe(response => {
      const form = document.createElement('form');
      form.setAttribute('name', 'form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', response.RedsysUrl);

      const signatureVersion = document.createElement('input');
      signatureVersion.setAttribute('type', 'hidden');
      signatureVersion.setAttribute('name', 'Ds_SignatureVersion');
      signatureVersion.setAttribute('value', response.Ds_SignatureVersion);
      form.appendChild(signatureVersion);

      const merchantParameters = document.createElement('input');
      merchantParameters.setAttribute('type', 'hidden');
      merchantParameters.setAttribute('name', 'Ds_MerchantParameters');
      merchantParameters.setAttribute('value', response.Ds_MerchantParameters);
      form.appendChild(merchantParameters);

      const signature = document.createElement('input');
      signature.setAttribute('type', 'hidden');
      signature.setAttribute('name', 'Ds_Signature');
      signature.setAttribute('value', response.Ds_Signature);
      form.appendChild(signature);

      document.body.appendChild(form);
      console.warn(form.outerHTML);
      form.submit();
    });
  }

  endpoint(){


    return this.originServiceImpl.getorigin();
  }
  
}
