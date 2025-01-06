import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from '../../interfaces/menu-item.interface';
import { IconsService } from '../../../shared/services/icons.service';
import { AuthService } from '../../../auth/data-access/auth.service';
import { ThemeToggleComponent } from "../../../shared/components/theme-toggle/theme-toggle.component";

@Component({
  selector: 'dashboard-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, ThemeToggleComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  iconService: IconsService = inject(IconsService);
  authService: AuthService = inject(AuthService);

  mainMenuItems: MenuItem[] = [
    { route: '/dashboard/reportes', icon: 'pdf_file', title: 'Listado'},
    { route: '/dashboard/estadisticas', icon: 'chart', title: 'Estadísticas'},
  ];

  settingsMenuItems: MenuItem[] = [
    { route: '/dashboard/configuracion', icon: 'gear', title: 'Configuración'},
    { route: '/login', icon: 'logout', title: 'Cerrar Sesión'}
  ];

  showMenu = signal<boolean>(false);

  defaultUserAvatar: string = 'assets/icons/user.png';

  toggleMenu = (): void => this.showMenu.update(value => !value);
  
}
