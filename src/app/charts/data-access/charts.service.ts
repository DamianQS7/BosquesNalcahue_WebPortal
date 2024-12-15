import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MonthlyBreakdownResponse } from '../interfaces/monthly-breakdown-response.interface';
import { environment } from '../../../environments/environment';
import { SimpleChartDataset } from '../interfaces/chart-datasets.interface';
import { ReportsCountResponse } from '../interfaces/reports-count-response.interface';
import { ThemeService } from '../../shared/services/theme.service';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
    
  // Services
  private http: HttpClient = inject(HttpClient);
  private themeService: ThemeService = inject(ThemeService);

  // Properties
  public isDarkTheme = computed(() => this.themeService.isDarkTheme());
  public chartColors = computed(() => ({
    fontColor:        this.isDarkTheme() ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)',
    gridColor:        this.isDarkTheme() ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
    green:            this.isDarkTheme() ? 'rgba(153, 246, 228, 1)' : 'rgba(142, 212, 198, 1)',
    translucentGreen: this.isDarkTheme() ? 'rgba(153, 246, 228, 0.7)' : 'rgba(142, 212, 198, 0.7)',
    indigo: '#a5b4fc',
    translucentIndigo: 'rgba(165, 180, 252, 0.6)',
    sky: '#7dd3fc',
    translucentSky: 'rgba(125, 211, 252, 0.7)'
  }));

  private baseUrl: string = environment.baseUrl;
  private endpoint: string = `${this.baseUrl}/analytics`;

  // Methods
  getMonthlyBreakdown(): Observable<MonthlyBreakdownResponse> {
    const requestUrl: string = `${this.endpoint}/monthly-breakdown`;
    return this.http.get<MonthlyBreakdownResponse>(requestUrl)
  }

  getTotalCountByYear(): Observable<ReportsCountResponse> {
    const currentYear = new Date().getFullYear();
    const queryParam = `startDate=${currentYear}/01/01&endDate=${currentYear}/12/31`;
  
    const requestUrl: string = `${this.endpoint}/reports-count-period?${queryParam}`;
    return this.http.get<ReportsCountResponse>(requestUrl);
  }

  mapToChartDataset(response: MonthlyBreakdownResponse ): SimpleChartDataset[] {
    let datasets: SimpleChartDataset[] = [
      { data: [...response.lena], label: 'Leña', backgroundColor: [this.chartColors().green] },
      { data: [...response.metroRuma], label: 'Metro Ruma', backgroundColor: [this.chartColors().indigo] },
      { data: [...response.trozoAserrable], label: 'Trozo Aserrable', backgroundColor: [this.chartColors().sky] }
    ]

    return datasets;
  }

  setMaxY(dataset: SimpleChartDataset[]): number {
    const data = dataset.flatMap(d => d.data);
    const max = Math.max(...data);
    return Math.round(max + (max * 0.2));
  }

}
