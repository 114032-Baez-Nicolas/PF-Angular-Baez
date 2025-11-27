import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Alumno } from '../models/alumno.interface';

export const AlumnosActions = createActionGroup({
  source: 'Alumnos',
  events: {
    'Load Alumnos': emptyProps(),
    'Load Alumnos Success': props<{ alumnos: Alumno[] }>(),
    'Load Alumnos Failure': props<{ error: any }>(),
    'Add Alumno': props<{ alumno: Alumno }>(),
    'Add Alumno Success': props<{ alumno: Alumno }>(),
    'Add Alumno Failure': props<{ error: any }>(),
    'Update Alumno': props<{ alumno: Alumno }>(),
    'Update Alumno Success': props<{ alumno: Alumno }>(),
    'Update Alumno Failure': props<{ error: any }>(),
    'Delete Alumno': props<{ id: string }>(),
    'Delete Alumno Success': props<{ id: string }>(),
    'Delete Alumno Failure': props<{ error: any }>(),
    'Clear Alumnos': emptyProps(),
  },
});
