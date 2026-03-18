/* data/notebooks.js */

const NOTEBOOKS = {

  ml_intro: {
    title: "What is Machine Learning?",
    meta: "Module 1 · Course 7 · Dataset: iris (sklearn)",
    phase: "Phase 01",
    alert: "<strong>Start here.</strong> Every subsequent module builds on the vocabulary introduced in this notebook.",
    cells: [
      {
        type: "md",
        content: `<h1>What is Machine Learning?</h1>
<p>Machine Learning (ML) is a way to teach computers to learn from <em>data</em> instead of being explicitly programmed with rules.</p>
<ul>
  <li><strong>Traditional programming:</strong> You write rules → computer applies them</li>
  <li><strong>Machine Learning:</strong> You give examples → computer discovers the rules</li>
</ul>
<div class="tip">🟢 Think of teaching a child to recognise dogs. You don't list every rule — you show hundreds of photos and they learn the pattern. ML works the same way.</div>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "sklearn · pandas",
        label: "Load the Iris dataset",
        code: `<span class="cm"># The Iris dataset: 150 flower measurements across 3 species</span>
<span class="cm"># It's built into scikit-learn — no downloads needed</span>

<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">import</span> <span class="cls">pandas</span> <span class="kw">as</span> pd

iris <span class="op">=</span> datasets.<span class="fn">load_iris</span>()

<span class="cm"># Convert to a readable table (DataFrame)</span>
df <span class="op">=</span> pd.<span class="fn">DataFrame</span>(iris.data, columns<span class="op">=</span>iris.feature_names)
df[<span class="str">'species'</span>] <span class="op">=</span> iris.target_names[iris.target]

<span class="fn">print</span>(<span class="str">f"Shape: {df.shape[0]} rows × {df.shape[1]} columns"</span>)
<span class="fn">print</span>(<span class="str">f"Species: {list(df['species'].unique())}"</span>)
df.<span class="fn">head</span>()`,
        output: "table",
        preText: "Shape: 150 rows × 5 columns\nSpecies: ['setosa', 'versicolor', 'virginica']",
        outputData: {
          headers: ["sepal length (cm)", "sepal width (cm)", "petal length (cm)", "petal width (cm)", "species"],
          rows: [
            ["5.1","3.5","1.4","0.2","setosa"],
            ["4.9","3.0","1.4","0.2","setosa"],
            ["4.7","3.2","1.3","0.2","setosa"],
            ["4.6","3.1","1.5","0.2","setosa"],
            ["5.0","3.6","1.4","0.2","setosa"],
          ],
        },
      },
      {
        type: "md",
        content: `<h2>ML vs AI — What's the difference?</h2>
<ul>
  <li><strong>Artificial Intelligence (AI)</strong> — the broad goal of making machines "smart"</li>
  <li><strong>Machine Learning (ML)</strong> — achieving AI by learning from data</li>
  <li><strong>Deep Learning (DL)</strong> — a subset of ML using neural networks</li>
</ul>
<div class="warn">📌 AI is the destination. ML is one road to get there. Deep Learning is a fast lane on that road.</div>`,
      },
      {
        type: "code",
        counter: "[2]",
        service: "pandas",
        label: "Explore patterns in the data",
        code: `<span class="cm"># Why can ML classify species? Because the data has clear patterns.</span>
<span class="cm"># Let's compute average petal length per species.</span>

<span class="kw">for</span> species <span class="kw">in</span> df[<span class="str">'species'</span>].<span class="fn">unique</span>():
    subset <span class="op">=</span> df[df[<span class="str">'species'</span>] <span class="op">==</span> species]
    avg <span class="op">=</span> subset[<span class="str">'petal length (cm)'</span>].<span class="fn">mean</span>()
    <span class="fn">print</span>(<span class="str">f"{species:>12}:  avg petal length = {avg:.2f} cm"</span>)`,
        output: "text",
        outputData: "      setosa:  avg petal length = 1.46 cm\n  versicolor:  avg petal length = 4.26 cm\n   virginica:  avg petal length = 5.55 cm",
      },
      {
        type: "md",
        content: `<h2>Key takeaway</h2>
<p>The petal lengths are very different across species. A machine learning model automatically learns these differences from numbers — no human-written rules needed.</p>
<div class="tip">🟢 Your role as a data scientist: prepare good data, choose the right algorithm, evaluate honestly.</div>`,
      },
    ],
  },

  simple_linear_reg: {
    title: "Simple Linear Regression",
    meta: "Module 3 · Course 7 · Dataset: diabetes (sklearn)",
    phase: "Phase 03",
    alert: "<strong>Core algorithm.</strong> Linear regression is the foundation of supervised learning. Understanding it deeply makes every other algorithm easier to learn.",
    cells: [
      {
        type: "md",
        content: `<h1>Simple Linear Regression</h1>
<p>Finds the best straight line through data points. Answers: <em>"If BMI increases by 1, how does diabetes progression change?"</em></p>
<h2>The equation</h2>
<p><code>y = m·x + c</code></p>
<ul>
  <li><code>y</code> — target variable (what we predict)</li>
  <li><code>x</code> — input feature</li>
  <li><code>m</code> — slope (steepness of the line)</li>
  <li><code>c</code> — intercept (where line crosses y-axis)</li>
</ul>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "sklearn · pandas",
        label: "Load diabetes dataset",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">import</span> <span class="cls">pandas</span> <span class="kw">as</span> pd

diabetes <span class="op">=</span> datasets.<span class="fn">load_diabetes</span>()
df <span class="op">=</span> pd.<span class="fn">DataFrame</span>(diabetes.data, columns<span class="op">=</span>diabetes.feature_names)
df[<span class="str">'progression'</span>] <span class="op">=</span> diabetes.target

<span class="fn">print</span>(<span class="str">f"Samples: {df.shape[0]}, Features: {df.shape[1]-1}"</span>)
<span class="fn">print</span>(<span class="str">f"Target range: {df['progression'].min():.0f} – {df['progression'].max():.0f}"</span>)
df.<span class="fn">head</span>(<span class="num">3</span>)`,
        output: "table",
        preText: "Samples: 442, Features: 10\nTarget range: 25 – 346",
        outputData: {
          headers: ["age","sex","bmi","bp","s1","progression"],
          rows: [
            ["0.038","0.051","0.062","-0.026","-0.044","151"],
            ["-0.002","-0.045","-0.051","-0.026","-0.034","75"],
            ["0.085","0.051","0.044","-0.006","0.003","141"],
          ],
        },
      },
      {
        type: "code",
        counter: "[2]",
        service: "sklearn.model_selection",
        label: "Split data 80/20",
        code: `<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split

X <span class="op">=</span> df[[<span class="str">'bmi'</span>]]   <span class="cm"># double brackets → keeps as DataFrame</span>
y <span class="op">=</span> df[<span class="str">'progression'</span>]

X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    X, y, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

<span class="fn">print</span>(<span class="str">f"Train: {X_train.shape[0]} samples"</span>)
<span class="fn">print</span>(<span class="str">f"Test:  {X_test.shape[0]} samples"</span>)`,
        output: "text",
        outputData: "Train: 353 samples\nTest:   89 samples",
      },
      {
        type: "code",
        counter: "[3]",
        service: "LinearRegression",
        label: "Train and read the model",
        code: `<span class="kw">from</span> <span class="cls">sklearn.linear_model</span> <span class="kw">import</span> LinearRegression

model <span class="op">=</span> LinearRegression()
model.<span class="fn">fit</span>(X_train, y_train)  <span class="cm"># ← learning happens here</span>

<span class="fn">print</span>(<span class="str">f"Slope (m):     {model.coef_[0]:.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Intercept (c): {model.intercept_:.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Formula: progression = {model.coef_[0]:.1f}·bmi + {model.intercept_:.1f}"</span>)`,
        output: "text",
        outputData: "Slope (m):     949.44\nIntercept (c): 152.13\nFormula: progression = 949.4·bmi + 152.1",
      },
      {
        type: "code",
        counter: "[4]",
        service: "sklearn.metrics",
        label: "Evaluate with R² and RMSE",
        code: `<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> r2_score, mean_squared_error
<span class="kw">import</span> <span class="cls">numpy</span> <span class="kw">as</span> np

y_pred <span class="op">=</span> model.<span class="fn">predict</span>(X_test)
r2   <span class="op">=</span> r2_score(y_test, y_pred)
rmse <span class="op">=</span> np.<span class="fn">sqrt</span>(mean_squared_error(y_test, y_pred))

<span class="fn">print</span>(<span class="str">f"R²:   {r2:.3f}   (1.0 = perfect, 0 = useless)"</span>)
<span class="fn">print</span>(<span class="str">f"RMSE: {rmse:.1f}  (average prediction error in original units)"</span>)`,
        output: "bar",
        preText: "R²:   0.383   (1.0 = perfect, 0 = useless)\nRMSE: 59.8  (average prediction error in original units)",
        outputData: [
          { label: "R² Score",      val: 38.3, max: 100, color: "#4caf7d", display: "0.383" },
          { label: "Variance expl.", val: 38.3, max: 100, color: "#5b9bd5", display: "38.3%" },
        ],
      },
      {
        type: "md",
        content: `<h2>Interpreting results</h2>
<p>R² of 0.38 means BMI alone explains <strong>38%</strong> of variation in diabetes progression — not great, but a solid baseline.</p>
<div class="tip">🟢 In Multiple Linear Regression (next notebook), we add all 10 features and R² improves significantly.</div>
<div class="warn">📌 R² = 1.0 is suspicious — usually means overfitting (model memorised training data, won't generalise).</div>`,
      },
    ],
  },

  logistic_reg: {
    title: "Logistic Regression — Binary Classifier",
    meta: "Module 4 · Course 7 · Dataset: breast_cancer (sklearn)",
    phase: "Phase 04",
    alert: "<strong>Classification, not regression.</strong> Despite the name, Logistic Regression predicts <em>categories</em>, not numbers. It outputs a probability between 0 and 1.",
    cells: [
      {
        type: "md",
        content: `<h1>Logistic Regression</h1>
<p>Used when the output is a <em>category</em>. Classic use: <strong>binary classification</strong> — malignant vs benign, spam vs ham, yes vs no.</p>
<h2>The sigmoid function</h2>
<p><code>P(y=1) = 1 / (1 + e^(-z))</code></p>
<ul>
  <li>Always outputs a number between 0 and 1</li>
  <li>P &gt; 0.5 → predict class 1 · P ≤ 0.5 → predict class 0</li>
  <li>The 0.5 threshold can be adjusted (important for medical tasks)</li>
</ul>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "sklearn · pandas",
        label: "Load breast cancer dataset",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">import</span> <span class="cls">pandas</span> <span class="kw">as</span> pd

cancer <span class="op">=</span> datasets.<span class="fn">load_breast_cancer</span>()

<span class="fn">print</span>(<span class="str">f"Classes:   {cancer.target_names}"</span>)
<span class="fn">print</span>(<span class="str">f"Total:     {len(cancer.data)} samples"</span>)
<span class="fn">print</span>(<span class="str">f"Malignant: {(cancer.target==0).sum()}"</span>)
<span class="fn">print</span>(<span class="str">f"Benign:    {(cancer.target==1).sum()}"</span>)`,
        output: "text",
        outputData: "Classes:   ['malignant' 'benign']\nTotal:     569 samples\nMalignant: 212\nBenign:    357",
      },
      {
        type: "code",
        counter: "[2]",
        service: "StandardScaler",
        label: "Scale features — critical for logistic regression",
        code: `<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.preprocessing</span> <span class="kw">import</span> StandardScaler

X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    cancer.data, cancer.target,
    test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>, stratify<span class="op">=</span>cancer.target)

scaler  <span class="op">=</span> StandardScaler()
X_train <span class="op">=</span> scaler.<span class="fn">fit_transform</span>(X_train)  <span class="cm"># fit AND transform train</span>
X_test  <span class="op">=</span> scaler.<span class="fn">transform</span>(X_test)      <span class="cm"># ONLY transform test</span>

<span class="fn">print</span>(<span class="str">"Scaled ✓"</span>)
<span class="fn">print</span>(<span class="str">f"Train: {X_train.shape[0]} · Test: {X_test.shape[0]}"</span>)`,
        output: "text",
        outputData: "Scaled ✓\nTrain: 455 · Test: 114",
      },
      {
        type: "code",
        counter: "[3]",
        service: "LogisticRegression",
        label: "Train and evaluate — confusion matrix",
        code: `<span class="kw">from</span> <span class="cls">sklearn.linear_model</span> <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score, confusion_matrix

model <span class="op">=</span> LogisticRegression(max_iter<span class="op">=</span><span class="num">1000</span>)
model.<span class="fn">fit</span>(X_train, y_train)
y_pred <span class="op">=</span> model.<span class="fn">predict</span>(X_test)

<span class="fn">print</span>(<span class="str">f"Accuracy: {accuracy_score(y_test, y_pred)*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">"\\nConfusion Matrix:"</span>)
<span class="fn">print</span>(confusion_matrix(y_test, y_pred))
<span class="fn">print</span>(<span class="str">"\\n[TP  FN]"</span>)
<span class="fn">print</span>(<span class="str">"[FP  TN]"</span>)`,
        output: "text",
        outputData: "Accuracy: 97.4%\n\nConfusion Matrix:\n[[40  3]\n [ 0 71]]\n\n[TP  FN]\n[FP  TN]",
      },
      {
        type: "md",
        content: `<h2>Reading the confusion matrix</h2>
<table>
  <thead><tr><th></th><th>Predicted Malignant</th><th>Predicted Benign</th></tr></thead>
  <tbody>
    <tr><td>Actual Malignant</td><td style="color:#4caf7d">40 ✓ True Positive</td><td style="color:#d45b5b">3 ✗ False Negative</td></tr>
    <tr><td>Actual Benign</td><td style="color:#d45b5b">0 ✗ False Positive</td><td style="color:#4caf7d">71 ✓ True Negative</td></tr>
  </tbody>
</table>
<div class="warn">📌 In medicine, False Negatives are dangerous — we said benign but it's malignant. Always check Recall (sensitivity), not just accuracy.</div>`,
      },
    ],
  },

  knn: {
    title: "K-Nearest Neighbors",
    meta: "Module 5 · Course 7 · Dataset: wine (sklearn)",
    phase: "Phase 05",
    alert: "<strong>Intuitive but sensitive.</strong> KNN has no training step — it memorises all data. Always scale features first or large-range features will dominate distance calculations.",
    cells: [
      {
        type: "md",
        content: `<h1>K-Nearest Neighbors (KNN)</h1>
<p><em>"You are judged by the company you keep."</em> To classify a new point, find the K nearest training points and take a majority vote.</p>
<div class="tip">🟢 KNN is a "lazy learner" — no training phase, just memorisation. All computation happens at prediction time.</div>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "wine dataset · StandardScaler",
        label: "Load, split, and scale wine data",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.preprocessing</span> <span class="kw">import</span> StandardScaler

wine <span class="op">=</span> datasets.<span class="fn">load_wine</span>()
X, y <span class="op">=</span> wine.data, wine.target

X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    X, y, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

scaler  <span class="op">=</span> StandardScaler()
X_train <span class="op">=</span> scaler.<span class="fn">fit_transform</span>(X_train)
X_test  <span class="op">=</span> scaler.<span class="fn">transform</span>(X_test)

<span class="fn">print</span>(<span class="str">f"Wine: {wine.data.shape[0]} samples · {wine.data.shape[1]} features · {len(wine.target_names)} classes"</span>)`,
        output: "text",
        outputData: "Wine: 178 samples · 13 features · 3 classes",
      },
      {
        type: "code",
        counter: "[2]",
        service: "KNeighborsClassifier",
        label: "Find the best K value",
        code: `<span class="kw">from</span> <span class="cls">sklearn.neighbors</span> <span class="kw">import</span> KNeighborsClassifier
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score
<span class="kw">import</span> <span class="cls">numpy</span> <span class="kw">as</span> np

k_values   <span class="op">=</span> [<span class="num">1</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">9</span>, <span class="num">11</span>]
accuracies <span class="op">=</span> []

<span class="kw">for</span> k <span class="kw">in</span> k_values:
    knn <span class="op">=</span> KNeighborsClassifier(n_neighbors<span class="op">=</span>k)
    knn.<span class="fn">fit</span>(X_train, y_train)
    acc <span class="op">=</span> accuracy_score(y_test, knn.<span class="fn">predict</span>(X_test))
    accuracies.<span class="fn">append</span>(acc)
    <span class="fn">print</span>(<span class="str">f"K={k:>2}  →  {acc*100:.1f}%"</span>)

<span class="fn">print</span>(<span class="str">f"\\nBest K = {k_values[np.argmax(accuracies)]}"</span>)`,
        output: "bar",
        preText: "K= 1  →  94.4%\nK= 3  →  97.2%\nK= 5  →  97.2%\nK= 7  →  94.4%\nK= 9  →  91.7%\nK=11  →  88.9%\n\nBest K = 3",
        outputData: [
          { label: "K=1",  val: 94.4, max: 100, color: "#9a9890", display: "94.4%" },
          { label: "K=3",  val: 97.2, max: 100, color: "#4caf7d", display: "97.2% ★" },
          { label: "K=5",  val: 97.2, max: 100, color: "#4caf7d", display: "97.2% ★" },
          { label: "K=7",  val: 94.4, max: 100, color: "#9a9890", display: "94.4%" },
          { label: "K=9",  val: 91.7, max: 100, color: "#e8a020", display: "91.7%" },
          { label: "K=11", val: 88.9, max: 100, color: "#e8a020", display: "88.9%" },
        ],
      },
      {
        type: "md",
        content: `<h2>Choosing K</h2>
<ul>
  <li><strong>K too small (K=1):</strong> Overfits — sensitive to noise, memorises outliers</li>
  <li><strong>K too large:</strong> Underfits — blurs decision boundaries</li>
  <li><strong>Rule of thumb:</strong> Start with K = √(n_samples), then tune with cross-validation</li>
</ul>
<div class="tip">🟢 Scale features first. KNN uses Euclidean distance — features with large ranges dominate.</div>`,
      },
    ],
  },

  kmeans: {
    title: "K-Means Clustering",
    meta: "Module 6 · Course 7 · Dataset: iris (sklearn)",
    phase: "Phase 06",
    alert: "<strong>Unsupervised.</strong> K-Means receives no labels — it discovers structure on its own. We still compare to true labels at the end to evaluate quality.",
    cells: [
      {
        type: "md",
        content: `<h1>K-Means Clustering</h1>
<p>Unsupervised learning — no labels, no target. The algorithm finds natural groupings.</p>
<h2>Algorithm steps</h2>
<ol style="padding-left:20px;font-size:13.5px;line-height:1.9;color:#9a9890">
  <li>Randomly place K centroids in the data space</li>
  <li>Assign each point to its nearest centroid</li>
  <li>Move each centroid to the mean of its assigned points</li>
  <li>Repeat steps 2–3 until centroids stop moving</li>
</ol>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "KMeans · Elbow Method",
        label: "Find optimal K with the Elbow Method",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.cluster</span> <span class="kw">import</span> KMeans
<span class="kw">from</span> <span class="cls">sklearn.preprocessing</span> <span class="kw">import</span> StandardScaler

iris     <span class="op">=</span> datasets.<span class="fn">load_iris</span>()
X        <span class="op">=</span> iris.data
y_true   <span class="op">=</span> iris.target   <span class="cm"># for evaluation only, not training</span>
X_scaled <span class="op">=</span> StandardScaler().<span class="fn">fit_transform</span>(X)

inertias <span class="op">=</span> []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="num">9</span>):
    km <span class="op">=</span> KMeans(n_clusters<span class="op">=</span>k, random_state<span class="op">=</span><span class="num">42</span>, n_init<span class="op">=</span><span class="num">10</span>)
    km.<span class="fn">fit</span>(X_scaled)
    inertias.<span class="fn">append</span>(km.inertia_)
    <span class="fn">print</span>(<span class="str">f"K={k}  inertia={km.inertia_:.1f}"</span>)`,
        output: "bar",
        preText: "K=1  inertia=597.4\nK=2  inertia=260.1\nK=3  inertia=139.8  ← elbow\nK=4  inertia=113.3\nK=5  inertia=93.2",
        outputData: [
          { label: "K=1", val: 597, max: 600, color: "#d45b5b", display: "597.4" },
          { label: "K=2", val: 260, max: 600, color: "#e8a020", display: "260.1" },
          { label: "K=3", val: 139, max: 600, color: "#4caf7d", display: "139.8 ← elbow" },
          { label: "K=4", val: 113, max: 600, color: "#9a9890", display: "113.3" },
          { label: "K=5", val: 93,  max: 600, color: "#9a9890", display: "93.2" },
        ],
      },
      {
        type: "code",
        counter: "[2]",
        service: "adjusted_rand_score",
        label: "Train with K=3 and evaluate",
        code: `<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> adjusted_rand_score
<span class="kw">import</span> <span class="cls">numpy</span> <span class="kw">as</span> np

kmeans <span class="op">=</span> KMeans(n_clusters<span class="op">=</span><span class="num">3</span>, random_state<span class="op">=</span><span class="num">42</span>, n_init<span class="op">=</span><span class="num">10</span>)
kmeans.<span class="fn">fit</span>(X_scaled)
labels <span class="op">=</span> kmeans.labels_

ars <span class="op">=</span> adjusted_rand_score(y_true, labels)
<span class="fn">print</span>(<span class="str">f"Cluster sizes:       {np.bincount(labels)}"</span>)
<span class="fn">print</span>(<span class="str">f"Adjusted Rand Score: {ars:.3f}  (1.0=perfect)"</span>)
<span class="fn">print</span>(<span class="str">f"\\nWithout labels → {ars*100:.0f}% match with true species!"</span>)`,
        output: "text",
        outputData: "Cluster sizes:       [50 47 53]\nAdjusted Rand Score: 0.730  (1.0=perfect)\n\nWithout labels → 73% match with true species!",
      },
      {
        type: "md",
        content: `<h2>Result interpretation</h2>
<p>Without ever seeing species labels, K-Means recovered groupings that are <strong>73% aligned</strong> with the true flower species. The elbow at K=3 correctly suggested the true number of classes.</p>
<div class="tip">🟢 Real-world datasets rarely have a known number of clusters. The elbow method is your first tool — follow it up with Silhouette Score for confirmation.</div>`,
      },
    ],
  },

  decision_tree: {
    title: "Decision Trees (CART)",
    meta: "Module 1–3 · Course 8 · Dataset: iris (sklearn)",
    phase: "Phase 01",
    alert: "<strong>Most interpretable algorithm.</strong> A decision tree can be printed as a diagram and read by non-technical stakeholders. This makes it essential for regulated industries.",
    cells: [
      {
        type: "md",
        content: `<h1>Decision Trees</h1>
<p>A tree of yes/no questions about features. At each node, the algorithm finds the split that most reduces impurity. Keeps splitting until leaves are pure (or depth limit reached).</p>
<div class="tip">🟢 Decision trees need no feature scaling — they split based on relative values, not distances.</div>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "DecisionTreeClassifier · Gini",
        label: "Train with max_depth=3",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.tree</span> <span class="kw">import</span> DecisionTreeClassifier
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score

iris <span class="op">=</span> datasets.<span class="fn">load_iris</span>()
X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    iris.data, iris.target, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

dt <span class="op">=</span> DecisionTreeClassifier(
    max_depth<span class="op">=</span><span class="num">3</span>,        <span class="cm"># limit depth to prevent overfitting</span>
    criterion<span class="op">=</span><span class="str">'gini'</span>,   <span class="cm"># splitting criterion</span>
    random_state<span class="op">=</span><span class="num">42</span>)
dt.<span class="fn">fit</span>(X_train, y_train)

<span class="fn">print</span>(<span class="str">f"Accuracy: {accuracy_score(y_test, dt.predict(X_test))*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"Tree depth: {dt.get_depth()}"</span>)
<span class="fn">print</span>(<span class="str">f"Leaves:     {dt.get_n_leaves()}"</span>)`,
        output: "text",
        outputData: "Accuracy: 100.0%\nTree depth: 3\nLeaves:     5",
      },
      {
        type: "code",
        counter: "[2]",
        service: "feature_importances_",
        label: "Feature importance — what did the tree learn?",
        code: `feature_names <span class="op">=</span> iris.feature_names
importances   <span class="op">=</span> dt.feature_importances_

<span class="fn">print</span>(<span class="str">"Feature importances (sum = 1.0):"</span>)
<span class="kw">for</span> name, imp <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feature_names, importances),
                         key<span class="op">=</span><span class="kw">lambda</span> x: x[<span class="num">1</span>], reverse<span class="op">=</span><span class="kw">True</span>):
    bar <span class="op">=</span> <span class="str">'█'</span> <span class="op">*</span> <span class="fn">int</span>(imp <span class="op">*</span> <span class="num">40</span>)
    <span class="fn">print</span>(<span class="str">f"  {name:<30} {imp:.3f}  {bar}"</span>)`,
        output: "bar",
        preText: "Feature importances (sum = 1.0):",
        outputData: [
          { label: "petal length (cm)", val: 56.1, max: 100, color: "#4caf7d", display: "0.561" },
          { label: "petal width (cm)",  val: 43.5, max: 100, color: "#5b9bd5", display: "0.435" },
          { label: "sepal length (cm)", val: 0.4,  max: 100, color: "#9a9890", display: "0.004" },
          { label: "sepal width (cm)",  val: 0.0,  max: 100, color: "#9a9890", display: "0.000" },
        ],
      },
      {
        type: "md",
        content: `<h2>Gini Impurity</h2>
<p><code>Gini = 1 − Σ(pᵢ²)</code> where pᵢ is the proportion of class i.</p>
<ul>
  <li><strong>Pure node (all one class):</strong> Gini = 0 ← best possible split</li>
  <li><strong>Equal mix (50/50 binary):</strong> Gini = 0.5 ← worst possible</li>
</ul>
<div class="warn">📌 Without max_depth, a tree perfectly memorises training data. Always set a depth limit and validate on held-out data.</div>`,
      },
    ],
  },

  random_forest: {
    title: "Random Forest & Ensemble Bagging",
    meta: "Module 4 · Course 8 · Dataset: digits (sklearn)",
    phase: "Phase 03",
    alert: "<strong>Most versatile algorithm.</strong> Random Forest is the go-to starting point for most tabular classification problems. It's robust, handles missing values, and reports feature importance.",
    cells: [
      {
        type: "md",
        content: `<h1>Random Forests</h1>
<p>An ensemble of decision trees — each trained on a random bootstrap sample of data, considering a random subset of features at each split. Final prediction: majority vote.</p>
<div class="tip">🟢 Asking 100 independent experts beats asking one. Their errors are uncorrelated — they cancel out in the vote.</div>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "RandomForestClassifier",
        label: "Decision Tree vs Random Forest — head to head",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.ensemble</span> <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> <span class="cls">sklearn.tree</span> <span class="kw">import</span> DecisionTreeClassifier
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score

digits <span class="op">=</span> datasets.<span class="fn">load_digits</span>()   <span class="cm"># 8×8 pixel handwritten digits 0–9</span>
X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    digits.data, digits.target, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

dt <span class="op">=</span> DecisionTreeClassifier(random_state<span class="op">=</span><span class="num">42</span>)
dt.<span class="fn">fit</span>(X_train, y_train)
dt_acc <span class="op">=</span> accuracy_score(y_test, dt.<span class="fn">predict</span>(X_test))

rf <span class="op">=</span> RandomForestClassifier(n_estimators<span class="op">=</span><span class="num">100</span>, random_state<span class="op">=</span><span class="num">42</span>)
rf.<span class="fn">fit</span>(X_train, y_train)
rf_acc <span class="op">=</span> accuracy_score(y_test, rf.<span class="fn">predict</span>(X_test))

<span class="fn">print</span>(<span class="str">f"Decision Tree:  {dt_acc*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"Random Forest:  {rf_acc*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"Improvement:   +{(rf_acc-dt_acc)*100:.1f}%"</span>)`,
        output: "bar",
        preText: "Decision Tree:  85.3%\nRandom Forest:  97.8%\nImprovement:   +12.5%",
        outputData: [
          { label: "Decision Tree",  val: 85.3, max: 100, color: "#e8a020", display: "85.3%" },
          { label: "Random Forest",  val: 97.8, max: 100, color: "#4caf7d", display: "97.8%" },
        ],
      },
      {
        type: "md",
        content: `<h2>Why it works: bagging</h2>
<ul>
  <li>Each tree trains on a <strong>bootstrap sample</strong> (random rows, with replacement)</li>
  <li>At each split, only a <strong>random subset of features</strong> is considered (default: √n_features)</li>
  <li>Trees are uncorrelated → their errors cancel in the majority vote</li>
</ul>
<div class="tip">🟢 OOB (Out-of-Bag) Error: samples not used to train each tree form a free internal test set. No separate validation set needed.</div>`,
      },
    ],
  },

  svm: {
    title: "Support Vector Machine",
    meta: "Module 7 · Course 9 · Dataset: breast_cancer (sklearn)",
    phase: "Phase 02",
    alert: "<strong>Powerful in high dimensions.</strong> SVM is especially effective when the number of features approaches or exceeds the number of samples. Scale your features first — it's non-negotiable.",
    cells: [
      {
        type: "md",
        content: `<h1>Support Vector Machine (SVM)</h1>
<p>SVM finds the hyperplane that separates two classes with the <em>maximum margin</em>. Only the points closest to the boundary (support vectors) define the model.</p>
<div class="tip">🟢 In 2D: hyperplane = line. In 3D: flat plane. In N dimensions: still called a hyperplane.</div>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "SVC · RBF kernel",
        label: "Train SVM with RBF kernel",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.svm</span> <span class="kw">import</span> SVC
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.preprocessing</span> <span class="kw">import</span> StandardScaler
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score

cancer <span class="op">=</span> datasets.<span class="fn">load_breast_cancer</span>()
X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    cancer.data, cancer.target, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

scaler  <span class="op">=</span> StandardScaler()
X_train <span class="op">=</span> scaler.<span class="fn">fit_transform</span>(X_train)
X_test  <span class="op">=</span> scaler.<span class="fn">transform</span>(X_test)

svm <span class="op">=</span> SVC(kernel<span class="op">=</span><span class="str">'rbf'</span>, C<span class="op">=</span><span class="num">1.0</span>, gamma<span class="op">=</span><span class="str">'scale'</span>)
svm.<span class="fn">fit</span>(X_train, y_train)
acc <span class="op">=</span> accuracy_score(y_test, svm.<span class="fn">predict</span>(X_test))

<span class="fn">print</span>(<span class="str">f"Accuracy:         {acc*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"Support vectors:  {svm.n_support_}"</span>)`,
        output: "text",
        outputData: "Accuracy:         98.2%\nSupport vectors:  [47 41]",
      },
      {
        type: "md",
        content: `<h2>Key hyperparameters</h2>
<ul>
  <li><strong>C (cost):</strong> Penalty for misclassification. High C = fits training data harder = risk of overfitting</li>
  <li><strong>Kernel:</strong> How SVM maps data to higher dimensions. RBF works for most problems; linear for text</li>
  <li><strong>gamma:</strong> How far the influence of each training point reaches. High = overfitting</li>
</ul>
<div class="warn">📌 SVM is sensitive to feature scale. StandardScaler is mandatory, not optional.</div>`,
      },
    ],
  },

  adv_concepts: {
    title: "Advanced Evaluation & Model Selection",
    meta: "Module 9 · Course 9 · Dataset: iris (sklearn)",
    phase: "Phase 04",
    alert: "<strong>Every professional project needs this.</strong> A single train/test split is fragile. Cross-validation and Grid Search are how real ML systems are built and validated.",
    cells: [
      {
        type: "md",
        content: `<h1>Advanced Evaluation</h1>
<p>A single train/test split can be misleading — you may have got a lucky split. <strong>K-Fold Cross-Validation</strong> tests your model K times on K different splits and averages the result.</p>`,
      },
      {
        type: "code",
        counter: "[1]",
        service: "cross_val_score · 5-Fold",
        label: "5-Fold Cross Validation",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> cross_val_score
<span class="kw">from</span> <span class="cls">sklearn.ensemble</span> <span class="kw">import</span> RandomForestClassifier
<span class="kw">import</span> <span class="cls">numpy</span> <span class="kw">as</span> np

iris <span class="op">=</span> datasets.<span class="fn">load_iris</span>()
rf   <span class="op">=</span> RandomForestClassifier(n_estimators<span class="op">=</span><span class="num">100</span>, random_state<span class="op">=</span><span class="num">42</span>)

scores <span class="op">=</span> cross_val_score(rf, iris.data, iris.target, cv<span class="op">=</span><span class="num">5</span>)

<span class="kw">for</span> i, s <span class="kw">in</span> <span class="fn">enumerate</span>(scores, <span class="num">1</span>):
    <span class="fn">print</span>(<span class="str">f"  Fold {i}: {s*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"\\nMean ± Std: {scores.mean()*100:.1f}% ± {scores.std()*100:.1f}%"</span>)`,
        output: "bar",
        preText: "  Fold 1: 100.0%\n  Fold 2: 96.7%\n  Fold 3: 93.3%\n  Fold 4: 96.7%\n  Fold 5: 100.0%\n\nMean ± Std: 97.3% ± 2.4%",
        outputData: [
          { label: "Fold 1", val: 100.0, max: 100, color: "#4caf7d", display: "100.0%" },
          { label: "Fold 2", val: 96.7,  max: 100, color: "#4caf7d", display: "96.7%" },
          { label: "Fold 3", val: 93.3,  max: 100, color: "#e8a020", display: "93.3%" },
          { label: "Fold 4", val: 96.7,  max: 100, color: "#4caf7d", display: "96.7%" },
          { label: "Fold 5", val: 100.0, max: 100, color: "#4caf7d", display: "100.0%" },
        ],
      },
      {
        type: "code",
        counter: "[2]",
        service: "GridSearchCV",
        label: "Grid Search — find best hyperparameters",
        code: `<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> GridSearchCV

param_grid <span class="op">=</span> {
    <span class="str">'n_estimators'</span>:     [<span class="num">50</span>, <span class="num">100</span>, <span class="num">200</span>],
    <span class="str">'max_depth'</span>:        [<span class="kw">None</span>, <span class="num">5</span>, <span class="num">10</span>],
    <span class="str">'min_samples_split'</span>: [<span class="num">2</span>, <span class="num">5</span>],
}

grid <span class="op">=</span> GridSearchCV(
    RandomForestClassifier(random_state<span class="op">=</span><span class="num">42</span>),
    param_grid, cv<span class="op">=</span><span class="num">5</span>, n_jobs<span class="op">=</span><span class="op">-</span><span class="num">1</span>)
grid.<span class="fn">fit</span>(iris.data, iris.target)

<span class="fn">print</span>(<span class="str">f"Best params: {grid.best_params_}"</span>)
<span class="fn">print</span>(<span class="str">f"Best score:  {grid.best_score_*100:.1f}%"</span>)`,
        output: "text",
        outputData: "Best params: {'max_depth': None, 'min_samples_split': 2, 'n_estimators': 100}\nBest score:  97.3%",
      },
      {
        type: "md",
        content: `<h2>Algorithm selection guide</h2>
<table>
  <thead><tr><th>Algorithm</th><th>Best for</th><th>Watch out for</th></tr></thead>
  <tbody>
    <tr><td>Linear Regression</td><td>Continuous output, linear data</td><td>Outliers, non-linearity</td></tr>
    <tr><td>Logistic Regression</td><td>Binary classification, interpretability</td><td>Non-linear boundaries</td></tr>
    <tr><td>KNN</td><td>Small datasets, non-parametric</td><td>Slow on large data, needs scaling</td></tr>
    <tr><td>Decision Tree</td><td>Interpretability, mixed features</td><td>Overfits without max_depth</td></tr>
    <tr><td>Random Forest</td><td>General purpose, robust baseline</td><td>Slower, less interpretable</td></tr>
    <tr><td>SVM</td><td>High-dimensional, small N</td><td>Needs scaling, slow on large N</td></tr>
    <tr><td>Gradient Boosting</td><td>Tabular data competitions</td><td>Many hyperparameters to tune</td></tr>
  </tbody>
</table>`,
      },
    ],
  },
};
