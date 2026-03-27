import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { csrfInterceptor } from './core/interceptors/csrf.interceptor';
import { requestIdInterceptor } from './core/interceptors/request-id.interceptor';
import { GlobalErrorHandler } from './core/logging/global-error-handler';
import { LoggerService } from './core/logging/logger.service';
import { CsrfService } from './core/security/csrf.service';
import { DashboardEffects } from './features/dashboard/state/dashboard.effects';
import { dashboardReducer } from './features/dashboard/state/dashboard.reducer';
import { ProjectStudioEffects } from './features/project-studio/state/project-studio.effects';
import { projectStudioReducer } from './features/project-studio/state/project-studio.reducer';
import { UsersEffects } from './features/users/state/users.effects';
import { usersReducer } from './features/users/state/users.reducer';
import { SelectivePreloadingStrategy } from './routing/selective-preloading.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([requestIdInterceptor, csrfInterceptor])),
    provideRouter(
      routes,
      withPreloading(SelectivePreloadingStrategy),
      withComponentInputBinding(),
    ),
    provideStore(),
    provideState('dashboard', dashboardReducer),
    provideState('users', usersReducer),
    provideState('projectStudio', projectStudioReducer),
    provideEffects([DashboardEffects, UsersEffects, ProjectStudioEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [CsrfService],
      useFactory: (csrfService: CsrfService) => () => csrfService.init(),
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [LoggerService],
      useFactory: (logger: LoggerService) => () => logger.info('Application bootstrap started'),
    },
  ],
};
