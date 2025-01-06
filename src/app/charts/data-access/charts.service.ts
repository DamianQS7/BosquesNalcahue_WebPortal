import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, map, merge, startWith, Subject, switchMap } from 'rxjs';

import { MonthlyBreakdownResponse } from '../interfaces/monthly-breakdown-response.interface';
import { environment } from '../../../environments/environment';
import { SimpleChartDataset } from '../interfaces/chart-datasets.interface';
import { ReportsCountResponse } from '../interfaces/reports-count-response.interface';
import { ThemeService } from '../../shared/services/theme.service';
import { connect } from 'ngxtension/connect';

export type ChartsServiceStatus = 'pending' | 'loading' | 'loaded' | 'error';
export interface ChartsServiceState {
  status: ChartsServiceStatus;
  monthlyBreakdownData: SimpleChartDataset[];
  yearlyReportsCountData: SimpleChartDataset;
}

@Injectable()
export class ChartsService {
  // Services
  private http: HttpClient = inject(HttpClient);
  private themeService: ThemeService = inject(ThemeService);

  // Properties
  private readonly baseEndpoint: string = `${environment.baseUrl}/analytics`;
  private readonly monthlyBreakdownEndpoint: string = `${this.baseEndpoint}/monthly-breakdown`;
  private readonly yearlyReportsCountEndpoint: string = `${this.baseEndpoint}/reports-count-period`;

  // State
  private state = signal<ChartsServiceState>({
    status: 'pending',
    monthlyBreakdownData: [],
    yearlyReportsCountData: { data: [], label: '', backgroundColor: [] }
  });

  // Selectors
  status = computed(() => this.state().status);
  monthlyBreakdownData = computed(() => this.state().monthlyBreakdownData);
  yearlyReportsCountData = computed(() => this.state().yearlyReportsCountData);

  // Computed Props
  private isDarkTheme = computed(() => this.themeService.isDarkTheme());
  monthlyBreakdownMaxYAxis = computed(() => this.setMaxYAxis(this.monthlyBreakdownData()));
  chartColors = computed(() => ({
    fontColor: this.isDarkTheme() ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)',
    gridColor: this.isDarkTheme() ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
    translucentGreen: this.isDarkTheme() ? 'rgba(153, 246, 228, 0.7)' : 'rgba(142, 212, 198, 0.7)',
    green: this.isDarkTheme() ? 'rgba(153, 246, 228, 1)' : 'rgba(142, 212, 198, 1)',
    translucentIndigo: 'rgba(165, 180, 252, 0.6)',
    translucentSky: 'rgba(125, 211, 252, 0.7)',
    indigo: '#a5b4fc',
    sky: '#7dd3fc',
  }));
  monthlyPercentages = computed(() => {
    const dataset = this.monthlyBreakdownData();
    const currentMonth = new Date().getMonth();

    const monthlyCount = {
      lena: dataset[0]?.data[currentMonth] || 0,
      metroRuma: dataset[1]?.data[currentMonth] || 0,
      trozoAserrable: dataset[2]?.data[currentMonth] || 0,
    };

    const monthlyTotal = Object.values(monthlyCount).reduce((sum, count) => sum + count, 0);

    const calculatePercentage = (count: number) => {
      if (monthlyTotal === 0)
        return 0;

      return parseFloat(((count / monthlyTotal) * 100).toFixed(1));
    };

    return {
      lena: calculatePercentage(monthlyCount.lena),
      metroRuma: calculatePercentage(monthlyCount.metroRuma),
      trozoAserrable: calculatePercentage(monthlyCount.trozoAserrable),
    };
  });

  // Sources
  private getMonthlyBreakdownData$ = this.http.get<MonthlyBreakdownResponse>(this.monthlyBreakdownEndpoint).pipe(
    catchError(error => {
      this.state.update(state => ({...state, status: 'error', monthlyBreakdownData: []}));
      return EMPTY;
    }),
    map(response => this.mapToSimpleChartDatasetArray(response)),
  );
  private queryParamByYear$ = new Subject<number>().pipe(
    startWith(new Date().getFullYear()),
    map(year => `startDate=${year}/01/01&endDate=${year}/12/31`),
  );
  private getyearlyReportsCountData$ = this.queryParamByYear$.pipe(
    switchMap(period => this.http.get<ReportsCountResponse>(`${this.yearlyReportsCountEndpoint}?${period}`).pipe(
      catchError(error => {
        this.state.update(state => ({ 
          ...state, 
          status: 'error', 
          yearlyReportsCountData: { data: [], label: '', backgroundColor: [] }}));
        return EMPTY;
      })
    )),
    map(response => this.mapToSimpleChartDataset(response)),
  );


  constructor() {
    const updatedState$ = merge(
      this.getMonthlyBreakdownData$.pipe(map(data => ({ monthlyBreakdownData: data, status: 'loaded' as const }))),
      this.getyearlyReportsCountData$.pipe(map(data => ({ yearlyReportsCountData: data, status: 'loaded' as const }))),
    );

    connect(this.state).with(updatedState$);
  }

  // Methods
  private mapToSimpleChartDatasetArray = (response: MonthlyBreakdownResponse ): SimpleChartDataset[] =>
    [
      { data: [...response.lena], label: 'Leña', backgroundColor: [this.chartColors().green] },
      { data: [...response.metroRuma], label: 'Metro Ruma', backgroundColor: [this.chartColors().indigo] },
      { data: [...response.trozoAserrable], label: 'Trozo Aserrable', backgroundColor: [this.chartColors().sky] }
    ];
  
  private mapToSimpleChartDataset = (response: ReportsCountResponse): SimpleChartDataset => ({
    data: [response.lena, response.metroRuma, response.trozoAserrable],
    label: '',
    backgroundColor: [
      this.chartColors().translucentGreen,
      this.chartColors().translucentIndigo,
      this.chartColors().translucentSky
    ]
  });

  private setMaxYAxis(dataset: SimpleChartDataset[]): number {
    const data = dataset.flatMap(d => d.data);
    const max = Math.max(...data);
    return Math.round(max + (max * 0.2));
  }
}
