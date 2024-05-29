import { Component, inject, OnInit, signal } from '@angular/core';
import { map, tap } from 'rxjs';

import { ReportsService } from '../../services/reports.service';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { PaginationNavComponent } from '../../components/pagination-nav/pagination-nav.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationInfo, ReportsTableRow, Report, ReportsResponse } from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [DataTableComponent, DropdownComponent, PaginationNavComponent, SearchBoxComponent, CommonModule],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export class ReportsPageComponent implements OnInit {

  private reportsService: ReportsService = inject(ReportsService);

  public pageDate: Date = new Date();
  public currentProductTypeFilter = signal<string>('Sin filtrar'); // Unfiltered by default
  public currentDateFilter = signal<string>('Sin filtrar'); // Unfiltered by default
  public currentPage = signal<number>(1); // Page 1 by default
  public sortBy = signal<string>('-Date'); // Descending by default
  public tableReports = signal<ReportsTableRow[]>([]);
  public paginationInfo = signal<PaginationInfo | undefined>(undefined);
  public contentLoaded = signal<boolean>(false);

  ngOnInit(): void {
    this.getAllReports();
  }

  public getAllReports(): void {
    this.reportsService.getAllReports(this.currentDateFilter(), this.currentProductTypeFilter(), this.currentPage(), this.sortBy())
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

  public applyDateFilter(filter: string): void {
    this.currentDateFilter.set(filter);
    this.getAllReports();
  }

  public applyProductTypeFilter(filter: string): void {
    this.currentProductTypeFilter.set(filter);
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

  public searchByFolio(folio: string): void {
    folio === '' ? this.getAllReports() 
                 : this.getReportByFolio(folio);
  }

  private getReportByFolio(folio: string): void {
    this.reportsService.getReportsByFolio(folio)
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

  private mapReportsToRows(items: Report[]): ReportsTableRow[] {
    return items.map(({date, folio, productType, clientName, species}) => 
      ({date, folio, productType, clientName, species})
    );
  }
}