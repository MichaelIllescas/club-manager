import FormPage, { RemoteList } from "../Components/FormPage";
import { useState } from "react";
import PlayerForm from "./PlayerForm";

function RegisterPlayer() {
  const [reload, setReload] = useState(0);
  return (
    <>
      <FormPage
        title="Registrar jugador"
        intro="Cargá los datos del jugador y elegí la categoría en la que juega."
        side={
          <RemoteList
            url="/api/jugadores"
            title="Últimos jugadores"
            empty="Todavía no hay jugadores. El primero que registres aparece acá."
            reload={reload}
            toItem={(player) => ({
              id: player.id,
              name: `${player.firstName} ${player.lastName}`,
              detail: `DNI ${player.dni}`,
              value: player.category,
            })}
          />
        }
      >
        <PlayerForm onRegistered={() => setReload((n) => n + 1)} />
      </FormPage>
    </>
  );
}

export default RegisterPlayer;
