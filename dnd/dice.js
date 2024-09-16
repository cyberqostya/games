export default class Dice {
  ANIMATION_DURATION = 600;

  constructor(edges) {
    this.edges = edges;
    this.node = this.createNode();
  }

  createNode() {
    const div = document.createElement("div");
    div.classList.add("dice");
    if (this.edges === 4) div.style.transformOrigin = "center 60%";

    const img = document.createElement("img");
    img.setAttribute("alt", "d" + this.edges);
    img.setAttribute("src", "./images/d" + this.edges + ".svg");

    div.appendChild(img);
    return div;
  }

  roll = () => 1 + Math.floor(Math.random() * this.edges);

  animate() {
    this.node.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: this.ANIMATION_DURATION, easing: "ease-out" });
  }
}
