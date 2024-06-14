import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MonthlyBreakdownResponse } from '@interfaces/monthly-breakdown-response.interface';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
    
  // Services
  private http: HttpClient = inject(HttpClient);

  // Properties
  private baseUrl: string = environment.baseUrl;
  private endpoint: string = `${this.baseUrl}/analytics`;

  // Methods
  public getMonthlyBreakdown(): Observable<MonthlyBreakdownResponse> {
    const requestUrl: string = `${this.endpoint}/monthly-breakdown`;
    return this.http.get<MonthlyBreakdownResponse>(requestUrl)
  }

}
