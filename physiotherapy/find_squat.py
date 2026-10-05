import urllib.request
import json

url = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())
    for e in data:
        if 'squat' in e['name'].lower() and e['equipment'].lower() == 'body weight':
            print(f"{e['id']} - {e['name']}")
