import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconsService } from '../../../services/icons.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../../dashboard/components/toast/toast.component';

@Component({
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  // Services
  private fb: FormBuilder          = inject(FormBuilder);
  private router: Router           = inject(Router);
  private authService: AuthService = inject(AuthService);
  public iconService: IconsService = inject(IconsService);

  // Properties
  public toastSuccessMessage = signal<string>('');
  public toastFailureMessage = signal<string>('');
  public toastVisible = signal<boolean>(false);
  public toastType = signal<'success' | 'failure'>('failure');
  public form: FormGroup = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  // Methods
  public login(): void {
    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (result) => {
        console.log(result);
        
        if(result === true) {
          this.router.navigateByUrl('/dashboard/reports')
        }
        else {
          console.log('Something went wrong')
        }
      },
      error: (message: string) => {
        console.log(message);
        
      }
    });
  }
}
