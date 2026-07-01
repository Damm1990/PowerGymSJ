import SocioCreateForm from "./SocioCreateForm";
import SocioEditForm from "./SocioEditForm";

function SocioForm(props) {
  const isEdit = Boolean(props.socioSeleccionado?.id_socio);

  if (isEdit) {
    return <SocioEditForm {...props} />;
  }

  return <SocioCreateForm {...props} />;
}

export default SocioForm;