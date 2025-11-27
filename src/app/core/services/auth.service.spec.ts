import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Usuario } from '../models/usuario.interface';
import { AuthService } from './auth.service';

const mockUsuario: Usuario = {
  id: 'user-uuid',
  username: 'testuser',
  password: '1234',
  nombre: 'Test User',
};

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería registrar un usuario nuevo', (done) => {
    service.registrar('testuser', '1234', 'Test User').subscribe((res) => {
      expect(res.success).toBeTrue();
      done();
    });
    const req = httpMock.expectOne('http://localhost:3000/users?username=testuser');
    req.flush([]);
    const postReq = httpMock.expectOne('http://localhost:3000/users');
    postReq.flush(mockUsuario);
  });

  it('debería fallar si el usuario ya existe', (done) => {
    service.registrar('testuser', '1234', 'Test User').subscribe((res) => {
      expect(res.success).toBeFalse();
      done();
    });
    const req = httpMock.expectOne('http://localhost:3000/users?username=testuser');
    req.flush([mockUsuario]);
  });

  it('debería hacer login exitoso', (done) => {
    service.login('testuser', '1234').subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.usuario?.username).toBe('testuser');
      done();
    });
    const req = httpMock.expectOne('http://localhost:3000/users?username=testuser&password=1234');
    req.flush([mockUsuario]);
  });

  it('debería fallar login con datos incorrectos', (done) => {
    service.login('testuser', 'wrongpass').subscribe((res) => {
      expect(res.success).toBeFalse();
      done();
    });
    const req = httpMock.expectOne(
      'http://localhost:3000/users?username=testuser&password=wrongpass'
    );
    req.flush([]);
  });

  it('debería guardar y limpiar usuario en localStorage', () => {
    service['usuarioActualSubject'].next(mockUsuario);
    service.logout();
    expect(localStorage.getItem('usuarioActual')).toBeNull();
    expect(service.estaAutenticado()).toBeFalse();
  });
});
