import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../models/usuario.interface';

export const setAuthUser = createAction('[AUTH] setAuthuser', props<{ payload: Usuario }>());

export const clearAuthUser = createAction('[AUTH] clearAuthUser');
