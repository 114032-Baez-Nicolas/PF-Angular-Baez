import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { setAuthUser, clearAuthUser } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private store = inject(Store);

  setAuthUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setAuthUser),
        tap(({ payload }) => {
          localStorage.setItem('authUser', JSON.stringify(payload));
          localStorage.setItem('authEvent', Date.now().toString());
        })
      ),
    { dispatch: false }
  );

  clearAuthUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(clearAuthUser),
        tap(() => {
          localStorage.removeItem('authUser');
          localStorage.setItem('logoutEvent', Date.now().toString());
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  constructor() {
    this.setupStorageListener();
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'logoutEvent' && event.newValue) {
        this.router.navigate(['/login']);
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
}
