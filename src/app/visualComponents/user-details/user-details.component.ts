import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosServiceImpl } from '../../Core/Service/Implements/UsuariosServiceImpl';
import { UsuariosDto } from '../../Core/Model/UsuariosDto';
import { CommonModule, Location } from '@angular/common';
import { UserCuestionarioServiceImpl } from '../../Core/Service/Implements/UserCuestionarioServiceImpl';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  standalone:true,
  imports:[CommonModule ]
})
export class UserDetailsComponent implements OnInit {
  user: UsuariosDto | null = null;
  hasCuestionario: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsuariosServiceImpl,
    private location: Location,
    private userCuestionarioServiceImpl: UserCuestionarioServiceImpl
  ) {}

  ngOnInit() {
    // Obtener el parámetro 'id' de la ruta
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(
        user => {
          this.user = user;
          this.checkCuestionario(user.id_user);
        },
        error => console.error('Error fetching user details:', error)
      );
    }
  }

  goBack(): void {
    this.location.back();
  }

  checkCuestionario(userId: number) {
    this.userCuestionarioServiceImpl.hasCuestionario(userId).subscribe(
      has => this.hasCuestionario = has,
      error => console.error('Error checking cuestionario:', error)
    );
  }

  verCuestionario() {
    if (this.hasCuestionario) {
      this.router.navigate(['/user-cuestionario', this.user?.id_user]);
    }
  }
}
