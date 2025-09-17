import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TripService, Trip } from '../../services/trip.service';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trips.html',
  styleUrls: ['./trips.css']
})
export class TripsComponent implements OnInit {
userData: any;
favorites: any;
debugUserData() {
throw new Error('Method not implemented.');
}
  trips: Trip[] = [];
  loading = true;
  error = '';

  constructor(
    private tripService: TripService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    this.loadUserTrips();
  }

  loadUserTrips() {
    if (isPlatformBrowser(this.platformId)) {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        console.log('Loading trips for user ID:', userData.Id);
        
        this.tripService.getUserTrips(userData.Id).subscribe({
          next: (response: any) => {
            console.log('Trips API response:', response);
            
            // MANERA ROBUSTA de manejar la respuesta
            if (Array.isArray(response)) {
              this.trips = response;
            } else if (response && Array.isArray(response.trips)) {
              this.trips = response.trips;
            } else if (response && Array.isArray(response.data)) {
              this.trips = response.data;
            } else {
              this.trips = [];
              console.warn('Formato de respuesta inesperado:', response);
            }
            
            this.loading = false;
            console.log('Trips loaded:', this.trips.length);
          },
          error: (err: any) => {
            console.error('Error loading trips:', err);
            this.error = 'Error al cargar los viajes: ' + 
                        (err.error?.message || err.message || 'Verifica la conexión');
            this.loading = false;
            this.trips = [];
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        this.error = 'Usuario no autenticado';
        this.loading = false;
      }
    }
  }

  createNewTrip() {
    this.router.navigate(['/trip-form']);
  }

 

 deleteTrip(tripId: string) {
  if (!tripId) {
    alert('ID de viaje no válido');
    return;
  }

  if (confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
    this.tripService.deleteTrip(tripId).subscribe({
      next: (response: any) => {
        console.log('Trip deleted successfully:', response);
        alert('Viaje eliminado correctamente');
        this.loadUserTrips();
      },
      error: (err: any) => {
        console.error('Error deleting trip:', err);
        
        let errorMessage = 'Error al eliminar el viaje: ';
        if (err.status === 400) {
          errorMessage += 'Solicitud incorrecta. ';
        } else if (err.error?.message) {
          errorMessage += err.error.message;
        } else {
          errorMessage += 'Intenta nuevamente';
        }
        
        alert(errorMessage);
      }
    });
  }
}

  formatDate(date: any): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  }

  
}