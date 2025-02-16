import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl+'api/v1/payments/create-payment'; // URL del servidor Spring Boot

  constructor(private http: HttpClient) { }

  createPayment(tipoPado: number, idAfiliacion: string): Observable<any> {
    let params = new HttpParams()
    .set('tipoPago', tipoPado.toString())
    .set('idAfiliacion', idAfiliacion);
    return this.http.post(this.apiUrl, {}, { params });
  }

  pay(tipoPago: number, idAfiliacion: string) {
    this.createPayment(tipoPago,idAfiliacion).subscribe(response => {
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
}