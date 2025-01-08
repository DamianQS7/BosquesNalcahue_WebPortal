import { Component, computed, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ReportsService } from '../data-access/reports.service';
import { DataTableComponent } from '../ui/data-table/data-table.component';
import { DropdownComponent } from '../ui/dropdown/dropdown.component';
import { PaginationNavComponent } from '../ui/pagination-nav/pagination-nav.component';
import { SearchBoxComponent } from '../ui/search-box/search-box.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../shared/services/toast.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ReportsTableRow, Report, DateFilterOptions, ProductFilterOptions } from '../interfaces/index';
import { WINDOW } from '../../shared/utils/injection-tokens';

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
  providers: [ ReportsService ],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export default class ReportsPageComponent implements OnDestroy {
  // Dependencies
  reportsService = inject(ReportsService);
  toasts = inject(ToastService);
  window = inject(WINDOW);

  // Properties
  private getPdfFileUriSubs?: Subscription;
  dateFilterOptions = DateFilterOptions;
  productFilterOptions = ProductFilterOptions;
  pageDate = new Date();
  tableReports = computed(() => this.mapReportsToRows(this.reportsService.reports()));
  
  // Methods
  ngOnDestroy(): void {
    this.getPdfFileUriSubs?.unsubscribe();
  }

  openPdfFileInNewTab(fileId: string): void {
    this.getPdfFileUriSubs = this.reportsService.getPdfFileUri(fileId)
      .subscribe((response) => {
        this.window.open(response.sasUri, '_blank');
      });
  }

  private mapReportsToRows = (items: Report[]): ReportsTableRow[] =>
    items.map(({id, fileId, date, folio, productType, clientName, species, productName}) => 
      ({id, fileId, date, folio, productType, clientName, species, productName})
    );
}
