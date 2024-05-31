import { CommonModule } from '@angular/common';
import { Component, computed, input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SimpleChartDataset } from '../../../../interfaces';

@Component({
  selector: 'charts-dynamic-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dynamic-chart.component.html',
  styleUrl: './dynamic-chart.component.css'
})
export class DynamicChartComponent {

  @ViewChild(BaseChartDirective) 
  public chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.1,
      },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
        max: 100
      },
    },
    plugins: {
      legend: { display: true },
    },
  };

  // Input signal here
  public barChartLabels = input<string[]>([
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ]);
  
  // Input signal here
  public barChartDatasets = input<SimpleChartDataset[]>([
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  ]);

  public barChartType: ChartType = 'bar';

  // This will be a computed signal
  public barChartData = computed<ChartData<'bar'>>(() => {
    return {
      labels: this.barChartLabels(),
      datasets: this.barChartDatasets(),
    };
  })

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public changeChartType(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }
}
