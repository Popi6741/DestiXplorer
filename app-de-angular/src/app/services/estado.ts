import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private tripsUpdated = new BehaviorSubject<boolean>(false);
  tripsUpdated$ = this.tripsUpdated.asObservable();

  notifyTripsUpdate() {
    this.tripsUpdated.next(true);
  }
}