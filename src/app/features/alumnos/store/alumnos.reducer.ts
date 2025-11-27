import { createReducer, on } from '@ngrx/store';
import { Alumno } from '../models/alumno.interface';
import { AlumnosActions } from './alumnos.actions';

export const alumnosFeatureKey = 'students';

export interface AlumnosState {
  students: Alumno[];
  isLoading: boolean;
  error: any;
}

export const initialState: AlumnosState = {
  students: [],
  isLoading: false,
  error: null,
};

export const alumnosReducer = createReducer(
  initialState,
  on(AlumnosActions.loadAlumnos, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AlumnosActions.loadAlumnosSuccess, (state, { alumnos }) => ({
    ...state,
    isLoading: false,
    students: alumnos,
  })),
  on(AlumnosActions.loadAlumnosFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(AlumnosActions.addAlumnoSuccess, (state, { alumno }) => ({
    ...state,
    students: [...state.students, alumno],
  })),
  on(AlumnosActions.updateAlumnoSuccess, (state, { alumno }) => ({
    ...state,
    students: state.students.map((a) => (a.id === alumno.id ? alumno : a)),
  })),
  on(AlumnosActions.deleteAlumnoSuccess, (state, { id }) => ({
    ...state,
    students: state.students.filter((a) => a.id !== id),
  })),
  on(AlumnosActions.clearAlumnos, () => initialState)
);
