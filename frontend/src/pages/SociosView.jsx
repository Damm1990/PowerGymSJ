import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import SocioFicha from "../components/SocioFicha";
import SocioEditForm from "../components/SocioEditForm";
import logo from "../assets/logoPowerGymSJ.png";

function SocioView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ficha, setFicha] = useState(null);

  const [modoEdicion, setModoEdicion] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);

  // =========================
  // FETCH SOCIO
  // =========================
  const fetchSocio = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("socio")
      .select("*")
      .eq("id_socio", id)
      .single();

    if (!error) setSocio(data);
    else setSocio(null);

    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchSocio();
  }, [id]);

  // =========================
  // ACCIONES
  // =========================
  const handleDelete = async () => {
    await supabase
      .from("socio")
      .update({ estado: "inactivo" })
      .eq("id_socio", id);

    fetchSocio();
  };

  const handleReactivate = async () => {
    await supabase
      .from("socio")
      .update({ estado: "activo" })
      .eq("id_socio", id);

    fetchSocio();
  };

  const handleEdit = () => {
    setSocioSeleccionado(socio);
    setModoEdicion("menu");
  };

  const closeAll = () => {
    setMostrarForm(false);
    setModoEdicion(null);
    setSocioSeleccionado(null);
  };

  const openEditor = (modo) => {
    setModoEdicion(modo);
    setMostrarForm(true);
  };

  // =========================
  // IMPRIMIR FICHA
  // =========================
  const handlePrint = async () => {
    if (!socio) return;

    const { data: contacto } = await supabase
      .from("contacto_emergencia")
      .select("*")
      .eq("id_socio", socio.id_socio)
      .maybeSingle();

    const { data: membresia } = await supabase
      .from("membresia")
      .select("*")
      .eq("id_socio", socio.id_socio)
      .maybeSingle();

    const { data: plan } = membresia?.id_plan
      ? await supabase
          .from("plan")
          .select("*")
          .eq("id_plan", membresia.id_plan)
          .maybeSingle()
      : { data: null };

    setFicha({ socio, contacto, membresia, plan });

    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        setFicha(null);
      }, 150);
    });
  };

  // =========================
  // ESTADOS
  // =========================
  if (loading) return <p>Cargando...</p>;
  if (!socio) return <p>No se encontró el socio.</p>;

  // =========================
  // UI
  // =========================
  return (
    <div className="socio-view">

      {/* ================= MODAL MENÚ ================= */}
      {modoEdicion === "menu" && (
        <div className="modal">
          <div className="modal-content">

            <div className="app-header">
              <img src={logo} alt="PowerGymSJ" className="logo" />
              <h2>Socio</h2>
            </div>

            <h3>Nº DE SOCIO: {socio.id_socio}</h3>
            <h3>{socio.apellido} {socio.nombre}</h3>

            <h3>¿Qué querés editar?</h3>

            <button onClick={() => openEditor("socio")}>
              🧍 Datos del socio
            </button>

            <button onClick={() => openEditor("contacto")}>
              🚨 Contacto de emergencia
            </button>

            <button onClick={() => openEditor("plan")}>
              🏋️ Plan / membresía
            </button>

            <button className="btn-danger" onClick={closeAll}>
              Cancelar
            </button>

          </div>
        </div>
      )}

      {/* ================= FORMULARIO ================= */}
      {mostrarForm && modoEdicion !== "menu" && (
        <SocioEditForm
          socioSeleccionado={socioSeleccionado}
          modoEdicion={modoEdicion}
          onClose={closeAll}
          onSaved={() => {
            fetchSocio();
            closeAll();
          }}
        />
      )}

      {/* ================= VISTA NORMAL ================= */}
      {!modoEdicion && !mostrarForm && (
        <>
        <div className="app-header">
              <img src={logo} alt="PowerGymSJ" className="logo" />
              <h2>Socio</h2>
            </div>
          <h2>{socio.apellido} {socio.nombre}</h2>

          <p><strong>Nº DE SOCIO:</strong> {socio.id_socio}</p>
          <p><strong>DNI:</strong> {socio.dni}</p>
          <p><strong>Teléfono:</strong> {socio.telefono}</p>
          <p><strong>Email:</strong> {socio.email}</p>

          <div className="actions">

            <button className="btn-success" onClick={handlePrint}>
              Imprimir ficha
            </button>

            <button className="btn-warning" onClick={handleEdit}>
              Editar
            </button>

            {socio.estado === "activo" ? (
              <button className="btn-danger" onClick={handleDelete}>
                Dar de baja
              </button>
            ) : (
              <button className="btn-success" onClick={handleReactivate}>
                Reactivar
              </button>
            )}

            <button onClick={() => navigate("/socios")}>
              ← Volver
            </button>

          </div>
        </>
      )}

      {/* ================= FICHA PARA IMPRESIÓN ================= */}
      {ficha && (
        <SocioFicha
          socio={ficha.socio}
          contacto={ficha.contacto}
          membresia={ficha.membresia}
          plan={ficha.plan}
        />
      )}

    </div>
  );
}

export default SocioView;