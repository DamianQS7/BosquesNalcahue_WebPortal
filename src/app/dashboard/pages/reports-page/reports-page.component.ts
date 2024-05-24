import { Component, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { ReportsService } from '../../services/reports.service';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';

@Component({
  standalone: true,
  imports: [DataTableComponent, DropdownComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export class ReportsPageComponent implements OnInit {

  private reportsService: ReportsService = inject(ReportsService);

  public currentFilter = signal<string>('Sin filtrar'); 
  
  // private applyFilterEffect = effect(() => {
  //   this.getAllReports();
  // });

  ngOnInit(): void {
    this.getAllReports();
  }

  public getAllReports(): void {
    this.reportsService.getAllReports(this.currentFilter()).subscribe(
      (response)=> console.log({response})
    )
  }

  public setFilter(filter: string): void {
    this.currentFilter.set(filter);
    this.getAllReports();
  }
}