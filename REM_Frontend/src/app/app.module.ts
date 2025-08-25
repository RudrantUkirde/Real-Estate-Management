import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { SharedComponentModule } from './shared-component/shared-component.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { requestInterceptor } from './Interceptors/request.interceptor';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedComponentModule,
    BrowserAnimationsModule,
    HttpClientModule,
    InfiniteScrollModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([requestInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
