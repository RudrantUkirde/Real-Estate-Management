import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { VerifyComponent } from './verify/verify.component';
import { SharedComponentModule } from "../shared-component/shared-component.module";



@NgModule({
  declarations: [
    RegisterComponent,
    SigninComponent,
    VerifyComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    SharedComponentModule
]
})
export class UserModule { }
