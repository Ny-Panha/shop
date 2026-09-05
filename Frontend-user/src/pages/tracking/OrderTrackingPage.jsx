import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderTrackingView } from '../../components/OrderTrackingView';

export default function OrderTrackingPage({ onOpenShop }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialOrder = searchParams.get('order') || '';

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 20px 90px 20px' }}>
      <OrderTrackingView
        initialOrderNumber={initialOrder}
        onOpenShop={() => {
          if (onOpenShop) onOpenShop();
          else navigate('/men/collection');
        }}
      />
    </div>
  );
}
