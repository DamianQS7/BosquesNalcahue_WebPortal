import { isPlatformBrowser } from "@angular/common";
import { inject, InjectionToken, PLATFORM_ID } from "@angular/core";

export const WINDOW = new InjectionToken<Window>('The window object', {
    factory: () => window,
});

export const STORAGE_TOKENS = {
  LOCAL: new InjectionToken<Storage>(
    'window local storage object',
    {
      providedIn: 'root',
      factory: () => 
        isPlatformBrowser(inject(PLATFORM_ID))
        ? window.localStorage
        : ({} as Storage)
    }
  ),
  SESSION: new InjectionToken<Storage>(
    'window session storage object',
    {
      providedIn: 'root',
      factory: () =>
        isPlatformBrowser(inject(PLATFORM_ID))
        ? window.sessionStorage
        : ({} as Storage)
    }
  )
};