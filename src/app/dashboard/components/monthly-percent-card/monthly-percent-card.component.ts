import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'dashboard-monthly-percent-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-percent-card.component.html',
  styleUrl: './monthly-percent-card.component.css'
})
export class MonthlyPercentCardComponent {
  
  // Properties
  public title = input<string>('');
  public subtitle = input<string>('Porcentaje de despachos realizados en este mes');
  public percent = input<number>(0);

}
