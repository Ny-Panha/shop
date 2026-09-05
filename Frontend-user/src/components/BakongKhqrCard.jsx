import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Clock, Copy, Check, AlertTriangle, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import { checkKhqrStatus, getPaymentStatus, simulatePaymentSuccess, simulatePaymentExpire } from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export function BakongKhqrCard({
  order,
  onPaymentSuccess,
  onCancel
}) {
  const { lang, t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [showSandboxTools, setShowSandboxTools] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState('WAITING_PAYMENT');
  const [errorMessage, setErrorMessage] = useState('');

  // 5-minute countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setPaymentStatusText('EXPIRED');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-polling check payment status every 2 seconds
  useEffect(() => {
    if (!order || !order.orderNumber) return;

    const poller = setInterval(async () => {
      try {
        const res = await getPaymentStatus(order.orderNumber);
        setPollCount(c => c + 1);

        if (res) {
          if (res.paid || res.status === 'PAID') {
            clearInterval(poller);
            setPaymentStatusText('PAID');
            if (onPaymentSuccess) {
              onPaymentSuccess({ ...order, paymentStatus: 'PAID' });
            }
          } else if (res.expired || res.status === 'EXPIRED') {
            setPaymentStatusText('EXPIRED');
          }
        }
      } catch (_) {
        // Fallback to checkKhqrStatus
        try {
          const fallback = await checkKhqrStatus(order.orderNumber);
          if (fallback && fallback.paymentStatus === 'PAID') {
            clearInterval(poller);
            setPaymentStatusText('PAID');
            if (onPaymentSuccess) onPaymentSuccess({ ...order, paymentStatus: 'PAID' });
          }
        } catch (_) {}
      }
    }, 2000);

    return () => clearInterval(poller);
  }, [order, onPaymentSuccess]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSimulatePayment = async () => {
    try {
      setIsSimulating(true);
      setErrorMessage('');
      const res = await simulatePaymentSuccess(order.orderNumber);
      setIsSimulating(false);
      setPaymentStatusText('PAID');
      if (onPaymentSuccess) {
        onPaymentSuccess({ ...order, paymentStatus: 'PAID', ...res });
      }
    } catch (err) {
      console.warn('Backend payment simulation endpoint offline, triggering local simulated success:', err.message);
      setIsSimulating(false);
      setPaymentStatusText('PAID');
      if (onPaymentSuccess) {
        onPaymentSuccess({ ...order, paymentStatus: 'PAID', paid: true });
      }
    }
  };

  const handleSimulateExpiry = async () => {
    try {
      setIsSimulating(true);
      setErrorMessage('');
      await simulatePaymentExpire(order.orderNumber);
      setIsSimulating(false);
      setTimeLeft(0);
      setPaymentStatusText('EXPIRED');
    } catch (err) {
      setIsSimulating(false);
      setErrorMessage(err.message || 'Simulation failed');
    }
  };

  const handleCopyPayload = () => {
    if (order && order.khqrString) {
      navigator.clipboard.writeText(order.khqrString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!order) return null;

  return (
    <div className="khqr-card-container animate-fade" style={{ margin: '0 auto' }}>
      {/* NBC Official Red Header */}
      <div className="khqr-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '6px',
            padding: '2px 8px',
            color: '#d61827',
            fontWeight: '900',
            fontSize: '0.9rem',
            letterSpacing: '0.05em'
          }}>
            KHQR
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.04em' }}>
            BAKONG
          </span>
        </div>
        <div style={{ fontSize: '0.72rem', opacity: 0.92, fontWeight: '500' }}>
          National Bank of Cambodia Standard
        </div>
      </div>

      {/* Card Body */}
      <div className="khqr-body">
        {/* Merchant & Bank Name */}
        <div className="khqr-merchant-title">
          CASEHAVEN CAMBODIA
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
          Acquiring Bank: ACLEDA Bank Plc
        </div>

        {/* Dynamic Amount Display */}
        <div className="khqr-amount-usd">
          ${Number(order.totalAmount).toFixed(2)}
        </div>
        <div className="khqr-amount-khr">
          ៛{(order.amountKhr || Math.round(Number(order.totalAmount) * 4100)).toLocaleString('en-US')} KHR
        </div>

        {/* QR Code Container */}
        <div style={{ margin: '16px 0', position: 'relative' }}>
          <div className="khqr-qr-box" style={{ filter: paymentStatusText === 'EXPIRED' ? 'grayscale(1) opacity(0.5)' : undefined }}>
            {order.khqrString ? (
              <QRCodeSVG
                value={order.khqrString}
                size={200}
                level="M"
                includeMargin={true}
              />
            ) : (
              <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Generating KHQR...
              </div>
            )}
          </div>
          {paymentStatusText === 'EXPIRED' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.65)',
              borderRadius: '16px',
              color: '#f87171'
            }}>
              <AlertTriangle size={32} />
              <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '6px' }}>QR Expired</div>
            </div>
          )}
        </div>

        {/* Order ID & Countdown */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '8px 12px',
          background: '#f8fafc',
          borderRadius: '10px',
          fontSize: '0.8rem',
          marginBottom: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <span style={{ color: '#64748b' }}>{lang === 'km' ? 'វិក្កយបត្រ: ' : 'Bill: '}</span>
            <strong style={{ color: '#0f172a' }}>{order.orderNumber}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: timeLeft < 60 ? '#ef4444' : '#d61827', fontWeight: '700' }}>
            <Clock size={14} />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Supported Banks Text */}
        <div style={{
          fontSize: '0.72rem',
          color: '#64748b',
          textAlign: 'center',
          lineHeight: 1.4,
          marginBottom: '12px'
        }}>
          {lang === 'km'
            ? <>ស្កេនជាមួយ <strong>Bakong</strong>, <strong>ABA Mobile</strong>, <strong>ACLEDA mobile</strong>, <strong>Wing</strong> ឬ Mobile Banking ទាំងអស់</>
            : <>Scan with <strong>Bakong</strong>, <strong>ABA Mobile</strong>, <strong>ACLEDA</strong>, <strong>Wing Bank</strong>, or any KHQR banking app.</>}
        </div>

        {/* Live Auto-Check Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.74rem',
          color: '#059669',
          marginBottom: '14px',
          background: '#ecfdf5',
          padding: '5px 12px',
          borderRadius: '9999px',
          border: '1px solid #a7f3d0'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            animation: 'pulseGlow 1.5s infinite'
          }} />
          <span>
            {lang === 'km'
              ? `កំពុងផ្ទៀងផ្ទាត់ការទូទាត់លើបណ្ដាញបាគង (${pollCount})`
              : `Awaiting scan on NBC Bakong network (${pollCount} checks)`}
          </span>
        </div>

        {/* Simulation / Sandbox Test Trigger */}
        <button
          onClick={handleSimulatePayment}
          disabled={isSimulating || paymentStatusText === 'EXPIRED'}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '11px',
            fontWeight: '700',
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            marginBottom: '8px'
          }}
        >
          {isSimulating ? (
            <span>{lang === 'km' ? 'កំពុងបញ្ជាក់ការទូទាត់...' : 'Simulating Settlement...'}</span>
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>{lang === 'km' ? 'សាកល្បងស្កេនទូទាត់ (Sandbox Scan & Pay)' : 'Simulate Bakong Scan & Pay (Sandbox)'}</span>
            </>
          )}
        </button>

        {/* Advanced Sandbox Tools Toggle */}
        <div style={{ width: '100%', marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => setShowSandboxTools(!showSandboxTools)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              width: '100%',
              marginBottom: '8px'
            }}
          >
            <Wrench size={12} />
            <span>{lang === 'km' ? 'ឧបករណ៍សាកល្បង Sandbox' : 'Sandbox Developer Tools'}</span>
            {showSandboxTools ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showSandboxTools && (
            <div style={{
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '0.75rem',
              marginBottom: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#475569' }}>Simulate QR Expiry:</span>
                <button
                  type="button"
                  onClick={handleSimulateExpiry}
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  Expire QR
                </button>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', wordBreak: 'break-all' }}>
                MD5: {order.khqrMd5}
              </div>
            </div>
          )}
        </div>

        {/* Copy KHQR Raw String */}
        <button
          onClick={handleCopyPayload}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
          <span>{copied ? 'Copied KHQR EMVCo Payload!' : 'Copy Raw EMVCo KHQR String'}</span>
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.75rem',
              cursor: 'pointer',
              marginTop: '10px',
              textDecoration: 'underline'
            }}
          >
            {lang === 'km' ? 'ជ្រើសរើសវិធីសាស្ត្រទូទាត់ផ្សេង' : 'Choose a different payment method'}
          </button>
        )}
      </div>
    </div>
  );
}
