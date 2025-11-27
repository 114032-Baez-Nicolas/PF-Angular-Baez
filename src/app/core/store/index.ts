import { ActionReducerMap } from '@ngrx/store';
import { alumnosFeatureKey, alumnosReducer, AlumnosState } from '../../features/alumnos/store';
import { cursosFeatureKey, cursosReducer, CursosState } from '../../features/cursos/store';
import { authFeaturekey, authReducer, AuthState } from './auth/auth.reducer';

export interface RootState {
  [authFeaturekey]: AuthState;
  [cursosFeatureKey]: CursosState;
  [alumnosFeatureKey]: AlumnosState;
}

export const rootReducer: ActionReducerMap<RootState> = {
  [authFeaturekey]: authReducer,
  [cursosFeatureKey]: cursosReducer,
  [alumnosFeatureKey]: alumnosReducer,
};
