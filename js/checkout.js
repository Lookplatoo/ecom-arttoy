/**
 * checkout.js - ควบคุมขั้นตอนการกรอกที่อยู่ คำนวณค่าส่ง และชำระเงิน
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

  // ฟังก์ชันคำนวณและแสดงผลสรุปคำสั่งซื้อ
  function renderCheckoutSummary() {
    const currentCart = ApiService.getCart() || [];
    const mainForm = document.getElementById("checkout-main-form");

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
      return { subtotal: 0, discountAmount: 0, finalShippingCost: 0, grandTotal: 0 };
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
    const isFreeShipping = subtotal >= freeShippingThreshold;

    const finalShippingCost = isFreeShipping ? 0 : selectedShippingCost;

    let discountAmount = 0;
    if (appliedCoupon && subtotal > 0) {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    }

    const grandTotal = Math.max(0, subtotal - discountAmount + finalShippingCost);

    const subtotalEl = document.getElementById("co-subtotal-val");
    const discountRow = document.getElementById("co-discount-row");
    const discountVal = document.getElementById("co-discount-val");
    const shippingEl = document.getElementById("co-shipping-val");
    const totalEl = document.getElementById("co-grand-total-val");
    const qrAmount = document.getElementById("qr-pay-amount");

    if (subtotalEl) subtotalEl.textContent = `฿${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = isFreeShipping ? "ฟรี" : `฿${finalShippingCost.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `฿${grandTotal.toFixed(2)}`;
    if (qrAmount) qrAmount.textContent = `฿${grandTotal.toFixed(2)}`;

    const couponTag = document.getElementById("checkout-coupon-applied-tag");
    const codeName = document.getElementById("checkout-code-name");
    if (appliedCoupon && subtotal > 0) {
      if (discountRow) discountRow.style.display = "flex";
      if (discountVal) discountVal.textContent = `-฿${discountAmount.toFixed(2)}`;
      if (couponTag && codeName) {
        couponTag.style.display = "inline-flex";
        codeName.textContent = appliedCoupon.code;
      }
    } else {
      if (discountRow) discountRow.style.display = "none";
      if (couponTag) couponTag.style.display = "none";
    }

    const flashLabel = document.getElementById("shipping-cost-label-flash");
    if (flashLabel) {
      flashLabel.textContent = isFreeShipping ? "ฟรี" : "฿40.00";
    }

    return { subtotal, discountAmount, finalShippingCost, grandTotal, currentCart };
  }

  // เรียกใช้ครั้งแรก
  renderCheckoutSummary();

  // ซิงค์ทันทีเมื่อตะกร้าเปลี่ยนจากหน้าอื่นหรือจาก Cart Drawer
  window.addEventListener('cartChanged', function () {
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
        discountAmount: amounts.discountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : "",
        totalAmount: amounts.grandTotal,
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
