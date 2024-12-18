import { Component, inject, input, Input, OnInit, output, signal } from '@angular/core';
import { IconsService } from '../../../shared/services/icons.service';
import { DropdownOption } from '../../interfaces/dropdown.interface';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside.directive';

@Component({
  selector: 'dashboard-dropdown',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  styleUrl: './dropdown.component.css',
  template: `
  <div clickOutside (notifyClickOutside)="clickedOutside()" >
    <button class="btn group" type="button" (click)="toggleDropdown()">
      <div [innerHTML]="iconsService.getIcon(iconName())"></div>
      <span class="mx-3"> {{ selectedOption() }} </span>
      <div [innerHTML]="iconsService.getIcon('arrow_down')"></div>
    </button>
    <!-- Dropdown menu -->
    <div class="options-wrapper" [ngClass]="{'hidden': dropdownOpened() === false}">
      <ul class="options-list">
        @for (option of dropdownOptions(); track $index) {
          <li>
            <div class="option-wrapper" (click)="selectOption(option.title)">
              <span class="option">
                {{ option.title }}
              </span>
            </div>
          </li>
        }
      </ul>
    </div>
  </div>
  `,
})
export class DropdownComponent implements OnInit {
  // Services
  public iconsService: IconsService = inject(IconsService);
  
  // Properties
  dropdownOpened = signal<boolean>(false);
  selectedOption = signal<string>('');

  optionChanged = output<string>(); 
  dropdownOptions = input.required<DropdownOption[]>();
  iconName = input.required<string>();
  initialDisplayName = input.required<string>();
  
  // Methods
  ngOnInit(): void {
    this.selectedOption.set(this.initialDisplayName());
  }

  toggleDropdown(): void {
    this.dropdownOpened.update(value => !value)
  }

  selectOption(option: string): void {
    this.selectedOption.set(option);
    this.optionChanged.emit(option);
    this.dropdownOpened.set(false);
  }

  clickedOutside(): void {
    this.dropdownOpened.set(false);
  }
}
