/**
 * detail.js - แสดงรายละเอียดสินค้า, ควบคุมการสั่งซื้อ, ตะกร้า และรีวิวสินค้า
 * Art Toy Community Store
 */

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || "CHIWA-01";

  // ดึงข้อมูลสินค้าจาก ApiService
  const product = await ApiService.getProductById(productId);

  if (!product) {
    const layout = document.querySelector(".detail-layout-container");
    if (layout) {
      layout.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; width: 100%;">
          <h2 class="detail-title">ไม่พบข้อมูลสินค้า</h2>
          <p style="margin: 16px 0; color: #555;">ไม่พบรหัสสินค้า "${productId}" ในระบบ กรุณาตรวจสอบรหัสสินค้าอีกครั้ง</p>
          <a href="search.html" class="btn-back">กลับไปหน้ารวมสินค้า</a>
        </div>
      `;
    }
    return;
  }

  // 1. อัปเดตรูปภาพสินค้า
  const imgElement = document.getElementById("detail-product-img");
  if (imgElement) {
    imgElement.src = product.image;
    imgElement.alt = product.name;
    imgElement.style.display = "block";
  }

  // 2. อัปเดตลิงก์แหล่งอ้างอิง
  const refLink = document.getElementById("detail-ref-link");
  if (refLink) {
    refLink.href = product.reference || "#";
    refLink.textContent = product.reference || "Official Release";
  }

  // 3. อัปเดตชื่อสินค้า
  const titleElement = document.getElementById("detail-title");
  if (titleElement) {
    titleElement.textContent = product.name;
  }

  // 4. อัปเดต Meta ข้อมูล
  const metaElement = document.getElementById("detail-meta");
  if (metaElement) {
    metaElement.innerHTML = `หมวดหมู่ : <strong>${product.category}</strong>`;
  }

  const skuLabel = document.getElementById("detail-sku-label");
  if (skuLabel) skuLabel.textContent = product.id;

  const ratingBadge = document.getElementById("detail-rating-badge");
  if (ratingBadge) {
    ratingBadge.textContent = `${Number(product.rating || 5.0).toFixed(1)}/5.0 (${product.reviewCount || 0} รีวิว)`;
  }

  // 5. อัปเดตราคา
  const priceElement = document.getElementById("detail-price");
  if (priceElement) {
    priceElement.textContent = `฿${Number(product.price).toFixed(2)}`;
  }

  // 5.1 อัปเดตราคาสมาชิกและสถานะ Member Exclusive Drop
  function renderMemberPerks() {
    const memberPriceBox = document.getElementById("detail-member-price-box");
    const lockContainer = document.getElementById("detail-member-lock-container");
    const actionButtonsWrap = document.getElementById("detail-action-buttons-wrap") || document.querySelector(".detail-action-buttons");
    const activeMember = ApiService.getActiveMember();
    const isMemberActive = activeMember && activeMember.status === 'Active';
    const basePrice = Number(product.price) || 0;

    if (memberPriceBox) {
      if (isMemberActive) {
        const discountedPrice = basePrice * (1 - activeMember.discountPercent / 100);
        const saveAmt = basePrice * (activeMember.discountPercent / 100);
        memberPriceBox.innerHTML = `
          <div class="member-price-active-card">
            <span class="member-price-crown">👑</span>
            <div class="member-price-info">
              <span class="member-price-tag">ราคาสมาชิกของคุณ (${activeMember.planName} ลด ${activeMember.discountPercent}%)</span>
              <div class="member-price-row">
                <span class="member-price-amount">฿${discountedPrice.toFixed(2)}</span>
                <span class="member-price-savings">ประหยัด ฿${saveAmt.toFixed(2)} + ส่งฟรี ฿0</span>
              </div>
            </div>
          </div>
        `;
      } else {
        const p15 = basePrice * 0.85;
        const p5 = basePrice * 0.95;
        memberPriceBox.innerHTML = `
          <div class="member-price-guest-card">
            <span class="member-price-crown">👑</span>
            <div class="member-price-info">
              <span class="member-price-tag">ราคาสมาชิก Mystery Box Club (ลด 5% - 15%)</span>
              <div class="member-price-row">
                <span class="member-price-amount">฿${p15.toFixed(2)} - ฿${p5.toFixed(2)}</span>
                <span class="member-price-savings">+ จัดส่งพัสดุด่วนฟรีทุกคำสั่งซื้อ</span>
              </div>
            </div>
          </div>
        `;
      }
    }

    // จัดการสิทธิ์การสั่งซื้อสำหรับสินค้าเฉพาะสมาชิก (Member Only)
    if (lockContainer && actionButtonsWrap) {
      if (product.memberOnly) {
        if (isMemberActive) {
          actionButtonsWrap.style.display = "flex";
          lockContainer.innerHTML = `
            <div class="member-access-unlocked-pill">
              <span class="unlocked-icon">✓</span>
              <span>คุณได้รับสิทธิ์สั่งซื้อสินค้า Secret Limited นี้ในฐานะสมาชิก <strong>${activeMember.planName}</strong></span>
            </div>
          `;
        } else {
          actionButtonsWrap.style.display = "none";
          lockContainer.innerHTML = `
            <div class="detail-member-lock-card">
              <div class="lock-header">
                <span class="lock-icon">🔒</span>
                <h4>สิทธิ์การสั่งซื้อเฉพาะสมาชิก Mystery Box Club</h4>
              </div>
              <p class="lock-desc">
                สินค้ารุ่นพิเศษนี้ผลิตจำนวนจำกัดเพียง 100 ชิ้น สงวนสิทธิ์การสั่งซื้อเฉพาะสมาชิกแพ็กเกจกล่องสุ่มเท่านั้น สมัครสมาชิกเพื่อปลดล็อคสิทธิ์สั่งซื้อพร้อมรับส่วนลดและส่งฟรีทันที
              </p>
              <div class="lock-actions">
                <a href="subscription.html" class="btn-unlock-subscribe">
                  สมัครสมาชิกเพื่อปลดล็อคสิทธิ์
                </a>
                <button type="button" id="btn-login-member-detail" class="btn-unlock-login">
                  ยืนยันรหัสสมาชิก (เข้าสู่ระบบ)
                </button>
              </div>
            </div>
          `;
        }
      } else {
        actionButtonsWrap.style.display = "flex";
        lockContainer.innerHTML = "";
      }
    }
  }

  renderMemberPerks();

  // ซิงค์เมื่อสถานะสมาชิกเปลี่ยน
  window.addEventListener('memberSessionChanged', () => {
    renderMemberPerks();
  });

  // 6. อัปเดตคำอธิบายสินค้า
  const descElement = document.getElementById("detail-desc");
  if (descElement) {
    descElement.textContent = product.description;
  }

  // 7. สต็อกและการจัดซื้อ
  const stockPill = document.getElementById("detail-stock-pill");
  const stockText = document.getElementById("detail-stock-text");
  const btnAddCart = document.getElementById("btn-add-cart-detail");
  const btnBuyNow = document.getElementById("btn-buy-now-detail");
  const qtyInput = document.getElementById("detail-qty-input");
  const btnMinus = document.getElementById("btn-qty-minus");
  const btnPlus = document.getElementById("btn-qty-plus");

  const stockCount = product.stock !== undefined ? product.stock : 10;
  const isOut = product.status === 'Out of Stock' || stockCount <= 0;
  const isPre = product.status === 'Pre-Order';

  if (stockPill && stockText) {
    if (isOut) {
      stockPill.className = "stock-status-pill stock-out";
      stockText.textContent = "สินค้าหมดชั่วคราว";
      if (btnAddCart) btnAddCart.disabled = true;
      if (btnBuyNow) btnBuyNow.disabled = true;
      if (qtyInput) qtyInput.value = 0;
    } else if (isPre) {
      stockPill.className = "stock-status-pill stock-pre";
      stockText.textContent = `เปิดพรีออเดอร์ (จำนวนคงเหลือ ${stockCount} ชิ้น)`;
    } else {
      stockPill.className = "stock-status-pill stock-in";
      stockText.textContent = `มีสินค้าพร้อมส่ง (${stockCount} ชิ้น)`;
    }
  }

  // Stepper Controller
  if (btnMinus && btnPlus && qtyInput && !isOut) {
    btnMinus.addEventListener("click", () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });

    btnPlus.addEventListener("click", () => {
      let val = parseInt(qtyInput.value) || 1;
      const maxLimit = Math.max(1, stockCount);
      if (val < maxLimit) qtyInput.value = val + 1;
    });
  }

  // กดปุ่มเพิ่มลงในตะกร้า
  if (btnAddCart && !isOut) {
    btnAddCart.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value) || 1;
      CartManager.addItem(product.id, qty);
    });
  }

  // กดปุ่มซื้อทันที
  if (btnBuyNow && !isOut) {
    btnBuyNow.addEventListener("click", () => {
      const qty = parseInt(qtyInput.value) || 1;
      const res = ApiService.addToCart(product.id, qty);
      if (res && res.success) {
        window.location.href = "checkout.html";
      } else {
        showToast((res && res.message) || "ไม่สามารถเพิ่มสินค้าลงในตะกร้าได้", "error");
      }
    });
  }

  // 8. แสดงอัตราแลกเปลี่ยน
  if (typeof PublicApiService !== "undefined") {
    PublicApiService.updateCurrencyDisplay(Number(product.price));
  }

  // 9. ระบบรีวิวสินค้า
  function renderReviews() {
    const listContainer = document.getElementById("reviews-list-container");
    const avgScoreEl = document.getElementById("reviews-avg-score");
    const ratingBadgeEl = document.getElementById("detail-rating-badge");
    if (!listContainer) return;

    const reviews = ApiService.getReviews(product.id);
    if (!reviews || reviews.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 24px; color: #76736d; font-family: var(--font-th);">
          <p>ยังไม่มีความคิดเห็นสำหรับสินค้านี้</p>
        </div>
      `;
      if (avgScoreEl) avgScoreEl.textContent = "ยังไม่มีรีวิว";
      if (ratingBadgeEl) {
        const baseRating = Number(product.rating || 5.0).toFixed(1);
        const baseCount = product.reviewCount || 0;
        ratingBadgeEl.textContent = `${baseRating}/5.0 (${baseCount} รีวิว)`;
      }
      return;
    }

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const scoreStr = `${avg.toFixed(1)}/5.0 (${reviews.length} รีวิว)`;
    if (avgScoreEl) avgScoreEl.textContent = scoreStr;
    if (ratingBadgeEl) ratingBadgeEl.textContent = scoreStr;

    let html = "";
    reviews.forEach(r => {
      html += `
        <div class="review-item-card">
          <div class="review-item-meta">
            <div class="review-item-user">
              <span>${r.name}</span>
              ${r.verified ? '<span class="verified-badge">ผู้ซื้อจริง</span>' : ''}
              <span style="color: #f59e0b; font-size: 13px; margin-left: 8px;">${r.rating}/5</span>
            </div>
            <span class="review-item-date">${r.date}</span>
          </div>
          <p class="review-item-comment">${r.comment}</p>
        </div>
      `;
    });
    listContainer.innerHTML = html;
  }

  renderReviews();

  // ปุ่มเปิด/ปิดฟอร์มเขียนรีวิว
  const btnToggleForm = document.getElementById("btn-toggle-review-form");
  const reviewPanel = document.getElementById("review-form-panel");
  const btnCancelReview = document.getElementById("btn-cancel-review");
  const reviewForm = document.getElementById("product-review-form");

  if (btnToggleForm && reviewPanel) {
    btnToggleForm.addEventListener("click", () => {
      reviewPanel.style.display = reviewPanel.style.display === "none" ? "block" : "none";
    });
  }

  if (btnCancelReview && reviewPanel) {
    btnCancelReview.addEventListener("click", () => {
      reviewPanel.style.display = "none";
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userName = document.getElementById("review-user-name").value.trim();
      const rating = parseFloat(document.getElementById("review-rating-val").value) || 5;
      const comment = document.getElementById("review-comment-val").value.trim();

      if (!userName || !comment) {
        showToast("กรุณากรอกชื่อและความคิดเห็น", "error");
        return;
      }

      ApiService.addReview(product.id, { name: userName, rating, comment });
      showToast("บันทึกรีวิวเรียบร้อย", "success");
      reviewForm.reset();
      reviewPanel.style.display = "none";
      renderReviews();
    });
  }

  // 10. สินค้าแนะนำที่เกี่ยวข้อง
  const relatedGrid = document.getElementById("related-products-grid");
  if (relatedGrid) {
    const allProducts = await ApiService.getProducts();
    const related = allProducts.filter(p => p.id !== product.id).slice(0, 3);

    relatedGrid.innerHTML = "";
    related.forEach(rel => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-thumbnail">
          <a href="detail.html?id=${encodeURIComponent(rel.id)}">
            <img src="${rel.image}" alt="${rel.name}">
          </a>
        </div>
        <div class="product-card-body">
          <div class="product-card-meta">
            <span class="product-card-cat">${rel.category}</span>
            <span class="product-card-rating">${Number(rel.rating || 5.0).toFixed(1)}/5.0</span>
          </div>
          <h3 class="product-card-name">
            <a href="detail.html?id=${encodeURIComponent(rel.id)}" style="color: inherit; text-decoration: none;">${rel.name}</a>
          </h3>
          <div class="product-card-footer">
            <div class="product-card-price-val">฿${Number(rel.price).toFixed(2)}</div>
            <div class="product-card-actions">
              <a href="detail.html?id=${encodeURIComponent(rel.id)}" class="btn-card-view-detail">ดูสินค้า</a>
              <button type="button" class="btn-card-add-cart" onclick="CartManager.addItem('${rel.id}')" title="เพิ่มลงในตะกร้า">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
      relatedGrid.appendChild(card);
    });
  }
});
