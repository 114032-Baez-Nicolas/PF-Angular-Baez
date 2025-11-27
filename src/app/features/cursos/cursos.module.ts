import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AbmCursosComponent } from './components/abm-cursos/abm-cursos.component';
import { EditarCursoDialogComponent } from './components/editar-curso-dialog/editar-curso-dialog.component';
import { ListaCursosComponent } from './components/lista-cursos/lista-cursos.component';
import { CursosRoutingModule } from './cursos-routing.module';

@NgModule({
  declarations: [ListaCursosComponent, AbmCursosComponent, EditarCursoDialogComponent],
  imports: [CommonModule, SharedModule, CursosRoutingModule],
  exports: [ListaCursosComponent, AbmCursosComponent],
})
export class CursosModule {}
