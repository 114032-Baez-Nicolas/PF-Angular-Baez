import { createReducer, on } from '@ngrx/store';
import { Curso } from '../models/curso.interface';
import { CursosActions } from './cursos.actions';

export const cursosFeatureKey = 'courses';

export interface CursosState {
  courses: Curso[];
  isLoading: boolean;
  error: any;
}

export const initialState: CursosState = {
  courses: [],
  isLoading: false,
  error: null,
};

export const cursosReducer = createReducer(
  initialState,
  on(CursosActions.loadCursos, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(CursosActions.loadCursosSuccess, (state, { cursos }) => ({
    ...state,
    isLoading: false,
    courses: cursos,
  })),
  on(CursosActions.loadCursosFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(CursosActions.addCursoSuccess, (state, { curso }) => ({
    ...state,
    courses: [...state.courses, curso],
  })),
  on(CursosActions.updateCursoSuccess, (state, { curso }) => ({
    ...state,
    courses: state.courses.map((c) => (c.id === curso.id ? curso : c)),
  })),
  on(CursosActions.deleteCursoSuccess, (state, { id }) => ({
    ...state,
    courses: state.courses.filter((c) => c.id !== id),
  })),
  on(CursosActions.clearCursos, () => initialState)
);
