import Dice from "./js/dice.js";
import Total from "./js/total.js";

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

// Сумма всех бросков
const total = new Total();

//
//
// Чертежи
const dicesContainerNode = document.querySelector(".dices");
function renderDicesImages() {
  dicesContainerNode.classList[dices.length === 0 ? "add" : "remove"]("_empty"); // Пусто
  dicesContainerNode.classList[dices.length > 4 ? "add" : "remove"]("_medium"); // 4-12
  dicesContainerNode.classList[dices.length > 12 ? "add" : "remove"]("_small"); // 12+

  dicesContainerNode.innerHTML = "";
  dices.forEach((dice) => dicesContainerNode.insertAdjacentElement("beforeend", dice.node));

  // Только после добавления всех кубиков просчитываем высоту шрифта относительно их размера
  dices.forEach((dice) => dice.setResultFontSize());
}
//
//
//

//
//
// ROLL
dicesContainerNode.addEventListener("click", async () => {
  banInterface.classList.add("_disabled");

  total.reset(); // Общий результат
  dices.forEach((dice) => dice.hideResult()); // Результат каждого кубика

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

    await new Promise((res) => setTimeout(res, 100));
  }

  await new Promise((res) => setTimeout(res, dices[0].ANIMATION_DURATION));
  total.set(results);
  await new Promise((res) => setTimeout(res, 400));

  banInterface.classList.remove("_disabled");
});
//
//
//

//
//
// Кнопка Сброса
const diceTowerNode = document.querySelector(".dice-tower");
const diceTowerTextNode = diceTowerNode.querySelector(".dice-tower__text");
function renderDicesQuantityText() {
  diceTowerNode.classList[dices.length > 0 ? "remove" : "add"]("_empty"); // Отображение пустого
  diceTowerTextNode.innerHTML = dices.map((i) => "d" + i.edges).join("&nbsp;+ "); // Текст
}
diceTowerNode.addEventListener("click", () => {
  dices = [];
  render();
});
//
//
//

//
function render() {
  // Должно выполняться один раз при добавлении кубика // Оптимизировано
  if (total.dicesValues.length !== 0) {
    total.reset();
    dices.forEach((dice) => dice.hideResult());
  }

  renderDicesImages();
  renderDicesQuantityText();
}
//

// GetLucky
document.querySelector(".luck").addEventListener("click", () => (settings.karma.counter = 7));

//
//
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
//
//
//
