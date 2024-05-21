import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IconsService } from '../../../services/icons.service';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'dashboard-data-table',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {

  public iconsService: IconsService = inject(IconsService);
}
