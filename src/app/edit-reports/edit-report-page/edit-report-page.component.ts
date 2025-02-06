import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ToastService } from '../../shared/services/toast.service';
import { ModalService } from '../../shared/services/modal.service';
import { EditReportService } from '../data-access/edit-report.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [ ReactiveFormsModule, ToastComponent, ModalComponent, CommonModule, SpinnerComponent ],
  providers: [EditReportService],
  templateUrl: './edit-report-page.component.html',
  styleUrl: './edit-report-page.component.css'
})
export default class EditReportPageComponent {
  // Services
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  toastService = inject(ToastService);
  editReportService = inject(EditReportService);
  modals = inject(ModalService);

  // Properties
  routeParams = toSignal(this.activatedRoute.paramMap);
  status = computed(() => this.editReportService.status());
  errorMessage = computed(() => this.editReportService.errorMessage());
  reportToEdit = computed(() => this.editReportService.reportToEdit());
  
  editForm: FormGroup = this.fb.nonNullable.group({
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

  constructor() {
    this.editReportService.getReportById(this.routeParams()?.get('id')!);
    this.reactToStatus$.subscribe();
  }
  
  onSubmit() {
    if(!this.editForm.dirty) {
      this.toastService.displayToastWithMessage({
        toastType: 'failure',
        message: 'No se han detectado cambios en el formulario.'
      });
      return;
    }

    if(this.editForm.invalid) {
      this.toastService.displayToastWithMessage({
        toastType: 'failure',
        message: 'No esta permitido dejar campos en blanco.'
      });
      return;
    }
    
    const {folio, date, origin, ...report} = this.editForm.getRawValue();
    this.editReportService.updateReport(report);
  }
  
  private formatReportDate(reportDate: Date): string {
    const date = new Date(reportDate);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  private status$ = toObservable(this.status);
  private reactToStatus$ = this.status$.pipe(
    tap(status => {
      switch(status) {
        case 'updated':
          this.editForm.markAsPristine();
          this.toastService
            .displayToastWithMessage({ toastType: 'success', message: 'Reporte actualizado con exito.' });
          break;
        
        case 'deleted':
          this.editForm.disable();
          this.toastService
            .displayToastWithMessage({ toastType: 'success', message: 'Reporte eliminado con exito.' });
          break;

        case 'error':
          this.toastService
            .displayToastWithMessage({ toastType: 'failure', message: this.errorMessage() });
          break;

        case 'loaded':
          this.editForm.patchValue({
            folio: this.reportToEdit()?.folio,
            date: this.formatReportDate(this.reportToEdit()?.date!),
            origin: this.reportToEdit()?.origin,
            productName: this.reportToEdit()?.productName,
            clientName: this.reportToEdit()?.clientName,
            clientId: this.reportToEdit()?.clientId,
            truckCompany: this.reportToEdit()?.truckCompany,
            truckDriver: this.reportToEdit()?.truckDriver,
            truckDriverId: this.reportToEdit()?.truckDriverId,
            truckPlate: this.reportToEdit()?.truckPlate,
          });
          break;
      }
    })
  );
}
