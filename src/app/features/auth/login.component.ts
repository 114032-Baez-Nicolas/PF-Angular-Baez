import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import * as AuthActions from '../../core/store/auth/auth.actions';
import { selectIsAuth, selectUser } from '../../core/store/auth/auth.selectors';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registroForm!: FormGroup;
  mostrarRegistro = false;
  isDarkMode = false;
  hidePasswordLogin = true;
  hidePasswordRegistro = true;
  user$;
  isAuth$;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private store: Store
  ) {
    this.user$ = this.store.select(selectUser);
    this.isAuth$ = this.store.select(selectIsAuth);
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });

    this.isAuth$.subscribe((isAuth) => {
      if (isAuth) {
        this.router.navigate(['/inicio']);
      }
    });
  }

  ngOnInit(): void {
    this.inicializarFormularios();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMostrarRegistro(): void {
    this.mostrarRegistro = !this.mostrarRegistro;
  }

  togglePasswordLogin(): void {
    this.hidePasswordLogin = !this.hidePasswordLogin;
  }

  togglePasswordRegistro(): void {
    this.hidePasswordRegistro = !this.hidePasswordRegistro;
  }

  cambiarModo(): void {
    this.mostrarRegistro = !this.mostrarRegistro;
  }

  inicializarFormularios(): void {
    this.loginForm = this.fb.group({
      username: ['admin@gmail.com', [Validators.required]],
      password: ['1234pixel', [Validators.required]],
    });

    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  mostrarCredenciales(): void {
    const backgroundColor = this.isDarkMode ? '#1e1e1e' : '#ffffff';
    const textColor = this.isDarkMode ? '#e0e0e0' : '#424242';
    const cardBg = this.isDarkMode ? '#2d2d2d' : '#f5f5f5';
    const adminBorderColor = this.isDarkMode ? '#90caf9' : '#1976d2';
    const adminTitleColor = this.isDarkMode ? '#90caf9' : '#1976d2';
    const adminCodeBg = this.isDarkMode ? '#1565c0' : '#e3f2fd';
    const adminCodeColor = this.isDarkMode ? '#e3f2fd' : '#1976d2';
    const userBorderColor = this.isDarkMode ? '#ffb74d' : '#f57c00';
    const userTitleColor = this.isDarkMode ? '#ffb74d' : '#f57c00';
    const userCodeBg = this.isDarkMode ? '#ef6c00' : '#fff3e0';
    const userCodeColor = this.isDarkMode ? '#ffe0b2' : '#f57c00';

    Swal.fire({
      title: '🔑 Credenciales de Prueba',
      html: `
        <div style="text-align: left; padding: 10px;">
          <div style="margin-bottom: 20px; padding: 16px; background: ${cardBg}; border-radius: 8px; border-left: 4px solid ${adminBorderColor};">
            <p style="margin: 0 0 12px 0; font-weight: 600; font-size: 15px; color: ${adminTitleColor};">👨‍💼 Administrador</p>
            <p style="margin: 8px 0; color: ${textColor}; font-size: 14px;"><strong>Usuario:</strong> <code style="background: ${adminCodeBg}; padding: 4px 10px; border-radius: 4px; color: ${adminCodeColor}; font-weight: 600; font-size: 13px;">admin@gmail.com</code></p>
            <p style="margin: 8px 0; color: ${textColor}; font-size: 14px;"><strong>Contraseña:</strong> <code style="background: ${adminCodeBg}; padding: 4px 10px; border-radius: 4px; color: ${adminCodeColor}; font-weight: 600; font-size: 13px;">1234pixel</code></p>
          </div>
          <div style="padding: 16px; background: ${cardBg}; border-radius: 8px; border-left: 4px solid ${userBorderColor};">
            <p style="margin: 0 0 12px 0; font-weight: 600; font-size: 15px; color: ${userTitleColor};">👤 Usuario</p>
            <p style="margin: 8px 0; color: ${textColor}; font-size: 14px;"><strong>Usuario:</strong> <code style="background: ${userCodeBg}; padding: 4px 10px; border-radius: 4px; color: ${userCodeColor}; font-weight: 600; font-size: 13px;">user@gmail.com</code></p>
            <p style="margin: 8px 0; color: ${textColor}; font-size: 14px;"><strong>Contraseña:</strong> <code style="background: ${userCodeBg}; padding: 4px 10px; border-radius: 4px; color: ${userCodeColor}; font-weight: 600; font-size: 13px;">1234pixel</code></p>
          </div>
        </div>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: this.isDarkMode ? '#bb86fc' : '#3f51b5',
      width: '500px',
      background: backgroundColor,
      color: textColor,
      customClass: {
        container: 'credenciales-modal-container',
        popup: 'credenciales-modal-popup'
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe((res) => {
        setTimeout(() => {
          this.loading = false;
          if (res.success && res.usuario) {
            this.store.dispatch(AuthActions.setAuthUser({ payload: res.usuario }));
          } else {
            Swal.fire({
              title: 'Error',
              text: res.message,
              icon: 'error',
              confirmButtonColor: '#3f51b5',
            });
          }
        }, 1500);
      });
    }
  }

  onRegistro(): void {
    if (this.registroForm.valid) {
      this.loading = true;
      const { username, password } = this.registroForm.value;
      this.authService.registrar(username, password).subscribe((resultado) => {
        setTimeout(() => {
          this.loading = false;
          if (resultado.success) {
            Swal.fire({
              title: 'Registro exitoso',
              text: 'Ahora podés iniciar sesión',
              icon: 'success',
              confirmButtonColor: '#3f51b5',
            });
            this.mostrarRegistro = false;
            this.registroForm.reset();
          } else {
            Swal.fire({
              title: 'Error',
              text: resultado.message,
              icon: 'error',
              confirmButtonColor: '#3f51b5',
            });
          }
        }, 1500);
      });
    }
  }
}
