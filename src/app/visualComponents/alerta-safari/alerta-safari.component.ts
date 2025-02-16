import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-alerta-safari',
  templateUrl: './alerta-safari.component.html',
  styleUrls: ['./alerta-safari.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export  class AlertaSafariComponent {

constructor(private router: Router,){}

  cerrarAlerta(){
    this.router.navigate(['/registro']);
  }
}
