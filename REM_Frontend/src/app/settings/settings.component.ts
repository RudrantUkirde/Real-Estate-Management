import { Component } from '@angular/core';
import { StorageService } from '../user/UserService/storage.service';
import { SettingsService } from './service/settings.service';
import { SnackbarService } from '../shared-component/snackbar.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  isDarkMode = false;
  latitude = 19.0760;
  longitude = 72.8777;

  constructor(private settingsService:SettingsService,private snackbarService:SnackbarService){}

  ngOnInit() {

    this.settingsService.latitude$.subscribe(lat => this.latitude = lat);
    this.settingsService.longitude$.subscribe(lng => this.longitude = lng);

    // Check localStorage; default to dark if not set
    const storedTheme = localStorage.getItem('theme');
    this.isDarkMode = storedTheme ? storedTheme === 'dark' : true;
    this.applyTheme();
  }

  setCoordinates() {
    this.settingsService.setCoordinates(this.latitude, this.longitude);
    this.snackbarService.show('Map co-ordinates changed!! Please view the map..','success');
  }

  resetCoordinates() {
    this.settingsService.resetCoordinates();
    this.snackbarService.show('Resetting co-ordinates!!','info');
  }

  onThemeToggle(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.isDarkMode = checked;
  this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  
}
