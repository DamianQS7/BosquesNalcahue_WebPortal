import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyPercentCardComponent } from '../ui/monthly-percent-card/monthly-percent-card.component';
import { ChartsService } from '../data-access/charts.service';
import { DynamicChartComponent } from '../ui/dynamic-chart/dynamic-chart.component';
import { PolarChartComponent } from '../ui/polar-chart/polar-chart.component';
import { YearSelectorComponent } from '../ui/year-selector/year-selector.component';

@Component({
  standalone: true,
  imports: [ DynamicChartComponent, CommonModule, PolarChartComponent, MonthlyPercentCardComponent, YearSelectorComponent ],
  providers: [ ChartsService ],
  styleUrl: './charts-page.component.css',
  template: `
  <div class="flex flex-col gap-4">
    <section class="wrapper p-1 relative">
        <div class="wrapper w-full p-2 flex flex-col h-60 2xl:h-72">
            <div class="page-header z-10">
                <h1 class="blurred-bg page-title">Analisis Estadistico</h1>
                <div class="blurred-bg page-date">
                    <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" clip-rule="evenodd"/>
                    </svg>  
                    <h2>{{ currentDate | date:'fullDate' }}</h2>
                </div>
            </div>
            <div class="hidden sm:flex justify-between mx-5 my-3 2xl:my-8 2xl:mb-0 z-10">
                <dashboard-monthly-percent-card 
                    title="Leña" 
                    [percent]="chartsService.monthlyPercentages().lena"/>
                <dashboard-monthly-percent-card 
                    title="Metro Ruma" 
                    [percent]="chartsService.monthlyPercentages().metroRuma"/>
                <dashboard-monthly-percent-card 
                    title="Trozo Aserrable" 
                    [percent]="chartsService.monthlyPercentages().trozoAserrable"/>
            </div>
          </div>
          <img src="assets/img/charts-page-bg.jpg" alt="Foto de Milan Seitler en Unsplash" class="p-1 2xl:object-none light-dark-bg-img opacity-100 dark:opacity-0">
          <img src="assets/img/charts-page-bg-dark.jpg" alt="Photo by Thirdman at Pelexs.com" class="p-1 2xl:object-cover light-dark-bg-img opacity-0 dark:opacity-100">
      </section>
      
      <section class="sm:flex gap-3">
        <div class="wrapper sm:w-[63%] p-3 mb-2 sm:mb-0 2xl:p-8">
            <div class="sm:flex justify-between">
                <h1 class="section-title">Desglose de reportes por mes</h1>
                <charts-year-selector (yearChanged)="chartsService.getMonthlyBreakdownByYear($event)"/>
            </div>
            <charts-dynamic-chart
                [chartColors]="chartsService.chartColors()"
                [barChartLabels]="monthlyBreakdownChartLabels"
                [barChartDatasets]="chartsService.monthlyBreakdownData()"
                [maxY]="chartsService.monthlyBreakdownMaxYAxis()"/>
        </div>
        <div class="wrapper sm:w-[36%] py-3 px-2 2xl:p-8">
            <div class="sm:flex justify-between">
                <h1 class="section-title px-2 ">Total anual de reportes</h1>
                <charts-year-selector (yearChanged)="chartsService.getYearlyReportsByYear($event)" />
            </div>
            <charts-polar-chart
                [chartColors]="chartsService.chartColors()" 
                [polarAreaChartLabels]="totalReportsChartLabels"
                [polarChartDatasets]="chartsService.yearlyReportsCountData()"/>
        </div>
      </section>
  </div>
  `,
})
export default class ChartsPageComponent {
  // Services
  chartsService = inject(ChartsService);

  // Properties
  monthlyBreakdownChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  totalReportsChartLabels: string[] = ['Leña', 'Metro Ruma', 'Trozo Aserrable'];
  currentDate: Date = new Date();
}
