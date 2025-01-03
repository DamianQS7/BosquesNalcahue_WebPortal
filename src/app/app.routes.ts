import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { isAuthenticatedGuard } from './shared/guards/is-authenticated.guard';
import { isAuthorizedGuard } from './shared/guards/is-authorized.guard';
import { logoutGuard } from './shared/guards/logout.guard';

export const routes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardLayoutComponent,
        children: [
            { 
                path: 'reportes', 
                loadComponent: () => import('./reports/reports-page/reports-page.component'),
                canActivate: [isAuthenticatedGuard]
            },
            { 
                path: 'estadisticas', 
                loadComponent: () => import('./charts/main-page/charts-page.component'),
                canActivate: [isAuthenticatedGuard]
            },
            { 
                path: 'editar-reporte/:id', 
                loadComponent: () => import('./edit-reports/edit-report-page/edit-report-page.component'),
                canActivate: [isAuthorizedGuard]
            },
            {
                path: 'configuracion',
                loadComponent: () => import('./settings/settings-page/settings-page.component').then(c => c.SettingsPageComponent)
            },
        ]
    },
    { path: 'login', component: LoginPageComponent, canActivate: [logoutGuard]},
    { path: '**', redirectTo: 'dashboard/reportes'}
];
