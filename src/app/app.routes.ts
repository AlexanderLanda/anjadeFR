import { Routes } from '@angular/router';
import { AuthGuard } from './Core/Service/Implements/AuthGuard';
import { RegistroComponent } from './visualComponents/registro/registro.component';
import FailureComponent from './Core/Service/failure.component';
import SuccessComponent from './Core/Service/success.component';
import { AlertaSafariComponent } from './visualComponents/alerta-safari/alerta-safari.component';
import { CrearNoticiasComponent } from './visualComponents/noticias-crear/crear-noticias.component';
import { ForbbidenComponent } from './visualComponents/forbbiden/forbbiden.component';
import { FormularioComponent } from './visualComponents/formulario/formulario.component';
import { HomeComponentComponent } from './visualComponents/home-component/home-component.component';
import { JuntaDirectivaComponent } from './visualComponents/junta-directiva/junta-directiva.component';
import { LoginComponent } from './visualComponents/login/login.component';
import { NoticiasAnjadeComponent } from './visualComponents/noticias-anjade/noticias-anjade.component';
import { NoticiasGridComponent } from './visualComponents/noticias-grid/noticias-grid.component';
import { RedsysComponent } from './visualComponents/redsys/redsys.component';
import { ReenviarPagoComponent } from './visualComponents/reenviar-pago/reenviar-pago.component';
import { ReglamentosFileGalleryComponent } from './visualComponents/reglamentos-file-gallery/reglamentos-file-gallery.component';
import { ReportDetailsComponent } from './visualComponents/report-details/report-details.component';
import { ReportFormComponent } from './visualComponents/report-form/report-form.component';
import { ReportListComponent } from './visualComponents/report-list/report-list.component';
import { UserCuestionarioDetailsComponent } from './visualComponents/user-cuestionario-details/user-cuestionario-details.component';
import { UserDetailsComponent } from './visualComponents/user-details/user-details.component';
import { UsuariosTablaComponent } from './visualComponents/usuarios-tabla/usuarios-tabla.component';
import { EstatutosComponent } from './visualComponents/estatutos/estatutos.component';
import { NoticiasReaderComponent } from './visualComponents/noticias-reader/noticias-reader.component';
import { AdminMainComponent } from './visualComponents/admin-main/admin-main.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponentComponent },
  { path: 'informacion/estatutos', component: EstatutosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { 
    path: 'listausuarios', 
    component: UsuariosTablaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['presidente', 'comisionados', 'administrador'] }
  },
  { path: 'formulario', component: FormularioComponent },
  { path: 'redsys', component: RedsysComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'failure', component: FailureComponent },
  { path: 'junta', component: JuntaDirectivaComponent },
  { 
    path: 'noticias-anjade', 
    component: NoticiasGridComponent,
    data: { tipoNoticia: 'PARTICULAR' }
  },
  { 
    path: 'noticias-deportivas', 
    component: NoticiasGridComponent,
    data: { tipoNoticia: 'GENERAL' }
  },
  { 
    path: 'noticias-incidencias', 
    component: NoticiasAnjadeComponent,
    data: { tipoNoticia: 'INCIDENCIAS' }
  },
  { 
    path: 'noticias-reader/:id', 
    component: NoticiasReaderComponent,
  },
  { path: 'create-report', component: ReportFormComponent },
  { 
    path: 'reports', 
    component: ReportListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['presidente', 'comisionados', 'secretario', 'administrador', 'abogados'] }
  },
  { 
    path: 'report-details/:id', 
    component: ReportDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['presidente', 'comisionados', 'secretario', 'administrador', 'abogados'] }
  },
  { path: 'alert-safari', component: AlertaSafariComponent },
  { path: 'reglamentos-deportivos', component: ReglamentosFileGalleryComponent },
  { path: 'user-details/:id', component: UserDetailsComponent },
  { path: 'user-cuestionario/:id', component: UserCuestionarioDetailsComponent },
  { path: 'reenviarPago', component: ReenviarPagoComponent },
  { path: 'admin-main', component: AdminMainComponent },
  { 
    path: 'crear-noticia', 
    component: CrearNoticiasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['presidente', 'comisionados', 'secretario', 'administrador', 'abogados'] }
  },
  { path: 'forbidden', component: ForbbidenComponent },
  { path: '**', redirectTo: '/home' }
];
