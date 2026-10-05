import urllib.request
import json
import os
import urllib.parse

# 1. Fetch JSON
url_json = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json"
req_json = urllib.request.Request(url_json, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req_json) as response:
    data = json.loads(response.read().decode())

def find_exact(name):
    return next((e for e in data if e['name'].lower() == name.lower()), None)

# We want: 
# Squat: "bodyweight squat"
# Knee: "resistance band leg extension"
# Shoulder: "band front raise"
# Glute: "glute bridge"

targets = {
    'squat': find_exact('bodyweight squat'),
    'knee': find_exact('resistance band seated leg extension') or find_exact('resistance band leg extension'),
    'shoulder': find_exact('band front raise'),
    'glute': find_exact('glute bridge') or find_exact('glute bridge march')
}

# 2. Fetch Tree
url_tree = "https://api.github.com/repos/hasaneyldrm/exercises-dataset/git/trees/893775b129e3d25f488baaa87863c78eaf2f7eb5"
req_tree = urllib.request.Request(url_tree, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req_tree) as response:
    tree_data = json.loads(response.read().decode())
    video_files = [item['path'] for item in tree_data['tree'] if item['path'].endswith('.gif')]

# 3. Match and Download
os.makedirs('public/exercises', exist_ok=True)
for k, v in targets.items():
    if v:
        print(f"Found {k}: {v['name']} (ID: {v['id']})")
        # Find the matching file in tree
        matching_file = next((f for f in video_files if f.startswith(v['id'])), None)
        if matching_file:
            raw_url = f"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/{urllib.parse.quote(matching_file)}"
            print(f"Downloading {raw_url}")
            try:
                img_req = urllib.request.Request(raw_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(img_req) as img_resp:
                    with open(f"public/exercises/{k}.gif", "wb") as f:
                        f.write(img_resp.read())
            except Exception as e:
                print(f"Failed to download {k}: {e}")
        else:
            print(f"No file found in tree for ID {v['id']}")
    else:
        print(f"Could not find match for {k}")
