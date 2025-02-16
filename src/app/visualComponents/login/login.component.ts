import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Core/Service/Implements/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule] // Importa los módulos necesarios directamente
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;

  // Inyecta las dependencias utilizando la función inject
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    // Inicializa el formulario en el constructor
    this.loginForm = this.fb.group({
      idAfiliacion: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { idAfiliacion, password } = this.loginForm.value;
      this.authService.login(idAfiliacion, password).subscribe({
        next: (response) => {
          if (response.success) {
            // Redirige al usuario según su rol
            this.router.navigate([response.redirectUrl]);
          }
        },
        error: () => {
          alert('Error de autenticación');
        }
      });
    }
  }
}
