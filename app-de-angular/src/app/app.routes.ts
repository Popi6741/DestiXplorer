import { Routes } from '@angular/router';

// Importaciones CORRECTAS desde components/
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CountriesComponent } from './components/countries/countries';
import { TripsComponent } from './components/trips/trips';
import { TripFormComponent } from './components/trip-form/trip';
import { ProfileComponent } from './components/profile/profile';

// Importación CORRECTA del guard
import { AuthGuard } from './protección/auth';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // ← Corrige "pathWatch" a "pathMatch"
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'countries',
    component: CountriesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trips',  // ← Corrige "traine" a "trips"
    component: TripsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trip-form',
    component: TripFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'trip-form/:id',
    component: TripFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];