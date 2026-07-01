import { useNavigate } from "react-router-dom";

function SocioRow({ socio }) {

  const navigate = useNavigate();

  return (
    <tr>
      <td>{socio.id_socio}</td>
      <td>{socio.apellido}</td>
      <td>{socio.nombre}</td>
      <td>{socio.dni}</td>
      <td>{socio.telefono}</td>
      <td>{socio.email}</td>

     <td>
  <button
    className="btn-primary"
    onClick={() => navigate(`/socios/${socio.id_socio}`)}
  >
    Seleccionar
  </button>
</td>
    </tr>
  );
}

export default SocioRow;