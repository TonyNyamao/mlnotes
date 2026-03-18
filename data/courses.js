/* data/courses.js — Course & module structure */

const COURSES = {
  0: {
    label: "Course 7 — ML Associate",
    modules: [
      {
        title: "Module 1",
        notebooks: [
          { id: "ml_intro",    title: "What is ML? ML vs AI",        icon: "01", color: "#E1F5EE", iconColor: "#0F6E56", badge: "Intro", badgeBg: "#E1F5EE", badgeColor: "#0F6E56" },
          { id: "ml_workflow", title: "ML Workflow & Applications",   icon: "02", color: "#E1F5EE", iconColor: "#0F6E56", badge: "Intro", badgeBg: "#E1F5EE", badgeColor: "#0F6E56" },
        ],
      },
      {
        title: "Module 2",
        notebooks: [
          { id: "ml_algorithms",           title: "Popular ML Algorithms",      icon: "03", color: "#EEEDFE", iconColor: "#534AB7", badge: "Theory", badgeBg: "#EEEDFE", badgeColor: "#534AB7" },
          { id: "supervised_vs_unsupervised", title: "Supervised vs Unsupervised", icon: "04", color: "#EEEDFE", iconColor: "#534AB7", badge: "Theory", badgeBg: "#EEEDFE", badgeColor: "#534AB7" },
        ],
      },
      {
        title: "Module 3",
        notebooks: [
          { id: "simple_linear_reg",   title: "Simple Linear Regression",   icon: "05", color: "#FAEEDA", iconColor: "#854F0B", badge: "Lab", badgeBg: "#FAEEDA", badgeColor: "#854F0B" },
          { id: "multiple_linear_reg", title: "Multiple Linear Regression",  icon: "06", color: "#FAEEDA", iconColor: "#854F0B", badge: "Lab", badgeBg: "#FAEEDA", badgeColor: "#854F0B" },
        ],
      },
      {
        title: "Module 4",
        notebooks: [
          { id: "logistic_reg",   title: "Logistic Regression & Binary Classifier",    icon: "07", color: "#FAECE7", iconColor: "#993C1D", badge: "Lab", badgeBg: "#FAECE7", badgeColor: "#993C1D" },
          { id: "log_model_eval", title: "Model Evaluation: ROC, Precision, Recall", icon: "08", color: "#FAECE7", iconColor: "#993C1D", badge: "Lab", badgeBg: "#FAECE7", badgeColor: "#993C1D" },
        ],
      },
      {
        title: "Module 5",
        notebooks: [
          { id: "knn", title: "K-Nearest Neighbors (KNN)", icon: "09", color: "#E6F1FB", iconColor: "#185FA5", badge: "Lab", badgeBg: "#E6F1FB", badgeColor: "#185FA5" },
        ],
      },
      {
        title: "Module 6",
        notebooks: [
          { id: "kmeans", title: "K-Means Clustering (Iris)", icon: "10", color: "#EAF3DE", iconColor: "#3B6D11", badge: "Lab", badgeBg: "#EAF3DE", badgeColor: "#3B6D11" },
        ],
      },
      {
        title: "Module 7",
        notebooks: [
          { id: "hierarchical", title: "Hierarchical Clustering", icon: "11", color: "#EAF3DE", iconColor: "#3B6D11", badge: "Lab", badgeBg: "#EAF3DE", badgeColor: "#3B6D11" },
        ],
      },
      {
        title: "Module 8",
        notebooks: [
          { id: "pca", title: "PCA — Dimensionality Reduction", icon: "12", color: "#EEEDFE", iconColor: "#3C3489", badge: "Lab", badgeBg: "#EEEDFE", badgeColor: "#3C3489" },
        ],
      },
    ],
  },

  1: {
    label: "Course 8 — Advanced ML",
    modules: [
      {
        title: "Module 1–3",
        notebooks: [
          { id: "decision_tree", title: "Decision Trees (CART)",                    icon: "13", color: "#FAEEDA", iconColor: "#854F0B", badge: "Adv", badgeBg: "#FAEEDA", badgeColor: "#854F0B" },
          { id: "dt_tuning",     title: "Decision Tree Hyperparameter Tuning",      icon: "14", color: "#FAEEDA", iconColor: "#854F0B", badge: "Adv", badgeBg: "#FAEEDA", badgeColor: "#854F0B" },
        ],
      },
      {
        title: "Module 4",
        notebooks: [
          { id: "random_forest", title: "Random Forest & Bagging", icon: "15", color: "#E1F5EE", iconColor: "#0F6E56", badge: "Adv", badgeBg: "#E1F5EE", badgeColor: "#0F6E56" },
        ],
      },
      {
        title: "Module 5",
        notebooks: [
          { id: "naive_bayes", title: "Naïve Bayes & Spam Classifier", icon: "16", color: "#EEEDFE", iconColor: "#534AB7", badge: "Adv", badgeBg: "#EEEDFE", badgeColor: "#534AB7" },
        ],
      },
    ],
  },

  2: {
    label: "Course 9 — Advanced ML II",
    modules: [
      {
        title: "Module 6",
        notebooks: [
          { id: "boosting", title: "Boosting: AdaBoost & Gradient Boosting", icon: "17", color: "#FAECE7", iconColor: "#993C1D", badge: "Adv", badgeBg: "#FAECE7", badgeColor: "#993C1D" },
        ],
      },
      {
        title: "Module 7",
        notebooks: [
          { id: "svm", title: "Support Vector Machine (SVM)", icon: "18", color: "#E6F1FB", iconColor: "#185FA5", badge: "Adv", badgeBg: "#E6F1FB", badgeColor: "#185FA5" },
        ],
      },
      {
        title: "Module 8",
        notebooks: [
          { id: "ann", title: "Artificial Neural Networks (ANN)", icon: "19", color: "#FAEEDA", iconColor: "#854F0B", badge: "Adv", badgeBg: "#FAEEDA", badgeColor: "#854F0B" },
        ],
      },
      {
        title: "Module 9",
        notebooks: [
          { id: "adv_concepts", title: "Advanced ML Concepts & Evaluation", icon: "20", color: "#EAF3DE", iconColor: "#3B6D11", badge: "Adv", badgeBg: "#EAF3DE", badgeColor: "#3B6D11" },
        ],
      },
    ],
  },
};
