import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb: FormBuilder = inject(FormBuilder);
}
