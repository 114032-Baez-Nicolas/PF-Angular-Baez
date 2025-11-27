import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlumnosService } from '../../../../core/services/alumnos.service';
import { Alumno } from '../../models/alumno.interface';
import { EditarAlumnoDialogComponent } from '../editar-alumno-dialog/editar-alumno-dialog.component';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.css'],
  standalone: false,
})
export class ListaAlumnosComponent implements OnInit {
  alumnos: Alumno[] = [];
  alumnosFiltrados: Alumno[] = [];
  busqueda: string = '';

  constructor(
    private alumnosService: AlumnosService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.alumnosService.obtenerAlumnos().subscribe((alumnos) => {
      this.alumnos = alumnos;
      this.alumnosFiltrados = alumnos;
    });
  }

  filtrarAlumnos(): void {
    const termino = this.busqueda.toLowerCase().trim();
    if (!termino) {
      this.alumnosFiltrados = [...this.alumnos];
    } else {
      this.alumnosFiltrados = this.alumnos.filter(
        (alumno) =>
          alumno.nombre.toLowerCase().includes(termino) ||
          alumno.apellido.toLowerCase().includes(termino) ||
          alumno.email.toLowerCase().includes(termino)
      );
    }
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
        this.alumnosService.actualizarAlumno(result).subscribe(() => {
          this.cargarAlumnos();
          Swal.fire({
            title: 'Actualizado',
            text: 'El alumno se actualizó correctamente',
            icon: 'success',
            confirmButtonColor: '#3f51b5',
          });
        });
      }
    });
  }

  eliminarAlumno(alumno: Alumno): void {
    Swal.fire({
      title: '¿Eliminar alumno?',
      text: `¿Querés eliminar a ${alumno.nombre} ${alumno.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alumnosService.eliminarAlumno(alumno.id).subscribe(() => {
          this.cargarAlumnos();
          Swal.fire({
            title: 'Eliminado',
            text: 'El alumno fue eliminado',
            icon: 'success',
            confirmButtonColor: '#3f51b5',
          });
        });
      }
    });
  }

  verDetalle(alumno: Alumno): void {
    let fecha: Date;
    if (alumno.fechaInscripcion instanceof Date) {
      fecha = alumno.fechaInscripcion;
    } else {
      fecha = new Date(alumno.fechaInscripcion);
    }
    Swal.fire({
      title: `${alumno.nombre} ${alumno.apellido}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Email:</strong> ${alumno.email}</p>
          <p><strong>Inscripción:</strong> ${fecha.toLocaleDateString()}</p>
          <p><strong>Estado:</strong> ${alumno.activo ? '✅ Activo' : '❌ Inactivo'}</p>
        </div>
      `,
      confirmButtonColor: '#3f51b5',
    });
  }
}
