import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { clearAuthUser } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class SessionManagerService {
  private readonly SESSION_EXPIRY_KEY = 'sessionExpiry';
  private readonly SESSION_DURATION = 30 * 60 * 1000;
  private readonly BROWSER_SESSION_KEY = 'browserSessionActive';
  private checkInterval: any;

  constructor(private store: Store, private router: Router) {
    this.initBrowserSession();
    this.checkSessionValidity();
    this.startSessionCheck();
    this.setupActivityListeners();
  }

  private initBrowserSession(): void {
    const browserSessionActive = sessionStorage.getItem(this.BROWSER_SESSION_KEY);

    if (!browserSessionActive) {
      const authUser = localStorage.getItem('authUser');
      if (authUser) {
        localStorage.removeItem('authUser');
        localStorage.removeItem(this.SESSION_EXPIRY_KEY);
      }
    }

    sessionStorage.setItem(this.BROWSER_SESSION_KEY, 'true');
  }

  public updateSessionExpiry(): void {
    const expiryTime = Date.now() + this.SESSION_DURATION;
    localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
  }

  private checkSessionValidity(): void {
    const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);

    if (expiryTime) {
      const now = Date.now();
      const expiry = parseInt(expiryTime, 10);

      if (now >= expiry) {
        this.expireSession();
      }
    }
  }

  private startSessionCheck(): void {
    this.checkInterval = setInterval(() => {
      this.checkSessionValidity();
    }, 60000);
  }

  private setupActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      document.addEventListener(event, () => {
        const authUser = localStorage.getItem('authUser');
        if (authUser) {
          this.updateSessionExpiry();
        }
      }, { passive: true });
    });
  }

  private expireSession(): void {
    localStorage.removeItem('authUser');
    localStorage.removeItem(this.SESSION_EXPIRY_KEY);
    localStorage.setItem('sessionExpired', Date.now().toString());
    this.store.dispatch(clearAuthUser());
  }

  public ngOnDestroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}
