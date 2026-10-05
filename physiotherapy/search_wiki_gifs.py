import urllib.request
import json
import urllib.parse

def search_gifs(query):
    # Search for files in Wikimedia Commons containing the query and .gif
    search_query = f"{query} filetype:bitmap"
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(search_query)}&srnamespace=6&format=json&srlimit=5"
    
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for res in data['query']['search']:
            title = res['title']
            if '.gif' in title.lower():
                print(f"Found {query} GIF: {title}")
                return title
    return None

def get_image_url(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        pages = data['query']['pages']
        for page_id, page_info in pages.items():
            if 'imageinfo' in page_info:
                return page_info['imageinfo'][0]['url']
    return None

import os
os.makedirs('public/exercises', exist_ok=True)

queries = {'squat': 'Squat', 'knee': 'Leg extension', 'shoulder': 'Front raise', 'glute': 'Glute'}

for name, query in queries.items():
    title = search_gifs(query)
    if title:
        img_url = get_image_url(title)
        print(f"Downloading {name} from {img_url}")
        req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(f"public/exercises/{name}.gif", "wb") as f:
                f.write(response.read())
    else:
        print(f"No GIF found for {name}")
