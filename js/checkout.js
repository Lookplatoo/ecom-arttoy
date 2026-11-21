/**
 * checkout.js - ควบคุมขั้นตอนการกรอกที่อยู่ คำนวณค่าส่ง และชำระเงิน พร้อมสิทธิประโยชน์สมาชิก
 * Art Toy Community Store
 */

document.addEventListener("DOMContentLoaded", function () {
  const itemsContainer = document.getElementById("checkout-items-list");
  const itemsBadge = document.getElementById("checkout-total-items-badge");

  let appliedCoupon = null;
  const savedCoupon = sessionStorage.getItem("arttoy_coupon");
  if (savedCoupon) {
    try { appliedCoupon = JSON.parse(savedCoupon); } catch (e) { }
  }

  let selectedShippingCost = 40;
  let selectedShippingMethod = "Flash Express";
  let selectedPaymentMethod = "PromptPay QR";
  let redeemedPoints = 0; // แต้มสะสมที่เลือกใช้ลดราคา (Reward Points)

  // Auto-fill ข้อมูลสมาชิกหากมี session ล็อกอินอยู่
  function autoFillMemberInfo() {
    const activeMember = ApiService.getActiveMember();
    if (!activeMember || !activeMember.customer) return;

    const cust = activeMember.customer;
    const nameInput = document.getElementById("cust-fullname");
    const phoneInput = document.getElementById("cust-phone");
    const addressInput = document.getElementById("cust-address");
    const noteInput = document.getElementById("cust-note");

    if (nameInput && cust.fullName) nameInput.value = cust.fullName;
    if (phoneInput && cust.phone) phoneInput.value = cust.phone;
    if (addressInput && cust.address) addressInput.value = cust.address;
    if (noteInput && cust.note && cust.note !== '-') noteInput.value = cust.note;
  }

  // แสดงผล Banner สมาชิกในหน้า Checkout
  function renderMemberBanner() {
    const banner = document.getElementById("checkout-member-banner");
    if (!banner) return;

    const activeMember = ApiService.getActiveMember();
    if (activeMember && activeMember.status === 'Active') {
      banner.style.display = 'block';
      banner.innerHTML = `
        <div class="checkout-vip-banner-inner">
          <span class="vip-badge-icon">👑</span>
          <div class="vip-info-wrap">
            <div class="vip-header-title">
              <strong>บัญชีสมาชิก VIP: ${activeMember.customer ? activeMember.customer.fullName : 'ท่านสมาชิก'}</strong>
              <span class="vip-tier-pill">${activeMember.planName}</span>
            </div>
            <p class="vip-perks-desc">
              ปลดล็อคส่วนลดสมาชิก <strong>${activeMember.discountPercent}%</strong> และรับสิทธิ์ <strong>จัดส่งฟรีทุกออเดอร์ (฿0)</strong>
            </p>
          </div>
        </div>
      `;
    } else {
      banner.style.display = 'block';
      banner.innerHTML = `
        <div class="checkout-guest-banner-inner">
          <div class="guest-prompt-text">
            <span>👑 <strong>คุณเป็นสมาชิก Mystery Box Club หรือไม่?</strong></span>
            <p>กรอกรหัสสมาชิกหรือเบอร์โทรเพื่อรับส่วนลด 5-15% และสิทธิ์ส่งฟรีทันที</p>
          </div>
          <button type="button" id="btn-checkout-verify-member" class="btn-checkout-verify-link">
            ยืนยันสิทธิ์สมาชิก
          </button>
        </div>
      `;

      const verifyBtn = document.getElementById("btn-checkout-verify-member");
      if (verifyBtn) {
        verifyBtn.addEventListener("click", () => {
          if (window.CartManager && window.CartManager.openMemberModal) {
            window.CartManager.openMemberModal();
          }
        });
      }
    }
  }

  // ฟังก์ชันคำนวณและแสดงผลสรุปคำสั่งซื้อ
  function renderCheckoutSummary() {
    const currentCart = ApiService.getCart() || [];
    const mainForm = document.getElementById("checkout-main-form");
    const activeMember = ApiService.getActiveMember();
    const isMemberActive = activeMember && activeMember.status === 'Active';

    if (currentCart.length === 0) {
      if (mainForm) {
        mainForm.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #ffffff; border: 1px solid var(--color-border-grey); border-radius: 12px;">
            <h2 style="font-family: var(--font-th); font-size: 20px; margin-bottom: 8px;">ไม่มีสินค้าในตะกร้า</h2>
            <p style="color: #76736d; font-size: 14px; margin-bottom: 20px;">กรุณาเลือกซื้อสินค้าก่อนดำเนินการชำระเงิน</p>
            <a href="search.html" class="btn-hero-primary" style="display: inline-block;">เลือกดูสินค้า</a>
          </div>
        `;
      }
      return { subtotal: 0, discountAmount: 0, memberDiscountAmount: 0, couponDiscountAmount: 0, finalShippingCost: 0, grandTotal: 0 };
    }

    const totalItems = currentCart.reduce((sum, i) => sum + i.qty, 0);
    if (itemsBadge) itemsBadge.textContent = totalItems;

    let itemsHtml = "";
    currentCart.forEach(item => {
      itemsHtml += `
        <div class="checkout-item-mini">
          <div class="checkout-item-mini-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="checkout-item-mini-info">
            <div class="checkout-item-mini-name">${item.name}</div>
            <div class="checkout-item-mini-qty">จำนวน: ${item.qty} ชิ้น</div>
          </div>
          <div class="checkout-item-mini-price">฿${(item.price * item.qty).toFixed(2)}</div>
        </div>
      `;
    });
    if (itemsContainer) itemsContainer.innerHTML = itemsHtml;

    const subtotal = currentCart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const freeShippingThreshold = 999;
    const isFreeShipping = isMemberActive || subtotal >= freeShippingThreshold;

    const finalShippingCost = isFreeShipping ? 0 : selectedShippingCost;

    // ส่วนลดสมาชิก
    let memberDiscountAmount = 0;
    if (isMemberActive && subtotal > 0) {
      memberDiscountAmount = (subtotal * activeMember.discountPercent) / 100;
    }

    // ส่วนลดคูปอง
    let couponDiscountAmount = 0;
    if (appliedCoupon && subtotal > 0) {
      couponDiscountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    }

    // ส่วนลดแต้ม Reward Points (1 แต้ม = 1 บาท ตามรายงาน ITDS294 หน้า 7, 10, 14, 15)
    let pointsDiscountAmount = 0;
    const availablePoints = isMemberActive ? (activeMember.points !== undefined ? Number(activeMember.points) : ApiService.getMemberPoints(activeMember.subId)) : 0;
    
    const pointsBox = document.getElementById("checkout-points-redemption-box");
    const pointsAvailEl = document.getElementById("co-available-points");
    if (pointsBox) {
      if (isMemberActive && availablePoints > 0) {
        pointsBox.style.display = "block";
        if (pointsAvailEl) pointsAvailEl.textContent = `${availablePoints} แต้ม (ลดได้ ฿${availablePoints})`;
      } else {
        pointsBox.style.display = "none";
      }
    }

    if (redeemedPoints > 0) {
      const maxApplicable = Math.max(0, subtotal - memberDiscountAmount - couponDiscountAmount);
      pointsDiscountAmount = Math.min(redeemedPoints, availablePoints, maxApplicable);
    }

    const totalDiscount = memberDiscountAmount + couponDiscountAmount + pointsDiscountAmount;
    const grandTotal = Math.max(0, subtotal - totalDiscount + finalShippingCost);
    const earnedPoints = Math.floor(grandTotal / 10); // ทุก 10 บาทที่จ่ายจริง ได้รับ 1 แต้มสะสม

    const subtotalEl = document.getElementById("co-subtotal-val");
    const memberDiscountRow = document.getElementById("co-member-discount-row");
    const memberDiscountLabel = document.getElementById("co-member-discount-label");
    const memberDiscountVal = document.getElementById("co-member-discount-val");

    const pointsRow = document.getElementById("co-points-discount-row");
    const pointsUsedCount = document.getElementById("co-points-used-count");
    const pointsVal = document.getElementById("co-points-discount-val");
    const earnedPointsEl = document.getElementById("co-earned-points-val");

    const discountRow = document.getElementById("co-discount-row");
    const discountVal = document.getElementById("co-discount-val");
    const shippingEl = document.getElementById("co-shipping-val");
    const totalEl = document.getElementById("co-grand-total-val");
    const qrAmount = document.getElementById("qr-pay-amount");

    if (subtotalEl) subtotalEl.textContent = `฿${subtotal.toFixed(2)}`;

    // Member Discount Display
    if (memberDiscountRow) {
      if (memberDiscountAmount > 0) {
        memberDiscountRow.style.display = "flex";
        if (memberDiscountLabel) memberDiscountLabel.textContent = `ส่วนลดสมาชิก (${activeMember.planName} ${activeMember.discountPercent}%)`;
        if (memberDiscountVal) memberDiscountVal.textContent = `-฿${memberDiscountAmount.toFixed(2)}`;
      } else {
        memberDiscountRow.style.display = "none";
      }
    }

    // Points Discount Display
    if (pointsRow) {
      if (pointsDiscountAmount > 0) {
        pointsRow.style.display = "flex";
        if (pointsUsedCount) pointsUsedCount.textContent = pointsDiscountAmount;
        if (pointsVal) pointsVal.textContent = `-฿${pointsDiscountAmount.toFixed(2)}`;
      } else {
        pointsRow.style.display = "none";
      }
    }

    // Earned Points Display
    if (earnedPointsEl) {
      earnedPointsEl.textContent = `+${earnedPoints} แต้ม`;
    }

    // Coupon Display
    const couponTag = document.getElementById("checkout-coupon-applied-tag");
    const codeName = document.getElementById("checkout-code-name");
    if (couponDiscountAmount > 0 && subtotal > 0) {
      if (discountRow) discountRow.style.display = "flex";
      if (discountVal) discountVal.textContent = `-฿${couponDiscountAmount.toFixed(2)}`;
      if (couponTag && codeName) {
        couponTag.style.display = "inline-flex";
        codeName.textContent = appliedCoupon.code;
      }
    } else {
      if (discountRow) discountRow.style.display = "none";
      if (couponTag) couponTag.style.display = "none";
    }

    if (shippingEl) {
      shippingEl.textContent = isFreeShipping 
        ? (isMemberActive ? "ฟรี (สมาชิก VIP)" : "ฟรี") 
        : `฿${finalShippingCost.toFixed(2)}`;
    }
    if (totalEl) totalEl.textContent = `฿${grandTotal.toFixed(2)}`;
    if (qrAmount) qrAmount.textContent = `฿${grandTotal.toFixed(2)}`;

    const flashLabel = document.getElementById("shipping-cost-label-flash");
    if (flashLabel) {
      flashLabel.textContent = isFreeShipping ? "ฟรี" : "฿40.00";
    }

    return { 
      subtotal, 
      memberDiscountAmount, 
      couponDiscountAmount, 
      pointsDiscountAmount,
      totalDiscount, 
      finalShippingCost, 
      grandTotal,
      earnedPoints,
      currentCart 
    };
  }

  // เรียกใช้ครั้งแรก
  autoFillMemberInfo();
  renderMemberBanner();
  renderCheckoutSummary();

  // ซิงค์ทันทีเมื่อตะกร้าหรือสมาชิกเปลี่ยน
  window.addEventListener('cartChanged', function () {
    renderCheckoutSummary();
  });

  window.addEventListener('memberSessionChanged', function () {
    autoFillMemberInfo();
    renderMemberBanner();
    renderCheckoutSummary();
  });

  // จัดการเลือกวิธีจัดส่ง
  const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
  shippingRadios.forEach(radio => {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".shipping-method-options .method-radio-card").forEach(c => c.classList.remove("selected"));
      this.closest(".method-radio-card").classList.add("selected");
      selectedShippingCost = Number(this.dataset.cost) || 40;
      selectedShippingMethod = this.value;
      renderCheckoutSummary();
    });
  });

  // จัดการเลือกช่องทางชำระเงิน
  const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
  const promptPayPanel = document.getElementById("promptpay-panel");
  const creditCardPanel = document.getElementById("credit-card-panel");

  paymentRadios.forEach(radio => {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".payment-method-options .method-radio-card").forEach(c => c.classList.remove("selected"));
      this.closest(".method-radio-card").classList.add("selected");
      selectedPaymentMethod = this.value;

      if (promptPayPanel) promptPayPanel.style.display = selectedPaymentMethod === "PromptPay QR" ? "block" : "none";
      if (creditCardPanel) creditCardPanel.style.display = selectedPaymentMethod === "Credit Card" ? "block" : "none";
    });
  });

  // นับถอยหลังสำหรับ PromptPay QR
  let countdownSecs = 15 * 60;
  const timerEl = document.getElementById("qr-timer");
  if (timerEl) {
    setInterval(() => {
      if (countdownSecs > 0) {
        countdownSecs--;
        const mins = Math.floor(countdownSecs / 60);
        const secs = countdownSecs % 60;
        timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }
    }, 1000);
  }

  // จัดการคูปอง
  const btnApplyCoupon = document.getElementById("btn-checkout-apply-coupon");
  const btnRemoveCoupon = document.getElementById("btn-checkout-remove-coupon");
  const couponInput = document.getElementById("checkout-coupon-input");

  if (btnApplyCoupon && couponInput) {
    btnApplyCoupon.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === "ARTTOY10" || code === "CHIICUTE") {
        appliedCoupon = { code: code, discountPercent: 10 };
        sessionStorage.setItem("arttoy_coupon", JSON.stringify(appliedCoupon));
        couponInput.value = "";
        showToast(`ใช้โค้ด ${code} สำเร็จ ลด 10%`, "success");
        renderCheckoutSummary();
      } else if (code) {
        showToast("โค้ดส่วนลดไม่ถูกต้อง ลองใช้ ARTTOY10", "error");
      }
    });
  }

  if (btnRemoveCoupon) {
    btnRemoveCoupon.addEventListener("click", () => {
      appliedCoupon = null;
      sessionStorage.removeItem("arttoy_coupon");
      showToast("ยกเลิกโค้ดส่วนลดแล้ว", "success");
      renderCheckoutSummary();
    });
  }

  // จัดการแลกแต้ม Reward Points (1 แต้ม = 1 บาท)
  const btnApplyPoints = document.getElementById("btn-apply-points");
  const inputPoints = document.getElementById("input-points-redeem");
  const pointsMsg = document.getElementById("points-status-msg");

  if (btnApplyPoints && inputPoints) {
    btnApplyPoints.addEventListener("click", () => {
      const activeMember = ApiService.getActiveMember();
      if (!activeMember) {
        showToast("กรุณายืนยันสิทธิ์สมาชิกก่อนใช้แต้ม", "error");
        return;
      }
      const available = activeMember.points !== undefined ? Number(activeMember.points) : ApiService.getMemberPoints(activeMember.subId);
      const requested = parseInt(inputPoints.value, 10);
      if (isNaN(requested) || requested <= 0) {
        redeemedPoints = 0;
        if (pointsMsg) pointsMsg.style.display = "none";
        renderCheckoutSummary();
        return;
      }
      if (requested > available) {
        if (pointsMsg) {
          pointsMsg.style.display = "block";
          pointsMsg.style.color = "#dc2626";
          pointsMsg.textContent = `คุณมีแต้มสะสมเพียง ${available} แต้ม`;
        }
        return;
      }
      redeemedPoints = requested;
      if (pointsMsg) {
        pointsMsg.style.display = "block";
        pointsMsg.style.color = "#16a34a";
        pointsMsg.textContent = `✓ ใช้ ${redeemedPoints} แต้ม ลด ฿${redeemedPoints}.00 สำเร็จ`;
      }
      renderCheckoutSummary();
      showToast(`ใช้แต้มสะสม ${redeemedPoints} แต้ม แลกส่วนลด ฿${redeemedPoints}`, "success");
    });
  }

  // ยืนยันการสั่งซื้อ
  const form = document.getElementById("checkout-main-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullName = document.getElementById("cust-fullname").value.trim();
      const phone = document.getElementById("cust-phone").value.trim();
      const address = document.getElementById("cust-address").value.trim();
      const district = document.getElementById("cust-district").value.trim();
      const province = document.getElementById("cust-province").value.trim();
      const postcode = document.getElementById("cust-postcode").value.trim();
      const note = document.getElementById("cust-note").value.trim();

      if (!fullName || !phone || !address || !district || !province || !postcode) {
        showToast("กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน", "error");
        return;
      }

      // ตรวจสอบข้อมูลบัตรเครดิตหากเลือกชำระผ่านบัตร
      if (selectedPaymentMethod === "Credit Card") {
        const cardNumInput = document.getElementById("card-number-input");
        const cardExpInput = document.getElementById("card-exp-input");
        const cardCvvInput = document.getElementById("card-cvv-input");

        const cardNum = cardNumInput ? cardNumInput.value.replace(/\s+/g, '') : "";
        const cardExp = cardExpInput ? cardExpInput.value.trim() : "";
        const cardCvv = cardCvvInput ? cardCvvInput.value.trim() : "";

        if (!cardNum || cardNum.length < 15 || !cardExp || !cardCvv) {
          showToast("กรุณากรอกข้อมูลบัตรเครดิตให้ถูกต้องครบถ้วน", "error");
          return;
        }
      }

      const amounts = renderCheckoutSummary();
      const currentCart = ApiService.getCart() || [];
      if (currentCart.length === 0) {
        showToast("ไม่มีสินค้าในตะกร้า", "error");
        return;
      }

      const activeMember = ApiService.getActiveMember();

      const orderData = {
        customer: {
          fullName,
          phone,
          address: `${address} อำเภอ/เขต ${district} จังหวัด ${province} ${postcode}`,
          note: note || "-"
        },
        items: [...currentCart],
        shippingMethod: selectedShippingMethod,
        shippingCost: amounts.finalShippingCost,
        discountAmount: amounts.totalDiscount,
        memberDiscountAmount: amounts.memberDiscountAmount || 0,
        pointsRedeemed: redeemedPoints,
        earnedPoints: amounts.earnedPoints,
        couponCode: appliedCoupon ? appliedCoupon.code : "",
        memberId: activeMember ? activeMember.subId : null,
        memberSubId: activeMember ? activeMember.subId : null,
        memberPlan: activeMember ? activeMember.planName : null,
        totalAmount: amounts.grandTotal,
        finalTotal: amounts.grandTotal,
        paymentMethod: selectedPaymentMethod
      };

      const result = ApiService.createOrder(orderData);

      if (result.success) {
        sessionStorage.removeItem("arttoy_coupon");
        showToast("สั่งซื้อสำเร็จ กำลังสร้างใบเสร็จ...", "success");
        setTimeout(() => {
          window.location.href = `order-success.html?orderId=${encodeURIComponent(result.order.orderId)}`;
        }, 600);
      } else {
        showToast("เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ", "error");
      }
    });
  }
});
