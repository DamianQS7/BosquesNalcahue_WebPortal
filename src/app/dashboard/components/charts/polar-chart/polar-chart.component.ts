import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { SimpleChartDataset } from '@interfaces/chart-datasets.interface';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartsService } from '../../../services/charts.service';

@Component({
  selector: 'charts-polar-chart',
  standalone: true,
  imports: [ CommonModule, BaseChartDirective ],
  templateUrl: './polar-chart.component.html',
  styles: ``
})
export class PolarChartComponent {

  // Properties
  public polarAreaLegend = true;
  public polarChartOptions = input<ChartConfiguration['options']>({
    elements: {
      line: {
        tension: 1,
      },
    },
    scales: {
      r: {
        grid: { color: 'rgba(255,255,255,0.15)' },
        ticks: { color: 'white', backdropColor: '#334155', z: 100},
      },
    },
    borderColor: 'rgba(255, 255, 255, 0.3)',
    plugins: {
      legend: { 
        display: true, 
        labels: {
          color: 'rgba(255,255,255,0.9)'
        } 
      },
    },
  });
  public polarAreaChartType: ChartType = 'polarArea';
  public polarAreaChartLabels = input<string[]>(['No data to display']);
  public polarChartDatasets = input<SimpleChartDataset>({ data: [400, 200, 100], label: ''});

  public polarAreaChartData = computed<ChartData<'polarArea'>>(() => {
    return {
      labels: this.polarAreaChartLabels(),
      datasets: [this.polarChartDatasets()]
    };
  });

  
  // Events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {

  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {

  }
}
