import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  Id: string;
  Email: string;
  Name: string;
  CreatedAt: string;
  FavoriteTrips: string[];
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5228/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any  // ← Añade esto
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    // Verifica si está en el navegador (no en el servidor)
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.currentUserSubject.next(JSON.parse(userData));
      }
    }
  }

  // Registrar nuevo usuario
  register(userData: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
  }

  // Iniciar sesión
login(credentials: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
    tap((response: any) => {
      if (response.user && response.token) {
        // Asegurar que se guardan TODOS los datos del usuario
        const userData = {
          Id: response.user.Id || response.user.id,
          Email: response.user.Email || response.user.email,
          Name: response.user.Name || response.user.name,
          CreatedAt: response.user.CreatedAt || response.user.createdAt,
          FavoriteTrips: response.user.FavoriteTrips || response.user.favoriteTrips || []
        };
        
        this.setSession(userData, response.token);
      }
    })
  );
}

  // Verificar token
  verifyToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-token`, { idToken: token });
  }

  // Obtener perfil de usuario
  getUserProfile(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${userId}`);
  }

  // Guardar sesión
  private setSession(user: User, token: string): void {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Cerrar sesión
  logout(): void {
    // Solo en navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

 isAuthenticated(): boolean {
    // Solo en navegador
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('userToken');
      return !!token;
    }
    return false;
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

   getToken(): string | null {
    // Solo en navegador
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userToken');
    }
    return null;
  }


  // Verificar conexión con el backend
  testConnection(): Observable<any> {
    return this.http.get('http://localhost:5228/api/ping'); // Hay que revisar las URLS algunas creo que están correctas
  }

  // Actualizar perfil de usuario
  updateUserProfile(userId: string, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}`, userData);
  }
}
// Hay que revisar las URLS algunas creo que están correctas