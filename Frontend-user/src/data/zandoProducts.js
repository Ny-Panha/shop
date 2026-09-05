export const ZANDO_BANNERS = {
  hero: {
    title: 'Hero Banner - TEN ELEVEN',
    imageUrl: '/zando-assets/hero-ten-eleven.png',
    link: '/men/new-in',
    cta: 'SHOP NOW',
    ctaKm: 'SHOP NOW'
  },
  brandStrip: '/zando-assets/brands-strip.png',
  mistBanner: '/zando-assets/gatoni-mist-banner.png',
  collections: [
    {
      id: 'mist',
      title: 'Men Through The Mist Collection',
      titleKm: 'ការប្រមូលផ្ដុំ Through The Mist',
      imageUrl: '/zando-assets/gatoni-mist-banner.png',
      link: '/men/collection'
    }
  ],
  categories: [
    { id: 'new-in', title: 'NEW IN', nameKm: 'ចូលថ្មី', img: '/zando-assets/cat-new-in.png', link: '/men/new-in' },
    { id: 'collections', title: 'COLLECTIONS', nameKm: 'ការប្រមូលផ្ដុំ', img: '/zando-assets/cat-collections.png', link: '/men/collection' },
    { id: 'smart-casual', title: 'SMART CASUAL', nameKm: 'ស្មាតកាស៊ួល', img: '/zando-assets/cat-smart-casual.png', link: '/men/clothing' },
    { id: 'officewear', title: 'OFFICEWEAR', nameKm: 'សម្លៀកបំពាក់ធ្វើការ', img: '/zando-assets/cat-officewear.png', link: '/men/clothing' }
  ],
  moreToDiscover: [
    { id: 'glasses', title: 'GLASSES', img: '/zando-assets/disc-glasses.png', link: '/men/accessories' },
    { id: 'caps', title: 'CAPS & HATS', img: '/zando-assets/disc-caps.png', link: '/men/accessories' },
    { id: 'beauty', title: 'BEAUTY', img: '/zando-assets/disc-beauty.png', link: '/men/beauty' },
    { id: 'bags', title: 'BAGS', img: '/zando-assets/disc-bags.png', link: '/men/bags' },
    { id: 'shoes', title: 'SHOES', img: '/zando-assets/disc-shoes.png', link: '/men/shoes' }
  ],
  recommendations: [
    { 
      id: 'rec-new', 
      title: 'NEW ARRIVALS', 
      subtitle: 'YOUR NEXT FAVORITE PIECE AWAITS.', 
      img: '/zando-assets/rec-new-arrivals.png', 
      link: '/men/new-in' 
    },
    { 
      id: 'rec-361', 
      title: '361° ONE DEGREE BEYOND', 
      subtitle: 'NOTHING CHANGES UNTIL YOU TAKE THE FIRST STEP.', 
      sub2: 'HIKING, RUNNING & SPORTS-GO BEYOND WITH 361°.',
      img: '/zando-assets/rec-361.png', 
      link: '/men/brand/361' 
    },
    { 
      id: 'rec-ten11', 
      title: 'TEN ELEVEN', 
      subtitle: 'LATEST COLLECTION "SWAGGER SYNDROME"', 
      img: '/zando-assets/rec-ten-eleven.png', 
      link: '/men/brand/ten-eleven' 
    },
    { 
      id: 'rec-gatoni', 
      title: 'GATONI', 
      subtitle: 'LATEST COLLECTION "THROUGH THE MIST | SS26"', 
      img: '/zando-assets/rec-gatoni.png', 
      link: '/men/brand/gatoni' 
    }
  ]
};

export const ZANDO_PRODUCTS = [];

// Automatically ensure every single product in the catalog has cool routes and legacy mappings
ZANDO_PRODUCTS.forEach(p => {
  const genderPath = p.gender === 'women' ? 'women' : 'men';
  const rawSlug = p.zandoSlug || p.slug || `product-${p.id}`;
  // Strip clumsy internal barcode/SKU digits from the slug (e.g. -10112607307 or -21226021645)
  const cleanSlug = rawSlug.replace(/-\d{4,}$/, '').replace(/-\d+$/, '') || rawSlug;

  p.cleanSlug = cleanSlug;
  p.coolPath = `/product/${cleanSlug}`;
  p.routeHash = `#/product/${cleanSlug}`;
  p.legacyHash = `#/khmer/${genderPath}/${rawSlug}${p.zandoCid ? '?cid=' + p.zandoCid : ''}`;
  if (!p.zandoUrl) {
    p.zandoUrl = `https://zandoshops.com/kh/khmer/${genderPath}/${rawSlug}`;
  }
});

export function getProductCleanUrl(p) {
  if (!p) return '/men';
  return p.coolPath || `/product/${p.cleanSlug || p.slug || p.id}`;
}

// =============================================================================
// COMPLETE LIST OF ALL 40 ZANDO TARGET URLS & ROUTING TABLE
// =============================================================================
export const ZANDO_ALL_40_URLS = [
  // Categories & Collections (4 URLs)
  {
    id: 'cat-1',
    type: 'category',
    title: "Men's New In",
    url: 'https://zandoshops.com/kh/khmer/men/clothes/men-new-in',
    hash: '#/khmer/men/clothes/men-new-in',
    badge: 'Category'
  },
  {
    id: 'cat-2',
    type: 'collection',
    title: 'Through The Mist Collection',
    url: 'https://zandoshops.com/kh/khmer/men/clothes/men-through-the-mist-collection',
    hash: '#/khmer/men/clothes/men-shop-by-collection',
    badge: 'Collection'
  },
  {
    id: 'cat-3',
    type: 'brand',
    title: 'Baysic Collection',
    url: 'https://zandoshops.com/kh/khmer/men/clothes/brand/baysic',
    hash: '#/clothes/brand/baysic',
    badge: 'Brand'
  },
  {
    id: 'cat-4',
    type: 'category',
    title: "Men's Shoes & Sneakers",
    url: 'https://zandoshops.com/kh/khmer/men/clothes/men-shoes',
    hash: '#/khmer/men/shoes',
    badge: 'Category'
  },

  // 18 Products x 2 URL formats = 36 Product URLs
  // 1. Jetburn Wash Graphic Rocket T-Shirt
  {
    id: 'p-1a',
    productId: 101,
    type: 'product',
    title: 'Jetburn Wash Graphic Rocket T-Shirt',
    url: 'https://zandoshops.com/kh/khmer/men/jetburn-wash-graphic-t-shirt-10112607307?cid=63',
    hash: '#/khmer/men/jetburn-wash-graphic-t-shirt-10112607307?cid=63',
    badge: '$17.95'
  },
  {
    id: 'p-1b',
    productId: 101,
    type: 'product',
    title: 'Jetburn Wash Graphic Rocket T-Shirt (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/jetburn-wash-graphic-t-shirt-10112607307%3Fcid=63',
    hash: '#/khmer/men/jetburn-wash-graphic-t-shirt-10112607307%3Fcid=63',
    badge: '$17.95'
  },

  // 2. DEVOTUS Inkfray Graphic Tee
  {
    id: 'p-2a',
    productId: 102,
    type: 'product',
    title: 'DEVOTUS Inkfray Graphic Tee',
    url: 'https://zandoshops.com/kh/khmer/men/devotus-inkfray-graphic-tee-10112607292?cid=63',
    hash: '#/khmer/men/devotus-inkfray-graphic-tee-10112607292?cid=63',
    badge: '$21.95'
  },
  {
    id: 'p-2b',
    productId: 102,
    type: 'product',
    title: 'DEVOTUS Inkfray Graphic Tee (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/devotus-inkfray-graphic-tee-10112607292%3Fcid=63',
    hash: '#/khmer/men/devotus-inkfray-graphic-tee-10112607292%3Fcid=63',
    badge: '$21.95'
  },

  // 3. DEVOTUS Essential Rib Tank Top
  {
    id: 'p-3a',
    productId: 103,
    type: 'product',
    title: 'DEVOTUS Essential Rib Tank Top',
    url: 'https://zandoshops.com/kh/khmer/men/devotus-essential-rib-tank-top-10112607279?cid=381',
    hash: '#/khmer/men/devotus-essential-rib-tank-top-10112607279?cid=381',
    badge: '$13.95'
  },
  {
    id: 'p-3b',
    productId: 103,
    type: 'product',
    title: 'DEVOTUS Essential Rib Tank Top (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/devotus-essential-rib-tank-top-10112607279%3Fcid=381',
    hash: '#/khmer/men/devotus-essential-rib-tank-top-10112607279%3Fcid=381',
    badge: '$13.95'
  },

  // 4. Milo Striped Long Sleeve Polo Tee
  {
    id: 'p-4a',
    productId: 104,
    type: 'product',
    title: 'Milo Striped Long Sleeve Polo Tee',
    url: 'https://zandoshops.com/kh/khmer/men/milo-striped-long-sleeve-polo-tee-10112607244?cid=96',
    hash: '#/khmer/men/milo-striped-long-sleeve-polo-tee-10112607244?cid=96',
    badge: '$28.59'
  },
  {
    id: 'p-4b',
    productId: 104,
    type: 'product',
    title: 'Milo Striped Long Sleeve Polo Tee (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/milo-striped-long-sleeve-polo-tee-10112607244%3Fcid=96',
    hash: '#/khmer/men/milo-striped-long-sleeve-polo-tee-10112607244%3Fcid=96',
    badge: '$28.59'
  },

  // 5. Layer Script Long Sleeve
  {
    id: 'p-5a',
    productId: 105,
    type: 'product',
    title: 'Layer Script Long Sleeve',
    url: 'https://zandoshops.com/kh/khmer/men/layer-script-long-sleeve-10112607277?cid=53',
    hash: '#/khmer/men/layer-script-long-sleeve-10112607277?cid=53',
    badge: '$23.95'
  },
  {
    id: 'p-5b',
    productId: 105,
    type: 'product',
    title: 'Layer Script Long Sleeve (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/layer-script-long-sleeve-10112607277%3Fcid=53',
    hash: '#/khmer/men/layer-script-long-sleeve-10112607277%3Fcid=53',
    badge: '$23.95'
  },

  // 6. DEVOTUS Wake Up Graphic Tee
  {
    id: 'p-6a',
    productId: 106,
    type: 'product',
    title: 'DEVOTUS Wake Up Graphic Tee',
    url: 'https://zandoshops.com/kh/khmer/men/devotus-wake-up-graphic-tee-10112607282?cid=63',
    hash: '#/khmer/men/devotus-wake-up-graphic-tee-10112607282?cid=63',
    badge: '$21.95'
  },
  {
    id: 'p-6b',
    productId: 106,
    type: 'product',
    title: 'DEVOTUS Wake Up Graphic Tee (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/devotus-wake-up-graphic-tee-10112607282%3Fcid=63',
    hash: '#/khmer/men/devotus-wake-up-graphic-tee-10112607282%3Fcid=63',
    badge: '$21.95'
  },

  // 7. Essential Striped Crew Neck T-Shirt
  {
    id: 'p-7a',
    productId: 107,
    type: 'product',
    title: 'Essential Striped Crew Neck T-Shirt',
    url: 'https://zandoshops.com/kh/khmer/men/essential-striped-crew-neck-t-shirt-21226061897?cid=63',
    hash: '#/khmer/men/essential-striped-crew-neck-t-shirt-21226061897?cid=63',
    badge: '$12.23'
  },
  {
    id: 'p-7b',
    productId: 107,
    type: 'product',
    title: 'Essential Striped Crew Neck T-Shirt (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/essential-striped-crew-neck-t-shirt-21226061897%3Fcid=63',
    hash: '#/khmer/men/essential-striped-crew-neck-t-shirt-21226061897%3Fcid=63',
    badge: '$12.23'
  },

  // 8. Comfort First Layered T-Shirt
  {
    id: 'p-8a',
    productId: 108,
    type: 'product',
    title: 'Comfort First Layered T-Shirt',
    url: 'https://zandoshops.com/kh/khmer/men/comfort-first-layered-t-shirt-21226021890?cid=41',
    hash: '#/khmer/men/comfort-first-layered-t-shirt-21226021890?cid=41',
    badge: '$15.26'
  },
  {
    id: 'p-8b',
    productId: 108,
    type: 'product',
    title: 'Comfort First Layered T-Shirt (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/comfort-first-layered-t-shirt-21226021890%3Fcid=41',
    hash: '#/khmer/men/comfort-first-layered-t-shirt-21226021890%3Fcid=41',
    badge: '$15.26'
  },

  // 9. Relaxed Plaid Short Sleeve Shirt
  {
    id: 'p-9a',
    productId: 109,
    type: 'product',
    title: 'Relaxed Plaid Short Sleeve Shirt',
    url: 'https://zandoshops.com/kh/khmer/men/relaxed-plaid-short-sleeve-shirt-11226031754?cid=63',
    hash: '#/khmer/men/relaxed-plaid-short-sleeve-shirt-11226031754?cid=63',
    badge: '$14.69'
  },
  {
    id: 'p-9b',
    productId: 109,
    type: 'product',
    title: 'Relaxed Plaid Short Sleeve Shirt (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/relaxed-plaid-short-sleeve-shirt-11226031754%3Fcid=63',
    hash: '#/khmer/men/relaxed-plaid-short-sleeve-shirt-11226031754%3Fcid=63',
    badge: '$14.69'
  },

  // 10. Relaxed Fit Wide Leg Jeans
  {
    id: 'p-10a',
    productId: 110,
    type: 'product',
    title: 'Relaxed Fit Wide Leg Jeans',
    url: 'https://zandoshops.com/kh/khmer/men/relaxed-fit-wide-leg-jeans-2112605911?cid=63',
    hash: '#/khmer/men/relaxed-fit-wide-leg-jeans-2112605911?cid=63',
    badge: '$18.86'
  },
  {
    id: 'p-10b',
    productId: 110,
    type: 'product',
    title: 'Relaxed Fit Wide Leg Jeans (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/relaxed-fit-wide-leg-jeans-2112605911%3Fcid=63',
    hash: '#/khmer/men/relaxed-fit-wide-leg-jeans-2112605911%3Fcid=63',
    badge: '$18.86'
  },

  // 11. Nike Free Metcon 6 Workout Sneakers
  {
    id: 'p-11a',
    productId: 111,
    type: 'product',
    title: 'Nike Free Metcon 6 Workout Sneakers',
    url: 'https://zandoshops.com/kh/khmer/men/nike-free-metcon-6-workout-sneakers-141142607001?cid=504',
    hash: '#/khmer/men/nike-free-metcon-6-workout-sneakers-141142607001?cid=504',
    badge: '$147.00'
  },
  {
    id: 'p-11b',
    productId: 111,
    type: 'product',
    title: 'Nike Free Metcon 6 Workout Sneakers (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/nike-free-metcon-6-workout-sneakers-141142607001%3Fcid=504',
    hash: '#/khmer/men/nike-free-metcon-6-workout-sneakers-141142607001%3Fcid=504',
    badge: '$147.00'
  },

  // 12. Air Zoom Rival Fly 4 Running Sneakers
  {
    id: 'p-12a',
    productId: 112,
    type: 'product',
    title: 'Air Zoom Rival Fly 4 Running Sneakers',
    url: 'https://zandoshops.com/kh/khmer/men/air-zoom-rival-fly-4-running-sneakers-14192607015?cid=39',
    hash: '#/khmer/men/air-zoom-rival-fly-4-running-sneakers-14192607015?cid=39',
    badge: '$122.00'
  },
  {
    id: 'p-12b',
    productId: 112,
    type: 'product',
    title: 'Air Zoom Rival Fly 4 Running Sneakers (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/air-zoom-rival-fly-4-running-sneakers-14192607015%3Fcid=39',
    hash: '#/khmer/men/air-zoom-rival-fly-4-running-sneakers-14192607015%3Fcid=39',
    badge: '$122.00'
  },

  // 13. Wave Rider 10 Unisex
  {
    id: 'p-13a',
    productId: 113,
    type: 'product',
    title: 'Wave Rider 10 Unisex',
    url: 'https://zandoshops.com/kh/khmer/men/wave-rider-10-unisex-14112607001?cid=63',
    hash: '#/khmer/men/wave-rider-10-unisex-14112607001?cid=63',
    badge: '$148.00'
  },
  {
    id: 'p-13b',
    productId: 113,
    type: 'product',
    title: 'Wave Rider 10 Unisex (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/wave-rider-10-unisex-14112607001%3Fcid=63',
    hash: '#/khmer/men/wave-rider-10-unisex-14112607001%3Fcid=63',
    badge: '$148.00'
  },

  // 14. Nike Vomero 5 Metallic Silver Sneakers
  {
    id: 'p-14a',
    productId: 114,
    type: 'product',
    title: 'Nike Vomero 5 Metallic Silver Sneakers',
    url: 'https://zandoshops.com/kh/khmer/men/nike-vomero-5-metallic-silver-sneakers-14192607008?cid=414',
    hash: '#/khmer/men/nike-vomero-5-metallic-silver-sneakers-14192607008?cid=414',
    badge: '$195.00'
  },
  {
    id: 'p-14b',
    productId: 114,
    type: 'product',
    title: 'Nike Vomero 5 Metallic Silver Sneakers (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/nike-vomero-5-metallic-silver-sneakers-14192607008%3Fcid=414',
    hash: '#/khmer/men/nike-vomero-5-metallic-silver-sneakers-14192607008%3Fcid=414',
    badge: '$195.00'
  },

  // 15. Mizuno Wave Rider 10 Elm Sneakers
  {
    id: 'p-15a',
    productId: 115,
    type: 'product',
    title: 'Mizuno Wave Rider 10 Elm Sneakers',
    url: 'https://zandoshops.com/kh/khmer/men/mizuno-wave-rider-10-elm-sneakers-14112607019?cid=41',
    hash: '#/khmer/men/mizuno-wave-rider-10-elm-sneakers-14112607019?cid=41',
    badge: '$146.00'
  },
  {
    id: 'p-15b',
    productId: 115,
    type: 'product',
    title: 'Mizuno Wave Rider 10 Elm Sneakers (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/mizuno-wave-rider-10-elm-sneakers-14112607019%3Fcid=41',
    hash: '#/khmer/men/mizuno-wave-rider-10-elm-sneakers-14112607019%3Fcid=41',
    badge: '$146.00'
  },

  // 16. Mizuno MXR Casual Unisex Sneaker
  {
    id: 'p-16a',
    productId: 116,
    type: 'product',
    title: 'Mizuno MXR Casual Unisex Sneaker',
    url: 'https://zandoshops.com/kh/khmer/men/mizuno-mxr-casual-unisex-sneaker-14112607012?cid=306',
    hash: '#/khmer/men/mizuno-mxr-casual-unisex-sneaker-14112607012?cid=306',
    badge: '$128.00'
  },
  {
    id: 'p-16b',
    productId: 116,
    type: 'product',
    title: 'Mizuno MXR Casual Unisex Sneaker (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/mizuno-mxr-casual-unisex-sneaker-14112607012%3Fcid=306',
    hash: '#/khmer/men/mizuno-mxr-casual-unisex-sneaker-14112607012%3Fcid=306',
    badge: '$128.00'
  },

  // 17. Air Jordan Skyline Low Sneakers
  {
    id: 'p-17a',
    productId: 117,
    type: 'product',
    title: 'Air Jordan Skyline Low Sneakers',
    url: 'https://zandoshops.com/kh/khmer/men/air-jordan-skyline-low-sneakers-14152607008?cid=284',
    hash: '#/khmer/men/air-jordan-skyline-low-sneakers-14152607008?cid=284',
    badge: '$115.00'
  },
  {
    id: 'p-17b',
    productId: 117,
    type: 'product',
    title: 'Air Jordan Skyline Low Sneakers (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/air-jordan-skyline-low-sneakers-14152607008%3Fcid=284',
    hash: '#/khmer/men/air-jordan-skyline-low-sneakers-14152607008%3Fcid=284',
    badge: '$115.00'
  },

  // 18. Unisex Sport Style MXR
  {
    id: 'p-18a',
    productId: 118,
    type: 'product',
    title: 'Unisex Sport Style MXR',
    url: 'https://zandoshops.com/kh/khmer/men/unisex-sport-style-mxr-14112607007?cid=171',
    hash: '#/khmer/men/unisex-sport-style-mxr-14112607007?cid=171',
    badge: '$118.00'
  },
  {
    id: 'p-18b',
    productId: 118,
    type: 'product',
    title: 'Unisex Sport Style MXR (Encoded)',
    url: 'https://zandoshops.com/kh/khmer/men/unisex-sport-style-mxr-14112607007%3Fcid=171',
    hash: '#/khmer/men/unisex-sport-style-mxr-14112607007%3Fcid=171',
    badge: '$118.00'
  }
];

// Helper to look up a product from any Cool URL, clean slug, legacy Zando URL, hash or code
export function findProductByZandoRoute(input, customCatalog = null) {
  if (!input) return null;
  const decoded = decodeURIComponent(String(input)).toLowerCase().trim();

  let list = Array.isArray(customCatalog) && customCatalog.length > 0 ? customCatalog : null;
  if (!list && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('zando_admin_products_v1');
      if (stored) list = JSON.parse(stored);
    } catch (_) {}
  }
  if (!list) list = ZANDO_PRODUCTS;

  // 1. Direct match on cleanSlug
  for (const p of list) {
    if (p.cleanSlug && decoded.includes(p.cleanSlug.toLowerCase())) {
      return p;
    }
  }

  // 2. Look up by cool /product/:slug or /p/:slug segment
  const productSegment = decoded.split('/product/')[1] || decoded.split('/p/')[1];
  if (productSegment) {
    const slugKey = productSegment.split('?')[0].split('#')[0].split('/')[0].trim();
    if (slugKey) {
      const match = list.find(p => 
        (p.cleanSlug && p.cleanSlug.toLowerCase() === slugKey) ||
        (p.slug && p.slug.toLowerCase() === slugKey) ||
        (p.zandoSlug && p.zandoSlug.toLowerCase() === slugKey) ||
        String(p.id) === slugKey
      );
      if (match) return match;
    }
  }

  // 3. Fallback matching legacy Zando slugs, codes, query IDs
  return list.find((p) => {
    if (p.zandoCode && decoded.includes(p.zandoCode.toLowerCase())) return true;
    if (p.zandoSlug && decoded.includes(p.zandoSlug.toLowerCase())) return true;
    if (p.slug && decoded.includes(p.slug.toLowerCase())) return true;
    if (p.sku && decoded.includes(p.sku.toLowerCase())) return true;
    if (decoded.includes(`id=${p.id}`) || decoded.endsWith(`/${p.id}`) || String(p.id) === decoded) return true;
    return false;
  }) || null;
}

