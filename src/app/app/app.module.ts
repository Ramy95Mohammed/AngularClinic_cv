import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsrfService } from '../services/sharedData/csrf.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { errorHandlerInterceptor } from '../error-handler.interceptor';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ]
})
export class AppModule { }
