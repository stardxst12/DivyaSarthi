import requests

url = "http://127.0.0.1:5001/predict"  # Ensure Flask is running on this port
data ={
    "tremorCount": 5,
  "misclickCount": 3,
  "typoCount": 2,
  "feature4": 0,
  "feature5": 0,
  "feature6": 0
}
 



try:
    response = requests.post(url, json=data)
    print("Response:", response.json())  # Print the predicted severity
except requests.exceptions.RequestException as e:
    print("Error:", e)
