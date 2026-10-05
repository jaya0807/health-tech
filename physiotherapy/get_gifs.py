import urllib.request
import json
import urllib.parse

queries = ['squat exercise', 'knee extension exercise', 'shoulder flexion', 'glute bridge']
api_key = "dc6zaTOxFJmzC" # public beta key

for q in queries:
    url = f"https://api.giphy.com/v1/gifs/search?api_key={api_key}&q={urllib.parse.quote(q)}&limit=1"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data['data']:
                print(f"{q}: {data['data'][0]['images']['original']['url']}")
            else:
                print(f"{q}: No results")
    except Exception as e:
        print(f"Error fetching {q}: {e}")
