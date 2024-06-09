import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { icons } from '../../../../assets/icons/svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { IconsService } from '../../../services/icons.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  public iconService: IconsService = inject(IconsService);

  public login(): void {
    this.router.navigateByUrl('/dashboard/reports');
  }
}
