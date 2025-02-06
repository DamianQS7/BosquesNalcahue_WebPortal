import { CommonModule } from '@angular/common';
import { Component, computed, input, Signal, viewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartColors, ChartsEventsArgs, SimpleChartDataset } from '../../interfaces';

@Component({
  selector: 'charts-dynamic-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <canvas 
      class="transition hover:shadow-slate-800 dark:hover:shadow-slate-200 hover:shadow-md z-10 m-0.5 overflow-x-auto p-3 bordered-card"
      baseChart
      [data]="barChartData()"
      [options]="barChartOptions()"
      [type]="barChartType"
      (chartHover)="chartHovered($event)"
      (chartClick)="chartClicked($event)"
    >
    </canvas>
  `,
  styles: ``
})
export class DynamicChartComponent {
  
  // Properties
  private chart = viewChild(BaseChartDirective);
  barChartType: ChartType = 'bar';
  maxY = input.required<number>();
  chartColors = input.required<ChartColors>();
  barChartLabels = input<string[]>(['No data to display']);
  barChartDatasets = input.required<SimpleChartDataset[]>();

  barChartOptions: Signal<ChartConfiguration['options']> = computed(() => {
    return {
      elements: {
        line: {
          tension: 1,
        },
      },
      scales: {
        x: {
          ticks: {color: this.chartColors().fontColor},
          grid: {color: this.chartColors().gridColor}
        },
        y: {
          min: 0,
          max: this.maxY(),
          ticks: {color: this.chartColors().fontColor},
          grid: {color: this.chartColors().gridColor}
        }
      },
      plugins: {
        legend: { 
          display: true, 
          labels: {
            color: this.chartColors().fontColor
          } 
        },
      },
      responsive: true,
      maintainAspectRatio: true
    }; 
  });
  
  barChartData = computed<ChartData<'bar'>>(() => ({
    labels: this.barChartLabels(),
    datasets: this.barChartDatasets(),
  }));

  // Events
  chartClicked({ event, active, }: ChartsEventsArgs): void {
    //console.log(event, active);
  }
  chartHovered({ event, active,}: ChartsEventsArgs): void {
    //console.log(event, active);
  }
  changeChartType = (): void  => { this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar' };
}


