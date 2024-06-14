import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DynamicChartComponent } from '../../components/charts/dynamic-chart/dynamic-chart.component';
import { ChartsService } from '../../services/charts.service';
import { SimpleChartDataset } from '@interfaces/chart-datasets.interface';
import { map } from 'rxjs';
import { MonthlyBreakdownResponse } from '@interfaces/monthly-breakdown-response.interface';

@Component({
  standalone: true,
  imports: [DynamicChartComponent],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.css'
})
export class ChartsPageComponent implements OnInit{

  // Services
  private chartsService: ChartsService = inject(ChartsService);

  // Properties
  public monthlyBreakdownChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  public monthlyBreakdownChartDataset = signal<SimpleChartDataset[]>([]);

  // --> Repetir las dos propiedades de arriba por cada chart

  // Methods
  ngOnInit(): void {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    // Call chartsService to populate properties that are the input for the chart
    this.chartsService.getMonthlyBreakdown()
      .pipe(
        map(response => this.mapToChartDataset(response))
      )
      .subscribe( response => this.monthlyBreakdownChartDataset.set(response));
  }

  private mapToChartDataset(response: MonthlyBreakdownResponse ): SimpleChartDataset[] {
    let datasets: SimpleChartDataset[] = [
      { data: [...response.lena], label: 'Lena' },
      { data: [...response.metroRuma], label: 'Metro Ruma' },
      { data: [...response.trozoAserrable], label: 'Trozo Aserrable' }
    ]

    return datasets;
  }
}
