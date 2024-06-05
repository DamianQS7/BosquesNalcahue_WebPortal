import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ReportsService } from '../../services/reports.service';
import { Report, EditableReport } from '@interfaces/index';

@Component({
  standalone: true,
  imports: [ ReactiveFormsModule, ],
  templateUrl: './edit-report-page.component.html',
  styleUrl: './edit-report-page.component.css'
})
export class EditReportPageComponent implements OnInit, OnDestroy {
  // Services
  private reportsService: ReportsService = inject(ReportsService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  // Properties
  private getReportSubs?: Subscription;
  private updateReportSubs?: Subscription;
  public reportToSubmit?: Report;

  public form: FormGroup = this.fb.group({
    folio:         ['', [Validators.required]],
    date:          ['', [Validators.required]],
    origin:        ['', [Validators.required]],
    productName:   ['', [Validators.required]],
    clientName:    ['', [Validators.required]],
    clientId:      ['', [Validators.required]],
    truckCompany:  ['', [Validators.required]],
    truckDriver:   ['', [Validators.required]],
    truckDriverId: ['', [Validators.required]],
    truckPlate:    ['', [Validators.required]],
  });

  //Methods
  
  ngOnInit(): void {
    this.loadReportOnInit();
  }

  ngOnDestroy(): void {
    this.getReportSubs?.unsubscribe();
    this.updateReportSubs?.unsubscribe();
  }

  public onSubmit() {
    if(this.reportToSubmit) {      
      // Map the values in the form to the reportToSubmit property
      Object.assign(this.reportToSubmit, this.form.value);
      
      // Call the update method from the service
      console.log('Submiting report to Update')
      const {id, ...report} = this.reportToSubmit;
      this.updateReportSubs = this.reportsService.updateReport(id, report)
                                .subscribe( console.log );

      // Navigate back to the table
      
    }
  }

  private getReportToEdit(id: string): void {
    this.getReportSubs = this.reportsService.getReportsById(id)
      .pipe(
        tap<Report>(report => this.reportToSubmit = report),
        map<Report, EditableReport>((report) => this.mapReportToEditable(report))
      )
      .subscribe(report => {
        this.setFormValues(report);
      });
  }

  private loadReportOnInit(): void {
    this.activatedRoute.params
      .subscribe(params => {
        const id = params['id'];
        this.getReportToEdit(id);
      });
  }

  private setFormValues(report: EditableReport): void {
    const date = new Date(report.date);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    this.form.setValue({
      folio: report.folio ?? '',
      date: formattedDate ?? '',
      origin: report.origin ?? '',
      productName: report.productName ?? '',
      clientName: report.clientName ?? '',
      clientId: report.clientId ?? '',
      truckCompany: report.truckCompany ?? '',
      truckDriver: report.truckDriver ?? '',
      truckDriverId: report.truckDriverId ?? '',
      truckPlate: report.truckPlate ?? '',
    });
  }

  private mapReportToEditable(report: Report): EditableReport {
    return {
      id: report.id,
      productType: report.productType,
      folio: report.folio,
      date: report.date,
      clientName: report.clientName,
      clientId: report.clientId,
      truckCompany: report.truckCompany,
      truckDriver: report.truckDriver,
      truckDriverId: report.truckDriverId,
      truckPlate: report.truckPlate,
      productName: report.productName,
      origin: report.origin
    };
  }

  
}
