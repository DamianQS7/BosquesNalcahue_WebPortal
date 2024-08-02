import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IconsService } from '../../../shared/services/icons.service';
import { DropdownOption } from '../../interfaces/dropdown-option.interface';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'dashboard-dropdown',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent implements OnInit {
  // Services
  public iconsService: IconsService = inject(IconsService);
  
  // Properties
  public dropdownOpened = signal<boolean>(false);
  public selectedOption = signal<string>('');

  @Output()
  public optionChanged: EventEmitter<string> = new EventEmitter(); 

  @Input()
  public dropdownOptions: DropdownOption[] = [];

  @Input()
  public initialDisplayName: string = '';

  @Input()
  public iconName: string = '';
  
  // Methods
  ngOnInit(): void {
    this.selectedOption.set(this.initialDisplayName);
  }

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
