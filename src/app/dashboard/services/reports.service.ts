import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Report, ReportsResponse } from '../interfaces/reports-response.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { DateTimeService } from './date-time.service';
import { UpdateReportDto } from '../interfaces';
import { FileUriResponse } from '../interfaces/file-uri-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  // Services
  private http: HttpClient = inject(HttpClient);
  private dateTime: DateTimeService = inject(DateTimeService);

  // Properties
  private readonly baseUrl:  string = environment.baseUrl;
  private readonly reportsEndpoint: string = `${this.baseUrl}/reports`;
  private readonly blobEndpoint: string = `${this.baseUrl}/blob`;


  // Methods
  public deleteById(id: string): Observable<boolean> {
    const requestUrl: string = `${this.reportsEndpoint}/${id}`;
    return this.http.delete<boolean>(requestUrl).pipe(
      map(() => true),
      catchError(error => {
        console.log('Error deleting the report', error);
        return of(false);
      })
    );
  }

  public deleteFileByFileId(fileId: string) {
    const requestUrl: string = `${this.blobEndpoint}/${fileId}`;
    return this.http.delete(requestUrl);
  }

  public getAllReports(
    dateFilter: string, 
    productFilter: string, 
    page: number, sortBy: 
    string): Observable<ReportsResponse> {

    const dateFilterQuery:    string = this.generateDateFilter(dateFilter);
    const productFilterQuery: string = this.generateProductFilter(productFilter);
    const requestUrl:         string = `${this.reportsEndpoint}?page=${page}${dateFilterQuery}${productFilterQuery}&SortBy=${sortBy}`
    return this.http.get<ReportsResponse>(requestUrl);
  }

  public getPdfFileUri(fileId: string): Observable<FileUriResponse> {
    const requestUrl: string = `${this.blobEndpoint}/${fileId}`;
    return this.http.get<FileUriResponse>(requestUrl).pipe(
      tap(console.log)
    ); 
  }

  public getReportsById(id: string): Observable<Report> {
    const requestUrl: string = `${this.reportsEndpoint}/${id}`;
    return this.http.get<Report>(requestUrl);
  }

  public getReportsByFolio(folio: string): Observable<ReportsResponse> {
    const queryParam: string = `folio=${folio}`;
    const requestUrl: string = `${this.reportsEndpoint}?${queryParam}`;
    return this.http.get<ReportsResponse>(requestUrl);
  }

  public updateReport(id: string, report: UpdateReportDto): Observable<Report> {
    const requestUrl: string = `${this.reportsEndpoint}/${id}`;
    return this.http.put<Report>(requestUrl, report);
  }

  // Helpers
  private generateDateFilter(filter: string): string {
    const currentDate: string = this.dateTime.formatDate(new Date());
  
    switch (filter) {
      case 'Sin filtrar':
        return '';
      case 'Hoy':
        return `&startDate=${currentDate + this.dateTime.startTime}&endDate=${currentDate + this.dateTime.endTime}`;
      case 'Semana Pasada':
        return `&startDate=${this.dateTime.getLastWeekStartDate()}&endDate=${currentDate}`;
      case 'Mes Pasado':
        return `&startDate=${this.dateTime.getLastMonthStartDate()}&endDate=${currentDate}`;
      case 'Últimos 6 Meses':
        return `&startDate=${this.dateTime.getLastSixMonthsStartDate()}&endDate=${currentDate}`;
      default:
        return '';
    }
  }

  private generateProductFilter(filter: string): string {
    switch (filter) {
      case 'Sin filtrar':
        return '';
      case 'Leña':
        return `&ProductType=Leña`;
      case 'Metro Ruma':
        return `&ProductType=Metro Ruma`;
      case 'Trozo Aserrable':
        return `&ProductType=Trozo Aserrable`;
      default:
        return '';
    }
  }

}
