/**
 * cart.js - ระบบตะกร้าสินค้าแบบสไลด์ (Slide-over Cart Drawer) & การจัดการสิทธิประโยชน์สมาชิก (Member Perks)
 * Art Toy Community Store
 */

const CartManager = {
  appliedCoupon: null,

  init: function () {
    this.injectCartDrawer();
    this.injectMemberModal();
    this.renderHeaderMemberBadge();
    this.bindEvents();
    this.render();
  },

  // 1. ฉีดโครงสร้าง HTML ของ Cart Drawer ลงใน body
  injectCartDrawer: function () {
    if (document.getElementById('cart-drawer-overlay')) return;

    const drawerHTML = `
      <!-- Cart Drawer Overlay -->
      <div id="cart-drawer-overlay" class="cart-overlay"></div>

      <!-- Slide-Over Cart Drawer -->
      <aside id="cart-drawer" class="cart-drawer" aria-label="Shopping Cart Drawer" role="dialog" aria-modal="true">
        <div class="cart-header">
          <div class="cart-header-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2>ตะกร้าสินค้า (<span id="cart-drawer-count">0</span>)</h2>
          </div>
          <button type="button" id="btn-close-cart" class="btn-close-drawer" aria-label="ปิดตะกร้าสินค้า (Close Cart)">&times;</button>
        </div>

        <!-- Member VIP Status Banner in Cart Drawer -->
        <div id="cart-member-vip-banner" class="cart-member-vip-banner" style="display: none;"></div>

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
          <!-- Member Perk Verification Box -->
          <div id="cart-member-perk-box" class="cart-member-perk-box"></div>

          <!-- Coupon Box -->
          <div class="cart-coupon-box">
            <input type="text" id="cart-coupon-input" placeholder="โค้ดส่วนลด เช่น ARTTOY10" aria-label="กรอกโค้ดส่วนลด">
            <button type="button" id="btn-apply-coupon" class="btn-coupon">ใช้โค้ด</button>
          </div>
          <div id="coupon-applied-notice" class="coupon-tag" style="display: none;">
            <span>โค้ด: <strong id="applied-code-name"></strong> ลด 10%</span>
            <button type="button" id="btn-remove-coupon" class="btn-remove-coupon" aria-label="ยกเลิกโค้ดส่วนลด">&times;</button>
          </div>

          <!-- Price Summary Breakdown -->
          <div class="cart-summary-breakdown">
            <div class="summary-line">
              <span>ยอดรวมสินค้า</span>
              <span id="cart-subtotal-val">฿0.00</span>
            </div>
            <div class="summary-line discount-line member-discount-line" id="cart-member-discount-row" style="display: none;">
              <span id="cart-member-discount-label">ส่วนลดสมาชิก</span>
              <span id="cart-member-discount-val">-฿0.00</span>
            </div>
            <div class="summary-line discount-line" id="cart-discount-row" style="display: none;">
              <span>ส่วนลดคูปอง</span>
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

  // 2. ฉีด Member Login Modal ลงใน body
  injectMemberModal: function () {
    if (document.getElementById('member-login-modal')) return;

    const modalHTML = `
      <div id="member-login-modal" class="modal-overlay member-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="member-modal-title">
        <div class="modal-card member-modal-card">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <span class="member-crown-icon">👑</span>
              <h3 id="member-modal-title">ยืนยันสิทธิ์สมาชิก Art Toy VIP Club</h3>
            </div>
            <button type="button" id="btn-close-member-modal" class="modal-close-btn" aria-label="ปิดหน้าต่างยืนยันสิทธิ์สมาชิก">&times;</button>
          </div>
          <div class="modal-body">
            <p class="member-modal-desc">
              กรอก <strong>Subscription ID</strong> (เช่น <code>SUB-202611-1991</code>) หรือ <strong>เบอร์โทรศัพท์</strong> ที่ลงทะเบียนไว้ เพื่อรับส่วนลดสมาชิก VIP 10% และสิทธิ์ส่งฟรี ฿0 ทุกคำสั่งซื้อ
            </p>
            <div class="member-modal-input-wrap">
              <input type="text" id="input-member-verify" class="form-input member-input" placeholder="ระบุ Subscription ID หรือ เบอร์โทร เช่น 0812345678" aria-label="ระบุ Subscription ID หรือเบอร์โทรศัพท์" autocomplete="off">
            </div>
            <div class="member-quick-hint">
              <span>ตัวอย่างรหัสทดสอบ: <code>SUB-202611-1991</code> (VIP 10%), <code>0812345678</code> (คุณกิตติคุณ), <code>SUB-202611-1992</code> (Founder Annual)</span>
            </div>
            <button type="button" id="btn-submit-member-verify" class="btn-modal-primary btn-member-action">
              ยืนยันสิทธิ์สมาชิก
            </button>
            <div class="member-modal-signup-link">
              <span>ยังไม่มีแพ็กเกจสมาชิก?</span>
              <a href="subscription.html">สมัครสมาชิก VIP Club เริ่มต้นเพียง ฿199/เดือน</a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  // 3. แสดงผล Member Badge ที่ Header
  renderHeaderMemberBadge: function () {
    const actionsGroup = document.querySelector('.header-actions-group');
    if (!actionsGroup) return;

    let slot = document.getElementById('header-member-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'header-member-slot';
      slot.className = 'header-member-slot';
      const cartBtn = document.getElementById('header-cart-btn') || actionsGroup.firstChild;
      actionsGroup.insertBefore(slot, cartBtn);
    }

    const activeMember = ApiService.getActiveMember();

    if (activeMember && activeMember.status === 'Active') {
      const displayName = (activeMember.customer && activeMember.customer.fullName) 
        ? activeMember.customer.fullName.split(' ')[0] 
        : 'สมาชิก VIP';

      slot.innerHTML = `
        <div class="header-member-pill-wrap" id="header-member-pill-wrap">
          <button type="button" class="header-member-pill" id="btn-header-member-pill" title="คลิกเพื่อดูสิทธิประโยชน์หรือจัดการสมาชิก">
            <span class="member-pill-crown">👑</span>
            <span class="member-pill-name">${displayName}</span>
            <span class="member-pill-badge">${activeMember.planName} (-${activeMember.discountPercent}%)</span>
          </button>
          <div class="header-member-dropdown" id="header-member-dropdown" style="display: none;">
            <div class="member-dropdown-header">
              <div class="dropdown-tier-tag">👑 ${activeMember.planName}</div>
              <div class="dropdown-member-name">${activeMember.customer ? activeMember.customer.fullName : 'สมาชิก VIP'}</div>
              <div class="dropdown-member-id">รหัสสมาชิก: <code>${activeMember.subId}</code></div>
            </div>
            <div class="member-dropdown-benefits">
              <div class="benefit-row">✓ ส่วนลดทุกออเดอร์ในร้าน <strong>${activeMember.discountPercent}%</strong></div>
              <div class="benefit-row">✓ จัดส่งพัสดุด่วนฟรีทุกคำสั่งซื้อ (฿0)</div>
              <div class="benefit-row">✓ สิทธิ์สั่งซื้อ Member Exclusive Drop</div>
            </div>
            <div class="member-dropdown-actions">
              <a href="subscription-manage.html?subId=${encodeURIComponent(activeMember.subId)}" class="btn-dropdown-manage">
                จัดการกล่องสุ่ม & วันจัดส่ง
              </a>
              <button type="button" id="btn-dropdown-logout" class="btn-dropdown-logout">
                ออกจากระบบสมาชิก
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      slot.innerHTML = `
        <button type="button" id="btn-header-member-login" class="btn-header-member-login" title="ยืนยันสิทธิ์สมาชิก Art Toy VIP Club">
          <span class="member-login-icon">👑</span>
          <span class="member-login-text">สิทธิ์สมาชิก VIP</span>
        </button>
      `;
    }
  },

  openMemberModal: function () {
    const modal = document.getElementById('member-login-modal');
    const input = document.getElementById('input-member-verify');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 150);
      }
    }
  },

  closeMemberModal: function () {
    const modal = document.getElementById('member-login-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  },

  submitMemberVerify: function (customQuery = null) {
    const input = document.getElementById('input-member-verify');
    const query = customQuery || (input ? input.value : '');
    const res = ApiService.verifyMember(query);

    if (res.success) {
      showToast(res.message, 'success');
      this.closeMemberModal();
      this.renderHeaderMemberBadge();
      this.render();
      // แจ้งให้หน้ารายละเอียดและหน้า checkout อัปเดตทันที
      window.dispatchEvent(new CustomEvent('memberSessionChanged', { detail: res.member }));
    } else {
      showToast(res.message, 'error');
    }
  },

  logoutMember: function () {
    ApiService.clearActiveMember();
    showToast('ออกจากระบบสมาชิกแล้ว', 'info');
    this.renderHeaderMemberBadge();
    this.render();
    window.dispatchEvent(new CustomEvent('memberSessionChanged', { detail: null }));
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

    // Cart Trigger Events
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.btn-cart-trigger, #header-cart-btn');
      if (trigger) {
        e.preventDefault();
        this.open();
      }

      // Header Member Login Button
      const memberLoginTrigger = e.target.closest('#btn-header-member-login, #btn-cart-open-member-login, #btn-login-member-detail');
      if (memberLoginTrigger) {
        e.preventDefault();
        this.openMemberModal();
      }

      // Close Member Modal
      const closeMemberBtn = e.target.closest('#btn-close-member-modal');
      if (closeMemberBtn) {
        e.preventDefault();
        this.closeMemberModal();
      }

      // Member Modal Backdrop Click
      const modalOverlay = document.getElementById('member-login-modal');
      if (modalOverlay && e.target === modalOverlay) {
        this.closeMemberModal();
      }

      // Toggle Header Member Dropdown
      const pillBtn = e.target.closest('#btn-header-member-pill');
      const dropdown = document.getElementById('header-member-dropdown');
      if (pillBtn && dropdown) {
        e.preventDefault();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      } else if (dropdown && !e.target.closest('#header-member-pill-wrap')) {
        dropdown.style.display = 'none';
      }

      // Header Member Logout
      const logoutBtn = e.target.closest('#btn-dropdown-logout');
      if (logoutBtn) {
        e.preventDefault();
        this.logoutMember();
      }
    });

    // Member Submit from Modal
    const submitMemberBtn = document.getElementById('btn-submit-member-verify');
    const verifyInput = document.getElementById('input-member-verify');
    if (submitMemberBtn) {
      submitMemberBtn.addEventListener('click', () => this.submitMemberVerify());
    }
    if (verifyInput) {
      verifyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.submitMemberVerify();
        }
      });
    }

    // Coupon Events
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

    // Sync when member session changes
    window.addEventListener('memberSessionChanged', () => {
      this.renderHeaderMemberBadge();
      this.render();
    });

    // Keyboard Accessibility (WCAG 2.1.2): Close drawer & modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.close();
        this.closeMemberModal();
        const dropdown = document.getElementById('header-member-dropdown');
        if (dropdown) dropdown.style.display = 'none';
      }
    });
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
      if (res.memberRequired) {
        this.openMemberModal();
      }
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
    const activeMember = ApiService.getActiveMember();

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countSpan) countSpan.textContent = totalItems;
    headerBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const freeShippingThreshold = 999;
    const isMemberActive = activeMember && activeMember.status === 'Active';
    const isFreeShipping = isMemberActive || subtotal >= freeShippingThreshold;
    const shippingFee = (cart.length === 0 || isFreeShipping) ? 0 : 40;

    // Member Discount
    let memberDiscountAmount = 0;
    if (isMemberActive && subtotal > 0) {
      memberDiscountAmount = (subtotal * activeMember.discountPercent) / 100;
    }

    // Coupon Discount
    let couponDiscountAmount = 0;
    if (this.appliedCoupon && subtotal > 0) {
      couponDiscountAmount = (subtotal * this.appliedCoupon.discountPercent) / 100;
    }

    const totalDiscount = memberDiscountAmount + couponDiscountAmount;
    const grandTotal = Math.max(0, subtotal - totalDiscount + shippingFee);

    // Free Shipping Progress & VIP Notice
    const freeShippingText = document.getElementById('free-shipping-text');
    const freeShippingProgress = document.getElementById('free-shipping-progress');

    if (freeShippingProgress) {
      if (isMemberActive) {
        freeShippingProgress.style.width = '100%';
        freeShippingProgress.style.background = 'linear-gradient(90deg, #10b981, #059669)';
      } else {
        const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
        freeShippingProgress.style.width = `${progressPercent}%`;
        freeShippingProgress.style.background = '';
      }
    }

    if (freeShippingText) {
      if (isMemberActive) {
        freeShippingText.innerHTML = `👑 สมาชิก <strong>${activeMember.planName}</strong> ได้รับสิทธิ์ <strong>จัดส่งฟรีทุกออเดอร์</strong>`;
      } else if (subtotal >= freeShippingThreshold && cart.length > 0) {
        freeShippingText.innerHTML = `คุณได้รับสิทธิ์ <strong>จัดส่งฟรี</strong>`;
      } else {
        const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
        freeShippingText.innerHTML = `ซื้อสินค้าเพิ่มอีก <strong>฿${remainingForFree.toFixed(2)}</strong> เพื่อรับสิทธิ์จัดส่งฟรี`;
      }
    }

    // Member VIP Banner in Cart Drawer Top
    const cartVipBanner = document.getElementById('cart-member-vip-banner');
    if (cartVipBanner) {
      if (isMemberActive) {
        cartVipBanner.style.display = 'block';
        cartVipBanner.innerHTML = `
          <div class="cart-vip-inner">
            <span class="vip-icon">👑</span>
            <div class="vip-desc">
              <strong>${activeMember.planName} VIP</strong>: รับส่วนลด ${activeMember.discountPercent}% + ส่งฟรี ฿0
            </div>
          </div>
        `;
      } else {
        cartVipBanner.style.display = 'none';
      }
    }

    // Member Perk Box in Cart Drawer Footer
    const memberPerkBox = document.getElementById('cart-member-perk-box');
    if (memberPerkBox) {
      if (isMemberActive) {
        memberPerkBox.innerHTML = `
          <div class="cart-member-applied-pill">
            <span class="pill-check">✓</span>
            <span>ใช้สิทธิ์สมาชิก: <strong>${activeMember.planName} (ลด ${activeMember.discountPercent}%)</strong></span>
          </div>
        `;
      } else {
        memberPerkBox.innerHTML = `
          <div class="cart-member-login-callout">
            <span>สมาชิก VIP Club?</span>
            <button type="button" id="btn-cart-open-member-login" class="btn-cart-member-link">
              ยืนยันสิทธิ์สมาชิก (ลด 10% + ส่งฟรี ฿0)
            </button>
          </div>
        `;
      }
    }

    // Member Discount Row in Breakdown
    const memberDiscountRow = document.getElementById('cart-member-discount-row');
    const memberDiscountLabel = document.getElementById('cart-member-discount-label');
    const memberDiscountVal = document.getElementById('cart-member-discount-val');
    if (memberDiscountRow) {
      if (memberDiscountAmount > 0) {
        memberDiscountRow.style.display = 'flex';
        if (memberDiscountLabel) memberDiscountLabel.textContent = `ส่วนลดสมาชิก (${activeMember.planName} ${activeMember.discountPercent}%)`;
        if (memberDiscountVal) memberDiscountVal.textContent = `-฿${memberDiscountAmount.toFixed(2)}`;
      } else {
        memberDiscountRow.style.display = 'none';
      }
    }

    // Coupon UI
    const couponRow = document.getElementById('cart-discount-row');
    const couponNotice = document.getElementById('coupon-applied-notice');
    const appliedCodeName = document.getElementById('applied-code-name');

    if (couponDiscountAmount > 0 && subtotal > 0) {
      if (couponRow) {
        couponRow.style.display = 'flex';
        document.getElementById('cart-discount-val').textContent = `-฿${couponDiscountAmount.toFixed(2)}`;
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
    if (shippingEl) shippingEl.textContent = isFreeShipping ? (isMemberActive ? 'ฟรี (สมาชิก VIP)' : 'ฟรี') : `฿${shippingFee.toFixed(2)}`;
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
                  <button type="button" class="btn-remove-item" onclick="CartManager.removeItem('${item.id}')" title="ลบสินค้านี้" aria-label="ลบ ${item.name} ออกจากตะกร้า">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                <div class="cart-item-category">${item.category}</div>
                <div class="cart-item-bottom">
                  <div class="cart-item-stepper">
                    <button type="button" class="stepper-btn" onclick="CartManager.updateQty('${item.id}', ${item.qty - 1})" aria-label="ลดจำนวน ${item.name}">-</button>
                    <span class="stepper-val">${item.qty}</span>
                    <button type="button" class="stepper-btn" onclick="CartManager.updateQty('${item.id}', ${item.qty + 1})" aria-label="เพิ่มจำนวน ${item.name}">+</button>
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
