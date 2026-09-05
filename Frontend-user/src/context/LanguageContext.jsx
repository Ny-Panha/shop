import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Top bar & Nav
    announcement: "Free delivery in Phnom Penh for orders over $25 • NBC Bakong KHQR Accepted",
    brand_tagline: "Ultra-Protective Engineered Phone Cases",
    search_placeholder: "Search iPhone 15, MagSafe, Titanium, Silicone...",
    all_products: "Catalog",
    track_order: "Track Order",
    admin_portal: "Admin Portal",
    cart: "Cart",
    login: "Sign In",
    logout: "Log Out",
    account: "Account",
    
    // Filters & Brands
    all_brands: "All Brands",
    all_categories: "All Styles",
    filter_title: "Filters",
    clear_filters: "Reset",
    in_stock_only: "In Stock Only",
    price_range: "Price Range",
    sort_by: "Sort By",
    sort_featured: "Featured & Popular",
    sort_price_low: "Price: Low to High",
    sort_price_high: "Price: High to Low",
    sort_rating: "Highest Customer Rating",

    // Categories
    cat_silicone: "Liquid Silicone",
    cat_clear: "Crystal Clear",
    cat_leather: "Vegan Leather",
    cat_wallet: "Folio Wallet",
    cat_magsafe: "MagSafe Armor",

    // Product Card
    quick_view: "Quick View",
    add_to_cart: "Add to Cart",
    added: "Added to Cart!",
    in_stock: "In Stock",
    low_stock: "Low Stock - Only few left!",
    out_of_stock: "Sold Out",
    units_left: "units left",
    save: "Save",
    stars: "stars",
    reviews: "reviews",

    // Product Details
    select_color: "Select Color",
    quantity: "Quantity",
    buy_now: "Buy Now with KHQR",
    specifications: "Technical Specifications",
    compatibility: "Device Compatibility",
    drop_rating: "Drop Protection Rating",
    sku_label: "SKU",
    magsafe_ready: "MagSafe Compatible",
    free_shipping: "Free Phnom Penh Delivery",
    free_shipping_sub: "Orders $25+ arrive in 1-2 business days",
    authentic_guarantee: "100% Authentic Quality Guarantee",
    authentic_sub: "Designed with military-grade impact polymer",

    // Cart & Checkout
    shopping_cart: "Your Shopping Cart",
    cart_empty: "Your cart is currently empty",
    start_shopping: "Explore Phone Cases",
    order_summary: "Order Summary",
    subtotal: "Subtotal",
    delivery_fee: "Delivery Fee",
    free: "FREE",
    total: "Total",
    checkout: "Proceed to Checkout",
    continue_shopping: "Continue Shopping"
  },
  km: {
    // Top bar & Nav
    announcement: "ដឹកជញ្ជូនឥតគិតថ្លៃក្នុងក្រុងភ្នំពេញចាប់ពី $25 ឡើងទៅ • ទទួលទូទាត់តាមបាគង KHQR",
    brand_tagline: "ស្រោមកាតព្វកិច្ចការពារទូរស័ព្ទកម្រិតខ្ពស់",
    search_placeholder: "ស្វែងរក iPhone 15, MagSafe, ស្រោមទីតានីញ៉ូម, ស៊ីលីកូន...",
    all_products: "ទំនិញទាំងអស់",
    track_order: "តាមដានការបញ្ជាទិញ",
    admin_portal: "ផ្ទាំងគ្រប់គ្រង Admin",
    cart: "កន្ត្រក",
    login: "ចូលគណនី",
    logout: "ចាកចេញ",
    account: "គណនី",
    
    // Filters & Brands
    all_brands: "ម៉ាកទាំងអស់",
    all_categories: "ម៉ូដទាំងអស់",
    filter_title: "ចម្រាញ់ទំនិញ",
    clear_filters: "កំណត់ឡើងវិញ",
    in_stock_only: "ទំនិញមានក្នុងស្តុក",
    price_range: "ចន្លោះតម្លៃ",
    sort_by: "តម្រៀបតាម",
    sort_featured: "ពេញនិយម & ណែនាំ",
    sort_price_low: "តម្លៃ: ពីទាបទៅខ្ពស់",
    sort_price_high: "តម្លៃ: ពីខ្ពស់ទៅទាប",
    sort_rating: "ការវាយតម្លៃខ្ពស់បំផុត",

    // Categories
    cat_silicone: "ស៊ីលីកូនរលោង",
    cat_clear: "ថ្លាភ្លឺច្បាស់",
    cat_leather: "ស្បែកទំនើប",
    cat_wallet: "កាបូបដាក់កាត",
    cat_magsafe: "ស្រោមកម្លាំងម៉ាញ៉េទិច MagSafe",

    // Product Card
    quick_view: "មើលលម្អិត",
    add_to_cart: "ដាក់ក្នុងកន្ត្រក",
    added: "បានដាក់ក្នុងកន្ត្រក!",
    in_stock: "មានក្នុងស្តុក",
    low_stock: "ស្តុកនៅសល់តិច!",
    out_of_stock: "អស់ពីស្តុក",
    units_left: "គ្រឿងនៅសល់",
    save: "ចំណេញ",
    stars: "ផ្កាយ",
    reviews: "មតិវាយតម្លៃ",

    // Product Details
    select_color: "ជ្រើសរើសពណ៌",
    quantity: "ចំនួន",
    buy_now: "ទិញភ្លាមៗជាមួយ KHQR",
    specifications: "លក្ខណៈបច្ចេកទេស",
    compatibility: "ភាពត្រូវគ្នានឹងម៉ូដែល",
    drop_rating: "កម្រិតការពារការធ្លាក់",
    sku_label: "កូដ SKU",
    magsafe_ready: "គាំទ្រសាកថ្ម MagSafe",
    free_shipping: "ដឹកជញ្ជូនឥតគិតថ្លៃក្នុងភ្នំពេញ",
    free_shipping_sub: "ការបញ្ជាទិញចាប់ពី $25+ មកដល់ក្នុងរយៈពេល 1-2 ថ្ងៃ",
    authentic_guarantee: "ធានាគុណភាពពិត 100%",
    authentic_sub: "ផលិតឡើងពីប៉ូលីម៊ែរការពារកម្រិតស្តង់ដារយោធា",

    // Cart & Checkout
    shopping_cart: "កន្ត្រកទំនិញរបស់អ្នក",
    cart_empty: "មិនទាន់មានទំនិញក្នុងកន្ត្រកនៅឡើយទេ",
    start_shopping: "ស្វែងរកស្រោមទូរស័ព្ទឥឡូវនេះ",
    order_summary: "សង្ខេបការបញ្ជាទិញ",
    subtotal: "សរុបតម្លៃទំនិញ",
    delivery_fee: "ថ្លៃដឹកជញ្ជូន",
    free: "ឥតគិតថ្លៃ",
    total: "ទឹកប្រាក់សរុប",
    checkout: "បន្តទៅកាន់ការទូទាត់",
    continue_shopping: "បន្តទិញទំនិញ"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('casehaven_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('casehaven_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'km' : 'en');
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
