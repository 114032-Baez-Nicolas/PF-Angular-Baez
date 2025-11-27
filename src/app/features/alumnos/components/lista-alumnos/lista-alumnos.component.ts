import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Alumno } from '../../models/alumno.interface';
import { AlumnosActions, selectAlumnos, selectAlumnosLoading } from '../../store';
import { EditarAlumnoDialogComponent } from '../editar-alumno-dialog/editar-alumno-dialog.component';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.css'],
  standalone: false,
})
export class ListaAlumnosComponent implements OnInit {
  alumnos$: Observable<Alumno[]>;
  loading$: Observable<boolean>;
  alumnosFiltrados: Alumno[] = [];
  busqueda: string = '';

  constructor(private store: Store, private router: Router, private dialog: MatDialog) {
    this.alumnos$ = this.store.select(selectAlumnos);
    this.loading$ = this.store.select(selectAlumnosLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(AlumnosActions.loadAlumnos());
    this.alumnos$.subscribe((alumnos) => {
      this.alumnosFiltrados = alumnos;
    });
  }

  filtrarAlumnos(): void {
    const termino = this.busqueda.toLowerCase().trim();
    this.alumnos$.subscribe((alumnos) => {
      if (!termino) {
        this.alumnosFiltrados = [...alumnos];
      } else {
        this.alumnosFiltrados = alumnos.filter(
          (alumno) =>
            alumno.nombre.toLowerCase().includes(termino) ||
            alumno.apellido.toLowerCase().includes(termino) ||
            alumno.email.toLowerCase().includes(termino)
        );
      }
    });
  }

  irANuevoAlumno(): void {
    this.router.navigate(['/alumnos/nuevo']);
  }

  editarAlumno(alumno: Alumno): void {
    const dialogRef = this.dialog.open(EditarAlumnoDialogComponent, {
      width: '600px',
      data: { alumno },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(AlumnosActions.updateAlumno({ alumno: result }));
        Swal.fire({
          title: 'Actualizado',
          text: 'El alumno se actualizó correctamente',
          icon: 'success',
          confirmButtonColor: '#3f51b5',
        });
      }
    });
  }

  eliminarAlumno(alumno: Alumno): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Querés eliminar al alumno "${alumno.nombre} ${alumno.apellido}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(AlumnosActions.deleteAlumno({ id: alumno.id }));
        Swal.fire({
          title: 'Eliminado',
          text: 'El alumno ha sido eliminado correctamente',
          icon: 'success',
          confirmButtonColor: '#3f51b5',
        });
      }
    });
  }

  verDetalle(alumno: Alumno): void {
    const fechaInscripcion = new Date(alumno.fechaInscripcion);
    Swal.fire({
      title: `${alumno.nombre} ${alumno.apellido}`,
      html: `
        <p><strong>Email:</strong> ${alumno.email}</p>
        <p><strong>Fecha de inscripción:</strong> ${fechaInscripcion.toLocaleDateString()}</p>
        <p><strong>Estado:</strong> ${alumno.activo ? '✅ Activo' : '❌ Inactivo'}</p>
      `,
      confirmButtonColor: '#3f51b5',
    });
  }
}
