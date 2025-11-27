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
import { AlumnosService } from '../../../../core/services/alumnos.service';
import { AbmAlumnosComponent } from './abm-alumnos.component';

const mockAlumno = {
  id: 'uuid-test',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@test.com',
  fechaInscripcion: '2025-11-24T00:00:00.000Z',
  activo: true,
};

describe('AbmAlumnosComponent', () => {
  let component: AbmAlumnosComponent;
  let fixture: ComponentFixture<AbmAlumnosComponent>;
  let alumnosServiceSpy: jasmine.SpyObj<AlumnosService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    alumnosServiceSpy = jasmine.createSpyObj('AlumnosService', ['agregarAlumno']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AbmAlumnosComponent],
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
        { provide: AlumnosService, useValue: alumnosServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AbmAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería ser inválido el formulario vacío', () => {
    expect(component.alumnoForm.valid).toBeFalse();
  });

  it('debería ser válido el formulario completo', () => {
    component.alumnoForm.setValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      fechaInscripcion: new Date(),
      activo: true,
    });
    expect(component.alumnoForm.valid).toBeTrue();
  });

  it('debería llamar a agregarAlumno al enviar formulario válido', () => {
    alumnosServiceSpy.agregarAlumno.and.returnValue(of(mockAlumno));
    component.alumnoForm.setValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@test.com',
      fechaInscripcion: new Date(),
      activo: true,
    });
    component.onSubmit();
    expect(alumnosServiceSpy.agregarAlumno).toHaveBeenCalled();
  });
});
