import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'map', loadChildren: () => import('./map/map.module').then(m => m.MapModule) },
  { path:'', redirectTo:'/map',pathMatch:'full'},
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  {path:'user',loadChildren:()=> import('./user/user.module').then(m => m.UserModule)},
  {path:'shared',loadChildren:()=> import('./shared-component/shared-component.module').then(m => m.SharedComponentModule)},
  {path:'properties',loadChildren:()=> import('./properties/properties.module').then(m => m.PropertiesModule)},
  {path:'about', loadChildren:()=> import('./about/about.module').then(m => m.AboutModule)},
  {path:'profile', loadChildren:()=> import('./profile/profile.module').then(m=>m.ProfileModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
