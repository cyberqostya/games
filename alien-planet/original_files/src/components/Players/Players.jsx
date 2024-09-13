import MainStore from "MainStore";
import { Player } from "components/Player/Player";
import "./Players.scss";

export const Players = () => {
  return (
    <div className="players">
      {MainStore.playersStore.players.map((i, key) => (
        <Player key={key} />
      ))}
    </div>
  );
};
