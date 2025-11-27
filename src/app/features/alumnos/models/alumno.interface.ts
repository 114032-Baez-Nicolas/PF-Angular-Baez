export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaInscripcion: string | Date;
  activo: boolean;
}
