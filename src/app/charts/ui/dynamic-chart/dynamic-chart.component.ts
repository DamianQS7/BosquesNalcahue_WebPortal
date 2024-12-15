import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Signal, viewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartsService } from '../../data-access/charts.service';
import { SimpleChartDataset } from '../../interfaces';

@Component({
  selector: 'charts-dynamic-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dynamic-chart.component.html',
  styles: ``
})
export class DynamicChartComponent {

  // Services
  private chartsService = inject(ChartsService);

  // Properties
  public barChartType: ChartType = 'bar';
  public chart = viewChild(BaseChartDirective);
  public maxY = input<number>(10);
  public barChartLabels = input<string[]>(['No data to display']);
  public barChartDatasets = input<SimpleChartDataset[]>([
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Lena' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Metro Ruma' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Trozo Aserrable' },
  ]);

  public barChartOptions: Signal<ChartConfiguration['options']> = computed(() => {
    return {
      elements: {
        line: {
          tension: 1,
        },
      },
      scales: {
        x: {
          ticks: {color: this.chartsService.chartColors().fontColor},
          grid: {color: this.chartsService.chartColors().gridColor}
        },
        y: {
          min: 0,
          max: this.maxY(),
          ticks: {color: this.chartsService.chartColors().fontColor},
          grid: {color: this.chartsService.chartColors().gridColor}
        }
      },
      plugins: {
        legend: { 
          display: true, 
          labels: {
            color: this.chartsService.chartColors().fontColor
          } 
        },
      },
      responsive: true,
      maintainAspectRatio: true
    }; 
  });
  
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
