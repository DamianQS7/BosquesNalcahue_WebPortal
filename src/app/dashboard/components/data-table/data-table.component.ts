import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IconsService } from '../../../services/icons.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { ColumnTitles } from '../../../interfaces/column-titles.interface';

@Component({
  selector: 'dashboard-data-table',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {

  public iconsService: IconsService = inject(IconsService);

  @Input()
  public columnTitles: ColumnTitles[] = [
    { title: 'Product Name', sortable: false },
    { title: 'Color', sortable: true },
    { title: 'Category', sortable: true },
    { title: 'Price', sortable: true },
  ];
}
