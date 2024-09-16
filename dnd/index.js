import Dice from "./dice.js";

// Блок с отображением результата бросков
const resultNode = document.querySelector(".result");
let result = 0;
function renderResultText() {
  resultNode.classList[result === 0 ? "add" : "remove"]("_empty");
  resultNode.textContent = result === 0 ? "" : result;
}
function resetResult() {
  result = 0;
  renderResultText();
}

// Блок с отображением изображений добавленных кубиков
const dicesContainerNode = document.querySelector(".dices");
let dices = [];
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

  let tempResult = 0;
  for (let i = 0; i < dices.length; i++) {
    const dice = dices[i];
    dice.animate();
    tempResult += dice.roll();
    await new Promise((res) => setTimeout(res, 300));
  }

  result = tempResult;
  await new Promise((res) => setTimeout(res, 300));
  renderResultText();
});

// Блок с отображением количества добавленных кубиков
const diceTowerNode = document.querySelector(".dice-tower");
const diceTowerTextNode = diceTowerNode.querySelector(".dice-tower__text");
function renderDicesQuantityText() {
  diceTowerNode.classList[dices.length > 0 ? "add" : "remove"]("_active");

  // Добавляем коэффициенты при одинаковых кубиках
  const result = [];
  dices.forEach((dice) => {
    const diceName = "d" + dice.edges;

    const addedDice = result.find((dice) => dice.includes(diceName));

    if (addedDice) {
      const coeffText = addedDice.match(/<b>(\d+)<\/b>/);
      const coeff = coeffText ? Number(coeffText[1]) + 1 : 2;
      result[result.indexOf(addedDice)] = `<b>${coeff}</b>${diceName}`;
    } else {
      result.push(diceName);
    }
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
