import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ReportsService } from '../../services/reports.service';
import { Report, EditableReport } from '@interfaces/index';
import { ToastComponent } from '../../components/toast/toast.component';

@Component({
  standalone: true,
  imports: [ ReactiveFormsModule, ToastComponent ],
  templateUrl: './edit-report-page.component.html',
  styleUrl: './edit-report-page.component.css'
})
export class EditReportPageComponent implements OnInit, OnDestroy {
  // Services
  private reportsService: ReportsService = inject(ReportsService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);

  // Properties
  private getReportSubs?: Subscription;
  private updateReportSubs?: Subscription;
  public reportToSubmit?: Report;
  public toastVisible = signal<boolean>(false);
  public toastType = signal<'success' | 'failure'>('failure');

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

  public deleteReport(): void {
    const id: string | undefined = this.reportToSubmit?.id;
    if (!id) return
    this.reportsService.deleteById(id)
      .subscribe(isDeleted => {
        if(!isDeleted) {
          console.error('Error deleting the report');
        } else {
          console.log('Report deleted successfully');
        }
      });
  }
  
  public onSubmit() {
    
    if(this.reportToSubmit) {      
      // Map the values in the form to the reportToSubmit property
      Object.assign(this.reportToSubmit, this.form.value);
      
      // Call the update method from the service
      const {id, ...report} = this.reportToSubmit;
      this.updateReportSubs = this.reportsService
        .updateReport(id, report)
        .subscribe((report) => {
          if(report !== undefined) {
            this.ShowAndHideToast(true);
            this.toastType.set('success');
           } else {
            this.ShowAndHideToast(false);
            this.toastType.set('failure');
           }
        });
    }
  }

  public ShowAndHideToast(showToast: boolean): void {
    this.toastVisible.set(showToast);
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
      truckPlate: report.truckPlate ?? ''
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
      origin: report.origin,
      products: report.products
    };
  }

  
}
