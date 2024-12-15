import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeFormatService {

  public startTime: string = 'T00:00:00Z';
  public endTime: string = 'T23:59:59Z'; 

  formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getMonth() starts at 0 for January, so we need to add 1
    const day = date.getUTCDate();
  
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  getLastWeekStartDate(): string {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    return this.formatDate(date) + this.startTime;
  }
  
  getLastMonthStartDate(): string {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    return this.formatDate(date) + this.startTime;
  }
  
  getLastSixMonthsStartDate(): string {
    let date = new Date();
    date.setMonth(date.getMonth() - 6);
    return this.formatDate(date) + this.startTime;
  }
}
