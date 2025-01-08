import { CommonModule } from '@angular/common';
import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartColors, ChartsEventsArgs, SimpleChartDataset } from '../../interfaces';

@Component({
  selector: 'charts-polar-chart',
  standalone: true,
  imports: [ CommonModule, BaseChartDirective ],
  styles: ``,
  template: `
  <canvas class="transition hover:shadow-slate-800 dark:hover:shadow-slate-200 hover:shadow-md z-10 mx-1 p-4 bordered-card"
    baseChart
    [data]="polarAreaChartData()"
    [legend]="polarAreaLegend"
    [type]="polarAreaChartType"
    [options]="polarChartOptions()"
  >
  </canvas>
  `,
})
export class PolarChartComponent {
  // Properties
  polarAreaLegend = true;
  polarAreaChartType: ChartType = 'polarArea';
  chartColors = input.required<ChartColors>();
  polarAreaChartLabels = input<string[]>(['No data to display']);
  polarChartDatasets = input.required<SimpleChartDataset>();

  // Computed Properties
  polarAreaChartData = computed<ChartData<'polarArea'>>(() => {
    return {
      labels: this.polarAreaChartLabels(),
      datasets: [this.polarChartDatasets()]
    };
  });

  polarChartOptions: Signal<ChartConfiguration['options']> = computed(() => {
    return {
      elements: {
        line: {
          tension: 1,
        },
      },
      scales: {
        r: {
          grid: {color: this.chartColors().gridColor },
          ticks: { color: 'white', backdropColor: '#334155', z: 100},
        },
      },
      borderColor: 'rgba(255, 255, 255, 0.3)',
      plugins: {
        legend: { 
          display: true, 
          labels: {
            color: this.chartColors().fontColor
          } 
        },
      },
    }
  });
  
  // Events
  chartClicked({ event, active, }: ChartsEventsArgs): void {}
  chartHovered({ event, active, }: ChartsEventsArgs): void {}
}
