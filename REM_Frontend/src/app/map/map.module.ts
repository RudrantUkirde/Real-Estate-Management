import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { ListPropertiesComponent } from './list-properties/list-properties.component';
import { FormsModule } from '@angular/forms';
import { SharedComponentModule } from "../shared-component/shared-component.module";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    MapComponent,
    ListPropertiesComponent
  ],
  imports: [
    CommonModule,
    MapRoutingModule,
    FormsModule,
    SharedComponentModule,
    InfiniteScrollModule
]
})
export class MapModule { }
