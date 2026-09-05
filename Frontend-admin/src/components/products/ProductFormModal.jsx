import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Save,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  Trash2,
  RefreshCw,
  FolderOpen,
  Star,
  ArrowLeft,
  ArrowRight,
  Plus,
  Check,
  Palette,
} from 'lucide-react';
import { adminStore } from '../../data/adminStore';

const PRESET_COLORS = [
  { nameKm: 'ខ្មៅ', nameEn: 'Black', hex: '#111827' },
  { nameKm: 'ស', nameEn: 'White', hex: '#f8fafc' },
  { nameKm: 'ប្រផេះ', nameEn: 'Gray', hex: '#64748b' },
  { nameKm: 'ខៀវចាស់', nameEn: 'Navy', hex: '#1e3a8a' },
  { nameKm: 'ខៀវខ្ចី', nameEn: 'Sky Blue', hex: '#0284c7' },
  { nameKm: 'ក្រហម', nameEn: 'Red', hex: '#dc2626' },
  { nameKm: 'បៃតង', nameEn: 'Olive', hex: '#15803d' },
  { nameKm: 'បន៍/កាហ្វេ', nameEn: 'Beige', hex: '#d4b996' },
  { nameKm: 'ត្នោត', nameEn: 'Brown', hex: '#78350f' },
  { nameKm: 'លឿង', nameEn: 'Yellow', hex: '#eab308' },
  { nameKm: 'ផ្កាឈូក', nameEn: 'Pink', hex: '#ec4899' },
  { nameKm: 'ស្វាយ', nameEn: 'Purple', hex: '#9333ea' },
];

export default function ProductFormModal({ isOpen, onClose, onSave, product = null, categories = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    brand: 'TEN-ELEVEN',
    category: 'T-Shirts',
    gender: 'men',
    price: '',
    costPrice: '',
    stock: '',
    lowStockThreshold: 5,
    imageUrl: '',
    hoverImageUrl: '',
    badge: '',
    sizes: ['S', 'M', 'L'],
    sku: '',
    active: true,
  });

  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [customHex, setCustomHex] = useState('#6366f1');
  const [customColorName, setCustomColorName] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [availableBrands, setAvailableBrands] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      setAvailableBrands(adminStore.getBrands());
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price !== undefined ? product.price : '',
        costPrice: product.costPrice !== undefined ? product.costPrice : '',
        stock: product.stock !== undefined ? product.stock : '',
        sizes: product.sizes || ['M', 'L'],
      });

      // Extract existing multi-image array
      let loadedImgs = [];
      if (Array.isArray(product.images) && product.images.length > 0) {
        loadedImgs = [...product.images];
      } else if (Array.isArray(product.galleryImages) && product.galleryImages.length > 0) {
        loadedImgs = [...product.galleryImages];
      } else {
        if (product.imageUrl) loadedImgs.push(product.imageUrl);
        if (product.hoverImageUrl && product.hoverImageUrl !== product.imageUrl) {
          loadedImgs.push(product.hoverImageUrl);
        }
      }
      setImages(loadedImgs);
      if (loadedImgs.some((img) => img.startsWith('data:'))) {
        setImageMode('upload');
      } else {
        setImageMode(loadedImgs.length > 0 ? 'upload' : 'url');
      }

      // Extract existing colors
      let initColors = [];
      if (Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
        initColors = product.colorVariants.map((c) => ({
          nameKm: c.nameKm || c.name || 'Default',
          nameEn: c.nameEn || c.name || 'Default',
          hex: c.hex || '#111827',
        }));
      } else if (Array.isArray(product.colorDots) && product.colorDots.length > 0) {
        initColors = product.colorDots.map((hex) => {
          const found = PRESET_COLORS.find((pc) => pc.hex.toLowerCase() === hex.toLowerCase());
          return found || { nameKm: 'Color', nameEn: 'Color', hex };
        });
      } else if (product.colors && Array.isArray(product.colors)) {
        initColors = product.colors.map((hex) => {
          const found = PRESET_COLORS.find((pc) => pc.hex.toLowerCase() === hex.toLowerCase());
          return found || { nameKm: 'Color', nameEn: 'Color', hex };
        });
      }
      setSelectedColors(
        initColors.length > 0
          ? initColors
          : [
              { nameKm: 'ខ្មៅ', nameEn: 'Black', hex: '#111827' },
              { nameKm: 'ស', nameEn: 'White', hex: '#f8fafc' },
            ]
      );
    } else {
      // New product defaults
      setFormData({
        name: '',
        nameEn: '',
        brand: 'TEN-ELEVEN',
        category: 'T-Shirts',
        gender: 'men',
        price: '',
        costPrice: '',
        stock: '15',
        lowStockThreshold: 5,
        imageUrl: '/zando-products/insane_main.jpg',
        hoverImageUrl: '/zando-products/insane_hover.jpg',
        badge: 'New In',
        sizes: ['S', 'M', 'L'],
        sku: `ZAN-${Math.floor(1000 + Math.random() * 9000)}`,
        active: true,
      });
      setImages([
        '/zando-products/insane_main.jpg',
        '/zando-products/insane_hover.jpg',
      ]);
      setSelectedColors([
        { nameKm: 'ខ្មៅ', nameEn: 'Black', hex: '#111827' },
        { nameKm: 'ស', nameEn: 'White', hex: '#f8fafc' },
      ]);
      setImageMode('upload');
    }
    setLinkInput('');
    setCustomColorName('');
    setErrors({});
    setIsDragging(false);
    setIsProcessing(false);
    setProcessingStatus('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  // SKU generator
  const generateSku = () => {
    const prefix = (formData.brand || 'ZAN').substring(0, 3).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, sku: `${prefix}-${rand}` }));
  };

  // Size pill toggler
  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  // Color pill toggler
  const handleColorToggle = (color) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.hex.toLowerCase() === color.hex.toLowerCase());
      if (exists) {
        return prev.filter((c) => c.hex.toLowerCase() !== color.hex.toLowerCase());
      } else {
        return [...prev, color];
      }
    });
  };

  // Add custom color
  const handleAddCustomColor = () => {
    if (!customHex) return;
    const name = customColorName.trim() || 'Custom';
    const newColor = { nameKm: name, nameEn: name, hex: customHex };
    if (!selectedColors.some((c) => c.hex.toLowerCase() === customHex.toLowerCase())) {
      setSelectedColors((prev) => [...prev, newColor]);
    }
    setCustomColorName('');
  };

  // Helper: compress single image file via Canvas (max 900px, 0.85 jpeg)
  const compressFile = (file) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 900;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedBase64);
        };
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  // Process multiple files
  const processMultipleFiles = async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      alert('សូមជ្រើសរើស file រូបភាព (JPG, PNG, WebP) / Please choose valid image files');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus(`កំពុងដំណើរការ ${files.length} រូបភាព...`);

    const results = await Promise.all(files.map((file) => compressFile(file)));
    const validCompressed = results.filter(Boolean);

    setImages((prev) => [...prev, ...validCompressed]);
    setIsProcessing(false);
    setProcessingStatus('');
  };

  // File input change
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processMultipleFiles(e.target.files);
    }
    e.target.value = '';
  };

  // Drag & drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processMultipleFiles(e.dataTransfer.files);
    }
  };

  // Clipboard paste (Ctrl+V) handler
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      const imageFiles = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }
      if (imageFiles.length > 0) {
        processMultipleFiles(imageFiles);
      }
    }
  };

  // Add multiple links handler (supports newline or comma separated)
  const handleAddLinks = (e) => {
    if (e) e.preventDefault();
    if (!linkInput.trim()) return;

    const rawLinks = linkInput
      .split(/[\n,\s]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && (l.startsWith('http') || l.startsWith('/') || l.startsWith('data:')));

    if (rawLinks.length === 0) {
      alert('សូមបញ្ចូល link ឬ path រូបភាពត្រឹមត្រូវ (e.g. https://... or /zando-products/...)');
      return;
    }

    setImages((prev) => [...prev, ...rawLinks]);
    setLinkInput('');
  };

  // Preset button
  const handleAddPresetLink = (url) => {
    setImages((prev) => [...prev, url]);
  };

  // Move image to Index 0 (Set as Main)
  const handleSetAsMain = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  // Move image left/right in sequence
  const handleMoveImage = (index, direction) => {
    setImages((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Remove single image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all images
  const handleClearAllImages = () => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបរូបភាពទាំងអស់មែនទេ? / Clear all images?')) {
      setImages([]);
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name && !formData.nameEn) newErrors.name = 'Product name is required';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required';
    if (formData.stock === '' || isNaN(formData.stock)) newErrors.stock = 'Valid stock is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const baseSlug = (formData.nameEn || formData.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const cleanSlug = product?.cleanSlug || product?.slug || `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Auto-save new brand if user typed a custom one
    if (formData.brand && formData.brand.trim()) {
      try {
        adminStore.addBrand({ name: formData.brand.trim() });
      } catch (_) {}
    }

    const primaryImage = images[0] || formData.imageUrl || '/product/clothes/t-shirts/jetburn_main.jpg';
    const hoverImage = images[1] || primaryImage;

    // Build color variants & dots
    const colorDots = selectedColors.map((c) => c.hex);
    const colorOptions = selectedColors.map((c) => `${c.nameKm} (${c.nameEn})`).join(', ');
    const colorVariants = selectedColors.map((c, i) => ({
      nameKm: c.nameKm,
      nameEn: c.nameEn,
      hex: c.hex,
      image: images[i] || images[0] || primaryImage,
    }));

    onSave({
      ...formData,
      name: formData.name || formData.nameEn,
      nameEn: formData.nameEn || formData.name,
      price: parseFloat(formData.price),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : 0,
      stock: parseInt(formData.stock, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold || 5, 10),
      imageUrl: primaryImage,
      hoverImageUrl: hoverImage,
      images: images.length > 0 ? images : [primaryImage],
      galleryImages: images.length > 0 ? images : [primaryImage],
      colorDots,
      colorOptions,
      colorVariants,
      colors: colorDots,
      cleanSlug,
      slug: cleanSlug,
      subCategory: formData.category,
    });
  };

  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36', 'Free Size'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h3 className="modal-title">{product ? 'Edit Product' : 'Add New Product'}</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form id="product-form" onSubmit={handleSubmit} className="modal-body" onPaste={handlePaste}>
          {/* Row 1: Name KM & EN */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">ឈ្មោះជាភាសាខ្មែរ (Khmer Name)</label>
              <input
                type="text"
                className="form-input"
                placeholder="ឧ. អាវយឺតដៃខ្លី..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '11.5px', marginTop: '4px' }}>
                  {errors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">English Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Classic Cotton T-Shirt..."
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2: Brand, Gender, Category */}
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Brand (ម៉ាកសញ្ញា) *</label>
              <input
                type="text"
                list="product-brand-options"
                className="form-input"
                placeholder="Select or type brand..."
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
              <datalist id="product-brand-options">
                {availableBrands.map((b) => (
                  <option key={b.id || b.name} value={b.name}>
                    {b.name} {b.nameKm ? `(${b.nameKm})` : ''}
                  </option>
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label className="form-label">Gender Department *</label>
              <input
                type="text"
                list="product-gender-options"
                className="form-input"
                placeholder="Select or type department..."
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
              <datalist id="product-gender-options">
                <option value="men">Men (បុរស)</option>
                <option value="women">Women (នារី)</option>
                <option value="kids">Kids (កុមារ)</option>
                <option value="all">Unisex (ទូទៅ/រួម)</option>
                <option value="accessories">Accessories</option>
                <option value="sports">Sports</option>
                <option value="shoes">Shoes</option>
                <option value="bags">Bags</option>
              </datalist>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories && categories.length > 0 ? (
                  categories
                    .filter((c) => c.id !== 'ALL')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameKm ? `${c.nameKm} (${c.nameEn || c.id})` : c.nameEn || c.id}
                      </option>
                    ))
                ) : (
                  <>
                    <option value="T-Shirts">T-Shirt & Polo</option>
                    <option value="CLOTHES">Clothing & Tops</option>
                    <option value="Jeans">Jeans & Pants</option>
                    <option value="SHOES">Shoes & Sneakers</option>
                    <option value="BAGS">Bags & Accessories</option>
                    <option value="DRESSES">Dresses & Skirts</option>
                    <option value="TOPS_WOMEN">Tops & Blouses</option>
                    <option value="NEW_IN">New In (ថ្មីៗ)</option>
                    <option value="SALE">Special Sale</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Row 3: Price ($), Cost ($), Stock Quantity */}
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Selling Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                className="form-input font-mono"
                placeholder="25.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              {errors.price && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '11.5px', marginTop: '4px' }}>
                  {errors.price}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Cost Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                className="form-input font-mono"
                placeholder="12.00"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Stock Qty</label>
              <input
                type="number"
                className="form-input font-mono"
                placeholder="20"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
              {errors.stock && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '11.5px', marginTop: '4px' }}>
                  {errors.stock}
                </div>
              )}
            </div>
          </div>

          {/* Row 4: SKU & Badge */}
          <div className="form-row-2">
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>SKU / Barcode</label>
                <button
                  type="button"
                  onClick={generateSku}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-emerald)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Auto Generate
                </button>
              </div>
              <input
                type="text"
                className="form-input font-mono"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Marketing Badge</label>
              <input
                type="text"
                className="form-input"
                placeholder="New In, Best Seller, Special Sale, etc."
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              />
            </div>
          </div>

          {/* Row 5: Product Image Multi-Upload & Multi-Link Gallery */}
          <div
            className="form-group"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
            }}
          >
            {/* Header with Mode Tabs */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <label className="form-label" style={{ margin: 0, fontWeight: '700', fontSize: '13.5px', color: '#fff' }}>
                  រូបភាពទំនិញ (Product Gallery) — {images.length} រូប
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  (រូបទី 1 = រូបមេ Main • រូបទី 2 = រូប Hover Card • រូបបន្ទាប់ = Gallery)
                </span>
              </div>

              {/* Mode Switcher */}
              <div
                style={{
                  display: 'inline-flex',
                  background: 'var(--bg-canvas)',
                  padding: '3px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  gap: '3px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: imageMode === 'upload' ? 'var(--accent-emerald)' : 'transparent',
                    color: imageMode === 'upload' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: imageMode === 'upload' ? '600' : '400',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Upload size={13} />
                  <span>Upload Files (ច្រើនសន្លឹក)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    background: imageMode === 'url' ? 'var(--accent-emerald)' : 'transparent',
                    color: imageMode === 'url' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: imageMode === 'url' ? '600' : '400',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LinkIcon size={13} />
                  <span>Add Links (ច្រើន Link)</span>
                </button>
              </div>
            </div>

            {/* Hidden File Input for Multi-Upload */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {/* Content for Upload Mode */}
            {imageMode === 'upload' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
                style={{
                  border: isDragging ? '2px dashed var(--accent-emerald)' : '2px dashed var(--border-medium)',
                  background: isDragging ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(16, 185, 129, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-emerald)',
                  }}
                >
                  {isProcessing ? (
                    <RefreshCw size={20} className="animate-spin" />
                  ) : (
                    <Upload size={20} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {isProcessing
                      ? processingStatus || 'កំពុងដំណើរការរូបភាព...'
                      : 'ចុចដើម្បីជ្រើសរើសរូបភាពច្រើនសន្លឹក ឬ អូសទម្លាក់ទីនេះ (Browse or Drop Multiple)'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    ជ្រើសរើសរូបភាពម្តងបានច្រើនសន្លឹក (JPG, PNG, WebP) • Auto-compress • អាច Ctrl+V បាន
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ marginTop: '4px', padding: '5px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <FolderOpen size={13} />
                  <span>+ Browse Multiple Images</span>
                </button>
              </div>
            )}

            {/* Content for Link / URL Mode */}
            {imageMode === 'url' && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <textarea
                      rows={2}
                      className="form-input"
                      placeholder="Paste one or multiple image URLs (separated by newlines or commas)...&#10;e.g. https://... or /zando-products/xxx.jpg"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleAddLinks(e);
                        }
                      }}
                      style={{ resize: 'vertical', width: '100%', fontSize: '12.5px' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLinks}
                    className="btn-primary"
                    style={{ padding: '8px 16px', height: '42px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={15} />
                    <span>+ Add Link(s)</span>
                  </button>
                </div>

                {/* Presets */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>គំរូរហ័ស:</span>
                  <button
                    type="button"
                    onClick={() => handleAddPresetLink('/zando-products/insane_main.jpg')}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    + T-Shirt Main
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetLink('/zando-products/insane_hover.jpg')}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    + T-Shirt Hover
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddPresetLink('/zando-products/nike_metcon_6_main.png')}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    + Shoes Metcon
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleAddPresetLink(
                        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
                      )
                    }
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    + Online Unsplash
                  </button>
                </div>
              </div>
            )}

            {/* Gallery Grid (Active Images List) */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  បញ្ជីរូបភាពដែលបានដាក់ ({images.length}) — ចុច ★ ដើម្បីដាក់ជារូប Main
                </div>
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllImages}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-rose)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={12} />
                    <span>លុបទាំងអស់ (Clear All)</span>
                  </button>
                )}
              </div>

              {images.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '12.5px',
                    background: 'rgba(0,0,0,0.15)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  មិនទាន់មានរូបភាពនៅឡើយទេ សូម Upload Files ឬ Add Link
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                    gap: '10px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    padding: '2px',
                  }}
                >
                  {images.map((imgUrl, idx) => {
                    const isMain = idx === 0;
                    const isHover = idx === 1;
                    return (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          background: '#09090b',
                          border: isMain
                            ? '2px solid var(--accent-emerald)'
                            : isHover
                            ? '1px solid var(--accent-indigo)'
                            : '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: isMain ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
                        }}
                      >
                        {/* Thumbnail */}
                        <div
                          style={{
                            width: '100%',
                            height: '100px',
                            background: '#000',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.opacity = '0.3';
                            }}
                          />

                          {/* Index Badge */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '5px',
                              left: '5px',
                              background: isMain
                                ? 'var(--accent-emerald)'
                                : isHover
                                ? 'var(--accent-indigo)'
                                : 'rgba(0,0,0,0.75)',
                              color: '#fff',
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backdropFilter: 'blur(4px)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            {isMain && <Star size={9} fill="#fff" />}
                            {isMain ? 'Main #1' : isHover ? 'Hover #2' : `#${idx + 1}`}
                          </div>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              background: 'rgba(0,0,0,0.65)',
                              color: 'var(--accent-rose)',
                              border: '1px solid rgba(244, 63, 94, 0.3)',
                              borderRadius: '4px',
                              width: '22px',
                              height: '22px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            title="Remove image"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>

                        {/* Bottom Action Bar */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '4px 6px',
                            background: 'rgba(255,255,255,0.03)',
                            borderTop: '1px solid var(--border-subtle)',
                          }}
                        >
                          {/* Reorder left/right */}
                          <div style={{ display: 'flex', gap: '2px' }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, -1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: idx === 0 ? 'var(--text-dim)' : 'var(--text-secondary)',
                                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                                padding: '2px',
                              }}
                              title="Move left"
                            >
                              <ArrowLeft size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === images.length - 1}
                              onClick={() => handleMoveImage(idx, 1)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: idx === images.length - 1 ? 'var(--text-dim)' : 'var(--text-secondary)',
                                cursor: idx === images.length - 1 ? 'not-allowed' : 'pointer',
                                padding: '2px',
                              }}
                              title="Move right"
                            >
                              <ArrowRight size={12} />
                            </button>
                          </div>

                          {/* Set as Main button */}
                          {!isMain && (
                            <button
                              type="button"
                              onClick={() => handleSetAsMain(idx)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-emerald)',
                                fontSize: '10px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                padding: '2px 4px',
                              }}
                              title="Set as primary image"
                            >
                              <Star size={10} />
                              <span>Set Main</span>
                            </button>
                          )}
                          {isMain && (
                            <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                              ✓ Primary
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Row 6: Available Colors (Multi-Color Selection) */}
          <div
            className="form-group"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Palette size={15} style={{ color: 'var(--accent-emerald)' }} />
                <label className="form-label" style={{ margin: 0, fontWeight: '700', color: '#fff', fontSize: '13px' }}>
                  ពណ៌ទំនិញ (Available Colors) — {selectedColors.length} ពណ៌បានជ្រើសរើស
                </label>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                ជ្រើសពណ៌បានច្រើនសម្រាប់អាវ/សម្លៀកបំពាក់
              </span>
            </div>

            {/* Color Swatch Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {PRESET_COLORS.map((clr) => {
                const isSelected = selectedColors.some((c) => c.hex.toLowerCase() === clr.hex.toLowerCase());
                return (
                  <button
                    type="button"
                    key={clr.hex}
                    onClick={() => handleColorToggle(clr)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-emerald)' : 'var(--border-medium)',
                      background: isSelected ? 'var(--accent-emerald-glow)' : 'var(--bg-canvas)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 8px rgba(16, 185, 129, 0.25)' : 'none',
                    }}
                  >
                    {/* Circle Swatch */}
                    <span
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: clr.hex,
                        border: '1px solid rgba(255,255,255,0.25)',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      {clr.nameKm} <span style={{ opacity: 0.65, fontSize: '11px' }}>({clr.nameEn})</span>
                    </span>
                    {isSelected && <Check size={13} style={{ color: 'var(--accent-emerald)' }} />}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Input */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                paddingTop: '10px',
                borderTop: '1px dashed var(--border-subtle)',
              }}
            >
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                style={{
                  width: '34px',
                  height: '34px',
                  padding: 0,
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'none',
                  cursor: 'pointer',
                }}
                title="Choose custom color"
              />
              <input
                type="text"
                className="form-input"
                placeholder="Custom color name (e.g. ផ្ទៃមេឃ Light Cyan)..."
                value={customColorName}
                onChange={(e) => setCustomColorName(e.target.value)}
                style={{ flex: 1, fontSize: '12px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomColor();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomColor}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
              >
                <Plus size={13} />
                <span>+ Add Custom</span>
              </button>
            </div>
          </div>

          {/* Row 7: Sizes */}
          <div className="form-group">
            <label className="form-label">Available Sizes</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {AVAILABLE_SIZES.map((sz) => {
                const isSelected = formData.sizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => handleSizeToggle(sz)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                      background: isSelected ? 'var(--accent-emerald-glow)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" form="product-form" className="btn-primary">
            <Save size={16} />
            <span>{product ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
