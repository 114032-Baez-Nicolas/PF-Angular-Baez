import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-mode';
  private isDarkModeSubject: BehaviorSubject<boolean>;
  isDarkMode$: Observable<boolean>;

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);

    const isDark = savedTheme ? savedTheme === 'dark' : true;
    this.isDarkModeSubject = new BehaviorSubject<boolean>(isDark);
    this.isDarkMode$ = this.isDarkModeSubject.asObservable();
    this.aplicarTema(isDark);
  }

  toggleTheme(): void {
    const newMode = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newMode);
    this.aplicarTema(newMode);
    localStorage.setItem(this.THEME_KEY, newMode ? 'dark' : 'light');
  }

  private aplicarTema(isDark: boolean): void {
    if (isDark) {
      document.body.setAttribute('color-scheme', 'dark');
      document.body.classList.add('dark-theme');
    } else {
      document.body.setAttribute('color-scheme', 'light');
      document.body.classList.remove('dark-theme');
    }
  }

  isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}
