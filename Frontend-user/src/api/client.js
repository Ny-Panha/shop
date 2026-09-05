const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://shop-backend-wbhd.onrender.com/api';

export function getAuthToken() {
  return localStorage.getItem('casehaven_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('casehaven_token', token);
  } else {
    localStorage.removeItem('casehaven_token');
  }
}

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.message) errorMsg = errJson.message;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  if (response.status === 204) return null;
  const json = await response.json();
  // If wrapped in ApiResponse { success, data, message }, unwrap data if present
  if (json && json.success !== undefined && json.data !== undefined) {
    return json.data;
  }
  return json;
}

// Auth APIs
export function login(email, password) {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function register(data) {
  return fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function getCurrentUser() {
  return fetchApi('/auth/me');
}

// Products
export function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.brand && filters.brand !== 'ALL') params.append('brand', filters.brand);
  if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.inStock) params.append('inStock', 'true');
  if (filters.query) params.append('query', filters.query);
  if (filters.sort) params.append('sort', filters.sort);

  const qs = params.toString();
  return fetchApi(`/products${qs ? `?${qs}` : ''}`);
}

export function getProductById(id) {
  return fetchApi(`/products/${id}`);
}

export function getProductBySlug(slug) {
  return fetchApi(`/products/slug/${slug}`);
}

export function getAllAdminProducts() {
  return fetchApi('/admin/products');
}

export function createProduct(data) {
  return fetchApi('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateProduct(id, data) {
  return fetchApi(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function toggleProductActive(id) {
  return fetchApi(`/admin/products/${id}/toggle-active`, {
    method: 'PATCH'
  });
}

export function deleteProduct(id) {
  return fetchApi(`/admin/products/${id}`, {
    method: 'DELETE'
  });
}

// Inventory APIs
export function getInventory() {
  return fetchApi('/admin/inventory');
}

export function stockIn(data) {
  return fetchApi('/admin/inventory/stock-in', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function stockOut(data) {
  return fetchApi('/admin/inventory/stock-out', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function adjustStock(data) {
  return fetchApi('/admin/inventory/adjust', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function adjustProductStock(id, data) {
  if (data && data.type === 'STOCK_IN') {
    return stockIn({ productId: id, quantity: data.quantity, reason: data.reason || 'Restock', reference: data.reference });
  } else if (data && data.type === 'STOCK_OUT') {
    return stockOut({ productId: id, quantity: data.quantity, reason: data.reason || 'Manual deduction', reference: data.reference });
  }
  return adjustStock({ productId: id, quantity: data?.quantity || 0, reason: data?.reason || 'Adjustment', reference: data?.reference });
}

export function getStockMovements(productId) {
  return fetchApi(`/admin/inventory/movements${productId ? `?productId=${productId}` : ''}`);
}

// Orders
export function createOrder(data) {
  return fetchApi('/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function getOrderByNumber(orderNumber) {
  return fetchApi(`/orders/${orderNumber}`);
}

export function getOrdersByPhone(phone) {
  return fetchApi(`/orders/track?phone=${encodeURIComponent(phone)}`);
}

export function getOrdersByEmail(email) {
  return fetchApi(`/orders/track-email?email=${encodeURIComponent(email)}`);
}

export function getAllOrders(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.paymentStatus) query.append('paymentStatus', params.paymentStatus);
  const qs = query.toString();
  return fetchApi(`/orders${qs ? `?${qs}` : ''}`);
}

export function updateOrderStatus(orderId, status) {
  return fetchApi(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

// Bakong KHQR Lifecycle & Payments
export function checkKhqrStatus(orderNumber) {
  return fetchApi(`/khqr/check/${orderNumber}`);
}

export function simulateKhqrPayment(orderNumber) {
  return fetchApi(`/khqr/simulate-pay/${orderNumber}`, {
    method: 'POST'
  });
}

export function getPaymentStatus(orderNumber) {
  return fetchApi(`/payments/khqr/status/${orderNumber}`);
}

export function simulatePaymentSuccess(orderNumber) {
  return fetchApi(`/payments/khqr/simulate-success/${orderNumber}`, {
    method: 'POST'
  });
}

export function simulatePaymentExpire(orderNumber) {
  return fetchApi(`/payments/khqr/simulate-expire/${orderNumber}`, {
    method: 'POST'
  });
}

export function getKhqrInfo() {
  return fetchApi('/khqr/info');
}

// Admin
export function getAdminStats() {
  return fetchApi('/admin/stats');
}

export function getStockLogs() {
  return fetchApi('/admin/stock-logs');
}
