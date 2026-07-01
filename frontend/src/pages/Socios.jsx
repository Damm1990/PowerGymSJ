import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import SocioRow from "../components/SocioRow";
import logo from "../assets/logoPowerGymSJ.png";
import SocioForm from "../components/SocioForm";
import SocioSearch from "../components/SocioSearch";
import { openSociosReport } from "../components/SociosReport";

function Socios() {
  const [socios, setSocios] = useState([]);

  const [filtro, setFiltro] = useState("activos"); // SOLO activos/inactivos
  const [modo, setModo] = useState("filtro"); // filtro | busqueda

  const [loading, setLoading] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
const [mensajeBusqueda, setMensajeBusqueda] = useState("");
  const [tipoBusqueda, setTipoBusqueda] = useState("dni");
  const [valorBusqueda, setValorBusqueda] = useState("");

  const [limite, setLimite] = useState(10);

  const [misData, setMisData] = useState([]);
  const [showReport, setShowReport] = useState(false);

  // =========================
  // FETCH
  // =========================
 const fetchSocios = async (busqueda = null, tipoOverride = null) => {
  setLoading(true);

  const valor = busqueda ?? valorBusqueda.trim();
  const tipo = tipoOverride ?? tipoBusqueda;

  const enBusqueda = modo === "busqueda" && valor !== "";

  let query = supabase.from("socio").select("*");

  if (enBusqueda) {
    if (tipo === "dni") {
      query = query.eq("dni", valor);
    } else {
      query = query.eq("id_socio", Number(valor));
    }
  } else {
    query = query.eq("estado", filtro === "activos" ? "activo" : "inactivo");
  }

  const { data, error } = await query;

  setSocios(error ? [] : data || []);

  setMensajeBusqueda(
    enBusqueda && (!data || data.length === 0)
      ? "No se encontró ningún socio"
      : ""
  );

  setLoading(false);
};

  // =========================
  // EFFECT PRINCIPAL
  // =========================
  useEffect(() => {
  if (modo === "filtro") {
    fetchSocios();
  }
}, [filtro, limite, modo]);

  // =========================
  // BUSQUEDA
  // =========================
  const handleBuscar = (tipo, valor) => {
  const clean = valor.trim();

  setTipoBusqueda(tipo);
  setValorBusqueda(clean);
  setModo("busqueda");
  setSocios([]);
  setMostrarBusqueda(true);

  fetchSocios(clean, tipo); // 👈 PASÁS TODO DIRECTO
};

  const closeAll = () => setMostrarFormulario(false);

  // =========================
  // REPORT
  // =========================
 const handleSociosReport = async () => {
  const { data } = await supabase
    .from("membresia")
    .select(`
      id_socio,
      socio: socio (id_socio),
      plan: plan (nombre, precio)
    `);

  const formatted = (data || []).map(m => ({
    id_socio: m.id_socio,
    plan: m.plan?.nombre,
    importe: m.plan?.precio || 0,
  }));

  openSociosReport(formatted);
};

  // =========================
  // RETURN
  // =========================

  return (
    <div className="page">

      {/* HEADER */}
      <div className="app-header">
        <img src={logo} alt="PowerGymSJ" className="logo" />
        <h2>Socios</h2>
      </div>

      {/* FILTROS */}
      {!mostrarFormulario && (
        <div className="filters">

          <button
            className={`btn-success ${filtro === "activos" && modo === "filtro" ? "active" : ""}`}
            onClick={() => {
              setFiltro("activos");
              setModo("filtro");
              setMostrarBusqueda(false);
              setValorBusqueda("");
            }}
          >
            Activos
          </button>

          <button
            className={`btn-danger ${filtro === "inactivos" && modo === "filtro" ? "active" : ""}`}
            onClick={() => {
              setFiltro("inactivos");
              setModo("filtro");
              setMostrarBusqueda(false);
              setValorBusqueda("");
            }}
          >
            Inactivos
          </button>

          <button
            className="btn-primary"
            onClick={() => {
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
              setSocios([]);
              setValorBusqueda("");
            }}
          >
            Búsqueda
          </button>
        </div>
      )}

      {/* FORM */}
      {mostrarFormulario && (
        <SocioForm onClose={closeAll} onSaved={() => { fetchSocios(); closeAll(); }} />
      )}

      {/* SEARCH */}
      {mostrarBusqueda && (
        <SocioSearch onBuscar={handleBuscar} />
      )}

      {/* TABLA */}
      {!mostrarFormulario && (
        <div>

          {loading ? (
  <p>Cargando...</p>
) : modo === "busqueda" ? (
  <>
    {mensajeBusqueda ? (
      <p className="search-message">{mensajeBusqueda}</p>
    ) : (
      <table className="print-area">
        <thead>
          <tr>
            <th>Nº socio</th>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {socios.map((s) => (
            <SocioRow key={s.id_socio} socio={s} />
          ))}
        </tbody>
      </table>
    )}
  </>
) : (
            <>
              <div className="filters">

                <select
                  value={limite}
                  onChange={(e) =>
                    setLimite(e.target.value === "all"
                      ? "all"
                      : Number(e.target.value)
                    )
                  }
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value="all">Todos</option>
                </select>

                <button onClick={() => window.print()}>
                  🖨️ Imprimir
                </button>

                {filtro === "activos" && (
                  <button onClick={handleSociosReport}>
                    📊 Reporte MIS
                  </button>
                )}

              </div>

              <table className="print-area">
                <thead>
                  <tr>
                    <th>Nº socio</th>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>DNI</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {socios.map(s => (
                    <SocioRow key={s.id_socio} socio={s} />
                  ))}
                </tbody>
              </table>

                          </>
          )}
        </div>
      )}
    </div>
  );
}

export default Socios;