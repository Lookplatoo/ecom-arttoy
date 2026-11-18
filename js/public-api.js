/**
 * public-api.js - บริการอัตราแลกเปลี่ยนสกุลเงินสากล
 * ใช้ Open Exchange Rates API เพื่อแปลงราคาจาก THB ไปยังสกุลเงินสากล (USD, JPY, EUR)
 */

const PublicApiService = {
  // ดึงข้อมูลอัตราแลกเปลี่ยนปัจจุบัน
  fetchExchangeRates: async function () {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/THB");
      if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
      }
      const data = await response.json();
      return data.rates;
    } catch (error) {
      console.warn("Public API offline, using fallback rates:", error.message);
      // ข้อมูลสำรองกรณีไม่มีอินเทอร์เน็ต
      return {
        USD: 0.029,
        JPY: 4.45,
        EUR: 0.027
      };
    }
  },

  // อัปเดตราคาแปลงสกุลเงินลงในองค์ประกอบ HTML
  updateCurrencyDisplay: async function (priceInTHB) {
    const usdElem = document.getElementById("currency-usd-val");
    const jpyElem = document.getElementById("currency-jpy-val");
    const eurElem = document.getElementById("currency-eur-val");

    const rates = await this.fetchExchangeRates();
    if (rates) {
      if (usdElem) usdElem.textContent = `$${(priceInTHB * rates.USD).toFixed(2)}`;
      if (jpyElem) jpyElem.textContent = `¥${Math.round(priceInTHB * rates.JPY).toLocaleString()}`;
      if (eurElem) eurElem.textContent = `€${(priceInTHB * rates.EUR).toFixed(2)}`;
    }
  }
};

window.PublicApiService = PublicApiService;
