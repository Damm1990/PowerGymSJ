import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import SocioRow from "../components/SocioRow";
import logo from "../assets/logoPowerGymSJ.png";

function Socios() {
  const [socios, setSocios] = useState([]);
  const [filtro, setFiltro] = useState("activos");
  const [loading, setLoading] = useState(true);

  const fetchSocios = async () => {
    setLoading(true);

    let query = supabase.from("socio").select("*");

    if (filtro === "activos") query = query.eq("estado", "activo");
    if (filtro === "inactivos") query = query.eq("estado", "inactivo");

    const { data, error } = await query;

    if (error) {
      setSocios([]);
    } else {
      setSocios(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSocios();
  }, [filtro]);

  const handleDelete = async (id) => {
    await supabase
      .from("socio")
      .update({ estado: "inactivo" })
      .eq("id_socio", id);

    fetchSocios();
  };

  const handleReactivate = async (id) => {
    await supabase
      .from("socio")
      .update({ estado: "activo" })
      .eq("id_socio", id);

    fetchSocios();
  };

  return (
    <div className="page">
      <div className="app-header">
        <img src={logo} alt="PowerGymSJ" className="logo" />
        <h2>Socios</h2>
      </div>

      <div className="filters">
        <button onClick={() => setFiltro("activos")}>Activos</button>
        <button onClick={() => setFiltro("inactivos")}>Inactivos</button>
      </div>

      {loading ? (
        <p>Cargando...</p>
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
                onDesactivate={handleDelete}
                onReactivate={handleReactivate}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Socios;