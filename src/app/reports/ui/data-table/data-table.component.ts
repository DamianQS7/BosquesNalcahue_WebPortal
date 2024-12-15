import { CommonModule } from '@angular/common';
import { Component, inject, Input, output } from '@angular/core';

import { IconsService } from '../../../shared/services/icons.service';
import { FormatSpeciesPipe } from '../../../shared/pipes/format-species.pipe';
import { RouterModule } from '@angular/router';
import { ColumnTitles } from '../../../shared/interfaces';
import { ReportsTableRow } from '../../interfaces';

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
 
  public onViewPdf = output<string>();
  public onSortColumn = output<string>();

  public sortColumnEvent(sort: string): void {
    this.onSortColumn.emit(sort);
  }

  public viewPdfEvent(fileId: string): void {
    this.onViewPdf.emit(fileId);
  }
}
