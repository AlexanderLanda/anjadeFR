import { Component, OnInit, OnDestroy, Inject, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../Core/Service/Implements/AuthService';
import { Subscription } from 'rxjs';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-menu-nav-bar',
  templateUrl: './menu-nav-bar.component.html',
  styleUrls: ['./menu-nav-bar.component.css'],
  standalone: true,
  imports: [NgbCollapseModule]
})
export class MenuNavBarComponent implements OnInit, OnDestroy {

  title = 'anjadefr';
  isHomePage: boolean = false;
  isNavbarCollapsed = true;
  loggedIn: boolean = false;
  isAdmin: boolean = false;
  private subscriptions: Subscription[] = [];

  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {}

  ngOnInit() {
    this.subscriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isHomePage = this.router.url === '/home';
        }
      })
    );

    this.subscriptions.push(
      this.authService.isLoggedIn().subscribe(loggedIn => {
        this.loggedIn = loggedIn;
      })
    );

    this.subscriptions.push(
      this.authService.isAdminUser().subscribe(isAdmin => {
        this.isAdmin = isAdmin;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isUserAuthorized(): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return false;
    }
    const validRoles = ['presidente', 'comisionados', 'secretario(a)', 'administrador'];
    return validRoles.includes(user.usuariorol.descripcion) && user.estadoCuenta.estado === 'activo';
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  downloadEstatutos() {
    const url = '/assets/documentos/estatutos.docx';
    window.location.href = url;
    console.log('Descarga realizada con éxito');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Asegúrate de tener una ruta de login
  }

  scrollToFooter() {
    const element = document.getElementById('contact-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToCartaPresentacion() {
    const element = document.getElementById('carta-presentacion');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToCartaArbitros() {
    const element = document.getElementById('carta-arbitros');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

}
