import Field from "./Field";

function SocioFields({ form, handleChange, errors = {} }) {
  return (
    <div className="form-grid">

      <Field label="Apellido">
        <input
          value={form.apellido}
          onChange={(e) => handleChange("apellido", e.target.value)}
        />
        {errors.apellido && <small className="error">{errors.apellido}</small>}
      </Field>

      <Field label="Nombre">
        <input
          value={form.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />
        {errors.nombre && <small className="error">{errors.nombre}</small>}
      </Field>

      <Field label="DNI">
        <input
          value={form.dni}
          onChange={(e) => handleChange("dni", e.target.value)}
        />
        {errors.dni && <small className="error">{errors.dni}</small>}
      </Field>

      <Field label="Fecha de nacimiento">
        <input
          type="date"
          value={form.fecha_nacimiento}
          onChange={(e) =>
            handleChange("fecha_nacimiento", e.target.value)
          }
        />
        {errors.fecha_nacimiento && (
          <small className="error">{errors.fecha_nacimiento}</small>
        )}
      </Field>

      <Field label="Localidad">
        <input
          value={form.localidad}
          onChange={(e) => handleChange("localidad", e.target.value)}
        />
        {errors.localidad && (
          <small className="error">{errors.localidad}</small>
        )}
      </Field>

      <Field label="Código postal">
        <input
          value={form.codigo_postal}
          onChange={(e) =>
            handleChange("codigo_postal", e.target.value)
          }
        />
        {errors.codigo_postal && (
          <small className="error">{errors.codigo_postal}</small>
        )}
      </Field>

      <Field label="Calle">
        <input
          value={form.calle}
          onChange={(e) => handleChange("calle", e.target.value)}
        />
        {errors.calle && <small className="error">{errors.calle}</small>}
      </Field>

      <Field label="Número">
        <input
          value={form.numero}
          onChange={(e) => handleChange("numero", e.target.value)}
        />
        {errors.numero && <small className="error">{errors.numero}</small>}
      </Field>

      <Field label="Teléfono">
        <input
          value={form.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />
        {errors.telefono && (
          <small className="error">{errors.telefono}</small>
        )}
      </Field>

      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && <small className="error">{errors.email}</small>}
      </Field>

    </div>
  );
}

export default SocioFields;