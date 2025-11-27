import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { clearAuthUser, setAuthUser } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);

  setAuthUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setAuthUser),
        tap(({ payload }) => {
          localStorage.setItem('authUser', JSON.stringify(payload));
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
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
