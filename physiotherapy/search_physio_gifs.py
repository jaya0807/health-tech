import urllib.request
import json
import os
import urllib.parse

url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
        def find_physio(terms, exclude_terms):
            for e in data:
                name = e['name'].lower()
                if all(t in name for t in terms) and not any(x in name for x in exclude_terms):
                    return e
            return None

        # Squat: bodyweight, no jump, no barbell
        squat = find_physio(['squat', 'bodyweight'], ['jump', 'barbell', 'dumbbell', 'smith', 'machine'])
        
        # Knee extension: maybe just "leg extension" without "lever" or "machine"
        knee = find_physio(['leg extension'], ['lever', 'machine', 'cable'])
        if not knee:
            # Maybe sitting leg raise?
            knee = find_physio(['seated', 'leg raise'], ['machine'])
            
        # Shoulder flexion: wall crawl or front raise (band or dumbbell is okay if light, but bodyweight better)
        shoulder = find_physio(['wall'], ['push'])
        if not shoulder:
            shoulder = find_physio(['front raise', 'band'], [])
            
        # Glute bridge: bodyweight, no barbell
        glute = find_physio(['glute bridge'], ['barbell', 'dumbbell', 'band', 'weighted'])
        if not glute:
            glute = find_physio(['pelvic tilt'], [])
        
        targets = {
            'squat': squat,
            'knee': knee,
            'shoulder': shoulder,
            'glute': glute
        }
        
        for k, v in targets.items():
            if v:
                print(f"Found {k}: {v['name']} (ID: {v['id']})")
                
                # Download it right away
                filename = f"{v['id']}.gif" # we need to find the exact filename prefix
                # The filename in repo is actually something like 'videos/1409-qKBpF7I.gif'
                # Let's search the repo tree for the file starting with this ID
            else:
                print(f"Could not find match for {k}")
                
except Exception as e:
    print(f"Error: {e}")
