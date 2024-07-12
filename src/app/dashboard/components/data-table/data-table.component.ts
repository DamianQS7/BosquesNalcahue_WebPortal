import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, input, Input, InputSignal, Output, signal } from '@angular/core';

import { IconsService } from '../../../services/icons.service';
import { ColumnTitles, ReportsTableRow } from '../../interfaces';
import { FormatSpeciesPipe } from '../../../pipes/format-species.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'dashboard-data-table',
  standalone: true,
  imports: [CommonModule, FormatSpeciesPipe, RouterModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {

  public iconsService: IconsService = inject(IconsService);

  @Input()
  public columnTitles: ColumnTitles[] = [
    { title: 'Fecha', sortable: true },
    { title: 'Folio', sortable: false },
    { title: 'Tipo de Producto', sortable: false },
    { title: 'Nombre del Cliente', sortable: false },
    { title: 'Productos', sortable: false },
  ];

  @Input()
  public data: ReportsTableRow[] = []; 

  @Output()
  public onSortColumn: EventEmitter<string> = new EventEmitter();

  public sortColumnEvent(sort: string): void {
    this.onSortColumn.emit(sort);
  }
}
