import { Component, inject } from '@angular/core';
import { MenuItem } from '../../../interfaces/menu-item.interface';
import { IconsService } from '../../../services/icons.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  public iconService: IconsService = inject(IconsService);

  public mainMenuItems: MenuItem[] = [
    { route: '/dashboard', icon: 'dashboard', title: 'General'},
    { route: '/dashboard/lena', icon: 'dashboard', title: 'Leña'},
    { route: '/dashboard/metro-ruma', icon: 'dashboard', title: 'Metro Ruma'},
    { route: '/dashboard/trozo-aserrable', icon: 'dashboard', title: 'Trozo Aserrable'}
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
