import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { FormsModule } from '@angular/forms';
import { SharedComponentModule } from "../shared-component/shared-component.module";
import { SnackbarComponent } from '../shared-component/snackbar/snackbar.component';


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    SharedComponentModule
]
})
export class SettingsModule { }
