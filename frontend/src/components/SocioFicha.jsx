import { formatDate } from "../utils/dateFormat";
import logo from "../assets/logoPowerGymSJ.png";

function SocioFicha({ socio, contacto, membresia, plan }) {
  return (
    <div className="print-area ficha-socio">

      {/* LOGO */}
      <div className="print-header">
        <img src={logo} alt="PowerGymSJ" className="print-logo" />
        <h1>Ficha de Socio</h1>
      </div>

      {/* SOCIO */}
      <h3>Datos personales</h3>

      <div className="socio-grid">
        <p><b>Apellido:</b> {socio.apellido}</p>
        <p><b>Nombre:</b> {socio.nombre}</p>
        <p><b>DNI:</b> {socio.dni}</p>
        <p><b>Fecha nacimiento:</b> {formatDate(socio.fecha_nacimiento)}</p>
        <p><b>Localidad:</b> {socio.localidad}</p>
        <p><b>Dirección:</b> {socio.calle} {socio.numero}</p>
        <p><b>CP:</b> {socio.codigo_postal}</p>
        <p><b>Teléfono:</b> {socio.telefono}</p>
        <p><b>Email:</b> {socio.email}</p>
      </div>
      <br></br>
      
      {/* CONTACTO */}
      <h3>Contacto de emergencia</h3>
      <p><b>Nombre:</b> {contacto?.nombre}</p>
      <p><b>Teléfono:</b> {contacto?.telefono}</p>
      <p><b>Relación:</b> {contacto?.relacion}</p>
      <br></br>

      {/* PLAN */}
      <h3>Plan</h3>
      <p><b>Nombre:</b> {plan?.nombre}</p>
      <p><b>Descripción:</b> {plan?.descripcion}</p>
      <p><b>Precio:</b> ${plan?.precio}</p>
      <br></br>

      {/* MEMBRESÍA */}
      <h3>Membresía</h3>
      <p><b>Estado:</b> {membresia?.estado}</p>
      <p><b>Fecha de Alta:</b> {formatDate(membresia?.fecha_alta)}</p>
      <p><b>Fecha de baja:</b> {formatDate(membresia?.fecha_de_baja)}</p>

    </div>
  );
}

export default SocioFicha;