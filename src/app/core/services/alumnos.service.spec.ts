import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Alumno } from '../../features/alumnos/models/alumno.interface';
import { AlumnosService } from './alumnos.service';

const mockAlumno: Alumno = {
  id: 'test-id',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@test.com',
  fechaInscripcion: '2025-11-24T00:00:00.000Z',
  activo: true,
};

describe('AlumnosService', () => {
  let service: AlumnosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlumnosService],
    });
    service = TestBed.inject(AlumnosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener alumnos', () => {
    service.obtenerAlumnos().subscribe((alumnos) => {
      expect(alumnos.length).toBe(1);
      expect(alumnos[0].nombre).toBe('Juan');
    });
    const req = httpMock.expectOne('http://localhost:3000/students');
    expect(req.request.method).toBe('GET');
    req.flush([mockAlumno]);
  });

  it('debería agregar un alumno', () => {
    service.agregarAlumno(mockAlumno).subscribe((alumno) => {
      expect(alumno).toEqual(mockAlumno);
    });
    const req = httpMock.expectOne('http://localhost:3000/students');
    expect(req.request.method).toBe('POST');
    req.flush(mockAlumno);
  });

  it('debería actualizar un alumno', () => {
    service.actualizarAlumno(mockAlumno).subscribe((alumno) => {
      expect(alumno).toEqual(mockAlumno);
    });
    const req = httpMock.expectOne(`http://localhost:3000/students/${mockAlumno.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAlumno);
  });

  it('debería eliminar un alumno', () => {
    service.eliminarAlumno('test-id').subscribe((resp) => {
      expect(resp).toBeTruthy();
    });
    const req = httpMock.expectOne('http://localhost:3000/students/test-id');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería obtener alumno por id', () => {
    service.obtenerAlumnoPorId('test-id').subscribe((alumno) => {
      expect(alumno).toEqual(mockAlumno);
    });
    const req = httpMock.expectOne('http://localhost:3000/students/test-id');
    expect(req.request.method).toBe('GET');
    req.flush(mockAlumno);
  });
});
