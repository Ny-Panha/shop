import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ZandoHeader } from './components/ZandoHeader';
import { ZandoFooter } from './components/ZandoFooter';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { HomePage } from './components/HomePage';
import { ZandoUrlNavigatorModal } from './components/ZandoUrlNavigatorModal';
import { ShopToolsModal } from './components/ShopToolsModal';
import { getProducts } from './api/client';
import { FALLBACK_PRODUCTS } from './data/mockProducts';
import { findProductByZandoRoute, ZANDO_PRODUCTS } from './data/zandoProducts';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from './context/CartContext';

import { AuthProvider } from './context/AuthContext';
import CustomerAuthModal from './components/auth/CustomerAuthModal';
import CustomerProfileDrawer from './components/auth/CustomerProfileDrawer';

import HomePageWrapper from './pages/home/HomePageWrapper';
import ShopPage from './pages/collection/ShopPage';
import ProductDetailPage from './pages/product/ProductDetailPage';
import OrderTrackingPage from './pages/tracking/OrderTrackingPage';

import { syncBridge } from './services/syncBridge';

// ─── Main App Shell ────────────────────────────────────────────────────────────
export function AppContent() {
  const { lang } = useLanguage();
  const { cartCount, setIsCartOpen, cartSubtotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState(() => syncBridge.getProducts());
  const [loading, setLoading] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isUrlsModalOpen, setIsUrlsModalOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');

  // Shared filter state (used by header dropdowns)
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('men');
  const [searchQuery, setSearchQuery] = useState('');

  // Determine activeView from location for Header/Nav
  const pathParts = location.pathname.split('/').filter(Boolean);
  const isHome = pathParts.length <= 1 && !['track', 'admin', 'product'].includes(pathParts[0]);
  const isShop = pathParts.length >= 2 && !['product'].includes(pathParts[0]);
  const isAdmin = pathParts[0] === 'admin';
  const isTrack = pathParts[0] === 'track';
  const isProduct = pathParts[0] === 'product';

  let activeView = 'home';
  if (isAdmin) activeView = 'admin';
  else if (isTrack) activeView = 'track';
  else if (isShop) activeView = 'shop';
  else if (isProduct) activeView = 'shop';

  // Sync gender from URL
  useEffect(() => {
    const genderFromPath = pathParts[0];
    if (genderFromPath === 'women') setSelectedGender('women');
    else if (genderFromPath === 'kids') setSelectedGender('kids');
    else if (genderFromPath === 'men') setSelectedGender('men');
  }, [location.pathname]);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const data = await getProducts({
        brand: selectedBrand,
        category: selectedCategory,
        inStock: false,
        query: searchQuery,
        sort: 'featured'
      });
      const isFashionCatalog = data && Array.isArray(data) && data.length > 0 && (
        data.some(p => p.category === 'CLOTHES' || p.category === 'SHOES' || p.category === 'BAGS' || p.brand === 'TEN11' || p.brand === 'ROUTINE' || p.brand === 'ZANDO')
      );
      setProducts(isFashionCatalog ? data : syncBridge.getProducts());
      setLoading(false);
    } catch (err) {
      setProducts(syncBridge.getProducts());
      setLoading(false);
    }
  };

  useEffect(() => {
    syncBridge.init();
    fetchCatalog();
    const unsub = syncBridge.subscribe(({ key }) => {
      if (key === 'zando_admin_products_v1') {
        setProducts(syncBridge.getProducts());
      }
    });
    return () => unsub();
  }, []);

  const handleGoToTracking = (orderNum) => {
    setTrackingOrderNumber(orderNum);
    navigate(`/track?order=${orderNum}`);
  };

  const handleNavigateToShop = ({ brand, category, gender }) => {
    if (brand) setSelectedBrand(brand);
    if (category) setSelectedCategory(category);
    if (gender) setSelectedGender(gender);
  };

  const currentGender = pathParts[0] === 'women' ? 'women' : pathParts[0] === 'kids' ? 'kids' : 'men';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#0f172a' }}>
      {/* Header */}
      <ZandoHeader
        activeView={activeView}
        setActiveView={(view) => {
          if (view === 'home') navigate(`/${selectedGender}`);
          else if (view === 'shop') navigate(`/${selectedGender}/collection`);
          else if (view === 'track') navigate('/track');
          else if (view === 'admin') navigate('/admin');
        }}
        selectedBrand={selectedBrand}
        setSelectedBrand={(b) => {
          setSelectedBrand(b);
          const slug = b === 'ALL' ? 'collection' : b.toLowerCase().replace(/\s+/g, '-');
          navigate(`/${selectedGender}/${slug}`);
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={(c) => {
          setSelectedCategory(c);
          const slug = c === 'ALL' ? 'collection' : c.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
          navigate(`/${selectedGender}/${slug}`);
        }}
        selectedGender={selectedGender}
        setSelectedGender={(g) => {
          setSelectedGender(g);
          // Gender tab click → always go to gender Home page (not collection)
          navigate(`/${g}`);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenUrlsModal={() => setIsUrlsModalOpen(true)}
        onOpenToolsModal={() => setIsToolsModalOpen(true)}
        onResetFilters={() => {
          setSelectedBrand('ALL');
          setSelectedCategory('ALL');
          setSearchQuery('');
          navigate(`/${selectedGender}/collection`);
        }}
      />

      {/* Main Routes */}
      <main style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePageWrapper products={products} loading={loading} />} />
          <Route path="/men" element={<HomePageWrapper products={products} loading={loading} />} />
          <Route path="/women" element={<HomePageWrapper products={products} loading={loading} />} />
          <Route path="/kids" element={<HomePageWrapper products={products} loading={loading} />} />

          {/* Shop Catalog */}
          <Route path="/:gender/collection" element={<ShopPage products={products} loading={loading} fetchCatalog={fetchCatalog} />} />
          <Route path="/:gender/:category" element={<ShopPage products={products} loading={loading} fetchCatalog={fetchCatalog} />} />

          {/* Product Detail */}
          <Route path="/product/:slug" element={<ProductDetailPage onNavigateToShop={handleNavigateToShop} />} />

          {/* Track Order */}
          <Route path="/track" element={
            <OrderTrackingView
              initialOrderNumber={trackingOrderNumber}
              onBackToShop={() => navigate(`/${selectedGender}/collection`)}
            />
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <AdminDashboard
              onBackToShop={() => {
                navigate(`/${selectedGender}/collection`);
                fetchCatalog();
              }}
            />
          } />

          {/* Catch-all → redirect home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Cart & Wishlist Drawers */}
      <CartDrawer
        onCheckout={() => setIsCheckoutOpen(true)}
        onContinueShopping={() => navigate(`/${selectedGender}/collection`)}
      />
      <WishlistDrawer
        onQuickView={(p) => {
          const coolSlug = p.cleanSlug || (p.zandoSlug || p.slug || '').replace(/-\d{4,}$/, '').replace(/-\d+$/, '');
          navigate(`/product/${coolSlug}`);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onViewOrderTrack={handleGoToTracking}
      />

      {/* URL Navigator Modal */}
      <ZandoUrlNavigatorModal
        isOpen={isUrlsModalOpen}
        onClose={() => setIsUrlsModalOpen(false)}
        onSelectUrl={(item) => {
          if (item.type === 'product') {
            const p = findProductByZandoRoute(item.url || item.hash);
            if (p) {
              const coolSlug = p.cleanSlug || (p.zandoSlug || p.slug || '').replace(/-\d{4,}$/, '').replace(/-\d+$/, '');
              navigate(`/product/${coolSlug}`);
              return;
            }
          }
          // Clean path navigation
          const cleanPath = (item.hash || item.url || '').replace(/^#/, '');
          navigate(cleanPath);
        }}
      />

      {/* Shop Tools Modal */}
      <ShopToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
      />

      {/* Floating Cart Pill (Desktop) */}
      <AnimatePresence>
        {cartCount > 0 && activeView !== 'admin' && (
          <motion.button
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={() => setIsCartOpen(true)}
            className="hidden md:flex"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 40,
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              borderRadius: '999px',
              padding: '12px 22px',
              fontWeight: 800,
              fontSize: '0.88rem',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <ShoppingBag size={17} color="#ffffff" />
            <span>
              {lang === 'km' ? 'កន្ត្រកទំនិញ' : 'View Bag'} ({cartCount}) • ${cartSubtotal?.toFixed(2) || '0.00'}
            </span>
            <ArrowRight size={15} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Customer User Auth Modal & Profile Drawer */}
      <CustomerAuthModal />
      <CustomerProfileDrawer />

      {/* Footer */}
      <ZandoFooter />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={(view) => {
          if (view === 'home') navigate(`/${selectedGender}`);
          else if (view === 'shop') navigate(`/${selectedGender}/collection`);
          else if (view === 'track') navigate('/track');
          else if (view === 'admin') navigate('/admin');
        }}
        onOpenCategories={() => navigate(`/${selectedGender}/clothes`)}
        onOpenBrands={() => navigate(`/${selectedGender}/routine`)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
