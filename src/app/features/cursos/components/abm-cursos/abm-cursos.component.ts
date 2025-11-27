import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { CursosService } from '../../../../core/services/cursos.service';

@Component({
  selector: 'app-abm-cursos',
  templateUrl: './abm-cursos.component.html',
  styleUrls: ['./abm-cursos.component.css'],
  standalone: false,
})
export class AbmCursosComponent implements OnInit {
  cursoForm!: FormGroup;
  estadosDisponibles = [
    { valor: 'activo', etiqueta: 'Activo' },
    { valor: 'inactivo', etiqueta: 'Inactivo' },
  ];

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaInicio: [new Date(), [Validators.required]],
      fechaFin: [new Date(), [Validators.required]],
      estado: ['activo', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      const { id, ...cursoSinId } = this.cursoForm.value;
      const cursoParaGuardar = {
        id: uuidv4(),
        ...cursoSinId,
      };
      this.cursosService.agregarCurso(cursoParaGuardar).subscribe(() => {
        Swal.fire({
          title: 'Curso creado',
          text: 'El curso se agregó correctamente',
          icon: 'success',
          confirmButtonColor: '#3f51b5',
          confirmButtonText: 'Aceptar',
        });
        this.cursoForm.reset({
          fechaInicio: new Date(),
          fechaFin: new Date(),
          estado: 'activo',
        });
      });
    } else {
      this.marcarCamposComoTocados();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Revisá que todos los campos estén correctos',
        icon: 'error',
        confirmButtonColor: '#3f51b5',
      });
    }
  }

  volverAlListado(): void {
    this.router.navigate(['/cursos']);
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.cursoForm.controls).forEach((key) => {
      this.cursoForm.get(key)?.markAsTouched();
    });
  }

  obtenerErrorNombre(): string {
    const control = this.cursoForm.get('nombre');
    if (control?.hasError('required')) {
      return 'El nombre es obligatorio';
    }
    if (control?.hasError('minlength')) {
      return 'Mínimo 3 caracteres';
    }
    return '';
  }

  obtenerErrorDescripcion(): string {
    const control = this.cursoForm.get('descripcion');
    if (control?.hasError('required')) {
      return 'La descripción es obligatoria';
    }
    if (control?.hasError('minlength')) {
      return 'Mínimo 10 caracteres';
    }
    return '';
  }

  obtenerErrorFechaInicio(): string {
    const control = this.cursoForm.get('fechaInicio');
    if (control?.hasError('required')) {
      return 'Seleccioná una fecha';
    }
    return '';
  }

  obtenerErrorFechaFin(): string {
    const control = this.cursoForm.get('fechaFin');
    if (control?.hasError('required')) {
      return 'Seleccioná una fecha';
    }
    return '';
  }
}
