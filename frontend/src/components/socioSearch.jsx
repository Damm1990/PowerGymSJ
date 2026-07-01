import { useState } from "react";

function SocioSearch({ onBuscar, onCancelar }) {
  const [tipo, setTipo] = useState("dni");
  const [valor, setValor] = useState("");

  const handleBuscar = () => {
    if (!valor.trim()) return;
    onBuscar(tipo, valor.trim());
  };

  return (
    <div className="search-bar">
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="dni">DNI</option>
        <option value="id_socio">Nº de socio</option>
      </select>

      <input
        type="text"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Ingrese el valor"
      />

      <button onClick={handleBuscar}>
        Buscar
      </button>

    
    </div>
  );
}

export default SocioSearch;