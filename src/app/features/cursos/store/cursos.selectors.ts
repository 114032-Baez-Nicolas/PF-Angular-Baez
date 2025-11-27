import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cursosFeatureKey, CursosState } from './cursos.reducer';

export const selectCursosState = createFeatureSelector<CursosState>(cursosFeatureKey);

export const selectCursos = createSelector(selectCursosState, (state) => state.courses);

export const selectCursosLoading = createSelector(selectCursosState, (state) => state.isLoading);

export const selectCursosError = createSelector(selectCursosState, (state) => state.error);
