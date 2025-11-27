import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, mergeMap, of } from 'rxjs';
import { CursosService } from '../../../core/services/cursos.service';
import { CursosActions } from './cursos.actions';

@Injectable()
export class CursosEffects {
  private actions$ = inject(Actions);
  private cursosService = inject(CursosService);

  loadCursos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.loadCursos),
      delay(1500),
      mergeMap(() => {
        console.log('🔄 Cargando cursos desde el servidor...');
        return this.cursosService.obtenerCursos().pipe(
          map((cursos) => {
            console.log('✅ Cursos cargados:', cursos);
            return CursosActions.loadCursosSuccess({ cursos });
          }),
          catchError((error) => {
            console.error('❌ Error al cargar cursos:', error);
            return of(CursosActions.loadCursosFailure({ error }));
          })
        );
      })
    )
  );

  addCurso$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.addCurso),
      mergeMap(({ curso }) =>
        this.cursosService.agregarCurso(curso).pipe(
          map((curso) => CursosActions.addCursoSuccess({ curso })),
          catchError((error) => of(CursosActions.addCursoFailure({ error })))
        )
      )
    )
  );

  updateCurso$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.updateCurso),
      mergeMap(({ curso }) =>
        this.cursosService.actualizarCurso(curso).pipe(
          map((curso) => CursosActions.updateCursoSuccess({ curso })),
          catchError((error) => of(CursosActions.updateCursoFailure({ error })))
        )
      )
    )
  );

  deleteCurso$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CursosActions.deleteCurso),
      mergeMap(({ id }) =>
        this.cursosService.eliminarCurso(id).pipe(
          map(() => CursosActions.deleteCursoSuccess({ id })),
          catchError((error) => of(CursosActions.deleteCursoFailure({ error })))
        )
      )
    )
  );
}
