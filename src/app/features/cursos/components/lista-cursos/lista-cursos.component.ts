import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Curso } from '../../models/curso.interface';
import { CursosActions, selectCursos, selectCursosLoading } from '../../store';
import { EditarCursoDialogComponent } from '../editar-curso-dialog/editar-curso-dialog.component';

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.css'],
  standalone: false,
})
export class ListaCursosComponent implements OnInit, OnDestroy {
  cursos$: Observable<Curso[]>;
  loading$: Observable<boolean>;
  cursosFiltrados: Curso[] = [];
  busqueda: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.cursos$ = this.store.select(selectCursos);
    this.loading$ = this.store.select(selectCursosLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(CursosActions.loadCursos());
    this.cursos$.pipe(takeUntil(this.destroy$)).subscribe((cursos) => {
      this.cursosFiltrados = cursos;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(CursosActions.clearCursos());
  }

  filtrarCursos(): void {
    const termino = this.busqueda.toLowerCase().trim();
    this.cursos$.pipe(takeUntil(this.destroy$)).subscribe((cursos) => {
      if (!termino) {
        this.cursosFiltrados = [...cursos];
      } else {
        this.cursosFiltrados = cursos.filter(
          (curso) =>
            curso.nombre.toLowerCase().includes(termino) ||
            curso.descripcion.toLowerCase().includes(termino)
        );
      }
    });
  }

  irANuevoCurso(): void {
    this.router.navigate(['/cursos/nuevo']);
  }

  editarCurso(curso: Curso): void {
    const dialogRef = this.dialog.open(EditarCursoDialogComponent, {
      width: '600px',
      data: { curso },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(CursosActions.updateCurso({ curso: result }));
        Swal.fire({
          title: 'Actualizado',
          text: 'El curso se actualizó correctamente',
          icon: 'success',
          confirmButtonColor: '#3f51b5',
        });
      }
    });
  }

  eliminarCurso(curso: Curso): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Querés eliminar el curso "${curso.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(CursosActions.deleteCurso({ id: curso.id }));
        Swal.fire({
          title: 'Eliminado',
          text: 'El curso ha sido eliminado correctamente',
          icon: 'success',
          confirmButtonColor: '#3f51b5',
        });
      }
    });
  }

  verDetalle(curso: Curso): void {
    const fechaInicio = new Date(curso.fechaInicio);
    const fechaFin = new Date(curso.fechaFin);
    Swal.fire({
      title: curso.nombre,
      html: `
        <p><strong>Descripción:</strong> ${curso.descripcion}</p>
        <p><strong>Fecha inicio:</strong> ${fechaInicio.toLocaleDateString()}</p>
        <p><strong>Fecha fin:</strong> ${fechaFin.toLocaleDateString()}</p>
        <p><strong>Estado:</strong> ${curso.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}</p>
      `,
      confirmButtonColor: '#3f51b5',
    });
  }
}
