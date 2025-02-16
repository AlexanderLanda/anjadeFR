
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../Core/Service/PaymentService';

@Component({
  selector: 'app-failure',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './failure.component.html',
  styleUrl: './failure.component.css'
})
export default class FailureComponent {

  selectedFormaPago=1;

  constructor(private paymentService: PaymentService){}

  closeModal() {
    console.info("valor tipo de pago",this.selectedFormaPago)
   // this.paymentService.pay(this.selectedFormaPago);
  }
}
