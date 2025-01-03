import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, map, merge, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DeleteReportRequest, EditableReport, GetReportByIdRequest, Report } from '../../reports/interfaces';
import { environment } from '../../../environments/environment';
import { connect } from 'ngxtension/connect';

export type ReportStatus = 'pending' | 'loaded' | 'updated' | 'deleted' | 'error' | 'success';
export interface EditReportServiceState {
  reportToEdit: Report | null;
  errorMessage: string | null;
  status: ReportStatus;
}

@Injectable()
export class EditReportService {
  // Dependencies
  private http = inject(HttpClient);

  // Properties
  private readonly baseUrl:  string = environment.baseUrl;
  private readonly reportsEndpoint: string = `${this.baseUrl}/reports`;
  private readonly blobEndpoint: string = `${this.baseUrl}/blob`;
  
  // State
  private state = signal<EditReportServiceState>({
    reportToEdit: null,
    errorMessage: null,
    status: 'pending',
  });

  // Selectors
  reportToEdit = computed(() => this.state().reportToEdit);
  errorMessage = computed(() => this.state().errorMessage);
  status = computed(() => this.state().status);
  
  // Computed State
  private currentReportId = computed(() => this.reportToEdit()?.id);
  private updateReportDto = computed(() => {
    if(this.reportToEdit()) {
      const {id, ...report} = this.reportToEdit()!;
      return report;
    }
    return null;
  })

  // Sources
  private reportId$ = new Subject<GetReportByIdRequest>();
  private getReportById$ = this.reportId$.pipe(
    switchMap((id) => this.http.get<Report>(`${this.reportsEndpoint}/${id}`).pipe(
      catchError(error => {
        this.state.update((state) => ({...state, errorMessage: 'Error al recuperar el reporte', status: 'error'}));
        return EMPTY;
      })
    ))
  );
  private updateReport$ = new Subject<EditableReport>();
  private updateReportRequest$ = this.updateReport$.pipe(
    tap((editableReport) => {
      // Added this tap to ensure that the state is updated before the HTTP request
      this.state.update((state) => ({
        ...state,
        reportToEdit: { ...state.reportToEdit!, ...editableReport },
        status: 'loaded' as const
      }));
    }),
    switchMap(() => this.http.put<Report>(`${this.reportsEndpoint}/${this.currentReportId()}`, this.updateReportDto()!).pipe(
      catchError(() => {
        this.state.update((state) => ({...state, errorMessage: 'No se pudo actualizar el reporte.', status: 'error'}));
        return EMPTY;
      })
    ))
  );
  private reportToDelete$ = new Subject<DeleteReportRequest>();
  private deleteReportById$ = this.reportToDelete$.pipe(
    switchMap(id => this.http.delete(`${this.reportsEndpoint}/${id}`).pipe(
      catchError(() => {
        this.state.update(state => ({...state, errorMessage: 'No se pudo eliminar el reporte.', status: 'error'}));
        return EMPTY;
      })
    ))
  );

  constructor() {
    // Reducers 
    const updatedState$ = merge(
      this.reportId$.pipe(map(() => ({ status: 'pending' as const }))),
      this.getReportById$.pipe(map((report) => ({
        reportToEdit: report,
        status: 'loaded' as const,
        errorMessage: null
      }))),
      this.updateReportRequest$.pipe(map(report => ({
        status: 'updated' as const,
        errorMessage: null,
        reportToEdit: report
      }))),
      this.deleteReportById$.pipe(map(() => ({
        errorMessage: null,
        status: 'deleted' as const
      })))
    );

    connect(this.state).with(updatedState$)
  }

  // Actions
  getReportById = (id: string): void => this.reportId$.next(id);
  updateReport = (report: EditableReport): void => this.updateReport$.next(report);
  deleteReport = (): void => this.reportToDelete$.next(this.currentReportId()!);

  // Effects
  deleteFileFromBlobEffect = effect(() => {
    if(this.status() === 'deleted') {
      const requestUrl: string = `${this.blobEndpoint}/reports/${this.reportToEdit()?.fileId ?? ''}`;
      this.http.delete(requestUrl).subscribe();
    }
  });
}
