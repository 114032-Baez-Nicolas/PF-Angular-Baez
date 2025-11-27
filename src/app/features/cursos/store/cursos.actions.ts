import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Curso } from '../models/curso.interface';

export const CursosActions = createActionGroup({
  source: 'Cursos',
  events: {
    'Load Cursos': emptyProps(),
    'Load Cursos Success': props<{ cursos: Curso[] }>(),
    'Load Cursos Failure': props<{ error: any }>(),
    'Add Curso': props<{ curso: Curso }>(),
    'Add Curso Success': props<{ curso: Curso }>(),
    'Add Curso Failure': props<{ error: any }>(),
    'Update Curso': props<{ curso: Curso }>(),
    'Update Curso Success': props<{ curso: Curso }>(),
    'Update Curso Failure': props<{ error: any }>(),
    'Delete Curso': props<{ id: string }>(),
    'Delete Curso Success': props<{ id: string }>(),
    'Delete Curso Failure': props<{ error: any }>(),
  },
});
