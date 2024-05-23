import { Component, inject, OnInit } from '@angular/core';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { ReportsService } from '../../services/reports.service';

@Component({
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.css'
})
export class ReportsPageComponent implements OnInit {

  private reportsService: ReportsService = inject(ReportsService);

  public currentFilter: string = 'Hoy';

  ngOnInit(): void {
    this.getAllReports();
  }

  public getAllReports(): void {
    this.reportsService.getAllReports(this.currentFilter).subscribe(
      (asd)=> console.log({asd})
    )
  }
}