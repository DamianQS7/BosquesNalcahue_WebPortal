import { Component, computed, inject, OnDestroy } from '@angular/core';
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
import { GetReportsResponse, PaginationInfo, ReportsTableRow, Report, DateFilterOptions, ProductFilterOptions } from '../../interfaces/index';

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
  
  
  tableReports = computed(() => this.mapReportsToRows(this.reportsService.reports()))
  

  ngOnDestroy(): void {
    this.getAllSubs?.unsubscribe();
    this.getByFolioSubs?.unsubscribe();
    this.getPdfFileUriSubs?.unsubscribe();
  }

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
