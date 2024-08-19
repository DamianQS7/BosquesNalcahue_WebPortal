import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { icons } from '../../../assets/icons/svg-icons';
import { Icon } from '../../shared/interfaces/icon.interface';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  private santizer: DomSanitizer = inject(DomSanitizer);

  private icons: Icon = icons;

  public getIcon(iconName: string): SafeHtml {
    const icon: string = this.icons[iconName]

    if (!icon) throw Error('Wrong icon name');

    return this.sanitizeIcon(icon)
  }

  private sanitizeIcon(icon: string): SafeHtml {
    return this.santizer.bypassSecurityTrustHtml(icon);
  }
}
