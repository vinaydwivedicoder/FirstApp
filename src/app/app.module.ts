import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MsalModule, MsalService, MSAL_INSTANCE, MsalInterceptor, MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { AppRoutingModule } from './app-routing.module';

// MSAL Configuration
export function MSALConfigFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: '11ad4b7d-4fcf-41a8-a8de-b3221fda1695', // Replace with your Azure AD app client ID
      authority: 'https://login.microsoftonline.com/e91bcdef-551f-426c-9579-c493958f8fd8', // Replace with your tenant ID
      redirectUri: 'http://localhost:4200', // Your redirect URI
    },
    cache: {
      cacheLocation: 'localStorage', // Can also use 'localStorage'
      storeAuthStateInCookie: false, // Set this to true for IE11 or Edge compatibility
    },
  });
}

@NgModule({
  declarations: [AppComponent, HomeComponent,ProfileComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule.forRoot(
      MSALConfigFactory(), 
      {
        interactionType: InteractionType.Redirect,  // This defines the interaction type for login
        authRequest: {
          scopes: ['user.read']  // Scopes required for the Microsoft Graph API
        }
      }, 
      {
        interactionType: InteractionType.Redirect,  // Defines how login interaction should be done as interceptor it will work
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']], // Define API URL and required scopes
        ])
      }
    )
  ],
  providers: [
    MsalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor, // Using the MsalInterceptor for attaching the token
      multi: true, // Allow multiple interceptors
    },
    MsalGuard,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALConfigFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
