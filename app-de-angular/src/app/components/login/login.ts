import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1>Iniciar sesión</h1>
      <form (ngSubmit)="onLogin()" #loginForm="ngForm">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            [(ngModel)]="email" 
            name="email" 
            id="email" 
            required 
            type="email" 
            class="input" 
            [class.error]="emailInvalid"
          />
          <div *ngIf="emailInvalid" class="validation-error">Email inválido</div>
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input 
            [(ngModel)]="password" 
            name="password" 
            id="password" 
            required 
            type="password" 
            class="input" 
            [class.error]="passwordInvalid"
            minlength="6"
          />
          <div *ngIf="passwordInvalid" class="validation-error">
            La contraseña debe tener al menos 6 caracteres
          </div>
        </div>
        
        <button 
          type="submit" 
          [disabled]="loading || !loginForm.valid" 
          class="submit-btn"
        >
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
      </form>
      
      <div *ngIf="message" [ngClass]="{'success': success, 'error': !success}" class="message">
        {{ message }}
      </div>
      
      <div class="links">
        <a routerLink="/register">¿No tienes cuenta? Regístrate</a>
      </div>
    </div>
  `,
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  message = '';
  success = false;
  emailInvalid = false;
  passwordInvalid = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  validateForm(): boolean {
    this.emailInvalid = !this.email || !this.isValidEmail(this.email);
    this.passwordInvalid = !this.password || this.password.length < 6;
    
    return !this.emailInvalid && !this.passwordInvalid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onLogin() {
    if (!this.validateForm()) {
      this.message = 'Por favor, completa todos los campos correctamente';
      this.success = false;
      return;
    }

    this.loading = true;
    this.message = '';
    
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.success = true;
        this.message = '¡Login exitoso! Redirigiendo...';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err: any) => {
        this.success = false;
        this.message = err.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}