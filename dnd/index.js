import Dice from "./js/dice.js";
import SettingsButton from "./js/settingsButton.js";
import Total from "./js/total.js";

// ===== Переменные =====

let dices = []; // Классы кубиков
const banInterfaceNode = document.querySelector(".ban-interface"); // Блокировщик интерфейса против нажатий при выполнении вычислений
const total = new Total(); // Сумма всех бросков
const dicesContainerNode = document.querySelector(".dices"); // Контейнер, где крутятся кубики
const MAX_DICES_QUANTITY = 25;

// ===== Настройки =====
// kostya Меняются стейты в html и в js вместе

window.settings = {
  // Карма
  karma: {
    counter: 0,
    button: new SettingsButton({
      isActive: true,
      title: "KARMA",
      callback: () => {
        settings.karma.counter = 0;
        resetDices();
      },
    }),
  },
  // Редактирование
  edit: {
    button: new SettingsButton({
      isActive: false,
      title: "EDIT",
      callback: () => {
        dices.forEach((dice) => dice.editModeSwitcher(settings.edit.button.isActive));

        if (settings.edit.button.isActive) {
          window.addEventListener("click", deleteDice, true);
        } else {
          window.removeEventListener("click", deleteDice, true);
        }
      },
    }),
  },
};

// ===== Визуал кубиков =====

function renderDicesImages() {
  dicesContainerNode.classList[dices.length === 0 ? "add" : "remove"]("_empty"); // Пусто
  dicesContainerNode.classList[dices.length === 2 ? "add" : "remove"]("_xs"); // 2
  dicesContainerNode.classList[dices.length >= 3 && dices.length <= 4 ? "add" : "remove"]("_s"); // 3-4
  dicesContainerNode.classList[dices.length >= 5 && dices.length <= 6 ? "add" : "remove"]("_m"); // 5-6
  dicesContainerNode.classList[dices.length >= 7 && dices.length <= 9 ? "add" : "remove"]("_l"); // 7-9
  dicesContainerNode.classList[dices.length >= 10 && dices.length <= 12 ? "add" : "remove"]("_xl"); // 10-12
  dicesContainerNode.classList[dices.length >= 13 && dices.length <= 16 ? "add" : "remove"]("_xxl"); // 13-16
  dicesContainerNode.classList[dices.length >= 17 ? "add" : "remove"]("_xxxl"); // 17

  dicesContainerNode.innerHTML = "";
  dices.forEach((dice) => dicesContainerNode.insertAdjacentElement("beforeend", dice.node));

  // Только после добавления всех кубиков просчитываем высоту шрифта относительно их размера
  dices.forEach((dice) => dice.setResultFontSize());
}

// ===== Бросок =====

dicesContainerNode.addEventListener("click", async () => {
  banInterfaceNode.classList.add("_disabled");

  total.reset(); // Общий результат
  dices.forEach((dice) => dice.hideResult()); // Результат каждого кубика

  const results = [];
  for (let i = 0; i < dices.length; i++) {
    const dice = dices[i];
    const result = dice.roll(settings.karma.counter);
    results.push(result);

    // Карма
    if (settings.karma.button.isActive) {
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

    await new Promise((res) => setTimeout(res, 100));
  }

  await new Promise((res) => setTimeout(res, dices[0].ANIMATION_DURATION));
  total.set(results);
  await new Promise((res) => setTimeout(res, 400));

  banInterfaceNode.classList.remove("_disabled");
});

// ===== Удачный бросок =====

let luckCounter = 0;
const TAPS_TO_LUCK = 3;
const TAPS_RESET_TIME = 500;
let luckTimerId = 0;
const luckButton = document.querySelector(".total");
const luckMarker = document.querySelector(".total__placeholder");
luckButton.addEventListener("click", () => {
  if (luckMarker.classList.contains("_active")) {
    luckCounter++;

    // Таймаут после первого
    if (luckCounter === 1) {
      luckTimerId = setTimeout(() => {
        luckCounter = 0;
      }, TAPS_RESET_TIME);
    }

    if (luckCounter >= TAPS_TO_LUCK) {
      luckCounter = 0;
      settings.karma.counter = 7;
      clearTimeout(luckTimerId);

      luckMarker.animate([{ color: "#f0a020" }], {
        duration: 200,
        easing: "linear",
      });
    }
  }
});

// ===== Сброс кубиков =====

const diceTowerNode = document.querySelector(".dice-tower");
const diceTowerTextNode = diceTowerNode.querySelector(".dice-tower__text");
function renderDicesQuantityText() {
  diceTowerNode.classList[dices.length > 0 ? "remove" : "add"]("_empty"); // Отображение пустого
  diceTowerTextNode.innerHTML = dices.map((i) => "d" + i.edges).join("&nbsp;+ "); // Текст
}
function resetDices() {
  dices = [];
  render();
}
diceTowerNode.addEventListener("click", resetDices);

// ===== Рендер =====

function render() {
  // Должно выполняться один раз при добавлении кубика // Оптимизировано
  if (total.dicesValues.length !== 0) {
    total.reset();
    dices.forEach((dice) => dice.hideResult());
  }

  renderDicesImages();
  renderDicesQuantityText();
}

// ===== Кнопки добавления кубиков =====

const diceButtonsNodes = document.querySelectorAll(".button._dice");
diceButtonsNodes.forEach((diceButtonNode) => {
  diceButtonNode.addEventListener("click", function () {
    // Превышение максимально возможного количества кубиков
    if (dices.length === MAX_DICES_QUANTITY) return;

    const edges = Number(this.textContent.match(/\d+/g)[0]);
    dices.push(new Dice(edges));
    render();
  });
});

// ===== Кнопки настроек =====

Object.keys(settings).forEach((key) => {
  document.querySelector(".buttons-container._top").insertAdjacentElement("beforeend", settings[key].button.node);
});

// ===== Удаление кубиков по одному =====

function deleteDice(e) {
  e.stopPropagation();

  const dice = e.target.closest(".dice");

  if (!dice) return settings.edit.button.toggle();

  const index = Array.from(dicesContainerNode.children).indexOf(dice);

  dices = dices.filter((i, ind) => ind !== index);
  render();

  // Когда осталось пусто
  if (dices.length === 0) {
    settings.edit.button.toggle();
  }
}
