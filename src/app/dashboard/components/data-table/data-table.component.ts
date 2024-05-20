import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IconsService } from '../../../services/icons.service';

@Component({
  selector: 'dashboard-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {

  public iconsService: IconsService = inject(IconsService);
}
