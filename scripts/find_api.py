import urllib.request
import re

url = "https://zandoshops.com/kh/khmer/men"
headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Find JS chunk files
chunks = re.findall(r'static/chunks/[a-zA-Z0-9_\-\./]+\.js', html)
print(f"Found {len(chunks)} chunks")

api_patterns = set()
for chunk in chunks[:15]:
    chunk_url = f"https://zandoshops.com/_next/{chunk}"
    try:
        creq = urllib.request.Request(chunk_url, headers=headers)
        with urllib.request.urlopen(creq) as cresp:
            js = cresp.read().decode('utf-8', errors='ignore')
            # Look for API endpoints or baseURL
            matches = re.findall(r'https?://[a-zA-Z0-9\-\.]*(?:api|backend|service)[a-zA-Z0-9\-\.]*(?::[0-9]+)?/[a-zA-Z0-9_\-\./]*', js)
            for m in matches:
                api_patterns.add(m)
            # Look for product endpoints
            prod_endpoints = re.findall(r'["\'](/api/[^"\']+)["\']', js)
            for p in prod_endpoints:
                api_patterns.add(p)
            # Look for digitaloceanspaces
            do_urls = re.findall(r'https://zand\.sgp1\.cdn\.digitaloceanspaces\.com/[a-zA-Z0-9_\-\./%]+', js)
            for d in do_urls:
                api_patterns.add(d)
    except Exception as e:
        pass

print("Discovered endpoints & URLs:")
for a in list(api_patterns)[:40]:
    print(a)
