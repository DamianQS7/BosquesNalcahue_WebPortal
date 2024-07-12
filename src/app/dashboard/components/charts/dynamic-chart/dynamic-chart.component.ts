import { CommonModule } from '@angular/common';
import { Component, computed, input, viewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SimpleChartDataset } from '../../../interfaces';

@Component({
  selector: 'charts-dynamic-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dynamic-chart.component.html',
  styles: ``
})
export class DynamicChartComponent {

  public chart = viewChild(BaseChartDirective);

  public barChartOptions = input<ChartConfiguration['options']>();
  public barChartLabels = input<string[]>(['No data to display']);
  
  // Input signal
  public barChartDatasets = input<SimpleChartDataset[]>([
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Lena' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Metro Ruma' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Trozo Aserrable' },
  ]);

  // Computed signal
  public barChartData = computed<ChartData<'bar'>>(() => {
    return {
      labels: this.barChartLabels(),
      datasets: this.barChartDatasets(),
    };
  })

  public barChartType: ChartType = 'bar';

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    //console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    //console.log(event, active);
  }

  public changeChartType(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }
}
