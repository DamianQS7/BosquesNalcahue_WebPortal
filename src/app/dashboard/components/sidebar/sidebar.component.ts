import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem } from '../../../interfaces/menu-item.interface';
import { IconsService } from '../../../services/icons.service';

@Component({
  selector: 'dashboard-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  public iconService: IconsService = inject(IconsService);

  public mainMenuItems: MenuItem[] = [
    { route: '/dashboard/reportes', icon: 'pdf_file', title: 'Listado'},
    { route: '/dashboard/estadisticas', icon: 'chart', title: 'Estadísticas'},
    { route: '/dashboard/metro-ruma', icon: 'dashboard', title: 'Leña'}
  ];

  public settingsMenuItems: MenuItem[] = [
    { route: '/settings', icon: 'gear', title: 'Configuración'},
    { route: '/login', icon: 'logout', title: 'Cerrar Sesión'}
  ];

  public showMenu: boolean = false;

  public toggleMenu(): void {
    this.showMenu = !this.showMenu;

    console.log(this.showMenu);
  }
}
