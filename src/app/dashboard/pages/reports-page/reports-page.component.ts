import { Component, inject, OnInit, signal } from '@angular/core';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { ReportsService } from '../../services/reports.service';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { PaginationInfo, ReportsTableRow, Report, ReportsResponse } from '../../../interfaces';
import { map, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [DataTableComponent, DropdownComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export class ReportsPageComponent implements OnInit {

  private reportsService: ReportsService = inject(ReportsService);

  public currentFilter = signal<string>('Sin filtrar');
  public tableReports = signal<ReportsTableRow[]>([]);
  public paginationInfo?: PaginationInfo;

  ngOnInit(): void {
    this.getAllReports();
  }

  public getAllReports(): void {
    this.reportsService.getAllReports(this.currentFilter())
      .pipe(
        tap<ReportsResponse>(
          ({items, ...paginationData }) => this.paginationInfo = paginationData
        ),
        map<ReportsResponse, ReportsTableRow[]>(
          ({ items }) => this.mapReportsToRows(items)
        ),
      )
      .subscribe((data) => this.tableReports.set(data));
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