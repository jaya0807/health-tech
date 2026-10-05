import urllib.request
import json
import os

url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/exercises.json"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
        exercises = {
            'squat': next((e for e in data if 'squat' in e['name'].lower() and e['id'].endswith('.gif')), None),
            'knee': next((e for e in data if 'extension' in e['name'].lower() and 'leg' in e['name'].lower() and e['id'].endswith('.gif')), None),
            'shoulder': next((e for e in data if 'front raise' in e['name'].lower() and e['id'].endswith('.gif')), None),
            'glute': next((e for e in data if 'glute bridge' in e['name'].lower() and e['id'].endswith('.gif')), None)
        }
        
        # In this dataset, the id maps to videos/{id}.gif or something similar?
        # Let's print the structure of one exercise
        print("Dataset loaded. Total exercises:", len(data))
        print("First item:", data[0])
        
        for k, v in exercises.items():
            if not v:
                # If exact match fails, just find any
                pass
except Exception as e:
    print(f"Error: {e}")
