import Field from "./Field";

function SocioFields({ form, handleChange }) {
  return (
    <div className="form-grid">

      <Field label="Apellido">
        <input
          value={form.apellido}
          onChange={(e) => handleChange("apellido", e.target.value)}
        />
      </Field>

      <Field label="Nombre">
        <input
          value={form.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />
      </Field>

      <Field label="DNI">
        <input
          value={form.dni}
          onChange={(e) => handleChange("dni", e.target.value)}
        />
      </Field>

      <Field label="Fecha de nacimiento">
        <input
          type="date"
          value={form.fecha_nacimiento}
          onChange={(e) =>
            handleChange("fecha_nacimiento", e.target.value)
          }
        />
      </Field>

      <Field label="Localidad">
        <input
          value={form.localidad}
          onChange={(e) => handleChange("localidad", e.target.value)}
        />
      </Field>

      <Field label="Código postal">
        <input
          value={form.codigo_postal}
          onChange={(e) =>
            handleChange("codigo_postal", e.target.value)
          }
        />
      </Field>

      <Field label="Calle">
        <input
          value={form.calle}
          onChange={(e) => handleChange("calle", e.target.value)}
        />
      </Field>

      <Field label="Número">
        <input
          value={form.numero}
          onChange={(e) => handleChange("numero", e.target.value)}
        />
      </Field>

      <Field label="Teléfono">
        <input
          value={form.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </Field>

    </div>
  );
}

export default SocioFields;