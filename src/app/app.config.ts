import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './middleware/auth.interceptor';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { firebaseEnvironment } from './environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideAngularSvgIcon(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(AngularFireModule.initializeApp(firebaseEnvironment.firebase)),
    provideAuth(() => getAuth())
  ]
};
