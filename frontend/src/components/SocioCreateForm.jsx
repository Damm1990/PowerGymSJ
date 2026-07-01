import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

import SocioFields from "./SocioFields";
import ContactoFields from "./ContactoFields";
import PlanSelector from "./PlanSelector";

import {
  validateStep1,
  validateStep2,
  validateStep3
} from "../utils/validators";

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

  const [errores, setErrores] = useState({});
  const [dniDuplicado, setDniDuplicado] = useState("");

  // =========================
  // VALIDACIONES POR PASO
  // =========================
  const errorsStep1 = validateStep1(form);
  const errorsStep2 = validateStep2(form);
  const errorsStep3 = validateStep3(form);

  const errorsStep1Final = {
    ...errorsStep1,
    ...(dniDuplicado ? { dni: dniDuplicado } : {})
  };

  // =========================
  // CARGA PLANES
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
  // VALIDAR DNI DUPLICADO (REALTIME)
  // =========================
  useEffect(() => {
    const checkDni = async () => {
      if (!form.dni) return;

      const { data, error } = await supabase
        .from("socio")
        .select("id_socio")
        .eq("dni", form.dni);

      if (error) return;

      setDniDuplicado(
        data?.length ? "Ya existe un socio con ese DNI." : ""
      );
    };

    checkDni();
  }, [form.dni]);

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
    const errors = validateStep1(form);

    if (dniDuplicado) {
      errors.dni = dniDuplicado;
    }

    if (Object.keys(errors).length > 0) {
      setErrores(errors);
      return;
    }

    // 1. Insert socio
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

    // 2. contacto emergencia
    await supabase.from("contacto_emergencia").insert([
      {
        id_socio,
        nombre: form.contacto_nombre,
        telefono: form.contacto_telefono,
        relacion: form.contacto_relacion
      }
    ]);

    // 3. membresía
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
        fecha_de_baja: null
      }
    ]);

    onSaved();
    onClose();
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="form-container">

      <h2>Nuevo Socio</h2>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <SocioFields
            form={form}
            handleChange={handleChange}
            errors={errorsStep1Final}
          />

          <div className="form-actions">
            <button
              onClick={() => setStep(2)}
              disabled={Object.keys(errorsStep1Final).length > 0}
            >
              Siguiente
            </button>

            <button className="btn-danger" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* ================= STEP 2 ================= */}
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

            <button
              onClick={() => setStep(3)}
              disabled={Object.keys(errorsStep2).length > 0}
            >
              Siguiente
            </button>

            <button className="btn-danger" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </>
      )}

      {/* ================= STEP 3 ================= */}
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
              disabled={Object.keys(errorsStep3).length > 0}
            >
              Guardar
            </button>

            <button className="btn-danger" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SocioCreateForm;