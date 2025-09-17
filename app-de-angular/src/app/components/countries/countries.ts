import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountryService, Country } from '../../services/country.services';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './countries.html',
  styleUrls: ['./countries.css']
})
export class CountriesComponent implements OnInit {
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  searchTerm = '';
  selectedRegion = '';
  loading = true;
  error = '';
  regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  userData: any = null;

  constructor(
    private countryService: CountryService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadAllCountries();
  }

  loadUserData() {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      this.userData = JSON.parse(userDataStr);
    }
  }

  loadAllCountries() {
    this.loading = true;
    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.filteredCountries = countries;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los países';
        this.loading = false;
        console.error('Error loading countries:', err);
      }
    });
  }

  searchCountries() {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.countryService.searchCountries(this.searchTerm.trim()).subscribe({
        next: (countries) => {
          this.filteredCountries = countries;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error en la búsqueda';
          this.loading = false;
          console.error('Error searching countries:', err);
        }
      });
    } else {
      this.filteredCountries = this.countries;
    }
  }

  filterByRegion() {
    if (this.selectedRegion) {
      this.loading = true;
      this.countryService.getCountriesByRegion(this.selectedRegion).subscribe({
        next: (countries) => {
          this.filteredCountries = countries;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al filtrar por región';
          this.loading = false;
          console.error('Error filtering by region:', err);
        }
      });
    } else {
      this.filteredCountries = this.countries;
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedRegion = '';
    this.filteredCountries = this.countries;
  }

 addToFavorites(country: Country) {
  if (!this.userData) {
    alert('Debes iniciar sesión para añadir favoritos');
    return;
  }

  this.favoriteService.addFavoriteTrip(this.userData.Id, country.name.common).subscribe({
    next: (response: any) => {
      alert(`¡${country.name.common} añadido a favoritos!`);
      console.log('Added to favorites:', response);
    },
    error: (err: any) => {
      const errorMsg = this.favoriteService.handleError(err);
      alert('Error: ' + errorMsg);
      console.error('Error adding to favorites:', err);
    }
  });
}
  getCapital(capital: string[]): string {
    return capital && capital.length > 0 ? capital[0] : 'N/A';
  }

  formatPopulation(population: number): string {
    return population.toLocaleString('es-ES');
  }
}