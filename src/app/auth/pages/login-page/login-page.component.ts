import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconsService } from '../../../services/icons.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../../dashboard/components/toast/toast.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  // Services
  private fb: FormBuilder           = inject(FormBuilder);
  private router: Router            = inject(Router);
  private authService: AuthService  = inject(AuthService);
  public iconService: IconsService  = inject(IconsService);
  public toasts: ToastService       = inject(ToastService);

  // Properties
  public form: FormGroup = this.fb.group({
    email:    ['test8@gmail.com', [Validators.required, Validators.email]],
    password: ['Abc123456!', [Validators.required]]
  });

  // Methods
  public login(): void {
    if (this.form.invalid) {
      this.toasts.displayToast('failure', this.searchForErrorsInForm());
      return;
    }

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (authResult) => {
        if(authResult.success === true) {          
          this.router.navigateByUrl('/dashboard/reports')
        }
        else {
          console.log('loginPageComponent:', 'Something went wrong with login method');
          this.toasts.displayToast('failure', 'Ha ocurrido un error inesperado.')
        }
      },
      error: (message: string) => {
        console.log(message); 
      }
    });
  }

  private searchForErrorsInForm(): string {
    const emailValid:    boolean = this.form.get('email')!.valid;
    const passwordValid: boolean = this.form.get('password')!.valid;

    if(!emailValid && !passwordValid) return 'Debe completar todos los campos para proceder.';
    if(!emailValid) return 'El nombre de usuario es incorrecto.';
    if(!passwordValid) return 'La contrasena es incorrecta.';
    return 'Hay errores en el formulario.'
  }
}
