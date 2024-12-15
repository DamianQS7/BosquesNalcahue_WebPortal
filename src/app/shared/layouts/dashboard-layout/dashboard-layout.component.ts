import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

}
