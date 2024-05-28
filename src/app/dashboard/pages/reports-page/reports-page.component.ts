import { Component, inject, OnInit, signal } from '@angular/core';
import { map, tap } from 'rxjs';

import { ReportsService } from '../../services/reports.service';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { PaginationNavComponent } from '../../components/pagination-nav/pagination-nav.component';
import { PaginationInfo, ReportsTableRow, Report, ReportsResponse } from '../../../interfaces';

@Component({
  standalone: true,
  imports: [DataTableComponent, DropdownComponent, PaginationNavComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export class ReportsPageComponent implements OnInit {

  private reportsService: ReportsService = inject(ReportsService);

  public currentFilter = signal<string>('Sin filtrar'); // Unfiltered by default
  public currentPage = signal<number>(1); // Page 1 by default
  public sortBy = signal<string>('-Date'); // Descending by default
  public tableReports = signal<ReportsTableRow[]>([]);
  public paginationInfo = signal<PaginationInfo | undefined>(undefined);
  public contentLoaded = signal<boolean>(false);

  ngOnInit(): void {
    this.getAllReports();
  }

  public getAllReports(): void {
    this.reportsService.getAllReports(this.currentFilter(), this.currentPage(), this.sortBy())
      .pipe(
        tap<ReportsResponse>(
          ({items, ...paginationData }) => this.paginationInfo.set(paginationData)
        ),
        map<ReportsResponse, ReportsTableRow[]>(
          ({ items }) => this.mapReportsToRows(items)
        ),
      )
      .subscribe((data) => { 
        this.tableReports.set(data);
        this.contentLoaded.set(true);
      });
  }

  public changePage(page: number): void {
    this.currentPage.set(page);
    this.getAllReports();
  }

  public goToNextPage(hasNextPage: boolean): void {
    if(hasNextPage) {
      this.currentPage.update(value => value + 1)
      this.getAllReports();
    }
  }

  public goToPreviousPage(hasPreviousPage: boolean): void {
    if(hasPreviousPage) {
      this.currentPage.update(value => value - 1)
      this.getAllReports();
    }
  }

  public applyFilter(filter: string): void {
    this.currentFilter.set(filter);
    this.getAllReports();
  }

  public sortReportsBy(sortBy: string): void {
    this.sortBy.update(value => {
      
      if(value.startsWith('-')) {
        return 'Date';
      } else {
        return '-Date';
      }
    });

    this.getAllReports();
  }

  private mapReportsToRows(items: Report[]): ReportsTableRow[] {
    return items.map(({date, productType, clientName, truckCompany, species}) => 
      ({date, productType, clientName, truckCompany, species})
    );
  }
}