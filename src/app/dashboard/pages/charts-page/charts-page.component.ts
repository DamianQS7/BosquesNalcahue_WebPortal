import { Component } from '@angular/core';
import { DynamicChartComponent } from '../../components/charts/dynamic-chart/dynamic-chart.component';

@Component({
  standalone: true,
  imports: [DynamicChartComponent],
  templateUrl: './charts-page.component.html',
  styleUrl: './charts-page.component.css'
})
export class ChartsPageComponent {

}
