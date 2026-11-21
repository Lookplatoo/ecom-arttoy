/**
 * search.js - ระบบค้นหา ตัวกรอง และจัดเรียงสินค้า
 * Art Toy Community Store
 */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("search-filter-form");
  const nameInput = document.getElementById("product-search-input");
  const categorySelect = document.getElementById("category-select");
  const statusSelect = document.getElementById("status-select");
  const sortSelect = document.getElementById("sort-select");
  const minPriceInput = document.querySelector('input[name="min_price"]');
  const maxPriceInput = document.querySelector('input[name="max_price"]');
  const resultsGrid = document.querySelector(".product-grid");

  // อ่านพารามิเตอร์จาก URL (เช่น ?category=Chiikawa หรือ ?name=...)
  function initFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("category");
    const nameParam = params.get("name") || params.get("product_name");
    const statusParam = params.get("status");
    const minParam = params.get("min_price");
    const maxParam = params.get("max_price");
    const sortParam = params.get("sort");

    if (catParam && categorySelect) categorySelect.value = catParam;
    if (nameParam && nameInput) nameInput.value = nameParam;
    if (statusParam && statusSelect) statusSelect.value = statusParam;
    if (minParam && minPriceInput) minPriceInput.value = minParam;
    if (maxParam && maxPriceInput) maxPriceInput.value = maxParam;
    if (sortParam && sortSelect) sortSelect.value = sortParam;
  }

  // แสดงผลรายการสินค้าในการ์ดผลลัพธ์
  function renderProducts(products) {
    if (!resultsGrid) return;
    resultsGrid.innerHTML = "";

    if (!products || products.length === 0) {
      resultsGrid.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 60px 20px; color: #76736d; grid-column: 1 / -1;">
          <p style="font-size: 16px; font-weight: 600; color: #1c1b1a;">ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา</p>
          <p style="font-size: 14px; margin-top: 4px;">ลองเปลี่ยนคำค้นหา หรือกดปุ่มรีเซ็ตเพื่อแสดงสินค้าทั้งหมด</p>
          <button type="button" id="btn-show-all" style="margin-top: 16px; padding: 10px 20px; background: #1c1b1a; color: #fff; border-radius: 6px; cursor: pointer; border: none; font-weight: 500;">แสดงสินค้าทั้งหมด</button>
        </div>
      `;
      const showAllBtn = document.getElementById("btn-show-all");
      if (showAllBtn) {
        showAllBtn.addEventListener("click", function () {
          form.reset();
          loadProducts();
        });
      }
      return;
    }

    // ทำการจัดเรียงตามที่เลือก
    let sortedList = [...products];
    const sortVal = sortSelect ? sortSelect.value : "default";

    if (sortVal === "price_asc") {
      sortedList.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortVal === "price_desc") {
      sortedList.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortVal === "rating_desc") {
      sortedList.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    sortedList.forEach((product) => {
      const badgeClass = product.badge ? `badge-${product.badge.toLowerCase().replace(/[\s-]/g, '')}` : 'badge-popular';
      const isOutOfStock = product.status === 'Out of Stock';
      const isVipPre = product.vipPreorder || product.status === 'VIP Pre-Order';
      const vipPrice = (Number(product.price) * 0.9).toFixed(2);

      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        ${product.badge ? `<span class="product-card-badge ${badgeClass}">${product.badge}</span>` : ''}
        <div class="product-thumbnail">
          <a href="detail.html?id=${encodeURIComponent(product.id)}">
            <img src="${product.image}" alt="${product.name}">
          </a>
        </div>
        <div class="product-card-body">
          <div class="product-card-meta">
            <span class="product-card-cat">${product.category}</span>
            <span class="product-card-rating">${Number(product.rating || 5.0).toFixed(1)}/5.0</span>
          </div>
          <h3 class="product-card-name">
            <a href="detail.html?id=${encodeURIComponent(product.id)}" style="color: inherit; text-decoration: none;">
              ${product.name}
            </a>
          </h3>
          <div class="product-card-footer">
            <div class="product-card-price-val">
              <span class="price-main">฿${Number(product.price).toFixed(2)}</span>
              ${isVipPre ? `<div style="font-size: 11px; color: var(--color-primary); font-weight: 600;">VIP Pre-Order ฿${vipPrice}</div>` : (product.memberOnly ? `<div style="font-size: 11px; color: var(--color-dark); font-weight: 600;">เฉพาะสมาชิก ฿${vipPrice}</div>` : `<div style="font-size: 11px; color: var(--color-muted-grey); font-weight: 500;">สมาชิก VIP: ฿${vipPrice} (-10%)</div>`)}
            </div>
            <div class="product-card-actions">
              <a href="detail.html?id=${encodeURIComponent(product.id)}" class="btn-card-view-detail">ดูรายละเอียด</a>
              <button type="button" class="btn-card-add-cart" onclick="CartManager.addItem('${product.id}')" title="เพิ่มลงในตะกร้า" aria-label="เพิ่ม ${product.name} ลงในตะกร้า" ${isOutOfStock ? 'disabled' : ''}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      resultsGrid.appendChild(card);
    });
  }

  // ดึงข้อมูลสินค้าจาก ApiService
  async function loadProducts() {
    const filters = {
      name: nameInput ? nameInput.value.trim() : "",
      category: categorySelect ? categorySelect.value.trim() : "",
      status: statusSelect ? statusSelect.value.trim() : "",
      min_price: minPriceInput ? minPriceInput.value.trim() : "",
      max_price: maxPriceInput ? maxPriceInput.value.trim() : ""
    };

    const products = await ApiService.getProducts(filters);
    if (products !== null) {
      renderProducts(products);
    } else {
      renderProducts([]);
    }
  }

  // 1. ค้นหาเมื่อส่ง Form
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      loadProducts();
    });

    form.addEventListener("reset", function () {
      setTimeout(loadProducts, 50);
    });
  }

  // 2. ค้นหาอัตโนมัติเมื่อเปลี่ยนค่าตัวกรอง Dropdown และ Sort
  if (categorySelect) categorySelect.addEventListener("change", loadProducts);
  if (statusSelect) statusSelect.addEventListener("change", loadProducts);
  if (sortSelect) sortSelect.addEventListener("change", loadProducts);

  // 2.1 ทางลัดตัวกรอง Quick Filter Chips
  const quickChips = document.querySelectorAll(".btn-quick-filter-chip");
  quickChips.forEach(chip => {
    chip.addEventListener("click", function () {
      quickChips.forEach(c => {
        c.classList.remove("active");
        c.style.background = "#ffffff";
        c.style.color = "var(--color-dark)";
        c.style.borderColor = "var(--color-border-grey)";
      });
      this.classList.add("active");
      this.style.background = "var(--color-primary)";
      this.style.color = "#ffffff";
      this.style.borderColor = "var(--color-primary)";

      const filterType = this.getAttribute("data-filter");
      if (nameInput) nameInput.value = "";
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";

      if (filterType === "all") {
        if (categorySelect) categorySelect.value = "";
        if (statusSelect) statusSelect.value = "";
      } else if (filterType === "vip-preorder") {
        if (categorySelect) categorySelect.value = "";
        if (statusSelect) statusSelect.value = "VIP Pre-Order";
      } else if (filterType === "available") {
        if (categorySelect) categorySelect.value = "";
        if (statusSelect) statusSelect.value = "Available";
      } else if (filterType === "chiikawa") {
        if (categorySelect) categorySelect.value = "Chiikawa";
        if (statusSelect) statusSelect.value = "";
      } else if (filterType === "blind-box") {
        if (categorySelect) categorySelect.value = "Blind Box";
        if (statusSelect) statusSelect.value = "";
      }
      loadProducts();
    });
  });

  // 3. เริ่มต้นอ่านพารามิเตอร์จาก URL และโหลดสินค้าทันที
  initFiltersFromUrl();
  loadProducts();
});
