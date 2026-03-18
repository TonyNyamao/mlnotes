/* app.js — AFRICDSA ML Notebooks */

/* ── State ── */
let currentCourseIdx = 0;
let currentNbId = null;
let selectedCellEl = null;
let selectedCellIdx = -1;
let cellRunStates = {};

const STORAGE_KEYS = {
  notebooks: "africdsa.notebooks.v1",
  courses: "africdsa.courses.v1",
};

const STATIC_PHASE_TABS = [
  "04 Storage",
  "05 ML & Serving",
  "06 Security",
  "07 Monitoring",
  "Costs",
  "Checklist",
];

const hasWindow = typeof window !== "undefined";
const FALLBACK_NOTEBOOKS = hasWindow && window.NOTEBOOKS && typeof window.NOTEBOOKS === "object"
  ? window.NOTEBOOKS
  : {};
const FALLBACK_COURSES = hasWindow && Array.isArray(window.COURSES)
  ? window.COURSES
  : [];

let notebooksData = FALLBACK_NOTEBOOKS;
let coursesData = FALLBACK_COURSES;

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
   INIT + DATA LOADING
══════════════════════════════════ */

async function init() {
  showLoadingSkeleton();
  await hydrateData();

  if (!Array.isArray(coursesData) || coursesData.length === 0) {
    showNoDataState("No courses available. Check Notion API configuration.");
    return;
  }

  renderPhaseTabs();
  loadCourse(0);
}

async function hydrateData() {
  const [liveNotebooks, liveCourses] = await Promise.all([
    fetchAllNotebooks(),
    fetchCourseStructure(),
  ]);

  if (hasNotebookPayload(liveNotebooks)) {
    notebooksData = liveNotebooks;
  } else if (!hasNotebookPayload(FALLBACK_NOTEBOOKS)) {
    console.warn("Notebook data is empty from Notion and fallback sources.");
  }

  if (Array.isArray(liveCourses) && liveCourses.length) {
    coursesData = liveCourses;
  } else if (!Array.isArray(FALLBACK_COURSES) || !FALLBACK_COURSES.length) {
    console.warn("Course data is empty from Notion and fallback sources.");
  }
}

function showLoadingSkeleton() {
  const topbar = document.getElementById("nbTopbar");
  const alert = document.getElementById("nbAlert");
  const cells = document.getElementById("cells");

  if (topbar) topbar.style.display = "none";
  if (alert) alert.style.display = "none";

  if (cells) {
    cells.innerHTML = `
      <div class="empty-state">
        <div style="display:inline-flex;align-items:center;gap:10px;">
          <div class="spinner"></div>
          <p>Loading notebooks from Notion...</p>
        </div>
      </div>`;
  }

  setExplainText("Loading notebook content...");
}

function showNoDataState(message) {
  const topbar = document.getElementById("nbTopbar");
  const alert = document.getElementById("nbAlert");
  const cells = document.getElementById("cells");

  if (topbar) topbar.style.display = "none";
  if (alert) alert.style.display = "none";

  if (cells) {
    cells.innerHTML = `
      <div class="empty-state">
        <h3>Data unavailable</h3>
        <p>${escHTML(message)}</p>
      </div>`;
  }
}

function readSessionCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed reading sessionStorage key ${key}:`, error);
    return null;
  }
}

function writeSessionCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed writing sessionStorage key ${key}:`, error);
  }
}

async function fetchFromNotionProxy(type) {
  const response = await fetch(`/api/notion-proxy?type=${encodeURIComponent(type)}`);
  if (!response.ok) {
    throw new Error(`Proxy request failed (${response.status})`);
  }
  return response.json();
}

function hasNotebookPayload(payload) {
  return payload && typeof payload === "object" && !Array.isArray(payload) && Object.keys(payload).length > 0;
}

async function fetchAllNotebooks() {
  const cached = readSessionCache(STORAGE_KEYS.notebooks);
  if (hasNotebookPayload(cached)) {
    return cached;
  }

  try {
    const responseData = await fetchFromNotionProxy("notebooks");
    if (hasNotebookPayload(responseData)) {
      writeSessionCache(STORAGE_KEYS.notebooks, responseData);
      return responseData;
    }

    console.warn("Notion notebooks response was empty. Falling back to local data.");
  } catch (error) {
    console.warn("Failed to load notebooks from Notion proxy. Falling back to local data.", error);
  }

  return FALLBACK_NOTEBOOKS;
}

async function fetchCourseStructure() {
  const cached = readSessionCache(STORAGE_KEYS.courses);
  if (Array.isArray(cached) && cached.length) {
    return cached;
  }

  try {
    const responseData = await fetchFromNotionProxy("courses");
    if (Array.isArray(responseData) && responseData.length) {
      writeSessionCache(STORAGE_KEYS.courses, responseData);
      return responseData;
    }

    console.warn("Notion courses response was empty. Falling back to local data.");
  } catch (error) {
    console.warn("Failed to load courses from Notion proxy. Falling back to local data.", error);
  }

  return FALLBACK_COURSES;
}

/* ══════════════════════════════════
   COURSE SWITCHING
══════════════════════════════════ */

function renderPhaseTabs() {
  const tabBar = document.getElementById("phaseTabs");
  tabBar.innerHTML = "";

  coursesData.forEach((course, idx) => {
    const tab = document.createElement("div");
    tab.className = "phase-tab" + (idx === currentCourseIdx ? " active" : "");
    tab.textContent = course.tabLabel || `Course ${idx + 1}`;
    tab.onclick = () => loadCourse(idx);
    tabBar.appendChild(tab);
  });

  STATIC_PHASE_TABS.forEach((label) => {
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
  currentNbId = null;
  cellRunStates = {};
  selectedCellIdx = -1;
  selectedCellEl = null;

  document.querySelectorAll(".phase-tab").forEach((tab, tabIdx) => {
    tab.classList.toggle("active", tabIdx === idx);
  });

  const course = coursesData[idx];
  if (!course) {
    showNoDataState("Unable to load selected course.");
    return;
  }

  document.getElementById("heroTitle").textContent = course.heroTitle || "Machine Learning Notebook";
  document.getElementById("heroDesc").textContent = course.heroDesc || "";

  renderSidebar(course);

  const firstNotebookId = getFirstNotebookId(course);
  if (!firstNotebookId) {
    showNoDataState("No notebooks available for this course yet.");
    return;
  }

  loadNotebook(firstNotebookId);
}

function getFirstNotebookId(course) {
  const modules = Array.isArray(course.modules) ? course.modules : [];

  for (const moduleEntry of modules) {
    const notebooks = Array.isArray(moduleEntry.notebooks) ? moduleEntry.notebooks : [];
    if (notebooks.length && notebooks[0].id) {
      return notebooks[0].id;
    }
  }

  return null;
}

/* ══════════════════════════════════
   SIDEBAR
══════════════════════════════════ */

function renderSidebar(course) {
  const container = document.getElementById("sidebarModules");
  container.innerHTML = "";

  const modules = Array.isArray(course.modules) ? course.modules : [];

  modules.forEach((moduleEntry) => {
    const label = document.createElement("div");
    label.className = "nav-section-label";
    label.style.marginTop = "18px";
    label.textContent = String(moduleEntry.navLabel || "Module").toUpperCase();
    container.appendChild(label);

    const notebooks = Array.isArray(moduleEntry.notebooks) ? moduleEntry.notebooks : [];
    notebooks.forEach((notebook) => {
      const item = document.createElement("div");
      item.className = "nav-item" + (notebook.id === currentNbId ? " active" : "");
      item.id = "nav-" + notebook.id;
      item.innerHTML = `<span class="nav-dot"></span>${escHTML(notebook.label || notebook.id || "Notebook")}`;
      item.onclick = () => loadNotebook(notebook.id);
      container.appendChild(item);
    });
  });
}

function setActiveNav(id) {
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.toggle("active", el.id === "nav-" + id);
  });

  document.querySelectorAll(".nav-item .nav-dot").forEach((dot) => {
    const active = dot.closest(".nav-item")?.classList.contains("active");
    dot.style.background = active ? "var(--amber)" : "";
  });
}

/* ══════════════════════════════════
   NOTEBOOK LOADING
══════════════════════════════════ */

function loadNotebook(id) {
  currentNbId = id;
  cellRunStates = {};
  selectedCellIdx = -1;
  selectedCellEl = null;
  setActiveNav(id);
  setExplainText("Select a code cell · click Explain for a plain-English breakdown");

  const notebook = notebooksData[id];
  const topbar = document.getElementById("nbTopbar");
  const alert = document.getElementById("nbAlert");

  if (!notebook) {
    topbar.style.display = "none";
    alert.style.display = "none";
    document.getElementById("cells").innerHTML = `
      <div class="empty-state">
        <h3>Coming soon</h3>
        <p>This notebook is in development. Select another from the sidebar.</p>
      </div>`;
    return;
  }

  topbar.style.display = "flex";
  document.getElementById("nbPhasePill").textContent = notebook.phase || "Phase";
  document.getElementById("nbTopbarTitle").textContent = notebook.title || "Notebook";
  document.getElementById("nbTopbarMeta").textContent = notebook.meta || "";

  if (notebook.alert) {
    alert.style.display = "block";
    alert.innerHTML = notebook.alert;
  } else {
    alert.style.display = "none";
  }

  renderCells(notebook);
}

/* ══════════════════════════════════
   CELL RENDERING
══════════════════════════════════ */

function renderCells(notebook) {
  const container = document.getElementById("cells");
  container.innerHTML = "";

  let codeCellIdx = 0;
  const cells = Array.isArray(notebook.cells) ? notebook.cells : [];

  cells.forEach((cell) => {
    if (cell.type === "md") {
      const el = document.createElement("div");
      el.className = "cell-md";
      el.innerHTML = cell.content || "";
      container.appendChild(el);
      return;
    }

    if (cell.type === "code") {
      container.appendChild(buildCodeCell(cell, codeCellIdx));
      codeCellIdx += 1;
    }
  });
}

function buildCodeCell(cell, idx) {
  const wrap = document.createElement("div");
  const codeText = String(cell.code || "");
  const codeLines = codeText.split("\n");
  const lineNums = codeLines.map((_, lineIdx) => lineIdx + 1).join("\n");
  const counter = String(cell.counter || `[${idx + 1}]`);
  const alreadyRan = !!cellRunStates[idx];

  wrap.innerHTML = `
    <div class="step-card${alreadyRan ? " open" : ""}" id="card-${idx}" onclick="toggleCell(${idx}, this)">
      <div class="step-num">${escHTML(counter.replace(/\[|\]/g, ""))}</div>
      <div class="step-label">${escHTML(cell.label || "Untitled step")}</div>
      <div class="step-service">${escHTML(cell.service || "notion")}</div>
      <div class="step-arrow">▶</div>
    </div>

    <div class="step-body${alreadyRan ? " open" : ""}" id="body-${idx}">
      <div class="code-block">
        <div class="code-toolbar">
          <span class="code-label">PYTHON 3</span>
          <span class="code-counter">${escHTML(counter)}</span>
          <button class="run-cell-btn" onclick="runCell(${idx}, event)">▶ run</button>
        </div>
        <div class="code-line-numbers">
          <div class="line-nums">${lineNums}</div>
          <div class="code-content">${formatCodeMarkup(codeText)}</div>
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

  wrap.querySelector(".step-card").addEventListener("click", () => {
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
    case "table": {
      const headers = Array.isArray(cell.outputData?.headers) ? cell.outputData.headers : [];
      const rows = Array.isArray(cell.outputData?.rows) ? cell.outputData.rows : [];

      if (!headers.length || !rows.length) {
        html += `<div class="output-text">No tabular output provided.</div>`;
        break;
      }

      html += `<table class="output-table">
        <thead><tr>${headers.map((header) => `<th>${escHTML(header)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cellValue) => `<td>${escHTML(cellValue)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>`;
      break;
    }

    case "bar": {
      const bars = Array.isArray(cell.outputData) ? cell.outputData : [];
      if (!bars.length) {
        html += `<div class="output-text">No chart output provided.</div>`;
        break;
      }

      html += `<div class="output-bars">${bars.map((bar) => {
        const width = Number(bar.max) > 0
          ? Math.max(0, Math.min(100, (Number(bar.val) / Number(bar.max)) * 100)).toFixed(1)
          : "0.0";
        const color = safeBarColor(bar.color);

        return `
          <div class="bar-row">
            <div class="bar-label">${escHTML(bar.label || "")}</div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${width}%;background:${color}"></div>
            </div>
            <div class="bar-val">${escHTML(bar.display || "")}</div>
          </div>`;
      }).join("")}
      </div>`;
      break;
    }

    case "text":
    default:
      html += `<div class="output-text">${escHTML(cell.outputData || "")}</div>`;
      break;
  }

  html += `</div>`;
  return html;
}

/* ══════════════════════════════════
   INTERACTION
══════════════════════════════════ */

function getCodeCells(notebook) {
  return (notebook?.cells || []).filter((cell) => cell.type === "code");
}

function toggleCell(idx, cardEl) {
  const body = document.getElementById(`body-${idx}`);
  if (!body) return;

  const isOpen = body.classList.contains("open");
  body.classList.toggle("open", !isOpen);
  cardEl.classList.toggle("open", !isOpen);
  selectCell(idx, cardEl);
}

function selectCell(idx, cardEl) {
  if (selectedCellEl) selectedCellEl.classList.remove("active-card");
  selectedCellEl = cardEl;
  selectedCellIdx = idx;
  cardEl.classList.add("active-card");
}

function runCell(idx, event) {
  if (event) event.stopPropagation();

  const notebook = notebooksData[currentNbId];
  if (!notebook) return;

  const actualCell = getCodeCells(notebook)[idx];
  if (!actualCell) return;

  const body = document.getElementById(`body-${idx}`);
  const card = document.getElementById(`card-${idx}`);
  const loading = document.getElementById(`loading-${idx}`);
  const output = document.getElementById(`output-${idx}`);

  if (!body || !card || !loading || !output) return;

  body.classList.add("open");
  card.classList.add("open");
  output.className = "cell-output";
  loading.className = "cell-loading visible";

  const delay = 500 + Math.random() * 800;
  setTimeout(() => {
    cellRunStates[idx] = true;
    loading.className = "cell-loading";
    output.innerHTML = buildOutputHTML(actualCell);
    output.className = "cell-output visible";
    setExplainText(`Cell ${actualCell.counter} executed · click Explain for a walkthrough`);
  }, delay);
}

async function runAll() {
  const notebook = notebooksData[currentNbId];
  if (!notebook) return;

  const btn = document.getElementById("runAllBtn");
  btn.classList.add("running");
  btn.textContent = "⏳ Running…";

  const codeCells = getCodeCells(notebook);

  for (let idx = 0; idx < codeCells.length; idx++) {
    const cell = codeCells[idx];
    await sleep(350 + idx * 200);

    const body = document.getElementById(`body-${idx}`);
    const card = document.getElementById(`card-${idx}`);
    const loading = document.getElementById(`loading-${idx}`);
    const output = document.getElementById(`output-${idx}`);

    if (!body || !loading || !output) continue;

    body.classList.add("open");
    if (card) card.classList.add("open");
    output.className = "cell-output";
    loading.className = "cell-loading visible";

    await sleep(500 + Math.random() * 600);

    cellRunStates[idx] = true;
    loading.className = "cell-loading";
    output.innerHTML = buildOutputHTML(cell);
    output.className = "cell-output visible";
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

  const notebook = notebooksData[currentNbId];
  if (!notebook) return;

  const selectedCodeCell = getCodeCells(notebook)[selectedCellIdx];
  if (!selectedCodeCell) {
    setExplainText("Select a code cell to explain.");
    return;
  }

  const explanation = EXPLANATIONS[selectedCellIdx]
    || EXPLANATIONS[selectedCellIdx % EXPLANATIONS.length]
    || "This cell uses scikit-learn's standard API: .fit() trains the model, .predict() generates outputs, .transform() preprocesses data.";

  setExplainText("✦ " + explanation);
}

function setExplainText(msg) {
  const explainText = document.getElementById("explainText");
  if (explainText) {
    explainText.textContent = msg;
  }
}

function escHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCodeMarkup(code) {
  const raw = String(code || "");
  const hasHighlightMarkup = /<span class="(kw|fn|str|num|cm|cls|op)">/.test(raw);
  return hasHighlightMarkup ? raw : escHTML(raw);
}

function safeBarColor(color) {
  const fallback = "#4caf7d";
  if (typeof color !== "string") return fallback;
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : fallback;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ── Boot ── */
init();
