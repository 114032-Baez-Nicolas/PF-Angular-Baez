import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { AlumnosService } from '../../../../core/services/alumnos.service';

@Component({
  selector: 'app-abm-alumnos',
  templateUrl: './abm-alumnos.component.html',
  styleUrl: './abm-alumnos.component.css',
  standalone: false,
})
export class AbmAlumnosComponent implements OnInit {
  alumnoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private alumnosService: AlumnosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      fechaInscripcion: [new Date(), [Validators.required]],
      activo: [true],
    });
  }

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      const { id, ...alumnoSinId } = this.alumnoForm.value;

      const alumnoParaGuardar = {
        id: uuidv4(),
        ...alumnoSinId,
        fechaInscripcion:
          alumnoSinId.fechaInscripcion instanceof Date
            ? alumnoSinId.fechaInscripcion.toISOString()
            : alumnoSinId.fechaInscripcion,
      };
      this.alumnosService.agregarAlumno(alumnoParaGuardar).subscribe(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El alumno se ha agregado correctamente',
          icon: 'success',
          confirmButtonColor: '#3f51b5',
          confirmButtonText: 'Aceptar',
        });
        this.alumnoForm.reset({
          fechaInscripcion: new Date(),
          activo: true,
        });
      });
    } else {
      this.marcarCamposComoTocados();
      Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos correctamente',
        icon: 'error',
        confirmButtonColor: '#3f51b5',
      });
    }
  }

  volverAlListado(): void {
    this.router.navigate(['/alumnos']);
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.alumnoForm.controls).forEach((key) => {
      this.alumnoForm.get(key)?.markAsTouched();
    });
  }

  obtenerErrorNombre(): string {
    const control = this.alumnoForm.get('nombre');
    if (control?.hasError('required')) {
      return 'El nombre es requerido';
    }
    if (control?.hasError('minlength')) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    return '';
  }

  obtenerErrorApellido(): string {
    const control = this.alumnoForm.get('apellido');
    if (control?.hasError('required')) {
      return 'El apellido es requerido';
    }
    if (control?.hasError('minlength')) {
      return 'El apellido debe tener al menos 2 caracteres';
    }
    return '';
  }

  obtenerErrorEmail(): string {
    const control = this.alumnoForm.get('email');
    if (control?.hasError('required')) {
      return 'El email es requerido';
    }
    if (control?.hasError('email')) {
      return 'El email no es válido';
    }
    return '';
  }
}
