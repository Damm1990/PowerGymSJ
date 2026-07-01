import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

import SocioFields from "./SocioFields";
import ContactoFields from "./ContactoFields";
import PlanSelector from "./PlanSelector";

function SocioCreateForm({ onClose, onSaved }) {
  const [step, setStep] = useState(1);
  const [planes, setPlanes] = useState([]);

  const [form, setForm] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    fecha_nacimiento: "",
    localidad: "",
    codigo_postal: "",
    calle: "",
    numero: "",
    telefono: "",
    email: "",

    contacto_nombre: "",
    contacto_telefono: "",
    contacto_relacion: "",

    id_plan: null
  });

  // =========================
  // CARGA DE PLANES
  // =========================
  useEffect(() => {
    const fetchPlanes = async () => {
      const { data } = await supabase
        .from("plan")
        .select("*")
        .order("id_plan", { ascending: true });

      setPlanes(data || []);
    };

    fetchPlanes();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // =========================
  // GUARDAR
  // =========================
  const handleSave = async () => {
    const { data: socio, error } = await supabase
      .from("socio")
      .insert([
        {
          apellido: form.apellido,
          nombre: form.nombre,
          dni: form.dni,
          fecha_nacimiento: form.fecha_nacimiento,
          localidad: form.localidad,
          codigo_postal: form.codigo_postal,
          calle: form.calle,
          numero: form.numero,
          telefono: form.telefono,
          email: form.email
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    const id_socio = socio.id_socio;

    await supabase.from("contacto_emergencia").insert([
      {
        id_socio,
        nombre: form.contacto_nombre,
        telefono: form.contacto_telefono,
        relacion: form.contacto_relacion
      }
    ]);

    const plan = planes.find((p) => p.id_plan === form.id_plan);

    const fechaAlta = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);

    await supabase.from("membresia").insert([
      {
        id_socio,
        id_plan: form.id_plan,
        estado: "activo",
        observaciones: plan?.nombre || "",
        fecha_alta: fechaAlta,
        fecha_vencimiento: fechaVencimiento
      }
    ]);

    onSaved();
    onClose();
  };

  // =========================
  // SUBTÍTULO
  // =========================
  const getSubtitle = () => {
    switch (step) {
      case 1:
        return "Datos del socio";
      case 2:
        return "Contacto de emergencia";
      case 3:
        return "Planes disponibles";
      default:
        return "";
    }
  };

  return (
    <div className="form-container">

      <h2>Nuevo Socio</h2>
      <h4 className="form-subtitle">{getSubtitle()}</h4>

      {/* ================= PASO 1 ================= */}

      {step === 1 && (
        <>
          <SocioFields
            form={form}
            handleChange={handleChange}
          />

          <div className="form-actions">
            <button onClick={() => setStep(2)}>
              Siguiente
            </button>

            <button
              className="btn-danger"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* ================= PASO 2 ================= */}

      {step === 2 && (
        <>
          <ContactoFields
            form={form}
            handleChange={handleChange}
          />

          <div className="form-actions">
            <button onClick={() => setStep(1)}>
              Atrás
            </button>

            <button onClick={() => setStep(3)}>
              Siguiente
            </button>

            <button
              className="btn-danger"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* ================= PASO 3 ================= */}

      {step === 3 && (
        <>
          <PlanSelector
            planes={planes}
            form={form}
            handleChange={handleChange}
          />

          <div className="form-actions">
            <button onClick={() => setStep(2)}>
              Atrás
            </button>

            <button
              className="btn-success"
              onClick={handleSave}
              disabled={!form.id_plan}
            >
              Guardar
            </button>

            <button
              className="btn-danger"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default SocioCreateForm;