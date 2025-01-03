import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ToastService } from '../../shared/services/toast.service';
import { ModalService } from '../../shared/services/modal.service';
import { EditReportService } from '../data-access/edit-report.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [ ReactiveFormsModule, ToastComponent, ModalComponent, CommonModule ],
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
  
  //statusReaction$ = toObservable(this.status);
  public isReportDeleted = signal<boolean>(false);
  
  form: FormGroup = this.fb.nonNullable.group({
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
  }
  
  onSubmit() {
    if(!this.form.dirty) {
      this.toastService.displayToastWithMessage({
        toastType: 'failure',
        message: 'No se han detectado cambios en el formulario.'
      });
      return;
    }
    
    const {folio, date, origin, ...report} = this.form.getRawValue();
    this.editReportService.updateReport(report);
  }

  private formatReportDate(reportDate: Date): string {
    const date = new Date(reportDate);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  // Effects
  #sideEffects = effect(() => {  

    switch(this.status()) {

      case 'updated':
        this.form.markAsPristine();
        this.toastService.displayToastWithMessage({
          toastType: 'success',
          message: 'Reporte actualizado con exito.'
        });
        break;
      
      case 'deleted':
        this.toastService.displayToastWithMessage({
          toastType: 'success',
          message: 'Reporte eliminado con exito.'
        });
        this.form.disable();
        break;

      case 'loaded':
        this.form.patchValue({
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

      case 'error':
        this.toastService.displayToastWithMessage({
          toastType: 'failure',
          message: this.errorMessage()
        });
        break;
    }
  }, {allowSignalWrites: true});
}
