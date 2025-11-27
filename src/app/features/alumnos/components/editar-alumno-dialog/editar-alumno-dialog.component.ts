import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Alumno } from '../../models/alumno.interface';

@Component({
  selector: 'app-editar-alumno-dialog',
  templateUrl: './editar-alumno-dialog.component.html',
  styleUrls: ['./editar-alumno-dialog.component.css'],
  standalone: false,
})
export class EditarAlumnoDialogComponent implements OnInit {
  alumnoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditarAlumnoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { alumno: Alumno }
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.alumnoForm = this.fb.group({
      nombre: [this.data.alumno.nombre, [Validators.required, Validators.minLength(2)]],
      apellido: [this.data.alumno.apellido, [Validators.required, Validators.minLength(2)]],
      email: [this.data.alumno.email, [Validators.required, Validators.email]],
      fechaInscripcion: [this.data.alumno.fechaInscripcion, [Validators.required]],
      activo: [this.data.alumno.activo],
    });
  }

  onGuardar(): void {
    if (this.alumnoForm.valid) {
      const formValue = this.alumnoForm.value;
      const alumnoActualizado: Alumno = {
        id: this.data.alumno.id,
        ...formValue,
        fechaInscripcion:
          formValue.fechaInscripcion instanceof Date
            ? formValue.fechaInscripcion.toISOString()
            : formValue.fechaInscripcion,
      };
      this.dialogRef.close(alumnoActualizado);
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  obtenerErrorNombre(): string {
    const control = this.alumnoForm.get('nombre');
    if (control?.hasError('required')) {
      return 'El nombre es requerido';
    }
    if (control?.hasError('minlength')) {
      return 'Mínimo 2 caracteres';
    }
    return '';
  }

  obtenerErrorApellido(): string {
    const control = this.alumnoForm.get('apellido');
    if (control?.hasError('required')) {
      return 'El apellido es requerido';
    }
    if (control?.hasError('minlength')) {
      return 'Mínimo 2 caracteres';
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
