import urllib.request
import urllib.parse
import json
import os

exercises = {
    'Shoulder': 'Deltoid_muscle',
    'Glute': 'Gluteus_maximus'
}

os.makedirs('public/exercises', exist_ok=True)

for name, title in exercises.items():
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=pageimages&format=json&pithumbsize=600"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            for page_id, page_info in pages.items():
                if 'thumbnail' in page_info:
                    img_url = page_info['thumbnail']['source']
                    print(f"Found {name}: {img_url}")
                    # Download the image
                    img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(img_req) as img_resp:
                        with open(f"public/exercises/{name.lower()}.jpg", "wb") as f:
                            f.write(img_resp.read())
                else:
                    print(f"No image for {name}")
    except Exception as e:
        print(f"Error fetching {name}: {e}")
