import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MonthlyBreakdownResponse } from '@interfaces/monthly-breakdown-response.interface';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { SimpleChartDataset } from '@interfaces/chart-datasets.interface';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
    
  // Services
  private http: HttpClient = inject(HttpClient);

  // Properties
  public chartFontColor:   string = 'rgba(255,255,255,0.9)';
  public chartGridColor:   string = 'rgba(255,255,255,0.15)';
  public chartColorGreen:  string = '#99f6e4';
  public chartColorIndigo: string = '#a5b4fc';
  public chartColorSky:    string = '#7dd3fc';
  private baseUrl: string = environment.baseUrl;
  private endpoint: string = `${this.baseUrl}/analytics`;

  // Methods
  public getMonthlyBreakdown(): Observable<MonthlyBreakdownResponse> {
    const requestUrl: string = `${this.endpoint}/monthly-breakdown`;
    return this.http.get<MonthlyBreakdownResponse>(requestUrl)
  }

  public mapToChartDataset(response: MonthlyBreakdownResponse ): SimpleChartDataset[] {
    let datasets: SimpleChartDataset[] = [
      { data: [...response.lena], label: 'Leña', backgroundColor: [this.chartColorGreen] },
      { data: [...response.metroRuma], label: 'Metro Ruma', backgroundColor: [this.chartColorIndigo] },
      { data: [...response.trozoAserrable], label: 'Trozo Aserrable', backgroundColor: [this.chartColorSky] }
    ]

    return datasets;
  }

  public setMaxY(dataset: SimpleChartDataset[]): number {
    const max = Math.max(
      Math.max(...dataset[0].data),
      Math.max(...dataset[1].data),
      Math.max(...dataset[2].data)
    );
    console.log(max);
    return max + (max * 0.2);
  }

}
