import { AfterContentChecked, Component, inject, OnInit, signal } from '@angular/core';
import { DynamicChartComponent } from '../../components/charts/dynamic-chart/dynamic-chart.component';
import { ChartsService } from '../../services/charts.service';
import { SimpleChartDataset } from '@interfaces/chart-datasets.interface';
import { map } from 'rxjs';
import { MonthlyBreakdownResponse } from '@interfaces/monthly-breakdown-response.interface';
import { ChartConfiguration } from 'chart.js';

@Component({
  standalone: true,
  imports: [DynamicChartComponent],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.css'
})
export class ChartsPageComponent implements OnInit, AfterContentChecked {
  
  // Services
  private chartsService: ChartsService = inject(ChartsService);

  // Properties
  public monthlyBreakdownChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  public monthlyBreakdownChartDataset = signal<SimpleChartDataset[]>([]);
  public monthlyBreakdownChartMaxY = signal<number>(10);
  public monthlyBreakdownChartOptions: ChartConfiguration['options'];

  // --> Repetir las dos propiedades de arriba por cada chart

  // Methods

  ngOnInit(): void {
    this.initializeCharts();
  }

  ngAfterContentChecked(): void {
    this.monthlyBreakdownChartOptions = {
      elements: {
        line: {
          tension: 1,
        },
      },
      scales: {
        x: {},
        y: {
          min: 0,
          max: this.monthlyBreakdownChartMaxY()
        },
      },
      plugins: {
        legend: { display: true },
      },
    };
  }

  private initializeCharts(): void {
    // Call chartsService to populate properties that are the input for the chart
    this.chartsService.getMonthlyBreakdown()
      .pipe(
        map(response => this.mapToChartDataset(response))
      )
      .subscribe( response => {
        this.monthlyBreakdownChartDataset.set(response); 
        this.monthlyBreakdownChartMaxY.set(this.setMaxY());
      });
  }

  private mapToChartDataset(response: MonthlyBreakdownResponse ): SimpleChartDataset[] {
    let datasets: SimpleChartDataset[] = [
      { data: [...response.lena], label: 'Lena' },
      { data: [...response.metroRuma], label: 'Metro Ruma' },
      { data: [...response.trozoAserrable], label: 'Trozo Aserrable' }
    ]

    return datasets;
  }

  private setMaxY(): number {
    const max = Math.max(
      Math.max(...this.monthlyBreakdownChartDataset()[0].data),
      Math.max(...this.monthlyBreakdownChartDataset()[1].data),
      Math.max(...this.monthlyBreakdownChartDataset()[2].data)
    );
    console.log(max);
    return max + (max * 0.2);
  }
}
