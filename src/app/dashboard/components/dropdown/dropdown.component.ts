import { Component, inject, Input } from '@angular/core';
import { IconsService } from '../../../services/icons.service';
import { DropdownOption } from '../../../interfaces/dropdown-option.interface';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'dashboard-dropdown',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  // Services
  public iconsService: IconsService = inject(IconsService);
  
  // Properties
  public dropdownOpened: boolean = false;

  @Input()
  public selectedOption: string = 'Filtrar';

  @Input()
  public dropdownOptions: DropdownOption[] = [
    { title: 'Hoy' },
    { title: 'Semana Pasada' },
    { title: 'Mes Pasado' },
    { title: 'Últimos 6 Meses' },
  ];
  
  // Methods
  public toggleDropdown(): void {
    this.dropdownOpened = !this.dropdownOpened;
  }

  public selectOption(option: string): void {
    this.selectedOption = option;
    this.dropdownOpened = false;
  }

  public clickedOutside(): void {
    this.dropdownOpened = false;
  }

  public check() {
    console.log('clicked');
  }
}
