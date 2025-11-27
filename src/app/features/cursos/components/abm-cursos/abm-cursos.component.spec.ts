import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CursosService } from '../../../../core/services/cursos.service';
import { AbmCursosComponent } from './abm-cursos.component';

const mockCurso = {
  id: 'curso-uuid',
  nombre: 'Angular Básico',
  descripcion: 'Curso de Angular',
  fechaInicio: '2025-11-24T00:00:00.000Z',
  fechaFin: '2025-12-24T00:00:00.000Z',
  estado: 'activo' as 'activo',
};

describe('AbmCursosComponent', () => {
  let component: AbmCursosComponent;
  let fixture: ComponentFixture<AbmCursosComponent>;
  let cursosServiceSpy: jasmine.SpyObj<CursosService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    cursosServiceSpy = jasmine.createSpyObj('CursosService', ['agregarCurso']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AbmCursosComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatIconModule,
      ],
      providers: [
        { provide: CursosService, useValue: cursosServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmCursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería ser inválido el formulario vacío', () => {
    expect(component.cursoForm.valid).toBeFalse();
  });

  it('debería ser válido el formulario completo', () => {
    component.cursoForm.setValue({
      nombre: 'Angular Básico',
      descripcion: 'Curso de Angular',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      estado: 'activo',
    });
    expect(component.cursoForm.valid).toBeTrue();
  });

  it('debería llamar a agregarCurso al enviar formulario válido', () => {
    cursosServiceSpy.agregarCurso.and.returnValue(of(mockCurso));
    component.cursoForm.setValue({
      nombre: 'Angular Básico',
      descripcion: 'Curso de Angular',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      estado: 'activo',
    });
    component.onSubmit();
    expect(cursosServiceSpy.agregarCurso).toHaveBeenCalled();
  });
});
