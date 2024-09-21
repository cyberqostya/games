import Dice from "./dice.js";

// Переменные
let dices = [];
const banInterface = document.querySelector(".ban-interface");

// Переключатели настроек
const settings = {};
// Карма
settings.karma = {
  isActive: true,
  counter: 0,

  toggle() {
    this.isActive = !this.isActive;
    this.counter = 0;
  },
};

// Блок с отображением результата бросков
const resultSumNode = document.querySelector(".result__sum");
const resultNode = document.querySelector(".result");
let resultValues = [];
function renderResultText() {
  if (resultValues.length === 0) {
    resultNode.classList.add("_empty");
    resultNode.textContent = "";
    resultSumNode.textContent = "";
  } else {
    resultNode.classList.remove("_empty");
    resultNode.textContent = resultValues.reduce((acc, i) => acc + i, 0);
    if (resultValues.length !== 1) colorSum();
  }
}
function resetResult() {
  resultValues = [];
  renderResultText();
}
function colorSum() {
  const result = resultValues.map((i, key) => {
    if (i === 1) return `<span class="_unluck">${i}</span>`;
    else if (i === dices[key].edges) return `<span class="_luck">${i}</span>`;
    else return i;
  });
  resultSumNode.innerHTML = "〔" + result.join(" + ") + "〕";
}

// Блок с отображением изображений добавленных кубиков
const dicesContainerNode = document.querySelector(".dices");
function renderDicesImages() {
  // При отсутствии кубиков
  dicesContainerNode.classList[dices.length === 0 ? "add" : "remove"]("_empty");
  dicesContainerNode.classList[dices.length > 4 ? "add" : "remove"]("_medium");
  dicesContainerNode.classList[dices.length > 10 ? "add" : "remove"]("_small");

  dicesContainerNode.innerHTML = "";
  dices.forEach((dice) => {
    dicesContainerNode.insertAdjacentElement("beforeend", dice.node);
  });
}
// ROLL
dicesContainerNode.addEventListener("click", async (e) => {
  banInterface.classList.add("_disabled");

  resetResult();

  const results = [];
  for (let i = 0; i < dices.length; i++) {
    const dice = dices[i];
    const result = dice.roll(settings.karma.counter);
    results.push(result);

    // Карма
    if (settings.karma.isActive) {
      if (result <= dice.MAX_FAILURE_ROLL) {
        settings.karma.counter += 1;
      } else if (result >= dice.MIN_SUCCESS_ROLL) {
        settings.karma.counter = 0;
      } else {
        settings.karma.counter += 0.5;
      }
    } else {
      settings.karma.counter = 0;
    }
    // console.log("счетчик кармы стал:", settings.karma.counter);

    await new Promise((res) => setTimeout(res, 300));
  }

  await new Promise((res) => setTimeout(res, 100));
  resultValues = results;
  renderResultText();

  banInterface.classList.remove("_disabled");
});

// Блок с отображением количества добавленных кубиков
const diceTowerNode = document.querySelector(".dice-tower");
const diceTowerTextNode = diceTowerNode.querySelector(".dice-tower__text");
function renderDicesQuantityText() {
  diceTowerNode.classList[dices.length > 0 ? "remove" : "add"]("_empty");

  // Добавляем коэффициенты при одинаковых кубиках
  diceTowerTextNode.innerHTML = dices.map((i) => "d" + i.edges).join(" + ");
}
function resetDices() {
  dices = [];
  render();
  resetResult();
}
diceTowerNode.addEventListener("click", resetDices);

// RENDER RENDER RENDER RENDER RENDER RENDER
function render() {
  renderDicesImages();
  renderDicesQuantityText();
}

// GetLucky
document.querySelector(".luck").addEventListener("click", () => (settings.karma.counter = 7));

// Кнопки добавления кубиков
const addButtonsNode = document.querySelector(".add-buttons");
addButtonsNode.addEventListener("click", (e) => {
  const buttonNode = e.target.closest(".add-buttons__button");
  // Нажали ли на кнопку
  if (!buttonNode) return;

  // Если нажали на кнопку настроек
  if (buttonNode.dataset.settings) {
    settings[buttonNode.dataset.settings].toggle();
    buttonNode.classList[settings[buttonNode.dataset.settings].isActive ? "remove" : "add"]("_deactive");
    return;
  }

  // Если нажали на кнопку с наименованием кубиков [d10]
  const edges = Number(buttonNode.textContent.match(/\d+/g)[0]);
  dices.push(new Dice(edges));

  render();
});
