import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';


@Component({
    selector: 'app-success',
    standalone: true,
    templateUrl: './success.component.html',
    styleUrl: './success.component.css',
    imports: [
      ]
})
export  class SuccessComponent  implements OnInit{

  mostrarFormulario : boolean = true;
  
  constructor(private usuarioService: UsuariosServiceImpl, private router: Router) {}

  ngOnInit() {
    /*
    const usuario = this.usuarioService.getUsuario();
    if (usuario) {
      console.log(usuario);
      // Redirigir de nuevo al formulario con los datos del usuario
      this.router.navigate(['/formulario', { usuario: JSON.stringify(usuario) }]);
    } else {
      // Manejar el caso en que no haya datos de usuario (error o acceso directo a la URL de éxito)
      console.error('No se encontraron datos de usuario');
    }*/
  }

  closeModal() {
    this.mostrarFormulario = false; // Cambia el valor a false para ocultar el modal
  }

}
