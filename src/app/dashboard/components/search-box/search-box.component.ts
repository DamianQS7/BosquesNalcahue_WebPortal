import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dashboard-search-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit, OnDestroy{

  @Input() 
  public placeholder: string = '';

  @Input() 
  public initialValue: string = '';

  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter();

  public searchControl: FormControl<string | null> = new FormControl(this.initialValue);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.setValue(this.initialValue);

    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((value) => {this.onDebounce.emit(value!); console.log(value)});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
