import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentRoutingModule } from './shared-component-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    SidebarComponent,
    SnackbarComponent,
    LogoutComponent,
  ],
  imports: [
    CommonModule,
    SharedComponentRoutingModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    SidebarComponent, // Important!
    SnackbarComponent,
    LogoutComponent
  ]
})
export class SharedComponentModule { }
