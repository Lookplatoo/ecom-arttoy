/**
 * cart.js - ระบบตะกร้าสินค้าแบบสไลด์ (Slide-over Cart Drawer)
 * Art Toy Community Store
 */

const CartManager = {
  appliedCoupon: null,

  init: function () {
    this.injectCartDrawer();
    this.bindEvents();
    this.render();
  },

  // ฉีดโครงสร้าง HTML ของ Cart Drawer ลงใน body
  injectCartDrawer: function () {
    if (document.getElementById('cart-drawer-overlay')) return;

    const drawerHTML = `
      <!-- Cart Drawer Overlay -->
      <div id="cart-drawer-overlay" class="cart-overlay"></div>

      <!-- Slide-Over Cart Drawer -->
      <aside id="cart-drawer" class="cart-drawer" aria-label="Shopping Cart Drawer">
        <div class="cart-header">
          <div class="cart-header-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2>ตะกร้าสินค้า (<span id="cart-drawer-count">0</span>)</h2>
          </div>
          <button type="button" id="btn-close-cart" class="btn-close-drawer" aria-label="Close Cart">&times;</button>
        </div>

        <div class="cart-free-shipping-bar">
          <div id="free-shipping-text" class="shipping-progress-text">ซื้อสินค้าเพิ่มอีก <strong id="free-shipping-remaining">499.00</strong> บาท เพื่อรับสิทธิ์จัดส่งฟรี</div>
          <div class="shipping-progress-track">
            <div id="free-shipping-progress" class="shipping-progress-fill" style="width: 0%;"></div>
          </div>
        </div>

        <!-- Cart Items List Container -->
        <div id="cart-items-container" class="cart-body"></div>

        <!-- Cart Footer -->
        <div class="cart-footer">
          <!-- Coupon Box -->
          <div class="cart-coupon-box">
            <input type="text" id="cart-coupon-input" placeholder="โค้ดส่วนลด เช่น ARTTOY10">
            <button type="button" id="btn-apply-coupon" class="btn-coupon">ใช้โค้ด</button>
          </div>
          <div id="coupon-applied-notice" class="coupon-tag" style="display: none;">
            <span>โค้ด: <strong id="applied-code-name"></strong> ลด 10%</span>
            <button type="button" id="btn-remove-coupon" class="btn-remove-coupon">&times;</button>
          </div>

          <!-- Price Summary Breakdown -->
          <div class="cart-summary-breakdown">
            <div class="summary-line">
              <span>ยอดรวมสินค้า</span>
              <span id="cart-subtotal-val">฿0.00</span>
            </div>
            <div class="summary-line discount-line" id="cart-discount-row" style="display: none;">
              <span>ส่วนลด</span>
              <span id="cart-discount-val">-฿0.00</span>
            </div>
            <div class="summary-line">
              <span>ค่าจัดส่ง</span>
              <span id="cart-shipping-val">฿40.00</span>
            </div>
            <div class="summary-line total-line">
              <span>ยอดสุทธิ</span>
              <span id="cart-total-val" class="highlight-total">฿0.00</span>
            </div>
          </div>

          <div class="cart-actions">
            <a href="checkout.html" id="btn-cart-checkout" class="btn-checkout-primary">
              ดำเนินการสั่งซื้อ
            </a>
            <button type="button" id="btn-continue-shopping" class="btn-continue-secondary">
              เลือกซื้อสินค้าต่อ
            </button>
          </div>
        </div>
      </aside>
    `;

    document.body.insertAdjacentHTML('beforeend', drawerHTML);
  },

  bindEvents: function () {
    const overlay = document.getElementById('cart-drawer-overlay');
    const closeBtn = document.getElementById('btn-close-cart');
    const continueBtn = document.getElementById('btn-continue-shopping');
    const applyCouponBtn = document.getElementById('btn-apply-coupon');
    const removeCouponBtn = document.getElementById('btn-remove-coupon');
    const couponInput = document.getElementById('cart-coupon-input');

    if (overlay) overlay.addEventListener('click', () => this.close());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (continueBtn) continueBtn.addEventListener('click', () => this.close());

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.btn-cart-trigger, #header-cart-btn');
      if (trigger) {
        e.preventDefault();
        this.open();
      }
    });

    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'ARTTOY10' || code === 'CHIICUTE') {
          this.appliedCoupon = { code: code, discountPercent: 10 };
          sessionStorage.setItem('arttoy_coupon', JSON.stringify(this.appliedCoupon));
          couponInput.value = '';
          showToast(`ใช้โค้ด ${code} สำเร็จ ลด 10%`, 'success');
          this.render();
        } else if (code) {
          showToast('โค้ดส่วนลดไม่ถูกต้อง ลองใช้ ARTTOY10', 'error');
        }
      });
    }

    if (removeCouponBtn) {
      removeCouponBtn.addEventListener('click', () => {
        this.appliedCoupon = null;
        sessionStorage.removeItem('arttoy_coupon');
        showToast('ยกเลิกโค้ดส่วนลดแล้ว', 'success');
        this.render();
      });
    }

    const savedCoupon = sessionStorage.getItem('arttoy_coupon');
    if (savedCoupon) {
      try { this.appliedCoupon = JSON.parse(savedCoupon); } catch (e) { }
    }
  },

  open: function () {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      this.render();
      overlay.classList.add('active');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close: function () {
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  addItem: function (productId, qty = 1) {
    const res = ApiService.addToCart(productId, qty);
    if (res.success) {
      showToast(res.message, 'success');
      this.render();
      this.open();
    } else {
      showToast(res.message, 'error');
    }
  },

  updateQty: function (productId, qty) {
    ApiService.updateCartQty(productId, qty);
    this.render();
  },

  removeItem: function (productId) {
    ApiService.removeFromCart(productId);
    showToast('ลบสินค้าออกจากตะกร้าแล้ว', 'success');
    this.render();
  },

  render: function () {
    const cart = ApiService.getCart() || [];
    const container = document.getElementById('cart-items-container');
    const countSpan = document.getElementById('cart-drawer-count');
    const headerBadges = document.querySelectorAll('.cart-badge-count');
    const checkoutBtn = document.getElementById('btn-cart-checkout');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countSpan) countSpan.textContent = totalItems;
    headerBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const freeShippingThreshold = 999;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shippingFee = (cart.length === 0 || isFreeShipping) ? 0 : 40;

    let discountAmount = 0;
    if (this.appliedCoupon && subtotal > 0) {
      discountAmount = (subtotal * this.appliedCoupon.discountPercent) / 100;
    }

    const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    // Free Shipping Progress
    const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
    const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
    const freeShippingText = document.getElementById('free-shipping-text');
    const freeShippingProgress = document.getElementById('free-shipping-progress');

    if (freeShippingProgress) {
      freeShippingProgress.style.width = `${progressPercent}%`;
    }
    if (freeShippingText) {
      if (isFreeShipping && cart.length > 0) {
        freeShippingText.innerHTML = `คุณได้รับสิทธิ์ <strong>จัดส่งฟรี</strong>`;
      } else {
        freeShippingText.innerHTML = `ซื้อสินค้าเพิ่มอีก <strong>฿${remainingForFree.toFixed(2)}</strong> เพื่อรับสิทธิ์จัดส่งฟรี`;
      }
    }

    // Coupon UI
    const couponRow = document.getElementById('cart-discount-row');
    const couponNotice = document.getElementById('coupon-applied-notice');
    const appliedCodeName = document.getElementById('applied-code-name');

    if (this.appliedCoupon && subtotal > 0) {
      if (couponRow) {
        couponRow.style.display = 'flex';
        document.getElementById('cart-discount-val').textContent = `-฿${discountAmount.toFixed(2)}`;
      }
      if (couponNotice && appliedCodeName) {
        couponNotice.style.display = 'inline-flex';
        appliedCodeName.textContent = this.appliedCoupon.code;
      }
    } else {
      if (couponRow) couponRow.style.display = 'none';
      if (couponNotice) couponNotice.style.display = 'none';
    }

    const subtotalEl = document.getElementById('cart-subtotal-val');
    const shippingEl = document.getElementById('cart-shipping-val');
    const totalEl = document.getElementById('cart-total-val');

    if (subtotalEl) subtotalEl.textContent = `฿${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = isFreeShipping ? 'ฟรี' : `฿${shippingFee.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `฿${grandTotal.toFixed(2)}`;

    if (checkoutBtn) {
      if (cart.length === 0) {
        checkoutBtn.classList.add('disabled');
        checkoutBtn.style.pointerEvents = 'none';
        checkoutBtn.style.opacity = '0.5';
      } else {
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.style.pointerEvents = 'auto';
        checkoutBtn.style.opacity = '1';
      }
    }

    // Render รายการสินค้า
    if (container) {
      if (cart.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-state">
            <h3>ไม่มีสินค้าในตะกร้า</h3>
            <p>เลือกดูสินค้าที่คุณสนใจเพื่อเพิ่มลงในตะกร้า</p>
            <a href="search.html" class="btn-shop-now-empty" onclick="CartManager.close()">เลือกซื้อสินค้า</a>
          </div>
        `;
      } else {
        let itemsHtml = '<div class="cart-items-list">';
        cart.forEach(item => {
          itemsHtml += `
            <div class="cart-item-row" data-id="${item.id}">
              <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="cart-item-info">
                <div class="cart-item-header">
                  <a href="detail.html?id=${encodeURIComponent(item.id)}" class="cart-item-title">${item.name}</a>
                  <button type="button" class="btn-remove-item" onclick="CartManager.removeItem('${item.id}')" title="ลบสินค้านี้">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                <div class="cart-item-category">${item.category}</div>
                <div class="cart-item-bottom">
                  <div class="cart-item-stepper">
                    <button type="button" class="stepper-btn" onclick="CartManager.updateQty('${item.id}', ${item.qty - 1})">-</button>
                    <span class="stepper-val">${item.qty}</span>
                    <button type="button" class="stepper-btn" onclick="CartManager.updateQty('${item.id}', ${item.qty + 1})">+</button>
                  </div>
                  <div class="cart-item-price">฿${(item.price * item.qty).toFixed(2)}</div>
                </div>
              </div>
            </div>
          `;
        });
        itemsHtml += '</div>';
        container.innerHTML = itemsHtml;
      }
    }

    // แจ้งเตือนหน้าอื่น (เช่น checkout) ให้ซิงค์ราคาตามทันที
    window.dispatchEvent(new CustomEvent('cartChanged', { detail: { cart, subtotal, grandTotal } }));
  }
};

document.addEventListener('DOMContentLoaded', function () {
  CartManager.init();
});

window.CartManager = CartManager;
