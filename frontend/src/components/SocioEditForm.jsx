import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

import SocioFields from "./SocioFields";
import ContactoFields from "./ContactoFields";
import PlanSelector from "./PlanSelector";

function SocioEditForm({
  socioSeleccionado,
  modoEdicion,
  onClose,
  onSaved
}) {

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

  // ==========================
  // CARGAR PLANES
  // ==========================

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

  // ==========================
  // CARGAR DATOS DEL SOCIO
  // ==========================

  useEffect(() => {

    if (!socioSeleccionado) return;

    const loadData = async () => {

      // socio
      const { data: socio } = await supabase
        .from("socio")
        .select("*")
        .eq("id_socio", socioSeleccionado.id_socio)
        .single();

      // contacto
      const { data: contacto } = await supabase
        .from("contacto_emergencia")
        .select("*")
        .eq("id_socio", socioSeleccionado.id_socio)
        .maybeSingle();

      // membresía
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

  // ==========================
  // HANDLE CHANGE
  // ==========================

  const handleChange = (campo, valor) => {

    setForm((prev) => ({
      ...prev,
      [campo]: valor
    }));

  };

    // ==========================
  // GUARDAR CAMBIOS
  // ==========================

  const handleUpdate = async () => {
    const id = socioSeleccionado.id_socio;

    // --------------------------
    // DATOS DEL SOCIO
    // --------------------------

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

      if (error) {
        console.error(error);
        return;
      }
    }

    // --------------------------
    // CONTACTO
    // --------------------------

    if (modoEdicion === "contacto") {
      const { error } = await supabase
        .from("contacto_emergencia")
        .update({
          nombre: form.contacto_nombre,
          telefono: form.contacto_telefono,
          relacion: form.contacto_relacion
        })
        .eq("id_socio", id);

      if (error) {
        console.error(error);
        return;
      }
    }

    // --------------------------
    // PLAN
    // --------------------------

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

      if (error) {
        console.error(error);
        return;
      }
    }

    onSaved();
    onClose();
  };

  // ==========================
  // SUBTÍTULO
  // ==========================

  const getSubtitle = () => {
    switch (modoEdicion) {
      case "socio":
        return "Datos del socio";

      case "contacto":
        return "Contacto de emergencia";

      case "plan":
        return "Plan / Membresía";

      default:
        return "";
    }
  };

  // ==========================
  // RENDER
  // ==========================

  return (
    <div className="form-container">

      <h2>Editar Socio</h2>

      <h4 className="form-subtitle">
        {getSubtitle()}
      </h4>

            {/* ==========================
          FORMULARIO SEGÚN SECCIÓN
      ========================== */}

      <div className="form-body">

        {/* --------------------------
            DATOS DEL SOCIO
        -------------------------- */}
        {modoEdicion === "socio" && (
          <SocioFields
            form={form}
            handleChange={handleChange}
          />
        )}

        {/* --------------------------
            CONTACTO
        -------------------------- */}
        {modoEdicion === "contacto" && (
          <ContactoFields
            form={form}
            handleChange={handleChange}
          />
        )}

        {/* --------------------------
            PLAN
        -------------------------- */}
        {modoEdicion === "plan" && (
          <PlanSelector
            planes={planes}
            form={form}
            handleChange={handleChange}
          />
        )}

      </div>

      {/* ==========================
          BOTONES
      ========================== */}

      <div className="form-actions">

        <button
          className="btn-danger"
          onClick={onClose}
        >
          Cancelar
        </button>

        <button
          className="btn-success"
          onClick={handleUpdate}
        >
          Guardar cambios
        </button>

      </div>

    </div>
  );
}

export default SocioEditForm;