import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Subscription, tap } from 'rxjs';

import { ReportsService } from '../../data-access/reports.service';
import { DataTableComponent } from '../../ui/data-table/data-table.component';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { PaginationNavComponent } from '../../ui/pagination-nav/pagination-nav.component';
import { SearchBoxComponent } from '../../ui/search-box/search-box.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { GetReportsResponse, PaginationInfo, ReportsTableRow, Report, DateFilterOptions, ProductFilterOptions } from '../../interfaces/index'
import { ColumnTitles } from '../../../shared/interfaces';

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
export default class ReportsPageComponent implements OnDestroy {

  reportsService = inject(ReportsService);
  toasts = inject(ToastService);

  dateFilterOptions = DateFilterOptions;
  productFilterOptions = ProductFilterOptions;
  private getAllSubs?: Subscription;
  private getByFolioSubs?: Subscription;
  private getPdfFileUriSubs?: Subscription;
  public pageDate: Date = new Date();
  
  
  public currentPage = signal<number>(1); // Page 1 by default
  tableReports = computed(() => this.mapReportsToRows(this.reportsService.reports()))
  public paginationInfo = signal<PaginationInfo | undefined>(undefined);
  

  ngOnDestroy(): void {
    this.getAllSubs?.unsubscribe();
    this.getByFolioSubs?.unsubscribe();
    this.getPdfFileUriSubs?.unsubscribe();
  }

  // public changePage(page: number): void {
  //   this.currentPage.set(page);
  //   this.getAllReports();
  // }

  

  // public goToNextPage(hasNextPage: boolean): void {
  //   if(hasNextPage) {
  //     this.currentPage.update(value => value + 1)
  //     this.getAllReports();
  //   }
  // }

  // public goToPreviousPage(hasPreviousPage: boolean): void {
  //   if(hasPreviousPage) {
  //     this.currentPage.update(value => value - 1)
  //     this.getAllReports();
  //   }
  // }

  public openPdfFileInNewTab(fileId: string): void {
    this.getPdfFileUriSubs = this.reportsService.getPdfFileUri(fileId)
      .subscribe((response) => {
        window.open(response.sasUri, '_blank');
      });
  }


  // public searchByFolio(folio: string): void {
  //   folio === '' ? this.getAllReports() 
  //                : this.getReportByFolio(folio);
  // }

  // private getReportByFolio(folio: string): void {
  //   this.contentLoaded.set(false);
  //   this.getByFolioSubs = this.reportsService.getReportsByFolio(folio)
  //     .pipe(
  //       tap<GetReportsResponse>(
  //         ({items, ...paginationData }) => this.paginationInfo.set(paginationData)
  //       ),
  //       map<GetReportsResponse, ReportsTableRow[]>(
  //         ({ items }) => this.mapReportsToRows(items)
  //       ),
  //     )
  //     .subscribe((data) => { 
  //       this.tableReports.set(data);
  //       this.contentLoaded.set(true);
  //     });
  // }

  private mapReportsToRows(items: Report[]): ReportsTableRow[] {
    return items.map(({id, fileId, date, folio, productType, clientName, species, productName}) => 
      ({id, fileId, date, folio, productType, clientName, species, productName})
    );
  }
}
