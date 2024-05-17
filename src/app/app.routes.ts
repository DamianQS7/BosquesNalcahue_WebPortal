import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/pages/login-page/login-page.component';
import { DashboardLayoutComponent } from './dashboard/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardLayoutComponent,
        children: [
            { 
                path: '', 
                loadComponent: () => import('./dashboard/pages/reports-page/reports-page.component').then(c => c.ReportsPageComponent),
            }
        ]
    },
    { path: 'login', component: LoginPageComponent },
    { path: '**', redirectTo: 'dashboard'}
];
