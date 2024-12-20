import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Subscription, tap } from 'rxjs';

import { ReportsService } from '../../services/reports.service';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { PaginationNavComponent } from '../../components/pagination-nav/pagination-nav.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { PaginationInfo, ReportsTableRow, Report, ReportsResponse } from '../../interfaces/index';
import { ToastComponent } from '../../components/toast/toast.component';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [
    DataTableComponent, 
    DropdownComponent, 
    PaginationNavComponent, 
    SearchBoxComponent, 
    CommonModule, 
    ToastComponent,
    SpinnerComponent
  ],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export class ReportsPageComponent implements OnInit, OnDestroy {

  private reportsService: ReportsService = inject(ReportsService);
  public toasts: ToastService = inject(ToastService);

  private getAllSubs?: Subscription;
  private getByFolioSubs?: Subscription;
  private getPdfFileUriSubs?: Subscription;
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

  ngOnDestroy(): void {
    this.getAllSubs?.unsubscribe();
    this.getByFolioSubs?.unsubscribe();
    this.getPdfFileUriSubs?.unsubscribe();
  }

  public applyDateFilter(filter: string): void {
    this.currentDateFilter.set(filter);
    this.getAllReports();
  }

  public applyProductTypeFilter(filter: string): void {
    this.currentProductTypeFilter.set(filter);
    this.getAllReports();
  }

  public changePage(page: number): void {
    this.currentPage.set(page);
    this.getAllReports();
  }

  public getAllReports(): void {
    this.contentLoaded.set(false);
    this.getAllSubs = this.reportsService.getAllReports(this.currentDateFilter(), this.currentProductTypeFilter(), this.currentPage(), this.sortBy())
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

  public openPdfFileInNewTab(fileId: string): void {
    this.getPdfFileUriSubs = this.reportsService.getPdfFileUri(fileId)
      .subscribe((response) => {
        window.open(response.sasUri, '_blank');
      });
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
    this.contentLoaded.set(false);
    this.getByFolioSubs = this.reportsService.getReportsByFolio(folio)
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
    return items.map(({id, fileId, date, folio, productType, clientName, species, productName}) => 
      ({id, fileId, date, folio, productType, clientName, species, productName})
    );
  }
}
