import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { AbmCursosComponent } from './components/abm-cursos/abm-cursos.component';
import { EditarCursoDialogComponent } from './components/editar-curso-dialog/editar-curso-dialog.component';
import { ListaCursosComponent } from './components/lista-cursos/lista-cursos.component';

const routes: Routes = [
  { path: '', component: ListaCursosComponent, canActivate: [authGuard] },
  { path: 'nuevo', component: AbmCursosComponent, canActivate: [authGuard] },
  { path: 'editar/:id', component: EditarCursoDialogComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursosRoutingModule {}
