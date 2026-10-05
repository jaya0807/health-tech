import urllib.request
import os

gifs = {
    'squat': 'tF8jNxC06sHufyRxwo',
    'knee': 'fUj3j4Wz36QG8WbI4e',
    'shoulder': '3o7TKMGpxxHOGTdzJC',
    'glute': 'tF8jNxC06sHufyRxwo' # using squat as fallback for now
}

os.makedirs('public/exercises', exist_ok=True)

for name, gid in gifs.items():
    url = f"https://media.giphy.com/media/{gid}/giphy.gif"
    try:
        print(f"Downloading {name} from {url}")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(f"public/exercises/{name}.gif", "wb") as f:
                f.write(response.read())
    except Exception as e:
        print(f"Failed to download {name}: {e}")
