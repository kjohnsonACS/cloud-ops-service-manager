import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection()
    // REMOVE AFTER DEMO AND REPLACE WITH REAL CONSUMPTION
    // { provide: InstanceRepository, useClass: MockInstanceRepository }
  ]
};
