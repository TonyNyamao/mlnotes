/* app.js — AFRICDSA ML Notebook Platform UI logic */

/* ── State ── */
let currentCourse   = 0;
let currentNbId     = "ml_intro";
let selectedCellIdx = -1;
let cellRunStates   = {};

/* ── Cell explanations (plain-English) ── */
const CELL_EXPLANATIONS = {
  0: "This cell imports libraries (sklearn, pandas) and loads the Iris dataset. It converts the raw arrays into a readable table (DataFrame), then prints its shape and species names.",
  1: "This cell filters the DataFrame by species and calculates the average value using .mean(). The f-string formats numbers to 2 decimal places using :.2f",
  2: "This cell splits data into 80% training / 20% test sets using train_test_split, then scales features so they all have mean=0 and std=1. It then calls .fit() — where the actual learning happens.",
  3: "This cell creates a KNeighborsClassifier and tests 6 different values of K. For each K it trains, predicts, and measures accuracy. np.argmax finds which K scored highest.",
  4: "This cell trains a KMeans model to find 3 clusters without using any labels. Adjusted Rand Score then compares discovered clusters to the true species labels — 1.0 means perfect match.",
  5: "This cell uses cross_val_score to train and test the model 5 times on different data splits. The mean and standard deviation give a much more reliable accuracy estimate than a single split.",
  6: "Grid Search tests every combination of hyperparameters in param_grid using 5-fold CV. It returns the combination that achieved the highest average score.",
  7: "This cell builds a Logistic Regression model and predicts on the test set. The confusion matrix shows TP, FP, FN, TN — four types of prediction outcomes.",
  default: "This code cell demonstrates a core ML operation. Key functions: .fit() = train the model on data, .predict() = generate outputs for new data, .transform() = preprocess or scale data.",
};

/* ══════════════════════════════════════════
   RENDER FUNCTIONS
══════════════════════════════════════════ */

function renderSidebar() {
  const course = COURSES[currentCourse];
  const ml = document.getElementById("moduleList");
  ml.innerHTML = "";

  course.modules.forEach(mod => {
    const h = document.createElement("div");
    h.className = "module-header";
    h.textContent = mod.title;
    ml.appendChild(h);

    mod.notebooks.forEach(nb => {
      const item = document.createElement("div");
      item.className = "notebook-item" + (nb.id === currentNbId ? " active" : "");
      item.innerHTML = `
        <div class="notebook-icon" style="background:${nb.color};color:${nb.iconColor}">${nb.icon}</div>
        <div class="nb-title">${nb.title}</div>
        <span class="nb-badge" style="background:${nb.badgeBg};color:${nb.badgeColor}">${nb.badge}</span>`;
      item.addEventListener("click", () => loadNotebook(nb.id));
      ml.appendChild(item);
    });
  });
}

function renderNotebook() {
  const nb = NOTEBOOKS[currentNbId];
  const area = document.getElementById("notebookArea");
  area.innerHTML = "";

  if (!nb) {
    area.innerHTML = `
      <div class="empty-state">
        <h3>Coming soon</h3>
        <p>This notebook is under development. Browse another notebook from the sidebar to explore.</p>
      </div>`;
    return;
  }

  nb.cells.forEach((cell, idx) => {
    const el = document.createElement("div");
    el.className = "cell " + (cell.type === "markdown" ? "markdown-cell" : "code-cell");
    el.dataset.idx = idx;

    if (cell.type === "markdown") {
      el.innerHTML = `
        <div class="cell-top">
          <div class="cell-gutter"><span class="cell-counter">md</span></div>
          <div class="cell-body"><div class="cell-content">${cell.content}</div></div>
        </div>`;
    } else {
      const alreadyRan = !!cellRunStates[idx];
      el.innerHTML = `
        <div class="cell-top">
          <div class="cell-gutter">
            <span class="cell-counter">${cell.counter}</span>
            <button class="run-btn" title="Run cell" onclick="runCell(${idx}, event)">▶</button>
          </div>
          <div class="cell-body">
            <div class="cell-content">
              <div class="code-editor">${cell.code}</div>
            </div>
          </div>
        </div>
        <div class="loading-overlay" id="loading_${idx}">
          <div class="spin"></div><span>Running…</span>
        </div>
        <div class="cell-output${alreadyRan ? " visible" : ""}" id="output_${idx}">
          ${alreadyRan ? buildOutputHTML(cell) : ""}
        </div>`;
    }

    el.addEventListener("click", () => selectCell(idx, el));
    area.appendChild(el);
  });
}

/* ── Build output HTML for a cell ── */
function buildOutputHTML(cell) {
  let html = "";

  if (cell.preText) {
    html += `<div class="output-text" style="margin-bottom:7px">${escapeHTML(cell.preText)}</div>`;
  }

  switch (cell.output) {
    case "text":
      html += `<div class="output-text output-success">${escapeHTML(cell.outputData)}</div>`;
      break;

    case "table":
      html += `<table class="output-table">
        <thead><tr>${cell.outputData.headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${cell.outputData.rows.map(r =>
          `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`
        ).join("")}</tbody>
      </table>`;
      break;

    case "bar":
      html += `<div class="output-chart-bar">${cell.outputData.map(d => `
        <div class="bar-row">
          <div class="bar-label">${d.label}</div>
          <div class="bar-wrap">
            <div class="bar-fill" style="width:${((d.val / d.max) * 100).toFixed(1)}%;background:${d.color}"></div>
          </div>
          <div class="bar-val">${d.display}</div>
        </div>`).join("")}
      </div>`;
      break;
  }

  return html;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ══════════════════════════════════════════
   INTERACTION
══════════════════════════════════════════ */

function switchCourse(idx) {
  currentCourse = idx;
  document.querySelectorAll(".course-tab").forEach((t, i) =>
    t.classList.toggle("active", i === idx));
  const firstNb = COURSES[idx].modules[0].notebooks[0];
  loadNotebook(firstNb.id);
}

function loadNotebook(id) {
  currentNbId     = id;
  cellRunStates   = {};
  selectedCellIdx = -1;
  renderSidebar();

  const nb = NOTEBOOKS[id];
  document.getElementById("nbName").textContent = nb ? nb.title : "Notebook";
  document.getElementById("nbMeta").textContent = nb ? nb.meta  : "";
  setAiText("Select a cell and click Explain to get a plain-English breakdown of the code.");
  renderNotebook();
}

function selectCell(idx, el) {
  document.querySelectorAll(".cell").forEach(c => c.classList.remove("active-cell"));
  el.classList.add("active-cell");
  selectedCellIdx = idx;
}

/* ── Run a single cell ── */
function runCell(idx, event) {
  if (event) event.stopPropagation();  // don't also trigger selectCell

  const nb = NOTEBOOKS[currentNbId];
  if (!nb || !nb.cells[idx]) return;
  const cell = nb.cells[idx];
  if (cell.type !== "code") return;

  const loading = document.getElementById(`loading_${idx}`);
  const output  = document.getElementById(`output_${idx}`);
  const dot     = document.getElementById("kernelDot");

  dot.className       = "kernel-dot busy";
  loading.className   = "loading-overlay visible";
  if (output) output.className = "cell-output";

  const delay = 500 + Math.random() * 700;
  setTimeout(() => {
    cellRunStates[idx]  = true;
    loading.className   = "loading-overlay";
    output.innerHTML    = buildOutputHTML(cell);
    output.className    = "cell-output visible";
    dot.className       = "kernel-dot";
    setAiText(`Cell ${cell.counter} executed. Select it and click Explain for a breakdown.`);
  }, delay);
}

/* ── Run all cells sequentially ── */
async function runAll() {
  const nb = NOTEBOOKS[currentNbId];
  if (!nb) return;

  const btn = document.getElementById("runAllBtn");
  btn.className   = "run-all-btn running";
  btn.textContent = "⏳ Running…";

  const codeCells = nb.cells
    .map((c, i) => ({ c, i }))
    .filter(x => x.c.type === "code");

  for (let j = 0; j < codeCells.length; j++) {
    await sleep(400 + j * 180);
    runCell(codeCells[j].i);
  }

  await sleep(700 + codeCells.length * 200);
  btn.className   = "run-all-btn";
  btn.textContent = "▶ Run All Cells";
  setAiText("All cells executed. Click any code cell then press Explain for a walkthrough.");
}

/* ── Explain selected cell ── */
function explainSelected() {
  const nb = NOTEBOOKS[currentNbId];

  if (!nb || selectedCellIdx < 0) {
    setAiText("Click on a code cell first, then press Explain.");
    return;
  }

  const cell = nb.cells[selectedCellIdx];

  if (cell.type === "markdown") {
    setAiText("That's a Markdown cell (text notes). Select a code cell to explain.");
    return;
  }

  const key = selectedCellIdx <= 7 ? selectedCellIdx : "default";
  setAiText("✦ " + (CELL_EXPLANATIONS[key] || CELL_EXPLANATIONS["default"]));
}

/* ── Helpers ── */
function setAiText(msg) {
  document.getElementById("aiText").textContent = msg;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
renderSidebar();
renderNotebook();
