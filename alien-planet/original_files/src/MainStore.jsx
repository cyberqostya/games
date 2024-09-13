import PlayersStore from "components/Players/PlayersStore";

class MainStore {
  constructor() {
    this.playersStore = new PlayersStore(this);
  }
}

export default new MainStore();