import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trip {
  id?: string;
  userId: string;
  countryCode: string;
  countryName: string;
  startDate: string;
  endDate: string;
  description: string;
  rating: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:5228/api/trips';

  constructor(private http: HttpClient) { }

  createTrip(trip: Trip): Observable<any> {
    const tripForBackend = {
      ...trip,
      startDate: this.formatDateForBackend(trip.startDate),
      endDate: this.formatDateForBackend(trip.endDate)
    };
    
    return this.http.post(this.apiUrl, tripForBackend, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getUserTrips(userId: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.apiUrl}/user/${userId}`);
  }

  deleteTrip(tripId: string): Observable<any> {
    console.log('Deleting trip with ID:', tripId);
    return this.http.delete(`${this.apiUrl}/${tripId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private formatDateForBackend(date: any): string {
    if (date instanceof Date) {
      return date.toISOString();
    } else if (typeof date === 'string') {
      return new Date(date).toISOString();
    } else {
      return new Date().toISOString();
    }
  }

  formatDateForDisplay(date: string): Date {
    return new Date(date);
  }
}