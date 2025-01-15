import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  template: `
  <dashboard-sidebar />
  <div class="main-content">
    <router-outlet />
  </div>
  `,
  host: {
    class: 'flex p-1 bg-slate-300 dark:bg-slate-800 w-full sm:px-2 2xl:px-6 sm:py-1 2xl:py-2'
  },
  styles: `
  .main-content {
    @apply w-full sm:px-6 sm:py-4 sm:ml-56 dark:bg-slate-800
  }
  `,
})
export class DashboardLayoutComponent { }
