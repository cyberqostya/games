export default class Dice {
  ANIMATION_DURATION = 600;
  SUCCESS_MODIFIER = 0.75;
  FAILURE_MODIFIER = 0.25;

  constructor(edges) {
    this.edges = edges;
    this.node;
    this.MIN_SUCCESS_ROLL = Math.ceil(this.SUCCESS_MODIFIER * edges);
    this.MAX_FAILURE_ROLL = Math.ceil(this.FAILURE_MODIFIER * edges);

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
    if (karmaCounter !== undefined) {
      if (karmaCounter > 2 && Math.random() > 0.7 - karmaCounter / 10) {
        // console.log("КАРМА", karmaCounter);
        return this._getKarmaEdge();
      } else {
        // console.log("обычный бросок", karmaCounter);
        return this._getRandomEdge();
      }
    }

    // return this._getRandomEdge();
  };

  animate() {
    const animationStartPos = { transform: "rotate(0)" };
    const animationEndPos = { transform: `rotate${this.edges === 2 ? "X" : ""}(360deg)` };
    this.node.animate([animationStartPos, animationEndPos], { duration: this.ANIMATION_DURATION, easing: "ease-out" });
  }
}
