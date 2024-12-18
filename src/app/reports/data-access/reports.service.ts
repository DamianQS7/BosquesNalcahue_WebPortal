import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, EMPTY, map, merge, Observable, of, switchMap, tap } from 'rxjs';
import { DateTimeFormatService } from '../../shared/services/date-time-format.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { connect } from 'ngxtension/connect';
import { FileUriResponse, GetReportsResponse, UpdateReportRequest, Report, PaginationInfo } from '../interfaces';

export interface ReportsServiceState {
  reports: Report[];
  paginationInfo: PaginationInfo | null;
  sortBy: string;
  currentPage: number;
  dateFilter: string;
  productTypeFilter: string;
  contentLoaded: boolean;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  // Services
  private http = inject(HttpClient);
  private dateTimeFormat = inject(DateTimeFormatService);

  // Properties
  private readonly baseUrl:  string = environment.baseUrl;
  private readonly reportsEndpoint: string = `${this.baseUrl}/reports`;
  private readonly blobEndpoint: string = `${this.baseUrl}/blob`;

  // State
  private state = signal<ReportsServiceState>({
    reports: [],
    paginationInfo: null,
    sortBy: '-Date',
    currentPage: 1,
    dateFilter: 'Sin filtrar',
    productTypeFilter: 'Sin filtrar',
    contentLoaded: false,
    errorMessage: null
  });

  // Selectors
  reports = computed(() => this.state().reports);
  paginationInfo = computed(() => this.state().paginationInfo);
  sortBy = computed(() => this.state().sortBy);
  currentPage = computed(() => this.state().currentPage);
  dateFilter = computed(() => this.state().dateFilter);
  productTypeFilter = computed(() => this.state().productTypeFilter);
  contentLoaded = computed(() => this.state().contentLoaded);
  

  // Computed properties
  private dateFilterQuery = computed(() => this.generateDateFilter(this.state().dateFilter));
  private productFilterQuery = computed(() => this.generateProductFilter(this.state().productTypeFilter));
  private sortyByQuery = computed(() => {});
  private getAllReportsEndpoint = computed(() => 
    `${this.reportsEndpoint}?page=${this.currentPage()}${this.dateFilterQuery()}${this.productFilterQuery()}&SortBy=${this.sortBy()}`
  )

  // Sources
  private getAllReportsEndpoint$ = toObservable(this.getAllReportsEndpoint);
  private getAllReportsRequest$ = this.getAllReportsEndpoint$.pipe(
    switchMap(endpoint => this.http.get<GetReportsResponse>(endpoint).pipe(
      catchError(error => {
        this.state.update(state => ({
          ...state, 
          errorMessage: error,
          contentLoaded: true
        }))
        return EMPTY;
      })
    ))
  );

  constructor() {
    const updatedState$ = merge(
      this.getAllReportsRequest$.pipe(map(({items, ...paginationInfo}) => ({
        reports: items,
        paginationInfo: paginationInfo,
        contentLoaded: true
      })))
    );

    connect(this.state).with(updatedState$)
  }

  // Actions - Reducers
  setDateFilter(filter: string): void { 
    this.state.update((state) => ({
      ...state, dateFilter: filter, contentLoaded: false
    }));
  }
  setProductFilter(filter: string): void { 
    this.state.update((state) => ({
      ...state, productTypeFilter: filter, contentLoaded: false
    }));
  }
  setSortingOrder(): void { 
    this.state.update(({sortBy, ...state}) => ({
      ...state, 
      sortBy: sortBy.startsWith('-') ? 'Date' : '-Date', 
      contentLoaded: false
    }));
  }
  changePage(filter: string): void { 
    this.state.update((state) => ({
      ...state, dateFilter: filter, contentLoaded: false
    }))
  }

  // Methods
  deleteById(id: string): Observable<boolean> {
    const requestUrl: string = `${this.reportsEndpoint}/${id}`;
    return this.http.delete<boolean>(requestUrl).pipe(
      map(() => true),
      catchError(error => {
        console.log('Error deleting the report', error);
        return of(false);
      })
    );
  }

  deleteFileByFileId(fileId: string) {
    const requestUrl: string = `${this.blobEndpoint}/reports/${fileId}`;
    return this.http.delete(requestUrl);
  }

  

  getPdfFileUri(fileId: string): Observable<FileUriResponse> {
    const requestUrl: string = `${this.blobEndpoint}/reports/${fileId}`;
    return this.http.get<FileUriResponse>(requestUrl).pipe(
      tap(console.log)
    ); 
  }

  getReportsById(id: string): Observable<Report> {
    const requestUrl: string = `${this.reportsEndpoint}/${id}`;
    return this.http.get<Report>(requestUrl);
  }

  getReportsByFolio(folio: string): Observable<GetReportsResponse> {
    const queryParam: string = `folio=${folio}`;
    const requestUrl: string = `${this.reportsEndpoint}?${queryParam}`;
    return this.http.get<GetReportsResponse>(requestUrl);
  }

  updateReport(id: string, report: UpdateReportRequest): Observable<Report> {
    const requestUrl: string = `${this.reportsEndpoint}/${id}`;
    return this.http.put<Report>(requestUrl, report);
  }

  // Helpers
  private generateDateFilter(filter: string): string {
    const currentDate: string = this.dateTimeFormat.formatDate(new Date());
  
    switch (filter) {
      case 'Sin filtrar':
        return '';
      case 'Hoy':
        return `&startDate=${currentDate + this.dateTimeFormat.startTime}&endDate=${currentDate + this.dateTimeFormat.endTime}`;
      case 'Semana Pasada':
        return `&startDate=${this.dateTimeFormat.getLastWeekStartDate()}&endDate=${currentDate}`;
      case 'Mes Pasado':
        return `&startDate=${this.dateTimeFormat.getLastMonthStartDate()}&endDate=${currentDate}`;
      case 'Últimos 6 Meses':
        return `&startDate=${this.dateTimeFormat.getLastSixMonthsStartDate()}&endDate=${currentDate}`;
      default:
        return '';
    }
  }

  private generateProductFilter(filter: string): string {
    return filter === 'Sin filtrar' ? '' : `&ProductType=${filter}`;
  }
}
