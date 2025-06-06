# BosquesNalcahue WebPortal
** Website => https://bosquesnalcahue-webportal.pages.dev/login

## Summary
Single Page Application created using Angular 18 as part of a larger demo project for a client. You can find the other components in the system in here:
- .NET MAUI Mobile App => https://github.com/DamianQS7/ForestalCasablancaApp
- ASP.NET Core 8 Web API => https://github.com/DamianQS7/BosquesNalcahueAPI

![image](https://github.com/user-attachments/assets/b060e418-9528-4bed-bedc-fe632adaded3)



### Purpose:
This project works in combination with an ASP.NET Core 8 Web API to create a centralized platform for data and files generated by a mobile app. The SPA provides a user-friendly interface for managing, viewing, and analyzing reports while the Web API acts as the backend layer, handling data retrieval and manipulation.

### Key Features:

* User Authentication: Secure login system using JWT tokens to protect user data.
* Report Management:
  - Display of all generated reports in a list format.
  - Filtering and searching capabilities for specific reports.
  - Editing and deleting of existing reports.
* Real-time Updates: Automatic synchronization of PDF files stored in Azure Blob Storage whenever reports are modified or updated.
* Analytics:
  - Provides computed data based on report information.
  - Initial implementation includes a product type count metric.
* Session Management: Utilizes Interceptors to maintain user sessions when JWT tokens expire, ensuring a seamless user experience.
* Data Fetching: Leverages an ASP.NET Core 8 Web API for efficient and secure data retrieval from the backend.

## Technologies
* Angular 18
* Tailwind CSS
* Flowbite Icons
* Ng2-Charts

## Concepts Applied
* Redux-like pattern for state management.
* Signals => signal, computed, input, output, effect.
* RxJS Interop => toObservable.
* DOM Sanitizer
* Custom Directives
* Built-in and Custom Pipes
* Module-less Angular App
* Lazy Loading with Standalone Components
* Deferrable Views
* RxJS Operators => tap, map, debounceTime, distinctUntilChanged, takeUntil, of, catchError, switchMap, takeUntilDestroyed
* Route Guards => CanActivate.
* Interceptors => To handle Jwt and Refresh Token.
