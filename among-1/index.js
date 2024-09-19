(() => {
  "use strict";
  var e = {};
  (e.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })()),
    (() => {
      var t;
      e.g.importScripts && (t = e.g.location + "");
      var r = e.g.document;
      if (!t && r && (r.currentScript && (t = r.currentScript.src), !t)) {
        var s = r.getElementsByTagName("script");
        s.length && (t = s[s.length - 1].src);
      }
      if (!t)
        throw new Error(
          "Automatic publicPath is not supported in this browser"
        );
      (t = t
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/[^\/]+$/, "/")),
        (e.p = t);
    })();
  const t = e.p + "deae6230a02f6cae6af8cc048011e4f5.wav",
    r = e.p + "b69c09f316c29d139c47da9ac8c93064.wav",
    s = e.p + "b3849a60082e8f8df502f8173f60963a.wav",
    i = new Audio(t),
    n = new Audio(r),
    c = new Audio(s),
    a = document.querySelector(".content"),
    l = new (class {
      constructor(e, t, r) {
        (this.CELLS_IN_ROW = e),
          (this.GRID_GAP_PIXELS = t),
          (this.PADDING_OF_MAIN_BLOCK_VW = r),
          (this.PROGRESS_BAR_WIDTH = "0%"),
          (this.randomArr = []),
          (this.GRID_GAP_QUANITY = this.CELLS_IN_ROW - 1),
          (this.COMMON_GRID_GAP_PX =
            this.GRID_GAP_QUANITY * this.GRID_GAP_PIXELS),
          (this.PROP_OF_GRID = `repeat(${this.CELLS_IN_ROW}, calc((${
            100 - 2 * this.PADDING_OF_MAIN_BLOCK_VW
          }vw - ${this.COMMON_GRID_GAP_PX}px)/${this.CELLS_IN_ROW})`),
          this.mainBlock,
          this.block,
          this.progressBarInner,
          (this.cellsArr = []),
          (this.counter = 1),
          (this.counterOfTasks = 1);
      }
      createRandomArr() {
        this.randomArr = [];
        for (let e = 1; e <= Math.pow(this.CELLS_IN_ROW, 2); e++)
          this.randomArr.push(e);
        this.randomArr.sort(() => Math.random() - 0.5);
      }
      createBlock() {
        const e = document.createElement("div");
        e.classList.add("patience");
        const t = document.createElement("div");
        t.classList.add("patience__table"),
          t.style.setProperty("--grid-gap-px", `${this.GRID_GAP_PIXELS}px`),
          t.style.setProperty("--prop-of-grid", this.PROP_OF_GRID),
          t.style.setProperty("--cells-in-row", this.CELLS_IN_ROW);
        const r = document.createElement("div");
        r.classList.add("patience__progress-bar");
        const s = document.createElement("div");
        s.classList.add("patience__progress-bar-inner"),
          r.appendChild(s),
          s.style.setProperty("--progress-bar-width", this.PROGRESS_BAR_WIDTH),
          e.appendChild(t),
          e.appendChild(r),
          (this.block = t),
          (this.mainBlock = e),
          (this.progressBarInner = s);
      }
      createCellsArr() {
        this.cellsArr = [];
        for (let e of this.randomArr) {
          let t = document.createElement("div");
          t.classList.add("patience__cell"),
            (t.textContent = e),
            this.cellsArr.push(t);
        }
      }
      renderBlockInContainer(e, t) {
        t.insertAdjacentElement("afterbegin", e);
      }
      increaseCounter() {
        this.counter++;
      }
      resetCounter() {
        this.counter = 1;
      }
      cleanCells() {
        this.block.innerHTML = "";
      }
      preservingThePast() {
        for (let e = 1; e < this.counter; e++)
          this.cellsArr
            .find((t) => t.textContent == e)
            .classList.add("patience__cell_active");
      }
      increaseCellsInRow() {
        this.CELLS_IN_ROW++;
      }
      refreshState() {
        (this.GRID_GAP_QUANITY = this.CELLS_IN_ROW - 1),
          (this.COMMON_GRID_GAP_PX =
            this.GRID_GAP_QUANITY * this.GRID_GAP_PIXELS),
          (this.PROP_OF_GRID = `repeat(${this.CELLS_IN_ROW}, calc((${
            100 - 2 * this.PADDING_OF_MAIN_BLOCK_VW
          }vw - ${this.COMMON_GRID_GAP_PX}px)/${this.CELLS_IN_ROW})`),
          (this.counter = 1),
          this.block.style.setProperty(
            "--grid-gap-px",
            `${this.GRID_GAP_PIXELS}px`
          ),
          this.block.style.setProperty("--prop-of-grid", this.PROP_OF_GRID),
          this.block.style.setProperty("--cells-in-row", this.CELLS_IN_ROW);
      }
      increaseProgress() {
        (this.PROGRESS_BAR_WIDTH =
          parseInt(this.PROGRESS_BAR_WIDTH) + 25 + "%"),
          this.progressBarInner.style.setProperty(
            "--progress-bar-width",
            this.PROGRESS_BAR_WIDTH
          );
      }
    })(2, 5, 5);
  l.createBlock(),
    a.insertAdjacentElement("afterbegin", l.mainBlock),
    l.createRandomArr(),
    l.createCellsArr();
  for (let e of l.cellsArr) l.block.insertAdjacentElement("afterbegin", e);
  a.querySelector(".patience__table").addEventListener("click", (e) => {
    if (e.target.classList.contains("patience__cell"))
      if (e.target.textContent == l.counter) {
        e.target.classList.add("patience__cell_active"),
          l.increaseCounter(),
          l.counter == Math.pow(l.CELLS_IN_ROW, 2) + 1
            ? (l.increaseCellsInRow(),
              l.refreshState(),
              l.increaseProgress(),
              c.play())
            : i.play(),
          l.cleanCells(),
          l.createRandomArr(),
          l.createCellsArr(),
          l.preservingThePast();
        for (let e of l.cellsArr)
          l.block.insertAdjacentElement("afterbegin", e);
      } else {
        l.resetCounter(),
          l.cleanCells(),
          l.createRandomArr(),
          l.createCellsArr();
        for (let e of l.cellsArr)
          l.block.insertAdjacentElement("afterbegin", e);
        n.play();
      }
  });
})();
