export default class Dice {
  ANIMATION_DURATION = 600;
  SUCCESS_MODIFIER = 0.75;
  FAILURE_MODIFIER = 0.25;
  ROLL_SOUNDS = ["./sounds/roll1.mp3", "./sounds/roll2.mp3", "./sounds/roll3.mp3", "./sounds/roll4.mp3"];
  COIN_SOUND = "./sounds/coin.mp3";

  constructor(edges) {
    this.edges = edges;
    this.node;
    this.resultNode;
    this.MIN_SUCCESS_ROLL = Math.ceil(this.SUCCESS_MODIFIER * edges);
    this.MAX_FAILURE_ROLL = Math.ceil(this.FAILURE_MODIFIER * edges);

    this.buffer;

    this.createNode();
    this.initSound();
  }

  createNode() {
    const div = document.createElement("div");
    div.classList.add("dice");
    if (this.edges === 4) div.style.transformOrigin = "center 60%";

    const img = document.createElement("img");
    img.setAttribute("alt", "d" + this.edges);
    img.setAttribute("src", "./images/d" + this.edges + ".svg");

    const result = document.createElement("span");
    result.classList.add("dice__result");
    this.resultNode = result;

    div.appendChild(img);
    div.appendChild(result);
    this.node = div;
  }

  _getRandomEdge = () => 1 + Math.floor(Math.random() * this.edges);
  _getKarmaEdge = () => this.MIN_SUCCESS_ROLL + Math.round(Math.random() * (this.edges - this.MIN_SUCCESS_ROLL));
  roll = (karmaCounter) => {
    let result;

    if (karmaCounter !== undefined) {
      // Кармический бросок
      if (karmaCounter > 2 && Math.random() > 0.7 - karmaCounter / 10) {
        // console.log("КАРМА", karmaCounter);
        result = this._getKarmaEdge();
      }
      // Обычный бросок
      else {
        // console.log("обычный бросок", karmaCounter);
        result = this._getRandomEdge();
      }
    }

    this.playSound();
    this.animate();
    setTimeout(() => this.showResult(result), this.ANIMATION_DURATION * 0.8);

    return result;
  };

  showResult = (result) => {
    this.resultNode.textContent = result;
    this.resultNode.classList.add("_active");
    if (result === this.edges) this.resultNode.classList.add("_luck");
    if (result === 1) this.resultNode.classList.add("_unluck");
    this.node.classList.add("_blured");
  };
  hideResult() {
    this.resultNode.classList.remove("_active");
    this.resultNode.classList.remove("_luck");
    this.resultNode.classList.remove("_unluck");
    this.node.classList.remove("_blured");
  }
  setResultFontSize() {
    this.resultNode.style.fontSize = Math.round(this.node.clientHeight * 0.7) + "px";
  }

  // 1
  animationRoll() {
    this.node.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], {
      duration: this.ANIMATION_DURATION,
      easing: "ease-out",
    });
  }
  // 2
  async animationFlip() {
    this.node.animate([{ translate: "0 0" }, { translate: "0 15%" }, { translate: "0 -15%" }], {
      duration: this.ANIMATION_DURATION * 0.5,
      easing: "ease",
      fill: "forwards",
    });
    await new Promise((res) => setTimeout(res, this.ANIMATION_DURATION * 0.3));
    this.node.animate([{ transform: "rotateX(0)" }, { transform: "rotateX(-360deg)" }], {
      duration: this.ANIMATION_DURATION * 0.7,
      easing: "ease",
      fill: "forwards",
    });
    await new Promise((res) => setTimeout(res, this.ANIMATION_DURATION * 0.4));
    this.node.animate([{ translate: "0 -15%" }, { translate: "0 0" }], {
      duration: this.ANIMATION_DURATION * 0.5,
      easing: "ease",
      fill: "forwards",
    });
  }
  // главная анимация
  animate() {
    if (this.edges === 2) {
      this.animationFlip();
    } else {
      this.animationRoll();
    }
  }

  // Звук
  async initSound() {
    // Создание контекста при первом создании кубика
    // Чтобы избежать ошибки, пока юзер не совершил событие
    // А также контекст один на все приложение для оптимальной работы
    if (window.audioCtx === undefined) window.audioCtx = new AudioContext();

    // Отдельный звук для монетки
    let soundLink;
    if (this.edges === 2) {
      soundLink = this.COIN_SOUND;
    } else {
      soundLink = this.ROLL_SOUNDS[Math.floor(Math.random() * this.ROLL_SOUNDS.length)];
    }

    const response = await fetch(soundLink);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    this.buffer = audioBuffer;
  }
  playSound() {
    const source = audioCtx.createBufferSource();
    source.buffer = this.buffer;
    source.connect(audioCtx.destination);
    source.start();
  }
}
