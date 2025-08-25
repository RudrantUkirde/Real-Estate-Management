import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../UserService/user.service';
import { SnackbarService } from '../../shared-component/snackbar.service';
import { LoaderService } from '../../shared-component/loader/loader.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  signupForm !: FormGroup;
  hidePassword=true;
  hideConfirmPassword=true;

  isLoading = false;


  constructor(private fb: FormBuilder,
      private router: Router,
      private userService:UserService,
      private snackbarService:SnackbarService,
      private loader:LoaderService){

    this.signupForm= this.fb.group({

      username:[null,[Validators.required]],
      email:[null,[Validators.email,Validators.required]],
      password:[null,[Validators.required,Validators.minLength]],
      confirmPassword:[null,[Validators.minLength,Validators.required]],
       
    })

  }


  //Hide password method
  togglePasswordVisibility(){

    this.hidePassword = !this.hidePassword;
  }
  //hide confirm password method
  toggleConfirmPasswordVisibility(){

    this.hideConfirmPassword = !this.hideConfirmPassword;
  }



  //Submit method
  onSubmit(){


    if(this.signupForm.invalid){
      this.signupForm.markAllAsTouched();
      this.snackbarService.show(
            'Please fill the form correctly!!',
            'error'
          );
      return;
    }

    this.isLoading = true;
    this.loader.showButtonLoader();

    const password = this.signupForm.get("password")?.value;
    const confirmpPassword = this.signupForm.get("confirmPassword")?.value;
    const payload = this.signupForm.value;

    if(password !== confirmpPassword){ 
      this.snackbarService.show(
            'Password mis-matched error!!..',
            'error'
          );

      return;
    }

    this.userService.signup(payload).subscribe({

      next:(res) =>{

        console.log(res);

        if(res.id != null){

          this.router.navigateByUrl('/user/verify');
          this.snackbarService.show(
            'Registration successful! Please verify your account.',
            'success'
          );

        }

      },
      error:(err) =>{

        console.log(err);
        if (err.status === 406) {
          this.snackbarService.show(
            'Email already registered, please Login!!',
            'error'
          )
        } else {
          this.snackbarService.show(
            'Something went wrong, Please try again!!',
            'error'
          )
        }

        this.isLoading = false;
        this.loader.hideButtonLoader();
      }
    });
  }

}
