export const GATO_LIMITS = {
  nombre: { min: 2, max: 30, label: "El nombre" },
  edadAprox: { min: 1, max: 20, label: "La edad aproximada" },
  foto: { max: 500, label: "La URL de la foto" },
  descripcion: { min: 20, max: 200, label: "La descripción" },
};

export const SOLICITUD_LIMITS = {
  telefonoContacto: { min: 6, max: 20, label: "El teléfono de contacto" },
  motivo: { min: 30, max: 400, label: "El motivo" },
};

export const USER_LIMITS = {
  name: { max: 80, label: "El nombre" },
  telefono: { max: 20, label: "El teléfono" },
  direccion: { max: 100, label: "La dirección" },
  localidad: { max: 50, label: "La localidad" },
  descripcion: { min: 10, max: 200, label: "La descripción" },
};

export const getLengthError = (value, { min, max, label }, { allowEmpty = false } = {}) => {
  const text = value ?? "";
  const trimmed = text.trim();

  if (allowEmpty && trimmed.length === 0) {
    return "";
  }

  if (min !== undefined && trimmed.length < min) {
    return `${label} debe tener al menos ${min} caracteres.`;
  }

  if (max !== undefined && text.length > max) {
    return `${label} no puede superar los ${max} caracteres.`;
  }

  return "";
};

export const validateFields = (values, limits, options = {}) => {
  const errors = {};

  Object.entries(limits).forEach(([field, config]) => {
    const fieldOptions = options[field] ?? {};
    const error = getLengthError(values[field], config, fieldOptions);

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
