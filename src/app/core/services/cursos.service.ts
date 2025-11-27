import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../../features/cursos/models/curso.interface';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private readonly API_URL = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  obtenerCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.API_URL);
  }

  agregarCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.API_URL, curso);
  }

  actualizarCurso(curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.API_URL}/${curso.id}`, curso);
  }

  eliminarCurso(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  obtenerCursoPorId(id: string): Observable<Curso> {
    return this.http.get<Curso>(`${this.API_URL}/${id}`);
  }
}
