import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Printer, Download, Sparkles, QrCode, Barcode as BarcodeIcon, 
  Image as ImageIcon, Calculator, Check, Copy, RefreshCw, Layers, Sliders, ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import { ZANDO_PRODUCTS } from '../data/zandoProducts';
import { useLanguage } from '../context/LanguageContext';

export function ShopToolsModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('barcode'); // 'barcode' | 'compressor' | 'converter'

  // -------------------------------------------------------------
  // TAB 1: BARCODE & LABEL MAKER STATE
  // -------------------------------------------------------------
  const [selectedProductId, setSelectedProductId] = useState(100);
  const [customBrand, setCustomBrand] = useState('TEN-ELEVEN');
  const [customName, setCustomName] = useState('INSANE® ROYAL PANTS');
  const [customSku, setCustomSku] = useState('10112606136');
  const [customPrice, setCustomPrice] = useState('38.95');
  const [customSize, setCustomSize] = useState('30');
  const [labelFormat, setLabelFormat] = useState('50x30'); // '50x30', '40x30', 'grid'
  const [printQuantity, setPrintQuantity] = useState(6);
  const [copiedSku, setCopiedSku] = useState(false);

  const barcodeSvgRef = useRef(null);

  // Sync with selected product
  const handleSelectProduct = (prodId) => {
    setSelectedProductId(prodId);
    const p = ZANDO_PRODUCTS.find(item => item.id === Number(prodId));
    if (p) {
      setCustomBrand(p.brand || 'ZANDO');
      setCustomName(p.nameEn || p.name);
      setCustomSku(p.zandoCode || p.sku || `SKU-${p.id}`);
      setCustomPrice(Number(p.price || 0).toFixed(2));
      setCustomSize(p.sizes ? p.sizes[0] : 'M');
    }
  };

  // Render Barcode via JsBarcode
  useEffect(() => {
    if (barcodeSvgRef.current && customSku) {
      try {
        JsBarcode(barcodeSvgRef.current, customSku, {
          format: 'CODE128',
          width: 1.6,
          height: 42,
          displayValue: true,
          font: 'monospace',
          fontSize: 12,
          textMargin: 3,
          margin: 4,
          background: '#ffffff',
          lineColor: '#000000'
        });
      } catch (err) {
        console.warn('JsBarcode render error:', err);
      }
    }
  }, [customSku, activeTab, isOpen]);

  const priceRiel = Math.round(Number(customPrice || 0) * 4100).toLocaleString();

  const handlePrintLabels = () => {
    window.print();
  };

  const handleCopySku = () => {
    navigator.clipboard.writeText(customSku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  // -------------------------------------------------------------
  // TAB 2: CLIENT-SIDE IMAGE COMPRESSOR (DELPHI-STYLE)
  // -------------------------------------------------------------
  const [uploadedImage, setUploadedImage] = useState(null);
  const [originalFileSize, setOriginalFileSize] = useState(0);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressedFileSize, setCompressedFileSize] = useState(0);
  const [compressQuality, setCompressQuality] = useState(80);
  const [maxDimension, setMaxDimension] = useState(800);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      setUploadedImage(src);
      compressImage(src, compressQuality, maxDimension);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (imageSrc, quality, maxDim) => {
    setIsCompressing(true);
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale down proportionally
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const qualityFraction = quality / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', qualityFraction);
        setCompressedImage(compressedDataUrl);

        // Calculate size in bytes from dataUrl
        const head = 'data:image/jpeg;base64,';
        const byteLength = Math.round((compressedDataUrl.length - head.length) * 0.75);
        setCompressedFileSize(byteLength);
      }
      setIsCompressing(false);
    };
  };

  // -------------------------------------------------------------
  // TAB 3: CURRENCY & SIZE CONVERTER STATE
  // -------------------------------------------------------------
  const [calcUsd, setCalcUsd] = useState('25');
  const [calcKhr, setCalcKhr] = useState('102500');
  const [calcExchangeRate, setCalcExchangeRate] = useState('4100');

  const handleUsdChange = (val) => {
    setCalcUsd(val);
    const rate = Number(calcExchangeRate) || 4100;
    setCalcKhr((Number(val || 0) * rate).toLocaleString());
  };

  const [cmValue, setCmValue] = useState('76');
  const [inchValue, setInchValue] = useState('30');

  const handleCmChange = (val) => {
    setCmValue(val);
    setInchValue((Number(val || 0) / 2.54).toFixed(1));
  };

  const handleInchChange = (val) => {
    setInchValue(val);
    setCmValue((Number(val || 0) * 2.54).toFixed(1));
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div style={{
          backgroundColor: '#111827',
          color: '#ffffff',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#2563eb',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em' }}>
                ZANDO / POS Utility Hub
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                Privacy-first browser tools (Client-side, 0 Server load)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          padding: '0 16px'
        }}>
          {[
            { id: 'barcode', label: '🏷️ Barcode & Label Maker', desc: 'Price tags & stickers' },
            { id: 'compressor', label: '⚡ Image Compressor', desc: 'Compress product photos' },
            { id: 'converter', label: '📐 Currency & Size Calc', desc: 'USD ↔ KHR, CM ↔ Inch' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2.5px solid #111827' : '2.5px solid transparent',
                color: activeTab === tab.id ? '#111827' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.86rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#ffffff' }}>
          
          {/* ============================================================= */}
          {/* TAB 1: BARCODE & LABEL MAKER                                  */}
          {/* ============================================================= */}
          {activeTab === 'barcode' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '24px' }}>
                
                {/* Left: Settings & Product selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                      Select Existing Product
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => handleSelectProduct(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      {ZANDO_PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.brand} - {p.nameEn || p.name} (${Number(p.price).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#4b5563', marginBottom: '3px' }}>
                        Brand
                      </label>
                      <input
                        type="text"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#4b5563', marginBottom: '3px' }}>
                        Size
                      </label>
                      <input
                        type="text"
                        value={customSize}
                        onChange={(e) => setCustomSize(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#4b5563', marginBottom: '3px' }}>
                      Barcode / SKU (Code-128)
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        value={customSku}
                        onChange={(e) => setCustomSku(e.target.value)}
                        style={{ flex: 1, padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.82rem', fontFamily: 'monospace' }}
                      />
                      <button
                        onClick={handleCopySku}
                        title="Copy SKU"
                        style={{ padding: '0 10px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {copiedSku ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#4b5563', marginBottom: '3px' }}>
                        Price ($ USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.82rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#4b5563', marginBottom: '3px' }}>
                        Print Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={printQuantity}
                        onChange={(e) => setPrintQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>

                  {/* Print Action Button */}
                  <button
                    onClick={handlePrintLabels}
                    style={{
                      marginTop: '10px',
                      backgroundColor: '#111827',
                      color: '#ffffff',
                      padding: '10px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Printer size={16} />
                    <span>Print {printQuantity} Labels</span>
                  </button>
                </div>

                {/* Right: Live Label Preview (Exact Thermal Tag 50x30mm) */}
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '20px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
                    Live Label Preview (50mm x 30mm):
                  </div>

                  {/* Single Label Card */}
                  <div
                    id="printable-label-single"
                    style={{
                      width: '260px',
                      margin: '0 auto',
                      backgroundColor: '#ffffff',
                      border: '1.5px dashed #94a3b8',
                      borderRadius: '4px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Top Shop Brand */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111827', paddingBottom: '4px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                        ZANDO.
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#4b5563' }}>
                        {customBrand}
                      </span>
                    </div>

                    {/* Product Name */}
                    <div style={{ width: '100%', fontSize: '0.74rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
                      {customName}
                    </div>

                    {/* Center: Barcode SVG + QR Code */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', margin: '4px 0' }}>
                      <svg ref={barcodeSvgRef} style={{ maxWidth: '180px', height: '44px' }}></svg>
                      <div style={{ marginLeft: '6px', flexShrink: 0 }}>
                        <QRCodeSVG value={`https://zandoshops.com/item/${customSku}`} size={36} />
                      </div>
                    </div>

                    {/* Bottom: Price + Size */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '4px', marginTop: '4px' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#6b7280' }}>Size: </span>
                        <strong style={{ fontSize: '0.84rem', color: '#111827' }}>{customSize}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>
                          ${customPrice}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '2px' }}>
                          ≈ {priceRiel} ៛
                        </div>
                      </div>
                    </div>
                  </div>

                  <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', marginTop: '14px' }}>
                    💡 គាំទ្រម៉ាស៊ីនព្រីនស្លាកតម្លៃ (Thermal Barcode Printer) គ្រប់ម៉ាកទាំងអស់។
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 2: CLIENT-SIDE IMAGE COMPRESSOR (DELPHI PRIVACY-FIRST)    */}
          {/* ============================================================= */}
          {activeTab === 'compressor' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 320px) 1fr', gap: '24px' }}>
                {/* Left Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                      Upload Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{
                        width: '100%',
                        fontSize: '0.82rem',
                        padding: '8px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px'
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>Quality: {compressQuality}%</span>
                      <span style={{ color: '#64748b' }}>Lower = Smaller file</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={compressQuality}
                      onChange={(e) => {
                        const q = Number(e.target.value);
                        setCompressQuality(q);
                        if (uploadedImage) compressImage(uploadedImage, q, maxDimension);
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>Max Dimension: {maxDimension}px</span>
                    </div>
                    <select
                      value={maxDimension}
                      onChange={(e) => {
                        const dim = Number(e.target.value);
                        setMaxDimension(dim);
                        if (uploadedImage) compressImage(uploadedImage, compressQuality, dim);
                      }}
                      style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.82rem' }}
                    >
                      <option value={600}>600 px (Small Thumbnail)</option>
                      <option value={800}>800 px (Standard E-commerce)</option>
                      <option value={1200}>1200 px (High-Res Detail)</option>
                    </select>
                  </div>

                  {compressedImage && (
                    <a
                      href={compressedImage}
                      download={`compressed-product-${Date.now()}.jpg`}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '10px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={16} />
                      <span>Download Compressed Image</span>
                    </a>
                  )}
                </div>

                {/* Right Preview */}
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {compressedImage ? (
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '14px', fontSize: '0.84rem' }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Original: </span>
                          <strong>{(originalFileSize / 1024).toFixed(1)} KB</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Compressed: </span>
                          <strong style={{ color: '#059669' }}>{(compressedFileSize / 1024).toFixed(1)} KB</strong>
                        </div>
                        <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '1px 8px', borderRadius: '12px', fontWeight: 700 }}>
                          -{Math.round(((originalFileSize - compressedFileSize) / originalFileSize) * 100)}%
                        </div>
                      </div>

                      <div style={{ maxHeight: '280px', display: 'inline-block', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <img src={compressedImage} alt="Compressed preview" style={{ maxHeight: '280px', width: 'auto', display: 'block' }} />
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
                      <ImageIcon size={48} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontSize: '0.88rem' }}>Upload any product image on the left to compress it 100% inside your browser.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* TAB 3: CURRENCY & SIZE CONVERTER                              */}
          {/* ============================================================= */}
          {activeTab === 'converter' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* Currency Calc */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 14px 0', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calculator size={16} />
                  <span>USD ↔ KHR Currency Converter</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', marginBottom: '4px' }}>
                      Amount in Dollars ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={calcUsd}
                      onChange={(e) => handleUsdChange(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', marginBottom: '4px' }}>
                      Amount in Riel (៛ KHR) - Exchange rate: {calcExchangeRate}
                    </label>
                    <input
                      type="text"
                      value={calcKhr}
                      readOnly
                      style={{ width: '100%', padding: '8px 10px', backgroundColor: '#f1f5f9', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem', fontWeight: 800, color: '#059669' }}
                    />
                  </div>
                </div>
              </div>

              {/* Size CM <-> Inch Calc */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 14px 0', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📏 Clothes Measurement (CM ↔ Inch)</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', marginBottom: '4px' }}>
                      Centimeters (cm)
                    </label>
                    <input
                      type="number"
                      value={cmValue}
                      onChange={(e) => handleCmChange(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem', fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#64748b', marginBottom: '4px' }}>
                      Inches (in)
                    </label>
                    <input
                      type="number"
                      value={inchValue}
                      onChange={(e) => handleInchChange(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem', fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
