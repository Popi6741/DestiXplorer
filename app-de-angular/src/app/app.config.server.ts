import { mergeApplicationConfig, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Añade esto para el servidor también:
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
