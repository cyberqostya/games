import { action, makeObservable, observable } from "mobx";

export default class PlayersStore {
  constructor(mainStore) {
    this.mainStore = mainStore;

    makeObservable(this, {
      players: observable,
      addPlayer: action,
    })
  }

  players = [];
  addPlayer = (player) => { this.players.push(player) }
}