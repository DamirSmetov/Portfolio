"""Reusable categorical Naive Bayes estimator for churn classification.

Numeric bin edges and category vocabularies are fitted on training data only.
"""

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, ClassifierMixin


class ScratchCategoricalNB(ClassifierMixin, BaseEstimator):
    """Categorical Naive Bayes with Laplace smoothing and train-only binning."""

    def __init__(self, alpha: float = 1.0, n_bins: int = 5):
        self.alpha = alpha
        self.n_bins = n_bins

    @staticmethod
    def _as_category(series: pd.Series) -> pd.Series:
        return series.astype("string").fillna("__MISSING__").astype(str)

    def _fit_transform_schema(self, X: pd.DataFrame) -> pd.DataFrame:
        self.numeric_features_ = X.select_dtypes(include=np.number).columns.tolist()
        self.categorical_features_ = [c for c in X.columns if c not in self.numeric_features_]
        self.medians_ = {}
        self.bin_cuts_ = {}
        result = pd.DataFrame(index=X.index)

        for col in self.numeric_features_:
            values = pd.to_numeric(X[col], errors="coerce")
            median = float(values.median()) if values.notna().any() else 0.0
            self.medians_[col] = median
            filled = values.fillna(median).to_numpy(dtype=float)
            quantiles = np.linspace(0, 1, self.n_bins + 1)
            cuts = np.unique(np.quantile(filled, quantiles)[1:-1])
            self.bin_cuts_[col] = cuts
            result[col] = pd.Series(np.digitize(filled, cuts).astype(str), index=X.index)

        for col in self.categorical_features_:
            result[col] = self._as_category(X[col])
        return result[X.columns]

    def _transform(self, X: pd.DataFrame) -> pd.DataFrame:
        result = pd.DataFrame(index=X.index)
        for col in self.numeric_features_:
            values = pd.to_numeric(X[col], errors="coerce").fillna(self.medians_[col]).to_numpy(dtype=float)
            result[col] = pd.Series(np.digitize(values, self.bin_cuts_[col]).astype(str), index=X.index)
        for col in self.categorical_features_:
            result[col] = self._as_category(X[col])
        return result[list(self.feature_vocab_.keys())]

    def fit(self, X: pd.DataFrame, y: pd.Series):
        if self.alpha <= 0:
            raise ValueError("alpha must be > 0")
        X_cat = self._fit_transform_schema(X)
        self.classes_ = np.sort(pd.Series(y).unique())
        self.class_log_prior_ = {}
        self.feature_vocab_ = {}
        self.log_likelihood_ = {}
        self.unknown_log_likelihood_ = {}

        for feature in X_cat.columns:
            vocabulary = set(X_cat[feature].astype(str).unique())
            self.feature_vocab_[feature] = vocabulary
            self.log_likelihood_[feature] = {}
            self.unknown_log_likelihood_[feature] = {}
            n_categories = len(vocabulary) + 1  # reserve one bucket for unseen values

            for cls in self.classes_:
                class_values = X_cat.loc[np.asarray(y) == cls, feature].astype(str)
                counts = class_values.value_counts()
                denominator = len(class_values) + self.alpha * n_categories
                self.log_likelihood_[feature][cls] = {
                    value: np.log((counts.get(value, 0) + self.alpha) / denominator)
                    for value in vocabulary
                }
                self.unknown_log_likelihood_[feature][cls] = np.log(self.alpha / denominator)

        y_series = pd.Series(y)
        priors = y_series.value_counts(normalize=True)
        self.class_log_prior_ = {cls: np.log(priors.loc[cls]) for cls in self.classes_}
        return self

    def predict_log_proba(self, X: pd.DataFrame) -> np.ndarray:
        X_cat = self._transform(X)
        log_scores = np.zeros((len(X_cat), len(self.classes_)), dtype=float)
        for class_idx, cls in enumerate(self.classes_):
            log_scores[:, class_idx] = self.class_log_prior_[cls]
            for feature in X_cat.columns:
                likelihoods = self.log_likelihood_[feature][cls]
                fallback = self.unknown_log_likelihood_[feature][cls]
                values = X_cat[feature].astype(str)
                log_scores[:, class_idx] += values.map(likelihoods).fillna(fallback).to_numpy()
        # Normalize in log-space (log-sum-exp) for numerical stability.
        row_max = log_scores.max(axis=1, keepdims=True)
        log_norm = row_max + np.log(np.exp(log_scores - row_max).sum(axis=1, keepdims=True))
        return log_scores - log_norm

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        return np.exp(self.predict_log_proba(X))

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        return self.classes_[np.argmax(self.predict_proba(X), axis=1)]


