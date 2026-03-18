/* data/notebooks.js — All notebook cell definitions */

const NOTEBOOKS = {

  /* ─────────────────────────────────────────────
     MODULE 1 — What is ML?
  ───────────────────────────────────────────── */
  ml_intro: {
    title: "What is Machine Learning?",
    meta: "Module 1 · Course 7 · No dataset required",
    cells: [
      {
        type: "markdown",
        content: `<h1>Module 1 — Introduction to Machine Learning</h1>
<p>Welcome to your first notebook! This is a <strong>Markdown cell</strong> — it contains text, explanations, and formatted notes. Below you'll find <strong>Code cells</strong> where actual Python code lives.</p>
<div class="tip">🟢 <strong>Beginner tip:</strong> You don't need to memorise everything here. Focus on the <em>big picture</em> first — the code will make sense as you practice.</div>`,
      },
      {
        type: "markdown",
        content: `<h2>What is Machine Learning?</h2>
<p>Machine Learning (ML) is a way to teach computers to learn from <em>data</em> instead of being explicitly programmed with rules.</p>
<ul>
  <li><strong>Traditional programming:</strong> You write rules → computer applies them</li>
  <li><strong>Machine Learning:</strong> You give examples → computer discovers the rules</li>
</ul>
<h3>Quick analogy</h3>
<p>Imagine teaching a child what a "dog" looks like. You don't list every rule ("4 legs, fur, barks…"). You show them hundreds of photos and they <em>learn</em> the pattern. ML works the same way.</p>`,
      },
      {
        type: "code",
        counter: "[1]",
        code: `<span class="cm"># Let's explore a real dataset — the famous Iris flower dataset</span>
<span class="cm"># It contains measurements of 150 flowers across 3 species</span>

<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">import</span> <span class="cls">pandas</span> <span class="kw">as</span> pd

<span class="cm"># Load the dataset (already built into scikit-learn!)</span>
iris <span class="op">=</span> datasets.<span class="fn">load_iris</span>()

<span class="cm"># Convert to a DataFrame (a table) for easy viewing</span>
df <span class="op">=</span> pd.<span class="fn">DataFrame</span>(iris.data, columns<span class="op">=</span>iris.feature_names)
df[<span class="str">'species'</span>] <span class="op">=</span> iris.target_names[iris.target]

<span class="fn">print</span>(<span class="str">f"Dataset shape: {df.shape[0]} rows, {df.shape[1]} columns"</span>)
<span class="fn">print</span>(<span class="str">f"Species: {df['species'].unique()}"</span>)
df.<span class="fn">head</span>()`,
        output: "table",
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
        preText: "Dataset shape: 150 rows, 5 columns\nSpecies: ['setosa' 'versicolor' 'virginica']",
      },
      {
        type: "markdown",
        content: `<h2>ML vs AI — What's the difference?</h2>
<ul>
  <li><strong>Artificial Intelligence (AI)</strong> — the broad goal of making machines "smart"</li>
  <li><strong>Machine Learning (ML)</strong> — a <em>technique</em> to achieve AI by learning from data</li>
  <li><strong>Deep Learning (DL)</strong> — a subset of ML using neural networks</li>
</ul>
<div class="warn">📌 Think of it as: AI is the destination, ML is one road to get there.</div>`,
      },
      {
        type: "code",
        counter: "[2]",
        code: `<span class="cm"># Let's see why ML can classify species — the data has clear patterns!</span>

setosa     <span class="op">=</span> df[df[<span class="str">'species'</span>] <span class="op">==</span> <span class="str">'setosa'</span>]
versicolor <span class="op">=</span> df[df[<span class="str">'species'</span>] <span class="op">==</span> <span class="str">'versicolor'</span>]
virginica  <span class="op">=</span> df[df[<span class="str">'species'</span>] <span class="op">==</span> <span class="str">'virginica'</span>]

<span class="fn">print</span>(<span class="str">"Average petal length by species:"</span>)
<span class="kw">for</span> name, subset <span class="kw">in</span> [(<span class="str">'setosa'</span>, setosa), (<span class="str">'versicolor'</span>, versicolor), (<span class="str">'virginica'</span>, virginica)]:
    avg <span class="op">=</span> subset[<span class="str">'petal length (cm)'</span>].<span class="fn">mean</span>()
    <span class="fn">print</span>(<span class="str">f"  {name}: {avg:.2f} cm"</span>)`,
        output: "text",
        outputData: "Average petal length by species:\n  setosa: 1.46 cm\n  versicolor: 4.26 cm\n  virginica: 5.55 cm",
      },
      {
        type: "markdown",
        content: `<h2>Why does this matter?</h2>
<p>The petal lengths are very different across species. A machine learning model learns these patterns automatically from numbers — without us writing explicit rules.</p>
<div class="tip">🟢 <strong>Key takeaway:</strong> ML finds patterns in numbers. Your job as a data scientist is to prepare good data and choose the right algorithm.</div>`,
      },
    ],
  },

  /* ─────────────────────────────────────────────
     MODULE 3 — Simple Linear Regression
  ───────────────────────────────────────────── */
  simple_linear_reg: {
    title: "Simple Linear Regression",
    meta: "Module 3 · Course 7 · Dataset: diabetes (sklearn)",
    cells: [
      {
        type: "markdown",
        content: `<h1>Module 3 — Simple Linear Regression</h1>
<p>Linear regression finds the <em>best straight line</em> through data points. It answers: <em>"If a patient's BMI increases by 1, how much does their diabetes progression change?"</em></p>
<div class="tip">🟢 We use sklearn's built-in <code>diabetes</code> dataset — no downloads needed!</div>`,
      },
      {
        type: "markdown",
        content: `<h2>The Regression Line</h2>
<p>The equation of a regression line: <code>y = mx + c</code></p>
<ul>
  <li><code>y</code> — what we're predicting (target / dependent variable)</li>
  <li><code>x</code> — our input feature (independent variable)</li>
  <li><code>m</code> — slope (how steep the line is)</li>
  <li><code>c</code> — intercept (where the line crosses the y-axis)</li>
</ul>`,
      },
      {
        type: "code",
        counter: "[1]",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">import</span> <span class="cls">pandas</span> <span class="kw">as</span> pd

diabetes <span class="op">=</span> datasets.<span class="fn">load_diabetes</span>()
df <span class="op">=</span> pd.<span class="fn">DataFrame</span>(diabetes.data, columns<span class="op">=</span>diabetes.feature_names)
df[<span class="str">'progression'</span>] <span class="op">=</span> diabetes.target

<span class="fn">print</span>(<span class="str">"Shape:"</span>, df.shape)
<span class="fn">print</span>(<span class="str">"\\nTarget range:"</span>, df[<span class="str">'progression'</span>].<span class="fn">min</span>(), <span class="str">"—"</span>, df[<span class="str">'progression'</span>].<span class="fn">max</span>())
df.<span class="fn">head</span>(<span class="num">3</span>)`,
        output: "table",
        outputData: {
          headers: ["age","sex","bmi","bp","s1","progression"],
          rows: [
            ["0.038","0.051","0.062","-0.026","-0.044","151"],
            ["−0.002","-0.045","-0.051","-0.026","-0.034","75"],
            ["0.085","0.051","0.044","-0.006","0.003","141"],
          ],
        },
        preText: "Shape: (442, 11)\nTarget range: 25.0 — 346.0",
      },
      {
        type: "code",
        counter: "[2]",
        code: `<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.linear_model</span> <span class="kw">import</span> LinearRegression
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> mean_squared_error, r2_score
<span class="kw">import</span> <span class="cls">numpy</span> <span class="kw">as</span> np

X <span class="op">=</span> df[[<span class="str">'bmi'</span>]]   <span class="cm"># double brackets → keeps it as a DataFrame</span>
y <span class="op">=</span> df[<span class="str">'progression'</span>]

<span class="cm"># Split: 80% train, 20% test</span>
X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    X, y, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

<span class="fn">print</span>(<span class="str">f"Training samples: {X_train.shape[0]}"</span>)
<span class="fn">print</span>(<span class="str">f"Testing  samples: {X_test.shape[0]}"</span>)`,
        output: "text",
        outputData: "Training samples: 353\nTesting  samples: 89",
      },
      {
        type: "code",
        counter: "[3]",
        code: `<span class="cm"># Train the model — this is where learning happens!</span>
model <span class="op">=</span> LinearRegression()
model.<span class="fn">fit</span>(X_train, y_train)

<span class="fn">print</span>(<span class="str">f"Slope (m):     {model.coef_[0]:.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"Intercept (c): {model.intercept_:.2f}"</span>)
<span class="fn">print</span>(<span class="str">f"\\nFormula: progression = {model.coef_[0]:.1f} × bmi + {model.intercept_:.1f}"</span>)`,
        output: "text",
        outputData: "Slope (m):     949.44\nIntercept (c): 152.13\n\nFormula: progression = 949.4 × bmi + 152.1",
      },
      {
        type: "code",
        counter: "[4]",
        code: `<span class="cm"># Evaluate: how good is our model?</span>
y_pred <span class="op">=</span> model.<span class="fn">predict</span>(X_test)

r2   <span class="op">=</span> r2_score(y_test, y_pred)
rmse <span class="op">=</span> np.<span class="fn">sqrt</span>(mean_squared_error(y_test, y_pred))

<span class="fn">print</span>(<span class="str">f"R² Score: {r2:.3f}  (1.0 = perfect, 0 = useless)"</span>)
<span class="fn">print</span>(<span class="str">f"RMSE:     {rmse:.1f}  (average error in original units)"</span>)
<span class="fn">print</span>(<span class="str">"\\nSample predictions vs actual:"</span>)
<span class="kw">for</span> pred, actual <span class="kw">in</span> <span class="fn">zip</span>(y_pred[:<span class="num">4</span>], list(y_test)[:<span class="num">4</span>]):
    <span class="fn">print</span>(<span class="str">f"  Predicted: {pred:.0f}  |  Actual: {actual:.0f}"</span>)`,
        output: "bar",
        outputData: [
          { label: "R² Score",          val: 0.38, max: 1.0, color: "#1D9E75", display: "0.38" },
          { label: "Explained variance", val: 38,   max: 100, color: "#534AB7", display: "38%" },
        ],
        preText: "R² Score: 0.383  (1.0 = perfect, 0 = useless)\nRMSE:     59.8\n\nSample predictions vs actual:\n  Predicted: 177  |  Actual: 233\n  Predicted: 143  |  Actual: 91\n  Predicted: 203  |  Actual: 179\n  Predicted: 137  |  Actual: 63",
      },
      {
        type: "markdown",
        content: `<h2>Interpreting the results</h2>
<p>An R² of 0.38 means the model explains <strong>38%</strong> of variation in diabetes progression using BMI alone. Not great — but a solid starting point!</p>
<div class="tip">🟢 In Multiple Linear Regression we'll add more features and watch R² improve significantly.</div>
<div class="warn">📌 An R² of 1.0 is suspicious — it usually means <strong>overfitting</strong> (the model memorised the training data rather than learning general patterns).</div>`,
      },
    ],
  },

  /* ─────────────────────────────────────────────
     MODULE 4 — Logistic Regression
  ───────────────────────────────────────────── */
  logistic_reg: {
    title: "Logistic Regression — Binary Classifier",
    meta: "Module 4 · Course 7 · Dataset: breast_cancer (sklearn)",
    cells: [
      {
        type: "markdown",
        content: `<h1>Module 4 — Logistic Regression</h1>
<p>Logistic Regression is used when the output is a <em>category</em>, not a number. The most common use is <strong>binary classification</strong>: yes/no, spam/not-spam, malignant/benign.</p>
<div class="tip">🟢 Despite the name "regression", this is a <em>classification</em> algorithm!</div>`,
      },
      {
        type: "markdown",
        content: `<h2>The Sigmoid Curve</h2>
<p>Instead of predicting a raw number, logistic regression predicts a <em>probability</em> between 0 and 1 using the sigmoid function:</p>
<p><code>P(y=1) = 1 / (1 + e^(-z))</code></p>
<ul>
  <li>If P &gt; 0.5 → predict class 1</li>
  <li>If P ≤ 0.5 → predict class 0</li>
</ul>`,
      },
      {
        type: "code",
        counter: "[1]",
        code: `<span class="cm"># Breast Cancer Wisconsin dataset</span>
<span class="cm"># Task: predict Malignant (0) vs Benign (1)</span>

<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.preprocessing</span> <span class="kw">import</span> StandardScaler
<span class="kw">import</span> <span class="cls">pandas</span> <span class="kw">as</span> pd

cancer <span class="op">=</span> datasets.<span class="fn">load_breast_cancer</span>()
df <span class="op">=</span> pd.<span class="fn">DataFrame</span>(cancer.data, columns<span class="op">=</span>cancer.feature_names)
df[<span class="str">'target'</span>] <span class="op">=</span> cancer.target

<span class="fn">print</span>(<span class="str">f"Classes:   {cancer.target_names}"</span>)
<span class="fn">print</span>(<span class="str">f"Total:     {len(df)} samples"</span>)
<span class="fn">print</span>(<span class="str">f"Malignant: {(df.target==0).sum()}  |  Benign: {(df.target==1).sum()}"</span>)`,
        output: "text",
        outputData: "Classes:   ['malignant' 'benign']\nTotal:     569 samples\nMalignant: 212  |  Benign: 357",
      },
      {
        type: "code",
        counter: "[2]",
        code: `<span class="cm"># Feature scaling is important for logistic regression</span>
X <span class="op">=</span> cancer.data
y <span class="op">=</span> cancer.target

X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    X, y, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>, stratify<span class="op">=</span>y)

scaler  <span class="op">=</span> StandardScaler()
X_train <span class="op">=</span> scaler.<span class="fn">fit_transform</span>(X_train)
X_test  <span class="op">=</span> scaler.<span class="fn">transform</span>(X_test)  <span class="cm"># NEVER fit on test data!</span>

<span class="fn">print</span>(<span class="str">"Scaled successfully ✓"</span>)
<span class="fn">print</span>(<span class="str">f"Train: {X_train.shape[0]}  |  Test: {X_test.shape[0]}"</span>)`,
        output: "text",
        outputData: "Scaled successfully ✓\nTrain: 455  |  Test: 114",
      },
      {
        type: "code",
        counter: "[3]",
        code: `<span class="kw">from</span> <span class="cls">sklearn.linear_model</span> <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score, confusion_matrix

log_model <span class="op">=</span> LogisticRegression(max_iter<span class="op">=</span><span class="num">1000</span>)
log_model.<span class="fn">fit</span>(X_train, y_train)

y_pred <span class="op">=</span> log_model.<span class="fn">predict</span>(X_test)

<span class="fn">print</span>(<span class="str">f"Accuracy: {accuracy_score(y_test, y_pred)*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">"\\nConfusion Matrix:"</span>)
<span class="fn">print</span>(confusion_matrix(y_test, y_pred))`,
        output: "text",
        outputData: "Accuracy: 97.4%\n\nConfusion Matrix:\n[[40  3]\n [ 0 71]]\n\nTP=40, FP=3, FN=0, TN=71",
      },
      {
        type: "markdown",
        content: `<h2>Reading the Confusion Matrix</h2>
<table>
  <thead><tr><th></th><th>Predicted Malignant</th><th>Predicted Benign</th></tr></thead>
  <tbody>
    <tr><td>Actual Malignant</td><td style="color:#0F6E56">40 ✓ True Positive</td><td style="color:#A32D2D">3 ✗ False Negative</td></tr>
    <tr><td>Actual Benign</td><td style="color:#A32D2D">0 ✗ False Positive</td><td style="color:#0F6E56">71 ✓ True Negative</td></tr>
  </tbody>
</table>
<div class="warn">📌 In medical diagnosis, <strong>False Negatives</strong> are dangerous — we predicted benign but it's malignant. Always check recall (sensitivity), not just accuracy!</div>`,
      },
    ],
  },

  /* ─────────────────────────────────────────────
     MODULE 5 — KNN
  ───────────────────────────────────────────── */
  knn: {
    title: "K-Nearest Neighbors (KNN)",
    meta: "Module 5 · Course 7 · Dataset: wine (sklearn)",
    cells: [
      {
        type: "markdown",
        content: `<h1>Module 5 — K-Nearest Neighbors</h1>
<p>KNN is one of the most intuitive ML algorithms: <em>"You are judged by the company you keep."</em></p>
<p>To classify a new point, look at the K closest points in training data and take a <strong>majority vote</strong>.</p>
<div class="tip">🟢 KNN is called a "lazy learner" — it does no work during training, only during prediction.</div>`,
      },
      {
        type: "code",
        counter: "[1]",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.preprocessing</span> <span class="kw">import</span> StandardScaler
<span class="kw">from</span> <span class="cls">sklearn.neighbors</span> <span class="kw">import</span> KNeighborsClassifier
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score
<span class="kw">import</span> <span class="cls">numpy</span> <span class="kw">as</span> np

wine <span class="op">=</span> datasets.<span class="fn">load_wine</span>()
X, y <span class="op">=</span> wine.data, wine.target

X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    X, y, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

scaler  <span class="op">=</span> StandardScaler()
X_train <span class="op">=</span> scaler.<span class="fn">fit_transform</span>(X_train)
X_test  <span class="op">=</span> scaler.<span class="fn">transform</span>(X_test)

<span class="fn">print</span>(<span class="str">f"Wine dataset: {wine.data.shape[0]} samples, {wine.data.shape[1]} features"</span>)
<span class="fn">print</span>(<span class="str">f"Classes: {wine.target_names}"</span>)`,
        output: "text",
        outputData: "Wine dataset: 178 samples, 13 features\nClasses: ['class_0' 'class_1' 'class_2']",
      },
      {
        type: "code",
        counter: "[2]",
        code: `<span class="cm"># Try different values of K and see which performs best</span>
k_values  <span class="op">=</span> [<span class="num">1</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">9</span>, <span class="num">11</span>]
accuracies <span class="op">=</span> []

<span class="kw">for</span> k <span class="kw">in</span> k_values:
    knn <span class="op">=</span> KNeighborsClassifier(n_neighbors<span class="op">=</span>k)
    knn.<span class="fn">fit</span>(X_train, y_train)
    acc <span class="op">=</span> accuracy_score(y_test, knn.<span class="fn">predict</span>(X_test))
    accuracies.<span class="fn">append</span>(acc)
    <span class="fn">print</span>(<span class="str">f"K={k}  →  Accuracy: {acc*100:.1f}%"</span>)

best_k <span class="op">=</span> k_values[np.<span class="fn">argmax</span>(accuracies)]
<span class="fn">print</span>(<span class="str">f"\\nBest K = {best_k} with accuracy {max(accuracies)*100:.1f}%"</span>)`,
        output: "bar",
        outputData: [
          { label: "K=1",  val: 94.4, max: 100, color: "#B4B2A9", display: "94.4%" },
          { label: "K=3",  val: 97.2, max: 100, color: "#1D9E75", display: "97.2%" },
          { label: "K=5",  val: 97.2, max: 100, color: "#1D9E75", display: "97.2%" },
          { label: "K=7",  val: 94.4, max: 100, color: "#B4B2A9", display: "94.4%" },
          { label: "K=9",  val: 91.7, max: 100, color: "#EF9F27", display: "91.7%" },
          { label: "K=11", val: 88.9, max: 100, color: "#EF9F27", display: "88.9%" },
        ],
        preText: "K=1  →  Accuracy: 94.4%\nK=3  →  Accuracy: 97.2%\nK=5  →  Accuracy: 97.2%\nK=7  →  Accuracy: 94.4%\nK=9  →  Accuracy: 91.7%\nK=11 →  Accuracy: 88.9%\n\nBest K = 3 with accuracy 97.2%",
      },
      {
        type: "markdown",
        content: `<h2>Key insight: choosing K</h2>
<ul>
  <li><strong>K too small (K=1):</strong> Overfits — too sensitive to noise</li>
  <li><strong>K too large:</strong> Underfits — blurs boundaries between classes</li>
  <li><strong>Rule of thumb:</strong> Start with K = √(number of samples), then tune</li>
</ul>
<div class="tip">🟢 Always scale your features before using KNN — it relies on <em>distances</em>, so large unscaled features will dominate.</div>`,
      },
    ],
  },

  /* ─────────────────────────────────────────────
     MODULE 6 — K-Means Clustering
  ───────────────────────────────────────────── */
  kmeans: {
    title: "K-Means Clustering — Iris Dataset",
    meta: "Module 6 · Course 7 · Dataset: iris (sklearn)",
    cells: [
      {
        type: "markdown",
        content: `<h1>Module 6 — K-Means Clustering</h1>
<p>Clustering is <strong>unsupervised</strong> learning — there are no labels! We let the algorithm discover natural groupings.</p>
<p>K-Means algorithm steps:</p>
<ol style="padding-left:18px;font-size:13px;line-height:1.9">
  <li>Randomly place K centroids (cluster centres)</li>
  <li>Assign each point to the nearest centroid</li>
  <li>Move centroids to the mean of their assigned points</li>
  <li>Repeat steps 2–3 until centroids stop moving</li>
</ol>`,
      },
      {
        type: "code",
        counter: "[1]",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.cluster</span> <span class="kw">import</span> KMeans
<span class="kw">from</span> <span class="cls">sklearn.preprocessing</span> <span class="kw">import</span> StandardScaler
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> adjusted_rand_score
<span class="kw">import</span> <span class="cls">numpy</span> <span class="kw">as</span> np

iris   <span class="op">=</span> datasets.<span class="fn">load_iris</span>()
X      <span class="op">=</span> iris.data
y_true <span class="op">=</span> iris.target  <span class="cm"># only used to evaluate, NOT to train!</span>

scaler   <span class="op">=</span> StandardScaler()
X_scaled <span class="op">=</span> scaler.<span class="fn">fit_transform</span>(X)

<span class="fn">print</span>(<span class="str">"Data loaded and scaled ✓"</span>)
<span class="fn">print</span>(<span class="str">f"Shape: {X_scaled.shape}"</span>)`,
        output: "text",
        outputData: "Data loaded and scaled ✓\nShape: (150, 4)",
      },
      {
        type: "code",
        counter: "[2]",
        code: `<span class="cm"># Elbow Method — find the optimal number of clusters</span>
inertias <span class="op">=</span> []

<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="num">9</span>):
    km <span class="op">=</span> KMeans(n_clusters<span class="op">=</span>k, random_state<span class="op">=</span><span class="num">42</span>, n_init<span class="op">=</span><span class="num">10</span>)
    km.<span class="fn">fit</span>(X_scaled)
    inertias.<span class="fn">append</span>(km.inertia_)
    <span class="fn">print</span>(<span class="str">f"K={k}  inertia={km.inertia_:.1f}"</span>)

<span class="fn">print</span>(<span class="str">"\\n→ Look for the elbow — where improvement slows down"</span>)`,
        output: "bar",
        outputData: [
          { label: "K=1", val: 597, max: 600, color: "#E24B4A", display: "597" },
          { label: "K=2", val: 260, max: 600, color: "#EF9F27", display: "260" },
          { label: "K=3", val: 139, max: 600, color: "#1D9E75", display: "139 ← elbow" },
          { label: "K=4", val: 113, max: 600, color: "#B4B2A9", display: "113" },
          { label: "K=5", val: 93,  max: 600, color: "#B4B2A9", display: "93" },
        ],
        preText: "K=1  inertia=597.4\nK=2  inertia=260.1\nK=3  inertia=139.8 ← elbow!\nK=4  inertia=113.3\nK=5  inertia=93.2",
      },
      {
        type: "code",
        counter: "[3]",
        code: `<span class="cm"># Train final model with K=3</span>
kmeans <span class="op">=</span> KMeans(n_clusters<span class="op">=</span><span class="num">3</span>, random_state<span class="op">=</span><span class="num">42</span>, n_init<span class="op">=</span><span class="num">10</span>)
kmeans.<span class="fn">fit</span>(X_scaled)
labels <span class="op">=</span> kmeans.labels_

ars <span class="op">=</span> adjusted_rand_score(y_true, labels)
<span class="fn">print</span>(<span class="str">f"Cluster sizes: {np.bincount(labels)}"</span>)
<span class="fn">print</span>(<span class="str">f"Adjusted Rand Score: {ars:.3f}  (1.0=perfect, 0=random)"</span>)
<span class="fn">print</span>(<span class="str">f"\\nWithout any labels, K-Means matched true species with {ars*100:.0f}% accuracy!"</span>)`,
        output: "text",
        outputData: "Cluster sizes: [50 47 53]\nAdjusted Rand Score: 0.730  (1.0=perfect, 0=random)\n\nWithout any labels, K-Means matched true species with 73% accuracy!",
      },
      {
        type: "markdown",
        content: `<h2>Amazing result!</h2>
<p>Without ever seeing the species labels, K-Means found groupings <strong>73% aligned</strong> with actual flower species. This is the power of unsupervised learning.</p>
<div class="tip">🟢 The elbow at K=3 matches the true number of species. Real-world datasets aren't always this clean, but the elbow method is a reliable starting point.</div>`,
      },
    ],
  },

  /* ─────────────────────────────────────────────
     COURSE 8 — Decision Trees
  ───────────────────────────────────────────── */
  decision_tree: {
    title: "Decision Trees (CART)",
    meta: "Module 1–3 · Course 8 · Dataset: iris (sklearn)",
    cells: [
      {
        type: "markdown",
        content: `<h1>Course 8 — Decision Trees</h1>
<p>A Decision Tree is like a flowchart of questions. At each node the tree asks a question about a feature. It keeps splitting until it reaches a leaf (final decision).</p>
<div class="tip">🟢 Decision trees are highly interpretable — you can read them like a doctor's diagnostic guide!</div>`,
      },
      {
        type: "code",
        counter: "[1]",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.tree</span> <span class="kw">import</span> DecisionTreeClassifier
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score

iris <span class="op">=</span> datasets.<span class="fn">load_iris</span>()
X, y <span class="op">=</span> iris.data, iris.target

X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    X, y, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

<span class="cm"># max_depth limits tree depth and prevents overfitting</span>
dt <span class="op">=</span> DecisionTreeClassifier(max_depth<span class="op">=</span><span class="num">3</span>, criterion<span class="op">=</span><span class="str">'gini'</span>, random_state<span class="op">=</span><span class="num">42</span>)
dt.<span class="fn">fit</span>(X_train, y_train)

acc <span class="op">=</span> accuracy_score(y_test, dt.<span class="fn">predict</span>(X_test))
<span class="fn">print</span>(<span class="str">f"Accuracy (depth=3): {acc*100:.1f}%"</span>)`,
        output: "text",
        outputData: "Accuracy (depth=3): 100.0%",
      },
      {
        type: "code",
        counter: "[2]",
        code: `<span class="cm"># Feature Importance — which features does the tree rely on?</span>
feature_names <span class="op">=</span> iris.feature_names
importances   <span class="op">=</span> dt.feature_importances_

<span class="fn">print</span>(<span class="str">"Feature importances:"</span>)
<span class="kw">for</span> name, imp <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feature_names, importances),
                        key<span class="op">=</span><span class="kw">lambda</span> x: x[<span class="num">1</span>], reverse<span class="op">=</span><span class="kw">True</span>):
    bar <span class="op">=</span> <span class="str">'█'</span> <span class="op">*</span> <span class="fn">int</span>(imp <span class="op">*</span> <span class="num">40</span>)
    <span class="fn">print</span>(<span class="str">f"  {name:<30} {imp:.3f}  {bar}"</span>)`,
        output: "bar",
        outputData: [
          { label: "petal length (cm)", val: 0.561, max: 1, color: "#1D9E75", display: "0.561" },
          { label: "petal width (cm)",  val: 0.435, max: 1, color: "#534AB7", display: "0.435" },
          { label: "sepal length (cm)", val: 0.004, max: 1, color: "#B4B2A9", display: "0.004" },
          { label: "sepal width (cm)",  val: 0.000, max: 1, color: "#B4B2A9", display: "0.000" },
        ],
        preText: "Feature importances:",
      },
      {
        type: "markdown",
        content: `<h2>Key concepts</h2>
<ul>
  <li><strong>Gini Index:</strong> Measures node "impurity". Lower = purer = better split. Range: 0 (pure) to 0.5 (50/50 mix)</li>
  <li><strong>Entropy / Info Gain:</strong> Another splitting criterion from information theory</li>
  <li><strong>max_depth:</strong> Most important hyperparameter — controls overfitting</li>
  <li><strong>Feature Importance:</strong> How much each feature contributed to splits</li>
</ul>
<div class="warn">📌 Without <code>max_depth</code> limits, a decision tree will perfectly memorise training data (overfit). Always tune this!</div>`,
      },
    ],
  },

  /* ─────────────────────────────────────────────
     COURSE 8 — Random Forest
  ───────────────────────────────────────────── */
  random_forest: {
    title: "Random Forest & Ensemble Bagging",
    meta: "Module 4 · Course 8 · Dataset: digits (sklearn)",
    cells: [
      {
        type: "markdown",
        content: `<h1>Module 4 — Random Forests</h1>
<p>A Random Forest is an <em>ensemble</em> of decision trees. Each tree is trained on a random subset of data, then they <strong>vote together</strong>. This is called <strong>Bagging</strong> (Bootstrap Aggregating).</p>
<p>Why does this help? Asking 100 independent experts is more reliable than asking one — their collective errors cancel out.</p>`,
      },
      {
        type: "code",
        counter: "[1]",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.ensemble</span> <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> <span class="cls">sklearn.tree</span> <span class="kw">import</span> DecisionTreeClassifier
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> train_test_split
<span class="kw">from</span> <span class="cls">sklearn.metrics</span> <span class="kw">import</span> accuracy_score

digits <span class="op">=</span> datasets.<span class="fn">load_digits</span>()  <span class="cm"># 8×8 pixel handwritten digits 0–9</span>
X, y   <span class="op">=</span> digits.data, digits.target

X_train, X_test, y_train, y_test <span class="op">=</span> train_test_split(
    X, y, test_size<span class="op">=</span><span class="num">0.2</span>, random_state<span class="op">=</span><span class="num">42</span>)

dt <span class="op">=</span> DecisionTreeClassifier(random_state<span class="op">=</span><span class="num">42</span>)
dt.<span class="fn">fit</span>(X_train, y_train)
dt_acc <span class="op">=</span> accuracy_score(y_test, dt.<span class="fn">predict</span>(X_test))

rf <span class="op">=</span> RandomForestClassifier(n_estimators<span class="op">=</span><span class="num">100</span>, random_state<span class="op">=</span><span class="num">42</span>)
rf.<span class="fn">fit</span>(X_train, y_train)
rf_acc <span class="op">=</span> accuracy_score(y_test, rf.<span class="fn">predict</span>(X_test))

<span class="fn">print</span>(<span class="str">f"Single Decision Tree: {dt_acc*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"Random Forest (100):  {rf_acc*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"Improvement:          +{(rf_acc-dt_acc)*100:.1f}%"</span>)`,
        output: "bar",
        outputData: [
          { label: "Decision Tree",    val: 85.3, max: 100, color: "#EF9F27", display: "85.3%" },
          { label: "Random Forest",    val: 97.8, max: 100, color: "#1D9E75", display: "97.8%" },
        ],
        preText: "Single Decision Tree: 85.3%\nRandom Forest (100):  97.8%\nImprovement:          +12.5%",
      },
      {
        type: "markdown",
        content: `<h2>Why Random Forest beats a single tree</h2>
<ul>
  <li>Each tree sees a <strong>random bootstrap sample</strong> of training data (with replacement)</li>
  <li>At each split, only a <strong>random subset of features</strong> is considered</li>
  <li>This diversity means trees make <em>different</em> errors — they cancel each other out</li>
</ul>
<div class="tip">🟢 <strong>OOB Error:</strong> Samples not used to train each tree form a free validation set — Random Forest estimates its own error without needing a separate test set!</div>`,
      },
    ],
  },

  /* ─────────────────────────────────────────────
     COURSE 9 — SVM
  ───────────────────────────────────────────── */
  svm: {
    title: "Support Vector Machine (SVM)",
    meta: "Module 7 · Course 9 · Dataset: breast_cancer (sklearn)",
    cells: [
      {
        type: "markdown",
        content: `<h1>Module 7 — Support Vector Machine</h1>
<p>SVM finds a <strong>hyperplane</strong> that separates two classes with the <em>maximum margin</em>. The points closest to the boundary are called <strong>support vectors</strong>.</p>
<div class="tip">🟢 In 2D a hyperplane is a line. In 3D it's a flat plane. In higher dimensions it's still called a hyperplane.</div>`,
      },
      {
        type: "code",
        counter: "[1]",
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
<span class="fn">print</span>(<span class="str">f"SVM (RBF kernel) Accuracy: {acc*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"Support vectors: {svm.n_support_}"</span>)`,
        output: "text",
        outputData: "SVM (RBF kernel) Accuracy: 98.2%\nSupport vectors: [47 41]",
      },
      {
        type: "markdown",
        content: `<h2>Key SVM concepts</h2>
<ul>
  <li><strong>C (cost):</strong> Penalises misclassification. High C = harder fitting = risk of overfitting</li>
  <li><strong>Kernel trick:</strong> Maps data to higher dimensions where it becomes linearly separable</li>
  <li><strong>RBF kernel:</strong> Most common — works well for most classification tasks</li>
  <li><strong>Support vectors:</strong> Only the critical boundary points matter; removing others won't change the model</li>
</ul>
<div class="warn">📌 SVM requires <strong>feature scaling</strong> — highly sensitive to feature magnitudes.</div>`,
      },
    ],
  },

  /* ─────────────────────────────────────────────
     COURSE 9 — Advanced Evaluation
  ───────────────────────────────────────────── */
  adv_concepts: {
    title: "Advanced ML Concepts & Evaluation",
    meta: "Module 9 · Course 9 · Cross-validation & Grid Search",
    cells: [
      {
        type: "markdown",
        content: `<h1>Module 9 — Advanced Evaluation</h1>
<p>A single train/test split can be misleading. What if you got a "lucky" split? <strong>K-Fold Cross-Validation</strong> solves this by testing your model K different times on K different data splits.</p>`,
      },
      {
        type: "code",
        counter: "[1]",
        code: `<span class="kw">from</span> <span class="cls">sklearn</span> <span class="kw">import</span> datasets
<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> cross_val_score
<span class="kw">from</span> <span class="cls">sklearn.ensemble</span> <span class="kw">import</span> RandomForestClassifier
<span class="kw">import</span> <span class="cls">numpy</span> <span class="kw">as</span> np

iris <span class="op">=</span> datasets.<span class="fn">load_iris</span>()
X, y <span class="op">=</span> iris.data, iris.target

rf <span class="op">=</span> RandomForestClassifier(n_estimators<span class="op">=</span><span class="num">100</span>, random_state<span class="op">=</span><span class="num">42</span>)

<span class="cm"># 5-Fold CV: splits data into 5 parts, trains/tests 5 times</span>
scores <span class="op">=</span> cross_val_score(rf, X, y, cv<span class="op">=</span><span class="num">5</span>, scoring<span class="op">=</span><span class="str">'accuracy'</span>)

<span class="fn">print</span>(<span class="str">"5-Fold CV scores:"</span>)
<span class="kw">for</span> i, s <span class="kw">in</span> <span class="fn">enumerate</span>(scores, <span class="num">1</span>):
    <span class="fn">print</span>(<span class="str">f"  Fold {i}: {s*100:.1f}%"</span>)
<span class="fn">print</span>(<span class="str">f"\\nMean: {scores.mean()*100:.1f}% ± {scores.std()*100:.1f}%"</span>)`,
        output: "bar",
        outputData: [
          { label: "Fold 1", val: 100.0, max: 100, color: "#1D9E75", display: "100%" },
          { label: "Fold 2", val: 96.7,  max: 100, color: "#1D9E75", display: "96.7%" },
          { label: "Fold 3", val: 93.3,  max: 100, color: "#1D9E75", display: "93.3%" },
          { label: "Fold 4", val: 96.7,  max: 100, color: "#1D9E75", display: "96.7%" },
          { label: "Fold 5", val: 100.0, max: 100, color: "#1D9E75", display: "100%" },
        ],
        preText: "5-Fold CV scores:\n  Fold 1: 100.0%\n  Fold 2: 96.7%\n  Fold 3: 93.3%\n  Fold 4: 96.7%\n  Fold 5: 100.0%\n\nMean: 97.3% ± 2.4%",
      },
      {
        type: "code",
        counter: "[2]",
        code: `<span class="kw">from</span> <span class="cls">sklearn.model_selection</span> <span class="kw">import</span> GridSearchCV

<span class="cm"># Grid Search: try ALL combinations of hyperparameters</span>
param_grid <span class="op">=</span> {
    <span class="str">'n_estimators'</span>:    [<span class="num">50</span>, <span class="num">100</span>, <span class="num">200</span>],
    <span class="str">'max_depth'</span>:       [<span class="kw">None</span>, <span class="num">5</span>, <span class="num">10</span>],
    <span class="str">'min_samples_split'</span>: [<span class="num">2</span>, <span class="num">5</span>],
}

grid_search <span class="op">=</span> GridSearchCV(
    RandomForestClassifier(random_state<span class="op">=</span><span class="num">42</span>),
    param_grid, cv<span class="op">=</span><span class="num">5</span>, scoring<span class="op">=</span><span class="str">'accuracy'</span>, n_jobs<span class="op">=</span><span class="op">-</span><span class="num">1</span>)

grid_search.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(<span class="str">f"Best params: {grid_search.best_params_}"</span>)
<span class="fn">print</span>(<span class="str">f"Best score:  {grid_search.best_score_*100:.1f}%"</span>)`,
        output: "text",
        outputData: "Best params: {'max_depth': None, 'min_samples_split': 2, 'n_estimators': 100}\nBest score:  97.3%",
      },
      {
        type: "markdown",
        content: `<h2>Algorithm cheat sheet</h2>
<table>
  <thead><tr><th>Algorithm</th><th>Best for</th><th>Watch out for</th></tr></thead>
  <tbody>
    <tr><td>Linear Regression</td><td>Continuous output, linear data</td><td>Outliers, non-linearity</td></tr>
    <tr><td>Logistic Regression</td><td>Binary classification, interpretability</td><td>Non-linear boundaries</td></tr>
    <tr><td>KNN</td><td>Small datasets, no training needed</td><td>Slow on large data</td></tr>
    <tr><td>Decision Tree</td><td>Interpretability, mixed features</td><td>Overfits easily</td></tr>
    <tr><td>Random Forest</td><td>General purpose, robust</td><td>Less interpretable</td></tr>
    <tr><td>SVM</td><td>High-dimensional data</td><td>Needs scaling, slow on large N</td></tr>
  </tbody>
</table>`,
      },
    ],
  },
};
