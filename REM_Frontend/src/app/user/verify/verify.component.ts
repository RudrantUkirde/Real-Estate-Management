import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadChildren, Router } from '@angular/router';
import { UserService } from '../UserService/user.service';
import { SnackbarService } from '../../shared-component/snackbar.service';
import { LoaderService } from '../../shared-component/loader/loader.service';

@Component({
  selector: 'app-verify',
  standalone: false,
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {

  verifyForm !: FormGroup;
  hidePassword=true;
  hideConfirmPassword=true;

  isLoading=false;

  constructor(private fb: FormBuilder,
      private router: Router,
      private userService:UserService,
      private snackbarService:SnackbarService,
      private loader:LoaderService){

    this.verifyForm= this.fb.group({

      email:[null,[Validators.email,Validators.required]],
      verificationCode:[null,[Validators.required]],
       
    })
  }
  

  //Submit method
  onSubmit(){

    if(this.verifyForm.invalid){
      this.verifyForm.markAllAsTouched();
      this.snackbarService.show(
            'Please fill the form correctly!!',
            'error'
          );
      return;
    }

    this.isLoading=true;
    this.loader.showButtonLoader();


    const payload = this.verifyForm.value;
    this.userService.verifyUser(payload).subscribe({
      next:()=>{

          this.router.navigateByUrl('/user/signin');
          this.snackbarService.show(
            'Account verification successfull!!, Please Login...',
            'success'
          );

      },
      error:(err) =>{

        console.log(err);

        if(err.status=== 400){
          this.snackbarService.show(
            'Invalid verification Code',
            'error'
          );
        }else if(err.status === 302){
          this.snackbarService.show(
            'Already verified account!!',
            'error'
          );
        }else if(err.status === 404){
          this.snackbarService.show(
            'Email does not exist!!',
            'error'
          );
          
        }else if(err.status === 406){
          this.snackbarService.show(
            'Verification code has expired!!',
            'error'
          );
        }
        this.verifyForm.reset();
        this.isLoading=false;
        this.loader.hideButtonLoader();
      }
    });
  }

  onResend(){

    if(this.verifyForm.get("email")?.value===''){

      this.verifyForm.get('email')?.markAsTouched();
      this.snackbarService.show(
            'Email required for verification!!',
            'error'
          );
      return;
    }

    this.isLoading=true;
    this.loader.showButtonLoader();

    const payload = this.verifyForm.get("email")?.value;
    this.userService.resendCode(payload).subscribe({
      next:()=>{

        this.snackbarService.show(
              'Resend success!! please check your inbox..',
              'success'
            );
        this.verifyForm.get("verificationCode")?.reset();
        this.isLoading=false;
        this.loader.hideButtonLoader();

      },
      error:(err)=>{

        if(err.status===409){
          this.snackbarService.show(
              'Account already verified!! please Login..',
              'error'
            );
        }else if(err.status===400){
          this.snackbarService.show(
              'Email does not exist!! Please Register....',
              'error'
            );
        }
        this.verifyForm.reset();
        this.isLoading=false;
        this.loader.hideButtonLoader();
      }
    });
  }
}

