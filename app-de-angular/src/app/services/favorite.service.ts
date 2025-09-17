import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:5228/api';

  constructor(private http: HttpClient) { }

  getUserFavorites(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/favorites`);
  }

  addFavoriteTrip(userId: string, tripName: string): Observable<any> {
    const payload = { 
      itemName: tripName 
    };
    
    console.log('Adding favorite:', payload);
    
    return this.http.post(
      `${this.apiUrl}/users/${userId}/favorites/Trips`, 
      payload,
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  removeFavoriteTrip(userId: string, tripName: string): Observable<any> {
    // Codificar el nombre correctamente
    const encodedTripName = encodeURIComponent(tripName);
    const url = `${this.apiUrl}/users/${userId}/favorites/Trips/${encodedTripName}`;
    
    console.log('DELETE URL:', url);
    
    return this.http.delete(url, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' // Por si el backend no retorna JSON
    });
  }

  handleError(error: any): string {
    console.error('FavoriteService Error:', error);
    
    if (error.status === 400) {
      return 'Solicitud incorrecta. Verifica los datos.';
    } else if (error.status === 404) {
      return 'Recurso no encontrado.';
    } else if (error.status === 500) {
      return 'Error interno del servidor.';
    } else if (error.error) {
      return typeof error.error === 'string' ? error.error : 'Error desconocido';
    } else {
      return `Error ${error.status}: ${error.statusText}`;
    }
  }
}