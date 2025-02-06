import { Component, computed, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconsService } from '../../../shared/services/icons.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../data-access/auth.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
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
  private fb     = inject(FormBuilder);
  private router = inject(Router);
  authService = inject(AuthService);
  iconService = inject(IconsService);
  toasts      = inject(ToastService);

  // Properties
  loginForm: FormGroup = this.fb.nonNullable.group({
    email:    ['admin@gmail.com', [Validators.required, Validators.email]], // or user@gmail.com to test authorization.
    password: ['Abc123456!', [Validators.required]]
  });
  errorMessage = computed(() => this.authService.errorMessage());
  status = computed(() => this.authService.status());

  // Methods
  login(): void {
    if (this.loginForm.invalid) {
      this.toasts.displayToastWithMessage({
        toastType: 'failure', 
        message: this.getErrorsInForm()
      });
      return;
    }

    this.authService.login(this.loginForm.getRawValue());
  }

  private getErrorsInForm(): string {
    const emailValid:    boolean = this.loginForm.get('email')!.valid;
    const passwordValid: boolean = this.loginForm.get('password')!.valid;

    if(!emailValid && !passwordValid) return 'Debe completar todos los campos para proceder.';
    if(!emailValid) return 'El nombre de usuario es incorrecto.';
    if(!passwordValid) return 'La contrasena es incorrecta.';
    return 'Hay errores en el formulario.'
  }

  // Reacting to state changes
  #loginOperationEffect = effect(() => {
    switch(this.status()) {

      case 'authenticated':
        this.router.navigate(['dashboard', 'reports']);
        break;

      case 'error':
        this.toasts.displayToastWithMessage({
          toastType: 'failure', 
          message: this.errorMessage()
        });

    }
  }, { allowSignalWrites: true });
}
