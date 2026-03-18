/* app.js — AFRICDSA ML Notebooks */

/* ── State ── */
let currentCourseIdx = 0;
let currentNbId      = null;
let selectedCellEl   = null;
let selectedCellIdx  = -1;
let cellRunStates    = {};

const EXPLANATIONS = [
  "This cell imports libraries and loads a built-in sklearn dataset. datasets.load_*() returns a Bunch object — .data gives the feature matrix, .target gives the labels.",
  "This cell creates a pandas DataFrame from numpy arrays. Column names come from dataset.feature_names. The final column adds the label so everything is in one readable table.",
  "train_test_split() shuffles and divides data. test_size=0.2 means 80% train / 20% test. random_state=42 makes the split reproducible — same result every run.",
  "StandardScaler subtracts the mean and divides by std deviation. .fit_transform() on train data, .transform() only on test — never fit on test data or you leak information.",
  "model.fit() is where learning happens. The algorithm adjusts internal parameters (weights, splits, centroids) to minimise error on training data.",
  "model.predict() applies the learned parameters to new data. The model never sees test labels during this step — that's the honest evaluation.",
  "This loop tests multiple hyperparameter values. np.argmax finds the index of the highest accuracy. This is manual grid search — we'll automate it with GridSearchCV later.",
  "cross_val_score splits the data K times, trains and tests on each split, and returns K scores. Mean ± std gives a reliable estimate of true model performance.",
];

/* ══════════════════════════════════
   INIT
══════════════════════════════════ */

function init() {
  renderPhaseTabs();
  loadCourse(0);
}

/* ══════════════════════════════════
   COURSE SWITCHING
══════════════════════════════════ */

function renderPhaseTabs() {
  const tabBar = document.getElementById("phaseTabs");
  tabBar.innerHTML = "";
  COURSES.forEach((course, idx) => {
    const tab = document.createElement("div");
    tab.className = "phase-tab" + (idx === currentCourseIdx ? " active" : "");
    tab.textContent = course.tabLabel;
    tab.onclick = () => loadCourse(idx);
    tabBar.appendChild(tab);
  });
  // Add non-active static tabs to look like the reference
  ["04 Storage","05 ML & Serving","06 Security","07 Monitoring","Costs","Checklist"].forEach(label => {
    const tab = document.createElement("div");
    tab.className = "phase-tab";
    tab.textContent = label;
    tab.style.opacity = "0.4";
    tab.style.cursor = "default";
    tabBar.appendChild(tab);
  });
}

function loadCourse(idx) {
  currentCourseIdx = idx;
  currentNbId      = null;
  cellRunStates    = {};
  selectedCellIdx  = -1;
  selectedCellEl   = null;

  // Update tabs
  document.querySelectorAll(".phase-tab").forEach((t, i) =>
    t.classList.toggle("active", i === idx));

  const course = COURSES[idx];

  // Update hero
  document.getElementById("heroTitle").textContent = course.heroTitle;
  document.getElementById("heroDesc").textContent  = course.heroDesc;

  // Render sidebar
  renderSidebar(course);

  // Load first notebook
  const firstNb = course.modules[0].notebooks[0];
  loadNotebook(firstNb.id);
}

/* ══════════════════════════════════
   SIDEBAR
══════════════════════════════════ */

function renderSidebar(course) {
  const container = document.getElementById("sidebarModules");
  container.innerHTML = "";

  course.modules.forEach(mod => {
    const label = document.createElement("div");
    label.className = "nav-section-label";
    label.style.marginTop = "18px";
    label.textContent = mod.navLabel.toUpperCase();
    container.appendChild(label);

    mod.notebooks.forEach(nb => {
      const item = document.createElement("div");
      item.className = "nav-item" + (nb.id === currentNbId ? " active" : "");
      item.id = "nav-" + nb.id;
      item.innerHTML = `<span class="nav-dot"></span>${nb.label}`;
      item.onclick = () => loadNotebook(nb.id);
      container.appendChild(item);
    });
  });
}

function setActiveNav(id) {
  document.querySelectorAll(".nav-item").forEach(el =>
    el.classList.toggle("active", el.id === "nav-" + id));
  document.querySelectorAll(".nav-item .nav-dot").forEach(dot => {
    dot.closest(".nav-item").classList.contains("active")
      ? (dot.style.background = "var(--amber)")
      : (dot.style.background = "");
  });
}

/* ══════════════════════════════════
   NOTEBOOK LOADING
══════════════════════════════════ */

function loadNotebook(id) {
  currentNbId     = id;
  cellRunStates   = {};
  selectedCellIdx = -1;
  selectedCellEl  = null;
  setActiveNav(id);
  setExplainText("Select a code cell · click Explain for a plain-English breakdown");

  const nb = NOTEBOOKS[id];
  const topbar = document.getElementById("nbTopbar");
  const alert  = document.getElementById("nbAlert");

  if (!nb) {
    topbar.style.display = "none";
    alert.style.display  = "none";
    document.getElementById("cells").innerHTML = `
      <div class="empty-state">
        <h3>Coming soon</h3>
        <p>This notebook is in development. Select another from the sidebar.</p>
      </div>`;
    return;
  }

  // Update topbar
  topbar.style.display = "flex";
  document.getElementById("nbPhasePill").textContent   = nb.phase;
  document.getElementById("nbTopbarTitle").textContent = nb.title;
  document.getElementById("nbTopbarMeta").textContent  = nb.meta;

  // Alert
  if (nb.alert) {
    alert.style.display = "block";
    alert.innerHTML = nb.alert;
  } else {
    alert.style.display = "none";
  }

  renderCells(nb);
}

/* ══════════════════════════════════
   CELL RENDERING
══════════════════════════════════ */

function renderCells(nb) {
  const container = document.getElementById("cells");
  container.innerHTML = "";

  nb.cells.forEach((cell, idx) => {
    if (cell.type === "md") {
      const el = document.createElement("div");
      el.className = "cell-md";
      el.innerHTML = cell.content;
      container.appendChild(el);
    } else if (cell.type === "code") {
      container.appendChild(buildCodeCell(cell, idx));
    }
  });
}

function buildCodeCell(cell, idx) {
  const wrap = document.createElement("div");

  // Count code lines for line numbers
  const codeLines = cell.code.split("\n");
  const lineNums  = codeLines.map((_, i) => i + 1).join("\n");

  const alreadyRan = !!cellRunStates[idx];

  wrap.innerHTML = `
    <div class="step-card${alreadyRan ? " open" : ""}" id="card-${idx}" onclick="toggleCell(${idx}, this)">
      <div class="step-num">${cell.counter.replace(/\[|\]/g,"")}</div>
      <div class="step-label">${cell.label}</div>
      <div class="step-service">${cell.service}</div>
      <div class="step-arrow">▶</div>
    </div>

    <div class="step-body${alreadyRan ? " open" : ""}" id="body-${idx}">
      <div class="code-block">
        <div class="code-toolbar">
          <span class="code-label">PYTHON 3</span>
          <span class="code-counter">${cell.counter}</span>
          <button class="run-cell-btn" onclick="runCell(${idx}, event)">▶ run</button>
        </div>
        <div class="code-line-numbers">
          <div class="line-nums">${lineNums}</div>
          <div class="code-content">${cell.code}</div>
        </div>
      </div>

      <div class="cell-loading" id="loading-${idx}">
        <div class="spinner"></div>
        <span>Executing…</span>
      </div>

      <div class="cell-output${alreadyRan ? " visible" : ""}" id="output-${idx}">
        ${alreadyRan ? buildOutputHTML(cell) : ""}
      </div>
    </div>`;

  // Handle cell click for selection
  wrap.querySelector(".step-card").addEventListener("click", (e) => {
    selectCell(idx, wrap.querySelector(".step-card"));
  });

  return wrap;
}

function buildOutputHTML(cell) {
  let html = `
    <div class="output-toolbar">
      <span class="output-label">OUTPUT</span>
      <span class="output-ok">● done</span>
    </div>
    <div class="output-body">`;

  if (cell.preText) {
    html += `<div class="output-pre">${escHTML(cell.preText)}</div>`;
  }

  switch (cell.output) {
    case "text":
      html += `<div class="output-text">${escHTML(cell.outputData)}</div>`;
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
      html += `<div class="output-bars">${cell.outputData.map(d => `
        <div class="bar-row">
          <div class="bar-label">${d.label}</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${((d.val/d.max)*100).toFixed(1)}%;background:${d.color}"></div>
          </div>
          <div class="bar-val">${d.display}</div>
        </div>`).join("")}
      </div>`;
      break;
  }

  html += `</div>`;
  return html;
}

/* ══════════════════════════════════
   INTERACTION
══════════════════════════════════ */

function toggleCell(idx, cardEl) {
  const body = document.getElementById(`body-${idx}`);
  const isOpen = body.classList.contains("open");
  body.classList.toggle("open", !isOpen);
  cardEl.classList.toggle("open", !isOpen);
  selectCell(idx, cardEl);
}

function selectCell(idx, cardEl) {
  if (selectedCellEl) selectedCellEl.classList.remove("active-card");
  selectedCellEl  = cardEl;
  selectedCellIdx = idx;
  cardEl.classList.add("active-card");
}

function runCell(idx, event) {
  if (event) event.stopPropagation();

  const nb = NOTEBOOKS[currentNbId];
  if (!nb) return;
  const cell = nb.cells.filter(c => c.type === "code")[idx - (nb.cells.filter((c,i) => c.type==="md" && i < idx).length)];

  // Find the actual cell by matching index in full cells array
  const codeCells = nb.cells.map((c, i) => ({c, i})).filter(x => x.c.type === "code");
  const entry = codeCells[idx] || codeCells.find((_,i) => i === idx);
  if (!entry) return;

  const actualCell = entry.c;
  const body     = document.getElementById(`body-${idx}`);
  const card     = document.getElementById(`card-${idx}`);
  const loading  = document.getElementById(`loading-${idx}`);
  const output   = document.getElementById(`output-${idx}`);

  // Open the body if closed
  body.classList.add("open");
  card.classList.add("open");

  output.className   = "cell-output";
  loading.className  = "cell-loading visible";

  const delay = 500 + Math.random() * 800;
  setTimeout(() => {
    cellRunStates[idx] = true;
    loading.className  = "cell-loading";
    output.innerHTML   = buildOutputHTML(actualCell);
    output.className   = "cell-output visible";
    setExplainText(`Cell ${actualCell.counter} executed · click Explain for a walkthrough`);
  }, delay);
}

async function runAll() {
  const nb = NOTEBOOKS[currentNbId];
  if (!nb) return;

  const btn = document.getElementById("runAllBtn");
  btn.classList.add("running");
  btn.textContent = "⏳ Running…";

  const codeCells = nb.cells.map((c, i) => ({c, i})).filter(x => x.c.type === "code");

  for (let j = 0; j < codeCells.length; j++) {
    const {c: cell, i: rawIdx} = codeCells[j];
    await sleep(350 + j * 200);

    const body    = document.getElementById(`body-${j}`);
    const card    = document.getElementById(`card-${j}`);
    const loading = document.getElementById(`loading-${j}`);
    const output  = document.getElementById(`output-${j}`);

    if (!body || !loading || !output) continue;

    body.classList.add("open");
    card && card.classList.add("open");
    output.className  = "cell-output";
    loading.className = "cell-loading visible";

    await sleep(500 + Math.random() * 600);

    cellRunStates[j] = true;
    loading.className = "cell-loading";
    output.innerHTML  = buildOutputHTML(cell);
    output.className  = "cell-output visible";
  }

  btn.classList.remove("running");
  btn.textContent = "▶ Run all cells";
  setExplainText("All cells executed · select a cell and click Explain for a walkthrough");
}

function explainSelected() {
  if (selectedCellIdx < 0) {
    setExplainText("Click on a code cell header first, then press Explain.");
    return;
  }
  const nb = NOTEBOOKS[currentNbId];
  if (!nb) return;
  const codeCells = nb.cells.filter(c => c.type === "code");
  const cell = codeCells[selectedCellIdx];
  if (!cell) { setExplainText("Select a code cell to explain."); return; }

  const explanation = EXPLANATIONS[selectedCellIdx] || EXPLANATIONS[selectedCellIdx % EXPLANATIONS.length] ||
    "This cell uses scikit-learn's standard API: .fit() trains the model, .predict() generates outputs, .transform() preprocesses data.";
  setExplainText("✦ " + explanation);
}

function setExplainText(msg) {
  document.getElementById("explainText").textContent = msg;
}

function escHTML(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ── Boot ── */
init();
