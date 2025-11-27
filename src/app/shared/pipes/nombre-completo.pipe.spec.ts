import { NombreCompletoPipe } from './nombre-completo.pipe';

describe('NombreCompletoPipe', () => {
  const pipe = new NombreCompletoPipe();

  it('debería concatenar nombre y apellido', () => {
    const alumnoMock = {
      id: 'uuid-1',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@correo.com',
      fechaInscripcion: '2025-11-24T00:00:00.000Z',
      activo: true,
    };
    expect(pipe.transform(alumnoMock)).toBe('Juan Pérez');
  });

  it('debería devolver vacío si no hay datos', () => {
    expect(pipe.transform({} as any)).toBe('');
  });
});
