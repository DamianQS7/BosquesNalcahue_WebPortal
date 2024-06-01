import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { DashboardLayoutComponent } from './dashboard/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardLayoutComponent,
        children: [
            { 
                path: 'reportes', 
                loadComponent: () => import('./dashboard/pages/reports-page/reports-page.component').then(c => c.ReportsPageComponent),
            },
            { 
                path: 'estadisticas', 
                loadComponent: () => import('./dashboard/pages/charts-page/charts-page.component').then(c => c.ChartsPageComponent),
            },
            { 
                path: 'editar-reporte/:id', 
                loadComponent: () => import('./dashboard/pages/edit-report-page/edit-report-page.component').then(c => c.EditReportPageComponent),
            },
        ]
    },
    { path: 'login', component: LoginPageComponent },
    { path: '**', redirectTo: 'dashboard/reportes'}
];
