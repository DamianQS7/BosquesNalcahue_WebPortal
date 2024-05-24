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
  public getAllReports(filter: string): Observable<ReportsResponse> {

    const url = this.applyFilter(filter);
    console.log('Reports Service, new url: ', url);
    
    return this.http.get<ReportsResponse>(url);
  }

  private applyFilter(filter: string): string {
    let url: string           = this.endpoint;
    const currentDate: string = this.dateTime.formatDate(new Date());
  
    switch (filter) {
      case 'Sin filtrar':
        return url;
      case 'Hoy':
        return url = `${url}?startDate=${currentDate + this.dateTime.startTime}&endDate=${currentDate + this.dateTime.endTime}`;
      case 'Semana Pasada':
        return url = `${url}?startDate=${this.dateTime.getLastWeekStartDate()}&endDate=${currentDate}`;
      case 'Mes Pasado':
        return url = `${url}?startDate=${this.dateTime.getLastMonthStartDate()}&endDate=${currentDate}`;
      case 'Últimos 6 Meses':
        return url = `${url}?startDate=${this.dateTime.getLastSixMonthsStartDate()}&endDate=${currentDate}`;
      default:
        return url;
    }
  }

}
