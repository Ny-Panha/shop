import re
import json

file_path = '/home/kali/Desktop/shop/Frontend/src/data/zandoProducts.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add gender: 'men' to all existing products (id 100 to 127)
# Pattern: find "category: '..." and if gender isn't there, add gender: 'men'
def add_men_gender(match):
    full = match.group(0)
    if "gender:" not in full:
        return full + "\n    gender: 'men',"
    return full

content = re.sub(r"category:\s*['\"][A-Z]+['\"],", add_men_gender, content)

women_products = [
  {
    "id": 201,
    "sku": "TEN-CROP-201",
    "name": "TEN11 អាវយឺតខ្លី (Protect The Dolls)",
    "nameEn": "TEN11 Protect The Dolls Crop Tee",
    "slug": "ten11-protect-the-dolls-crop-tee-201",
    "zandoSlug": "ten11-protect-the-dolls-crop-tee-201",
    "zandoCode": "10112607501",
    "brand": "TEN11",
    "category": "CLOTHES",
    "subCategory": "T-Shirts",
    "gender": "women",
    "price": 12.56,
    "compareAtPrice": 13.95,
    "discountPercent": 10,
    "badge": "-10%",
    "stock": 40,
    "shortDescription": "អាវយឺតនារីម៉ូតខ្លី Crop Top ស្ទាយ Streetwear បោះពុម្ពអក្សរ Protect The Dolls លើដើមទ្រូង សាច់ក្រណាត់ Cotton ត្រជាក់ទន់ស្រួលពាក់។",
    "imageUrl": "/zando-products/women/women_crop_tee.jpg",
    "hoverImageUrl": "/zando-products/women/women_crop_tee.jpg",
    "galleryImages": [
      "/zando-products/women/women_crop_tee.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_crop_tee.jpg",
      "/zando-products/women/women_crop_tee.jpg"
    ],
    "colorOptions": "Black, White",
    "sizes": ["XS", "S", "M", "L"],
    "ratingAverage": 4.9,
    "reviewCount": 42,
    "active": True
  },
  {
    "id": 202,
    "sku": "TEN-POLO-202",
    "name": "TEN11 អាវប៉ូឡូខ្លី Cropped Double Layer",
    "nameEn": "TEN11 Cropped Double Layer Polo Shirt",
    "slug": "ten11-cropped-double-layer-polo-shirt-202",
    "zandoSlug": "ten11-cropped-double-layer-polo-shirt-202",
    "zandoCode": "10112607502",
    "brand": "TEN11",
    "category": "CLOTHES",
    "subCategory": "polo shirts",
    "gender": "women",
    "price": 16.50,
    "compareAtPrice": 19.95,
    "discountPercent": 17,
    "badge": "🌟 New In",
    "stock": 30,
    "shortDescription": "អាវប៉ូឡូនារីម៉ូតកាត់ខ្លីទាន់សម័យ មានស្រទាប់ពីរជាន់ ស្ទីលកូរ៉េ ផ្តល់ភាពស្រស់ស្អាតនិងមានទំនុកចិត្ត។",
    "imageUrl": "/zando-products/women/women_crop_polo.jpg",
    "hoverImageUrl": "/zando-products/women/women_crop_polo.jpg",
    "galleryImages": [
      "/zando-products/women/women_crop_polo.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_crop_polo.jpg",
      "/zando-products/women/women_crop_polo.jpg"
    ],
    "colorOptions": "White, Beige",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 4.8,
    "reviewCount": 29,
    "active": True
  },
  {
    "id": 203,
    "sku": "ROU-SHIRT-203",
    "name": "ROUTINE អាវសឺមីខ្លី Asymmetrical Crop",
    "nameEn": "ROUTINE Asymmetrical Cropped Shirt",
    "slug": "routine-asymmetrical-cropped-shirt-203",
    "zandoSlug": "routine-asymmetrical-cropped-shirt-203",
    "zandoCode": "10112607503",
    "brand": "ROUTINE",
    "category": "CLOTHES",
    "subCategory": "Shirts",
    "gender": "women",
    "price": 22.00,
    "compareAtPrice": 25.00,
    "discountPercent": 12,
    "badge": "⭐ Collection",
    "stock": 25,
    "shortDescription": "អាវសឺមីនារីម៉ូតកាត់ជាយមិនស្មើគ្នា Asymmetrical ផ្តល់នូវភាពលេចធ្លោបែប Minimalist Fashion។",
    "imageUrl": "/zando-products/women/women_crop_shirt.jpg",
    "hoverImageUrl": "/zando-products/women/women_crop_shirt.jpg",
    "galleryImages": [
      "/zando-products/women/women_crop_shirt.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_crop_shirt.jpg",
      "/zando-products/women/women_crop_shirt.jpg"
    ],
    "colorOptions": "Sky Blue, Off-White",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 5.0,
    "reviewCount": 18,
    "active": True
  },
  {
    "id": 204,
    "sku": "ROU-BLOUSE-204",
    "name": "ROUTINE អាវសឺមីនារីសាច់ទន់ Vintage Blouse",
    "nameEn": "ROUTINE Vintage Elegant Blouse",
    "slug": "routine-vintage-elegant-blouse-204",
    "zandoSlug": "routine-vintage-elegant-blouse-204",
    "zandoCode": "10112607504",
    "brand": "ROUTINE",
    "category": "CLOTHES",
    "subCategory": "Shirts",
    "gender": "women",
    "price": 24.95,
    "compareAtPrice": None,
    "discountPercent": 0,
    "badge": "🌟 Vintage",
    "stock": 35,
    "shortDescription": "អាវសឺមីនារីសាច់សូត្ររលាស់ ម៉ូត Vintage ទន់ស្រួលពាក់ ស័ក្តិសមសម្រាប់ចូលរួមកម្មវិធី និងធ្វើការ។",
    "imageUrl": "/zando-products/women/women_blouse.jpg",
    "hoverImageUrl": "/zando-products/women/women_blouse.jpg",
    "galleryImages": [
      "/zando-products/women/women_blouse.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_blouse.jpg",
      "/zando-products/women/women_blouse.jpg"
    ],
    "colorOptions": "Ivory Cream, Soft Peach",
    "sizes": ["S", "M", "L", "XL"],
    "ratingAverage": 4.9,
    "reviewCount": 51,
    "active": True
  },
  {
    "id": 205,
    "sku": "GAT-DRESS-205",
    "name": "GATONI រ៉ូបនារី Regular Fitted Dress",
    "nameEn": "GATONI Regular Fitted Midi Dress",
    "slug": "gatoni-regular-fitted-midi-dress-205",
    "zandoSlug": "gatoni-regular-fitted-midi-dress-205",
    "zandoCode": "10112607505",
    "brand": "GATONI",
    "category": "CLOTHES",
    "subCategory": "Dresses",
    "gender": "women",
    "price": 32.95,
    "compareAtPrice": 39.95,
    "discountPercent": 18,
    "badge": "🌟 Gatoni Women",
    "stock": 20,
    "shortDescription": "រ៉ូបនារីរាងស្អាតលើកសម្រស់ ម៉ូត Midi Dress ពណ៌ទន់ភ្លឺ សាច់ក្រណាត់ប្រណិត ផ្តល់ភាពថ្លៃថ្នូរ។",
    "imageUrl": "/zando-products/women/women_fitted_dress.jpg",
    "hoverImageUrl": "/zando-products/women/women_fitted_dress.jpg",
    "galleryImages": [
      "/zando-products/women/women_fitted_dress.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_fitted_dress.jpg",
      "/zando-products/women/women_fitted_dress.jpg"
    ],
    "colorOptions": "Nacreous Cloud, Rose Tint",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 4.9,
    "reviewCount": 33,
    "active": True
  },
  {
    "id": 206,
    "sku": "GAT-MAXI-206",
    "name": "GATONI រ៉ូបខ្សែទោល Spaghetti Strap Maxi",
    "nameEn": "GATONI Spaghetti Strap Maxi Dress",
    "slug": "gatoni-spaghetti-strap-maxi-dress-206",
    "zandoSlug": "gatoni-spaghetti-strap-maxi-dress-206",
    "zandoCode": "10112607506",
    "brand": "GATONI",
    "category": "CLOTHES",
    "subCategory": "Dresses",
    "gender": "women",
    "price": 36.00,
    "compareAtPrice": 45.00,
    "discountPercent": 20,
    "badge": "-20%",
    "stock": 18,
    "shortDescription": "រ៉ូបខ្សែទោលជើងវែង Maxi Dress សម្រាប់ដើរលេងសមុទ្រ ឬពិធីជប់លៀង រំលេចភាពសិចស៊ី និងទាក់ទាញ។",
    "imageUrl": "/zando-products/women/women_spaghetti_dress.jpg",
    "hoverImageUrl": "/zando-products/women/women_spaghetti_dress.jpg",
    "galleryImages": [
      "/zando-products/women/women_spaghetti_dress.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_spaghetti_dress.jpg",
      "/zando-products/women/women_spaghetti_dress.jpg"
    ],
    "colorOptions": "Crimson Sunset, Ocean Navy",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 5.0,
    "reviewCount": 44,
    "active": True
  },
  {
    "id": 207,
    "sku": "GAT-SATIN-207",
    "name": "GATONI រ៉ូបសូត្រ Satin Pajama Dress",
    "nameEn": "GATONI Satin Elegance Party Dress",
    "slug": "gatoni-satin-elegance-party-dress-207",
    "zandoSlug": "gatoni-satin-elegance-party-dress-207",
    "zandoCode": "10112607507",
    "brand": "GATONI",
    "category": "CLOTHES",
    "subCategory": "Dresses",
    "gender": "women",
    "price": 39.95,
    "compareAtPrice": 49.95,
    "discountPercent": 20,
    "badge": "⭐ Luxury",
    "stock": 15,
    "shortDescription": "រ៉ូបសូត្រសុទ្ធ Satin Silk រលោងស្រិល ទន់ត្រជាក់ប៉ះស្បែក ផ្តល់នូវអារម្មណ៍ប្រណិតកម្រិតខ្ពស់។",
    "imageUrl": "/zando-products/women/women_satin_dress.jpg",
    "hoverImageUrl": "/zando-products/women/women_satin_dress.jpg",
    "galleryImages": [
      "/zando-products/women/women_satin_dress.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_satin_dress.jpg",
      "/zando-products/women/women_satin_dress.jpg"
    ],
    "colorOptions": "Champagne Gold, Emerald Green",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 4.8,
    "reviewCount": 27,
    "active": True
  },
  {
    "id": 208,
    "sku": "TEN-SKIRT-208",
    "name": "TEN11 សំពត់ខ្លីបែបការ៉ូ Mini Karo Skirt",
    "nameEn": "TEN11 Mini Karo Pleated Skirt",
    "slug": "ten11-mini-karo-pleated-skirt-208",
    "zandoSlug": "ten11-mini-karo-pleated-skirt-208",
    "zandoCode": "10112607508",
    "brand": "TEN11",
    "category": "CLOTHES",
    "subCategory": "Skirts",
    "gender": "women",
    "price": 18.00,
    "compareAtPrice": 22.00,
    "discountPercent": 18,
    "badge": "🌟 Korean Style",
    "stock": 35,
    "shortDescription": "សំពត់ខ្លីបែបការ៉ូស្ទាយយុវវ័យកូរ៉េ មានផ្នត់ស្អាត និងខោខាងក្នុងសុវត្ថិភាព ងាយស្រួលធ្វើសកម្មភាព។",
    "imageUrl": "/zando-products/women/women_karo_skirt.jpg",
    "hoverImageUrl": "/zando-products/women/women_karo_skirt.jpg",
    "galleryImages": [
      "/zando-products/women/women_karo_skirt.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_karo_skirt.jpg",
      "/zando-products/women/women_karo_skirt.jpg"
    ],
    "colorOptions": "Gray Plaid, Navy Plaid",
    "sizes": ["XS", "S", "M", "L"],
    "ratingAverage": 4.9,
    "reviewCount": 65,
    "active": True
  },
  {
    "id": 209,
    "sku": "TEN-LACE-209",
    "name": "TEN11 សំពត់ខ្លីប៉ាក់ផ្កា Lace Mini Skirt",
    "nameEn": "TEN11 Lace Mini Skirt",
    "slug": "ten11-lace-mini-skirt-209",
    "zandoSlug": "ten11-lace-mini-skirt-209",
    "zandoCode": "10112607509",
    "brand": "TEN11",
    "category": "CLOTHES",
    "subCategory": "Skirts",
    "gender": "women",
    "price": 19.50,
    "compareAtPrice": None,
    "discountPercent": 0,
    "badge": "⭐ Trending",
    "stock": 25,
    "shortDescription": "សំពត់ខ្លីប៉ាក់ផ្កាស្រាលស្រទន់ បែប Fairycore ផ្តល់នូវភាពទន់ភ្លន់ និងគួរឱ្យស្រឡាញ់។",
    "imageUrl": "/zando-products/women/women_lace_skirt.jpg",
    "hoverImageUrl": "/zando-products/women/women_lace_skirt.jpg",
    "galleryImages": [
      "/zando-products/women/women_lace_skirt.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_lace_skirt.jpg",
      "/zando-products/women/women_lace_skirt.jpg"
    ],
    "colorOptions": "White Lace, Cream",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 4.7,
    "reviewCount": 19,
    "active": True
  },
  {
    "id": 210,
    "sku": "ROU-MIDI-210",
    "name": "ROUTINE សំពត់វែងរលាស់ Midi Skirt",
    "nameEn": "ROUTINE Flowy Midi Skirt",
    "slug": "routine-flowy-midi-skirt-210",
    "zandoSlug": "routine-flowy-midi-skirt-210",
    "zandoCode": "10112607510",
    "brand": "ROUTINE",
    "category": "CLOTHES",
    "subCategory": "Skirts",
    "gender": "women",
    "price": 21.00,
    "compareAtPrice": 26.00,
    "discountPercent": 19,
    "badge": "🌟 Popular",
    "stock": 30,
    "shortDescription": "សំពត់វែងត្រឹមជង្គង់រលាស់ស្អាត សាច់ក្រណាត់ Cotton Blend ត្រជាក់ស្រួលពាក់ពេញមួយថ្ងៃ។",
    "imageUrl": "/zando-products/women/women_midi_skirt.jpg",
    "hoverImageUrl": "/zando-products/women/women_midi_skirt.jpg",
    "galleryImages": [
      "/zando-products/women/women_midi_skirt.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_midi_skirt.jpg",
      "/zando-products/women/women_midi_skirt.jpg"
    ],
    "colorOptions": "Beige, Charcoal",
    "sizes": ["S", "M", "L", "XL"],
    "ratingAverage": 4.9,
    "reviewCount": 38,
    "active": True
  },
  {
    "id": 211,
    "sku": "ZAN-SLIM-211",
    "name": "ZANDO ខោខូវប៊យនារីរាងស្អាត Slim Fit",
    "nameEn": "ZANDO Slim Fit Denim Jeans",
    "slug": "zando-slim-fit-denim-jeans-211",
    "zandoSlug": "zando-slim-fit-denim-jeans-211",
    "zandoCode": "10112607511",
    "brand": "ZANDO",
    "category": "CLOTHES",
    "subCategory": "Jeans",
    "gender": "women",
    "price": 28.95,
    "compareAtPrice": 35.00,
    "discountPercent": 17,
    "badge": "🌟 Best Seller",
    "stock": 45,
    "shortDescription": "ខោខូវប៊យនារីម៉ូតរាង Slim Fit លើករាងស្អាត យឺតបន្តិចស្រួលពាក់ គុណភាពលំដាប់ខ្ពស់។",
    "imageUrl": "/zando-products/women/women_slim_jeans.jpg",
    "hoverImageUrl": "/zando-products/women/women_slim_jeans.jpg",
    "galleryImages": [
      "/zando-products/women/women_slim_jeans.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_slim_jeans.jpg",
      "/zando-products/women/women_slim_jeans.jpg"
    ],
    "colorOptions": "Light Blue, Dark Indigo",
    "sizes": ["26", "27", "28", "29", "30"],
    "ratingAverage": 4.9,
    "reviewCount": 78,
    "active": True
  },
  {
    "id": 212,
    "sku": "TEN-WIDE-212",
    "name": "TEN11 ខោខូវប៊យជើងធំ Wide Leg Jeans",
    "nameEn": "TEN11 Wide Leg Streetwear Jeans",
    "slug": "ten11-wide-leg-streetwear-jeans-212",
    "zandoSlug": "ten11-wide-leg-streetwear-jeans-212",
    "zandoCode": "10112607512",
    "brand": "TEN11",
    "category": "CLOTHES",
    "subCategory": "Jeans",
    "gender": "women",
    "price": 32.50,
    "compareAtPrice": 38.00,
    "discountPercent": 14,
    "badge": "🔥 Street Style",
    "stock": 35,
    "shortDescription": "ខោខូវប៊យនារីជើងធំបែប Hip-Hop Streetwear ទាន់សម័យបំផុតក្នុងឆ្នាំ 2026 ស័ក្តិសមជាមួយអាវ Crop Top។",
    "imageUrl": "/zando-products/women/women_wide_jeans.jpg",
    "hoverImageUrl": "/zando-products/women/women_wide_jeans.jpg",
    "galleryImages": [
      "/zando-products/women/women_wide_jeans.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_wide_jeans.jpg",
      "/zando-products/women/women_wide_jeans.jpg"
    ],
    "colorOptions": "Vintage Washed Blue, Ash Grey",
    "sizes": ["26", "27", "28", "29", "30", "32"],
    "ratingAverage": 5.0,
    "reviewCount": 92,
    "active": True
  },
  {
    "id": 213,
    "sku": "BAY-STR-213",
    "name": "BAYSIC ខោខូវប៊យជើងត្រង់ Straight Leg",
    "nameEn": "BAYSIC Classic Straight Leg Jeans",
    "slug": "baysic-classic-straight-leg-jeans-213",
    "zandoSlug": "baysic-classic-straight-leg-jeans-213",
    "zandoCode": "10112607513",
    "brand": "BAYSIC",
    "category": "CLOTHES",
    "subCategory": "Jeans",
    "gender": "women",
    "price": 26.00,
    "compareAtPrice": 29.95,
    "discountPercent": 13,
    "badge": "🌟 Everyday",
    "stock": 40,
    "shortDescription": "ខោខូវប៊យនារីជើងត្រង់បែប Classic ងាយស្រួលចាប់គូជាមួយគ្រប់ម៉ូតអាវ និងពាក់បានគ្រប់កាលៈទេសៈ។",
    "imageUrl": "/zando-products/women/women_straight_jeans.jpg",
    "hoverImageUrl": "/zando-products/women/women_straight_jeans.jpg",
    "galleryImages": [
      "/zando-products/women/women_straight_jeans.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_straight_jeans.jpg",
      "/zando-products/women/women_straight_jeans.jpg"
    ],
    "colorOptions": "Medium Denim, Solid Black",
    "sizes": ["26", "27", "28", "29", "30"],
    "ratingAverage": 4.8,
    "reviewCount": 35,
    "active": True
  },
  {
    "id": 214,
    "sku": "LAS-JACK-214",
    "name": "LASOL អាវក្រៅនារីម៉ូដទាន់សម័យ Serve Jacket",
    "nameEn": "LASOL Fitted Cropped Jacket",
    "slug": "lasol-fitted-cropped-jacket-214",
    "zandoSlug": "lasol-fitted-cropped-jacket-214",
    "zandoCode": "10112607514",
    "brand": "LASOL",
    "category": "CLOTHES",
    "subCategory": "Jackets",
    "gender": "women",
    "price": 34.00,
    "compareAtPrice": 42.00,
    "discountPercent": 19,
    "badge": "🌟 Trend",
    "stock": 20,
    "shortDescription": "អាវក្រៅនារីម៉ូតកាត់រាងខ្លីបន្តិច បង្កើនភាពជឿជាក់ និងទាក់ទាញភ្នែកពេលពាក់ចេញក្រៅ។",
    "imageUrl": "/zando-products/women/women_fitted_jacket.jpg",
    "hoverImageUrl": "/zando-products/women/women_fitted_jacket.jpg",
    "galleryImages": [
      "/zando-products/women/women_fitted_jacket.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_fitted_jacket.jpg",
      "/zando-products/women/women_fitted_jacket.jpg"
    ],
    "colorOptions": "Olive Khaki, Midnight Black",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 4.9,
    "reviewCount": 41,
    "active": True
  },
  {
    "id": 215,
    "sku": "ROU-JACK-215",
    "name": "ROUTINE អាវក្រៅរដូវត្រជាក់ Regular Jacket",
    "nameEn": "ROUTINE Regular Casual Jacket",
    "slug": "routine-regular-casual-jacket-215",
    "zandoSlug": "routine-regular-casual-jacket-215",
    "zandoCode": "10112607515",
    "brand": "ROUTINE",
    "category": "CLOTHES",
    "subCategory": "Jackets",
    "gender": "women",
    "price": 38.50,
    "compareAtPrice": None,
    "discountPercent": 0,
    "badge": "⭐ Warmth",
    "stock": 22,
    "shortDescription": "អាវក្រៅនារីសាច់ក្រាស់ទន់ ការពារខ្យល់ត្រជាក់ និងកម្តៅថ្ងៃបានល្អឥតខ្ចោះ ឌីហ្សាញបែប Premium។",
    "imageUrl": "/zando-products/women/women_regular_jacket.jpg",
    "hoverImageUrl": "/zando-products/women/women_regular_jacket.jpg",
    "galleryImages": [
      "/zando-products/women/women_regular_jacket.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_regular_jacket.jpg",
      "/zando-products/women/women_regular_jacket.jpg"
    ],
    "colorOptions": "Camel Brown, Soft Cream",
    "sizes": ["S", "M", "L", "XL"],
    "ratingAverage": 4.8,
    "reviewCount": 23,
    "active": True
  },
  {
    "id": 216,
    "sku": "BAY-TEE-216",
    "name": "BAYSIC អាវយឺតដៃវែង Relaxed T-Shirt",
    "nameEn": "BAYSIC Relaxed Long Sleeve T-Shirt",
    "slug": "baysic-relaxed-long-sleeve-t-shirt-216",
    "zandoSlug": "baysic-relaxed-long-sleeve-t-shirt-216",
    "zandoCode": "10112607516",
    "brand": "BAYSIC",
    "category": "CLOTHES",
    "subCategory": "T-Shirts",
    "gender": "women",
    "price": 14.00,
    "compareAtPrice": 16.50,
    "discountPercent": 15,
    "badge": "🌟 Basic Must-Have",
    "stock": 50,
    "shortDescription": "អាវយឺតដៃវែងនារីសាច់ក្រណាត់កប្បាស 100% Cotton ទន់ស្រាល មានផាសុកភាពខ្ពស់។",
    "imageUrl": "/zando-products/women/women_long_sleeve_tee.jpg",
    "hoverImageUrl": "/zando-products/women/women_long_sleeve_tee.jpg",
    "galleryImages": [
      "/zando-products/women/women_long_sleeve_tee.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_long_sleeve_tee.jpg",
      "/zando-products/women/women_long_sleeve_tee.jpg"
    ],
    "colorOptions": "White, Heather Gray, Black",
    "sizes": ["XS", "S", "M", "L"],
    "ratingAverage": 4.9,
    "reviewCount": 67,
    "active": True
  },
  {
    "id": 217,
    "sku": "TEN-GRAPH-217",
    "name": "TEN11 អាវយឺតរូបបោះពុម្ព Graphic Print",
    "nameEn": "TEN11 Oversized Graphic Print Tee",
    "slug": "ten11-oversized-graphic-print-tee-217",
    "zandoSlug": "ten11-oversized-graphic-print-tee-217",
    "zandoCode": "10112607517",
    "brand": "TEN11",
    "category": "CLOTHES",
    "subCategory": "T-Shirts",
    "gender": "women",
    "price": 15.50,
    "compareAtPrice": 18.00,
    "discountPercent": 14,
    "badge": "⭐ New",
    "stock": 40,
    "shortDescription": "អាវយឺតនារីម៉ូត Oversized បោះពុម្ពរូបក្រាហ្វិកបែបសិល្បៈសម័យ ងាយស្រួលស្លៀកលេងស្ទាយ Chill។",
    "imageUrl": "/zando-products/women/women_graphic_tee.jpg",
    "hoverImageUrl": "/zando-products/women/women_graphic_tee.jpg",
    "galleryImages": [
      "/zando-products/women/women_graphic_tee.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_graphic_tee.jpg",
      "/zando-products/women/women_graphic_tee.jpg"
    ],
    "colorOptions": "Charcoal Black, Sand White",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 4.8,
    "reviewCount": 31,
    "active": True
  },
  {
    "id": 218,
    "sku": "ROU-KNIT-218",
    "name": "ROUTINE អាវប៉ូឡូសាច់ចាក់ Knitted Polo",
    "nameEn": "ROUTINE Regular Knitted Polo Top",
    "slug": "routine-regular-knitted-polo-top-218",
    "zandoSlug": "routine-regular-knitted-polo-top-218",
    "zandoCode": "10112607518",
    "brand": "ROUTINE",
    "category": "CLOTHES",
    "subCategory": "polo shirts",
    "gender": "women",
    "price": 19.95,
    "compareAtPrice": 24.00,
    "discountPercent": 17,
    "badge": "🌟 Knitwear",
    "stock": 25,
    "shortDescription": "អាវប៉ូឡូនារីសាច់ចាក់បែបម៉ដ្ឋស្អាត ពណ៌ស្រស់ និងរលោង ផ្តល់នូវភាពទន់ភ្លន់បែបនារីសម័យថ្មី។",
    "imageUrl": "/zando-products/women/women_knit_polo.jpg",
    "hoverImageUrl": "/zando-products/women/women_knit_polo.jpg",
    "galleryImages": [
      "/zando-products/women/women_knit_polo.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_knit_polo.jpg",
      "/zando-products/women/women_knit_polo.jpg"
    ],
    "colorOptions": "Sage Green, Pastel Pink",
    "sizes": ["S", "M", "L"],
    "ratingAverage": 4.9,
    "reviewCount": 39,
    "active": True
  },
  {
    "id": 219,
    "sku": "BAY-POLO-219",
    "name": "BAYSIC អាវប៉ូឡូរលុង Loose Fitted Polo",
    "nameEn": "BAYSIC Loose Fitted Polo Top",
    "slug": "baysic-loose-fitted-polo-top-219",
    "zandoSlug": "baysic-loose-fitted-polo-top-219",
    "zandoCode": "10112607519",
    "brand": "BAYSIC",
    "category": "CLOTHES",
    "subCategory": "polo shirts",
    "gender": "women",
    "price": 16.00,
    "compareAtPrice": None,
    "discountPercent": 0,
    "badge": "⭐ Everyday",
    "stock": 35,
    "shortDescription": "អាវប៉ូឡូនារីម៉ូតរលុងទូលាយ ស្រួលពាក់ដើរលេង ហាត់ប្រាណ ឬការងារធម្មតា។",
    "imageUrl": "/zando-products/women/women_loose_polo.jpg",
    "hoverImageUrl": "/zando-products/women/women_loose_polo.jpg",
    "galleryImages": [
      "/zando-products/women/women_loose_polo.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_loose_polo.jpg",
      "/zando-products/women/women_loose_polo.jpg"
    ],
    "colorOptions": "Navy Blue, White",
    "sizes": ["S", "M", "L", "XL"],
    "ratingAverage": 4.7,
    "reviewCount": 24,
    "active": True
  },
  {
    "id": 220,
    "sku": "361-RUN-220",
    "name": "361° ស្បែកជើងរត់នារី Lightweight Runner",
    "nameEn": "361° Lightweight Running Shoes",
    "slug": "361-lightweight-running-shoes-220",
    "zandoSlug": "361-lightweight-running-shoes-220",
    "zandoCode": "10112607520",
    "brand": "361",
    "category": "SHOES",
    "subCategory": "Running",
    "gender": "women",
    "price": 42.00,
    "compareAtPrice": 52.00,
    "discountPercent": 19,
    "badge": "🌟 361° Sport",
    "stock": 30,
    "shortDescription": "ស្បែកជើងរត់នារី 361° ទម្ងន់ស្រាលបំផុត បាតស្បែកជើងទន់ស្វិត បន្ថយការប៉ះទង្គិចដល់សន្លាក់ជើង។",
    "imageUrl": "/zando-products/women/women_runner_shoe.jpg",
    "hoverImageUrl": "/zando-products/women/women_runner_shoe.jpg",
    "galleryImages": [
      "/zando-products/women/women_runner_shoe.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_runner_shoe.jpg",
      "/zando-products/women/women_runner_shoe.jpg"
    ],
    "colorOptions": "Lavender Pink, Pure White",
    "sizes": ["36", "37", "38", "39", "40"],
    "ratingAverage": 4.9,
    "reviewCount": 84,
    "active": True
  },
  {
    "id": 221,
    "sku": "361-PERF-221",
    "name": "361° ស្បែកជើងកីឡានារី Performance Pro",
    "nameEn": "361° Performance Pro Running Shoes",
    "slug": "361-performance-pro-running-shoes-221",
    "zandoSlug": "361-performance-pro-running-shoes-221",
    "zandoCode": "10112607521",
    "brand": "361",
    "category": "SHOES",
    "subCategory": "Running",
    "gender": "women",
    "price": 48.00,
    "compareAtPrice": 60.00,
    "discountPercent": 20,
    "badge": "🔥 Pro Edition",
    "stock": 25,
    "shortDescription": "ស្បែកជើងរត់កម្រិតអាជីព បច្ចេកវិទ្យា Energy Rebound ជួយរុញជំហានរត់ឱ្យលឿននិងមិនរោយជើង។",
    "imageUrl": "/zando-products/women/women_perf_shoe.jpg",
    "hoverImageUrl": "/zando-products/women/women_perf_shoe.jpg",
    "galleryImages": [
      "/zando-products/women/women_perf_shoe.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_perf_shoe.jpg",
      "/zando-products/women/women_perf_shoe.jpg"
    ],
    "colorOptions": "Mint Frost, Triple Black",
    "sizes": ["36", "37", "38", "39", "40"],
    "ratingAverage": 5.0,
    "reviewCount": 49,
    "active": True
  },
  {
    "id": 222,
    "sku": "361-MESH-222",
    "name": "361° ស្បែកជើងប៉ាតានារី Chunky Mesh",
    "nameEn": "361° Chunky Mesh Streetwear Sneakers",
    "slug": "361-chunky-mesh-streetwear-sneakers-222",
    "zandoSlug": "361-chunky-mesh-streetwear-sneakers-222",
    "zandoCode": "10112607522",
    "brand": "361",
    "category": "SHOES",
    "subCategory": "Casual",
    "gender": "women",
    "price": 45.00,
    "compareAtPrice": 55.00,
    "discountPercent": 18,
    "badge": "🌟 Trendy",
    "stock": 35,
    "shortDescription": "ស្បែកជើងប៉ាតាម៉ូត Chunky បែប Street Fashion កំពុងពេញនិយម ក្រណាត់សំណាញ់ Mesh ងាយចេញខ្យល់។",
    "imageUrl": "/zando-products/women/women_mesh_shoe.jpg",
    "hoverImageUrl": "/zando-products/women/women_mesh_shoe.jpg",
    "galleryImages": [
      "/zando-products/women/women_mesh_shoe.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_mesh_shoe.jpg",
      "/zando-products/women/women_mesh_shoe.jpg"
    ],
    "colorOptions": "Beige White, Silver Gray",
    "sizes": ["36", "37", "38", "39", "40"],
    "ratingAverage": 4.9,
    "reviewCount": 57,
    "active": True
  },
  {
    "id": 223,
    "sku": "AMS-BAG-223",
    "name": "AMS កាបូបស្ពាយស្មាចំហៀង Leather Shoulder Bag",
    "nameEn": "AMS Elegant Leather Shoulder Bag",
    "slug": "ams-elegant-leather-shoulder-bag-223",
    "zandoSlug": "ams-elegant-leather-shoulder-bag-223",
    "zandoCode": "10112607523",
    "brand": "AMS",
    "category": "BAGS",
    "subCategory": "Shoulder Bags",
    "gender": "women",
    "price": 24.50,
    "compareAtPrice": 32.00,
    "discountPercent": 23,
    "badge": "🌟 Chic",
    "stock": 25,
    "shortDescription": "កាបូបស្ពាយស្មាចំហៀងស្បែកទន់រលោង ម៉ូតបែបបារាំង ដាក់ទូរស័ព្ទ និងសម្ភារៈតុបតែងខ្លួនបានច្រើន។",
    "imageUrl": "/zando-products/women/women_shoulder_bag.jpg",
    "hoverImageUrl": "/zando-products/women/women_shoulder_bag.jpg",
    "galleryImages": [
      "/zando-products/women/women_shoulder_bag.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_shoulder_bag.jpg",
      "/zando-products/women/women_shoulder_bag.jpg"
    ],
    "colorOptions": "Caramel Brown, Noir Black",
    "sizes": ["Free Size"],
    "ratingAverage": 4.9,
    "reviewCount": 46,
    "active": True
  },
  {
    "id": 224,
    "sku": "AMS-TOTE-224",
    "name": "AMS កាបូបយួរនារី Canvas Daily Tote Bag",
    "nameEn": "AMS Canvas Daily Tote Bag",
    "slug": "ams-canvas-daily-tote-bag-224",
    "zandoSlug": "ams-canvas-daily-tote-bag-224",
    "zandoCode": "10112607524",
    "brand": "AMS",
    "category": "BAGS",
    "subCategory": "Tote Bags",
    "gender": "women",
    "price": 18.90,
    "compareAtPrice": 22.00,
    "discountPercent": 14,
    "badge": "⭐ Eco Friendly",
    "stock": 45,
    "shortDescription": "កាបូបយួរក្រណាត់ Canvas មាំធន់ ផ្ទុកបានច្រើន ស័ក្តិសមសម្រាប់និស្សិត និងបុគ្គលិកការិយាល័យ។",
    "imageUrl": "/zando-products/women/women_tote_bag.jpg",
    "hoverImageUrl": "/zando-products/women/women_tote_bag.jpg",
    "galleryImages": [
      "/zando-products/women/women_tote_bag.jpg"
    ],
    "dualImages": [
      "/zando-products/women/women_tote_bag.jpg",
      "/zando-products/women/women_tote_bag.jpg"
    ],
    "colorOptions": "Natural Beige, Olive",
    "sizes": ["Standard"],
    "ratingAverage": 4.8,
    "reviewCount": 38,
    "active": True
  }
]

# Convert women_products to JS objects string
def to_js_obj(p):
    lines = ["  {"]
    for k, v in p.items():
        if isinstance(v, str):
            escaped = v.replace("'", "\\'")
            lines.append(f"    {k}: '{escaped}',")
        elif isinstance(v, bool):
            lines.append(f"    {k}: {'true' if v else 'false'},")
        elif v is None:
            lines.append(f"    {k}: null,")
        elif isinstance(v, list):
            items_str = ", ".join([f"'{item}'" for item in v])
            lines.append(f"    {k}: [{items_str}],")
        else:
            lines.append(f"    {k}: {v},")
    lines.append("  }")
    return "\n".join(lines)

women_js = ",\n" + ",\n".join([to_js_obj(p) for p in women_products])

# Insert women products right before the closing "];\n\n// ============================================================================="
target = "];\n\n// ============================================================================="
if target in content:
    content = content.replace(target, women_js + "\n" + target)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated zandoProducts.js with gender tags and 24 women products!")
else:
    print("Error: Target marker not found!")

