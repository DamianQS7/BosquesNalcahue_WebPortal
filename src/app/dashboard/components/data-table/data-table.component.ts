import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Input, InputSignal, signal } from '@angular/core';

import { IconsService } from '../../../services/icons.service';
import { ColumnTitles, ReportsTableRow } from '../../../interfaces';

@Component({
  selector: 'dashboard-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {

  public iconsService: IconsService = inject(IconsService);

  @Input()
  public columnTitles: ColumnTitles[] = [
    { title: 'Fecha', sortable: true },
    { title: 'Tipo de Producto', sortable: true },
    { title: 'Nombre del Cliente', sortable: true },
    { title: 'Empresa Transportista', sortable: true },
    { title: 'Productos', sortable: true },
  ];

  @Input()
  public data: ReportsTableRow[] = []; 
}
