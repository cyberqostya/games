import Dice from "./dice.js";

// Переменные
let dices = [];

// Карма
let karmaCounter = 0;

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
  resultSumNode.innerHTML = "(" + result.join(" + ") + ")";
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
  if (e.target.classList.contains("_empty")) return;

  dicesContainerNode.classList.add("_disabled");

  const results = [];
  for (let i = 0; i < dices.length; i++) {
    const dice = dices[i];
    const result = dice.roll(karmaCounter);
    results.push(result);

    // Карма
    if (result < dice.MIN_SUCCESS_ROLL) {
      karmaCounter++;
    } else {
      karmaCounter = 0;
    }

    await new Promise((res) => setTimeout(res, 300));
  }

  await new Promise((res) => setTimeout(res, 300));
  resultValues = results;
  renderResultText();

  dicesContainerNode.classList.remove("_disabled");
});

// Блок с отображением количества добавленных кубиков
const diceTowerNode = document.querySelector(".dice-tower");
const diceTowerTextNode = diceTowerNode.querySelector(".dice-tower__text");
function renderDicesQuantityText() {
  diceTowerNode.classList[dices.length > 0 ? "add" : "remove"]("_active");

  // Добавляем коэффициенты при одинаковых кубиках
  const result = [];
  dices.forEach((dice) => {
    // const diceName = "d" + dice.edges;

    // const addedDice = result.find((dice) => "d" + dice.edges === diceName);

    // if (addedDice) {
    //   const coeffText = addedDice.match(/<b>(\d+)<\/b>/);
    //   const coeff = coeffText ? Number(coeffText[1]) + 1 : 2;
    //   result[result.indexOf(addedDice)] = `<b>${coeff}</b>${diceName}`;
    // } else {
    // }
    result.push("d" + dice.edges);
  });

  diceTowerTextNode.innerHTML = result.join(" + ");
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

// Кнопки добавления кубиков
const addButtonsNode = document.querySelector(".add-buttons");
addButtonsNode.addEventListener("click", (e) => {
  const buttonNode = e.target.closest(".add-buttons__button");
  if (!buttonNode) return;

  const edges = Number(buttonNode.textContent.match(/\d+/g)[0]);
  dices.push(new Dice(edges));

  render();
});
