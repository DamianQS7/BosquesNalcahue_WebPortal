import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  template: `
  <div class="wrapper">
    <dashboard-sidebar />
    <div class="main-content">
      <router-outlet />
    </div>
  </div>
  `,
  styles: `
  .wrapper {
    @apply flex bg-slate-300 dark:bg-slate-800 w-full sm:px-2 2xl:px-6 sm:py-1 2xl:py-2
  }

  .main-content {
    @apply w-full px-6 py-4 sm:ml-56 h-full dark:bg-slate-800
  }
  `,
})
export class DashboardLayoutComponent { }
