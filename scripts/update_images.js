// Update all products in the database with verified high-definition phone case photos
const API_BASE = "http://localhost:8080/api";

const curatedCaseImages = {
  // iPhone
  "CH-IP15PM-MAG-01": "https://images.unsplash.com/photo-1535157412991-2ef801c1748b?auto=format&fit=crop&w=800&q=80",
  "CH-IP15P-SIL-01": "https://images.unsplash.com/photo-1623393945964-8f5d573f9358?auto=format&fit=crop&w=800&q=80",
  "CH-IP15-CLR-01": "https://images.unsplash.com/photo-1623393937972-4b3102ba8c23?auto=format&fit=crop&w=800&q=80",
  "CH-IP15PM-LEA-01": "https://images.unsplash.com/photo-1593055454503-531d165c2ed8?auto=format&fit=crop&w=800&q=80",
  "CH-IP14P-WAL-01": "https://images.unsplash.com/photo-1623393884989-cb3663e431c5?auto=format&fit=crop&w=800&q=80",

  // Samsung
  "CH-S24U-MAG-01": "https://images.unsplash.com/photo-1692780256774-198bc0a3bbf0?auto=format&fit=crop&w=800&q=80",
  "CH-S24P-SIL-01": "https://images.unsplash.com/photo-1542219550-76864b1bc385?auto=format&fit=crop&w=800&q=80",
  "CH-S24U-CLR-01": "https://images.unsplash.com/photo-1623393835885-560a7c576aa2?auto=format&fit=crop&w=800&q=80",
  "CH-S23U-LEA-01": "https://images.unsplash.com/photo-1620786963525-4a74f1697a46?auto=format&fit=crop&w=800&q=80",
  "CH-ZFLIP5-WAL-01": "https://images.unsplash.com/photo-1613294064031-8935937266f4?auto=format&fit=crop&w=800&q=80",

  // Xiaomi
  "CH-MI14U-MAG-01": "https://images.unsplash.com/photo-1604671748253-e683240e7efa?auto=format&fit=crop&w=800&q=80",
  "CH-MI14-SIL-01": "https://images.unsplash.com/photo-1571380401583-72ca84994796?auto=format&fit=crop&w=800&q=80",
  "CH-MI13TP-CLR-01": "https://images.unsplash.com/photo-1625102217544-a096a17018f7?auto=format&fit=crop&w=800&q=80",
  "CH-MI14-LEA-01": "https://images.unsplash.com/photo-1697008230027-5c6ebaf24801?auto=format&fit=crop&w=800&q=80",
  "CH-RDN13P-WAL-01": "https://images.unsplash.com/photo-1711033312367-247626a984d1?auto=format&fit=crop&w=800&q=80",

  // Additional / Default
  "CH-AP-IP16P-CYBER-999": "https://images.unsplash.com/photo-1726839662758-e3b5da59b0fb?auto=format&fit=crop&w=800&q=80"
};

async function updateAllProductImages() {
  console.log("Fetching all current products...");
  const res = await (await fetch(`${API_BASE}/products`)).json();
  if (!res.data) {
    console.error("No products returned:", res);
    return;
  }

  for (const product of res.data) {
    const newImage = curatedCaseImages[product.sku] || "https://images.unsplash.com/photo-1535157412991-2ef801c1748b?auto=format&fit=crop&w=800&q=80";

    const updatePayload = {
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      model: product.model,
      category: product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold || 5,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      features: product.features,
      specifications: product.specifications,
      compatibility: product.compatibility,
      imageUrl: newImage,
      galleryImages: newImage,
      colorOptions: product.colorOptions,
      dropProtectionRating: product.dropProtectionRating,
      active: true,
      isFeatured: product.isFeatured
    };

    try {
      const updateRes = await fetch(`${API_BASE}/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });
      console.log(`Updated ID ${product.id} (${product.sku}) -> ${newImage.substring(0, 45)}...: ${updateRes.status === 200 ? "SUCCESS" : "ERROR"}`);
    } catch (e) {
      console.error(`Failed to update ${product.id}:`, e.message);
    }
  }

  console.log("All product images updated successfully!");
}

updateAllProductImages();
