import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

import SocioFields from "./SocioFields";
import ContactoFields from "./ContactoFields";
import PlanSelector from "./PlanSelector";
import logo from "../assets/logoPowerGymSJ.png";

import {
  validateStep1,
  validateStep2,
  validateStep3
} from "../utils/validators";

function SocioEditForm({
  socioSeleccionado,
  modoEdicion,
  onClose,
  onSaved
}) {
  const [planes, setPlanes] = useState([]);
  const [errores, setErrores] = useState({});
  const [dniDuplicado, setDniDuplicado] = useState("");

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
  // VALIDACIONES POR SECCIÓN
  // =========================
  const errorsStep1 = validateStep1(form);
  const errorsStep2 = validateStep2(form);
  const errorsStep3 = validateStep3(form);

  const errorsStep1Final = {
    ...errorsStep1,
    ...(dniDuplicado ? { dni: dniDuplicado } : {})
  };

  const isDisabled =
    modoEdicion === "socio"
      ? Object.keys(errorsStep1Final).length > 0
      : modoEdicion === "contacto"
      ? Object.keys(errorsStep2).length > 0
      : Object.keys(errorsStep3).length > 0;

  // =========================
  // CARGAR PLANES
  // =========================
  useEffect(() => {
    const fetchPlanes = async () => {
      const { data } = await supabase
        .from("plan")
        .select("*")
        .order("id_plan");

      setPlanes(data || []);
    };

    fetchPlanes();
  }, []);

  // =========================
  // CARGAR DATOS SOCIO
  // =========================
  useEffect(() => {
    if (!socioSeleccionado) return;

    const loadData = async () => {
      const { data: socio } = await supabase
        .from("socio")
        .select("*")
        .eq("id_socio", socioSeleccionado.id_socio)
        .single();

      const { data: contacto } = await supabase
        .from("contacto_emergencia")
        .select("*")
        .eq("id_socio", socioSeleccionado.id_socio)
        .maybeSingle();

      const { data: membresia } = await supabase
        .from("membresia")
        .select("*")
        .eq("id_socio", socioSeleccionado.id_socio)
        .maybeSingle();

      setForm({
        apellido: socio.apellido || "",
        nombre: socio.nombre || "",
        dni: socio.dni || "",
        fecha_nacimiento: socio.fecha_nacimiento || "",
        localidad: socio.localidad || "",
        codigo_postal: socio.codigo_postal || "",
        calle: socio.calle || "",
        numero: socio.numero || "",
        telefono: socio.telefono || "",
        email: socio.email || "",

        contacto_nombre: contacto?.nombre || "",
        contacto_telefono: contacto?.telefono || "",
        contacto_relacion: contacto?.relacion || "",

        id_plan: membresia?.id_plan || null
      });
    };

    loadData();
  }, [socioSeleccionado]);

  // =========================
  // VALIDAR DNI DUPLICADO (solo edit socio)
  // =========================
  useEffect(() => {
    const checkDni = async () => {
      if (modoEdicion !== "socio") return;
      if (!form.dni) return;

      const { data } = await supabase
        .from("socio")
        .select("id_socio")
        .eq("dni", form.dni);

      // ignorar el propio socio
      const filtered = data?.filter(
        (d) => d.id_socio !== socioSeleccionado.id_socio
      );

      setDniDuplicado(
        filtered?.length ? "Ya existe un socio con ese DNI." : ""
      );
    };

    checkDni();
  }, [form.dni, modoEdicion]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor
    }));

    setErrores((prev) => ({
      ...prev,
      [campo]: ""
    }));
  };

  // =========================
  // GUARDAR CAMBIOS
  // =========================
  const handleUpdate = async () => {
    const id = socioSeleccionado.id_socio;

    // VALIDACIÓN FINAL
    const errors =
      modoEdicion === "socio"
        ? validateStep1(form)
        : modoEdicion === "contacto"
        ? validateStep2(form)
        : validateStep3(form);

    if (modoEdicion === "socio" && dniDuplicado) {
      errors.dni = dniDuplicado;
    }

    if (Object.keys(errors).length > 0) {
      setErrores(errors);
      return;
    }

    setErrores({});

    // =========================
    // UPDATE SOCIO
    // =========================
    if (modoEdicion === "socio") {
      const { error } = await supabase
        .from("socio")
        .update({
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
        })
        .eq("id_socio", id);

      if (error) return console.error(error);
    }

    // =========================
    // UPDATE CONTACTO
    // =========================
    if (modoEdicion === "contacto") {
      const { error } = await supabase
        .from("contacto_emergencia")
        .update({
          nombre: form.contacto_nombre,
          telefono: form.contacto_telefono,
          relacion: form.contacto_relacion
        })
        .eq("id_socio", id);

      if (error) return console.error(error);
    }

    // =========================
    // UPDATE PLAN
    // =========================
    if (modoEdicion === "plan") {
      const plan = planes.find(
        (p) => p.id_plan === form.id_plan
      );

      const { error } = await supabase
        .from("membresia")
        .update({
          id_plan: form.id_plan,
          observaciones: plan?.nombre || ""
        })
        .eq("id_socio", id);

      if (error) return console.error(error);
    }

    onSaved();
    onClose();
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="form-container">

      <div className="app-header">
        <img src={logo} alt="PowerGymSJ" className="logo" />
        <h2>Socios</h2>
      </div>

      <h2>Editar Socio</h2>

      <h4 className="form-subtitle">
        {modoEdicion === "socio"
          ? "Datos del socio"
          : modoEdicion === "contacto"
          ? "Contacto de emergencia"
          : "Plan / Membresía"}
      </h4>

      {/* ================= FORM ================= */}
      <div className="form-body">
        {modoEdicion === "socio" && (
          <SocioFields
            form={form}
            handleChange={handleChange}
            errors={errorsStep1Final}
          />
        )}

        {modoEdicion === "contacto" && (
          <ContactoFields
            form={form}
            handleChange={handleChange}
          />
        )}

        {modoEdicion === "plan" && (
          <PlanSelector
            planes={planes}
            form={form}
            handleChange={handleChange}
          />
        )}
      </div>

      {/* ================= BOTONES ================= */}
      <div className="form-actions">

        <button className="btn-danger" onClick={onClose}>
          Cancelar
        </button>

        <button
          className="btn-success"
          onClick={handleUpdate}
          disabled={isDisabled}
        >
          Guardar cambios
        </button>

      </div>

    </div>
  );
}

export default SocioEditForm;