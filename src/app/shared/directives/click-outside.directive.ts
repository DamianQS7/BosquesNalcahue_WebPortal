import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, OnDestroy, output, Output } from '@angular/core';
import { filter, fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {

  notifyClickOutside = output<void>();

  private documentClickEventSubscription?: Subscription;

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private element: ElementRef,
  ) { }

  ngAfterViewInit(): void {
    this.documentClickEventSubscription = fromEvent(this.document, 'click')
      .pipe(
        filter((event: Event) => { 
          return !this.isClickInside(event.target as HTMLElement) 
        })
      )
      .subscribe(() => {
        this.notifyClickOutside.emit();
      });
  }

  ngOnDestroy(): void {
    this.documentClickEventSubscription?.unsubscribe();
  }

  private isClickInside(element: HTMLElement): boolean {
    return element === this.element.nativeElement || this.element.nativeElement.contains(element)
  }

}
