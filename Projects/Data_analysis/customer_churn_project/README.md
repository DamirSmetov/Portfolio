# Customer Retention Intelligence

Churn prediction and retention-contact prioritisation on the IBM Telco Customer Churn sample (7,043 customers).

The project answers four questions: how well churn can be ranked, which factors are associated with it, which threshold to use, and which customers to contact under a fixed budget.

## Key results (held-out test set)

| Metric                               | Value                                                      |
| ------------------------------------ | ---------------------------------------------------------- |
| Selected model                       | Logistic Regression (chosen on validation PR-AUC)          |
| PR-AUC                               | 0.659 (95% bootstrap CI 0.601–0.717); prior baseline 0.265 |
| ROC-AUC                              | 0.845                                                      |
| Precision / recall at threshold 0.29 | 0.54 / 0.76                                                |
| Top 10% by predicted risk            | 76% churners, 29% of all churners captured                 |

Campaign economics use explicit, illustrative assumptions and a sensitivity analysis. They are not measured effects.

## What is in the notebook

- Data-quality checks and EDA with Wilson confidence intervals
- SQL aggregations on SQLite to show query-based analytics
- Leakage-free preprocessing (`Pipeline` / `ColumnTransformer`, fitted on training data only)
- A categorical Naive Bayes implemented from scratch, benchmarked against Logistic Regression and Random Forest
- Train / validation / test split, threshold tuning on validation data, a single final test evaluation
- Probability calibration, permutation importance, risk deciles, slice diagnostics
- Budget-constrained contact list with sensitivity analysis

## Limitations

- Random split, so there is no temporal validation.
- No campaign or offer-response data, so there is no causal uplift estimate and no Next Best Offer model.
- Small public sample; results are not a claim about a real operator.

## How to run

```bash
pip install -r requirements.txt
jupyter notebook Customer_Retention_Intelligence.ipynb
```

The notebook loads the CSV from `CHURN_DATA_PATH`, from `data/`, or from the public IBM mirror. Run all cells from top to bottom.

## Data

IBM Telco Customer Churn (Kaggle: https://www.kaggle.com/datasets/blastchar/telco-customer-churn). Licensing and terms follow the original dataset page.
