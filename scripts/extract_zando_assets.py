import os
from PIL import Image

OUT_DIR = '/home/kali/Desktop/shop/Frontend/public/zando-assets'
os.makedirs(OUT_DIR, exist_ok=True)

def crop_and_save(src_path, box, out_name):
    im = Image.open(src_path)
    cropped = im.crop(box)
    out_path = os.path.join(OUT_DIR, out_name)
    cropped.save(out_path, quality=95)
    print(f"Saved {out_name}: {cropped.size}")

print("Extracting Zando assets...")

# 1. Hero banner (tests/ksnip_20260904-192642.png)
# y=236 to 780, x=0 to 1904
crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-192642.png', (0, 236, 1904, 782), 'hero-ten-eleven.png')

# 2. Brand logos strip
crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-192642.png', (100, 792, 1804, 882), 'brands-strip.png')

# 3. Gatoni Through The Mist banner (tests/ksnip_20260904-192704.png)
crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-192704.png', (0, 466, 1904, 794), 'gatoni-mist-banner.png')

# 4. Shop by category 4 cards (tests/ksnip_20260904-192717.png)
# Cards at y=388 to 926
cards_x = [(100, 520), (528, 949), (956, 1377), (1385, 1805)]
cat_names = ['cat-new-in.png', 'cat-collections.png', 'cat-smart-casual.png', 'cat-officewear.png']
for (x1, x2), name in zip(cards_x, cat_names):
    crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-192717.png', (x1, 388, x2, 926), name)

# 5. Discover favorites (tests/ksnip_20260904-192726.png)
# Left poster: x=0 to 480, y=210 to 876
crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-192726.png', (0, 212, 480, 876), 'season-poster.png')

# 4 apparel products on right
# Cards at y=290 to 736
apparel_x = [(496, 848), (864, 1216), (1232, 1584), (1600, 1904)]
fav_names = ['fav-jetburn.png', 'fav-devotus-inkfray.png', 'fav-devotus-tank.png', 'fav-pushpush-milo.png']
for (x1, x2), name in zip(apparel_x, fav_names):
    crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-192726.png', (x1, 290, x2, 736), name)

# 6. Shoes carousel 5 cards (tests/ksnip_20260904-192749.png)
# y=326 to 800
shoe_names = ['shoe-nike-metcon.png', 'shoe-nike-zoom.png', 'shoe-mizuno-wave.png', 'shoe-nike-vomero.png', 'shoe-mizuno-wave10.png']
# 5 cards across x=16 to 1888
# approximate widths ~370 each
step = (1888 - 16) / 5
for i, name in enumerate(shoe_names):
    x1 = int(16 + i * step + 4)
    x2 = int(16 + (i + 1) * step - 4)
    crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-192749.png', (x1, 326, x2, 804), name)

# 7. More to Discover 5 cards (tests/ksnip_20260904-192758.png)
# y=424 to 860
disc_names = ['disc-glasses.png', 'disc-caps.png', 'disc-beauty.png', 'disc-bags.png', 'disc-shoes.png']
step_disc = (1820 - 100) / 5
for i, name in enumerate(disc_names):
    x1 = int(100 + i * step_disc + 3)
    x2 = int(100 + (i + 1) * step_disc - 3)
    crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-192758.png', (x1, 424, x2, 860), name)

# 8. Explore Recommendations 4 cards (tests/ksnip_20260904-183648.png)
# y=696 to 994
rec_names = ['rec-new-arrivals.png', 'rec-361.png', 'rec-ten-eleven.png', 'rec-gatoni.png']
rec_x = [(74, 513), (530, 969), (985, 1425), (1440, 1880)]
for (x1, x2), name in zip(rec_x, rec_names):
    crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-183648.png', (x1, 696, x2, 994), name)

# 9. Product Detail Dual Photos & Thumbnails (tests/card-2-color.png)
# 5 Thumbnails on left: x=238 to 352
thumbs_y = [(268, 420), (430, 582), (592, 744), (754, 906), (916, 968)]
for i, (y1, y2) in enumerate(thumbs_y):
    crop_and_save('/home/kali/Desktop/shop/tests/card-2-color.png', (238, y1, 352, y2), f'insane-pant-thumb{i+1}.png')

# Dual Main Photos: y=268 to 968
# Photo 1: x=366 to 918
# Photo 2: x=922 to 1192
crop_and_save('/home/kali/Desktop/shop/tests/card-2-color.png', (366, 268, 918, 968), 'insane-pant-main1.png')
crop_and_save('/home/kali/Desktop/shop/tests/card-2-color.png', (922, 268, 1192, 968), 'insane-pant-main2.png')

# Color variants thumbs in detail page (Grey, Black)
crop_and_save('/home/kali/Desktop/shop/tests/card-2-color.png', (1222, 426, 1318, 544), 'swatch-grey.png')
crop_and_save('/home/kali/Desktop/shop/tests/card-2-color.png', (1324, 426, 1420, 544), 'swatch-black.png')

# 10. T-Shirt Details (tests/detaails-card.png)
crop_and_save('/home/kali/Desktop/shop/tests/detaails-card.png', (292, 154, 942, 968), 'jetburn-main1.png')
crop_and_save('/home/kali/Desktop/shop/tests/detaails-card.png', (950, 154, 1276, 968), 'jetburn-main2.png')
crop_and_save('/home/kali/Desktop/shop/tests/detaails-card.png', (1300, 344, 1396, 464), 'jetburn-swatch.png')

# 11. Similar Items 4 cards (tests/ksnip_20260904-184433.png)
# Cards at y=312 to 860
sim_x = [(100, 520), (534, 954), (968, 1388), (1402, 1822)]
for i, (x1, x2) in enumerate(sim_x):
    crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-184433.png', (x1, 312, x2, 860), f'similar-{i+1}.png')

# Similar Items page 2 (tests/ksnip_20260904-184443.png)
for i, (x1, x2) in enumerate(sim_x):
    crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-184443.png', (x1, 312, x2, 860), f'similar-{i+5}.png')

# 12. Footer payment badges and App QR (tests/ksnip_20260904-183829.png)
# App QR and store buttons: x=68 to 220, y=916 to 976
crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-183829.png', (68, 916, 220, 976), 'footer-app-badges.png')
# Payment icons: x=1550 to 1850, y=916 to 976
crop_and_save('/home/kali/Desktop/shop/tests/ksnip_20260904-183829.png', (1550, 914, 1850, 976), 'footer-payments.png')

print("All assets extracted successfully!")
