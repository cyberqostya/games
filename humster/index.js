const COLORS = ["#c5c6c7", "#802bb1", "#479761", "#bc4639"];
const POINTS = [13, 3, 7, 11, 6, 9, 8, 4];

// перемешка
COLORS.sort(() => (Math.random() >= 0.5 ? 1 : -1));
POINTS.sort(() => (Math.random() >= 0.5 ? 1 : -1));
//

const FINAL_SCORE =
  POINTS.toSpliced(0, 4).reduce((acc, i) => {
    return acc + i;
  }, 0) * getRandom(50, 100, 10);

// переменные
const squaresContainer = document.querySelector(".squares");
const squares = document.querySelectorAll(".square");
const scoreBlock = document.querySelector("h1");
let score = 0;
let tapCounter = 0;
let tapSquare;

// шкала прогресса
const progressBar = document.querySelector(".progress");
const scoreHintBlock = document.querySelector(".progress__message b");

// Результат
const tapQuantityBlock = document.querySelector(".score span");
const tapQuantityText = document.querySelector(".score b");

// картинка
const image = document.querySelector("img");

// сбросы
let resetCounter = 0;
const RESETS_FOR_HINT = getRandom(5, 8);

// перемешка кнопок
const RESHUFFLE_START = FINAL_SCORE * 0.5;
let reshuffleCounter = 0;
const TAPS_TO_RESHUFFLE = getRandom(6, 13);

// спам
const SPAM_START = FINAL_SCORE * 0.25;
let spamButtons = [];
function checkSpam() {
  if (!spamButtons.length) return;

  spamButtons.forEach((i) => {
    if (--i[0] === 0) i[1]();
  });

  spamButtons = spamButtons.filter((i) => i[0] !== 0);
}

// Вращение
const ROTATION_INTERVAL = getRandom(30, 45);
const ROTATION_DURATION = getRandom(10, 20);
const ROTATION_START = FINAL_SCORE * 0.75;
let rotationAnimation;
let isRotate = false;
function rotate() {
  if (isRotate) return;
  if (Math.random <= 0.3) return;

  isRotate = true;

  rotationAnimation = squaresContainer.animate([{ rotate: "360deg" }], {
    duration: ROTATION_DURATION * 1000,
    iterations: Infinity,
  });

  rotationAnimation.playbackRate = 1;

  let intervalID = setInterval(() => {
    rotationAnimation.playbackRate += 1.2;
  }, 500);

  setTimeout(() => {
    clearInterval(intervalID);
    rotationAnimation.playbackRate = 1;
    rotationAnimation.pause();

    squaresContainer.animate([{ rotate: "0deg" }], {
      duration: 1000,
    });

    setTimeout(() => {
      rotationAnimation.cancel();
    }, 1000);
  }, ROTATION_DURATION * 1000);
}

function getRandom(min, max, interval = 1) {
  return min + Math.round(Math.random() * ((max - min) / interval)) * interval;
}

function win() {
  scoreBlock.style.opacity = 1;
  scoreBlock.textContent = "Победа!";

  squaresContainer.remove();
  progressBar.remove();

  tapQuantityText.textContent = tapCounter;
  tapQuantityBlock.style.display = "block";

  image.animate([{ top: 0 }], {
    duration: 30000,
    fill: "forwards",
  });

  new Audio("./tema.mp3").play();

  setTimeout(() => {
    document.querySelector(".score").style.top = "30%";
  }, 30000);
}

function reset() {
  score = 0;
  resetCounter++;
  isRotate = false;

  // подсказка сколько надо набрать чтобы победить
  if (resetCounter <= String(FINAL_SCORE).length) {
    scoreHintBlock.textContent = scoreHintBlock.textContent
      .split("")
      .toSpliced(resetCounter - 1, 1, String(FINAL_SCORE)[resetCounter - 1])
      .join("");
  }

  render();
}

function checkReshuffle() {
  if (reshuffleCounter % TAPS_TO_RESHUFFLE === 0) {
    squares.forEach((i) => (i.style.order = getRandom(0, 3)));
  }
}

function render() {
  scoreBlock.textContent = score;

  // анимация
  scoreBlock.animate([{ scale: 1 }, { scale: 1.3 }, { scale: 1 }], {
    duration: 100,
  });

  // цвет счетчика постепенно сливается
  const opacity = -0.04 + (FINAL_SCORE - score) / FINAL_SCORE;
  scoreBlock.style.opacity = opacity > 0 ? opacity : 0.005;

  // перемещение квадратов после определенного значения
  if (score > RESHUFFLE_START) {
    reshuffleCounter++;
    checkReshuffle();
  }

  // шкала заполнения
  progressBar.style.background = `linear-gradient(to left, transparent ${
    ((FINAL_SCORE - score) / FINAL_SCORE) * 100
  }%, #cebc81 ${((FINAL_SCORE - score) / FINAL_SCORE) * 100}%)`;

  // Проверка спама
  if (score > SPAM_START) {
    checkSpam();
  }

  // вращение
  if (score > ROTATION_START) {
    rotate();
  }

  // проверка перебора
  if (score > FINAL_SCORE) {
    reset();
  }
  // проверка победы
  else if (score === FINAL_SCORE) {
    win();
  }
}

// kostya
// scoreBlock.style.pointerEvents = "all";
// scoreBlock.addEventListener("click", () => {
//   score += 400;
//   render();
// });
// kostya

class Square {
  MAX_TAPS_IN_A_ROW = getRandom(10, 15);
  TAPS_COOLDOWN = getRandom(10, 15);

  constructor(color, value, node) {
    this.color = color;
    this.value = value;
    this.node = node;

    this.tapsInARow = 0;

    this.node.style.backgroundColor = color;
    this.node.addEventListener("click", this.tap);
  }

  tap = () => {
    this.animate();

    // Проверка спама
    if (score > SPAM_START) {
      this.checkTapsInARow();
    }

    // Внешние
    score += this.value;
    tapCounter++;
    render();
  };

  animate() {
    this.node.animate([{ scale: 1 }, { scale: 0.97 }, { scale: 1 }], {
      duration: 100,
    });
  }

  checkTapsInARow() {
    if (tapSquare === this.node) {
      this.tapsInARow++;
    } else {
      tapSquare = this.node;
      this.tapsInARow = 0;
    }

    if (this.tapsInARow === this.MAX_TAPS_IN_A_ROW) {
      this.node.classList.add("disabled");
      this.tapsInARow = 0;

      // отдаем на откуп внешней головной функции
      spamButtons.push([this.TAPS_COOLDOWN, this.enableNode]);
    }
  }

  enableNode = () => {
    this.node.classList.remove("disabled");
  };
}

squares.forEach((_, key) => {
  new Square(COLORS[key], POINTS[key], squares[key]);
});
