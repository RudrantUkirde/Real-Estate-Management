import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StorageService } from './user/UserService/storage.service';
import { SnackbarService } from './shared-component/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'REM_Frontend';

  isUserLoggedIn: boolean = false;
  isAdminLoggedIn: boolean = false;

  userId:string='';

  showLogout: boolean = false;

  isAboutPage=false;

  // Mobile navigation drawer
  isMobileMenuOpen: boolean = false;

   constructor(private router:Router,private snackbarService:SnackbarService){

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Update the route check as needed (for any route you want scrollable)
        this.isAboutPage = event.urlAfterRedirects.startsWith('/about');
      }
    });


   }

  openLogoutModal() {
    this.showLogout = true;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  ngOnInit(){
    // Set initial state on app load
    this.isUserLoggedIn = StorageService.isUserLoggedIn();
    this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
    this.userId = StorageService.getUserId();

    // Update state after each navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isUserLoggedIn = StorageService.isUserLoggedIn();
        this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
        this.userId = StorageService.getUserId();
      }
    })
  }

  logout(){
    this.showLogout = false;
    StorageService.logout();
    // Reset role flags immediately so default sidebar shows
    this.isUserLoggedIn = false;
    this.isAdminLoggedIn = false;
    this.userId = '';
    this.router.navigateByUrl("/user/signin");
    this.snackbarService.show('Logout Successfull!! ','success');
  }


}
