import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Curso } from '../../features/cursos/models/curso.interface';
import { CursosService } from './cursos.service';

const mockCurso: Curso = {
  id: 'curso-uuid',
  nombre: 'Angular Básico',
  descripcion: 'Curso de Angular',
  fechaInicio: '2025-11-24T00:00:00.000Z',
  fechaFin: '2025-12-24T00:00:00.000Z',
  estado: 'activo',
};

describe('CursosService', () => {
  let service: CursosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CursosService],
    });
    service = TestBed.inject(CursosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener cursos', () => {
    service.obtenerCursos().subscribe((cursos) => {
      expect(cursos.length).toBe(1);
      expect(cursos[0].nombre).toBe('Angular Básico');
    });
    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    req.flush([mockCurso]);
  });

  it('debería agregar un curso', () => {
    service.agregarCurso(mockCurso).subscribe((curso) => {
      expect(curso).toEqual(mockCurso);
    });
    const req = httpMock.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('POST');
    req.flush(mockCurso);
  });

  it('debería actualizar un curso', () => {
    service.actualizarCurso(mockCurso).subscribe((curso) => {
      expect(curso).toEqual(mockCurso);
    });
    const req = httpMock.expectOne(`http://localhost:3000/courses/${mockCurso.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockCurso);
  });

  it('debería eliminar un curso', () => {
    service.eliminarCurso(mockCurso.id).subscribe((resp) => {
      expect(resp).toBeTruthy();
    });
    const req = httpMock.expectOne(`http://localhost:3000/courses/${mockCurso.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería obtener curso por id', () => {
    service.obtenerCursoPorId(mockCurso.id).subscribe((curso) => {
      expect(curso).toEqual(mockCurso);
    });
    const req = httpMock.expectOne(`http://localhost:3000/courses/${mockCurso.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCurso);
  });
});
