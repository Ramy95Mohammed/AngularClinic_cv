import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { loggerInterceptor } from './logger.interceptor';
import { authInterceptor } from './auth.interceptor';
import { errorHandlerInterceptor } from './error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideClientHydration(), provideAnimationsAsync() ,provideHttpClient(withFetch()) ,
     provideHttpClient(withInterceptors([authInterceptor , errorHandlerInterceptor]))],
     
};
