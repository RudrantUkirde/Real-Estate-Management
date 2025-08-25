import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertiesPageComponent } from './properties-page/properties-page.component';
import { ListPropertiesComponent } from './list-properties/list-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentModule } from "../shared-component/shared-component.module";
import { HttpClientModule } from '@angular/common/http';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { PropertyDataComponent } from './property-data/property-data.component';
import { MortgageCalculatorComponent } from './mortgage-calculator/mortgage-calculator.component';
import { NewPropertyComponent } from './new-property/new-property.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
  
    PropertiesPageComponent,
    ListPropertiesComponent,
    PropertyDetailsComponent,
    PropertyDataComponent,
    MortgageCalculatorComponent,
    NewPropertyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PropertiesRoutingModule,
    SharedComponentModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule
]
})
export class PropertiesModule { }
