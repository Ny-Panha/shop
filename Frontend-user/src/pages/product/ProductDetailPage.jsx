import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { ProductDetailModal } from '../../components/ProductDetailModal';
import { CheckoutModal } from '../../components/CheckoutModal';
import { productService } from '../../services/product.service';

export default function ProductDetailPage({ onNavigateToShop }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Find product by slug via service
  const product = productService.findBySlug(slug);

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handleClose = () => {
    const gender = product.gender || 'men';
    navigate(`/${gender}/collection`);
  };

  return (
    <>
      <AnimatePresence>
        <ProductDetailModal
          product={product}
          onClose={handleClose}
          onBuyNow={() => {
            setIsCheckoutOpen(true);
          }}
          onNavigateToShop={({ brand, category, gender }) => {
            if (onNavigateToShop) onNavigateToShop({ brand, category, gender });
            navigate(`/${gender || 'men'}/collection`);
          }}
        />
      </AnimatePresence>
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onViewOrderTrack={(orderNum) => navigate(`/track?order=${orderNum}`)}
      />
    </>
  );
}
