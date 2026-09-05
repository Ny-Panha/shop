import urllib.request
import re
import json

url = "https://zandoshops.com/kh/khmer/men"
headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"HTML length: {len(html)}")

        # Find all DigitalOcean space image urls
        images = re.findall(r'https://zand\.sgp1\.cdn\.digitaloceanspaces\.com/[^\s"\'\\]+', html)
        print(f"Found {len(images)} images")
        
        # Deduplicate while preserving order
        unique_images = list(dict.fromkeys(images))
        print(f"Unique images: {len(unique_images)}")
        for img in unique_images[:30]:
            print(img)
            
        # Search for product data structures
        # Look for json objects with products or name
        product_blocks = re.findall(r'\{[^{}]*"name"[^{}]*"price"[^{}]*\}', html)
        print(f"Product blocks: {len(product_blocks)}")
        if product_blocks:
            for b in product_blocks[:5]:
                print(b[:200])

except Exception as e:
    print(f"Error: {e}")
