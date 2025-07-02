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
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { errorInterceptor } from './middleware/auth.errorInterceptor ';
import { Loader } from '@googlemaps/js-api-loader';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideAngularSvgIcon(),
    provideHttpClient(withInterceptors([AuthInterceptor,errorInterceptor])),
    importProvidersFrom(AngularFireModule.initializeApp(firebaseEnvironment.firebase)),
    provideAuth(() => getAuth()),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '117842698865-6hra2dirvhn4gtdt543kdlf2pq19msnr.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2480872695583098')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: 'AIzaSyAoyHKkR4lPW6riz_RuEol1ZOt1MEswA3I',
        libraries: ['places']
      })
    }
  ]
};
