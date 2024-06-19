import { AfterContentChecked, Component, inject, OnInit, signal } from '@angular/core';
import { map } from 'rxjs';

import { ChartConfiguration } from 'chart.js';
import { DynamicChartComponent } from '../../components/charts/dynamic-chart/dynamic-chart.component';
import { ChartsService } from '../../services/charts.service';
import { SimpleChartDataset } from '@interfaces/chart-datasets.interface';
import { CommonModule } from '@angular/common';
import { PolarChartComponent } from '../../components/charts/polar-chart/polar-chart.component';
import { ReportsCountResponse } from '@interfaces/reports-count-response.interface';

@Component({
  standalone: true,
  imports: [ DynamicChartComponent, CommonModule, PolarChartComponent ],
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

  public totalReportsChartLabels: string[] = ['Leña', 'Metro Ruma', 'Trozo Aserrable'];
  public totalReportsChartDataset = signal<SimpleChartDataset>({data: [], label: ''});

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
        x: {
          ticks: {color: this.chartsService.chartFontColor},
          grid: {color: this.chartsService.chartGridColor}
        },
        y: {
          min: 0,
          max: this.monthlyBreakdownChartMaxY(),
          ticks: {color: this.chartsService.chartFontColor},
          grid: {color: this.chartsService.chartGridColor}
        }
      },
      plugins: {
        legend: { 
          display: true, 
          labels: {
            color: this.chartsService.chartFontColor
          } 
        },
      },
    };
  }

  private initializeCharts(): void {

    // Monthly Breakdown Chart
    this.chartsService.getMonthlyBreakdown()
      .pipe(
        map(response => this.chartsService.mapToChartDataset(response))
      )
      .subscribe( response => {
        this.monthlyBreakdownChartDataset.set(response); 
        this.monthlyBreakdownChartMaxY.set(this.chartsService.setMaxY(this.monthlyBreakdownChartDataset()));
      });

    // Total Reports per Year Chart
    this.chartsService.getTotalCountByYear()
      .pipe(
        map<ReportsCountResponse, SimpleChartDataset>(({lena, metroRuma, trozoAserrable}) => {
          return { 
            data: [lena, metroRuma, trozoAserrable], 
            label: '', 
            backgroundColor: [
              this.chartsService.chartTranslucentColorGreen,
              this.chartsService.chartTranslucentColorIndigo,
              this.chartsService.chartTranslucentColorSky
            ] 
          }
        })
      )
      .subscribe(dataset => this.totalReportsChartDataset.set(dataset));
  }
}
