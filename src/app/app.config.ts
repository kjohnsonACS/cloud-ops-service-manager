import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { InstanceRepository } from './services/instance.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // REMOVE AFTER DEMO AND REPLACE WITH REAL CONSUMPTION
    { provide: InstanceRepository, useClass: MockInstanceRepository }
  ]
};
