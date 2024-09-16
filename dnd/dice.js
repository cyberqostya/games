export default class Dice {
  ANIMATION_DURATION = 600;
  SUCCESS_MODIFIER = 0.75;

  constructor(edges) {
    this.edges = edges;
    this.node;
    this.MIN_SUCCESS_ROLL = Math.ceil(this.SUCCESS_MODIFIER * edges);

    this.createNode();
  }

  createNode() {
    const div = document.createElement("div");
    div.classList.add("dice");
    if (this.edges === 4) div.style.transformOrigin = "center 60%";

    const img = document.createElement("img");
    img.setAttribute("alt", "d" + this.edges);
    img.setAttribute("src", "./images/d" + this.edges + ".svg");

    div.appendChild(img);
    this.node = div;
  }

  _getRandomEdge = () => 1 + Math.floor(Math.random() * this.edges);
  _getKarmaEdge = () => this.MIN_SUCCESS_ROLL + Math.round(Math.random() * (this.edges - this.MIN_SUCCESS_ROLL));
  roll = (karmaCounter) => {
    this.animate();

    // Кармический бросок
    if (karmaCounter) {
      // if (Math.random() > 0.8 - karmaCounter / 10) {
      //   console.log("karma");
      //   console.log(karmaCounter);
      //   return this._getKarmaEdge();
      // } else {
      //   return this._getRandomEdge();
      // }
      return Math.random() > 0.8 - karmaCounter / 10 ? this._getKarmaEdge() : this._getRandomEdge();
    }

    return this._getRandomEdge();
  };

  animate() {
    this.node.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: this.ANIMATION_DURATION, easing: "ease-out" });
  }
}
