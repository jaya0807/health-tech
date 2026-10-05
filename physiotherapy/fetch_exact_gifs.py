import urllib.request
import json
import os
import urllib.parse

url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
        # We need Bodyweight Squat, Leg Extension, Front Raise, Glute Bridge
        squat = next((e for e in data if 'squat' in e['name'].lower() and 'bodyweight' in e['name'].lower()), None)
        if not squat:
            squat = next((e for e in data if 'squat' in e['name'].lower()), None)
            
        knee = next((e for e in data if 'leg extension' in e['name'].lower()), None)
        shoulder = next((e for e in data if 'front raise' in e['name'].lower()), None)
        glute = next((e for e in data if 'glute bridge' in e['name'].lower()), None)
        
        targets = {
            'ex_0': squat,
            'ex_1': knee,
            'ex_2': shoulder,
            'ex_3': glute
        }
        
        for k, v in targets.items():
            if v:
                print(f"Found {k}: {v['name']} (ID: {v['id']})")
                # the dataset stores gifs in videos/ID.gif
                # but wait, the video folder had files like '0001-2gPfomN.gif'
                # Actually, the ID in json is just '0001' or similar?
                # Let's print the ID format
                print(f"ID is {v['id']}")
            else:
                print(f"Could not find match for {k}")
                
except Exception as e:
    print(f"Error: {e}")
