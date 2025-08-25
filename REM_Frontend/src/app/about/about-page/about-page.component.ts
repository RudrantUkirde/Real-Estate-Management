import { Component } from '@angular/core';
import { StorageService } from '../../user/UserService/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: false,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {

  constructor(private router: Router) {}

  onButtonClick() {
    const token = StorageService.getToken();
    if (token) {
      // User is logged in
      this.router.navigate(['/map']);
    } else {
      // User not logged in
      this.router.navigate(['/user/signin']);
    }
  }


}
