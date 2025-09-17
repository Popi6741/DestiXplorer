import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  userData: any = null;
  favorites: any[] = [];
  loading = false;
  error = '';

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    if (isPlatformBrowser(this.platformId)) {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        this.userData = JSON.parse(userDataStr);
        this.loadFavorites();
      } else {
        this.error = 'No se encontraron datos de usuario';
      }
    }
  }

  loadFavorites() {
    if (this.userData && this.userData.Id) {
      this.loading = true;
      this.favoriteService.getUserFavorites(this.userData.Id).subscribe({
        next: (response: any) => {
          console.log('Favorites response:', response);
          // Diferentes formas en que podría venir la respuesta
          this.favorites = response.FavoriteTrips || 
                          response.favoriteTrips || 
                          response.trips || 
                          [];
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error loading favorites:', err);
          this.error = 'Error al cargar favoritos';
          this.loading = false;
          this.favorites = []; // Lista vacía por si acaso
        }
      });
    }
  }
removeFavorite(tripName: string) {
  if (!this.userData?.Id) {
    alert('Usuario no identificado');
    return;
  }

  if (!confirm(`¿Estás seguro de eliminar "${tripName}" de favoritos?`)) {
    return;
  }

  this.loading = true;
  this.favoriteService.removeFavoriteTrip(this.userData.Id, tripName).subscribe({
    next: (response: any) => {
      console.log('Favorite removed:', response);
      alert('Eliminado de favoritos correctamente');
      this.loadFavorites();
      this.loading = false;
    },
    error: (err: any) => {
      console.error('Error removing favorite:', err);
      
      let errorMessage = 'Error al eliminar favorito: ';
      if (err.status === 400) {
        errorMessage += 'El servidor rechazó la solicitud. ';
      }
      errorMessage += this.favoriteService.handleError(err);
      
      alert(errorMessage);
      this.error = errorMessage;
      this.loading = false;
    }
  });
}

  logout() {
    this.authService.logout();
  }

  // Método para debug
  debugUserData() {
    console.log('User Data:', this.userData);
    console.log('Favorites:', this.favorites);
    console.log('LocalStorage:', localStorage.getItem('userData'));
  }
}