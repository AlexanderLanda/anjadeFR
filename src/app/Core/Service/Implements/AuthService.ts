import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UsuariosDto } from '../../Model/UsuariosDto';
import { environment } from '../../../../environments/environment';
import { DefaultRedirect, RolePermissions } from '../../configuracion/permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'api/v1/auth/login';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private isAdmin = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  login(idAfiliacion: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { idAfiliacion, password }).pipe(
      map((response) => {
        if (response && this.isValidUser(response)) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.loggedIn.next(true);
          this.isAdmin.next(this.isValidUser(response));
          const role = response.usuariorol.descripcion; // Obtén el rol del usuario
          const redirectUrl = DefaultRedirect[role as keyof typeof DefaultRedirect] || '/dashboard';
 // Obtén la URL de redirección según el rol
          return { success: true, role: response.usuariorol.descripcion, redirectUrl  };
        } else {
          throw new Error('Credenciales inválidas o usuario no autorizado');
        }
      }),
      catchError(this.handleError)
    );
  }

  private isValidUser(user: any): boolean {
    const validRoles = ['presidente', 'comisionados', 'secretario(a)', 'administrador', 'abogados'];
    return validRoles.includes(user.usuariorol.descripcion) && user.estadoCuenta.estado === 'Aprobado';
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.loggedIn.next(false);
    this.isAdmin.next(false);
  }

  getCurrentUser(): UsuariosDto | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  isAdminUser(): Observable<boolean> {
    return this.isAdmin.asObservable();
  }

  private checkAuthStatus(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.loggedIn.next(true);
      this.isAdmin.next(this.isValidUser(user));
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Código de error ${error.status}, ` +
        `mensaje: ${error.error.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  isUserLoggedIn(): boolean {
    // Esto puede depender de cómo gestionas la sesión, por ejemplo, en LocalStorage
    const user = localStorage.getItem('currentUser');
    return user ? true : false;
  }

  // Obtener el idAfiliacion del usuario logueado
  getIdAfiliacion(): string {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user?.idAfiliacion || ''; // Suponiendo que tienes un idAfiliacion en el objeto de usuario
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user ? user.usuariorol.descripcion : '';
  }
  hasPermission(module: string): boolean {
    const userRole = this.getUserRole();
    return RolePermissions[userRole as keyof typeof RolePermissions]?.includes(module) || false;
  }
  
}
