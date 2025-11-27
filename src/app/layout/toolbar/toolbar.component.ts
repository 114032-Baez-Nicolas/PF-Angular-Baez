import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import * as AuthActions from '../../core/store/auth/auth.actions';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
  standalone: false,
})
export class ToolbarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private store: Store
  ) {
    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  onToggle(): void {
    this.toggleSidenav.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.store.dispatch(AuthActions.clearAuthUser());
    this.router.navigate(['/login']);
  }
}
