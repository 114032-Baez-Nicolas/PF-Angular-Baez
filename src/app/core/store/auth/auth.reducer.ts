import { createReducer, on } from '@ngrx/store';
import { Usuario } from '../../models/usuario.interface';
import * as AuthActions from './auth.actions';

export const authFeaturekey = 'auth';

export interface AuthState {
  user: Usuario | null;
}

export const initialAuthState: AuthState = {
  user: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.setAuthUser, (state, action) => {
    return {
      ...state,
      user: action.payload,
    };
  }),
  on(AuthActions.clearAuthUser, (state) => {
    return {
      ...state,
      user: null,
    };
  })
);
