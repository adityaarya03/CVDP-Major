import pickle
import os
import numpy as np

MODEL_PATH = "models/trained_models/"

def load_model(model_name):
    with open(os.path.join(MODEL_PATH, model_name), "rb") as model_file:
        return pickle.load(model_file)

def load_scaler():
    with open(os.path.join(MODEL_PATH, "scaler.pkl"), "rb") as scaler_file:
        return pickle.load(scaler_file)

def load_selected_features(feature_file):
    with open(os.path.join(MODEL_PATH, feature_file), "rb") as f:
        return pickle.load(f)

# Load necessary components
scaler = load_scaler()
relief_features = load_selected_features("relief_features.pkl")
lasso_features = load_selected_features("lasso_features.pkl")

def load_models():
    return {
        "AdaBoostClassifier_LASSO": (load_model("AdaBoostClassifier_LASSO.pkl"), lasso_features),
        "DecisionTreeClassifier_LASSO": (load_model("DecisionTreeClassifier_LASSO.pkl"), lasso_features),
        "GradientBoostingClassifier_Relief": (load_model("GradientBoostingClassifier_Relief.pkl"), relief_features),
        "KNeighborsClassifier_LASSO": (load_model("KNeighborsClassifier_LASSO.pkl"), lasso_features),
        "RandomForestClassifier_LASSO": (load_model("RandomForestClassifier_LASSO.pkl"), lasso_features),
    }

def predict_with_models(model, feature_names, input_data):
    selected_indices = [FEATURES.index(feature) for feature in feature_names]
    input_selected = input_data[:, selected_indices]
    return int(model.predict(input_selected)[0])  # Convert to int for JSON response

# Define full feature list (must match frontend input)
FEATURES = ['age', 'gender', 'chestpain', 'restingBP', 'serumcholestrol', 
            'fastingbloodsugar', 'restingrelectro', 'maxheartrate',
            'exerciseangia', 'oldpeak', 'slope', 'noofmajorvessels']
