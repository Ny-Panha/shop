import os
import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

out_dir = "/home/kali/Desktop/shop/Frontend/public/zando-products"
os.makedirs(out_dir, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Real Zando DigitalOcean Spaces CDN mapping (Main & Hover)
products_to_download = [
    # 1. Apparel
    {
        "id": "101",
        "name": "jetburn",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607307/GWYN%20(5)-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607307/GWYN%20(2)-cr-450x672.jpg",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607307/GWYN%20(1)-cr-450x672.jpg"
    },
    {
        "id": "102",
        "name": "devotus_inkfray",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607292/DEVOTUS%20(7)-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607292/DEVOTUS%20(1)-cr-450x672.jpg",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607292/DEVOTUS%20(2)-cr-450x672.jpg"
    },
    {
        "id": "103",
        "name": "devotus_tank",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2025-08/10112607279/DEVOTUS%20(15)-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2025-08/10112607279/DEVOTUS%20(1)-cr-450x672.jpg",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2025-08/10112607279/DEVOTUS%20(7)-cr-450x672.jpg"
    },
    {
        "id": "104",
        "name": "push_milo",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07/10112607244/PUSH%20(3)-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07/10112607244/PUSH%20(1)-cr-450x672.jpg",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07/10112607244/PUSH%20(2)-cr-450x672.jpg"
    },
    {
        "id": "105",
        "name": "devotus_layer_script",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607277/DEVOTUS-R%20(4)-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607277/DEVOTUS-R%20(5)-cr-450x672.jpg"
    },
    {
        "id": "106",
        "name": "devotus_wake_up",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607282/DEVOTUS%20(3)-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/10112607282/DEVOTUS%20(1)-cr-450x672.jpg"
    },
    {
        "id": "107",
        "name": "ten11_striped",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/21226061897/STU_9252-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/21226061897/STU_9252-cr-450x672.jpg"
    },
    {
        "id": "108",
        "name": "ten11_layered",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07-II/21226021890/PTAK1148-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07-II/21226021890/PTAK1148-cr-450x672.jpg"
    },
    {
        "id": "109",
        "name": "zando_plaid",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07-II/11226031754/STU_6719-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07-II/11226031754/STU_6719-cr-450x672.jpg"
    },
    {
        "id": "110",
        "name": "ten11_wide_jeans",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07-II/2112605911/STU_7655-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-07-II/2112605911/STU_7655-cr-450x672.jpg"
    },

    # 2. Shoes (The Latest Brands)
    {
        "id": "111",
        "name": "nike_metcon_6",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/141142607001/FJ7127-107%20(3)-cr-450x672.png",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/141142607001/FJ7127-107%20(1)-cr-450x672.png",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/141142607001/FJ7127-107%20(2)-cr-450x672.png"
    },
    {
        "id": "112",
        "name": "nike_rival_fly_4",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14192607015/FV6040-600%20(2)-cr-450x672.png",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14192607015/FV6040-600%20(1)-cr-450x672.png",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14192607015/FV6040-600%20(3)-cr-450x672.png"
    },
    {
        "id": "113",
        "name": "mizuno_wave_rider_10",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14112607001%20Replace/R%20(2)-cr-450x672.png",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14112607001%20Replace/R%20(1)-cr-450x672.png",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14112607001%20Replace/R%20(3)-cr-450x672.png"
    },
    {
        "id": "114",
        "name": "nike_vomero_5",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14192607008/FJ4151-004%20(1)-cr-450x672.png",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14192607008/FJ4151-004%20(2)-cr-450x672.png",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14192607008/FJ4151-004%20(3)-cr-450x672.png"
    },
    {
        "id": "115",
        "name": "mizuno_elm",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14112607019%20Replace/Rider%20(5)-cr-450x672.png",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14112607019%20Replace/Rider%20(1)-cr-450x672.png",
        "extra_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14112607019%20Replace/Rider%20(2)-cr-450x672.png"
    },
    {
        "id": "116",
        "name": "mizuno_mxr",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14112607012/mizuno%20(10)-cr-450x672.jpg",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14112607012/mizuno%20(1)-cr-450x672.jpg"
    },
    {
        "id": "117",
        "name": "adidas_im2055",
        "main_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14152607008/IM2055-101%20(3)-cr-450x672.png",
        "hover_url": "https://zand.sgp1.cdn.digitaloceanspaces.com/cache/catalog/products/2026-08/14152607008/IM2055-101%20(1)-cr-450x672.png"
    }
]

# Insane Royal Pants (100)
insane_urls = [
    ("insane_main.jpg", "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/products/2026-06/10112606136/ISC%20(23).jpg"),
    ("insane_hover.jpg", "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/products/2026-06/10112606136/ISC%20(22).jpg"),
    ("insane_thumb1.jpg", "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/products/2026-06/10112606136/ISC%20(20).jpg"),
    ("insane_thumb2.jpg", "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/products/2026-06/10112606136/ISC%20(21).jpg"),
    ("insane_thumb3.jpg", "https://zand.sgp1.cdn.digitaloceanspaces.com/catalog/products/2026-06/10112606136/ISC%20(5).jpg")
]

def download_file(url, target_path):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp, open(target_path, 'wb') as out:
            out.write(resp.read())
        print(f"Downloaded: {os.path.basename(target_path)} ({os.path.getsize(target_path)} bytes)")
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

print("Starting high-res download from ZANDO DigitalOcean Spaces...")

for item in products_to_download:
    name = item["name"]
    ext = ".png" if ".png" in item["main_url"] else ".jpg"
    main_path = os.path.join(out_dir, f"{name}_main{ext}")
    hover_path = os.path.join(out_dir, f"{name}_hover{ext}")
    
    download_file(item["main_url"], main_path)
    if "hover_url" in item:
        download_file(item["hover_url"], hover_path)

for fname, u in insane_urls:
    target = os.path.join(out_dir, fname)
    download_file(u, target)

print("Download complete!")
