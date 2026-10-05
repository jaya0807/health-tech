import urllib.request
import json
import os

# Get tree of hasaneyldrm/exercises-dataset main branch
url = "https://api.github.com/repos/hasaneyldrm/exercises-dataset/git/trees/main?recursive=1"

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
        gif_files = [item['path'] for item in data['tree'] if item['path'].endswith('.gif')]
        print(f"Found {len(gif_files)} GIFs in the repo!")
        
        # Let's just download the first 4 GIFs
        os.makedirs('public/exercises', exist_ok=True)
        for i, path in enumerate(gif_files[:4]):
            raw_url = f"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/{urllib.parse.quote(path)}"
            print(f"Downloading {raw_url}")
            img_req = urllib.request.Request(raw_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(img_req) as img_resp:
                with open(f"public/exercises/ex_{i}.gif", "wb") as f:
                    f.write(img_resp.read())
except Exception as e:
    print(f"Error: {e}")
