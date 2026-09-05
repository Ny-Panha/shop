import React, { useState, useEffect } from 'react';
import { 
  X, ArrowLeft, Heart, ChevronDown, ChevronUp, 
  ChevronLeft, ChevronRight, Truck, RotateCcw, Ruler, Check 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { ZANDO_PRODUCTS } from '../data/zandoProducts';
import { ProductCard } from './ProductCard';
import { ZandoFooter } from './ZandoFooter';

export function ProductDetailModal({ product, onClose, onBuyNow, onNavigateToShop }) {
  const { addToCart, setIsCartOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { lang } = useLanguage();

  const isWished = isInWishlist(product.id);

  // Gallery Images fallback
  const defaultGallery = [
    '/zando-assets/insane-pant-thumb1.png',
    '/zando-assets/insane-pant-thumb2.png',
    '/zando-assets/insane-pant-thumb3.png',
    '/zando-assets/insane-pant-thumb4.png',
    '/zando-assets/insane-pant-thumb5.png'
  ];

  // Color Variants (Supports Milo Striped Polo & all catalog items)
  const defaultColors = [
    { 
      nameKm: 'Milk white', 
      nameEn: 'Milk white', 
      hex: '#f5f5dc', 
      image: '/zando-products/milo/swatch_milk_white.jpg',
      gallery: [
        '/zando-products/milo/push_5.jpg',
        '/zando-products/milo/push_6.jpg',
        '/zando-products/milo/push_7.jpg',
        '/zando-products/milo/push_8.jpg',
        '/zando-products/milo/push_9.jpg',
        '/zando-products/milo/push_10.jpg'
      ]
    },
    { 
      nameKm: 'ត្នោត', 
      nameEn: 'Brown', 
      hex: '#3d2b1f', 
      image: '/zando-products/milo/swatch_brown.jpg',
      gallery: [
        '/zando-products/milo/push_1.jpg',
        '/zando-products/milo/push_2.jpg',
        '/zando-products/milo/push_3.jpg',
        '/zando-products/milo/push_4.jpg'
      ]
    }
  ];

  const colorVariants = (product.colorVariants && product.colorVariants.length > 0)
    ? product.colorVariants
    : (product.id === 104 || product.slug?.includes('milo')
        ? defaultColors
        : (product.id === 100
            ? [
                { nameKm: 'ប្រផេះ', nameEn: 'Gray', hex: '#64748b', image: '/zando-assets/swatch-grey.png', gallery: defaultGallery },
                { nameKm: 'ខ្មៅ', nameEn: 'Black', hex: '#111827', image: '/zando-assets/swatch-black.png', gallery: defaultGallery }
              ]
            : [
                {
                  nameKm: product.colorOptions || 'Default',
                  nameEn: 'Default',
                  image: product.imageUrl,
                  gallery: ((product.images && product.images.length > 0)
                    ? product.images
                    : (product.galleryImages && product.galleryImages.length > 0
                        ? product.galleryImages
                        : [product.imageUrl, product.hoverImageUrl || product.imageUrl])).filter(Boolean),
                }
              ]
          )
      );

  const [selectedColorIdx, setSelectedColorIdx] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    return (hash.includes('cid=96') || product?.zandoCid === '96') ? 1 : 0;
  });

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Sync selectedColorIdx whenever product changes
  useEffect(() => {
    const hash = window.location.hash || '';
    if (hash.includes('cid=96') || product?.zandoCid === '96') {
      setSelectedColorIdx(colorVariants.length > 1 ? 1 : 0);
    } else {
      setSelectedColorIdx(0);
    }
    setActiveImgIdx(0);
  }, [product?.id]);

  // Gallery dynamically updates when color changes
  const activeVariant = colorVariants[selectedColorIdx] || colorVariants[0];
  const gallery = (activeVariant?.gallery && activeVariant.gallery.length > 0)
    ? activeVariant.gallery
    : ((product.images && product.images.length > 0)
        ? product.images
        : (product.galleryImages && product.galleryImages.length > 0
            ? product.galleryImages
            : [product.imageUrl, product.hoverImageUrl || product.imageUrl].filter(Boolean)));

  const handleSelectColor = (idx) => {
    setSelectedColorIdx(idx);
    setActiveImgIdx(0);
    const coolSlug = product.cleanSlug || (product.zandoSlug || product.slug || '').replace(/-\d{4,}$/, '').replace(/-\d+$/, '');
    try {
      window.history.replaceState(null, '', `/product/${coolSlug}`);
    } catch (e) {
      window.location.hash = `#/product/${coolSlug}`;
    }
  };

  // Sizes
  const availableSizes = (product.sizes && product.sizes.length > 0)
    ? product.sizes
    : (product.category === 'SHOES' 
        ? ['39', '40', '41', '42', '43', '44'] 
        : ['28', '29', '30', '31', '32', '34', '36']);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '28');

  // Accordions state
  const [isModelOpen, setIsModelOpen] = useState(true);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  // Size Guide Modal
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [guideHeight, setGuideHeight] = useState('175');
  const [guideWeight, setGuideWeight] = useState('65');
  const [recommendedSize, setRecommendedSize] = useState('30');

  // Similar items (8 items with extracted similar-1.png to 8.png)
  const similarProducts = [
    {
      id: 901,
      name: 'INSANE® Baggy Denim Shorts',
      nameEn: 'INSANE® Baggy Denim Shorts',
      brand: 'TEN-ELEVEN',
      category: 'CLOTHES',
      price: 24.95,
      imageUrl: '/zando-assets/similar-1.png',
      hoverImageUrl: '/zando-assets/similar-1.png'
    },
    {
      id: 902,
      name: 'TEN11 Acid Wash Carpenter Pants',
      nameEn: 'TEN11 Acid Wash Carpenter Pants',
      brand: 'TEN-ELEVEN',
      category: 'CLOTHES',
      price: 34.50,
      imageUrl: '/zando-assets/similar-2.png',
      hoverImageUrl: '/zando-assets/similar-2.png'
    },
    {
      id: 903,
      name: 'GATONI Oversized Pleated Trousers',
      nameEn: 'GATONI Oversized Pleated Trousers',
      brand: 'GATONI',
      category: 'CLOTHES',
      price: 36.00,
      imageUrl: '/zando-assets/similar-3.png',
      hoverImageUrl: '/zando-assets/similar-3.png'
    },
    {
      id: 904,
      name: 'ROUTINE Relaxed Fit Cargo Pants',
      nameEn: 'ROUTINE Relaxed Fit Cargo Pants',
      brand: 'ROUTINE',
      category: 'CLOTHES',
      price: 29.95,
      imageUrl: '/zando-assets/similar-4.png',
      hoverImageUrl: '/zando-assets/similar-4.png'
    },
    {
      id: 905,
      name: 'TAG SPACE Wide Leg Skate Denim',
      nameEn: 'TAG SPACE Wide Leg Skate Denim',
      brand: 'TAG SPACE',
      category: 'CLOTHES',
      price: 32.00,
      imageUrl: '/zando-assets/similar-5.png',
      hoverImageUrl: '/zando-assets/similar-5.png'
    },
    {
      id: 906,
      name: 'DEVOTUS Vintage Wash Raw Edge Pants',
      nameEn: 'DEVOTUS Vintage Wash Raw Edge Pants',
      brand: 'DEVOTUS',
      category: 'CLOTHES',
      price: 38.00,
      imageUrl: '/zando-assets/similar-6.png',
      hoverImageUrl: '/zando-assets/similar-6.png'
    },
    {
      id: 907,
      name: 'TEN11 Raw Black Utility Jeans',
      nameEn: 'TEN11 Raw Black Utility Jeans',
      brand: 'TEN-ELEVEN',
      category: 'CLOTHES',
      price: 35.00,
      imageUrl: '/zando-assets/similar-7.png',
      hoverImageUrl: '/zando-assets/similar-7.png'
    },
    {
      id: 908,
      name: 'INSANE® Heavyweight Workwear Pants',
      nameEn: 'INSANE® Heavyweight Workwear Pants',
      brand: 'TEN-ELEVEN',
      category: 'CLOTHES',
      price: 39.95,
      imageUrl: '/zando-assets/similar-8.png',
      hoverImageUrl: '/zando-assets/similar-8.png'
    }
  ];

  const [similarPage, setSimilarPage] = useState(0);
  const similarPerPage = 4;
  const totalSimilarPages = Math.ceil(similarProducts.length / similarPerPage);
  const currentSimilarItems = similarProducts.slice(
    similarPage * similarPerPage, 
    (similarPage + 1) * similarPerPage
  );

  const priceUsd = Number(product.price || 38.95);
  const compareUsd = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const isDiscounted = compareUsd && compareUsd > priceUsd;
  const discountPercent = product.discountPercent || (
    isDiscounted ? Math.round(((compareUsd - priceUsd) / compareUsd) * 100) : null
  );

  const handleAddToCart = () => {
    const chosenColor = colorVariants[selectedColorIdx]?.nameKm || 'Default';
    addToCart(product, 1, chosenColor, selectedSize);
    setIsCartOpen(true);
  };

  const handleCalculateSize = (e) => {
    e.preventDefault();
    const h = parseInt(guideHeight, 10);
    const w = parseInt(guideWeight, 10);
    if (!h || !w) return;
    if (w < 58) setRecommendedSize('29');
    else if (w < 63) setRecommendedSize('30');
    else if (w < 68) setRecommendedSize('30');
    else if (w < 72) setRecommendedSize('31');
    else if (w < 78) setRecommendedSize('32');
    else setRecommendedSize('34');
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSizeGuideOpen) setIsSizeGuideOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSizeGuideOpen, onClose]);

  // Dual large photos
  const mainImage1 = gallery[activeImgIdx] || product.imageUrl;
  const mainImage2 = gallery[(activeImgIdx + 1) % gallery.length] || product.hoverImageUrl || product.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        top: '86px',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 90,
        backgroundColor: '#ffffff',
        overflowY: 'auto',
        color: '#111827'
      }}
    >
      {/* Container matching Zando width */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 24px 60px 24px' }}>
        
        {/* Top bar with ONLY Square Back Button (Matches real Zando) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={onClose}
            aria-label="Back"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#111827'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <ArrowLeft size={18} color="#111827" />
          </motion.button>
        </div>

        {/* ========================================================================= */}
        {/* MAIN PRODUCT STAGE (Exact match to card-2-color.png)                     */}
        {/* ========================================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(360px, 420px)',
          gap: '40px',
          alignItems: 'start'
        }}>
          
          {/* LEFT: GALLERY (Vertical Thumbnails + Dual Large Photos) */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            
            {/* Thumbnails (Displays all images of active color) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '74px',
              flexShrink: 0
            }}>
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  style={{
                    width: '74px',
                    height: '98px',
                    padding: 0,
                    border: activeImgIdx === idx ? '2px solid #000000' : '1px solid #e5e7eb',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#f9fafb'
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>

            {/* Dual Large Images */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              flex: 1,
              position: 'relative'
            }}>
              {/* Main Photo 1 */}
              <div style={{
                aspectRatio: '3 / 4.4',
                backgroundColor: '#f8fafc',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={mainImage1}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Left Arrow Button */}
                <button
                  onClick={() => setActiveImgIdx(prev => (prev > 0 ? prev - 1 : gallery.length - 1))}
                  aria-label="Previous photo"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    color: '#ffffff',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: '2px'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
              </div>

              {/* Main Photo 2 */}
              <div style={{
                aspectRatio: '3 / 4.4',
                backgroundColor: '#f8fafc',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={mainImage2}
                  alt={`${product.name} alternate`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Right Arrow Button */}
                <button
                  onClick={() => setActiveImgIdx(prev => (prev + 1) % gallery.length)}
                  aria-label="Next photo"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    color: '#ffffff',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: '2px'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: PRODUCT INFO SIDEBAR (Exact match to real Zando) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Breadcrumb Trail above Brand (Matches real Zando layout: Screenshot 3) */}
            <div style={{
              fontSize: '0.74rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '6px'
            }}>
              <span 
                style={{ cursor: 'pointer', transition: 'color 0.15s ease' }} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                onClick={() => {
                  onClose();
                  const targetGender = product.gender === 'women' ? 'women' : 'men';
                  try {
                    window.history.pushState(null, '', `/${targetGender}`);
                    window.dispatchEvent(new Event('popstate'));
                  } catch (e) {
                    window.location.hash = `#/${targetGender}`;
                  }
                  if (onNavigateToShop) onNavigateToShop({ brand: 'ALL', category: 'ALL', gender: targetGender });
                }}
              >
                Home
              </span>
              <span>&gt;</span>
              <span 
                style={{ cursor: 'pointer', textTransform: 'uppercase', transition: 'color 0.15s ease' }} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                onClick={() => {
                  const targetGender = product.gender === 'women' ? 'women' : 'men';
                  onClose();
                  try {
                    window.history.pushState(null, '', `/${targetGender}/collection`);
                    window.dispatchEvent(new Event('popstate'));
                  } catch (e) {
                    window.location.hash = `#/${targetGender}/collection`;
                  }
                  if (onNavigateToShop) onNavigateToShop({ brand: 'ALL', category: 'ALL', gender: targetGender });
                }}
              >
                {product.gender === 'women' ? 'WOMEN' : 'MEN'}
              </span>
              <span>&gt;</span>
              <span 
                style={{ cursor: 'pointer', textTransform: 'capitalize', transition: 'color 0.15s ease' }} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                onClick={() => {
                  const cat = product.category || 'CLOTHES';
                  const targetGender = product.gender === 'women' ? 'women' : 'men';
                  onClose();
                  const catSlug = cat === 'SHOES' ? 'shoes' : (cat === 'BAGS' ? 'bags' : 'clothing');
                  try {
                    window.history.pushState(null, '', `/${targetGender}/${catSlug}`);
                    window.dispatchEvent(new Event('popstate'));
                  } catch (e) {
                    window.location.hash = `#/${targetGender}/${catSlug}`;
                  }
                  if (onNavigateToShop) onNavigateToShop({ brand: 'ALL', category: cat, gender: targetGender });
                }}
              >
                {product.category === 'SHOES' ? 'Shoes' : (product.category === 'BAGS' ? 'Bags & Accessories' : 'Clothing')}
              </span>
              <span>&gt;</span>
              <span 
                style={{ cursor: 'pointer', textTransform: 'capitalize', transition: 'color 0.15s ease' }} 
                onMouseEnter={(e) => e.currentTarget.style.color = '#000000'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                onClick={() => {
                  const sub = product.subCategory || 'Jeans';
                  const targetGender = product.gender === 'women' ? 'women' : 'men';
                  onClose();
                  try {
                    window.history.pushState(null, '', `/${targetGender}/clothing`);
                    window.dispatchEvent(new Event('popstate'));
                  } catch (e) {
                    window.location.hash = `#/${targetGender}/clothing`;
                  }
                  if (onNavigateToShop) onNavigateToShop({ brand: 'ALL', category: sub, gender: targetGender });
                }}
              >
                {product.subCategory || 'Jeans'}
              </span>
              <span>&gt;</span>
              <span style={{ color: '#111827', fontWeight: 600 }}>
                {product.nameEn || product.name}
              </span>
            </div>

            {/* Product English Code / Subtitle */}
            {product.nameEn && (
              <div style={{
                fontSize: '0.74rem',
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                marginBottom: '8px'
              }}>
                {product.nameEn}
              </div>
            )}

            {/* Brand Header */}
            <div style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#111827',
              letterSpacing: '0.04em'
            }}>
              {product.brand || 'TEN-ELEVEN'}
            </div>

            {/* Product Title */}
            <h1 style={{
              fontSize: '1.3rem',
              fontWeight: 600,
              color: '#111827',
              margin: '6px 0 12px 0',
              lineHeight: '1.35'
            }}>
              {lang === 'km' && product.name ? product.name : (product.nameEn || product.name || 'INSANE® ROYAL PANTS')}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '24px' }}>
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: (discountPercent && discountPercent > 0) ? '#da2a2e' : '#111827'
              }}>
                ${priceUsd.toFixed(2)}
              </span>
              {compareUsd && compareUsd > priceUsd && (
                <span style={{
                  fontSize: '1.05rem',
                  color: '#9ca3af',
                  textDecoration: 'line-through',
                  fontWeight: 400
                }}>
                  ${compareUsd.toFixed(2)}
                </span>
              )}
            </div>

            {/* Colors Section */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.84rem', color: '#4b5563', marginBottom: '8px', fontWeight: 500 }}>
                {colorVariants.length} Colors available
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {colorVariants.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectColor(i)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '75px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      border: selectedColorIdx === i ? '2px solid #000000' : '1px solid #e5e7eb',
                      backgroundColor: '#f3f4f6',
                      transition: 'border-color 0.15s ease'
                    }}>
                      <img
                        src={c.image}
                        alt={c.nameKm}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: selectedColorIdx === i ? '#111827' : '#4b5563', fontWeight: selectedColorIdx === i ? 600 : 400 }}>
                      {c.nameKm}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Guide Bar (Matching card-2-color.png) */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '10px 14px',
              borderRadius: '2px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              border: '1px solid #f1f5f9'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#4b5563' }}>
                Find the size that fits your measurements
              </span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  color: '#111827',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Ruler size={14} />
                <span>Open size guide</span>
              </button>
            </div>

            {/* Size Selection */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                Please select one size
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      minWidth: '46px',
                      height: '38px',
                      padding: '0 12px',
                      backgroundColor: selectedSize === sz ? '#f3f4f6' : '#ffffff',
                      border: selectedSize === sz ? '1.5px solid #111827' : '1px solid #e5e7eb',
                      borderRadius: '2px',
                      fontSize: '0.82rem',
                      fontWeight: selectedSize === sz ? 700 : 500,
                      color: '#111827',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Bag & Wishlist Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  height: '46px',
                  backgroundColor: '#71717a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#18181b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#71717a'}
              >
                Add to bag
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={() => toggleWishlist(product)}
                aria-label="Add to wishlist"
                style={{
                  width: '46px',
                  height: '46px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isWished ? '#ef4444' : '#111827'
                }}
              >
                <Heart size={20} fill={isWished ? '#ef4444' : 'none'} strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* Logistics info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              padding: '12px 0 16px 0',
              borderBottom: '1px solid #f1f5f9',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#4b5563', fontWeight: 500 }}>
                <Truck size={16} />
                <span>Global Shipping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#4b5563', fontWeight: 500 }}>
                <RotateCcw size={16} />
                <span>14-Day Return Policy</span>
              </div>
            </div>

            {/* Accordion 1: អំពីម៉ូដែល (About Model) */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '12px' }}>
              <button
                onClick={() => setIsModelOpen(!isModelOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  padding: '8px 0',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#111827'
                }}
              >
                <span>អំពីម៉ូដែល</span>
                {isModelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isModelOpen && (
                <p style={{
                  margin: '6px 0 0 0',
                  fontSize: '0.82rem',
                  color: '#4b5563',
                  lineHeight: '1.5'
                }}>
                  {product.modelInfo || 'Model is 176 cm tall / 66 kg weight and is wearing size M.'}
                </p>
              )}
            </div>

            {/* Accordion 2: ព័ត៌មានលម្អិតពីផលិតផល (Product Details) */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  padding: '8px 0',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#111827'
                }}
              >
                <span>ព័ត៌មានលម្អិតពីផលិតផល</span>
                {isDetailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isDetailsOpen && (
                <div style={{ margin: '8px 0 0 0', fontSize: '0.82rem', color: '#4b5563', lineHeight: '1.6' }}>
                  <div style={{ fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                    លេខកូដ: {product.zandoCode || '10112606136'}
                  </div>
                  <p style={{ margin: 0 }}>
                    {product.shortDescription || 'ខោខូវប៊យពណ៌ខ្មៅជើងធំរបៀប ជើងធំ និង ជើងធំបែបប៉ោង ផ្តល់ភាពទូលាយស្រួលពាក់។ គុណភាពរឹងមាំ មានហោប៉ៅជ្រៅ សាកសមសម្រាប់ការស្លៀកពាក់ ប្រចាំថ្ងៃ និងម៉ូតបែបយុវវ័យសម័យ។'}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* SIMILAR ITEMS (Exact match to card-detalis.png, similar-*.png)            */}
        {/* ========================================================================= */}
        <div style={{ marginTop: '60px', borderTop: '1px solid #f1f5f9', paddingTop: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              Similar Items
            </h2>
            {/* Slider Arrows */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSimilarPage(prev => Math.max(0, prev - 1))}
                disabled={similarPage === 0}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: similarPage === 0 ? '#f3f4f6' : '#111827',
                  color: similarPage === 0 ? '#9ca3af' : '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: similarPage === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setSimilarPage(prev => Math.min(totalSimilarPages - 1, prev + 1))}
                disabled={similarPage >= totalSimilarPages - 1}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: similarPage >= totalSimilarPages - 1 ? '#f3f4f6' : '#111827',
                  color: similarPage >= totalSimilarPages - 1 ? '#9ca3af' : '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: similarPage >= totalSimilarPages - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            {currentSimilarItems.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                onQuickView={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>

          {/* Progress Slider Line (Exact match to ksnip_20260904-184433.png) */}
          <div style={{
            width: '100%',
            maxWidth: '360px',
            height: '3px',
            backgroundColor: '#e5e7eb',
            margin: '24px auto 0 auto',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${100 / totalSimilarPages}%`,
              backgroundColor: '#111827',
              transform: `translateX(${similarPage * 100}%)`,
              transition: 'transform 0.3s ease'
            }} />
          </div>
        </div>

      </div>

      {/* Pure Jet Black Luxury Footer at Bottom */}
      <ZandoFooter />

      {/* ========================================================================= */}
      {/* SIZE GUIDE MATRIX POPUP MODAL (Exact match to card-detalis.png)           */}
      {/* ========================================================================= */}
      {isSizeGuideOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '4px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#111827' }}>
                Enter your height and weight
              </h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Input row */}
            <form onSubmit={handleCalculateSize} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                  Height(cm)
                </label>
                <input
                  type="number"
                  value={guideHeight}
                  onChange={(e) => setGuideHeight(e.target.value)}
                  style={{
                    width: '110px',
                    padding: '8px 10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '2px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                  Weight(kg)
                </label>
                <input
                  type="number"
                  value={guideWeight}
                  onChange={(e) => setGuideWeight(e.target.value)}
                  style={{
                    width: '110px',
                    padding: '8px 10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '2px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  padding: '8px 24px',
                  border: 'none',
                  borderRadius: '2px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
              {recommendedSize && (
                <div style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>
                  Recommended size: {recommendedSize}
                </div>
              )}
            </form>

            {/* Height vs Weight Matrix Chart Table */}
            <div style={{ overflowX: 'auto', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, padding: '6px 8px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                Height (cm) \ Weight (kg)
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', textAlign: 'center' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '6px', borderRight: '1px solid #e5e7eb' }}>Height</th>
                    <th style={{ padding: '6px', borderRight: '1px solid #e5e7eb' }}>55-57</th>
                    <th style={{ padding: '6px', borderRight: '1px solid #e5e7eb' }}>58-59</th>
                    <th style={{ padding: '6px', borderRight: '1px solid #e5e7eb' }}>60-62</th>
                    <th style={{ padding: '6px', borderRight: '1px solid #e5e7eb' }}>63-64</th>
                    <th style={{ padding: '6px', borderRight: '1px solid #e5e7eb' }}>65-67</th>
                    <th style={{ padding: '6px', borderRight: '1px solid #e5e7eb' }}>68-69</th>
                    <th style={{ padding: '6px' }}>70-72</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { h: '160-162', s: ['29', '29', '29', '30', '30', '30', '30'] },
                    { h: '163-164', s: ['29', '29', '29', '30', '30', '30', '31'] },
                    { h: '165-167', s: ['29', '29', '29', '30', '30', '30', '31'] },
                    { h: '168-169', s: ['29', '29', '30', '30', '30', '30', '31'] },
                    { h: '170-172', s: ['29', '29', '30', '30', '30', '30', '31'] },
                    { h: '173-174', s: ['30', '30', '30', '30', '30', '30', '31'] },
                    { h: '175-177', s: ['30', '30', '30', '30', '30', '30', '31'] },
                    { h: '178-179', s: ['30', '30', '30', '30', '30', '30', '31'] },
                    { h: '180-182', s: ['30', '30', '30', '30', '31', '31', '32'] }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '5px', fontWeight: 600, borderRight: '1px solid #e5e7eb', backgroundColor: '#fafafa' }}>{row.h}</td>
                      {row.s.map((sz, i) => (
                        <td
                          key={i}
                          style={{
                            padding: '5px',
                            borderRight: i < row.s.length - 1 ? '1px solid #f3f4f6' : 'none',
                            backgroundColor: recommendedSize === sz ? '#dcfce7' : 'transparent',
                            fontWeight: recommendedSize === sz ? 700 : 400
                          }}
                        >
                          {sz}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Body measurements */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 10px 0', color: '#111827' }}>
                Body measurements
              </h4>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {['28', '29', '30', '31', '32', '34', '36'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      padding: '6px 14px',
                      border: selectedSize === sz ? '1.5px solid #111827' : '1px solid #e5e7eb',
                      borderRadius: '2px',
                      backgroundColor: selectedSize === sz ? '#f3f4f6' : '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: selectedSize === sz ? 700 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Waist Measurement: <strong>70 Cm</strong></div>
                <div>Hip Measurement: <strong>90 Cm</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
