import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'dashboard-monthly-percent-card',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './monthly-percent-card.component.css',
  template: `
  <div class="card-wrapper">
    <div class="w-52 2xl:w-72">
      <h3 class="card-title" 
        [ngClass]="{
            'teal': title() === 'Leña',
            'indigo': title() === 'Metro Ruma',
            'sky': title() === 'Trozo Aserrable',
        }"
      >
          {{title()}}
      </h3>
      <span class="card-subtitle">{{subtitle()}}</span>
    </div>
    <div class="card-percent-wrapper">
      <span class="card-percent"
        [ngClass]="{
          'teal': title() === 'Leña',
          'indigo': title() === 'Metro Ruma',
          'sky': title() === 'Trozo Aserrable',
          }"
      >
        {{percent()}}%
      </span>
    </div>
  </div>
  `,
})
export class MonthlyPercentCardComponent {
  
  // Properties
  title = input.required<string>();
  percent = input.required<number>();
  subtitle = input<string>('Porcentaje de despachos realizados en este mes');

}
