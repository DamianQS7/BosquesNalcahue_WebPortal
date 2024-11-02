import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'shared-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
  host: {
    class: 'flex flex-row w-[35%] 2xl:w-[38%] p-[0.15rem] rounded-3xl border border-slate-300',
    '[class.bg-teal-100/70]': 'this.themeService.isDarkTheme()',
    '[class.bg-neutral-200]': '!this.themeService.isDarkTheme()'
  }
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);

  getTheme():boolean {
    return this.themeService.isDarkTheme();
  }
  
  toggleTheme(): void {
    this.themeService.isDarkTheme.update(value => !value);
  }
}
