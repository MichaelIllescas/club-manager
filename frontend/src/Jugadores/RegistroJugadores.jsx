import PaginaAlta, { ListaRemota } from "../Components/PaginaAlta";
import { useState } from "react";
import RegistroJugadorForm from "./RegistroForm";

function REgistroJugadores() {
  const [recarga, setRecarga] = useState(0);
  return (
    <>
      <PaginaAlta
        titulo="Registrar jugador"
        intro="Cargá los datos del jugador y elegí la categoría en la que juega."
        lateral={
          <ListaRemota
            url="/api/jugadores"
            titulo="Últimos jugadores"
            vacio="Todavía no hay jugadores. El primero que registres aparece acá."
            recarga={recarga}
            mapear={(jugador) => ({
              id: jugador.id,
              nombre: `${jugador.nombre} ${jugador.apellido}`,
              detalle: `DNI ${jugador.dni}`,
              valor: jugador.categoria,
            })}
          />
        }
      >
        <RegistroJugadorForm onRegistrado={() => setRecarga((n) => n + 1)} />
      </PaginaAlta>
    </>
  );
}

export default REgistroJugadores;
