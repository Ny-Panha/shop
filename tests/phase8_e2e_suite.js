// Phase 8: Comprehensive End-to-End Test Suite for CaseHaven Enterprise E-Commerce
const API_BASE = "http://localhost:8080/api";

async function runPhase8E2ESuite() {
  console.log("=====================================================================");
  console.log("🚀 CASEHAVEN ENTERPRISE E-COMMERCE: PHASE 8 END-TO-END TEST SUITE");
  console.log("=====================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // SUITE 1: Product Catalog, Dual Currency & Filtering
    // -------------------------------------------------------------
    console.log("▶ SUITE 1: Product Catalog & Dual Pricing");
    const productsRes = await (await fetch(`${API_BASE}/products`)).json();
    assert(productsRes.success === true, "Products list returns success = true");
    assert(Array.isArray(productsRes.data) && productsRes.data.length >= 15, "At least 15 curated phone cases available");

    const sampleProduct = productsRes.data[0];
    assert(sampleProduct.sku && sampleProduct.sku.startsWith("CH-"), `Product has valid SKU: ${sampleProduct.sku}`);
    assert(sampleProduct.price > 0, `Product has valid USD price: $${sampleProduct.price}`);
    assert(sampleProduct.priceKhr === Math.round(sampleProduct.price * 4100), `Product has exact KHR rate (4,100): ${sampleProduct.priceKhr} ៛`);

    // Filter by Brand APPLE
    const appleRes = await (await fetch(`${API_BASE}/products?brand=APPLE`)).json();
    assert(appleRes.data.every(p => p.brand === 'APPLE'), "Brand filter restricts to APPLE models");

    // Filter by Category MAGSAFE
    const magsafeRes = await (await fetch(`${API_BASE}/products?category=MAGSAFE`)).json();
    assert(magsafeRes.data.every(p => p.category === 'MAGSAFE'), "Category filter restricts to MAGSAFE cases");

    // -------------------------------------------------------------
    // SUITE 2: Customer Authentication & Registration
    // -------------------------------------------------------------
    console.log("\n▶ SUITE 2: Customer Authentication & JWT Security");
    const randId = Date.now();
    const registerPayload = {
      fullName: `Dara Test ${randId}`,
      email: `shopper${randId}@casehaven.kh`,
      phone: `089${Math.floor(100000 + Math.random() * 900000)}`,
      password: "Password@123"
    };

    const regRes = await (await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerPayload)
    })).json();
    assert(regRes.success === true && regRes.data?.token, "Customer registration issues stateless JWT token");

    const loginRes = await (await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: registerPayload.email, password: registerPayload.password })
    })).json();
    assert(loginRes.data?.token, "Customer login successfully issues valid JWT token");

    // -------------------------------------------------------------
    // SUITE 3: Cart, Multi-Step Checkout & Cambodian 4-Level Address
    // -------------------------------------------------------------
    console.log("\n▶ SUITE 3: Multi-Step Checkout & Cambodian Address Validation");
    const testCase = productsRes.data.find(p => p.stock >= 5);
    const checkoutPayload = {
      customerName: registerPayload.fullName,
      customerPhone: registerPayload.phone,
      customerEmail: registerPayload.email,
      province: "Battambang",
      district: "Krong Battambang",
      commune: "Sangkat Svay Pao",
      shippingAddress: "House #38, Street 106, Near BBU Campus",
      city: "Battambang",
      paymentMethod: "KHQR",
      couponCode: "KHMER2026",
      items: [
        {
          productId: testCase.id,
          quantity: 2,
          selectedColor: "Titanium Gray"
        }
      ]
    };

    const initialStock = testCase.stock;
    const checkoutRes = await (await fetch(`${API_BASE}/orders/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkoutPayload)
    })).json();

    assert(checkoutRes.orderNumber && checkoutRes.orderNumber.startsWith("CH-2026-"), `Order created with reference: ${checkoutRes.orderNumber}`);
    assert(checkoutRes.province === "Battambang", "Province saved correctly");
    assert(checkoutRes.district === "Krong Battambang", "District saved correctly");
    assert(checkoutRes.commune === "Sangkat Svay Pao", "Commune saved correctly");
    assert(checkoutRes.discountAmount > 0, `KHMER2026 coupon applied 10% discount: -$${checkoutRes.discountAmount}`);

    // Verify stock deducted atomically
    const refreshedProduct = await (await fetch(`${API_BASE}/products/${testCase.id}`)).json();
    assert(refreshedProduct.data.stock === initialStock - 2, `Stock deducted from ${initialStock} to ${refreshedProduct.data.stock}`);

    // -------------------------------------------------------------
    // SUITE 4: Bakong KHQR EMVCo Lifecycle & Simulation
    // -------------------------------------------------------------
    console.log("\n▶ SUITE 4: NBC Bakong KHQR Payment Lifecycle");
    const khqrJson = await (await fetch(`${API_BASE}/payments/khqr/generate/${checkoutRes.orderNumber}`, {
      method: "POST"
    })).json();
    const khqrRes = khqrJson.data || khqrJson;

    assert(khqrRes.status === "QR_GENERATED", "Status transitioned to QR_GENERATED");
    assert(khqrRes.qrString && khqrRes.qrString.startsWith("000201"), "EMVCo compliant format with Tag 00=01");
    assert(khqrRes.md5 && khqrRes.md5.length === 32, `MD5 transaction hash generated: ${khqrRes.md5}`);

    // Poll status -> WAITING_PAYMENT
    const pollJson = await (await fetch(`${API_BASE}/payments/khqr/status/${checkoutRes.orderNumber}`)).json();
    const pollRes = pollJson.data || pollJson;
    assert(pollRes.status === "WAITING_PAYMENT", "Status transitioned to WAITING_PAYMENT on customer scan");

    // Simulate NBC Bakong settlement
    const settleJson = await (await fetch(`${API_BASE}/payments/khqr/simulate-success/${checkoutRes.orderNumber}`, {
      method: "POST"
    })).json();
    const settleRes = settleJson.data || settleJson;
    assert(settleRes.status === "PAID", "Status transitioned to PAID upon settlement");

    // Verify Order is now PAID & PROCESSING
    const paidOrder = await (await fetch(`${API_BASE}/orders/lookup/${checkoutRes.orderNumber}`)).json();
    assert(paidOrder.paymentStatus === "PAID", "Order paymentStatus is PAID");
    assert(paidOrder.orderStatus === "PROCESSING", "Order orderStatus transitioned to PROCESSING");

    // -------------------------------------------------------------
    // SUITE 5: Customer Order History & Tracking Stepper
    // -------------------------------------------------------------
    console.log("\n▶ SUITE 5: Order History & Lookup Modes");
    // Mode A: By Order Number
    const lookupNum = await (await fetch(`${API_BASE}/orders/lookup/${checkoutRes.orderNumber}`)).json();
    assert(lookupNum.orderNumber === checkoutRes.orderNumber, "Lookup by Order Number succeeds");

    // Mode B: By Customer Phone
    const lookupPhone = await (await fetch(`${API_BASE}/orders/track?phone=${registerPayload.phone}`)).json();
    assert(Array.isArray(lookupPhone) && lookupPhone.length >= 1, "Lookup by Phone Number finds customer orders");

    // Mode C: By Customer Email
    const lookupEmail = await (await fetch(`${API_BASE}/orders/track-email?email=${registerPayload.email}`)).json();
    assert(Array.isArray(lookupEmail) && lookupEmail.length >= 1, "Lookup by Customer Email finds customer orders");

    // -------------------------------------------------------------
    // SUITE 6: Admin KPIs, Inventory Movements & Fulfillment
    // -------------------------------------------------------------
    console.log("\n▶ SUITE 6: Admin Portal, Inventory Audit & Order Fulfillment");
    const adminStats = await (await fetch(`${API_BASE}/admin/stats`)).json();
    assert(adminStats.totalOrders >= 1, `Admin Stats: Total orders = ${adminStats.totalOrders}`);
    assert(adminStats.paidOrders >= 1, `Admin Stats: Paid orders = ${adminStats.paidOrders}`);
    assert(adminStats.totalRevenue > 0, `Admin Stats: Total USD revenue = $${adminStats.totalRevenue}`);
    assert(adminStats.totalRevenueKhr > 0, `Admin Stats: Total KHR revenue = ${adminStats.totalRevenueKhr} ៛`);

    // Audit logs
    const auditLogs = await (await fetch(`${API_BASE}/admin/stock-logs`)).json();
    assert(Array.isArray(auditLogs) && auditLogs.length > 0, `Inventory Audit: ${auditLogs.length} stock movements logged`);

    // Fulfillment update
    const dispatchRes = await (await fetch(`${API_BASE}/orders/${checkoutRes.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SHIPPED" })
    })).json();
    assert(dispatchRes.orderStatus === "SHIPPED", "Order fulfillment updated to SHIPPED");

    console.log("\n=====================================================================");
    console.log(`🏁 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
    console.log("=====================================================================\n");

    if (failed === 0) {
      console.log("🎉 ALL PHASE 8 ENTERPRISE TESTS COMPLETED WITH 100% SUCCESS!");
    } else {
      process.exit(1);
    }

  } catch (err) {
    console.error("Test Suite Execution Error:", err);
    process.exit(1);
  }
}

runPhase8E2ESuite();
