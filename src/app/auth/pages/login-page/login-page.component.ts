import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { icons } from '../../../../assets/icons/svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { IconsService } from '../../../services/icons.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb: FormBuilder = inject(FormBuilder);
  public iconService: IconsService = inject(IconsService);
}
