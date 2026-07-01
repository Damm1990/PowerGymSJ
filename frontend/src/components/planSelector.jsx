function PlanSelector({ planes, form, handleChange }) {
  return (
    <div className="plans">
      {planes.map((plan) => (
        <div
          key={plan.id_plan}
          className={`plan-card ${
            form.id_plan === plan.id_plan ? "selected" : ""
          }`}
          onClick={() => handleChange("id_plan", plan.id_plan)}
        >
          <h3>{plan.nombre}</h3>

          <p>{plan.descripcion}</p>

          <strong>
            ${Number(plan.precio).toLocaleString("es-AR")}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default PlanSelector;