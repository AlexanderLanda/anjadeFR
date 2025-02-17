import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../Core/Service/PaymentService';
import { SafeHtmlPipe } from '../safe-html.pipe';

@Component({
  selector: 'app-reenviar-pago',
  templateUrl: './reenviar-pago.component.html',
  styleUrls: ['./reenviar-pago.component.css'],
  standalone:true,
  imports:[SafeHtmlPipe]
})
export class ReenviarPagoComponent implements OnInit {

  idAfiliacion: string | null = null;
  formHtml: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
    this.idAfiliacion = this.route.snapshot.queryParamMap.get('idAfiliacion');
  }

  pagarConTarjeta() {
    this.realizarPago(1);
  }

  pagarConBizum() {
    this.realizarPago(2);
  }

  private realizarPago(tipoPago: number) {
    if (!this.idAfiliacion) {
      console.error('No se encontró el ID de afiliación');
      return;
    }
    else{
      console.log('El ID de afiliación:'+this.idAfiliacion )
    }

    this.paymentService.pay(tipoPago, this.idAfiliacion);
  }

}
