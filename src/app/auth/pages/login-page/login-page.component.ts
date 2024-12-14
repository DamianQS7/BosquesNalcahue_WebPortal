import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconsService } from '../../../shared/services/icons.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../../dashboard/components/toast/toast.component';
import { ToastService } from '../../../shared/services/toast.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, ToastComponent, SpinnerComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  // Services
  private fb         = inject(FormBuilder);
  private router     = inject(Router);
  public authService = inject(AuthService);
  public iconService = inject(IconsService);
  public toasts      = inject(ToastService);

  // Properties
  public loginForm: FormGroup = this.fb.group({
    email:    ['admin@gmail.com', [Validators.required, Validators.email]], // or user@gmail.com to test authorization.
    password: ['Abc123456!', [Validators.required]]
  });

  // Methods
  login(): void {
    if (this.loginForm.invalid) {
      this.toasts.displayToastWithMessage({
        toastType: 'failure', 
        message: this.getErrorsInForm()
      });
      return;
    }

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials);
  }

  private getErrorsInForm(): string {
    const emailValid:    boolean = this.loginForm.get('email')!.valid;
    const passwordValid: boolean = this.loginForm.get('password')!.valid;

    if(!emailValid && !passwordValid) return 'Debe completar todos los campos para proceder.';
    if(!emailValid) return 'El nombre de usuario es incorrecto.';
    if(!passwordValid) return 'La contrasena es incorrecta.';
    return 'Hay errores en el formulario.'
  }

  // Effects
  private loginSuccessEffect = effect(() => {
    if(this.authService.status() === 'authenticated')
      this.router.navigate(['dashboard', 'reports'])
  });
}
