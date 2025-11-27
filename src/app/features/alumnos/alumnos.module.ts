import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AlumnosRoutingModule } from './alumnos-routing.module';
import { AbmAlumnosComponent } from './components/abm-alumnos/abm-alumnos.component';
import { EditarAlumnoDialogComponent } from './components/editar-alumno-dialog/editar-alumno-dialog.component';
import { ListaAlumnosComponent } from './components/lista-alumnos/lista-alumnos.component';

@NgModule({
  declarations: [ListaAlumnosComponent, AbmAlumnosComponent, EditarAlumnoDialogComponent],
  imports: [CommonModule, SharedModule, AlumnosRoutingModule],
  exports: [ListaAlumnosComponent, AbmAlumnosComponent],
})
export class AlumnosModule {}
