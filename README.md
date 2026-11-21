# Art Toy Community — Online Store & VIP Membership Club Prototype

[![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-brightgreen)](https://lookplatoo.github.io/ecom-arttoy/)
[![Status](https://img.shields.io/badge/Status-Prototype%20Ready-blue)](https://lookplatoo.github.io/ecom-arttoy/)
[![Architecture](https://img.shields.io/badge/Architecture-Standalone%20LocalStorage-orange)](https://lookplatoo.github.io/ecom-arttoy/)

> **Live Demo Website:** [https://lookplatoo.github.io/ecom-arttoy/](https://lookplatoo.github.io/ecom-arttoy/)

ต้นแบบเว็บไซต์ร้านค้าออนไลน์ (E-Commerce Store Prototype) สำหรับจำหน่ายอาร์ตทอยโมเดลสะสมของแท้ 100% พร้อมระบบสมาชิก Art Toy VIP Club (Amazon Prime + Fan Club Model) รายวิชา ITDS294  
ระบบทำงานแบบ **Standalone 100% บน Client-Side (HTML5, CSS3, Vanilla JavaScript)** ผ่าน MockDB (LocalStorage) โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ Backend หรือฐานข้อมูลภายนอก สามารถพรีวิว ทดลองสั่งซื้อ และจำลองการบริหารจัดการร้านค้าได้ทันที

---

## จุดเด่นของระบบ (Key Features)

### 1. ระบบหน้าร้านค้าออนไลน์ (E-Commerce Storefront)
* **หน้าแรก ([index.html](index.html))**: Hero Banner พร้อมปุ่ม Call-to-Action, แถบจุดเด่นความน่าเชื่อถือ (Trust Badges), สินค้าขายดีประจำสัปดาห์, แบนเนอร์แจกโค้ดส่วนลด `ARTTOY10`, และเสียงตอบรับจากลูกค้าจริง
* **ระบบค้นหาและกรองสินค้า ([search.html](search.html))**: กรองตามหมวดหมู่ (Chiikawa, Blind Box, Limited Edition), กรองตามสถานะ, เรียงตามราคาและคะแนนรีวิว พร้อมรองรับ URL Deep Linking (`?category=...`, `?name=...`)
* **หน้ารายละเอียดสินค้า ([detail.html](detail.html))**: ตัวเลือกจำนวนชิ้น, เช็คสต็อกคงเหลือแบบเรียลไทม์, ปุ่ม "เพิ่มลงในตะกร้า (Add to Cart)" และ "ซื้อทันที (Buy Now)", กล่องแปลงอัตราแลกเปลี่ยนเงินสากล, และฟอร์มเขียนรีวิวจากผู้ซื้อจริง
* **ตะกร้าสินค้าสไลด์ (Slide-over Cart Drawer)**: เปิดปิดได้ทุกหน้า, ปรับจำนวนชิ้น, แถบคำนวณยอดช้อปเพิ่มเพื่อรับสิทธิ์ส่งฟรี (ครบ 999฿), และระบบคูปองส่วนลด
* **หน้าชำระเงิน ([checkout.html](checkout.html))**: ฟอร์มที่อยู่จัดส่ง, ตัวเลือกขนส่งด่วน, ช่องทางชำระเงินจำลอง (PromptPay QR Code พร้อมตัวนับถอยหลัง 15 นาที, บัตรเครดิต/เดบิต, ชำระเงินปลายทาง COD)
* **หน้าใบเสร็จสั่งซื้อ ([order-success.html](order-success.html))**: สรุปยอดและรายละเอียดคำสั่งซื้อ พร้อมฟังก์ชันสั่งพิมพ์ใบเสร็จ A4 ขาว-ดำ ผ่าน Print Stylesheet
* **ระบบติดตามพัสดุ ([order-tracking.html](order-tracking.html))**: Stepper แสดงความคืบหน้า 5 ขั้นตอน (สั่งซื้อ &rarr; ชำระเงิน &rarr; กำลังแพ็ค &rarr; กำลังจัดส่ง &rarr; จัดส่งสำเร็จ) พร้อมไทม์ไลน์บันทึกประวัติการส่งของ

### 2. ระบบสมาชิก VIP Club (Amazon Prime + Fan Club Model)
* **หน้าแนะนำแพ็กเกจ ([subscription.html](subscription.html))**: 
  * โมเดลสมาชิกรายเดือน **Art Toy VIP Membership Club (฿199 / เดือน)** ราคาเดียว ครบทุกสิทธิ์ตามรายงาน ITDS294 หน้า 8, 10, 14
  * ส่วนลด 10% ทุกชิ้นทั้งร้านตลอดอายุสมาชิก และจัดส่งฟรี ฿0 ทุกคำสั่งซื้อไม่มีขั้นต่ำ
  * **สิทธิ์สั่งจองสินค้าลิมิเต็ดล่วงหน้า 24 ชม. (VIP Pre-Order Priority)** การันตีได้สินค้าของแท้ 100% ไม่ต้องแย่งกับบอท
  * **ตารางพิสูจน์ความคุ้มค่า (Break-Even Value Proposition)** ตามรายงาน ITDS294 หน้า 14 แสดงผลประหยัด ฿200 ทันทีตั้งแต่ออเดอร์แรก
* **หน้าชำระเงินสมาชิก ([subscription-checkout.html](subscription-checkout.html))**: กรอกที่อยู่จัดส่ง และช่องทางตัดรอบบิลอัตโนมัติ พร้อมช่องใส่ **รหัสผู้แนะนำ (Referral Code)** รับส่วนลด ฿100 ทันที
* **พอร์ทัลจัดการสมาชิกสำหรับลูกค้า ([subscription-manage.html](subscription-manage.html))**: 
  * ตรวจสอบสิทธิ์ VIP, ยอดแต้มสะสม **Reward Points** (แลกส่วนลดเงินสดในหน้า Checkout ได้)
  * **แคมเปญชวนเพื่อน (Referral Program)**: รหัสแนะนำประจำตัว พร้อมปุ่มคัดลอกลิงก์ 1-Click Copy และแชร์ลง TikTok, Line, Facebook
  * **Line Official Account Simulator**: จำลองหน้าต่างแชทแจ้งเตือนสิทธิ์ VIP 24h, แจ้งเลขพัสดุ และของขวัญวันเกิดผ่าน Line OA ตามรายงาน

### 3. ระบบผู้ดูแลระบบหลังบ้าน (Admin Management Portal)
* **หน้าล็อกอิน ([login.html](login.html))**: บัญชีทดสอบแอดมินพร้อมปุ่มกรอกข้อมูลอัตโนมัติ (`Admin` / `1234`)
* **ระบบจัดการสินค้า ([admin-products.html](admin-products.html))**: เพิ่ม, แก้ไข, ลบสินค้า, อัปโหลดรูปภาพ, และปรับสต็อกสินค้า
* **ระบบจัดการคำสั่งซื้อ ([admin-orders.html](admin-orders.html))**: ดูรายละเอียดคำสั่งซื้อของลูกค้า และเปลี่ยนสถานะเป็นจัดส่งแล้วพร้อมออกเลขพัสดุ
* **ระบบจัดการสมาชิกกล่องสุ่ม ([admin-subscriptions.html](admin-subscriptions.html))**: แผงสถิติสมาชิก, ประมาณการรายได้รายเดือน (MRR), และฟอร์มบันทึกการจัดส่งกล่องประจำรอบ
* **ระบบจัดการบัญชีแอดมิน ([admin-users.html](admin-users.html))**: บริหารจัดการสิทธิ์และบัญชีผู้ใช้งานในระบบ

---

## สถาปัตยกรรมและการเก็บข้อมูล (Data Architecture)

ระบบใช้ **MockDB (`js/api.js`)** ทำหน้าที่เป็น Local Database จำลองผ่าน Web Storage API (`localStorage`):
* `arttoy_products_v2`: ข้อมูลแค็ตตาล็อกสินค้าและสต็อกคงเหลือ (รวมสินค้า VIP Pre-Order Collab)
* `arttoy_cart_v2`: รายการสินค้าในตะกร้าปัจจุบัน
* `arttoy_orders_v2`: ประวัติคำสั่งซื้อของลูกค้า พร้อมบันทึกแต้มสะสมที่ได้รับและแต้มที่ใช้
* `arttoy_subscriptions_v2`: ข้อมูลสมาชิก VIP Club, แต้มสะสม Reward Points, และรหัส Referral
* `arttoy_reviews_v2`: รีวิวและคะแนนความพึงพอใจของสินค้า
* `arttoy_admins_v2`: บัญชีผู้ดูแลระบบ
* `arttoy_member_session`: ข้อมูลสมาชิกที่กำลังล็อกอินใช้งานสิทธิ์ในหน้าเว็บ

---

## บัญชีและโค้ดสำหรับทดสอบระบบ (Demo Accounts & Codes)

* **เข้าสู่ระบบผู้ดูแลระบบ (Admin Login)**:
  * URL: [login.html](login.html)
  * Username: `Admin`
  * Password: `1234`
* **โค้ดส่วนลดร้านค้า (Promo Coupon)**:
  * ใส่โค้ด: `ARTTOY10` (รับส่วนลด 10% ทันทีในหน้าตะกร้าหรือ Checkout)
* **รหัสสมาชิก VIP Subscription ตัวอย่าง (ตามรายงาน ITDS294)**:
  * `SUB-202611-1991` (กิตติคุณ อำนาคะ - VIP Monthly ฿199, 150 แต้ม, รหัสชวนเพื่อน: `VIP-KITTIKUN96`)
  * `SUB-202611-1992` (ฐิตารีย์ ชัยชนะ - VIP Monthly ฿199, 350 แต้ม, รหัสชวนเพื่อน: `VIP-THITAREE98`)
  * `SUB-202611-1993` (ธนกฤต ศรีมงคล - VIP Monthly ฿199, สถานะ Paused)
* **รหัสผู้แนะนำสำหรับสมัครสมาชิก (Referral Code)**:
  * `VIP-KITTIKUN96` หรือ `ARTTOY100` (รับส่วนลดค่าสมัครสมาชิกทันที ฿100)

---

## โครงสร้างไดเรกทอรี (Directory Structure)

```text
.
├── index.html                   # หน้าแรกร้านค้า (Home Page พร้อมแบนเนอร์ VIP Prime)
├── search.html                  # หน้ารวมสินค้าและค้นหา (Shop Catalog & VIP Pre-Order)
├── detail.html                  # หน้ารายละเอียดสินค้า (รองรับ VIP Pre-Order 24h)
├── checkout.html                # หน้าชำระเงินสินค้า (ระบบแลกแต้ม Reward Points)
├── order-success.html           # หน้าใบเสร็จยืนยันคำสั่งซื้อ (สรุปสิทธิ์ VIP และแต้มที่ได้)
├── order-tracking.html          # หน้าติดตามสถานะพัสดุ 5 ขั้นตอน (Tracking)
├── subscription.html            # หน้าแพ็กเกจสมาชิก VIP Club (Amazon Prime + Fan Club Model)
├── subscription-checkout.html   # หน้าชำระเงินสมาชิกและใส่รหัส Referral รับส่วนลด ฿100
├── subscription-manage.html     # พอร์ทัลสมาชิก, แลกแต้ม, แชร์รหัสชวนเพื่อน, Line OA
├── login.html                   # หน้าเข้าสู่ระบบผู้ดูแลระบบ (Admin Login)
├── admin-products.html          # จัดการสินค้าและสต็อก (Product Management)
├── admin-orders.html            # จัดการคำสั่งซื้อลูกค้า (Order Management)
├── admin-subscriptions.html     # จัดการสมาชิกระบบ Subscription (Sub Management)
├── admin-users.html             # จัดการบัญชีผู้ดูแลระบบ (User Management)
├── css/
│   └── style.css                # ดีไซน์ Warm Nordic Palette พร้อม Print Stylesheet
├── js/
│   ├── api.js                   # MockDB พร้อมระบบ VIP, Reward Points, Referral
│   ├── cart.js                  # ระบบตะกร้าสินค้า Slide-over Drawer
│   ├── checkout.js              # ตรวจสอบฟอร์มสั่งซื้อ คำนวณส่วนลด VIP และแต้มสะสม
│   ├── search.js                # ระบบค้นหาและตัวกรองตาม URL Parameters
│   ├── detail.js                # ควบคุมสต็อก, สิทธิ์ VIP Pre-Order และรีวิวสินค้า
│   ├── admin-products.js        # CRUD สินค้าและปรับสต็อก
│   ├── admin-orders.js          # จัดการออเดอร์และออกเลขพัสดุ
│   └── admin-users.js           # จัดการบัญชีผู้ใช้แอดมิน
└── assets/
    ├── images/                  # รูปภาพสินค้าและแบนเนอร์
    └── icons/                   # ไอคอน SVG
```

---

## วิธีเปิดใช้งานบน GitHub Pages (Deployment Guide)

1. ไปที่ GitHub Repository: [Lookplatoo/ecom-arttoy](https://github.com/Lookplatoo/ecom-arttoy)
2. คลิกแท็บ **Settings** ด้านบน
3. ที่เมนูด้านซ้าย เลือก **Pages**
4. ในส่วน **Build and deployment > Source**: เลือก `Deploy from a branch`
5. ในส่วน **Branch**: เลือกกิ่ง `main` และโฟลเดอร์ `/ (root)` แล้วกด **Save**
6. รอประมาณ 1-2 นาที ระบบจะเผยแพร่เว็บไซต์ที่: **https://lookplatoo.github.io/ecom-arttoy/**
