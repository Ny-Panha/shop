import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Search, Heart, User, Languages, Bell,
  Menu, X, Link2, Sparkles, ChevronDown, ChevronUp, Check, ShieldCheck, 
  Flame, ArrowRight, Tag, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function ZandoHeader({ 
  activeView, 
  setActiveView, 
  selectedBrand, 
  setSelectedBrand, 
  selectedCategory, 
  setSelectedCategory, 
  selectedGender = 'men',
  setSelectedGender,
  searchQuery, 
  setSearchQuery,
  onOpenUrlsModal,
  onOpenToolsModal 
}) {
  const { cartCount, currency, setCurrency, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { lang, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, setIsAuthModalOpen, setIsProfileDrawerOpen } = useAuth();

  const activeGender = selectedGender || 'men';
  const setActiveGender = (g) => {
    if (setSelectedGender) setSelectedGender(g);
  };
  const [hoveredGender, setHoveredGender] = useState(null); // 'women' | 'men' | 'beauty' | 'kids' | 'lifestyle' | null
  const [isSubBarHovered, setIsSubBarHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null); // 'new_in' | 'clothing' | 'shoes' | 'accessories' | 'collections'
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const searchContainerRef = useRef(null);
  const megaMenuTimeoutRef = useRef(null);

  const isSubBarVisible = (hoveredGender !== null) || isSubBarHovered;

  // Hover controllers: sub-bar and mega-menu only show on hover, closing smoothly when mouse leaves
  const handleGenderEnter = (genderId) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setHoveredGender(genderId);
    setIsSubBarHovered(true);
  };

  const handleSubBarEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsSubBarHovered(true);
  };

  const handleCategoryEnter = (megaKey) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsSubBarHovered(true);
    if (megaKey) {
      setActiveMegaMenu(megaKey);
      setIsMegaMenuHovered(true);
    } else {
      setActiveMegaMenu(null);
      setIsMegaMenuHovered(false);
    }
  };

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setIsSubBarHovered(true);
    setIsMegaMenuHovered(true);
  };

  const handleAllLeave = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    // 150ms buffer so moving cursor between gender tab, sub-bar, and mega menu feels natural
    megaMenuTimeoutRef.current = setTimeout(() => {
      setHoveredGender(null);
      setIsSubBarHovered(false);
      setIsMegaMenuHovered(false);
      setActiveMegaMenu(null);
    }, 150);
  };

  const handleCloseAllImmediately = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setHoveredGender(null);
    setIsSubBarHovered(false);
    setIsMegaMenuHovered(false);
    setActiveMegaMenu(null);
  };

  // Close all menus automatically when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      handleCloseAllImmediately();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    };
  }, []);

  // Rolling announcement ticker
  const announcements = [
    {
      en: '⚡ FLASH SALE: UP TO 70% OFF ON SELECTED STREETWEAR',
      km: '⚡ មហាមហោស្រពបញ្ចុះតម្លៃរហូតដល់ 70% លើម៉ូដទាន់សម័យ'
    },
    {
      en: '🚚 FREE SHIPPING ON ORDERS OVER $30 IN PHNOM PENH',
      km: '🚚 ដឹកជញ្ជូនឥតគិតថ្លៃសម្រាប់ការកម្ម៉ង់ចាប់ពី $30 ឡើងទៅនៅភ្នំពេញ'
    },
    {
      en: '🇰🇭 DUAL CURRENCY: PAY WITH ABA KHQR OR CASH ON DELIVERY',
      km: '🇰🇭 គាំទ្ររូបិយប័ណ្ណដុល្លារ និងរៀល ទូទាត់ងាយស្រួលតាម ABA KHQR'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Suggested keywords & quick categories
  const suggestedKeywords = [
    'T-Shirts', 'Jeans', 'Sneakers', 'TEN11', 'Routine', 'Gatoni', 'Polo', 'Clearance $9.99'
  ];

  // Exact 2-Column Mega Menus from real Zando screenshots
  const megaMenus = {
    new_in: {
      title: 'New In',
      col1: [
        { name: 'All', cat: 'NEW_IN', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=120&q=80' },
        { name: 'សម្លៀកបំពាក់បែបប្រចាំថ្ងៃ', cat: 'CLOTHES', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80' },
        { name: 'សម្លៀកបំពាក់កីឡាប្រចាំថ្ងៃ', cat: 'CLOTHES', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=120&q=80' },
        { name: 'ខោចូលថ្មី', cat: 'Jeans', img: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=120&q=80' }
      ],
      col2: [
        { name: 'សម្រស់', cat: 'ALL', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=120&q=80' },
        { name: 'សម្លៀកបំពាក់បែបសមរម្យ', cat: 'CLOTHES', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80' },
        { name: 'អាវចូលថ្មី', cat: 'T-Shirts', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=120&q=80' },
        { name: 'អាវក្រៅចូលថ្មី', cat: 'CLOTHES', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=120&q=80' }
      ]
    },
    clothing: {
      title: 'Clothing',
      col1: [
        { name: 'All', cat: 'CLOTHES', img: '/zando-assets/menu/menu-cloth-all.png' },
        { name: 'អាវយឺត', cat: 'T-Shirts', img: '/zando-assets/menu/menu-cloth-tshirt.png' },
        { name: 'អាវធំ និង អាវក្រៅ', cat: 'CLOTHES', img: '/zando-assets/menu/menu-cloth-jacket.png' },
        { name: 'អាវរងារ', cat: 'CLOTHES', img: '/zando-assets/menu/menu-cloth-hoodie.png' },
        { name: 'ខោជើងវែង និង ខោយឺត', cat: 'Jeans', img: '/zando-assets/menu/menu-cloth-pants.png' },
        { name: 'ខោខ្លី', cat: 'Jeans', img: '/zando-assets/menu/menu-cloth-shorts.png' },
        { name: 'ខោក្នុង Boxers', cat: 'CLOTHES', img: '/zando-assets/menu/menu-cloth-boxers.png' }
      ],
      col2: [
        { name: 'អាវសឺមី', cat: 'CLOTHES', img: '/zando-assets/menu/menu-cloth-shirt.png' },
        { name: 'អាវប៉ូឡូ', cat: 'T-Shirts', img: '/zando-assets/menu/menu-cloth-polo.png' },
        { name: 'អាវកាក់ និង អាវសាច់ចាក់', cat: 'CLOTHES', img: '/zando-assets/menu/menu-cloth-vest.png' },
        { name: 'សម្លៀកបំពាក់កីឡា', cat: 'CLOTHES', img: '/zando-assets/menu/menu-cloth-sport.png' },
        { name: 'ខោសាច់ក្រណាត់', cat: 'Jeans', img: '/zando-assets/menu/menu-cloth-trouser.png' },
        { name: 'ខោខូវប៊យ', cat: 'Jeans', img: '/zando-assets/menu/menu-cloth-jeans.png' },
        { name: 'សម្លៀកបំពាក់គេង', cat: 'CLOTHES', img: '/zando-assets/menu/menu-cloth-sleepwear.png' }
      ]
    },
    shoes: {
      title: 'Shoes',
      col1: [
        { name: 'All', cat: 'SHOES', img: '/zando-assets/menu/menu-shoe-all.png' },
        { name: 'ស្បែកជើងស៊ក', cat: 'SHOES', img: '/zando-assets/menu/menu-shoe-slipon.png' },
        { name: 'ស្រោមជើង', cat: 'BAGS', img: '/zando-assets/menu/menu-shoe-socks.png' }
      ],
      col2: [
        { name: 'ស្បែកជើងកីឡា', cat: 'SHOES', img: '/zando-assets/menu/menu-shoe-sport.png' },
        { name: 'ស្បែកជើងប៉ាតា', cat: 'SHOES', img: '/zando-assets/menu/menu-shoe-sneakers.png' }
      ]
    },
    accessories: {
      title: 'Accessories',
      col1: [
        { name: 'All', cat: 'BAGS', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=120&q=80' },
        { name: 'កាបូបស្ពាយ', cat: 'BAGS', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=120&q=80' },
        { name: 'មួក', cat: 'BAGS', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=120&q=80' }
      ],
      col2: [
        { name: 'វ៉ែនតា', cat: 'BAGS', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=120&q=80' },
        { name: 'ខ្សែក្រវាត់', cat: 'BAGS', img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=120&q=80' }
      ]
    },
    collections: {
      title: 'Collections',
      col1: [
        { name: 'Tag Space', brand: 'TAGSPACE', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=120&q=80' },
        { name: 'Memories', brand: 'ROUTINE', img: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=120&q=80' },
        { name: 'Modern Symmetry', brand: 'GATONI', img: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=120&q=80' },
        { name: 'Ice Cream Diaries', brand: 'ROUTINE', img: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=120&q=80' }
      ],
      col2: [
        { name: 'Latest 361° Athleisure Wear', brand: '361', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80' },
        { name: 'CLOCK IT', brand: 'TEN11', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80' },
        { name: 'Oxfit Atelier', brand: 'TEN11', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=120&q=80' },
        { name: 'Through The Mist', brand: 'GATONI', img: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=120&q=80' }
      ]
    },
    skincare: {
      title: 'Skincare',
      col1: [
        { name: 'All Skincare', cat: 'ALL', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=120&q=80' },
        { name: 'ហ្វូមលាងមុខ (Cleanser)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1556228722-d9b3be373b98?auto=format&fit=crop&w=120&q=80' },
        { name: 'ទឹកជូតមុខ (Toner)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=120&q=80' },
        { name: 'សេរ៉ូម (Serum)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=120&q=80' }
      ],
      col2: [
        { name: 'ឡេផ្ដល់សំណើម (Moisturizer)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=120&q=80' },
        { name: 'ឡេការពារកម្ដៅថ្ងៃ (Sunscreen)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=120&q=80' },
        { name: 'ម៉ាស់បិទមុខ (Face Mask)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1567928815116-f77209796035?auto=format&fit=crop&w=120&q=80' },
        { name: 'ក្រែមលាបភ្នែក (Eye Cream)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1512290900672-1f41e57c6b41?auto=format&fit=crop&w=120&q=80' }
      ]
    },
    haircare: {
      title: 'Haircare',
      col1: [
        { name: 'All Haircare', cat: 'ALL', img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=120&q=80' },
        { name: 'សាប៊ូកក់សក់ (Shampoo)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=120&q=80' },
        { name: 'ក្រែមបន្ទន់សក់ (Conditioner)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=120&q=80' }
      ],
      col2: [
        { name: 'ប្រេងលាបសក់ (Hair Oil)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1608248597358-00566373b9e4?auto=format&fit=crop&w=120&q=80' },
        { name: 'ម៉ាស់អប់សក់ (Hair Treatment)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=120&q=80' }
      ]
    },
    makeup: {
      title: 'Makeup',
      col1: [
        { name: 'All Makeup', cat: 'ALL', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=120&q=80' },
        { name: 'ក្រែមលាបមាត់ (Lipstick)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=120&q=80' },
        { name: 'ម្សៅទ្រនាប់ (Foundation)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=120&q=80' }
      ],
      col2: [
        { name: 'ម៉ាស្ការ៉ា & គូសភ្នែក (Mascara)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=120&q=80' },
        { name: 'ផាត់ថ្ពាល់ & ហាយឡាយ (Blush)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=120&q=80' }
      ]
    },
    bodycare: {
      title: 'Body Care',
      col1: [
        { name: 'All Body Care', cat: 'ALL', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=120&q=80' },
        { name: 'សាប៊ូដុសខ្លួន (Body Wash)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=120&q=80' }
      ],
      col2: [
        { name: 'ឡេលាបខ្លួន (Body Lotion)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=120&q=80' },
        { name: 'ស្ក្រាប់ខាត់ស្បែក (Body Scrub)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1567928815116-f77209796035?auto=format&fit=crop&w=120&q=80' }
      ]
    },
    fragrance: {
      title: 'Fragrance',
      col1: [
        { name: 'All Fragrance', cat: 'ALL', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=120&q=80' },
        { name: 'ទឹកអប់បុរស (Men Perfume)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=120&q=80' }
      ],
      col2: [
        { name: 'ទឹកអប់នារី (Women Perfume)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=120&q=80' },
        { name: 'ស្ព្រាយបាញ់ខ្លួន (Body Mist)', cat: 'ALL', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=120&q=80' }
      ]
    }
  };

  // Sub-navigation dictionaries for each department (Women, Men, Beauty, Kids, Lifestyle)
  const genderSubMenus = {
    men: [
      { id: 'new_in', label: 'ម៉ូតថ្មីៗ', hasChevron: true, megaKey: 'new_in', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('men'); setSelectedCategory('NEW_IN'); setSelectedBrand('ALL'); setActiveView('shop'); } },
      { id: 'clothing', label: 'សម្លៀកបំពាក់', hasChevron: true, megaKey: 'clothing', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('men'); setSelectedCategory('CLOTHES'); setSelectedBrand('ALL'); setActiveView('shop'); } },
      { id: 'shoes', label: 'ស្បែកជើង', hasChevron: true, megaKey: 'shoes', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('men'); setSelectedCategory('SHOES'); setSelectedBrand('ALL'); setActiveView('shop'); } },
      { id: 'accessories', label: 'គ្រឿងលម្អ', hasChevron: true, megaKey: 'accessories', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('men'); setSelectedCategory('BAGS'); setSelectedBrand('ALL'); setActiveView('shop'); } },
      { id: 'collections', label: 'Collections', hasChevron: true, megaKey: 'collections', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('men'); setSelectedCategory('ALL'); setSelectedBrand('ALL'); setActiveView('shop'); } }
    ],
    women: [
      { id: 'new_in', label: 'ម៉ូតថ្មីៗ', hasChevron: true, megaKey: 'new_in', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('women'); setSelectedCategory('NEW_IN'); setSelectedBrand('ALL'); setActiveView('shop'); } },
      { id: 'clothing', label: 'សម្លៀកបំពាក់នារី', hasChevron: true, megaKey: 'clothing', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('women'); setSelectedCategory('CLOTHES'); setSelectedBrand('ALL'); setActiveView('shop'); } },
      { id: 'shoes', label: 'ស្បែកជើងនារី', hasChevron: true, megaKey: 'shoes', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('women'); setSelectedCategory('SHOES'); setSelectedBrand('ALL'); setActiveView('shop'); } },
      { id: 'accessories', label: 'កាបូប & គ្រឿងលម្អ', hasChevron: true, megaKey: 'accessories', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('women'); setSelectedCategory('BAGS'); setSelectedBrand('ALL'); setActiveView('shop'); } },
      { id: 'collections', label: 'Collections', hasChevron: true, megaKey: 'collections', action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('women'); setSelectedCategory('ALL'); setSelectedBrand('ALL'); setActiveView('shop'); } }
    ],
    beauty: [
      { id: 'skincare', label: 'ផលិតផលសម្អាតទឹក និងថែរក្សាស្បែកមុខ', hasChevron: true, megaKey: 'skincare', action: () => { handleCloseAllImmediately(); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'haircare', label: 'ផលិតផលថែរក្សាសក់', hasChevron: true, megaKey: 'haircare', action: () => { handleCloseAllImmediately(); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'makeup', label: 'គ្រឿងសម្អាង', hasChevron: true, megaKey: 'makeup', action: () => { handleCloseAllImmediately(); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'bodycare', label: 'ផលិតផលថែរក្សាខ្លួន', hasChevron: true, megaKey: 'bodycare', action: () => { handleCloseAllImmediately(); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'fragrance', label: 'ផលិតផលថែរក្សាក្លិនក្រអូប', hasChevron: true, megaKey: 'fragrance', action: () => { handleCloseAllImmediately(); setSelectedCategory('ALL'); setActiveView('shop'); } }
    ],
    kids: [
      { id: 'boys', label: 'កុមារា', hasChevron: true, action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('kids'); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'girls', label: 'កុមារី', hasChevron: true, action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('kids'); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'baby', label: 'ទារក & ទារិកា', hasChevron: true, action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('kids'); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'shoes', label: 'ស្បែកជើងកុមារ', hasChevron: true, action: () => { handleCloseAllImmediately(); if (setSelectedGender) setSelectedGender('kids'); setSelectedCategory('SHOES'); setActiveView('shop'); } }
    ],
    lifestyle: [
      { id: 'home', label: 'សម្ភារៈផ្ទះបាយ & បន្ទប់គេង', hasChevron: true, action: () => { handleCloseAllImmediately(); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'travel', label: 'សម្ភារៈធ្វើដំណើរ', hasChevron: true, action: () => { handleCloseAllImmediately(); setSelectedCategory('ALL'); setActiveView('shop'); } },
      { id: 'sports', label: 'កីឡា & សុខភាព', hasChevron: true, action: () => { handleCloseAllImmediately(); setSelectedCategory('ALL'); setActiveView('shop'); } }
    ]
  };

  const activeDepartment = hoveredGender || activeGender;
  const currentSubLinks = genderSubMenus[activeDepartment] || genderSubMenus.men;

  return (
    <>
      {/* 1. FIXED HEADER WRAPPER (TOTAL EXACT HEIGHT: 123px) */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 100,
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
        }}
        onMouseLeave={handleAllLeave}
      >
        
        {/* ------------------------------------------------------------- */}
        {/* TIER 1: TOP ANNOUNCEMENT STRIP (Height: 32px)                 */}
        {/* ------------------------------------------------------------- */}
        <div style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.03em',
          position: 'relative',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ textAlign: 'center', overflow: 'hidden', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={announcementIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.02em' }}
              >
                {lang === 'km' ? announcements[announcementIdx].km : announcements[announcementIdx].en}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Currency & Language Controls */}
          <div style={{ position: 'absolute', right: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'rgba(255,255,255,0.14)', padding: '2px 4px', borderRadius: '4px' }}>
              <button
                onClick={() => setCurrency('USD')}
                style={{
                  background: currency === 'USD' ? '#ffffff' : 'transparent',
                  color: currency === 'USD' ? '#000000' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '1px 6px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency('KHR')}
                style={{
                  background: currency === 'KHR' ? '#ffffff' : 'transparent',
                  color: currency === 'KHR' ? '#000000' : '#cbd5e1',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '1px 6px',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ៛ KHR
              </button>
            </div>
            <button
              onClick={toggleLanguage}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Languages size={12} color="#cbd5e1" />
              <span>{lang === 'km' ? 'KM' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TIER 2: MAIN BRAND & ACTION BAR (Height: 52px)                */}
        {/* ------------------------------------------------------------- */}
        <div style={{
          height: '52px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <div style={{
            maxWidth: '1360px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            
            {/* Left: Department Tabs (Matches real Zando: នារី | បុរស | BEAUTY | កុមារ | LIFESTYLE) */}
            <div 
              onMouseLeave={handleAllLeave}
              style={{ display: 'flex', alignItems: 'center', gap: '22px', height: '52px' }} 
              className="hidden md:flex"
            >
              {[
                { id: 'women', label: 'នារី', hash: '#/women' },
                { id: 'men', label: 'បុរស', hash: '#/men' },
                { id: 'beauty', label: 'BEAUTY', hash: '#/women/beauty', isBeauty: true },
                { id: 'kids', label: 'កុមារ', hash: '#/kids' },
                { id: 'lifestyle', label: 'LIFESTYLE', hash: '#/lifestyle' }
              ].map((g) => {
                const isActive = activeGender === g.id;
                const isHovered = hoveredGender === g.id;
                const isHighlight = isHovered || (isActive && hoveredGender === null);
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSelectedBrand('ALL');
                      if (g.id === 'men' || g.id === 'women' || g.id === 'kids') {
                        // Navigate to gender home page via App.jsx's setSelectedGender → navigate()
                        if (setSelectedGender) setSelectedGender(g.id);
                      } else {
                        // beauty/lifestyle — navigate to shop
                        if (setSelectedGender) setSelectedGender('men');
                        setActiveView('shop');
                      }
                      handleCloseAllImmediately();
                    }}
                    onMouseEnter={() => handleGenderEnter(g.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      height: '100%',
                      padding: '0 2px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.92rem',
                      fontWeight: isHighlight ? 800 : 700,
                      color: g.isBeauty ? '#ec4899' : (isHighlight ? '#000000' : '#4b5563'),
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'color 0.15s ease'
                    }}
                  >
                    <span>{g.label}</span>
                    {isHighlight && (
                      <motion.div
                        layoutId="activeGenderIndicator"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2.5px',
                          backgroundColor: g.isBeauty ? '#ec4899' : '#000000',
                          borderRadius: '1px'
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
              style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer', color: '#111827' }}
              aria-label="Toggle mobile menu"
            >
              <Menu size={22} />
            </button>

            {/* Center: Real ZANDO. Logo (Matches ksnip_20260904-192642.png) */}
            <div 
              onClick={() => {
                const targetPath = selectedGender === 'women' ? '/women' : '/men';
                try {
                  window.history.pushState(null, '', targetPath);
                  window.dispatchEvent(new Event('popstate'));
                } catch (e) {
                  window.location.hash = `#${targetPath}`;
                }
                setActiveView('home');
                setSelectedBrand('ALL');
                setSelectedCategory('ALL');
              }}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none'
              }}
            >
              <span style={{
                fontSize: '1.95rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#000000',
                fontFamily: "'Plus Jakarta Sans', Montserrat, sans-serif"
              }}>
                ZANDO.
              </span>
            </div>

            {/* Right: Flag + Search Box + User + Bell + Wishlist + Bag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              {/* Flag Icon */}
              <div 
                title="Cambodia"
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <span style={{ fontSize: '15px', lineHeight: 1 }}>🇰🇭</span>
              </div>

              {/* Search Box */}
              <div 
                ref={searchContainerRef}
                style={{
                  position: 'relative',
                  width: isSearchActive ? '260px' : '190px',
                  transition: 'width 0.25s ease'
                }} 
                className="hidden md:block"
              >
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  placeholder="ស្វែងរក"
                  value={searchQuery}
                  onFocus={() => setIsSearchActive(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (activeView !== 'shop') setActiveView('shop');
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '6px 12px 6px 32px',
                    fontSize: '0.82rem',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                />

                {/* Instant Suggestions Popover */}
                {isSearchActive && (
                  <div
                    className="zando-search-dropdown"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                      {lang === 'km' ? 'ពាក្យស្វែងរកពេញនិយម' : 'Trending Searches'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                      {suggestedKeywords.map((kw) => (
                        <button
                          key={kw}
                          onClick={() => {
                            setSearchQuery(kw);
                            setIsSearchActive(false);
                            setActiveView('shop');
                          }}
                          style={{
                            backgroundColor: '#f1f5f9',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setIsSearchActive(false)}
                        style={{ background: 'none', border: 'none', fontSize: '0.74rem', color: '#64748b', cursor: 'pointer' }}
                      >
                        {lang === 'km' ? 'បិទ' : 'Close'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer User Profile / Auth Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={() => {
                  if (isAuthenticated) {
                    setIsProfileDrawerOpen(true);
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                title={isAuthenticated ? `${user?.name || 'Customer'} (My Account)` : (lang === 'km' ? 'ចូលគណនី / ចុះឈ្មោះ' : 'Sign In / Register')}
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isAuthenticated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #10b981', flexShrink: 0 }}>
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={user?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827' }} className="hidden sm:inline">
                      {user?.name ? user.name.split(' ')[0] : 'Profile'}
                    </span>
                  </div>
                ) : (
                  <User size={20} strokeWidth={1.5} />
                )}
              </motion.button>

              {/* Bell Icon */}
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                title="Notifications"
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#111827', display: 'flex', alignItems: 'center' }}
              >
                <Bell size={20} strokeWidth={1.5} />
              </motion.button>

              {/* Wishlist Heart Icon */}
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={() => setIsWishlistOpen(true)}
                title="Saved Wishlist"
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#111827', position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <Heart size={20} strokeWidth={1.5} color={wishlistCount > 0 ? '#da2a2e' : '#111827'} fill={wishlistCount > 0 ? '#da2a2e' : 'none'} />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      backgroundColor: '#da2a2e',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      borderRadius: '999px',
                      padding: '1px 4px',
                      lineHeight: 1
                    }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Shopping Bag Button (Exact Clean Bag Icon from screenshot) */}
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={() => setIsCartOpen(true)}
                title="Cart"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#111827',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-4px',
                      backgroundColor: '#da2a2e',
                      color: '#ffffff',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      borderRadius: '999px',
                      padding: '1px 5px',
                      lineHeight: 1
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              {/* 170+ URLs button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={onOpenUrlsModal}
                title="ZANDO 170+ Target URLs"
                style={{
                  backgroundColor: '#f8fafc',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '4px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <Link2 size={12} />
                <span className="hidden sm:inline">URLs</span>
              </motion.button>

              {/* Delphi-inspired Shop & POS Tools button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={onOpenToolsModal}
                title="POS Tools & Barcode Label Maker"
                style={{
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  border: '1px solid #111827',
                  borderRadius: '14px',
                  padding: '4px 9px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <span>🏷️ Tools</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TIER 3: DYNAMIC HOVER SUB-NAVIGATION (Appears ONLY on hover like Image 2, hidden like Image 1) */}
        {/* ------------------------------------------------------------- */}
        <div 
          onMouseEnter={handleSubBarEnter}
          onMouseLeave={handleAllLeave}
          style={{
            position: 'absolute',
            top: '86px',
            left: 0,
            right: 0,
            height: '38px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            padding: '0 20px',
            whiteSpace: 'nowrap',
            zIndex: 95,
            opacity: isSubBarVisible ? 1 : 0,
            visibility: isSubBarVisible ? 'visible' : 'hidden',
            pointerEvents: isSubBarVisible ? 'auto' : 'none',
            transform: isSubBarVisible ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s'
          }}
        >
          <div style={{
            maxWidth: '1360px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '24px'
          }}>
            {currentSubLinks.map((link) => {
              const isMenuOpen = isMegaMenuHovered && activeMegaMenu === link.megaKey;

              return (
                <button
                  key={link.id}
                  onClick={link.action}
                  onMouseEnter={() => handleCategoryEnter(link.megaKey)}
                  className={`zando-category-tab ${isMenuOpen ? 'active' : ''}`}
                  style={{
                    fontWeight: isMenuOpen ? 700 : 500,
                    color: isMenuOpen ? '#000000' : '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.86rem',
                    padding: '8px 10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease'
                  }}
                >
                  <span>{link.label}</span>
                  {link.hasChevron && (
                    isMenuOpen ? (
                      <ChevronUp size={13} style={{ opacity: 0.9, color: '#000000' }} />
                    ) : (
                      <ChevronDown size={13} style={{ opacity: 0.7 }} />
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================= */}
        {/* TIER 4: 2-COLUMN MEGA MENU DROPDOWN (Appears on item hover)   */}
        {/* ============================================================= */}
        <div
          className={`zando-mega-dropdown ${(isSubBarVisible && isMegaMenuHovered && activeMegaMenu) ? 'open' : ''}`}
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleAllLeave}
          style={{
            position: 'absolute',
            top: '124px',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            padding: '24px 20px 32px 20px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.08)',
            zIndex: 90,
            opacity: (isSubBarVisible && isMegaMenuHovered && activeMegaMenu) ? 1 : 0,
            visibility: (isSubBarVisible && isMegaMenuHovered && activeMegaMenu) ? 'visible' : 'hidden',
            pointerEvents: (isSubBarVisible && isMegaMenuHovered && activeMegaMenu) ? 'auto' : 'none',
            transform: (isSubBarVisible && isMegaMenuHovered && activeMegaMenu) ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s'
          }}
        >
          {activeMegaMenu && megaMenus[activeMegaMenu] && (
            <div style={{ maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
              <div style={{ maxWidth: '640px' }}>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '18px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {megaMenus[activeMegaMenu].title}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '60px', rowGap: '12px' }}>
                  {/* Column 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {megaMenus[activeMegaMenu].col1.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          handleCloseAllImmediately();
                          setActiveView('shop');
                          if (item.cat) setSelectedCategory(item.cat);
                          if (item.brand) setSelectedBrand(item.brand);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          onError={(e) => { e.currentTarget.src = '/zando-assets/menu/menu-cloth-all.png'; }}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.86rem', color: '#111827', fontWeight: 500 }}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Column 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {megaMenus[activeMegaMenu].col2.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          handleCloseAllImmediately();
                          setActiveView('shop');
                          if (item.cat) setSelectedCategory(item.cat);
                          if (item.brand) setSelectedBrand(item.brand);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          onError={(e) => { e.currentTarget.src = '/zando-assets/menu/menu-cloth-all.png'; }}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.86rem', color: '#111827', fontWeight: 500 }}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Flyout Menu */}
        {isMobileMenuOpen && (
          <div style={{
            backgroundColor: '#ffffff',
            borderBottom: '2px solid #000000',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }} className="md:hidden">
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              {['WOMEN', 'MEN', 'KIDS', 'SALE'].map(g => (
                <button
                  key={g}
                  onClick={() => {
                    setActiveGender(g.toLowerCase());
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    backgroundColor: activeGender === g.toLowerCase() ? '#000000' : '#f1f5f9',
                    color: activeGender === g.toLowerCase() ? '#ffffff' : '#0f172a',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 800,
                    fontSize: '0.75rem'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            {currentSubLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  link.action();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '8px 0',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: link.isSale || link.isHot ? '#e11d48' : '#0f172a',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 2. EXACT 86px SPACER TO PREVENT HEADER OVERLAP (Matches clean Image 1) */}
      <div style={{ height: '86px', backgroundColor: '#ffffff', width: '100%' }} className="zando-header-spacer" />
    </>
  );
}
