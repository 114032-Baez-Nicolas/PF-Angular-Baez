import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Curso } from '../../models/curso.interface';

@Component({
  selector: 'app-editar-curso-dialog',
  templateUrl: './editar-curso-dialog.component.html',
  styleUrls: ['./editar-curso-dialog.component.css'],
  standalone: false,
})
export class EditarCursoDialogComponent implements OnInit {
  cursoForm!: FormGroup;
  estadosDisponibles = [
    { valor: 'activo', etiqueta: 'Activo' },
    { valor: 'inactivo', etiqueta: 'Inactivo' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditarCursoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { curso: Curso }
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.cursoForm = this.fb.group({
      nombre: [this.data.curso.nombre, [Validators.required, Validators.minLength(3)]],
      descripcion: [this.data.curso.descripcion, [Validators.required, Validators.minLength(10)]],
      fechaInicio: [this.data.curso.fechaInicio, [Validators.required]],
      fechaFin: [this.data.curso.fechaFin, [Validators.required]],
      estado: [this.data.curso.estado, [Validators.required]],
    });
  }

  onGuardar(): void {
    if (this.cursoForm.valid) {
      const cursoActualizado: Curso = {
        id: this.data.curso.id,
        ...this.cursoForm.value,
      };
      this.dialogRef.close(cursoActualizado);
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
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
