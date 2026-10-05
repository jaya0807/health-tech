import urllib.request
import os

gifs = {
    'squat': '3543-wfotm7S.gif',
    'knee': '0585-my33uHU.gif',
    'shoulder': '0978-TFA88iB.gif',
    'glute': '1409-qKBpF7I.gif'
}

for name, filename in gifs.items():
    url = f"https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/{filename}"
    print(f"Downloading {name} from {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(f"public/exercises/{name}.gif", "wb") as f:
                f.write(response.read())
    except Exception as e:
        print(f"Failed to download {name}: {e}")
