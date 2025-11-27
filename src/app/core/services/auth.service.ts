import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from '../models/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/users';
  private readonly CURRENT_USER_KEY = 'usuarioActual';
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(this.obtenerUsuarioActual());
  usuarioActual$: Observable<Usuario | null> = this.usuarioActualSubject.asObservable();

  constructor(private http: HttpClient) {}

  private obtenerUsuarioActual(): Usuario | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  registrar(
    username: string,
    password: string,
    nombre: string
  ): Observable<{ success: boolean; message: string }> {
    return this.http.get<Usuario[]>(`${this.API_URL}?username=${username}`).pipe(
      map((usuarios) => {
        if (usuarios.length > 0) {
          return { success: false, message: 'El usuario ya existe' };
        }
        const nuevoUsuario: Usuario = { id: uuidv4(), username, password, nombre };
        this.http.post<Usuario>(this.API_URL, nuevoUsuario).subscribe();
        return { success: true, message: 'Usuario registrado correctamente' };
      }),
      catchError(() => of({ success: false, message: 'Error al registrar usuario' }))
    );
  }

  login(
    username: string,
    password: string
  ): Observable<{ success: boolean; message: string; usuario?: Usuario }> {
    return this.http
      .get<Usuario[]>(`${this.API_URL}?username=${username}&password=${password}`)
      .pipe(
        map((usuarios) => {
          if (usuarios.length > 0) {
            const usuario = usuarios[0];
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(usuario));
            this.usuarioActualSubject.next(usuario);
            return { success: true, message: 'Inicio de sesión exitoso', usuario };
          }
          return { success: false, message: 'Usuario o contraseña incorrectos' };
        }),
        catchError(() => of({ success: false, message: 'Error al iniciar sesión' }))
      );
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.usuarioActualSubject.next(null);
  }

  estaAutenticado(): boolean {
    return this.usuarioActualSubject.value !== null;
  }

  obtenerNombreUsuario(): string {
    return this.usuarioActualSubject.value?.nombre || '';
  }
}
