import urllib.request
import json
import urllib.parse
import os

url_tree = "https://api.github.com/repos/hasaneyldrm/exercises-dataset/git/trees/893775b129e3d25f488baaa87863c78eaf2f7eb5"
req_tree = urllib.request.Request(url_tree, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req_tree) as response:
    tree_data = json.loads(response.read().decode())
    matching_file = next((item['path'] for item in tree_data['tree'] if item['path'].startswith('3132')), None)

if matching_file:
    raw_url = f"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/{urllib.parse.quote(matching_file)}"
    print(f"Downloading squat from {raw_url}")
    try:
        img_req = urllib.request.Request(raw_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(img_req) as img_resp:
            with open(f"public/exercises/squat.gif", "wb") as f:
                f.write(img_resp.read())
    except Exception as e:
        print(f"Failed to download: {e}")
else:
    print("Not found in tree")
