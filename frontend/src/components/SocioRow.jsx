function SocioRow({ socio, onDesactivate, onReactivate }) {
  return (
    <tr>
      <td>{socio.apellido}</td>
      <td>{socio.nombre}</td>
      <td>{socio.dni}</td>
      <td>{socio.telefono}</td>
      <td>{socio.email}</td>

      <td>
        <div className="actions">
        <button className="btn-primary" onClick={() => console.log("Ver:", socio.id_socio)}>
          Imprimir ficha
        </button>

        <button className="btn-warning" onClick={() => console.log("Editar:", socio.id_socio)}>
          Editar
        </button>



        {socio.estado === "activo" && (
          <button className="btn-danger" onClick={() => onDesactivate(socio.id_socio)}>
            Desactivar
          </button>
        )}

        {socio.estado === "inactivo" && (
          <button className="btn-success" onClick={() => onReactivate(socio.id_socio)}>
            Reactivar
          </button>
        )}

        </div>
      </td>
    </tr>
  );
}

export default SocioRow;