import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ReportsResponse } from '../../interfaces/reports-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private http: HttpClient = inject(HttpClient);

  private readonly baseUrl: string = environment.baseUrl;
  private readonly endpoint: string = `${this.baseUrl}/reports`;

  public getAllReports(filter: string = 'Filtrar'): Observable<ReportsResponse> {

    let url: string = this.endpoint;
    const currentDate = this.formatDate(new Date());
  
    switch (filter) {
      case 'Hoy':
        url = `${url}?startDate=${currentDate}&endDate=${currentDate}`;
        break;
      case 'Semana pasada':
        url = `${url}?startDate=${this.getLastWeekStartDate()}&endDate=${currentDate}`;
        break;
      case 'Mes pasado':
        url = `${url}?startDate=${this.getLastMonthStartDate()}&endDate=${currentDate}`;
        break;
      case 'Últimos 6 meses':
        url = `${url}?startDate=${this.getLastSixMonthsStartDate()}&endDate=${currentDate}`;
        break;
    }
  
    return this.http.get<ReportsResponse>(url);
  }

  private formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getMonth() starts at 0 for January, so we need to add 1
    const day = date.getUTCDate();
  
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  private getLastWeekStartDate(): string {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    return this.formatDate(date);
  }
  
  private getLastMonthStartDate(): string {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    return this.formatDate(date);
  }
  
  private getLastSixMonthsStartDate(): string {
    let date = new Date();
    date.setMonth(date.getMonth() - 6);
    return this.formatDate(date);
  }
}
