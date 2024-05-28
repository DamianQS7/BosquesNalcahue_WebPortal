import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ReportsResponse } from '../../interfaces/reports-response.interface';
import { Observable } from 'rxjs';
import { DateTimeService } from './date-time.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  // Services
  private http: HttpClient = inject(HttpClient);
  private dateTime: DateTimeService = inject(DateTimeService);

  // Properties
  private readonly baseUrl: string = environment.baseUrl;
  private readonly endpoint: string = `${this.baseUrl}/reports`;

  // Methods
  public getAllReports(filter: string, page: number, sortBy: string): Observable<ReportsResponse> {

    const filterQuery = this.generateFilter(filter);
    const requestUrl = `${this.endpoint}?page=${page}&${filterQuery}&SortBy=${sortBy}`
    return this.http.get<ReportsResponse>(requestUrl);
  }

  private generateFilter(filter: string): string {
    const currentDate: string = this.dateTime.formatDate(new Date());
  
    switch (filter) {
      case 'Sin filtrar':
        return '';
      case 'Hoy':
        return `startDate=${currentDate + this.dateTime.startTime}&endDate=${currentDate + this.dateTime.endTime}`;
      case 'Semana Pasada':
        return `startDate=${this.dateTime.getLastWeekStartDate()}&endDate=${currentDate}`;
      case 'Mes Pasado':
        return `startDate=${this.dateTime.getLastMonthStartDate()}&endDate=${currentDate}`;
      case 'Últimos 6 Meses':
        return `startDate=${this.dateTime.getLastSixMonthsStartDate()}&endDate=${currentDate}`;
      default:
        return '';
    }
  }

}
