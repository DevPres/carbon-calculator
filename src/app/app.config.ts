import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { appReducer } from './app.store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import * as AppEffects from './app.effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';

export const AppConfig: ApplicationConfig = {
    providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([TokenInterceptor])
    ),
    provideStore({ appState: appReducer }),
    provideEffects(AppEffects),
    provideStoreDevtools(),
    provideAnimations()
],
};
