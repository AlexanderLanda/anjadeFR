// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getUserRole();
    const allowedRoles = route.data['roles'] as string[]; // Los roles permitidos definidos en las rutas

    if (this.authService.isUserLoggedIn() && allowedRoles.includes(userRole)) {
      return true; // Permitir acceso
    }

    // Redirigir si no tiene acceso
    this.router.navigate(['/forbidden']); // Ruta de acceso denegado
    return false;
  }
}