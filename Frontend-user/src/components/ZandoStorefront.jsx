import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Truck, RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ZANDO_BANNERS, ZANDO_PRODUCTS } from '../data/zandoProducts';
import { syncBridge } from '../services/syncBridge';
import { ProductCard } from './ProductCard';

export function ZandoStorefront({ products: propsProducts = null, selectedGender = 'men', onQuickView, onFilterBrand, onNavigateToShop }) {
  const { lang } = useLanguage();
  const isWomen = selectedGender === 'women';
  const targetGender = isWomen ? 'women' : 'men';

  // Real Catalog Resolution (Props -> syncBridge -> fallback)
  const catalog = (Array.isArray(propsProducts) && propsProducts.length > 0)
    ? propsProducts
    : syncBridge.getProducts();

  const handleDirectNavigate = (e, { category = 'ALL', brand = 'ALL', collection = '', gender = targetGender }) => {
    e.preventDefault();
    if (onNavigateToShop) {
      onNavigateToShop({ category, brand, collection, gender });
    }
  };

  // Carousel refs for smooth hardware-accelerated sliding
  const shoesScrollRef = useRef(null);
  const seasonScrollRef = useRef(null);

  const [canScrollShoesLeft, setCanScrollShoesLeft] = useState(false);
  const [canScrollShoesRight, setCanScrollShoesRight] = useState(true);
  const [shoesActiveDot, setShoesActiveDot] = useState(0);

  const [canScrollSeasonLeft, setCanScrollSeasonLeft] = useState(false);
  const [canScrollSeasonRight, setCanScrollSeasonRight] = useState(true);
  const [seasonActiveDot, setSeasonActiveDot] = useState(0);

  // Clothing products for Season's Favorites (Dual Mode)
  const seasonFavoriteIds = isWomen ? [201, 204, 205, 217] : [101, 102, 103, 104];
  const seasonFavoriteProducts = seasonFavoriteIds
    .map(id => catalog.find(p => p.id === id))
    .filter(Boolean);

  const otherClothes = catalog.filter(p => {
    const pCat = (p.category || '').toUpperCase();
    const isCloth = pCat === 'CLOTHES' || pCat === 'T-SHIRTS' || pCat === 'SHIRTS' || pCat === 'JEANS' || pCat === 'PANTS' || pCat === 'TOPS_WOMEN' || pCat === 'DRESSES';
    const matchGender = !p.gender || p.gender === 'all' || p.gender === targetGender;
    return isCloth && matchGender && !seasonFavoriteIds.includes(p.id);
  });
  const allSeasonClothes = [...seasonFavoriteProducts, ...otherClothes];

  // Season Poster Image
  const seasonPosterImg = isWomen ? '/zando-assets/women/poster-women-season.png' : '/zando-assets/season-poster.png';

  // Secondary Banner (GATONI Mist for Men / KAYVI Beauty 20% for Women)
  const secondaryBanner = isWomen ? {
    img: '/zando-assets/women/banner-kayvi-beauty.png',
    alt: 'KAYVI Beauty App 20% Off',
    link: '/women/beauty',
    brand: 'ALL',
    category: 'ALL',
    gender: 'women'
  } : {
    img: '/zando-assets/gatoni-mist-banner.png',
    alt: 'GATONI Through The Mist',
    link: '/men/brand/gatoni',
    brand: 'GATONI',
    category: 'ALL',
    gender: 'men'
  };

  // Footwear / New Brands highlights (Dual Mode)
  const shoeIds = isWomen ? [251, 252, 253, 254, 255] : [111, 112, 113, 114, 115];
  const featuredShoes = shoeIds
    .map(id => catalog.find(p => p.id === id))
    .filter(Boolean);

  const otherShoes = catalog.filter(p => {
    const pCat = (p.category || '').toUpperCase();
    const isFootwearOrBag = pCat === 'SHOES' || pCat === 'RUNNING' || pCat === 'BAGS' || pCat === 'SHOES_WOMEN' || pCat === 'BAGS_WOMEN';
    const matchGender = !p.gender || p.gender === 'all' || p.gender === targetGender;
    return isFootwearOrBag && matchGender && !shoeIds.includes(p.id);
  });
  const allShoes = [...featuredShoes, ...otherShoes];

  // Smooth slide controllers for Shoes
  const checkShoesScroll = () => {
    if (shoesScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = shoesScrollRef.current;
      setCanScrollShoesLeft(scrollLeft > 15);
      setCanScrollShoesRight(scrollLeft + clientWidth < scrollWidth - 15);
      
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setShoesActiveDot(scrollLeft / maxScroll > 0.4 ? 1 : 0);
      }
    }
  };

  const slideShoes = (direction) => {
    if (shoesScrollRef.current) {
      const el = shoesScrollRef.current;
      const firstCard = el.querySelector('.zando-slider-snap-item');
      const cardWidth = firstCard ? firstCard.offsetWidth : 240;
      const gap = 16;
      const scrollDistance = (cardWidth + gap) * 2;
      el.scrollBy({
        left: direction === 'next' ? scrollDistance : -scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const goToShoesPage = (i) => {
    if (shoesScrollRef.current) {
      const el = shoesScrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollTo({
        left: i === 0 ? 0 : maxScroll,
        behavior: 'smooth'
      });
      setShoesActiveDot(i);
    }
  };

  // Smooth slide controllers for Season's Favorites
  const checkSeasonScroll = () => {
    if (seasonScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = seasonScrollRef.current;
      setCanScrollSeasonLeft(scrollLeft > 15);
      setCanScrollSeasonRight(scrollLeft + clientWidth < scrollWidth - 15);
      
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const progress = scrollLeft / maxScroll;
        setSeasonActiveDot(Math.min(2, Math.round(progress * 2)));
      }
    }
  };

  const slideSeason = (direction) => {
    if (seasonScrollRef.current) {
      const el = seasonScrollRef.current;
      const firstCard = el.querySelector('.zando-slider-snap-item');
      const cardWidth = firstCard ? firstCard.offsetWidth : 240;
      const gap = 16;
      const scrollDistance = (cardWidth + gap) * 2;
      el.scrollBy({
        left: direction === 'next' ? scrollDistance : -scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  const goToSeasonPage = (i) => {
    if (seasonScrollRef.current) {
      const el = seasonScrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;
      el.scrollTo({
        left: (i / 2) * maxScroll,
        behavior: 'smooth'
      });
      setSeasonActiveDot(i);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkShoesScroll();
      checkSeasonScroll();
    }, 150);
    window.addEventListener('resize', checkShoesScroll);
    window.addEventListener('resize', checkSeasonScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkShoesScroll);
      window.removeEventListener('resize', checkSeasonScroll);
    };
  }, []);

  // Shop by category cards (Dual Mode)
  const categoryCards = isWomen ? [
    {
      id: 'women_new_in',
      title: 'NEW IN',
      img: '/zando-assets/women/cat-women-new-in.png',
      link: '/women/new-in',
      category: 'NEW_IN'
    },
    {
      id: 'women_collections',
      title: 'COLLECTIONS',
      img: '/zando-assets/women/cat-women-collections.png',
      link: '/women/collection',
      category: 'ALL'
    },
    {
      id: 'women_smart_casual',
      title: 'SMART CASUAL',
      img: '/zando-assets/women/cat-women-smart-casual.png',
      link: '/women/clothing',
      category: 'CLOTHES'
    },
    {
      id: 'women_officewear',
      title: 'OFFICEWEAR',
      img: '/zando-assets/women/cat-women-officewear.png',
      link: '/women/clothing',
      category: 'CLOTHES'
    }
  ] : [
    {
      id: 'new_in',
      title: 'NEW IN',
      img: '/zando-assets/cat-new-in.png',
      link: '/men/new-in',
      category: 'NEW_IN'
    },
    {
      id: 'collections',
      title: 'COLLECTIONS',
      img: '/zando-assets/cat-collections.png',
      link: '/men/collection',
      category: 'ALL'
    },
    {
      id: 'smart_casual',
      title: 'SMART CASUAL',
      img: '/zando-assets/cat-smart-casual.png',
      link: '/men/clothing',
      category: 'T-Shirts'
    },
    {
      id: 'officewear',
      title: 'OFFICEWEAR',
      img: '/zando-assets/cat-officewear.png',
      link: '/men/clothing',
      category: 'CLOTHES'
    }
  ];

  // More to discover items (Dual Mode)
  const moreToDiscoverItems = isWomen ? [
    { id: 'glasses', title: 'GLASSES', img: '/zando-assets/women/disc-women-glasses.png', link: '/women/bags', category: 'BAGS' },
    { id: 'caps', title: 'CAPS & HATS', img: '/zando-assets/women/disc-women-caps.png', link: '/women/bags', category: 'BAGS' },
    { id: 'beauty', title: 'BEAUTY', img: '/zando-assets/women/disc-women-beauty.png', link: '/women/beauty', category: 'ALL' },
    { id: 'bags', title: 'BAGS', img: '/zando-assets/women/disc-women-bags.png', link: '/women/bags', category: 'BAGS' },
    { id: 'shoes', title: 'SHOES', img: '/zando-assets/women/disc-women-shoes.png', link: '/women/shoes', category: 'SHOES' }
  ] : [
    { id: 'glasses', title: 'GLASSES', img: '/zando-assets/disc-glasses.png', link: '/men/accessories', category: 'BAGS' },
    { id: 'caps', title: 'CAPS & HATS', img: '/zando-assets/disc-caps.png', link: '/men/accessories', category: 'BAGS' },
    { id: 'beauty', title: 'BEAUTY', img: '/zando-assets/disc-beauty.png', link: '/men/beauty', category: 'ALL' },
    { id: 'bags', title: 'BAGS', img: '/zando-assets/disc-bags.png', link: '/men/accessories', category: 'BAGS' },
    { id: 'shoes', title: 'SHOES', img: '/zando-assets/disc-shoes.png', link: '/men/shoes', category: 'SHOES' }
  ];

  // Recommendations cards (Dual Mode)
  const recommendationCards = isWomen ? [
    {
      id: 'rec_women_beach',
      tag: 'NEW ARRIVALS',
      sub: 'YOUR NEXT FAVORITE PIECE AWAITS.',
      img: '/zando-assets/women/rec-women-beach.png',
      link: '/women/new-in',
      category: 'NEW_IN'
    },
    {
      id: 'rec_women_361',
      tag: '361° ONE DEGREE BEYOND',
      sub: 'OUTDOOR HIKING & SPORTS WEAR.',
      img: '/zando-assets/women/rec-women-361.png',
      link: '/women/brand/361',
      brand: '361'
    },
    {
      id: 'rec_women_ten11',
      tag: 'TEN ELEVEN',
      sub: 'LATEST COLLECTION "STREET SOUL"',
      img: '/zando-assets/women/rec-women-ten11.png',
      link: '/women/brand/ten11',
      brand: 'TEN11'
    },
    {
      id: 'rec_women_gatoni',
      tag: 'GATONI',
      sub: 'LATEST COLLECTION "ELEGANCE SS26"',
      img: '/zando-assets/women/rec-women-gatoni.png',
      link: '/women/brand/gatoni',
      brand: 'GATONI'
    }
  ] : [
    {
      id: 'rec_new',
      tag: 'NEW ARRIVALS',
      sub: 'YOUR NEXT FAVORITE PIECE AWAITS.',
      img: '/zando-assets/rec-new-arrivals.png',
      link: '/men/new-in',
      category: 'NEW_IN'
    },
    {
      id: 'rec_361',
      tag: '361° ONE DEGREE BEYOND',
      sub: 'NOTHING CHANGES UNTIL YOU TAKE THE FIRST STEP. HIKING, RUNNING & SPORTS-GO BEYOND WITH 361°.',
      img: '/zando-assets/rec-361.png',
      link: '/men/brand/361',
      brand: '361'
    },
    {
      id: 'rec_ten11',
      tag: 'TEN ELEVEN',
      sub: 'LATEST COLLECTION "SWAGGER SYNDROME"',
      img: '/zando-assets/rec-ten-eleven.png',
      link: '/men/brand/ten11',
      brand: 'TEN11'
    },
    {
      id: 'rec_gatoni',
      tag: 'GATONI',
      sub: 'LATEST COLLECTION "THROUGH THE MIST | SS26"',
      img: '/zando-assets/rec-gatoni.png',
      link: '/men/brand/gatoni',
      brand: 'GATONI'
    }
  ];

  return (
    <div className="zando-storefront" style={{ width: '100%', backgroundColor: '#ffffff', color: '#111827' }}>
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER (Exact match to tests/ksnip_20260904-192642.png)           */}
      {/* ========================================================================= */}
      <section style={{ width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#000000' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <a 
            href={isWomen ? '/women/new-in' : '/men/new-in'} 
            onClick={(e) => handleDirectNavigate(e, { category: 'NEW_IN', brand: 'ALL', hash: isWomen ? '/women/new-in' : '/men/new-in', gender: targetGender })}
            style={{ display: 'block', cursor: 'pointer' }}
          >
            <img 
              src={ZANDO_BANNERS.hero.imageUrl} 
              alt={ZANDO_BANNERS.hero.title}
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '620px', 
                objectFit: 'cover', 
                display: 'block' 
              }} 
            />
          </a>
          {/* Bottom Action CTA button */}
          <div style={{
            position: 'absolute',
            bottom: '28px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}>
            <a 
              href={isWomen ? '/women/new-in' : '/men/new-in'} 
              onClick={(e) => handleDirectNavigate(e, { category: 'NEW_IN', brand: 'ALL', hash: isWomen ? '/women/new-in' : '/men/new-in', gender: targetGender })}
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '12px 36px',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.25s ease',
                textDecoration: 'none',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              SHOP NOW
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OFFICIAL BRAND STRIP (Exact match to tests/ksnip_20260904-192642.png)  */}
      {/* ========================================================================= */}
      <section style={{ 
        width: '100%', 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #f1f5f9',
        padding: '18px 24px' 
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <img 
            src="/zando-assets/brands-strip.png" 
            alt="Zando Brands: ZANDO, TEN-ELEVEN, GATONI, TAG SPACE, 361°, ROUTINE, Pomelo"
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              maxHeight: '42px', 
              objectFit: 'contain',
              display: 'block' 
            }} 
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. EDITORIAL BANNER: GATONI (MEN) / KAYVI BEAUTY 20% (WOMEN)             */}
      {/* ========================================================================= */}
      <section style={{ width: '100%', margin: '0 auto', backgroundColor: '#000000' }}>
        <a 
          href={secondaryBanner.link} 
          onClick={(e) => handleDirectNavigate(e, { brand: secondaryBanner.brand, category: secondaryBanner.category, hash: secondaryBanner.link, gender: secondaryBanner.gender })}
          style={{ display: 'block', width: '100%', cursor: 'pointer' }}
        >
          <img 
            src={secondaryBanner.img} 
            alt={secondaryBanner.alt} 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '450px', 
              objectFit: 'cover', 
              display: 'block' 
            }} 
          />
        </a>
      </section>

      {/* ========================================================================= */}
      {/* 4. SHOP BY CATEGORY (Exact match to tests/ksnip_20260904-192704.png)      */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '1400px', margin: '48px auto 0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.55rem', fontWeight: 700, margin: 0, color: '#111827' }}>
            {lang === 'km' ? 'ទិញតាមប្រភេទ' : 'Shop by Category'}
          </h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              aria-label="Previous Category"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#9ca3af',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              aria-label="Next Category"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 4 Category Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {categoryCards.map((cat) => (
            <a
              key={cat.id}
              href={cat.link}
              onClick={(e) => {
                const targetCat = cat.category || 'ALL';
                handleDirectNavigate(e, { category: targetCat, brand: 'ALL', hash: cat.link, gender: targetGender });
              }}
              style={{
                position: 'relative',
                aspectRatio: '3 / 4.4',
                borderRadius: '2px',
                overflow: 'hidden',
                display: 'block',
                textDecoration: 'none',
                cursor: 'pointer',
                backgroundColor: '#f3f4f6'
              }}
            >
              <img
                src={cat.img}
                alt={cat.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              {/* Bottom Centered Black Box Label */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '8px 24px',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)'
              }}>
                {cat.title}
              </div>
            </a>
          ))}
        </div>

        {/* Pagination Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#111827' }} />
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#d1d5db' }} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DISCOVER THIS SEASON'S FAVORITES (Exact match to tests/ksnip_20260904-192717.png) */}
      {/* ========================================================================= */}
      <section id="featured-season" style={{ maxWidth: '1400px', margin: '52px auto 0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 340px) 1fr',
          gap: '20px',
          alignItems: 'start'
        }}>
          
          {/* Left Promotional Poster */}
          <div style={{ position: 'relative', width: '100%' }}>
            <a
              href={isWomen ? '/women/new-in' : '/men/new-in'}
              onClick={(e) => handleDirectNavigate(e, { category: 'NEW_IN', brand: 'ALL', hash: isWomen ? '/women/new-in' : '/men/new-in', gender: targetGender })}
              style={{
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden',
                display: 'block',
                aspectRatio: '3 / 4.4',
                width: '100%'
              }}
            >
              <img 
                src={seasonPosterImg} 
                alt="Discover This Season's Favorites" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </a>
          </div>

          {/* Right Product Slider (4 items per view, matching real Zando) */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, margin: 0, color: '#111827' }}>
                {lang === 'km' ? "ទំនិញពេញនិយមប្រចាំរដូវកាល" : "Discover This Season's Favorites"}
              </h3>
              <a
                href={isWomen ? '/women/new-in' : '/men/new-in'}
                onClick={(e) => handleDirectNavigate(e, { category: 'NEW_IN', brand: 'ALL', hash: isWomen ? '/women/new-in' : '/men/new-in', gender: targetGender })}
                style={{
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  padding: '7px 20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  borderRadius: '2px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                {lang === 'km' ? 'មើលបន្ថែម' : 'SEE MORE'}
              </a>
            </div>

            {/* Slider Container */}
            <div style={{ position: 'relative' }}>
              {/* Prev Arrow */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => slideSeason('prev')}
                aria-label="Previous clothing"
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '32px',
                  height: '42px',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollSeasonLeft ? 'pointer' : 'default',
                  opacity: canScrollSeasonLeft ? 1 : 0,
                  pointerEvents: canScrollSeasonLeft ? 'auto' : 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  transition: 'opacity 0.25s ease'
                }}
              >
                <ChevronLeft size={20} />
              </motion.button>

              {/* Next Arrow */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => slideSeason('next')}
                aria-label="Next clothing"
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '32px',
                  height: '42px',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: canScrollSeasonRight ? 'pointer' : 'default',
                  opacity: canScrollSeasonRight ? 1 : 0,
                  pointerEvents: canScrollSeasonRight ? 'auto' : 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  transition: 'opacity 0.25s ease'
                }}
              >
                <ChevronRight size={20} />
              </motion.button>

              {/* Smooth 4 Cards Track */}
              <div
                ref={seasonScrollRef}
                onScroll={checkSeasonScroll}
                className="zando-slider-track no-scrollbar"
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  scrollSnapType: 'x mandatory',
                  padding: '4px 0 12px 0',
                  width: '100%'
                }}
              >
                {allSeasonClothes.length > 0 ? (
                  allSeasonClothes.map((prod) => (
                    <div
                      key={prod.id}
                      className="zando-slider-snap-item"
                      style={{
                        flex: '0 0 calc((100% - 48px) / 4)',
                        minWidth: '200px',
                        scrollSnapAlign: 'start'
                      }}
                    >
                      <ProductCard
                        product={prod}
                        onQuickView={onQuickView}
                      />
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '48px 24px', textAlign: 'center', width: '100%', color: '#64748b' }}>
                    <p style={{ fontWeight: 600, fontSize: '15px' }}>
                      {lang === 'km' ? 'មិនទាន់មានទំនិញ Real Data នៅក្នុងផ្នែកនេះទេ' : 'No real products in this section yet'}
                    </p>
                    <p style={{ fontSize: '13px', marginTop: '6px' }}>
                      {lang === 'km' ? 'សូមចូលទៅកាន់ Admin POS ដើម្បីបន្ថែមទំនិញថ្មីរបស់អ្នក' : 'Please go to Admin POS to add your custom products'}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
                {[0, 1, 2].map((dotIdx) => (
                  <span
                    key={dotIdx}
                    onClick={() => goToSeasonPage(dotIdx)}
                    style={{
                      width: seasonActiveDot === dotIdx ? '18px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: seasonActiveDot === dotIdx ? '#111827' : '#d1d5db',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. THE LATEST BRANDS ARE HERE (Exact match to tests/ksnip_20260904-192726.png) */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '1400px', margin: '56px auto 0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.55rem', fontWeight: 700, margin: 0, color: '#111827' }}>
            {isWomen 
              ? (lang === 'km' ? 'ម៉ាកយីហោថ្មីៗទើបមកដល់' : 'New Brand Just In') 
              : (lang === 'km' ? 'ស្បែកជើងម៉ាកល្បីៗ' : 'The Latest Brands Are Here')}
          </h2>
          <a
            href={isWomen ? '/women/shoes' : '/men/shoes'}
            onClick={(e) => handleDirectNavigate(e, { category: 'SHOES', brand: 'ALL', hash: isWomen ? '/women/shoes' : '/men/shoes', gender: targetGender })}
            style={{
              backgroundColor: '#111827',
              color: '#ffffff',
              padding: '7px 20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: '2px',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-block'
            }}
          >
            {lang === 'km' ? 'មើលបន្ថែម' : 'SEE MORE'}
          </a>
        </div>

        {/* 5 Shoes per row slider with smooth card-by-card glide */}
        <div style={{ position: 'relative' }}>
          {/* Prev Arrow */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => slideShoes('prev')}
            aria-label="Previous shoes"
            style={{
              position: 'absolute',
              left: '4px',
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '32px',
              height: '44px',
              borderRadius: '2px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollShoesLeft ? 'pointer' : 'default',
              opacity: canScrollShoesLeft ? 1 : 0,
              pointerEvents: canScrollShoesLeft ? 'auto' : 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'opacity 0.25s ease'
            }}
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Next Arrow (Exact button highlighted by user) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => slideShoes('next')}
            aria-label="Next shoes"
            style={{
              position: 'absolute',
              right: '4px',
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: '32px',
              height: '44px',
              borderRadius: '2px',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canScrollShoesRight ? 'pointer' : 'default',
              opacity: canScrollShoesRight ? 1 : 0,
              pointerEvents: canScrollShoesRight ? 'auto' : 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'opacity 0.25s ease'
            }}
          >
            <ChevronRight size={20} />
          </motion.button>

          {/* Smooth Horizontal Track (Glides across smoothly) */}
          <div
            ref={shoesScrollRef}
            onScroll={checkShoesScroll}
            className="zando-slider-track no-scrollbar"
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory',
              padding: '4px 0 12px 0',
              width: '100%'
            }}
          >
            {allShoes.length > 0 ? (
              allShoes.map((prod) => (
                <div
                  key={prod.id}
                  className="zando-slider-snap-item"
                  style={{
                    flex: '0 0 calc((100% - 64px) / 5)',
                    minWidth: '220px',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <ProductCard
                    product={prod}
                    onQuickView={onQuickView}
                  />
                </div>
              ))
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center', width: '100%', color: '#64748b' }}>
                <p style={{ fontWeight: 600, fontSize: '15px' }}>
                  {lang === 'km' ? 'មិនទាន់មានស្បែកជើង ឬកាបូប Real Data នៅឡើយទេ' : 'No real shoes or bags added yet'}
                </p>
                <p style={{ fontSize: '13px', marginTop: '6px' }}>
                  {lang === 'km' ? 'បន្ថែមទំនិញពី Admin POS ជាមួយនឹង Brand របស់អ្នក' : 'Add products from Admin POS with your brands'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination Dots (2 dots matching real Zando shoes section) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
            {[0, 1].map((dotIdx) => (
              <span
                key={dotIdx}
                onClick={() => goToShoesPage(dotIdx)}
                style={{
                  width: shoesActiveDot === dotIdx ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: shoesActiveDot === dotIdx ? '#111827' : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MORE TO DISCOVER (Exact match to tests/ksnip_20260904-192749.png)      */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '1400px', margin: '56px auto 0 auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: '1.55rem', fontWeight: 700, margin: '0 0 20px 0', color: '#111827' }}>
          {lang === 'km' ? 'ស្វែងយល់បន្ថែម' : 'More to Discover'}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px'
        }}>
          {moreToDiscoverItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              onClick={(e) => {
                const targetCat = item.category || (item.id === 'shoes' ? 'SHOES' : (item.id === 'bags' || item.id === 'glasses' || item.id === 'caps' ? 'BAGS' : 'ALL'));
                handleDirectNavigate(e, { category: targetCat, brand: 'ALL', hash: item.link, gender: targetGender });
              }}
              style={{
                position: 'relative',
                aspectRatio: '3 / 4.2',
                borderRadius: '2px',
                overflow: 'hidden',
                display: 'block',
                textDecoration: 'none',
                cursor: 'pointer',
                backgroundColor: '#f3f4f6'
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '7px 20px',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)'
              }}>
                {item.title}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. EXPLORE OUR RECOMMENDATIONS (Exact match to tests/ksnip_20260904-192749.png) */}
      {/* ========================================================================= */}
      <section style={{ maxWidth: '1400px', margin: '56px auto 48px auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: '1.55rem', fontWeight: 700, margin: '0 0 20px 0', color: '#111827' }}>
          {lang === 'km' ? 'ការណែនាំពិសេស' : 'Explore Our Recommendations'}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {recommendationCards.map((rec) => (
            <a
              key={rec.id}
              href={rec.link}
              onClick={(e) => {
                let brand = rec.brand || 'ALL';
                let category = rec.category || 'ALL';
                handleDirectNavigate(e, { brand, category, hash: rec.link, gender: targetGender });
              }}
              style={{
                position: 'relative',
                aspectRatio: '3 / 4.4',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#111827',
                display: 'block',
                textDecoration: 'none'
              }}
            >
              <img
                src={rec.img}
                alt={rec.tag}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: 0.92,
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '20px'
              }}>
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                  {rec.tag}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.74rem', marginTop: '6px', letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: '1.35' }}>
                  {rec.sub}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
