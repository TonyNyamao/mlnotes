/* data/courses.js */

const COURSES = [
  {
    id: "c7",
    tabLabel: "01 Foundation",
    heroTitle: "Machine Learning Associate — Course 7",
    heroDesc: "From What is ML? through to PCA. All algorithms built on scikit-learn built-in datasets with zero downloads required.",
    alertText: "<strong>Start here.</strong> Every subsequent module builds on concepts introduced in Modules 1–3. Don't skip the theory cells — they explain the 'why' behind each line of code.",
    modules: [
      {
        navLabel: "Module 1 — Introduction",
        notebooks: [
          { id: "ml_intro",    label: "What is ML? ML vs AI",       service: "sklearn · pandas",     phase: "Phase 01" },
          { id: "ml_workflow", label: "ML Workflow & Applications",  service: "sklearn · numpy",      phase: "Phase 01" },
        ],
      },
      {
        navLabel: "Module 2 — Algorithms",
        notebooks: [
          { id: "ml_algorithms",            label: "Popular ML Algorithms",       service: "Theory",           phase: "Phase 02" },
          { id: "supervised_vs_unsupervised",label: "Supervised vs Unsupervised", service: "Theory",           phase: "Phase 02" },
        ],
      },
      {
        navLabel: "Module 3 — Linear Reg",
        notebooks: [
          { id: "simple_linear_reg",   label: "Simple Linear Regression",   service: "diabetes dataset",  phase: "Phase 03" },
          { id: "multiple_linear_reg", label: "Multiple Linear Regression",  service: "diabetes dataset",  phase: "Phase 03" },
        ],
      },
      {
        navLabel: "Module 4 — Logistic",
        notebooks: [
          { id: "logistic_reg",   label: "Logistic Regression",          service: "breast_cancer",    phase: "Phase 04" },
          { id: "log_model_eval", label: "Model Evaluation: ROC · AUC",  service: "breast_cancer",    phase: "Phase 04" },
        ],
      },
      {
        navLabel: "Module 5 — KNN",
        notebooks: [
          { id: "knn", label: "K-Nearest Neighbors (KNN)", service: "wine dataset", phase: "Phase 05" },
        ],
      },
      {
        navLabel: "Module 6 — K-Means",
        notebooks: [
          { id: "kmeans", label: "K-Means Clustering", service: "iris dataset", phase: "Phase 06" },
        ],
      },
      {
        navLabel: "Module 7 — Hierarchical",
        notebooks: [
          { id: "hierarchical", label: "Hierarchical Clustering", service: "iris dataset", phase: "Phase 07" },
        ],
      },
      {
        navLabel: "Module 8 — PCA",
        notebooks: [
          { id: "pca", label: "PCA — Dimensionality Reduction", service: "digits dataset", phase: "Phase 08" },
        ],
      },
    ],
  },
  {
    id: "c8",
    tabLabel: "02 Ingestion",
    heroTitle: "Advanced Machine Learning — Course 8",
    heroDesc: "Decision Trees, Random Forests, and Naïve Bayes. Tree-based methods and probabilistic classifiers on real sklearn datasets.",
    alertText: "<strong>Prerequisites.</strong> Course 7 is strongly recommended before starting Course 8. You should be comfortable with train/test splits, feature scaling, and reading a confusion matrix.",
    modules: [
      {
        navLabel: "Modules 1–3 — Trees",
        notebooks: [
          { id: "decision_tree", label: "Decision Trees (CART)",              service: "iris dataset",   phase: "Phase 01" },
          { id: "dt_tuning",     label: "Hyperparameter Tuning",              service: "iris dataset",   phase: "Phase 02" },
        ],
      },
      {
        navLabel: "Module 4 — Ensemble",
        notebooks: [
          { id: "random_forest", label: "Random Forest & Bagging", service: "digits dataset", phase: "Phase 03" },
        ],
      },
      {
        navLabel: "Module 5 — Naïve Bayes",
        notebooks: [
          { id: "naive_bayes", label: "Naïve Bayes & Spam Classifier", service: "fetch_20newsgroups", phase: "Phase 04" },
        ],
      },
    ],
  },
  {
    id: "c9",
    tabLabel: "03 Processing",
    heroTitle: "Advanced Machine Learning II — Course 9",
    heroDesc: "Boosting, SVMs, Neural Networks, and advanced evaluation. The full professional ML toolkit used in industry.",
    alertText: "<strong>Capstone tier.</strong> These notebooks assume solid understanding of Courses 7 and 8. Focus especially on cross-validation and GridSearchCV — every professional ML project needs them.",
    modules: [
      {
        navLabel: "Module 6 — Boosting",
        notebooks: [
          { id: "boosting", label: "AdaBoost & Gradient Boosting", service: "breast_cancer", phase: "Phase 01" },
        ],
      },
      {
        navLabel: "Module 7 — SVM",
        notebooks: [
          { id: "svm", label: "Support Vector Machine (SVM)", service: "breast_cancer", phase: "Phase 02" },
        ],
      },
      {
        navLabel: "Module 8 — ANN",
        notebooks: [
          { id: "ann", label: "Artificial Neural Networks", service: "digits dataset", phase: "Phase 03" },
        ],
      },
      {
        navLabel: "Module 9 — Evaluation",
        notebooks: [
          { id: "adv_concepts", label: "Advanced Evaluation & Selection", service: "iris dataset", phase: "Phase 04" },
        ],
      },
    ],
  },
];
