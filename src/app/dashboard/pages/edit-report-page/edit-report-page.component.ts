import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import { ReportsService } from '../../services/reports.service';
import { Report, EditableReport } from '../../interfaces/index';
import { ToastComponent } from '../../components/toast/toast.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ToastService } from '../../../services/toast.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  standalone: true,
  imports: [ ReactiveFormsModule, ToastComponent, ModalComponent ],
  templateUrl: './edit-report-page.component.html',
  styleUrl: './edit-report-page.component.css'
})
export class EditReportPageComponent implements OnInit, OnDestroy {
  // Services
  private reportsService: ReportsService = inject(ReportsService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public toastService: ToastService = inject(ToastService);
  public modals: ModalService = inject(ModalService);
  private fb: FormBuilder = inject(FormBuilder);

  // Properties
  public isReportDeleted = signal<boolean>(false);
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

  public deleteReport(confirm: boolean): void {
    const id: string | undefined = this.reportToSubmit?.id;
    
    if (!id) return

    if(confirm){
      this.reportsService.deleteById(id)
        .subscribe(isDeleted => {
          if (isDeleted === false) {
            this.toastService.displayToast('failure', 'Hubo un error al eliminar el reporte.');
          } else {
            this.isReportDeleted.set(true);
            this.reportsService.deleteFileByFileId(this.reportToSubmit?.fileId ?? '')
              .pipe(
                tap(() => console.log('File deleted successfully')),
                catchError((error) => {
                  console.log(error);
                  return of(null);
                })
              )
              .subscribe();
            this.toastService.displayToast('success', 'Reporte eliminado con exito.');
          }    
        });   
    }
  }
  
  public onSubmit() {
    if(!this.form.dirty) return;

    if(this.reportToSubmit) {      
      // Map the values in the form to the reportToSubmit property
      Object.assign(this.reportToSubmit, this.form.value);
      
      // Call the update method from the service
      const {id, ...report} = this.reportToSubmit;
      this.updateReportSubs = this.reportsService
        .updateReport(id, report)
        .subscribe((report) => {
          if(report !== undefined) {
            this.toastService.displayToast('success', 'Reporte actualizado con exito.')
            this.form.markAsPristine();
           } else {
            this.toastService.displayToast('failure', 'No se pudo actualizar el reporte.')
           }
        });
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
      truckPlate: report.truckPlate ?? ''
    });
  }

  private mapReportToEditable(report: Report): EditableReport {
    return {
      id: report.id,
      productType: report.productType,
      fileId: report.fileId,
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
