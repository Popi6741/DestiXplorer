import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ← Importar FormsModule
import { Router } from '@angular/router';
// Update the path below to the correct location of AuthService
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-register',
  standalone: true, // ← Si es standalone
  imports: [FormsModule], // ← Agregar aquí
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {

  userData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    console.log('Datos a registrar:', this.userData);

    this.authService.register(this.userData).subscribe({
      next: (response: any) => {
        console.log('Registro exitoso:', response);
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Error en registro:', error);
        alert('Error al registrar: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }
}
