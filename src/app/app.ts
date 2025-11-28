import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { Usuario } from './core/models/usuario.interface';
import { AuthService } from './core/services/auth.service';
import { SessionManagerService } from './core/services/session-manager.service';
import { setAuthUser, clearAuthUser } from './core/store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App implements OnInit {
  sidenavOpened = true;
  mostrarLayout = true;
  isMobile = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store,
    private sessionManager: SessionManagerService
  ) {
    this.checkScreenSize();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarLayout = this.debeMostrarLayout(event.url);
      });
    this.mostrarLayout = this.debeMostrarLayout(this.router.url);
    this.setupStorageListener();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    const userJson = localStorage.getItem('authUser');
    const sessionExpiry = localStorage.getItem('sessionExpiry');

    if (userJson && sessionExpiry) {
      const now = Date.now();
      const expiry = parseInt(sessionExpiry, 10);

      if (now < expiry) {
        const user: Usuario = JSON.parse(userJson);
        this.store.dispatch(setAuthUser({ payload: user }));
        this.sessionManager.updateSessionExpiry();
      } else {
        localStorage.removeItem('authUser');
        localStorage.removeItem('sessionExpiry');
      }
    }
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'logoutEvent' && event.newValue) {
        this.store.dispatch(clearAuthUser());
      }

      if (event.key === 'sessionExpired' && event.newValue) {
        this.store.dispatch(clearAuthUser());
      }

      if (event.key === 'authEvent' && event.newValue) {
        const userJson = localStorage.getItem('authUser');
        if (userJson) {
          const user = JSON.parse(userJson);
          this.store.dispatch(setAuthUser({ payload: user }));
          this.router.navigate(['/inicio']);
        }
      }
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  debeMostrarLayout(url: string): boolean {
    let urlLimpia = url.split('?')[0].split('#')[0].toLowerCase();
    if (urlLimpia.endsWith('/')) urlLimpia = urlLimpia.slice(0, -1);
    if (
      urlLimpia.includes('/login') ||
      urlLimpia.includes('/register') ||
      urlLimpia === '' ||
      urlLimpia === '/2pf_baez' ||
      urlLimpia === '/2pf_baez/' ||
      urlLimpia === '/'
    ) {
      return false;
    }
    return this.authService.estaAutenticado();
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
