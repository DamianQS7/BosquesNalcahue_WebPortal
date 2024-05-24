import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
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
  public dropdownOpened = signal<boolean>(false);
  public selectedOption = signal<string>('Sin filtrar');

  @Output()
  public optionChanged: EventEmitter<string> = new EventEmitter(); 

  @Input()
  public dropdownOptions: DropdownOption[] = [
    { title: 'Sin filtrar' },
    { title: 'Hoy' },
    { title: 'Semana Pasada' },
    { title: 'Mes Pasado' },
    { title: 'Últimos 6 Meses' },
  ];
  
  // Methods
  public toggleDropdown(): void {
    this.dropdownOpened.update(value => !value)
  }

  public selectOption(option: string): void {
    this.selectedOption.set(option);
    this.optionChanged.emit(option);
    this.dropdownOpened.set(false);
  }

  public clickedOutside(): void {
    this.dropdownOpened.set(false);
  }
}
