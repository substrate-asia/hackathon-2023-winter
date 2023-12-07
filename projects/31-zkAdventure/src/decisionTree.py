from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import pandas as pd

# Expanded example data
data = {
    'Time of Day': ['Day', 'Night', 'Day'],
    'Equipment': ['Yes', 'No', 'Yes'],
    'Companion': ['Partner', 'Alone', 'Alone'],
    'Terrain': ['Forest', 'Mountain', 'Desert'],
    'Weather': ['Sunny', 'Windy', 'Hot'],
    'Health Level': ['High', 'Low', 'Medium'],
    'Enemy Proximity': ['Far', 'Near', 'Far'],
    'Magic Level': ['Medium', 'None', 'Low'],
    'Outcome': ['Find Rare Artifact', 'Fall into a Trap', 'Discover Hidden Oasis']
}

df = pd.DataFrame(data)

# Encoding categorical data
le = LabelEncoder()
for column in df.columns:
    df[column] = le.fit_transform(df[column])

# Features and target
X = df.drop('Outcome', axis=1)
y = df['Outcome']

# Decision Tree Model
model = DecisionTreeClassifier()
model.fit(X, y)

# Example prediction
player_input = {
    'Time of Day': 'Day',
    'Equipment': 'Yes',
    'Companion': 'Alone',
    'Terrain': 'River',
    'Weather': 'Rainy',
    'Health Level': 'Medium',
    'Enemy Proximity': 'Near',
    'Magic Level': 'High'
}
input_transformed = [list(le.transform([player_input[key]])) for key in player_input]
prediction = model.predict([input_transformed])[0]
predicted_outcome = le.inverse_transform([prediction])[0]

print("Predicted Outcome:", predicted_outcome)
