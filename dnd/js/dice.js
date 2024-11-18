import getMathSign from "./helpers.js";

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
    this.crossNode;
    this.MIN_SUCCESS_ROLL = Math.ceil(this.SUCCESS_MODIFIER * edges);
    this.MAX_FAILURE_ROLL = Math.ceil(this.FAILURE_MODIFIER * edges);

    this.buffer;

    this.shakeAnimationID;

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

    const cross = document.createElement("button");
    cross.classList.add("cross", "_dark", "dice__cross");
    this.crossNode = cross;

    div.appendChild(img);
    div.appendChild(result);
    div.appendChild(cross);
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

  // ===== Анимации текста результата =====

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
    this.node.style.fontSize = Math.round(this.node.clientHeight * 0.7) + "px";
  }

  // ===== Анимации броска =====

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

  // ===== Звук броска =====

  async initSound() {
    // Создание контекста при первом создании кубика
    // Чтобы избежать ошибки, пока юзер не совершил событие
    // А также контекст один на все приложение для оптимальной работы
    if (window.audioCtx === undefined) window.audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") audioCtx.resume();

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

  // ===== Редактирование =====

  editModeSwitcher(mode) {
    this.switchCross(mode);
    this.switchShake(mode);
  }

  switchCross(mode) {
    this.crossNode.classList[mode ? "add" : "remove"]("_active");
  }

  // ===== Тряска при удалении =====

  sign = getMathSign(); // Постоянный знак для поддержания плюса в начале и минусы в конце (и наоборот)
  MAX_DELTA_SHAKE_POSITION = 0.7;
  START_SHAKE_POSITION = 1;
  END_SHAKE_POSITION = -1.5;
  RANDOM_DELTA_SHAKE_START = Math.random() * this.MAX_DELTA_SHAKE_POSITION * getMathSign();
  RANDOM_DELTA_SHAKE_END = Math.random() * this.MAX_DELTA_SHAKE_POSITION * getMathSign();
  startShakePositivePosition = this.START_SHAKE_POSITION * this.sign + this.RANDOM_DELTA_SHAKE_START;
  endShakeNegativePosition = this.END_SHAKE_POSITION * this.sign + this.RANDOM_DELTA_SHAKE_END;
  RANDOM_SHAKE_DURATION = 150 + Math.round(Math.random() * 100);

  switchShake = (mode) => {
    if (mode) {
      this.shakeAnimationID = this.node.animate(
        [
          { transform: `translate(0, 0) rotate(0deg)` },
          { transform: `translate(${this.endShakeNegativePosition}px, 0) rotate(${this.startShakePositivePosition}deg)` },
          { transform: `translate(0, ${this.startShakePositivePosition}px) rotate(${this.endShakeNegativePosition}deg)` },
          { transform: `translate(0, 0) rotate(0deg)` },
        ],
        {
          duration: this.RANDOM_SHAKE_DURATION,
          iterations: Infinity,
          easing: "linear",
        }
      );
    } else {
      this.shakeAnimationID.cancel();
    }
  };

  // ===== Удаление =====
}
