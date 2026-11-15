# Bank Customer Churn: Exploratory Analysis & Baseline Prediction

**Data Science Intern Portfolio Project**  
**Tools:** Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn

## Project Overview

Customer churn is an important business problem for banks: when customers leave, the bank may lose future revenue and opportunities to build long-term relationships.

In this project, I explore a public bank-customer dataset, investigate customer characteristics associated with churn, apply several data-mining techniques, and build two baseline classification models to estimate which customers are more likely to leave.

The goal is to demonstrate a practical data science workflow — from data exploration and feature analysis to baseline modelling and evaluation — rather than to build a production-ready churn platform.

## Business Problem

The target is to identify customers who are more likely to leave the bank (`Exited = 1`). Understanding churn patterns can help a bank investigate higher-risk customer segments and inform future customer-retention initiatives.

This project focuses on two questions:

- Which customer characteristics and segments are associated with a higher churn rate?
- How well can simple classification models distinguish customers who left from customers who stayed?

## Dataset

- **Source:** [Churn for Bank Customers — Kaggle](https://www.kaggle.com/datasets/mathchi/churn-for-bank-customers)
- **File:** `churn.csv`
- **Size:** 10,000 rows
- **Target:** `Exited` — `1` means the customer left; `0` means the customer stayed.

The modelling workflow uses 10 customer features:

| Feature group | Features |
|---|---|
| Numeric | `CreditScore`, `Age`, `Tenure`, `Balance`, `NumOfProducts`, `EstimatedSalary` |
| Categorical / binary | `Geography`, `Gender`, `HasCrCard`, `IsActiveMember` |

`RowNumber`, `CustomerId`, and `Surname` are excluded from model inputs. `RowNumber` is used only as a row identifier in parts of the exploratory analysis.

The dataset is downloaded by the notebook using `kagglehub`; the CSV does not need to be added to this repository manually.

## Project Workflow

### 1. Data Loading and Initial Checks

- Download the dataset with `kagglehub`.
- Load it into a Pandas DataFrame.
- Inspect the dataset shape, sample records, and missing values.
- Review the target distribution and overall churn rate.

### 2. Exploratory Data Analysis

- Explore the distribution of customer age.
- Inspect age outliers using box plots and the IQR rule.
- Compare churn rates across geography and customer activity segments.
- Examine the relationship between `Age` and `Balance`.

### 3. Data Mining and Feature Analysis

The notebook demonstrates several techniques on the customer dataset:

- **Variable transformation:** log transformation, Min-Max scaling, and Z-score standardization.
- **Distance and similarity:** Euclidean, Manhattan, and Minkowski distances, cosine similarity, and Jaccard similarity.
- **Feature relationships:** Pearson correlation and Mutual Information.
- **Feature selection:** Chi-square scores and Random Forest feature importance.
- **Dimensionality reduction:** Principal Component Analysis (PCA).
- **Kernel functions:** linear and RBF kernels.
- **Outlier analysis:** comparison of IQR and Z-score methods.

### 4. Baseline Churn Prediction

Two baseline models are compared:

- **Logistic Regression** — an interpretable linear classification model.
- **Random Forest** — a tree-based model that can capture non-linear patterns.

The modelling setup includes:

- Stratified 80/20 train/test split (`random_state=42`).
- Standardization of numeric features.
- One-hot encoding of categorical features.
- Scikit-learn `Pipeline` and `ColumnTransformer` to keep preprocessing within the training workflow.
- Balanced class weights to account for the unequal target distribution.

### 5. Model Evaluation

The models are compared using:

- Accuracy
- Precision
- Recall
- F1-score
- ROC-AUC

The notebook also displays a confusion matrix and a classification report for the model with the highest ROC-AUC on the comparison set. The default classification threshold is `0.5`; threshold tuning is outside the scope of this baseline project.

## How to Run

1. Clone or download this repository.
2. Install the required libraries:

   ```bash
   pip install numpy pandas matplotlib seaborn scikit-learn kagglehub jupyter
   ```

3. Start Jupyter Notebook or JupyterLab:

   ```bash
   jupyter notebook
   ```

4. Open `Bank_Customer_Churn_Pet_Project.ipynb`.
5. Run all cells from top to bottom (`Kernel` → `Restart & Run All`, or the equivalent option in your environment).

The first data-loading run downloads the public dataset through `kagglehub`. An internet connection may be required for this step.

## Key Takeaways

The notebook is designed to help investigate:

- How churn is distributed across the customer base.
- How churn rates differ across selected customer segments.
- How scaling and feature transformations affect customer data analysis.
- How different feature-analysis and dimensionality-reduction methods can reveal patterns in the data.
- How Logistic Regression and Random Forest perform as initial churn-classification baselines.

Run the notebook to generate the model comparison metrics and confusion matrix for the current environment. No model-performance values are hard-coded here because they should come from an actual execution of the notebook.

## Limitations and Next Steps

- The dataset is public and cross-sectional; it does not provide a time-based validation setup.
- Observed relationships are predictive associations and do not prove that a feature causes churn.
- The dataset does not include retention-campaign exposure, offer acceptance, or treatment/outcome history. Therefore, this project does **not** train or evaluate a Next Best Offer (NBO) or uplift model.
- The models are simple baselines, not production-ready systems.

Possible next steps include validating the model on more recent customer data, using cross-validation for model comparison, tuning the classification threshold based on retention-team capacity and business costs, and evaluating a retention strategy when campaign outcome data becomes available.

---

**Project Type:** Personal Learning / Portfolio Project  
**Focus:** Exploratory Data Analysis, Data Mining, Feature Analysis, PCA, Outlier Detection, Baseline Classification