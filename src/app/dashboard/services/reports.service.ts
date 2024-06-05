import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Report, ReportsResponse } from '../../interfaces/reports-response.interface';
import { Observable } from 'rxjs';
import { DateTimeService } from './date-time.service';
import { UpdateReportDto } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  // Services
  private http: HttpClient = inject(HttpClient);
  private dateTime: DateTimeService = inject(DateTimeService);

  // Properties
  private readonly baseUrl:  string = environment.baseUrl;
  private readonly endpoint: string = `${this.baseUrl}/reports`;

  // Methods
  public getAllReports(dateFilter: string, productFilter: string, page: number, sortBy: string): Observable<ReportsResponse> {

    const dateFilterQuery:    string = this.generateDateFilter(dateFilter);
    const productFilterQuery: string = this.generateProductFilter(productFilter);
    const requestUrl:         string = `${this.endpoint}?page=${page}${dateFilterQuery}${productFilterQuery}&SortBy=${sortBy}`
    return this.http.get<ReportsResponse>(requestUrl);
  }

  public getReportsById(id: string): Observable<Report> {
    const requestUrl: string = `${this.endpoint}/${id}`;
    return this.http.get<Report>(requestUrl);
  }

  public getReportsByFolio(folio: string): Observable<ReportsResponse> {
    const queryParam: string = `folio=${folio}`;
    const requestUrl: string = `${this.endpoint}?${queryParam}`;
    return this.http.get<ReportsResponse>(requestUrl);
  }

  public updateReport(id: string, report: UpdateReportDto): Observable<Report> {
    const requestUrl: string = `${this.endpoint}/${id}`;
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
