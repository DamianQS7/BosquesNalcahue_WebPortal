import { AfterContentChecked, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ChartConfiguration } from 'chart.js';
import { ChartsService } from '../../services/charts.service';
import { SimpleChartDataset } from '@interfaces/chart-datasets.interface';
import { ReportsCountResponse } from '@interfaces/reports-count-response.interface';
import { DynamicChartComponent } from '../../components/charts/dynamic-chart/dynamic-chart.component';
import { PolarChartComponent } from '../../components/charts/polar-chart/polar-chart.component';
import { MonthlyPercentCardComponent } from '../../components/monthly-percent-card/monthly-percent-card.component';

@Component({
  standalone: true,
  imports: [ DynamicChartComponent, CommonModule, PolarChartComponent, MonthlyPercentCardComponent ],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.css'
})
export class ChartsPageComponent implements OnInit, AfterContentChecked, OnDestroy {
  
  // Services
  private chartsService: ChartsService = inject(ChartsService);

  // Properties
  public monthlyBreakdownChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  public monthlyBreakdownChartDataset = signal<SimpleChartDataset[]>([]);
  public monthlyBreakdownChartMaxY = signal<number>(10);
  public monthlyBreakdownChartOptions: ChartConfiguration['options'];

  public totalReportsChartLabels: string[] = ['Leña', 'Metro Ruma', 'Trozo Aserrable'];
  public totalReportsChartDataset = signal<SimpleChartDataset>({data: [], label: ''});

  private monthlyBreakdownChartSubs?: Subscription = new Subscription();
  private totalReportsChartSubs?: Subscription;

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

  ngOnDestroy(): void {
    this.monthlyBreakdownChartSubs?.unsubscribe();
    this.totalReportsChartSubs?.unsubscribe();
  }

  private initializeCharts(): void {

    // Monthly Breakdown Chart
    this.monthlyBreakdownChartSubs = this.chartsService.getMonthlyBreakdown()
      .pipe(
        map(response => this.chartsService.mapToChartDataset(response))
      )
      .subscribe( response => {
        this.monthlyBreakdownChartDataset.set(response); 
        this.monthlyBreakdownChartMaxY.set(this.chartsService.setMaxY(this.monthlyBreakdownChartDataset()));
      });

    // Total Reports per Year Chart
    this.totalReportsChartSubs = this.chartsService.getTotalCountByYear()
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
