import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
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
  // Dependencies
  iconsService = inject(IconsService);

  // Properties
  columnTitles = input.required<ColumnTitles[]>();
  tableData    = input.required<ReportsTableRow[]>(); 
  onViewPdf    = output<string>();
  onSortColumn = output<string>();
}