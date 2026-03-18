# AFRICDSA — ML Associate Notebook Platform

An interactive, browser-based notebook platform for the AFRICDSA Machine Learning Associate and Advanced ML courses (Courses 7, 8, and 9).

## Features

- 📓 Interactive notebook UI with Markdown + Code cells
- ▶ Simulate cell execution with realistic outputs (tables, bar charts, text)
- ✦ "Explain selected cell" — plain-English breakdown of any code cell
- 🎨 Dark mode support via CSS variables
- 📱 Responsive sidebar with course/module navigation
- Zero dependencies — pure HTML, CSS, JavaScript

---

## File Structure

```
africdsa-ml-notebooks/
├── index.html          # Entry point
├── styles.css          # All styling (light + dark mode)
├── app.js              # UI logic (rendering, interaction, state)
├── data/
│   ├── courses.js      # Course & module structure / sidebar config
│   └── notebooks.js    # All notebook cell content (markdown + code)
└── README.md
```

---

## Running Locally

This is a static site — no build step needed.

```bash
# Option 1: Python (built-in)
python3 -m http.server 8080
# Open http://localhost:8080

# Option 2: Node (npx)
npx serve .
# Open http://localhost:3000

# Option 3: VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

> **Note:** You must serve the files via a local server (not open `index.html` directly in a browser) because `data/courses.js` and `data/notebooks.js` are loaded as separate script tags.

---

## Deploying to Vercel

### Option 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Framework Preset: **Other** (static site)
5. Click **Deploy** — no build command needed

### Optional `vercel.json`
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Adding New Notebooks

### 1. Add the notebook entry to `data/courses.js`
```js
{ id: "my_new_notebook", title: "My New Topic", icon: "21",
  color: "#E1F5EE", iconColor: "#0F6E56",
  badge: "Lab", badgeBg: "#E1F5EE", badgeColor: "#0F6E56" }
```

### 2. Define its cells in `data/notebooks.js`
```js
my_new_notebook: {
  title: "My New Topic",
  meta: "Module X · Course Y · Dataset: iris (sklearn)",
  cells: [
    { type: "markdown", content: "<h1>Title</h1><p>Explanation...</p>" },
    {
      type: "code", counter: "[1]",
      code: `<span class="cm"># your highlighted code</span>`,
      output: "text",
      outputData: "Output shown after running"
    }
  ]
}
```

### Supported cell output types

| `output` value | `outputData` format |
|----------------|---------------------|
| `"text"`       | Plain string |
| `"table"`      | `{ headers: [...], rows: [[...], ...] }` |
| `"bar"`        | `[{ label, val, max, color, display }, ...]` |

---

## Course Coverage

| Course | Modules | Key algorithms |
|--------|---------|----------------|
| C7 — ML Associate | 1–8 | Linear/Logistic Regression, KNN, K-Means, PCA |
| C8 — Advanced ML | 1–5 | Decision Trees, Random Forest, Naïve Bayes |
| C9 — Advanced ML II | 6–9 | SVM, Boosting, ANN, Cross-validation |

All code examples use **scikit-learn built-in datasets** — no external downloads required.

---

## Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript (ES6+)
- Google Fonts: Sora (UI) + JetBrains Mono (code)
- No npm, no bundler, no framework

---

© 2025 AFRICDSA. All rights reserved.
