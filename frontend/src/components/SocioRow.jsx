function SocioRow({ socio, onDesactivate, onReactivate, onEdit, onPrint }) {
  return (
    <tr>
      <td>{socio.apellido}</td>
      <td>{socio.nombre}</td>
      <td>{socio.dni}</td>
      <td>{socio.telefono}</td>
      <td>{socio.email}</td>

      <td>
        <div className="actions">
        <button className="btn-primary" onClick={() => onPrint(socio)}>
  Imprimir ficha
</button>

        <button className="btn-warning" onClick={() => onEdit(socio)}>
        Editar
        </button>



        {socio.estado === "activo" && (
          <button className="btn-danger" onClick={() => onDesactivate(socio.id_socio)}>
            Dar de baja
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