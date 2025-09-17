import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <header>
        <h1>Bienvenido a DestiXplorer</h1>
        <button (click)="logout()">Cerrar sesión</button>
      </header>
      
      <div class="dashboard-content">
        <div class="stats">
          <div class="stat-card">
            <h3>Países explorados</h3>
            <p>{{ visitedCountries }}</p>
          </div>
          <div class="stat-card">
            <h3>Viajes planeados</h3>
            <p>{{ trips.length }}</p>
          </div>
        </div>
        
        <div class="actions">
          <button routerLink="/countries" class="btn-primary">Explorar países</button>
          <button routerLink="/trips" class="btn-secondary">Mis viajes</button>
          <button routerLink="/profile" class="btn-tertiary">Mi perfil</button>
        </div>
        
        <div class="recent-trips" *ngIf="trips.length > 0">
          <h2>Viajes recientes</h2>
          <div class="trip-list">
            <div *ngFor="let trip of trips.slice(0, 3)" class="trip-card">
              <h4>{{ trip.countryName }}</h4>
              <p>{{ trip.startDate | date }} - {{ trip.endDate | date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  visitedCountries = 0;
  trips: any[] = [];
  userData: any;

  constructor(
    private authService: AuthService,
    private tripService: TripService,
    private router: Router
  ) {}

  ngOnInit() {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
      this.loadUserTrips();
    }
  }

  loadUserTrips() {
    if (this.userData && this.userData.Id) {
      this.tripService.getUserTrips(this.userData.Id).subscribe({
        next: (trips) => {
          this.trips = trips;
        },
        error: (err) => {
          console.error('Error loading trips:', err);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}