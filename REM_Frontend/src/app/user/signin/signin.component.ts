import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared-component/snackbar.service';
import { StorageService } from '../UserService/storage.service';
import { UserService } from '../UserService/user.service';
import { LoaderService } from '../../shared-component/loader/loader.service';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  isLoading = false;

  loginForm !: FormGroup;
  hidePassword=true;


  constructor(private fb: FormBuilder,
      private router: Router,
      private snackbarService:SnackbarService,
      private userService:UserService,
      private loader:LoaderService){

    this.loginForm= this.fb.group({

      email:[null,[Validators.email,Validators.required]],
      password:[null,[Validators.required,Validators.minLength]],
       
    })

  }

  togglePasswordVisibility(){

    this.hidePassword = !this.hidePassword;
  }


  //Login Method
  onSubmit(){

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.snackbarService.show(
            'Please fill the form correctly!!',
            'error'
          );
      return;
    }

    this.isLoading = true;
    this.loader.showButtonLoader();

    const payload = this.loginForm.value;

    this.userService.login(payload).subscribe({

      next:(res) =>{

        if(res.userId != null){

          const user={
            id:res.userId,
            role:res.userRole
          }

          StorageService.saveUser(user);
          StorageService.saveToken(res.jwt);

          console.log(res);

          // Navigate after successful login so root component updates sidebar state
          this.router.navigateByUrl("/map");
          this.snackbarService.show(
            'Login Successful!!',
            'success'
          );
          this.isLoading = false;
          this.loader.hideButtonLoader();

        }

      },
      error:(err) =>{

        if (err.status === 401) {
          this.snackbarService.show(
            'Invalid email or password.',
            'error'
          );
        }else if(err.status === 403){
          this.snackbarService.show(
            'Email does not exist,Register to login',
            'error'
          );
          
        } else {
          this.snackbarService.show(
            'Something went wrong. Please try again.',
            'error'
          );
        }
        this.isLoading = false;
        this.loader.hideButtonLoader();

      }
    });

  }
}

