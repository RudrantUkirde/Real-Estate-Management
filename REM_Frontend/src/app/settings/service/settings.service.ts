import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  private latitudeSource = new BehaviorSubject<number>(19.0760);   // Default: Mumbai
  private longitudeSource = new BehaviorSubject<number>(72.8777);

  latitude$ = this.latitudeSource.asObservable();
  longitude$ = this.longitudeSource.asObservable();

  setCoordinates(lat: number, lng: number) {
    this.latitudeSource.next(lat);
    this.longitudeSource.next(lng);
  }

  resetCoordinates() {
    // Reset to Mumbai or any default
    this.latitudeSource.next(19.0760);
    this.longitudeSource.next(72.8777);
  }
}
