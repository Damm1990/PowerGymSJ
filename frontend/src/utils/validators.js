export function isRequired(value) {
  return value !== null && value !== undefined && value.toString().trim() !== "";
}

export function onlyNumbers(value) {
  return /^\d+$/.test(value);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPastDate(date) {
  return new Date(date) <= new Date();
}

// =========================
// STEP 1
// =========================
export function validateStep1(form) {
  const errors = {};

  if (!isRequired(form.apellido))
    errors.apellido = "El apellido es obligatorio.";

  if (!isRequired(form.nombre))
    errors.nombre = "El nombre es obligatorio.";

  if (!isRequired(form.dni))
    errors.dni = "El DNI es obligatorio.";
  else if (!onlyNumbers(form.dni))
    errors.dni = "El DNI debe contener solo números.";

  if (!isRequired(form.fecha_nacimiento))
    errors.fecha_nacimiento = "La fecha de nacimiento es obligatoria.";
  else if (!isPastDate(form.fecha_nacimiento))
    errors.fecha_nacimiento = "La fecha no puede ser futura.";

  if (!isRequired(form.telefono))
    errors.telefono = "El teléfono es obligatorio.";

  if (!isRequired(form.email))
    errors.email = "El email es obligatorio.";
  else if (!isValidEmail(form.email))
    errors.email = "Email inválido.";

  return errors;
}

// =========================
// STEP 2
// =========================
export function validateStep2(form) {
  const errors = {};

  if (!isRequired(form.contacto_nombre))
    errors.contacto_nombre = "Ingrese un contacto.";

  if (!isRequired(form.contacto_telefono))
    errors.contacto_telefono = "Ingrese un teléfono.";

  if (!isRequired(form.contacto_relacion))
    errors.contacto_relacion = "Ingrese el parentesco.";

  return errors;
}

// =========================
// STEP 3
// =========================
export function validateStep3(form) {
  const errors = {};

  if (!form.id_plan)
    errors.id_plan = "Seleccione un plan.";

  return errors;
}