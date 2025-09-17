import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TripService, Trip } from '../../services/trip.service';
import { CountryService, Country } from '../../services/country.services';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './trip.html',
  styleUrls: ['./trip.css']
})
export class TripFormComponent implements OnInit {
  trip: Trip = {
    userId: '',
    countryCode: '',
    countryName: '',
    startDate: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 días
    description: '',
    rating: 0
  };
  
  countries: Country[] = [];
  isEdit = false;
  loading = false;
  error = '';
  minDate: string;

  constructor(
    private tripService: TripService,
    private countryService: CountryService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    // Establecer fecha mínima como hoy
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadCountries();
    
    const tripId = this.route.snapshot.paramMap.get('id');
    if (tripId) {
      this.isEdit = true;
      // Aquí cargarías el viaje existente para editar
    }
    
    if (isPlatformBrowser(this.platformId)) {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        this.trip.userId = userData.Id;
      }
    }
  }

  loadCountries() {
    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (err) => {
        console.error('Error loading countries:', err);
        this.error = 'Error al cargar países';
      }
    });
  }

  // Validar que la fecha de fin sea después de la de inicio
  validateDates(): boolean {
    const start = new Date(this.trip.startDate);
    const end = new Date(this.trip.endDate);
    
    if (end <= start) {
      this.error = 'La fecha de fin debe ser posterior a la fecha de inicio';
      return false;
    }
    
    this.error = '';
    return true;
  }

  onSubmit() {
    if (!this.validateDates()) {
      return;
    }

    this.loading = true;
    
    if (this.isEdit) {
      // Lógica para actualizar viaje existente
      console.log('Editing trip:', this.trip);
    } else {
      this.tripService.createTrip(this.trip).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/trips']);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al crear el viaje: ' + 
            (err.error?.message || 'Intenta nuevamente');
          console.error('Error creating trip:', err);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/trips']);
  }

  // Cuando se selecciona un país, actualizar countryCode
  onCountrySelect() {
    const selectedCountry = this.countries.find(c => c.name.common === this.trip.countryName);
    if (selectedCountry) {
      this.trip.countryCode = selectedCountry.cca3 || '';
    }
  }
}