import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { DashboardLayoutComponent } from './dashboard/layouts/dashboard-layout/dashboard-layout.component';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { logoutGuard } from './auth/guards/logout.guard';

export const routes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardLayoutComponent,
        children: [
            { 
                path: 'reportes', 
                loadComponent: () => import('./dashboard/pages/reports-page/reports-page.component').then(c => c.ReportsPageComponent),
                canActivate: [isAuthenticatedGuard]
            },
            { 
                path: 'estadisticas', 
                loadComponent: () => import('./dashboard/pages/charts-page/charts-page.component').then(c => c.ChartsPageComponent),
                canActivate: [isAuthenticatedGuard]
            },
            { 
                path: 'editar-reporte/:id', 
                loadComponent: () => import('./dashboard/pages/edit-report-page/edit-report-page.component').then(c => c.EditReportPageComponent),
            },
        ]
    },
    { path: 'login', component: LoginPageComponent, canActivate: [logoutGuard]},
    { path: '**', redirectTo: 'dashboard/reportes'}
];
