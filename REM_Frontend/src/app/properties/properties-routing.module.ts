import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertiesPageComponent } from './properties-page/properties-page.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';

const routes: Routes = [

  {path:'properties-page',component:PropertiesPageComponent},
  {path:'property-details/:id',component:PropertyDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule { }
