import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from '../../interfaces/menu-item.interface';
import { IconsService } from '../../../shared/services/icons.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'dashboard-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  public iconService: IconsService = inject(IconsService);
  public authService: AuthService = inject(AuthService);

  public mainMenuItems: MenuItem[] = [
    { route: '/dashboard/reportes', icon: 'pdf_file', title: 'Listado'},
    { route: '/dashboard/estadisticas', icon: 'chart', title: 'Estadísticas'},
  ];

  public settingsMenuItems: MenuItem[] = [
    { route: '/settings', icon: 'gear', title: 'Configuración'},
    { route: '/login', icon: 'logout', title: 'Cerrar Sesión'}
  ];

  private showMenu: boolean = false;

  public defaultUserAvatar: string = 'assets/icons/user.png';

  public toggleMenu(): void {
    this.showMenu = !this.showMenu;

    console.log(this.showMenu);
  }
}
