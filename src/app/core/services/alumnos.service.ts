import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumno } from '../../features/alumnos/models/alumno.interface';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  private readonly API_URL = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  obtenerAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.API_URL);
  }

  agregarAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.API_URL, alumno);
  }

  actualizarAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.API_URL}/${alumno.id}`, alumno);
  }

  eliminarAlumno(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  obtenerAlumnoPorId(id: string): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.API_URL}/${id}`);
  }
}
