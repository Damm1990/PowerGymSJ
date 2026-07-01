import Field from "./Field";

function ContactoFields({ form, handleChange }) {
  return (
    <div className="form-grid">

      <Field label="Nombre del contacto">
        <input
          type="text"
          value={form.contacto_nombre}
          onChange={(e) =>
            handleChange("contacto_nombre", e.target.value)
          }
        />
      </Field>

      <Field label="Teléfono">
        <input
          type="text"
          value={form.contacto_telefono}
          onChange={(e) =>
            handleChange("contacto_telefono", e.target.value)
          }
        />
      </Field>

      <Field label="Relación">
        <input
          type="text"
          value={form.contacto_relacion}
          onChange={(e) =>
            handleChange("contacto_relacion", e.target.value)
          }
        />
      </Field>

    </div>
  );
}

export default ContactoFields;