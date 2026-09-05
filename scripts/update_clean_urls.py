import re

file_path = '/home/kali/Desktop/shop/Frontend/src/data/zandoProducts.js'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update product 217 specifically
text = text.replace(
    "slug: 'ten11-oversized-graphic-print-tee-217',\n    zandoSlug: 'ten11-oversized-graphic-print-tee-217',\n    zandoCode: '10112607517',",
    "slug: 't-shirt-with-printed-21226021645',\n    zandoSlug: 't-shirt-with-printed-21226021645',\n    zandoCode: '21226021645',\n    zandoCid: '63',\n    routeHash: '#/khmer/women/t-shirt-with-printed-21226021645?cid=63',"
)

# 2. Update all '#/men/' to '#/khmer/men/'
text = text.replace("'#/men/", "'#/khmer/men/")

# 3. Update banners
text = text.replace("'#/clothes/men-new-in'", "'#/khmer/men/clothes/men-new-in'")
text = text.replace("'#/clothes/routine-collection'", "'#/khmer/men/clothes/men-shop-by-collection'")
text = text.replace("'#/clothes/men-shirts'", "'#/khmer/men/clothes/men-shirts'")
text = text.replace("'#/clothes/men-shoes'", "'#/khmer/men/shoes'")
text = text.replace("'#/clothes/accessories'", "'#/khmer/men/accessories'")
text = text.replace("'#/clothes/backpacks'", "'#/khmer/men/accessories/bags'")
text = text.replace("'#/clothes/brand/361'", "'#/khmer/men/brand/361'")
text = text.replace("'#/clothes/brand/ten11'", "'#/khmer/men/brand/ten-eleven'")
text = text.replace("'#/clothes/brand/gatoni'", "'#/khmer/men/brand/gatoni'")
text = text.replace("'#/clothes/men-through-the-mist-collection'", "'#/khmer/men/clothes/men-shop-by-collection'")
text = text.replace("link: '#/clothes'", "link: '#/khmer/men/clothes'")

# 4. Add routeHash to women products (id 201 to 224) if missing
def add_women_route_hash(match):
    block = match.group(0)
    if "routeHash:" not in block:
        slug_m = re.search(r"slug:\s*'([^']+)'", block)
        if slug_m:
            slug = slug_m.group(1)
            cid = "63"
            return block + f"\n    routeHash: '#/khmer/women/{slug}?cid={cid}',"
    return block

text = re.sub(r"gender:\s*'women',", add_women_route_hash, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated clean URLs in zandoProducts.js successfully!")
