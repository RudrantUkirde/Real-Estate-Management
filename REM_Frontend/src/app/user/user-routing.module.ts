import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [

  {path:'register',component:RegisterComponent},
  {path:'signin',component:SigninComponent},
  {path:'verify',component:VerifyComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
