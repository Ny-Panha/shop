import React from 'react';
import { ZandoStorefront } from './ZandoStorefront';

export function HomePage({ 
  products, 
  selectedGender = 'men',
  onNavigateToShop, 
  onQuickView 
}) {
  return (
    <div style={{
      width: '100%',
      overflowX: 'hidden',
      backgroundColor: '#ffffff',
      color: '#111827',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <ZandoStorefront 
        products={products}
        selectedGender={selectedGender}
        onQuickView={onQuickView}
        onNavigateToShop={onNavigateToShop}
        onFilterBrand={(brand) => onNavigateToShop && onNavigateToShop({ brand })}
      />
    </div>
  );
}
