import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import SocioRow from "../components/SocioRow";
import logo from "../assets/logoPowerGymSJ.png";
import SocioForm from "../components/SocioForm";
import SocioFicha from "../components/SocioFicha";
import SocioSearch from "../components/SocioSearch";

function Socios() {
 
  const [socios, setSocios] = useState([]);
  const [filtro, setFiltro] = useState("activos");
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [ficha, setFicha] = useState(null);
 const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
 const [tipoBusqueda, setTipoBusqueda] = useState("dni");
const [valorBusqueda, setValorBusqueda] = useState("");
const [mensajeBusqueda, setMensajeBusqueda] = useState("");
const [modo, setModo] = useState("filtro"); 

// =========================
// FETCH
// =========================
const fetchSocios = async () => {
  const enBusqueda =
    modo === "busqueda" && valorBusqueda.trim() !== "";

  // 👇 SOLO cargar si realmente vas a buscar o listar
  setLoading(true);

  let query = supabase.from("socio").select("*");

  if (enBusqueda) {
    if (tipoBusqueda === "dni") {
      query = query.eq("dni", valorBusqueda.trim());
    } else {
      query = query.eq("id_socio", Number(valorBusqueda));
    }
  } else {
    if (filtro === "activos") {
      query = query.eq("estado", "activo");
    }

    if (filtro === "inactivos") {
      query = query.eq("estado", "inactivo");
    }
  }

  const { data, error } = await query;

  setSocios(error ? [] : data || []);

  setMensajeBusqueda(
    enBusqueda && data.length === 0
      ? "No se encontró ningún socio"
      : ""
  );

  setLoading(false);
};

useEffect(() => {
  fetchSocios();
}, [filtro, valorBusqueda, tipoBusqueda]);

  // =========================
  // BAJA
  // =========================
  const handleDelete = async (id) => {
    await supabase
      .from("socio")
      .update({ estado: "inactivo" })
      .eq("id_socio", id);

    fetchSocios();
  };

  // =========================
  // REACTIVAR
  // =========================
  const handleReactivate = async (id) => {
    await supabase
      .from("socio")
      .update({ estado: "activo" })
      .eq("id_socio", id);

    fetchSocios();
  };

  // =========================
  // EDITAR (abre menú)
  // =========================
  const handleEdit = (socio) => {
  setSocioSeleccionado(socio);
  setModoEdicion("menu");
  setMostrarFormulario(true);
};





  // =========================
  // IMPRIMIR
  // =========================

const handlePrint = async (socio) => {
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

  setFicha({
    socio,
    contacto,
    membresia,
    plan
  });

  setTimeout(() => {
    window.print();
    setFicha(null); // 👈 clave para limpiar
  }, 200);
};
  // =========================
  // ABRIR EDITOR SECCIÓN
  // =========================
  const openEditor = (modo) => {
  setModoEdicion(modo);
  setMostrarFormulario(true);
};

  // =========================
  // CERRAR TODO
  // =========================
  const closeAll = () => {
    setMostrarFormulario(false);
    setSocioSeleccionado(null);
    setModoEdicion(null);
  };


  return (
    <div className="page">

      {/* HEADER */}
      <div className="app-header">
        <img src={logo} alt="PowerGymSJ" className="logo" />
        <h2>Socios</h2>
      </div>

      {/* ================= MODAL EDICIÓN ================= */}
      {modoEdicion === "menu" && (
        <div className="modal">
          <div className="modal-content">

<h3 className="subtitle-editing">
  {socioSeleccionado?.apellido} {socioSeleccionado?.nombre}
</h3>

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

      {/* ================= FILTROS ================= */}
      {!mostrarFormulario && (
        <div className="filters">
          <button className={`btn-success ${modo === "filtro" && filtro === "activos" ? "active" : ""}`}
  onClick={() => {
  setFiltro("activos");
  setModo("filtro");
  setMostrarBusqueda(false);
  setValorBusqueda("");
}}
>
  Activos
</button>


          <button className={`btn-danger ${modo === "filtro" && filtro === "inactivos" ? "active" : ""}`}
 onClick={() => {
  setFiltro("inactivos");
  setModo("filtro");
  setValorBusqueda("");
  setMostrarBusqueda(false);
}}
>
  Inactivos
</button>



          <button
            className="btn-primary"
            onClick={() => {
              setSocioSeleccionado(null);
              setModoEdicion(null);
              setMostrarFormulario(true);
              setMostrarBusqueda(false);
            }}
          >
            Alta
          </button>
          
        
          <button
  className={`btn-warning ${modo === "busqueda" ? "active" : ""}`}
onClick={() => {
  setModo("busqueda");
  setMostrarBusqueda(true);
  setLoading(true);     // 👈 clave
  setSocios([]);        // 👈 ahora sí inmediato
}}
>
  Búsqueda
</button>
        </div>
      )}

      {/* ================= FORMULARIO ================= */}
     {mostrarFormulario && modoEdicion !== "menu" && (
  <SocioForm
    socioSeleccionado={socioSeleccionado}
    modoEdicion={modoEdicion}
    onClose={closeAll}
    onSaved={() => {
      fetchSocios();
      closeAll();
    }}
  />
)}

{/* ================= BUSCAR ================= */}

{mostrarBusqueda && (
  <SocioSearch
    onBuscar={(tipo, valor) => {
  setTipoBusqueda(tipo);
  setValorBusqueda(valor);
  setModo("busqueda");
  setMostrarBusqueda(true);
}}
   />
)}

{mensajeBusqueda && (
  <p className="search-message">
    {mensajeBusqueda}
  </p>
)}

{/* ================= TABLA ================= */}
{!mostrarFormulario && (
  <div>
    {loading ? (
      modo === "busqueda" && valorBusqueda.trim() === "" ? (
        <p>Ingresá un valor para buscar</p>
      ) : (
        <p>Cargando...</p>
      )
    ) : (
      <table>
        <thead>
          <tr>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {socios.map((s) => (
            <SocioRow
              key={s.id_socio}
              socio={s}
              onEdit={handleEdit}
              onDesactivate={handleDelete}
              onReactivate={handleReactivate}
              onPrint={handlePrint}
            />
          ))}
        </tbody>
      </table>
    )}
  </div>
)}

{/* ================= FICHA ================= */}


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

export default Socios;