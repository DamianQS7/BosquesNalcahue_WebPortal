import { Component, inject, OnInit, signal } from '@angular/core';
import { map, tap } from 'rxjs';

import { ReportsService } from '../../services/reports.service';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { PaginationInfo, ReportsTableRow, Report, ReportsResponse } from '../../../interfaces';
import { PaginationNavComponent } from '../../components/pagination-nav/pagination-nav.component';

@Component({
  standalone: true,
  imports: [DataTableComponent, DropdownComponent, PaginationNavComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export class ReportsPageComponent implements OnInit {

  private reportsService: ReportsService = inject(ReportsService);

  public currentFilter = signal<string>('Sin filtrar');
  public tableReports = signal<ReportsTableRow[]>([]);
  public paginationInfo = signal<PaginationInfo | undefined>(undefined);

  ngOnInit(): void {
    this.getAllReports();
  }

  public getAllReports(): void {
    this.reportsService.getAllReports(this.currentFilter())
      .pipe(
        tap<ReportsResponse>(
          ({items, ...paginationData }) => this.paginationInfo.set(paginationData)
        ),
        map<ReportsResponse, ReportsTableRow[]>(
          ({ items }) => this.mapReportsToRows(items)
        ),
      )
      .subscribe((data) => {this.tableReports.set(data); console.log(this.paginationInfo())});
  }

  private mapReportsToRows(items: Report[]): ReportsTableRow[] {
    return items.map(({date, productType, clientName, truckCompany, species}) => 
      ({date, productType, clientName, truckCompany, species})
    );
  }

  public applyFilter(filter: string): void {
    this.currentFilter.set(filter);
    this.getAllReports();
  }
}