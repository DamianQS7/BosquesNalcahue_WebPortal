import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
  host: {
    class: `min-h-[90dvh] w-full 2xl:mx-4 rounded-lg shadow-xl z-50 dark:shadow-slate-950 shadow-slate-600 flex 
    justify-between p-2 bg-teal-100/30 dark:bg-gradient-to-r dark:from-slate-600 dark:to-slate-500 `
  }
})
export class SettingsPageComponent {

}
