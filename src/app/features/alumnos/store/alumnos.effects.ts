import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, mergeMap, of } from 'rxjs';
import { AlumnosService } from '../../../core/services/alumnos.service';
import { AlumnosActions } from './alumnos.actions';

@Injectable()
export class AlumnosEffects {
  private actions$ = inject(Actions);
  private alumnosService = inject(AlumnosService);

  loadAlumnos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.loadAlumnos),
      delay(1500),
      mergeMap(() =>
        this.alumnosService.obtenerAlumnos().pipe(
          map((alumnos) => AlumnosActions.loadAlumnosSuccess({ alumnos })),
          catchError((error) => of(AlumnosActions.loadAlumnosFailure({ error })))
        )
      )
    )
  );

  addAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.addAlumno),
      mergeMap(({ alumno }) =>
        this.alumnosService.agregarAlumno(alumno).pipe(
          map((alumno) => AlumnosActions.addAlumnoSuccess({ alumno })),
          catchError((error) => of(AlumnosActions.addAlumnoFailure({ error })))
        )
      )
    )
  );

  updateAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.updateAlumno),
      mergeMap(({ alumno }) =>
        this.alumnosService.actualizarAlumno(alumno).pipe(
          map((alumno) => AlumnosActions.updateAlumnoSuccess({ alumno })),
          catchError((error) => of(AlumnosActions.updateAlumnoFailure({ error })))
        )
      )
    )
  );

  deleteAlumno$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlumnosActions.deleteAlumno),
      mergeMap(({ id }) =>
        this.alumnosService.eliminarAlumno(id).pipe(
          map(() => AlumnosActions.deleteAlumnoSuccess({ id })),
          catchError((error) => of(AlumnosActions.deleteAlumnoFailure({ error })))
        )
      )
    )
  );
}
