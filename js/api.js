/**
 * api.js - Standalone Client-Side Mock Database & Web Service Connector
 * รองรับทั้งโหมด Standalone Prototype (ไม่ต้องเปิด Backend) และ Web Services REST API
 */

const API_BASE_URL = 'http://localhost:3000/api';

// ==============================================================================
// Mock Data Storage Engine (localStorage) สำหรับโหมด Standalone Prototype
// ==============================================================================
const STORAGE_KEYS = {
  PRODUCTS: 'arttoy_products_v2',
  ADMINS: 'arttoy_admins_v2',
  CART: 'arttoy_cart_v2',
  ORDERS: 'arttoy_orders_v2',
  REVIEWS: 'arttoy_reviews_v2',
  SUBSCRIPTIONS: 'arttoy_subscriptions_v2'
};

const DEFAULT_PRODUCTS = [
  {
    id: 'CHIWA-01',
    name: 'น้องจี้คาวะ (Chiikawa)',
    category: 'Chiikawa',
    status: 'Available',
    price: 500.00,
    description: 'ฟิกเกอร์ Chiikawa ความสูงประมาณ 7 ซม. ผลิตจากวัสดุไวนิล ลิขสิทธิ์แท้จากอาจารย์ Nagano ตัวนุ่มนิ่มสุดน่ารัก เหมาะสำหรับตั้งโชว์บนโต๊ะทำงาน',
    image: 'assets/images/chiikawa.png',
    reference: 'https://chiikawa.fandom.com/wiki/Chiikawa',
    stock: 15,
    rating: 4.9,
    reviewCount: 42,
    badge: 'Best Seller',
    isFeatured: true
  },
  {
    id: 'HACHI-01',
    name: 'น้องฮาจิวาเระ (Hachiware)',
    category: 'Blind Box',
    status: 'Available',
    price: 520.00,
    description: 'ฟิกเกอร์ Hachiware แมวสีขาวฟ้าพร้อมดาบคู่ใจ ความสูงประมาณ 7 ซม. ผลิตจากวัสดุไวนิล ลิขสิทธิ์แท้ เพื่อนแท้ผู้มองโลกในแง่ดีและพึ่งพาได้เสมอ',
    image: 'assets/images/hachiware.png',
    reference: 'https://chiikawa.fandom.com/wiki/Hachiware',
    stock: 12,
    rating: 4.8,
    reviewCount: 35,
    badge: 'Popular',
    isFeatured: true
  },
  {
    id: 'USAGI-01',
    name: 'น้องอุซางิ (Usagi)',
    category: 'Limited Edition',
    status: 'Available',
    price: 550.00,
    description: 'ฟิกเกอร์ Usagi กระต่ายหูยาวสีเหลืองถือคฑาเวทมนตร์ ความสูงประมาณ 8 ซม. ผลิตจากวัสดุไวนิล ลิขสิทธิ์แท้ พลังงานล้นเหลือ ร้อง ยะฮา! ตลอดเวลา',
    image: 'assets/images/usagi.png',
    reference: 'https://chiikawa.fandom.com/wiki/Usagi',
    stock: 8,
    rating: 5.0,
    reviewCount: 58,
    badge: 'Limited',
    isFeatured: true
  },
  {
    id: 'MOMON-01',
    name: 'น้องโมมอนกะ (Momonga)',
    category: 'Blind Box',
    status: 'Pre-Order',
    price: 590.00,
    description: 'ฟิกเกอร์ Momonga กระรอกบินหางฟูสีฟ้าขาว ความสูงประมาณ 7 ซม. ผลิตจากวัสดุไวนิล ลิขสิทธิ์แท้ สายแบ๊วผู้ชอบเรียกร้องความสนใจและความเอ็นดู',
    image: 'assets/images/momonga.png',
    reference: 'https://chiikawa.fandom.com/wiki/Momonga',
    stock: 20,
    rating: 4.7,
    reviewCount: 19,
    badge: 'Pre-Order',
    isFeatured: true
  },
  {
    id: 'KURIM-01',
    name: 'น้องคุริมังจู (Kurimanju)',
    category: 'Custom Toy',
    status: 'Available',
    price: 620.00,
    description: 'ฟิกเกอร์ Kurimanju พี่ใหญ่สายชิลพร้อมแก้วเครื่องดื่ม ความสูงประมาณ 7.5 ซม. ผลิตจากวัสดุไวนิล ลิขสิทธิ์แท้ ผู้มีรสนิยมลุ่มลึกและรักความสงบ',
    image: 'assets/images/kurimanju.png',
    reference: 'https://chiikawa.fandom.com/wiki/Kuri-Manj%C5%AB',
    stock: 6,
    rating: 4.9,
    reviewCount: 28,
    badge: 'Rare',
    isFeatured: false
  },
  {
    id: 'RAKKO-01',
    name: 'คุณรักโกะ (Rakko)',
    category: 'Action Figure',
    status: 'Out of Stock',
    price: 690.00,
    description: 'ฟิกเกอร์ Rakko ตัวนากนักล่าระดับแนวหน้าพร้อมดาบผู้กล้า ความสูงประมาณ 8.5 ซม. ผลิตจากวัสดุไวนิล ลิขสิทธิ์แท้ สุดยอดฝีมือการต่อสู้อันดับหนึ่ง',
    image: 'assets/images/rakko.png',
    reference: 'https://chiikawa.fandom.com/wiki/Rakko',
    stock: 0,
    rating: 5.0,
    reviewCount: 63,
    badge: 'Sold Out',
    isFeatured: false
  }
];

const DEFAULT_ADMINS = [
  { username: 'Admin', password: '1234', firstName: 'Admin', lastName: 'System', email: 'admin@arttoy.local', role: 'Super Admin' },
  { username: 'Lookplatoo', password: 'admin1234', firstName: 'Kittikun', lastName: 'Amnaka', email: 'lookplatoo@gmail.com', role: 'Admin' },
  { username: 'tanakrit_n', password: 'editor1234', firstName: 'Tanakrit', lastName: 'Nguansala', email: 'tanakrit.ngu@student.mahidol.ac.th', role: 'Editor' }
];

const DEFAULT_REVIEWS = {
  'CHIWA-01': [
    { id: 1, name: 'แพรวา ส.', rating: 5, date: '2 วันที่แล้ว', comment: 'น้องน่ารักมากกก ของแท้ 100% ตัวจริงงานเนียนกริบ แพ็คบับเบิ้ลมาหนาแน่น กล่องคมกริบเลยค่ะ!', verified: true },
    { id: 2, name: 'ธนวัฒน์ พ.', rating: 5, date: '1 สัปดาห์ที่แล้ว', comment: 'จัดส่งไวมาก สั่งเมื่อวาน วันนี้ได้รับแล้ว สินค้าตรงปก รายละเอียดสวยงาม คุ้มค่าเงินครับ', verified: true },
    { id: 3, name: 'May May', rating: 4.8, date: '2 สัปดาห์ที่แล้ว', comment: 'ตั้งไว้ที่โต๊ะทำงานแล้วฮีลใจสุดๆ แนะนำแฟนคลับ Chiikawa ต้องมีติดบ้านไว้เลย', verified: true }
  ],
  'USAGI-01': [
    { id: 4, name: 'กมลวรรณ ท.', rating: 5, date: '3 วันที่แล้ว', comment: 'อุซางิตัวจริงน่ารักมากกก ถือคฑาแล้วเสียง ยะฮา! ลอยมาเลยค่ะ ประทับใจมาก', verified: true }
  ],
  'HACHI-01': [
    { id: 5, name: 'ธีรเดช บ.', rating: 5, date: '5 วันที่แล้ว', comment: 'น้องฮาจิวาเระตัวโปรด งานคุณภาพมาก ลิขสิทธิ์แท้แน่นอน จัดส่งรวดเร็วครับ', verified: true }
  ]
};

const DEFAULT_ORDERS = [
  {
    orderId: 'AT-20261118-8421',
    createdAt: '2026-11-18 10:15',
    customer: {
      fullName: 'คุณณิชา วงศ์สวัสดิ์',
      phone: '089-123-4567',
      address: '123/45 ถนนพญาไท แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพมหานคร 10400',
      note: 'ฝากไว้ที่ป้อม รปภ. ได้เลยค่ะ'
    },
    items: [
      { id: 'CHIWA-01', name: 'น้องจี้คาวะ (Chiikawa)', price: 500, qty: 1, image: 'assets/images/chiikawa.png' }
    ],
    shippingMethod: 'Flash Express',
    shippingCost: 40,
    discountAmount: 50,
    couponCode: 'ARTTOY10',
    totalAmount: 490.00,
    paymentMethod: 'PromptPay QR',
    status: 'Shipped',
    trackingNumber: 'FLASH-TH92841029'
  },
  {
    orderId: 'AT-20261118-9102',
    createdAt: '2026-11-18 13:40',
    customer: {
      fullName: 'คุณศุภกร เจริญสุข',
      phone: '081-987-6543',
      address: '88/12 ถนนสุขุมวิท 55 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110',
      note: 'โทรแจ้งก่อนส่ง'
    },
    items: [
      { id: 'USAGI-01', name: 'น้องอุซางิ (Usagi)', price: 550, qty: 1, image: 'assets/images/usagi.png' },
      { id: 'HACHI-01', name: 'น้องฮาจิวาเระ (Hachiware)', price: 520, qty: 1, image: 'assets/images/hachiware.png' }
    ],
    shippingMethod: 'Standard Free Shipping',
    shippingCost: 0,
    discountAmount: 0,
    couponCode: '',
    totalAmount: 1070.00,
    paymentMethod: 'Credit Card',
    status: 'Paid',
    trackingNumber: '-'
  }
];

const DEFAULT_SUBSCRIPTIONS = [
  {
    subId: 'SUB-202611-8842',
    planId: 'collector',
    planName: 'Collector Box',
    cycle: 'monthly',
    price: 750,
    startDate: '2026-11-01',
    nextBillingDate: '2026-12-01',
    nextDeliveryDate: '2026-12-05',
    status: 'Active',
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    customer: {
      fullName: 'คุณพิมพ์มาดา รัตนกุล',
      phone: '082-345-6789',
      address: '456/78 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร 10400',
      note: 'วางไว้ในตู้รับพัสดุหน้าบ้าน'
    },
    deliveries: [
      {
        month: 'พฤศจิกายน 2026',
        theme: 'Chiikawa & Friends Forest Adventure',
        items: ['Chiikawa Vinyl Figure Vol.2', 'Hachiware Charm Limited'],
        status: 'Delivered',
        trackingNumber: 'FLASH-TH88294101',
        shippedDate: '2026-11-05'
      }
    ]
  },
  {
    subId: 'SUB-202611-9214',
    planId: 'secret-master',
    planName: 'Secret Master',
    cycle: 'quarterly',
    price: 3890,
    startDate: '2026-10-15',
    nextBillingDate: '2027-01-15',
    nextDeliveryDate: '2026-12-05',
    status: 'Active',
    paymentMethod: 'PromptPay Recurring',
    customer: {
      fullName: 'คุณวรวุฒิ ศรีสวัสดิ์',
      phone: '089-876-5432',
      address: '12/9 หมู่บ้านกรีนวิลล์ ซอยรามคำแหง 118 แขวงสะพานสูง เขตสะพานสูง กรุงเทพฯ 10240',
      note: 'โทรแจ้งก่อนนำส่ง 15 นาที'
    },
    deliveries: [
      {
        month: 'ตุลาคม 2026',
        theme: 'Halloween Ghost Night Special',
        items: ['Momonga Flying Squirrel Special', 'Kurimanju Sake Bar Edition', 'Secret Chaser Acrylic Stand'],
        status: 'Delivered',
        trackingNumber: 'EMS-TH77192834',
        shippedDate: '2026-10-20'
      },
      {
        month: 'พฤศจิกายน 2026',
        theme: 'Autumn Warmth & Sweets',
        items: ['Usagi Magic Wand Deluxe', 'Rakko Coffee Break Vinyl', 'Exclusive Hologram Pin'],
        status: 'Shipped',
        trackingNumber: 'FLASH-TH99120394',
        shippedDate: '2026-11-05'
      }
    ]
  },
  {
    subId: 'SUB-202611-7301',
    planId: 'starter',
    planName: 'Starter Box',
    cycle: 'monthly',
    price: 390,
    startDate: '2026-09-01',
    nextBillingDate: '2026-12-01',
    nextDeliveryDate: '2026-12-05',
    status: 'Paused',
    paymentMethod: 'TrueMoney Auto-Debit',
    customer: {
      fullName: 'คุณปิยะธิดา เมธีกุล',
      phone: '085-111-2233',
      address: '77 อาคารเอสวีซิตี้ ถนนพระราม 3 แขวงบางโพงพาง เขตยานนาวา กรุงเทพฯ 10120',
      note: 'ฝากที่นิติบุคคลคอนโด'
    },
    deliveries: [
      {
        month: 'กันยายน 2026',
        theme: 'Welcome to Art Toy World',
        items: ['Chiikawa Classic Standing Figure'],
        status: 'Delivered',
        trackingNumber: 'FLASH-TH66291044',
        shippedDate: '2026-09-05'
      },
      {
        month: 'ตุลาคม 2026',
        theme: 'Cute & Energetic Party',
        items: ['Hachiware Sword Pose Figure'],
        status: 'Delivered',
        trackingNumber: 'FLASH-TH77382910',
        shippedDate: '2026-10-05'
      }
    ]
  }
];

// ฟังก์ชันสร้าง Mock Storage เมื่อเริ่มต้น
const MockDB = {
  init: function () {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(DEFAULT_ADMINS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
  },

  // 1. ดึงรายการสินค้า
  getProducts: function (filters = {}) {
    this.init();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');

    if (filters.name) {
      const q = filters.name.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    if (filters.category) {
      list = list.filter(p => p.category === filters.category);
    }
    if (filters.status) {
      list = list.filter(p => p.status === filters.status);
    }
    if (filters.min_price !== undefined && filters.min_price !== '') {
      list = list.filter(p => Number(p.price) >= Number(filters.min_price));
    }
    if (filters.max_price !== undefined && filters.max_price !== '') {
      list = list.filter(p => Number(p.price) <= Number(filters.max_price));
    }
    return list;
  },

  // 2. ดึงสินค้ารายชิ้น
  getProductById: function (id) {
    this.init();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    return list.find(p => p.id === id) || null;
  },

  // 3. เพิ่มสินค้า
  addProduct: function (productData) {
    this.init();
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    if (list.some(p => p.id === productData.id)) {
      return { success: false, message: `รหัสสินค้า ${productData.id} มีอยู่ในระบบแล้ว` };
    }
    const newProduct = {
      ...productData,
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 10,
      rating: 5.0,
      reviewCount: 0,
      badge: productData.status === 'Available' ? 'New' : productData.status
    };
    list.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    return { success: true, message: 'เพิ่มสินค้าเรียบร้อยแล้ว', data: newProduct };
  },

  // 4. แก้ไขสินค้า
  updateProduct: function (id, updatedFields) {
    this.init();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const index = list.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, message: 'ไม่พบสินค้าที่ต้องการแก้ไข' };
    }
    list[index] = { ...list[index], ...updatedFields };
    if (updatedFields.price !== undefined) list[index].price = Number(updatedFields.price);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    return { success: true, message: 'แก้ไขข้อมูลสินค้าสำเร็จ', data: list[index] };
  },

  // 5. ลบสินค้า
  deleteProduct: function (id) {
    this.init();
    let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const initialLen = list.length;
    list = list.filter(p => p.id !== id);
    if (list.length === initialLen) {
      return { success: false, message: 'ไม่พบสินค้าที่ต้องการลบ' };
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    return { success: true, message: 'ลบสินค้าเรียบร้อยแล้ว' };
  },

  // 6. ตรวจสอบและจัดการแอดมิน
  loginAdmin: function (username, password) {
    this.init();
    const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    const user = admins.find(a => a.username.toLowerCase() === username.toLowerCase() && a.password === password);
    if (user) {
      return {
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      };
    }
    return { success: false, message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' };
  },

  getUsers: function (filters = {}) {
    this.init();
    let admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    if (filters.role) {
      admins = admins.filter(a => a.role === filters.role);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      admins = admins.filter(a =>
        a.username.toLowerCase().includes(q) ||
        (a.firstName && a.firstName.toLowerCase().includes(q)) ||
        (a.lastName && a.lastName.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q))
      );
    }
    return admins;
  },

  getUserByUsername: function (username) {
    this.init();
    const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    return admins.find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
  },

  addUser: function (userData) {
    this.init();
    const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    if (admins.some(a => a.username.toLowerCase() === userData.username.toLowerCase())) {
      return { success: false, message: `ชื่อผู้ใช้งาน ${userData.username} มีอยู่ในระบบแล้ว` };
    }
    admins.push(userData);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    return { success: true, message: 'เพิ่มบัญชีผู้ดูแลระบบสำเร็จ', data: userData };
  },

  updateUser: function (username, updatedFields) {
    this.init();
    let admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    const idx = admins.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
    if (idx === -1) return { success: false, message: 'ไม่พบบัญชีผู้ใช้' };
    admins[idx] = { ...admins[idx], ...updatedFields };
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    return { success: true, message: 'แก้ไขข้อมูลผู้ดูแลระบบสำเร็จ', data: admins[idx] };
  },

  deleteUser: function (username) {
    this.init();
    let admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    admins = admins.filter(a => a.username.toLowerCase() !== username.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    return { success: true, message: 'ลบบัญชีผู้ดูแลระบบเรียบร้อยแล้ว' };
  },

  // 7. จัดการตะกร้าสินค้า (Cart)
  getCart: function () {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  },

  addToCart: function (productId, qty = 1) {
    this.init();
    const product = this.getProductById(productId);
    if (!product) return { success: false, message: 'ไม่พบสินค้า' };
    if (product.status === 'Out of Stock') return { success: false, message: 'ขออภัย สินค้านี้หมดชั่วคราว' };

    let cart = this.getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        category: product.category,
        qty: qty
      });
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return { success: true, cart: cart, message: `เพิ่ม "${product.name}" ลงในตะกร้าแล้ว` };
  },

  updateCartQty: function (productId, qty) {
    this.init();
    let cart = this.getCart();
    if (qty <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(i => i.id === productId);
      if (item) item.qty = qty;
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  },

  removeFromCart: function (productId) {
    this.init();
    let cart = this.getCart().filter(i => i.id !== productId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
  },

  clearCart: function () {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  },

  // 8. จัดการคำสั่งซื้อ (Orders)
  getOrders: function () {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
  },

  getOrderById: function (orderId) {
    this.init();
    const orders = this.getOrders();
    return orders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase()) || null;
  },

  createOrder: function (orderData) {
    this.init();
    const orders = this.getOrders();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const newOrderId = `AT-${dateStr}-${randomHex}`;

    const newOrder = {
      orderId: newOrderId,
      createdAt: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`,
      ...orderData,
      status: orderData.paymentMethod === 'Cash on Delivery' ? 'Processing' : 'Paid',
      trackingNumber: '-'
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();
    return { success: true, order: newOrder };
  },

  updateOrderStatus: function (orderId, newStatus, trackingNo = null) {
    this.init();
    let orders = this.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return { success: false, message: 'ไม่พบออเดอร์' };

    order.status = newStatus;
    if (trackingNo !== null) order.trackingNumber = trackingNo;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return { success: true, order: order };
  },

  // 9. รีวิวสินค้า (Reviews)
  getReviews: function (productId) {
    this.init();
    const reviewsMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
    return reviewsMap[productId] || [];
  },

  addReview: function (productId, review) {
    this.init();
    const reviewsMap = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '{}');
    if (!reviewsMap[productId]) reviewsMap[productId] = [];
    const newRev = {
      id: Date.now(),
      name: review.name || 'ผู้ซื้อที่ไม่ประสงค์ออกนาม',
      rating: Number(review.rating) || 5,
      date: 'เมื่อสักครู่',
      comment: review.comment || '',
      verified: true
    };
    reviewsMap[productId].unshift(newRev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviewsMap));

    // อัปเดตรีวิวเฉลี่ยใน Product
    const p = this.getProductById(productId);
    if (p) {
      const allRevs = reviewsMap[productId];
      const avg = allRevs.reduce((sum, r) => sum + r.rating, 0) / allRevs.length;
      this.updateProduct(productId, { rating: Number(avg.toFixed(1)), reviewCount: allRevs.length });
    }
    return { success: true, review: newRev };
  },

  // 10. ระบบสมาชิกกล่องสุ่มรายเดือน (Subscriptions)
  getSubscriptions: function (filters = {}) {
    this.init();
    let subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS) || '[]');
    if (filters.status) {
      subs = subs.filter(s => s.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.planId) {
      subs = subs.filter(s => s.planId.toLowerCase() === filters.planId.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      subs = subs.filter(s =>
        s.subId.toLowerCase().includes(q) ||
        (s.customer && s.customer.fullName.toLowerCase().includes(q)) ||
        (s.customer && s.customer.phone.includes(q))
      );
    }
    return subs;
  },

  getSubscriptionById: function (subId) {
    this.init();
    const subs = this.getSubscriptions();
    return subs.find(s => s.subId.toLowerCase() === subId.toLowerCase()) || null;
  },

  createSubscription: function (subData) {
    this.init();
    const subs = this.getSubscriptions();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newSubId = `SUB-${dateStr}-${randomHex}`;

    // คำนวณวันรอบบิลถัดไป (1 เดือน หรือ 3 เดือน)
    const nextBill = new Date(now);
    if (subData.cycle === 'quarterly') {
      nextBill.setMonth(nextBill.getMonth() + 3);
    } else {
      nextBill.setMonth(nextBill.getMonth() + 1);
    }

    // วันจัดส่งกล่องรอบถัดไป (วันที่ 5 ของเดือนหน้า)
    const nextDelivery = new Date(now.getFullYear(), now.getMonth() + 1, 5);

    const newSub = {
      subId: newSubId,
      planId: subData.planId,
      planName: subData.planName,
      cycle: subData.cycle || 'monthly',
      price: Number(subData.price) || 0,
      startDate: now.toISOString().slice(0, 10),
      nextBillingDate: nextBill.toISOString().slice(0, 10),
      nextDeliveryDate: nextDelivery.toISOString().slice(0, 10),
      status: 'Active',
      paymentMethod: subData.paymentMethod || 'Credit Card',
      customer: subData.customer || {},
      deliveries: []
    };

    subs.unshift(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    return { success: true, subscription: newSub };
  },

  updateSubscriptionStatus: function (subId, newStatus) {
    this.init();
    let subs = this.getSubscriptions();
    const sub = subs.find(s => s.subId === subId);
    if (!sub) return { success: false, message: 'ไม่พบข้อมูลสมาชิก' };

    sub.status = newStatus;
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    return { success: true, subscription: sub };
  },

  updateSubscriptionAddress: function (subId, newAddress, newPhone = null, newNote = null) {
    this.init();
    let subs = this.getSubscriptions();
    const sub = subs.find(s => s.subId === subId);
    if (!sub) return { success: false, message: 'ไม่พบข้อมูลสมาชิก' };

    if (!sub.customer) sub.customer = {};
    sub.customer.address = newAddress;
    if (newPhone) sub.customer.phone = newPhone;
    if (newNote !== null) sub.customer.note = newNote;

    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    return { success: true, subscription: sub };
  },

  addSubscriptionDelivery: function (subId, deliveryInfo) {
    this.init();
    let subs = this.getSubscriptions();
    const sub = subs.find(s => s.subId === subId);
    if (!sub) return { success: false, message: 'ไม่พบข้อมูลสมาชิก' };

    if (!sub.deliveries) sub.deliveries = [];
    const newDelivery = {
      month: deliveryInfo.month || 'เดือนปัจจุบัน',
      theme: deliveryInfo.theme || 'Mystery Box Collection',
      items: deliveryInfo.items || ['Art Toy Mystery Figure'],
      status: deliveryInfo.status || 'Shipped',
      trackingNumber: deliveryInfo.trackingNumber || `FLASH-TH${Math.floor(10000000 + Math.random() * 90000000)}`,
      shippedDate: new Date().toISOString().slice(0, 10)
    };

    sub.deliveries.unshift(newDelivery);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    return { success: true, subscription: sub, delivery: newDelivery };
  }
};

// เริ่มต้น Mock Storage ทันทีที่โหลดสคริปต์
MockDB.init();

// ==============================================================================
// ฟังก์ชันเรียก Web Service แบบ Seamless Fallback
// ==============================================================================
async function callWS(url, method = 'GET', sentData = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200); // 1.2s timeout เพื่อความเร็ว

    const options = {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    };

    if (sentData && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(sentData);
    }

    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const result = await response.json();
    return result;
  } catch (error) {
    // เซิร์ฟเวอร์ไม่ตอบสนอง ให้สลับเป็น Standalone Mock Mode เงียบๆ
    return null;
  }
}

/**
 * Service API Module - ผสานการทำงานทั้ง Web Service และ MockDB อัตโนมัติ
 */
const ApiService = {
  // 1. ตรวจสอบการเข้าสู่ระบบ
  login: async function (username, password) {
    const wsResult = await callWS(`${API_BASE_URL}/auth/login`, 'POST', { username, password });
    if (wsResult && wsResult.success) return wsResult;
    // Fallback: Mock DB
    return MockDB.loginAdmin(username, password);
  },

  // 2. ดึงรายการสินค้า
  getProducts: async function (filters = {}) {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);

    const query = params.toString() ? '?' + params.toString() : '';
    const wsResult = await callWS(`${API_BASE_URL}/products${query}`, 'GET');
    if (wsResult && !wsResult.error && wsResult.data) {
      return wsResult.data;
    }
    // Fallback: Mock DB
    return MockDB.getProducts(filters);
  },

  // 3. ดึงสินค้าตาม ID
  getProductById: async function (id) {
    const wsResult = await callWS(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, 'GET');
    if (wsResult && !wsResult.error && wsResult.data) {
      return wsResult.data;
    }
    // Fallback: Mock DB
    return MockDB.getProductById(id);
  },

  // 4. เพิ่มสินค้า
  addProduct: async function (productData) {
    const wsResult = await callWS(`${API_BASE_URL}/products`, 'POST', productData);
    if (wsResult && !wsResult.error) {
      MockDB.addProduct(productData); // ซิงค์กับ mock ไว้ด้วย
      return wsResult;
    }
    // Fallback: Mock DB
    return MockDB.addProduct(productData);
  },

  // 5. แก้ไขสินค้า
  updateProduct: async function (id, updatedFields) {
    const wsResult = await callWS(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, 'PUT', updatedFields);
    if (wsResult && !wsResult.error) {
      MockDB.updateProduct(id, updatedFields);
      return wsResult;
    }
    // Fallback: Mock DB
    return MockDB.updateProduct(id, updatedFields);
  },

  // 6. ลบสินค้า
  deleteProduct: async function (id) {
    const wsResult = await callWS(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, 'DELETE');
    if (wsResult && !wsResult.error) {
      MockDB.deleteProduct(id);
      return wsResult;
    }
    // Fallback: Mock DB
    return MockDB.deleteProduct(id);
  },

  // 7. จัดการ Cart
  getCart: () => MockDB.getCart(),
  addToCart: (id, qty = 1) => MockDB.addToCart(id, qty),
  updateCartQty: (id, qty) => MockDB.updateCartQty(id, qty),
  removeFromCart: (id) => MockDB.removeFromCart(id),
  clearCart: () => MockDB.clearCart(),

  // 8. จัดการ Orders
  getOrders: () => MockDB.getOrders(),
  getOrderById: (orderId) => MockDB.getOrderById(orderId),
  createOrder: (orderData) => MockDB.createOrder(orderData),
  updateOrderStatus: (orderId, status, trackingNo) => MockDB.updateOrderStatus(orderId, status, trackingNo),

  // 9. จัดการ Reviews
  getReviews: (productId) => MockDB.getReviews(productId),
  addReview: (productId, review) => MockDB.addReview(productId, review),

  // 10. จัดการ User Accounts (Admins)
  getUsers: async function (filters = {}) {
    const wsResult = await callWS(`${API_BASE_URL}/users`, 'GET');
    if (wsResult && !wsResult.error && wsResult.data) return wsResult.data;
    return MockDB.getUsers(filters);
  },

  getUserByUsername: async function (username) {
    const wsResult = await callWS(`${API_BASE_URL}/users/${encodeURIComponent(username)}`, 'GET');
    if (wsResult && !wsResult.error && wsResult.data) return wsResult.data;
    return MockDB.getUserByUsername(username);
  },

  addUser: async function (userData) {
    const wsResult = await callWS(`${API_BASE_URL}/users`, 'POST', userData);
    if (wsResult && !wsResult.error) {
      MockDB.addUser(userData);
      return wsResult;
    }
    return MockDB.addUser(userData);
  },

  updateUser: async function (username, updatedFields) {
    const wsResult = await callWS(`${API_BASE_URL}/users/${encodeURIComponent(username)}`, 'PUT', updatedFields);
    if (wsResult && !wsResult.error) {
      MockDB.updateUser(username, updatedFields);
      return wsResult;
    }
    return MockDB.updateUser(username, updatedFields);
  },

  deleteUser: async function (username) {
    const wsResult = await callWS(`${API_BASE_URL}/users/${encodeURIComponent(username)}`, 'DELETE');
    if (wsResult && !wsResult.error) {
      MockDB.deleteUser(username);
      return wsResult;
    }
    return MockDB.deleteUser(username);
  },

  // 7. จัดการสมาชิกกล่องสุ่มรายเดือน (Subscription Management)
  getSubscriptions: function (filters = {}) {
    return MockDB.getSubscriptions(filters);
  },
  getSubscriptionById: function (subId) {
    return MockDB.getSubscriptionById(subId);
  },
  createSubscription: function (subData) {
    return MockDB.createSubscription(subData);
  },
  updateSubscriptionStatus: function (subId, newStatus) {
    return MockDB.updateSubscriptionStatus(subId, newStatus);
  },
  updateSubscriptionAddress: function (subId, newAddress, newPhone = null, newNote = null) {
    return MockDB.updateSubscriptionAddress(subId, newAddress, newPhone, newNote);
  },
  addSubscriptionDelivery: function (subId, deliveryInfo) {
    return MockDB.addSubscriptionDelivery(subId, deliveryInfo);
  }
};

/**
 * ฟังก์ชันแจ้งเตือนข้อความ (Toast Notification)
 */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-message toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === 'error' ? '✕' : '✓'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

// ผูกเข้ากับ window สำหรับเรียกใช้ข้ามไฟล์
window.MockDB = MockDB;
window.callWS = callWS;
window.ApiService = ApiService;
window.showToast = showToast;
