import { createFeatureSelector, createSelector } from '@ngrx/store';
import { alumnosFeatureKey, AlumnosState } from './alumnos.reducer';

export const selectAlumnosState = createFeatureSelector<AlumnosState>(alumnosFeatureKey);

export const selectAlumnos = createSelector(selectAlumnosState, (state) => state.students);

export const selectAlumnosLoading = createSelector(selectAlumnosState, (state) => state.isLoading);

export const selectAlumnosError = createSelector(selectAlumnosState, (state) => state.error);
