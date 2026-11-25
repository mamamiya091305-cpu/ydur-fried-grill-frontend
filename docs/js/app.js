const ROLE_NAMES = {
  admin: 'Administrator',
  cashier: 'Cashier',
  kitchen: 'Kitchen Staff'
};

const ROLE_AVATARS = {
  admin: '../admin.png',
  cashier: '../cashier.png',
  kitchen: '../kitchen.png'
};

const NAVIGATION = {
  admin: [
    ['dashboard', 'Dashboard', '▦'],
    ['orders', 'Orders', '▤'],
    ['kitchen', 'Kitchen Monitoring', '♨'],
    ['menu', 'Menu Management', '☷'],
    ['pos', 'POS / Sales', '₱'],
    ['inventory', 'Inventory Management', '▣'],
    ['staff', 'Staff / User Management', '♙'],
    ['settings', 'Settings', '⚙']
  ],
  cashier: [
    ['dashboard', 'Dashboard', '▦'],
    ['new-order', 'New Order', '＋'],
    ['order-history', 'Order History', '▤'],
    ['pos', 'POS / Sales', '₱'],
    ['menu', 'Menu / View Products', '☷']
  ],
  kitchen: [
    ['dashboard', 'Dashboard', '▦'],
    ['incoming', 'Incoming Orders', '▤'],
    ['preparing', 'Preparing Orders', '♨'],
    ['completed', 'Complete Orders', '✓']
  ]
};

const STORAGE_KEYS = {
  products: 'ydurProducts',
  transactions: 'ydurTransactions',
  confirmedProductsSeeded: 'ydurConfirmedProductsSeededV1',
  mainMenuSetupSeeded: 'ydurMainMenuSetupSeededV1'
};
const LOGIN_INTRO_SESSION_KEY = 'ydurLoginIntroPlayed';

const LEGACY_DEMO_PRODUCT_IDS = new Set([
  'demo-chicken',
  'demo-bbq',
  'demo-seafood',
  'demo-fries',
  'demo-iced-tea'
]);
const PROVIDED_MENU_IMAGES = {
  'pika-pika': 'pika_pika.png',
  fishball: 'fishball.png',
  kikiam: 'kikiam.png',
  'french fries': 'french_fries.png',
  pompano: 'pompano.png',
  panga: 'panga.png',
  'fried chicken': 'fried_chicken.png',
  'chicken bbq': 'chicken_bbq.png',
  'tuna kinilaw': 'tuna_kinilaw.png',
  'fried hito': 'fried_hito.png',
  'fried siomai': 'fried_siomai.png',
  calamares: 'calamares.png',
  'tuna sisig': 'tuna_sisig.png',
  'fried bangus': 'fried_bangus.png',
  'chicken skin': 'chicken_skin.png'
};
const LANDSCAPE_MENU_IMAGES = new Set([
  'fried_siomai.png',
  'calamares.png',
  'tuna_sisig.png',
  'fried_bangus.png',
  'chicken_skin.png'
]);
const MAIN_MENU_PRODUCT_NAMES = [
  'Tuna Kinilaw',
  'Chicken BBQ',
  'Fried Chicken',
  'Panga',
  'Pompano',
  'French Fries',
  'Kikiam',
  'Fishball',
  'Pika-Pika',
  'Fried Hito',
];
const SPECIAL_MENU_PRODUCT_NAMES = [
  'Tuna Sisig',
  'Calamares',
  'Fried Siomai',
  'Chicken Skin',
  'Fried Bangus'
];
const MAIN_MENU_PRODUCT_NAME_SET = new Set(MAIN_MENU_PRODUCT_NAMES.map(name => name.toLowerCase()));
const SPECIAL_MENU_PRODUCT_NAME_SET = new Set(SPECIAL_MENU_PRODUCT_NAMES.map(name => name.toLowerCase()));
const PROVIDED_MENU_PRODUCT_NAMES = MAIN_MENU_PRODUCT_NAMES.concat(SPECIAL_MENU_PRODUCT_NAMES);
const MAIN_MENU_SETUP_PRODUCTS = [
  { id: 'main-menu-tuna-kinilaw', name: 'Tuna Kinilaw', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-chicken-bbq', name: 'Chicken BBQ', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-fried-chicken', name: 'Fried Chicken', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-panga', name: 'Panga', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-pompano', name: 'Pompano', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-french-fries', name: 'French Fries', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-kikiam', name: 'Kikiam', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-fishball', name: 'Fishball', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-pika-pika', name: 'Pika-Pika', category: '', description: '', price: null, isAvailable: false },
  { id: 'main-menu-fried-hito', name: 'Fried Hito', category: '', description: '', price: null, isAvailable: false }
];
const USER_CONFIRMED_MENU_PRODUCTS = [
  { id: 'provided-tuna-sisig', name: 'Tuna Sisig', category: '', description: '', price: 150, isAvailable: true },
  { id: 'provided-calamares', name: 'Calamares', category: '', description: '', price: 250, isAvailable: true },
  { id: 'provided-fried-siomai', name: 'Fried Siomai', category: '', description: '', price: 80, isAvailable: true },
  { id: 'provided-chicken-skin', name: 'Chicken Skin', category: '', description: '', price: 99, isAvailable: true },
  { id: 'provided-fried-bangus', name: 'Fried Bangus', category: '', description: '', price: 180, isAvailable: true }
];

function spectatorTimestamp(hour, minute) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

const SPECTATOR_DATA = {
  products: MAIN_MENU_SETUP_PRODUCTS.concat(USER_CONFIRMED_MENU_PRODUCTS).map(product => ({ ...product })),
  orders: [
    {
      id: 'PREVIEW-TODAY-001',
      customer: 'Rina Cruz',
      type: 'Dine-in',
      instructions: '',
      items: [
        { id: 'demo-chicken', name: 'Grilled Chicken', category: 'Grilled', unitPrice: 150, quantity: 2 },
        { id: 'demo-iced-tea', name: 'Iced Tea', category: 'Beverages', unitPrice: 35, quantity: 2 }
      ],
      subtotal: 370,
      total: 370,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      createdAt: spectatorTimestamp(9, 15),
      paidAt: spectatorTimestamp(9, 20)
    },
    {
      id: 'PREVIEW-TODAY-002',
      customer: 'Noah Villanueva',
      type: 'Takeout',
      instructions: 'Extra sauce',
      items: [
        { id: 'demo-bbq', name: 'Pork BBQ', category: 'Grilled', unitPrice: 120, quantity: 3 },
        { id: 'demo-fries', name: 'French Fries', category: 'Sides', unitPrice: 80, quantity: 1 }
      ],
      subtotal: 440,
      total: 440,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'GCash',
      createdAt: spectatorTimestamp(9, 42),
      paidAt: spectatorTimestamp(9, 47)
    },
    {
      id: 'PREVIEW-TODAY-003',
      customer: 'Lia Mendoza',
      type: 'Dine-in',
      instructions: '',
      items: [
        { id: 'demo-seafood', name: 'Grilled Seafood', category: 'Seafood', unitPrice: 180, quantity: 2 },
        { id: 'demo-iced-tea', name: 'Iced Tea', category: 'Beverages', unitPrice: 35, quantity: 2 }
      ],
      subtotal: 430,
      total: 430,
      status: 'Preparing',
      paymentStatus: 'Paid',
      paymentMethod: 'Card',
      createdAt: spectatorTimestamp(10, 8),
      paidAt: spectatorTimestamp(10, 12)
    },
    {
      id: 'PREVIEW-TODAY-004',
      customer: 'Ethan Garcia',
      type: 'Takeout',
      instructions: 'No chili',
      items: [
        { id: 'demo-chicken', name: 'Grilled Chicken', category: 'Grilled', unitPrice: 150, quantity: 1 },
        { id: 'demo-fries', name: 'French Fries', category: 'Sides', unitPrice: 80, quantity: 1 }
      ],
      subtotal: 230,
      total: 230,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      paymentMethod: '',
      createdAt: spectatorTimestamp(10, 25)
    },
    {
      id: 'PREVIEW-TODAY-005',
      customer: 'Mia Flores',
      type: 'Dine-in',
      instructions: '',
      items: [
        { id: 'demo-bbq', name: 'Pork BBQ', category: 'Grilled', unitPrice: 120, quantity: 2 },
        { id: 'demo-iced-tea', name: 'Iced Tea', category: 'Beverages', unitPrice: 35, quantity: 1 }
      ],
      subtotal: 275,
      total: 275,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      createdAt: spectatorTimestamp(10, 38),
      paidAt: spectatorTimestamp(10, 43)
    },
    {
      id: 'PREVIEW-20261121-001',
      customer: 'Alex Rivera',
      type: 'Dine-in',
      instructions: '',
      items: [{ id: 'demo-chicken', name: 'Grilled Chicken', category: 'Grilled', unitPrice: 150, quantity: 2 }],
      subtotal: 300,
      total: 300,
      status: 'Preparing',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      createdAt: '2026-11-21T11:20:00+08:00',
      paidAt: '2026-11-21T11:24:00+08:00'
    },
    {
      id: 'PREVIEW-20261121-002',
      customer: 'Jamie Santos',
      type: 'Takeout',
      instructions: 'No onions',
      items: [
        { id: 'demo-bbq', name: 'Pork BBQ', category: 'Grilled', unitPrice: 120, quantity: 2 },
        { id: 'demo-iced-tea', name: 'Iced Tea', category: 'Beverages', unitPrice: 35, quantity: 1 }
      ],
      subtotal: 275,
      total: 275,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      paymentMethod: '',
      createdAt: '2026-11-21T11:32:00+08:00'
    },
    {
      id: 'PREVIEW-20261121-003',
      customer: 'Morgan Lee',
      type: 'Dine-in',
      instructions: '',
      items: [{ id: 'demo-seafood', name: 'Grilled Seafood', category: 'Seafood', unitPrice: 180, quantity: 1 }],
      subtotal: 180,
      total: 180,
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      createdAt: '2026-11-21T10:48:00+08:00',
      paidAt: '2026-11-21T10:53:00+08:00'
    }
  ],
  sales: [
    { orderId: 'PREVIEW-TODAY-001', method: 'Cash', total: 370, amountReceived: 500, change: 130, paidAt: spectatorTimestamp(9, 20) },
    { orderId: 'PREVIEW-TODAY-002', method: 'GCash', total: 440, amountReceived: 440, change: 0, paidAt: spectatorTimestamp(9, 47) },
    { orderId: 'PREVIEW-TODAY-003', method: 'Card', total: 430, amountReceived: 430, change: 0, paidAt: spectatorTimestamp(10, 12) },
    { orderId: 'PREVIEW-TODAY-005', method: 'Cash', total: 275, amountReceived: 300, change: 25, paidAt: spectatorTimestamp(10, 43) },
    { orderId: 'PREVIEW-20261121-001', method: 'Cash', total: 300, amountReceived: 500, change: 200, paidAt: '2026-11-21T11:24:00+08:00' },
    { orderId: 'PREVIEW-20261121-003', method: 'Cash', total: 180, amountReceived: 200, change: 20, paidAt: '2026-11-21T10:53:00+08:00' }
  ],
  staffAccounts: [
    { id: 901, full_name: 'Taylor Morgan', username: 'preview.cashier', role: 'cashier', is_active: 1, must_change_password: 0, created_at: '2026-10-12T09:00:00+08:00', deletion_block_reason: 'Static preview account.' },
    { id: 902, full_name: 'Jordan Reyes', username: 'preview.kitchen', role: 'kitchen', is_active: 1, must_change_password: 0, created_at: '2026-10-15T09:00:00+08:00', deletion_block_reason: 'Static preview account.' }
  ],
  draftOrder: { id: 'PREVIEW-ORDER-004', customer: 'Sample Guest', type: 'Dine-in', instructions: '', cart: {} }
};

const app = document.getElementById('app');
const staticDemo = window.YDUR_STATIC_DEMO === true;
const params = new URLSearchParams(window.location.search);
const spectatorExit = params.get('spectator_exit') === '1';
const requestedRole = params.get('dashboard');
const serverAuth = window.YDUR_AUTH || { user: null, csrfToken: '', loginError: '', staffAccounts: [], staffMessage: '', staffError: '', temporaryPassword: '', temporaryPasswordUsername: '', spectator: false };
const spectatorMode = serverAuth.spectator === true && params.get('spectator') === '1';
const spectatorRole = NAVIGATION[requestedRole] ? requestedRole : 'admin';
const spectatorRequestedPage = params.get('page');
const auth = spectatorMode
  ? {
      ...serverAuth,
      user: { id: 0, username: 'spectator', name: `${ROLE_NAMES[spectatorRole]} Preview`, role: spectatorRole, must_change_password: 0 },
      csrfToken: '',
      staffAccounts: SPECTATOR_DATA.staffAccounts
    }
  : serverAuth;
let currentUser = auth.user;
let activePage = spectatorMode && NAVIGATION[spectatorRole].some(([page]) => page === spectatorRequestedPage)
  ? spectatorRequestedPage
  : params.get('staff') === '1' ? 'staff' : 'dashboard';
let staffFilter = 'active';
let storageError = '';
let draftOrder = null;
let historySearch = '';
let historyStatus = 'All';
let expandedOrderId = '';
let selectedPosOrderId = '';
let paymentReceived = '';
let lastReceiptOrderId = '';
let dailyOperationsDate = philippinesDateKey();
let dailyOperationsFollowToday = true;
let dailyOperationsData = null;
let dailyOperationsLoading = false;
let dailyOperationsRequest = 0;
let salesHistoryFrom = `${dailyOperationsDate.slice(0, 7)}-01`;
let salesHistoryTo = dailyOperationsDate;
let salesHistoryData = null;
let salesHistoryLoading = false;
let salesHistoryRequest = 0;
let pendingOrderRequestId = '';
let pendingPaymentRequestId = '';
let toastTimer;
let dashboardEventsBound = false;
let dailyOperationsRefreshTimer = null;

function dashboardUrl(role) {
  if (spectatorMode) return spectatorUrl(role, 'dashboard');
  return `${window.location.pathname}?dashboard=${encodeURIComponent(role)}`;
}

function spectatorUrl(role, page) {
  const query = new URLSearchParams({ spectator: '1', dashboard: role, page });
  return `${window.location.pathname}?${query.toString()}`;
}

function blockSpectatorAction() {
  if (!spectatorMode) return false;
  showToast('This feature is disabled in Spectator Mode.');
  return true;
}

function escapeHTML(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function money(amount) {
  const value = Number(amount);
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number.isFinite(value) ? value : 0);
}

function dateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function operationsDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function readStored(key, fallback) {
  if (spectatorMode) return fallback;
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    storageError = `Browser storage could not read ${key}: ${error.message}`;
    return fallback;
  }
}

function writeStored(key, value) {
  if (spectatorMode) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    storageError = '';
    return true;
  } catch (error) {
    storageError = `Browser storage could not save ${key}: ${error.message}`;
    showToast(storageError);
    updateStorageNotice();
    return false;
  }
}

function withoutLegacyDemoProducts(products) {
  return products.filter(product => product && typeof product === 'object' && !Array.isArray(product) && (
    product.demonstration !== true &&
    !LEGACY_DEMO_PRODUCT_IDS.has(String(product.id || ''))
  ));
}

function addMissingMenuProducts(products, productsToAdd) {
  const productIds = new Set(products.map(product => String(product.id || '')));
  const productNames = new Set(products.map(product => String(product.name || '').trim().toLowerCase()));
  const mergedProducts = products.slice();
  productsToAdd.forEach(product => {
    const name = product.name.toLowerCase();
    if (productIds.has(product.id) || productNames.has(name)) return;
    mergedProducts.push({ ...product });
    productIds.add(product.id);
    productNames.add(name);
  });
  return mergedProducts;
}

function initializeMenuData() {
  if (spectatorMode) return;
  let catalogError = '';
  try {
    const confirmedProductsSeeded = readStored(STORAGE_KEYS.confirmedProductsSeeded, false) === true;
    const mainMenuSetupSeeded = readStored(STORAGE_KEYS.mainMenuSetupSeeded, false) === true;
    const productsToSeed = [];
    if (!confirmedProductsSeeded) productsToSeed.push(...USER_CONFIRMED_MENU_PRODUCTS);
    if (!mainMenuSetupSeeded) productsToSeed.push(...MAIN_MENU_SETUP_PRODUCTS);
    const savedProducts = localStorage.getItem(STORAGE_KEYS.products);
    if (savedProducts === null) {
      const initialProducts = addMissingMenuProducts([], productsToSeed);
      if (!writeStored(STORAGE_KEYS.products, initialProducts)) {
        catalogError = storageError;
      } else {
        if (!confirmedProductsSeeded && !writeStored(STORAGE_KEYS.confirmedProductsSeeded, true)) {
          catalogError = storageError;
        }
        if (!catalogError && !mainMenuSetupSeeded && !writeStored(STORAGE_KEYS.mainMenuSetupSeeded, true)) {
          catalogError = storageError;
        }
      }
    } else {
      let products;
      let parsed = false;
      try {
        products = JSON.parse(savedProducts);
        parsed = true;
      } catch (error) {
        catalogError = `Browser storage could not read ${STORAGE_KEYS.products}: ${error.message}`;
      }
      if (parsed && Array.isArray(products)) {
        const retainedProducts = withoutLegacyDemoProducts(products);
        const initializedProducts = addMissingMenuProducts(retainedProducts, productsToSeed);
        const catalogChanged = retainedProducts.length !== products.length || initializedProducts.length !== retainedProducts.length;
        if (catalogChanged && !writeStored(STORAGE_KEYS.products, initializedProducts)) {
          catalogError = storageError;
        } else {
          if (!confirmedProductsSeeded && !writeStored(STORAGE_KEYS.confirmedProductsSeeded, true)) {
            catalogError = storageError;
          }
          if (!catalogError && !mainMenuSetupSeeded && !writeStored(STORAGE_KEYS.mainMenuSetupSeeded, true)) {
            catalogError = storageError;
          }
        }
      } else if (parsed) {
        catalogError = `Saved ${STORAGE_KEYS.products} data is not a valid list. Existing data was left unchanged.`;
      }
    }
    if (localStorage.getItem(STORAGE_KEYS.transactions) === null) {
      writeStored(STORAGE_KEYS.transactions, { orders: [], sales: [] });
    }
    if (catalogError) storageError = catalogError;
  } catch (error) {
    storageError = `Browser storage could not initialize menu data: ${error.message}`;
  }
}

function readCollection(key) {
  const records = readStored(key, []);
  if (!Array.isArray(records)) {
    storageError = `Saved ${key} data is not a valid list. Existing data was left unchanged.`;
    return [];
  }
  return records;
}

function getProducts() {
  if (spectatorMode) return SPECTATOR_DATA.products.map(product => ({ ...product }));
  return readCollection(STORAGE_KEYS.products);
}

function getTransactionData() {
  if (spectatorMode) {
    return {
      orders: SPECTATOR_DATA.orders.map(order => ({ ...order, items: order.items.map(item => ({ ...item })) })),
      sales: SPECTATOR_DATA.sales.map(sale => ({ ...sale }))
    };
  }
  const data = readStored(STORAGE_KEYS.transactions, { orders: [], sales: [] });
  if (!data || !Array.isArray(data.orders) || !Array.isArray(data.sales)) {
    storageError = 'Saved transaction data is invalid. Existing data was left unchanged.';
    return { orders: [], sales: [] };
  }
  return data;
}

function getOrders() {
  return getTransactionData().orders;
}

function getSales() {
  return getTransactionData().sales;
}

function saveOrders(records) {
  if (blockSpectatorAction()) return false;
  if (storageError) {
    showToast(storageError);
    return false;
  }
  const data = getTransactionData();
  return storageError ? false : writeStored(STORAGE_KEYS.transactions, { ...data, orders: records });
}

function saveProducts(records) {
  if (blockSpectatorAction()) return false;
  if (storageError) {
    showToast(storageError);
    return false;
  }
  return writeStored(STORAGE_KEYS.products, records);
}

function saveSales(records) {
  if (blockSpectatorAction()) return false;
  if (storageError) {
    showToast(storageError);
    return false;
  }
  const data = getTransactionData();
  return storageError ? false : writeStored(STORAGE_KEYS.transactions, { ...data, sales: records });
}

function saveTransactions(orders, sales) {
  if (blockSpectatorAction()) return false;
  if (storageError) {
    showToast(storageError);
    return false;
  }
  return writeStored(STORAGE_KEYS.transactions, { orders, sales });
}

function shouldPlayLoginIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return sessionStorage.getItem(LOGIN_INTRO_SESSION_KEY) !== '1';
  } catch (error) {
    console.warn('Unable to read the login intro session flag; playing the intro for this page.', error);
    return true;
  }
}

function markLoginIntroPlayed() {
  try {
    sessionStorage.setItem(LOGIN_INTRO_SESSION_KEY, '1');
  } catch (error) {
    console.warn('Unable to save the login intro session flag; the intro may replay after navigation.', error);
  }
}

function startLoginIntro() {
  const overlay = document.getElementById('brandIntro');
  if (!overlay) return;

  window.setTimeout(() => {
    overlay.remove();
    app.classList.remove('intro-active');
    app.classList.add('intro-finished');
  }, 2300);
  markLoginIntroPlayed();
}

function showLogin() {
  document.title = "YDUR's Fried & Grill | Sign in";
<<<<<<< HEAD
  if (staticDemo) {
    app.innerHTML = `
      <main class="login-layout">
        <section class="login-brand-panel" aria-label="YDUR's Fried & Grill">
          <div class="login-brand">
            <div class="brand-mark" aria-hidden="true">Y</div>
            <div class="brand-copy"><span class="brand-name">YDUR'S</span><span class="brand-subtitle">FRIED &amp; GRILL</span></div>
          </div>
          <div class="login-welcome">
            <p class="eyebrow">RESTAURANT MANAGEMENT</p>
            <h1>Good food.<br>Thoughtful service.</h1>
            <p>Explore the restaurant workspace using browser-only demonstration data.</p>
          </div>
          <p class="login-brand-footer">Fresh from our grill, made for your table.</p>
        </section>
        <section class="login-form-panel">
          <div class="login-card">
            <div class="login-card-brand"><div class="brand-mark" aria-hidden="true">Y</div></div>
            <p class="eyebrow">BROWSER DEMO</p>
            <h2>Choose a workspace</h2>
            <p class="login-intro">This standalone demo does not authenticate staff accounts. Its data is stored in this browser only.</p>
            ${Object.entries(ROLE_NAMES).map(([role, label]) => `<button class="primary-button login-submit" type="button" data-demo-role="${role}">Continue as ${label} <span aria-hidden="true">→</span></button>`).join('')}
            <p class="security-note">For database-backed sign-in, open <a href="index.php">the PHP sign-in page</a> using XAMPP.</p>
          </div>
        </section>
      </main>`;
    app.querySelectorAll('[data-demo-role]').forEach(button => {
      button.addEventListener('click', () => {
        const role = button.dataset.demoRole;
        currentUser = { id: 0, username: `${role}-demo`, name: ROLE_NAMES[role], role };
        activePage = 'dashboard';
        renderDashboard();
      });
    });
    return;
  }

=======
  const playIntro = shouldPlayLoginIntro();
  app.classList.remove('intro-active', 'intro-finished');
  if (playIntro) app.classList.add('intro-active');
>>>>>>> newestbranch
  app.innerHTML = `
    ${playIntro ? `<div class="brand-intro" id="brandIntro" role="dialog" aria-modal="true" aria-label="YDUR's Fried & Grill brand intro">
      <span class="intro-sunset-glow" aria-hidden="true"></span>
      <img class="intro-logo" src="../ydurslogo.jpg" alt="YDUR's Fried &amp; Grill logo" draggable="false">
    </div>` : ''}
    <main class="login-layout">
      <section class="login-brand-panel" aria-label="YDUR's Fried & Grill">
        <div class="login-brand">
          <img class="brand-logo login-logo" src="../ydurslogo.jpg" alt="YDUR's Fried &amp; Grill logo">
          <div class="brand-copy"><span class="brand-name">YDUR'S</span><span class="brand-subtitle">FRIED &amp; GRILL</span></div>
        </div>
        <div class="login-welcome">
          <p class="eyebrow">RESTAURANT MANAGEMENT</p>
          <h1>Good food.<br>Thoughtful service.</h1>
          <p>Welcome to your restaurant workspace. Sign in with your staff account to continue.</p>
        </div>
        <p class="login-brand-footer">Fresh from our grill, made for your table.</p>
      </section>
      <section class="login-form-panel">
        <form class="login-card" id="loginForm" novalidate>
          <div class="login-card-brand"><img class="brand-logo login-card-logo" src="../ydurslogo.jpg" alt="YDUR's Fried &amp; Grill logo"></div>
          <p class="eyebrow">STAFF ACCESS</p>
          <h2>Ydur's Fried Grill Management System</h2>
          <p class="login-intro">Authorized Ydur's Fried Grill employees only. Sign in with the staff account issued to you.</p>
          <div class="login-error" id="loginError" role="alert" aria-live="polite"${auth.loginError ? '' : ' hidden'}>${escapeHTML(auth.loginError)}</div>
          <label class="field-label" for="username">Username</label>
          <input class="form-control" id="username" name="username" autocomplete="username" placeholder="Enter your username" required>
          <label class="field-label" for="password">Password</label>
          <div class="password-field">
            <input class="form-control" id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required>
            <button class="password-toggle" id="passwordToggle" type="button" aria-label="Show password" aria-pressed="false">
              <svg class="password-eye password-eye-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="password-eye password-eye-off" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-2.1 3M6.4 6.4C3.6 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.1-.9"/></svg>
            </button>
          </div>
          <input type="hidden" name="csrf_token" value="${escapeHTML(auth.csrfToken)}">
          <button class="primary-button login-submit" type="submit">Sign in <span aria-hidden="true">→</span></button>
          <p class="security-note">Sign in with the username and password provided for your staff account.</p>
          <a class="spectator-entry" href="index.php?spectator=1">Preview the system in Spectator Mode <span aria-hidden="true">↗</span></a>
        </form>
      </section>
    </main>`;

  const form = document.getElementById('loginForm');
  const password = document.getElementById('password');
  form.method = 'post';
  form.action = 'index.php';
  document.getElementById('passwordToggle').addEventListener('click', event => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    event.currentTarget.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    event.currentTarget.setAttribute('aria-pressed', String(visible));
    event.currentTarget.classList.toggle('is-visible', visible);
    const cursorPosition = password.selectionStart;
    password.focus();
    if (cursorPosition !== null) password.setSelectionRange(cursorPosition, cursorPosition);
  });
  if (playIntro) startLoginIntro();
}

function emptyState(message, icon) {
  return `<div class="empty-state"><span class="empty-state-icon" aria-hidden="true">${icon || '◇'}</span><p>${message}</p></div>`;
}

function statCard(label, value, icon) {
  return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div></article>`;
}

function getLocalDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function philippinesDateKey(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(value);
  const fields = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${fields.year}-${fields.month}-${fields.day}`;
}

function philippinesTimeValue(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(value);
  const fields = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${fields.hour}:${fields.minute}`;
}

function getTodayOrders() {
  const todayKey = getLocalDateKey(new Date());
  return getOrders().filter(order => getLocalDateKey(order.createdAt) === todayKey);
}

function ordersTable(records, showPayment) {
  if (!records.length) return emptyState('No orders recorded yet. Confirm a new order to see it here.', '▤');
  return `<div class="table-scroll"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE &amp; TIME</th><th>AMOUNT</th><th>TYPE</th><th>STATUS</th>${showPayment ? '<th>PAYMENT</th>' : ''}<th></th></tr></thead><tbody>
    ${records.map(order => `<tr>
      <td><span class="order-id">${escapeHTML(order.id)}</span></td>
      <td>${escapeHTML(order.customer || 'Walk-in')}</td>
      <td>${escapeHTML(dateTime(order.createdAt))}</td>
      <td class="amount-cell">${money(order.total)}</td>
      <td>${escapeHTML(order.type)}</td>
      <td><span class="status-badge ${escapeHTML(order.status.toLowerCase())}">${escapeHTML(order.status)}</span></td>
      ${showPayment ? `<td><span class="status-badge ${order.paymentStatus === 'Paid' ? 'completed' : 'pending'}">${escapeHTML(order.paymentStatus)}</span></td>` : ''}
      <td><button class="text-button" data-action="view-order" data-order-id="${escapeHTML(order.id)}">Details</button></td>
    </tr>`).join('')}
  </tbody></table></div>`;
}

function orderDetails(order, includePrices) {
  if (!order) return '';
  return `<article class="panel order-detail-panel">
    <div class="panel-heading"><div><p class="eyebrow">ORDER DETAILS</p><h2>${escapeHTML(order.id)}</h2><p>${escapeHTML(order.customer || 'Walk-in')} · ${escapeHTML(dateTime(order.createdAt))} · ${escapeHTML(order.type)}</p></div><button class="icon-button" data-action="close-order-details" aria-label="Close details">&times;</button></div>
    <div class="detail-items">${order.items.map(item => `<div class="detail-item"><span><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.quantity)} × ${money(item.unitPrice)}</small></span>${includePrices ? `<b>${money(item.quantity * item.unitPrice)}</b>` : `<b>× ${escapeHTML(item.quantity)}</b>`}</div>`).join('')}</div>
    ${order.instructions ? `<p class="detail-note"><strong>Special instructions:</strong> ${escapeHTML(order.instructions)}</p>` : ''}
    ${includePrices ? `<div class="detail-total"><span>Order total</span><strong>${money(order.total)}</strong></div><p class="detail-note">Payment: ${escapeHTML(order.paymentStatus)}${order.paymentMethod ? ` · ${escapeHTML(order.paymentMethod)}` : ''}</p>` : ''}
    ${includePrices && order.status === 'Pending' && order.paymentStatus !== 'Paid' ? `<button class="secondary-button cancel-recorded-order" data-action="cancel-recorded-order" data-order-id="${escapeHTML(order.id)}">Cancel order</button>` : ''}
  </article>`;
}

function dashboardContent(role) {
  const orders = getOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const todayKey = getLocalDateKey(new Date());
  const todaySales = getSales().filter(sale => getLocalDateKey(sale.paidAt) === todayKey)
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const pending = orders.filter(order => order.status === 'Pending').length;
  if (role === 'admin') {
    return `
      <div class="page-heading"><div><p class="eyebrow">OVERVIEW</p><h1>Welcome, Administrator!</h1><p class="page-description">Your restaurant management overview.</p></div><button class="primary-button" data-goto="orders">View orders <span aria-hidden="true">→</span></button></div>
      <div class="stats-grid">${statCard("Today's sales", money(todaySales), '₱')}${statCard('Total orders', String(orders.length), '▤')}${statCard('Pending orders', String(pending), '◷')}${statCard('Menu products', String(getProducts().length), '☷')}</div>
      <article class="panel orders-panel"><div class="panel-heading"><div><h2>Recent orders</h2><p>Latest restaurant orders</p></div><button class="text-button" data-goto="orders">View all <span>→</span></button></div>${ordersTable(orders.slice(0, 5), true)}</article>`;
  }
  if (role === 'cashier') {
    const recentToday = getTodayOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    return `
      <div class="page-heading"><div><p class="eyebrow">POINT OF SALE</p><h1>Welcome, Cashier!</h1><p class="page-description">A clear view of today's transactions.</p></div><button class="primary-button" data-goto="new-order"><span aria-hidden="true">＋</span> New Order</button></div>
      <div class="stats-grid cashier-stats">${statCard("Today's sales", money(todaySales), '₱')}${statCard('Total orders', String(orders.length), '▤')}${statCard('Pending orders', String(pending), '◷')}</div>
      <article class="panel orders-panel"><div class="panel-heading"><div><h2>Recent orders</h2><p>Today's customer transactions</p></div><button class="text-button" data-goto="order-history">Order history <span>→</span></button></div>${ordersTable(recentToday, true)}</article>`;
  }
  return `
    <div class="page-heading"><div><p class="eyebrow">KITCHEN</p><h1>Welcome, Kitchen Staff!</h1><p class="page-description">Track food preparation and order progress.</p></div></div>
    <div class="stats-grid kitchen-stats">${statCard('Pending orders', String(pending), '◷')}${statCard('Preparing orders', String(orders.filter(order => order.status === 'Preparing').length), '♨')}${statCard('Ready orders', String(orders.filter(order => order.status === 'Ready').length), '✓')}</div>
    <article class="panel kitchen-orders"><div class="panel-heading"><div><h2>Kitchen orders</h2><p>Food preparation and order progress</p></div></div>${kitchenCards(orders.filter(order => order.status !== 'Completed' && order.status !== 'Cancelled'))}</article>`;
}

function isProductAvailable(product) {
  return product.isAvailable !== false;
}

function isListedMenuProduct(product) {
  const name = String(product && product.name || '').trim().toLowerCase();
  return MAIN_MENU_PRODUCT_NAME_SET.has(name) || SPECIAL_MENU_PRODUCT_NAME_SET.has(name);
}

function productArt(product) {
  const image = PROVIDED_MENU_IMAGES[String(product.name || '').trim().toLowerCase()];
  if (!image) {
    return `<div class="product-art product-art-missing" role="img" aria-label="No image provided for ${escapeHTML(product.name)}">Image not provided</div>`;
  }
  const imageClass = LANDSCAPE_MENU_IMAGES.has(image) ? ' product-art-wide' : '';
  return `<img class="product-art${imageClass}" src="../assets/menu/${image}" alt="${escapeHTML(product.name)}" loading="lazy">`;
}

function orderedMenuProducts(products, names) {
  return products.slice().sort((first, second) => {
    const firstIndex = names.indexOf(String(first.name || '').trim());
    const secondIndex = names.indexOf(String(second.name || '').trim());
    return (firstIndex < 0 ? names.length : firstIndex) - (secondIndex < 0 ? names.length : secondIndex);
  });
}

function menuProductGroups(products) {
  const mainMenu = [];
  const houseSpecials = [];
  products.forEach(product => {
    const name = String(product.name || '').trim().toLowerCase();
    (SPECIAL_MENU_PRODUCT_NAME_SET.has(name) ? houseSpecials : mainMenu).push(product);
  });
  return [
    { title: 'Main Menu (10 Items)', products: orderedMenuProducts(mainMenu, MAIN_MENU_PRODUCT_NAMES), isSpecials: false },
    { title: 'House Specials & Favorites (5 Items)', products: orderedMenuProducts(houseSpecials, SPECIAL_MENU_PRODUCT_NAMES), isSpecials: true }
  ];
}

function renderMenuProductSections(products, renderProduct, includeEmptySections) {
  const groups = menuProductGroups(products);
  return groups.map(group => {
    if (!group.products.length && !includeEmptySections) return '';
    const productsMarkup = group.products.length
      ? `<div class="product-grid${group.isSpecials ? ' product-grid-specials' : ''}">${group.products.map(renderProduct).join('')}</div>`
      : emptyState(group.isSpecials ? 'No house specials are currently available.' : 'No main menu items are currently available.', '☷');
    return `<section class="menu-product-section"><h2 class="menu-product-section-title">${group.title}</h2>${productsMarkup}</section>`;
  }).join('');
}

function productCards(products, allowAdd) {
  const availableProducts = products.filter(product => isProductAvailable(product) && isListedMenuProduct(product));
  return renderMenuProductSections(availableProducts, product => `<article class="product-card">
    ${productArt(product)}
    <div class="product-card-body">
      <div class="product-card-meta">${product.category ? `<span>${escapeHTML(product.category)}</span>` : ''}</div>
      <h3>${escapeHTML(product.name)}</h3>
      ${product.description ? `<p class="product-description">${escapeHTML(product.description)}</p>` : ''}
      <div class="product-card-bottom"><strong>${money(product.price)}</strong>${allowAdd ? `<button class="primary-button product-add" data-action="add-product" data-product-id="${escapeHTML(product.id)}">Add <span aria-hidden="true">＋</span></button>` : ''}</div>
    </div>
  </article>`, true);
}

function createDraft() {
  return { id: generateOrderId(), customer: '', type: 'Dine-in', instructions: '', cart: {} };
}

function generateOrderId() {
  const now = new Date();
  const day = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const used = new Set(getOrders().map(order => order.id));
  let id;
  do {
    id = `YDUR-${day}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  } while (used.has(id));
  return id;
}

function cartItems() {
  if (!draftOrder) return [];
  const products = new Map(getProducts().map(product => [product.id, product]));
  return Object.entries(draftOrder.cart).map(([id, quantity]) => {
    const product = products.get(id);
    return product ? { ...product, quantity: Number(quantity) } : null;
  }).filter(item => item && item.quantity > 0);
}

function newOrderPage() {
  if (!draftOrder) {
    draftOrder = spectatorMode
      ? { ...SPECTATOR_DATA.draftOrder, cart: { ...SPECTATOR_DATA.draftOrder.cart } }
      : createDraft();
  }
  const items = cartItems();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `
    <div class="page-heading"><div><p class="eyebrow">POINT OF SALE</p><h1>New Order</h1><p class="page-description">Add available menu items and confirm the customer's order.</p></div><span class="menu-note">Only products marked available can be ordered.</span></div>
    <div class="order-layout">
      <section class="panel order-builder">
        <div class="order-meta-grid">
          <div><span class="field-label">Order ID</span><div class="order-id-display">${escapeHTML(draftOrder.id)}</div></div>
          <div><label class="field-label" for="orderType">Order type</label><select class="form-control" id="orderType"><option${draftOrder.type === 'Dine-in' ? ' selected' : ''}>Dine-in</option><option${draftOrder.type === 'Takeout' ? ' selected' : ''}>Takeout</option></select></div>
          <div><label class="field-label" for="customerName">Customer name <span class="optional-label">(optional)</span></label><input class="form-control" id="customerName" maxlength="80" placeholder="Walk-in customer" value="${escapeHTML(draftOrder.customer)}"></div>
        </div>
        <div class="panel-heading product-section-heading"><div><h2>Available menu</h2><p>Choose products to add them to this order.</p></div></div>
        ${productCards(getProducts(), true)}
      </section>
      <aside class="panel order-summary">
        <div class="panel-heading"><div><p class="eyebrow">CURRENT ORDER</p><h2>Order summary</h2></div><span class="cart-count">${items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
        <div class="cart-items">${items.length ? items.map(item => `<div class="cart-item">
          <div class="cart-item-info"><strong>${escapeHTML(item.name)}</strong><small>${money(item.price)} each</small><b>${money(item.price * item.quantity)}</b></div>
          <div class="quantity-control"><button aria-label="Decrease ${escapeHTML(item.name)} quantity" data-action="decrease-item" data-product-id="${escapeHTML(item.id)}">−</button><span>${escapeHTML(item.quantity)}</span><button aria-label="Increase ${escapeHTML(item.name)} quantity" data-action="increase-item" data-product-id="${escapeHTML(item.id)}">＋</button></div>
          <button class="remove-item" data-action="remove-item" data-product-id="${escapeHTML(item.id)}" aria-label="Remove ${escapeHTML(item.name)}">×</button>
        </div>`).join('') : emptyState('Your order is empty. Add products from the menu.', '＋')}</div>
        <label class="field-label" for="specialInstructions">Special instructions</label>
        <textarea class="form-control instructions-control" id="specialInstructions" maxlength="400" placeholder="Allergies, preparation notes, or other requests">${escapeHTML(draftOrder.instructions)}</textarea>
        <div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-line summary-total"><span>Total</span><strong>${money(subtotal)}</strong></div>
        <div class="order-actions"><button class="secondary-button" data-action="cancel-order">Cancel order</button><button class="primary-button" data-action="confirm-order"${items.length ? '' : ' disabled'}>Confirm order</button></div>
      </aside>
    </div>`;
}

function filteredOrders() {
  return getOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter(order => {
    const query = historySearch.toLowerCase();
    const matchesText = !query || order.id.toLowerCase().includes(query) || (order.customer || '').toLowerCase().includes(query);
    return matchesText && (historyStatus === 'All' || order.status === historyStatus);
  });
}

function historyPage() {
  const records = filteredOrders();
  const selectedOrder = getOrders().find(order => order.id === expandedOrderId);
  return `<div class="page-heading"><div><p class="eyebrow">POINT OF SALE</p><h1>Order History</h1><p class="page-description">Search orders, check preparation status, and review order details.</p></div><button class="primary-button" data-goto="new-order"><span aria-hidden="true">＋</span> New Order</button></div>
    <article class="panel orders-panel">
      <div class="history-controls"><form id="historySearch" class="history-search"><input class="form-control" name="query" aria-label="Search order ID or customer" placeholder="Search order ID or customer" value="${escapeHTML(historySearch)}"><button class="secondary-button" type="submit">Search</button></form>
      <label class="filter-label">Status <select id="historyStatus" class="select-control"><option${historyStatus === 'All' ? ' selected' : ''}>All</option>${['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map(status => `<option${historyStatus === status ? ' selected' : ''}>${status}</option>`).join('')}</select></label></div>
      ${records.length ? ordersTable(records, true) : emptyState('No orders match your search and status filter.', '⌕')}
      ${selectedOrder ? orderDetails(selectedOrder, true) : ''}
    </article>`;
}

function productManagementCard(product) {
  const available = isProductAvailable(product);
  const displayPrice = product.price === null || product.price === undefined ? '' : product.price;
  return `<article class="product-card">
    ${productArt(product)}<div class="product-card-body"><div class="product-card-meta">${currentUser.role === 'admin' ? `<span class="status-badge ${available ? 'completed' : 'cancelled'}">${available ? 'Available' : 'Unavailable'}</span>` : product.category ? `<span>${escapeHTML(product.category)}</span>` : ''}</div><h3>${escapeHTML(product.name)}</h3>
    ${currentUser.role !== 'admin' && product.description ? `<p class="product-description">${escapeHTML(product.description)}</p>` : ''}
    ${currentUser.role === 'admin' ? `<form class="product-edit-form" data-product-id="${escapeHTML(product.id)}">
      <div class="product-edit-grid">
        <label><span class="field-label">Product name</span><input class="form-control" name="name" list="providedMenuNames" maxlength="80" value="${escapeHTML(product.name)}" required></label>
        <label><span class="field-label">Price (₱)</span><input class="form-control" id="price-${escapeHTML(product.id)}" name="price" type="number" min="0.01" step="0.01" value="${escapeHTML(displayPrice)}" required></label>
        <label><span class="field-label">Availability</span><select class="form-control" name="isAvailable" required><option value="true"${available ? ' selected' : ''}>Available</option><option value="false"${available ? '' : ' selected'}>Unavailable</option></select></label>
      </div>
      <div class="product-edit-actions"><button class="secondary-button" type="submit">Save changes</button><button class="remove-item" type="button" data-action="delete-product" data-product-id="${escapeHTML(product.id)}" aria-label="Remove ${escapeHTML(product.name)}">×</button></div>
    </form>` : `<strong class="product-view-price">${money(product.price)}</strong>`}</div>
  </article>`;
}

function productManagementPage() {
  const products = getProducts().filter(product =>
    isListedMenuProduct(product) && (currentUser.role === 'admin' || isProductAvailable(product))
  );
  return `<div class="page-heading"><div><p class="eyebrow">MENU MANAGEMENT</p><h1>${currentUser.role === 'admin' ? 'Menu & Pricing' : 'Menu / View Products'}</h1><p class="page-description">${currentUser.role === 'admin' ? 'Manage menu items and their selling prices.' : 'Browse available products and their current prices.'}</p></div></div>
    <p class="menu-note">${currentUser.role === 'admin' ? 'Main Menu items need confirmed prices before they can be enabled. Images are matched automatically by the provided product names.' : 'Only currently available menu products are shown.'}</p>
    ${currentUser.role === 'admin' ? `<article class="panel product-create-panel"><div class="panel-heading"><div><h2>Add a product</h2><p>Choose one of the listed 15 items and set its price and availability.</p></div></div><form id="productCreateForm" class="product-create-form">
      <label><span class="field-label">Product name</span><input class="form-control" name="name" list="providedMenuNames" maxlength="80" required></label>
      <label><span class="field-label">Price (₱)</span><input class="form-control" name="price" type="number" min="0.01" step="0.01" required></label>
      <label><span class="field-label">Availability</span><select class="form-control" name="isAvailable" required><option value="">Choose status</option><option value="true">Available</option><option value="false">Unavailable</option></select></label>
      <button class="primary-button" type="submit">Add product</button>
      </form><datalist id="providedMenuNames">${PROVIDED_MENU_PRODUCT_NAMES.map(name => `<option value="${escapeHTML(name)}">`).join('')}</datalist></article>` : ''}
    ${renderMenuProductSections(products, productManagementCard, true)}`;
}

function kitchenCards(orders) {
  if (!orders.length) return emptyState('No kitchen orders at this stage.', '♨');
  return `<div class="kitchen-card-grid">${orders.map(order => `<article class="kitchen-order-card">
    <div class="kitchen-order-head"><div><span class="order-id">${escapeHTML(order.id)}</span><p>${escapeHTML(dateTime(order.createdAt))} · ${escapeHTML(order.type)}</p></div><span class="status-badge ${escapeHTML(order.status.toLowerCase())}">${escapeHTML(order.status)}</span></div>
    <ul class="kitchen-item-list">${order.items.map(item => `<li><strong>${escapeHTML(item.quantity)} ×</strong> ${escapeHTML(item.name)}</li>`).join('')}</ul>
    ${order.instructions ? `<p class="kitchen-instructions"><strong>Instructions:</strong> ${escapeHTML(order.instructions)}</p>` : ''}
    ${order.status === 'Pending' || order.status === 'Preparing' ? `<button class="primary-button" data-action="advance-kitchen-order" data-order-id="${escapeHTML(order.id)}">${order.status === 'Pending' ? 'Start preparing' : 'Mark ready'}</button>` : order.status === 'Ready' ? `<button class="secondary-button" data-action="complete-kitchen-order" data-order-id="${escapeHTML(order.id)}">Mark completed</button>` : '<span class="kitchen-ready-note">Completed</span>'}
  </article>`).join('')}</div>`;
}

function kitchenPage(page) {
  const title = page === 'incoming' ? 'Incoming Orders' : page === 'preparing' ? 'Preparing Orders' : 'Completed Orders';
  const status = page === 'incoming' ? 'Pending' : page === 'preparing' ? 'Preparing' : 'Ready';
  const orders = getOrders().filter(order => page === 'completed'
    ? order.status === 'Ready' || order.status === 'Completed'
    : order.status === status);
  return `<div class="page-heading"><div><p class="eyebrow">KITCHEN</p><h1>${title}</h1><p class="page-description">Order details for food preparation. Prices and payment details are not shown.</p></div></div><article class="panel kitchen-orders"><div class="panel-heading"><div><h2>${status} orders</h2><p>Food names, quantities, and special instructions only</p></div></div>${kitchenCards(orders)}</article>`;
}

function paymentPage() {
  const orders = getOrders().filter(order => order.paymentStatus !== 'Paid' && order.status !== 'Cancelled');
  const selected = orders.find(order => order.id === selectedPosOrderId) || orders[0];
  if (selected) selectedPosOrderId = selected.id;
  const amount = Number(paymentReceived);
  const change = Number.isFinite(amount) && amount >= Number(selected && selected.total) ? amount - Number(selected.total) : 0;
  const sales = getSales().slice().sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
  return `<div class="page-heading"><div><p class="eyebrow">POINT OF SALE</p><h1>POS / Sales</h1><p class="page-description">Accept cash payment for confirmed orders and print a receipt.</p></div></div>
    <div class="pos-layout"><section class="panel payment-panel"><div class="panel-heading"><div><h2>Cash payment</h2><p>An order is not marked paid until payment is confirmed.</p></div></div>
      ${selected ? `<label class="field-label" for="posOrder">Select unpaid order</label><select class="form-control" id="posOrder">${orders.map(order => `<option value="${escapeHTML(order.id)}"${order.id === selected.id ? ' selected' : ''}>${escapeHTML(order.id)} · ${escapeHTML(order.customer || 'Walk-in')} · ${money(order.total)}</option>`).join('')}</select>
        <div class="payment-order-summary"><div><span>Order</span><strong>${escapeHTML(selected.id)}</strong></div><div><span>Customer</span><strong>${escapeHTML(selected.customer || 'Walk-in')}</strong></div><div><span>Order total</span><strong class="payment-total">${money(selected.total)}</strong></div></div>
        <form id="paymentForm"><label class="field-label" for="amountReceived">Amount received (₱)</label><input class="form-control" id="amountReceived" name="amountReceived" type="number" min="${Number(selected.total).toFixed(2)}" step="0.01" value="${escapeHTML(paymentReceived)}" required>
        <div class="summary-line"><span>Change</span><strong id="paymentChange">${money(change)}</strong></div><p class="payment-validation" id="paymentValidation">${paymentReceived && amount < selected.total ? 'Amount received must cover the order total.' : ''}</p><button class="primary-button" type="submit">Confirm cash payment</button></form>`
        : emptyState('No unpaid orders are available. Confirm an order before taking payment.', '₱')}
      ${lastReceiptOrderId ? receiptButtonMarkup(lastReceiptOrderId) : ''}
    </section>
    <article class="panel sales-panel"><div class="panel-heading"><div><h2>Sales transactions</h2><p>Only confirmed payments are recorded as sales.</p></div></div>${sales.length ? `<div class="table-scroll"><table><thead><tr><th>ORDER</th><th>PAID AT</th><th>METHOD</th><th>TOTAL</th><th>RECEIVED</th><th>CHANGE</th><th></th></tr></thead><tbody>${sales.map(sale => `<tr><td class="order-id">${escapeHTML(sale.orderId)}</td><td>${escapeHTML(dateTime(sale.paidAt))}</td><td>${escapeHTML(sale.method || 'Cash')}</td><td class="amount-cell">${money(sale.total)}</td><td>${money(sale.amountReceived)}</td><td>${money(sale.change)}</td><td><button class="text-button" data-action="print-receipt" data-order-id="${escapeHTML(sale.orderId)}">Receipt</button></td></tr>`).join('')}</tbody></table></div>` : emptyState('No confirmed sales yet.', '₱')}</article></div>`;
}

function receiptButtonMarkup(orderId) {
  return `<div class="receipt-ready"><span>Payment confirmed for ${escapeHTML(orderId)}.</span><button class="secondary-button" data-action="print-receipt" data-order-id="${escapeHTML(orderId)}">Print receipt</button></div>`;
}

function orderManagementPage() {
  const records = getOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const selected = records.find(order => order.id === expandedOrderId);
  return `<div class="page-heading"><div><p class="eyebrow">MANAGEMENT</p><h1>Orders</h1><p class="page-description">Review all customer orders and their payment status.</p></div></div><article class="panel orders-panel">${ordersTable(records, true)}${selected ? orderDetails(selected, true) : ''}</article>`;
}

function operationsStatusLabel(status) {
  return String(status || '').replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
}

function dailyOperationsPage() {
  if (spectatorMode) return spectatorDailyOperationsPage();

  const data = dailyOperationsData;
  const heading = `<div class="page-heading operations-page-heading">
    <div><p class="eyebrow">RESTAURANT OPERATIONS</p><h1>Daily Operations</h1><p class="page-description">${currentUser.role === 'admin' ? 'Live monitoring of today’s business activity; dashboard totals refresh automatically.' : 'Shared daily sales, customer orders, and operation records.'}</p></div>
    <label class="operations-date-label" for="operationsDate">Operation date
      <input class="form-control" id="operationsDate" type="date" value="${escapeHTML(dailyOperationsDate)}">
    </label>
  </div>`;
  if (dailyOperationsLoading || !data || data.date !== dailyOperationsDate) {
    return `${heading}<article class="panel operations-empty"><p>Loading operations for ${escapeHTML(dailyOperationsDate)}…</p></article>`;
  }
  if (data.error) {
    return `${heading}<article class="panel operations-empty" role="alert"><p>${escapeHTML(data.error)}</p><button class="secondary-button" data-action="reload-daily-operations">Try again</button></article>`;
  }

  const operation = data.operation;
  const canManage = ['admin', 'cashier'].includes(currentUser.role);
  const canControlOperation = currentUser.role === 'admin';
  const canEditSettings = currentUser.role === 'admin';
  const kitchenRole = currentUser.role === 'kitchen';
  const summary = data.summary || {};
  const operationStatus = operation ? operation.status : 'not-created';
  const statusClass = operationStatus === 'open' ? 'ready' : operationStatus === 'closed' ? 'cancelled' : 'pending';
  const operationActions = operation && operation.status === 'open' && canControlOperation
    ? '<button class="danger-button" data-action="toggle-daily-operation" data-status="closed">Close operation</button>'
    : '';
  const operationCard = operation
    ? `<article class="panel operation-summary-panel">
        <div class="operation-summary-head"><div><p class="eyebrow">DAILY OPERATION</p><h2>${escapeHTML(operation.date || dailyOperationsDate)}</h2><p>${escapeHTML(operation.assigned_staff || 'Unassigned')} · Opened ${escapeHTML(operationsDateTime(operation.opened_at))}${operation.closed_at ? ` · Closed ${escapeHTML(operationsDateTime(operation.closed_at))}` : ''}</p></div><div class="operation-state-actions"><span class="status-badge ${statusClass}">${operationsStatusLabel(operation.status)}</span>${operationActions}</div></div>
        ${operation.notes ? `<p class="operation-notes">${escapeHTML(operation.notes)}</p>` : '<p class="operation-notes muted-label">No operation notes recorded.</p>'}
        ${canEditSettings && operation.status === 'open' ? `<details class="operation-settings"><summary>Operation settings</summary><form id="operationSettingsForm" class="operation-settings-form">
          <label><span class="field-label">Assigned cashier</span><select class="form-control" name="assigned_staff_id" required>${data.staff.map(staff => `<option value="${staff.id}"${Number(staff.id) === Number(operation.assigned_staff_id) ? ' selected' : ''}>${escapeHTML(staff.full_name)}</option>`).join('')}</select></label>
          <label><span class="field-label">Daily notes</span><textarea class="form-control" name="notes" maxlength="4000">${escapeHTML(operation.notes || '')}</textarea></label>
          <button class="secondary-button" type="submit">Save operation settings</button>
        </form></details>` : ''}
      </article>`
    : `<article class="panel operation-summary-panel operation-not-created">
        <div><p class="eyebrow">DAILY OPERATION</p><h2>No operation recorded for ${escapeHTML(dailyOperationsDate)}</h2><p>Create an operation before recording new orders or sales. Existing database records for this date remain visible below.</p></div>
      </article>`;

  const isCurrentBusinessDate = dailyOperationsDate === philippinesDateKey();
  const operationForm = !operation && canControlOperation && isCurrentBusinessDate
    ? `<article class="panel operations-form-panel"><div class="panel-heading"><div><h2>Start Daily Operation</h2><p>Opening an operation enables the day's shared order and payment workflow.</p></div></div>
      <form id="operationCreateForm" class="operations-form-grid">
        <label><span class="field-label">Operation date</span><input class="form-control" name="operation_date" type="date" value="${escapeHTML(dailyOperationsDate)}" readonly required></label>
        <label><span class="field-label">Opening time</span><input class="form-control" name="opening_time" type="time" value="${escapeHTML(philippinesTimeValue())}" required></label>
        <label><span class="field-label">Assigned cashier</span><select class="form-control" name="assigned_staff_id" required>${data.staff.map(staff => `<option value="${staff.id}"${Number(staff.id) === Number(currentUser.id) ? ' selected' : ''}>${escapeHTML(staff.full_name)}</option>`).join('')}</select></label>
        <label class="operations-notes-field"><span class="field-label">Daily notes or remarks</span><textarea class="form-control" name="notes" maxlength="4000" placeholder="Shift notes, incidents, or handover details"></textarea></label>
        <button class="primary-button operations-submit" type="submit">Start Daily Operation</button>
      </form>
    </article>`
    : '';

  const stats = kitchenRole
    ? `<div class="stats-grid operations-stats">${statCard('Total orders', String(summary.total_orders || 0), '▤')}${statCard('Pending orders', String(summary.pending_orders || 0), '◷')}${statCard('Preparing orders', String(summary.preparing_orders || 0), '♨')}${statCard('Ready orders', String(summary.ready_orders || 0), '✓')}${statCard('Completed orders', String(summary.completed_orders || 0), '✓')}${statCard('Cancelled orders', String(summary.cancelled_orders || 0), '×')}</div>`
    : `<div class="stats-grid operations-stats">${statCard('Total sales', money(summary.total_sales || 0), '₱')}${statCard('Total orders', String(summary.total_orders || 0), '▤')}${statCard('Pending orders', String(summary.pending_orders || 0), '◷')}${statCard('Preparing orders', String(summary.preparing_orders || 0), '♨')}${statCard('Ready orders', String(summary.ready_orders || 0), '✓')}${statCard('Completed orders', String(summary.completed_orders || 0), '✓')}${statCard('Cancelled orders', String(summary.cancelled_orders || 0), '×')}${statCard('Total revenue', money(summary.revenue || 0), '↗')}${statCard('Transactions', String(summary.transaction_count || 0), '▧')}</div>`;

  const orderRows = data.orders.length
    ? data.orders.map(order => {
      const orderItems = order.items.map(item => `<li>${escapeHTML(item.quantity)} × ${escapeHTML(item.name)}${!kitchenRole ? ` <span>${money(item.line_total)}</span>` : ''}</li>`).join('');
      const nextStatus = { pending: 'preparing', preparing: 'ready', ready: 'completed' }[order.status];
      const canAdvance = nextStatus && operation && operation.status === 'open' && (kitchenRole || canManage);
      const canCancel = canManage && operation && operation.status === 'open' && order.status === 'pending' && !['paid', 'partially_paid'].includes(order.payment_status);
      return `<tr>
        <td><strong class="order-id">${escapeHTML(order.order_number)}</strong><details class="operations-order-details"><summary>Items &amp; details</summary><ul>${orderItems}</ul>${order.notes ? `<p>${escapeHTML(order.notes)}</p>` : ''}</details></td>
        <td>${escapeHTML(order.customer_name || 'Walk-in')}</td>
        <td>${escapeHTML(operationsDateTime(order.created_at))}</td>
        ${kitchenRole ? '' : `<td class="amount-cell">${money(order.total)}</td><td>${escapeHTML(operationsStatusLabel(order.payment_status))}</td>`}
        <td><span class="status-badge ${escapeHTML(order.status)}">${escapeHTML(operationsStatusLabel(order.status))}</span></td>
        <td class="operations-row-actions">${canAdvance ? `<button class="secondary-button" data-action="update-daily-order" data-order-id="${order.id}" data-status="${nextStatus}">${nextStatus === 'preparing' ? 'Start preparing' : nextStatus === 'ready' ? 'Mark ready' : 'Complete'}</button>` : ''}${canCancel ? `<button class="danger-button" data-action="update-daily-order" data-order-id="${order.id}" data-status="cancelled">Cancel</button>` : ''}</td>
      </tr>`;
    }).join('')
    : `<tr><td class="operations-no-records" colspan="${kitchenRole ? 5 : 6}">No orders found for this operation date.</td></tr>`;
  const orderTable = `<div class="table-scroll"><table class="operations-table"><thead><tr><th>ORDER / ITEMS</th><th>CUSTOMER</th><th>CREATED</th>${kitchenRole ? '' : '<th>TOTAL</th><th>PAYMENT</th>'}<th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>${orderRows}</tbody></table></div>`;

  const orderForm = canManage && operation && operation.status === 'open'
    ? `<form id="dailyOrderForm" class="daily-order-form">
        <div class="panel-heading"><div><h3>Create customer order</h3><p>Prices are checked against the shared menu before saving.</p></div></div>
        <div class="operations-form-grid">
          <label><span class="field-label">Customer name</span><input class="form-control" name="customer_name" maxlength="120" placeholder="Walk-in customer"></label>
          <label><span class="field-label">Order type</span><select class="form-control" name="order_type"><option value="takeout">Takeout</option><option value="dine_in">Dine-in</option></select></label>
          <label><span class="field-label">Assigned Kitchen Staff</span><select class="form-control" name="assigned_kitchen_id"><option value="">Unassigned kitchen order</option>${(data.kitchen_staff || []).map(staff => `<option value="${staff.id}">${escapeHTML(staff.full_name)}</option>`).join('')}</select></label>
          <label class="operations-notes-field"><span class="field-label">Order notes</span><textarea class="form-control" name="notes" maxlength="4000" placeholder="Special instructions or requests"></textarea></label>
        </div>
        ${data.products.length ? `<div class="table-scroll"><table class="operations-product-table"><thead><tr><th>PRODUCT</th><th>PRICE</th><th>QUANTITY</th></tr></thead><tbody>${data.products.map(product => `<tr><td>${escapeHTML(product.product_name)}<small>${escapeHTML(product.category)}</small></td><td>${money(product.price)}</td><td><input class="form-control operations-quantity" type="number" min="0" max="99" step="1" value="0" data-product-quantity="${product.id}" aria-label="Quantity of ${escapeHTML(product.product_name)}" data-price="${product.price}"></td></tr>`).join('')}</tbody></table></div><div class="operations-order-total"><span>Calculated order total</span><strong id="operationsOrderTotal">${money(0)}</strong></div><button class="primary-button" type="submit">Create order</button>` : emptyState('No available database products. Add products in Menu Management first.', '☷')}
      </form>`
    : operation && operation.status !== 'open' && canManage
      ? `<p class="operation-closed-note">This operation is closed and read-only. Its orders and transactions remain available here and in Sales History.</p>`
      : !operation && !isCurrentBusinessDate
        ? `<p class="operation-closed-note">Historical dates are read-only. No operation was recorded for this date.</p>`
      : '';

  const paymentOrders = data.orders.filter(order => !['paid', 'cancelled'].includes(order.payment_status));
  const remainingForOrder = order => Math.max(0, Number(order.total) - data.sales
    .filter(sale => Number(sale.order_id) === Number(order.id))
    .reduce((sum, sale) => sum + Number(sale.amount || 0), 0));
  const firstPaymentDue = paymentOrders.length ? remainingForOrder(paymentOrders[0]) : 0;
  const paymentForm = canManage && operation && operation.status === 'open'
    ? `<form id="dailyPaymentForm" class="daily-payment-form">
        <label><span class="field-label">Unpaid order</span><select class="form-control" id="dailyPaymentOrder" name="order_id" required>${paymentOrders.map(order => `<option value="${order.id}" data-remaining="${remainingForOrder(order).toFixed(2)}">${escapeHTML(order.order_number)} · ${escapeHTML(order.customer_name || 'Walk-in')} · Balance ${money(remainingForOrder(order))}</option>`).join('')}</select></label>
        <label><span class="field-label">Amount due</span><input class="form-control" id="dailyPaymentAmount" name="amount" type="number" min="0.01" step="0.01" max="${firstPaymentDue.toFixed(2)}" value="${firstPaymentDue ? firstPaymentDue.toFixed(2) : ''}" required></label>
        <label><span class="field-label">Payment method</span><select class="form-control" name="payment_method"><option value="cash">Cash</option><option value="gcash">GCash</option><option value="card">Card</option><option value="bank_transfer">Bank transfer</option><option value="other">Other</option></select></label>
        <label><span class="field-label">Reference number <span class="optional-label">(optional)</span></span><input class="form-control" name="reference_number" maxlength="100"></label>
        <button class="primary-button" type="submit"${paymentOrders.length ? '' : ' disabled'}>Record sale</button>
      </form>`
    : '';
  const salesRows = data.sales.length
    ? data.sales.map(sale => `<tr><td><strong class="order-id">${escapeHTML(sale.order_number)}</strong></td><td>${escapeHTML(operationsDateTime(sale.paid_at))}</td><td>${escapeHTML(operationsStatusLabel(sale.payment_method))}</td><td>${escapeHTML(sale.reference_number || '—')}</td><td class="amount-cell">${money(sale.amount)}</td></tr>`).join('')
    : `<tr><td class="operations-no-records" colspan="5">No sales transactions recorded for this operation date.</td></tr>`;
  const salesSection = kitchenRole ? '' : `<article class="panel operations-panel"><div class="panel-heading"><div><p class="eyebrow">PAYMENTS</p><h2>Daily Sales</h2><p>Sales are payments recorded against existing customer orders.</p></div></div>${paymentForm}<div class="table-scroll"><table class="operations-table"><thead><tr><th>ORDER</th><th>PAID AT</th><th>METHOD</th><th>REFERENCE</th><th>AMOUNT</th></tr></thead><tbody>${salesRows}</tbody></table></div></article>`;
  const breakdownRows = Object.entries(data.payment_breakdown || {}).map(([method, amount]) => `<tr><td>${escapeHTML(method)}</td><td class="amount-cell">${money(amount)}</td></tr>`).join('');
  const topRows = (data.best_sellers || []).map(product => `<tr><td>${escapeHTML(product.product_name)}</td><td>${escapeHTML(product.quantity_sold)}</td><td class="amount-cell">${money(product.sales_total)}</td></tr>`).join('');
  const reportsSection = kitchenRole ? '' : `<article class="panel operations-panel daily-report-panel"><div class="panel-heading"><div><p class="eyebrow">DAILY REPORT</p><h2>Sales summary &amp; report</h2><p>Payment breakdown and best-selling products for ${escapeHTML(dailyOperationsDate)}.</p></div><div class="report-actions"><button class="secondary-button" data-action="print-daily-report">Print report</button><button class="secondary-button" data-action="export-daily-report">Export CSV</button></div></div>
      <div class="daily-report-grid"><section><h3>Payment methods</h3><div class="table-scroll"><table class="operations-table"><thead><tr><th>METHOD</th><th>TOTAL</th></tr></thead><tbody>${breakdownRows || '<tr><td colspan="2" class="operations-no-records">No transactions.</td></tr>'}</tbody></table></div></section><section><h3>Best-selling products</h3><div class="table-scroll"><table class="operations-table"><thead><tr><th>PRODUCT</th><th>QTY SOLD</th><th>SALES</th></tr></thead><tbody>${topRows || '<tr><td colspan="3" class="operations-no-records">No paid products.</td></tr>'}</tbody></table></div></section></div>
      <p class="daily-revenue-summary">Total sales and revenue: <strong>${money(summary.revenue || 0)}</strong> · ${escapeHTML(summary.transaction_count || 0)} payment transaction(s)</p>
    </article>`;

  return `${heading}${operationCard}${operationForm}${stats}
    <article class="panel operations-panel"><div class="panel-heading"><div><p class="eyebrow">CUSTOMER ORDERS</p><h2>Orders for ${escapeHTML(dailyOperationsDate)}</h2><p>Order details, product quantities, totals, payments, and preparation status.</p></div></div>${orderForm}${orderTable}</article>
    ${salesSection}${reportsSection}`;
}

function salesHistoryPage() {
  if (currentUser.role !== 'admin') {
    return '<article class="panel operations-empty" role="alert"><p>Sales History is available to Administrators only.</p></article>';
  }

  const data = salesHistoryData;
  const heading = `<div class="page-heading operations-page-heading">
    <div><p class="eyebrow">ADMIN REPORTS</p><h1>Sales History</h1><p class="page-description">Closed daily operations are preserved here as read-only business records.</p></div>
  </div>
  <form id="salesHistoryFilter" class="sales-history-filter">
    <label><span class="field-label">From date</span><input class="form-control" name="from" type="date" value="${escapeHTML(salesHistoryFrom)}" required></label>
    <label><span class="field-label">To date</span><input class="form-control" name="to" type="date" value="${escapeHTML(salesHistoryTo)}" required></label>
    <button class="primary-button" type="submit">Search history</button>
  </form>`;

  if (salesHistoryLoading || !data || data.from !== salesHistoryFrom || data.to !== salesHistoryTo) {
    return `${heading}<article class="panel operations-empty"><p>Loading closed operations…</p></article>`;
  }
  if (data.error) {
    return `${heading}<article class="panel operations-empty" role="alert"><p>${escapeHTML(data.error)}</p><button class="secondary-button" data-action="reload-sales-history">Try again</button></article>`;
  }

  const operations = data.operations || [];
  const totalSales = operations.reduce((sum, record) => sum + Number(record.total_sales || 0), 0);
  const totalOrders = operations.reduce((sum, record) => sum + Number(record.total_orders || 0), 0);
  const totalTransactions = operations.reduce((sum, record) => sum + Number(record.transaction_count || 0), 0);
  const rows = operations.length
    ? operations.map(record => {
      const breakdown = Object.entries(record.payment_breakdown || {})
        .map(([method, amount]) => `${escapeHTML(method)} ${money(amount)}`).join(' · ');
      return `<tr>
        <td><strong>${escapeHTML(record.operation_date)}</strong></td>
        <td>${escapeHTML(operationsDateTime(record.opened_at))}<br><span class="muted-label">Closed ${escapeHTML(operationsDateTime(record.closed_at))}</span></td>
        <td>${escapeHTML(record.assigned_staff || 'Unknown')}<br><span class="muted-label">Opened by ${escapeHTML(record.opened_by_name || 'Unknown')}${record.closed_by_name ? ` · Closed by ${escapeHTML(record.closed_by_name)}` : ''}</span></td>
        <td class="amount-cell">${money(record.total_sales)}</td>
        <td>${escapeHTML(record.total_orders)}</td>
        <td>${escapeHTML(record.completed_orders)}</td>
        <td>${escapeHTML(record.cancelled_orders)}</td>
        <td>${escapeHTML(record.transaction_count)}</td>
        <td>${breakdown || '—'}</td>
        <td><button class="secondary-button" data-action="view-closed-operation" data-date="${escapeHTML(record.operation_date)}">View report</button></td>
      </tr>`;
    }).join('')
    : '<tr><td class="operations-no-records" colspan="10">No closed operations found for this date range.</td></tr>';

  return `${heading}
    <div class="stats-grid operations-stats history-summary-stats">
      ${statCard('Closed operations', String(operations.length), '◷')}
      ${statCard('Total sales', money(totalSales), '₱')}
      ${statCard('Total orders', String(totalOrders), '▤')}
      ${statCard('Transactions', String(totalTransactions), '▧')}
    </div>
    <article class="panel operations-panel sales-history-panel">
      <div class="panel-heading"><div><p class="eyebrow">PERMANENT RECORDS</p><h2>Closed operations</h2><p>Showing ${escapeHTML(salesHistoryFrom)} through ${escapeHTML(salesHistoryTo)}. Open a report to inspect its saved orders and payments.</p></div>
        <div class="report-actions"><button class="secondary-button" data-action="print-sales-history">Print history</button><button class="secondary-button" data-action="export-sales-history">Export CSV</button></div>
      </div>
      <div class="table-scroll"><table class="operations-table sales-history-table">
        <thead><tr><th>BUSINESS DATE</th><th>OPEN / CLOSE</th><th>ASSIGNED STAFF</th><th>SALES</th><th>ORDERS</th><th>COMPLETED</th><th>CANCELLED</th><th>TRANSACTIONS</th><th>PAYMENT METHODS</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
    </article>`;
}

function spectatorDailyOperationsPage() {
  const selectedOrders = SPECTATOR_DATA.orders.filter(order => philippinesDateKey(new Date(order.createdAt)) === dailyOperationsDate);
  const selectedSales = SPECTATOR_DATA.sales.filter(sale => philippinesDateKey(new Date(sale.paidAt)) === dailyOperationsDate);
  const totalSales = selectedSales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const statusCount = status => selectedOrders.filter(order => order.status.toLowerCase() === status).length;
  const paymentTotals = {};
  selectedSales.forEach(sale => {
    paymentTotals[sale.method] = (paymentTotals[sale.method] || 0) + Number(sale.total || 0);
  });
  return `<div class="page-heading operations-page-heading"><div><p class="eyebrow">RESTAURANT OPERATIONS</p><h1>Daily Operations</h1><p class="page-description">Static sample information. Spectator mode is read-only.</p></div><label class="operations-date-label" for="operationsDate">Operation date<input class="form-control" id="operationsDate" type="date" value="${escapeHTML(dailyOperationsDate)}"></label></div>
    <article class="panel spectator-operation-note"><strong>Read-only preview</strong><span>Sample content only; no live account, order, or sales records are accessed.</span></article>
    <div class="stats-grid operations-stats">${statCard('Total sales', money(totalSales), '₱')}${statCard('Total orders', String(selectedOrders.length), '▤')}${statCard('Completed orders', String(statusCount('completed')), '✓')}${statCard('Pending orders', String(statusCount('pending')), '◷')}${statCard('Cancelled orders', String(statusCount('cancelled')), '×')}${statCard('Total revenue', money(totalSales), '↗')}${statCard('Transactions', String(selectedSales.length), '▧')}</div>
    <article class="panel operations-panel"><div class="panel-heading"><div><p class="eyebrow">CUSTOMER ORDERS</p><h2>Sample orders for ${escapeHTML(dailyOperationsDate)}</h2></div></div>${selectedOrders.length ? `<div class="operations-sample-orders">${selectedOrders.map(order => `<section><strong>${escapeHTML(order.id)}</strong><span>${escapeHTML(order.customer)} · ${escapeHTML(order.status)} · ${money(order.total)}</span><ul>${order.items.map(item => `<li>${escapeHTML(item.quantity)} × ${escapeHTML(item.name)}</li>`).join('')}</ul></section>`).join('')}</div>` : emptyState('No sample orders for this date.', '▤')}</article>
    <article class="panel operations-panel daily-report-panel"><div class="panel-heading"><div><p class="eyebrow">DAILY REPORT</p><h2>Sample payment breakdown</h2></div><div class="report-actions"><button class="secondary-button" data-action="print-daily-report">Print report</button><button class="secondary-button" data-action="export-daily-report">Export CSV</button></div></div><div class="table-scroll"><table class="operations-table"><thead><tr><th>PAYMENT METHOD</th><th>TOTAL</th></tr></thead><tbody>${Object.entries(paymentTotals).map(([method, amount]) => `<tr><td>${escapeHTML(method)}</td><td>${money(amount)}</td></tr>`).join('') || '<tr><td colspan="2" class="operations-no-records">No sample transactions.</td></tr>'}</tbody></table></div></article>`;
}

async function requestDailyOperations(method, payload, query = {}) {
  const options = { method, credentials: 'same-origin', headers: {} };
  let url = 'operations.php';
  if (method === 'GET') {
    const parameters = Object.keys(query).length
      ? new URLSearchParams(query)
      : new URLSearchParams({ date: dailyOperationsDate });
    url += `?${parameters.toString()}`;
  } else {
    options.headers['Content-Type'] = 'application/json';
    options.headers['X-CSRF-Token'] = auth.csrfToken;
    options.body = JSON.stringify(payload);
  }
  const response = await fetch(url, options);
  let result;
  try {
    result = await response.json();
  } catch (error) {
    throw new Error('The server returned an invalid response. Refresh the page and try again.');
  }
  if (!response.ok) throw new Error(result.error || 'Unable to complete the request.');
  return result;
}

async function refreshDailyOperations(force = false) {
  if (spectatorMode || activePage !== 'daily-operations') return;
  if (dailyOperationsLoading) return;
  if (!force && dailyOperationsData && dailyOperationsData.date === dailyOperationsDate) return;
  const requestId = ++dailyOperationsRequest;
  const requestedDate = dailyOperationsDate;
  dailyOperationsLoading = true;
  try {
    const data = await requestDailyOperations('GET');
    if (requestId !== dailyOperationsRequest || requestedDate !== dailyOperationsDate) return;
    dailyOperationsData = data;
  } catch (error) {
    if (requestId !== dailyOperationsRequest) return;
    dailyOperationsData = { date: requestedDate, error: error.message };
  } finally {
    if (requestId === dailyOperationsRequest) {
      dailyOperationsLoading = false;
      if (activePage === 'daily-operations') updatePage();
    }
  }
}

async function refreshSalesHistory(force = false) {
  if (spectatorMode || currentUser.role !== 'admin' || activePage !== 'sales-history') return;
  if (salesHistoryLoading) return;
  if (
    !force &&
    salesHistoryData &&
    salesHistoryData.from === salesHistoryFrom &&
    salesHistoryData.to === salesHistoryTo
  ) return;

  const requestId = ++salesHistoryRequest;
  const requestedFrom = salesHistoryFrom;
  const requestedTo = salesHistoryTo;
  salesHistoryLoading = true;
  try {
    const data = await requestDailyOperations('GET', null, {
      view: 'history',
      from: requestedFrom,
      to: requestedTo
    });
    if (requestId !== salesHistoryRequest || requestedFrom !== salesHistoryFrom || requestedTo !== salesHistoryTo) return;
    salesHistoryData = data;
  } catch (error) {
    if (requestId !== salesHistoryRequest) return;
    salesHistoryData = { from: requestedFrom, to: requestedTo, error: error.message };
  } finally {
    if (requestId === salesHistoryRequest) {
      salesHistoryLoading = false;
      if (activePage === 'sales-history') updatePage();
    }
  }
}

async function submitDailyOperationsForm(form) {
  const values = new FormData(form);
  let payload;
  if (form.id === 'operationCreateForm') {
    payload = {
      action: 'create_operation',
      date: dailyOperationsDate,
      opening_time: values.get('opening_time'),
      assigned_staff_id: Number(values.get('assigned_staff_id')),
      notes: values.get('notes')
    };
  } else if (form.id === 'operationSettingsForm') {
    payload = {
      action: 'update_operation',
      date: dailyOperationsDate,
      assigned_staff_id: Number(values.get('assigned_staff_id')),
      notes: values.get('notes')
    };
  } else if (form.id === 'dailyOrderForm') {
    const items = Array.from(form.querySelectorAll('[data-product-quantity]'))
      .map(input => ({ product_id: Number(input.dataset.productQuantity), quantity: Number(input.value) }))
      .filter(item => item.quantity > 0);
    if (!items.length) return showToast('Add at least one product to the order.');
    if (!pendingOrderRequestId) {
      pendingOrderRequestId = window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : `ydur-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    }
    payload = {
      action: 'create_order',
      date: dailyOperationsDate,
      client_request_id: pendingOrderRequestId,
      customer_name: values.get('customer_name'),
      order_type: values.get('order_type'),
      assigned_kitchen_id: values.get('assigned_kitchen_id') ? Number(values.get('assigned_kitchen_id')) : null,
      notes: values.get('notes'),
      items
    };
  } else if (form.id === 'dailyPaymentForm') {
    if (!pendingPaymentRequestId) {
      pendingPaymentRequestId = window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : `ydur-payment-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
    payload = {
      action: 'record_payment',
      date: dailyOperationsDate,
      client_request_id: pendingPaymentRequestId,
      order_id: Number(values.get('order_id')),
      amount: Number(values.get('amount')),
      payment_method: values.get('payment_method'),
      reference_number: values.get('reference_number')
    };
  } else {
    return;
  }

  const submitButton = form.querySelector('[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  try {
    const result = await requestDailyOperations('POST', payload);
    if (form.id === 'dailyOrderForm') pendingOrderRequestId = '';
    if (form.id === 'dailyPaymentForm') pendingPaymentRequestId = '';
    showToast(result.message || 'Daily operation updated.');
    await refreshDailyOperations(true);
  } catch (error) {
    showToast(error.message);
    if (submitButton) submitButton.disabled = false;
  }
}

async function changeDailyOperationStatus(status) {
  const operation = dailyOperationsData && dailyOperationsData.operation;
  if (!operation || currentUser.role !== 'admin' || status !== 'closed' || operation.status !== 'open') return;
  if (!window.confirm(`Close the daily operation for ${dailyOperationsDate}? This permanently locks its records and moves it to Sales History.`)) return;
  try {
    const result = await requestDailyOperations('POST', {
      action: 'set_operation_status',
      date: dailyOperationsDate,
      status
    });
    salesHistoryData = null;
    showToast(result.message);
    await refreshDailyOperations(true);
  } catch (error) {
    showToast(error.message);
  }
}

async function applySalesHistoryFilter(form) {
  const values = new FormData(form);
  const from = String(values.get('from') || '');
  const to = String(values.get('to') || '');
  if (!from || !to || from > to) {
    showToast('Choose a valid date range with the start date on or before the end date.');
    return;
  }
  salesHistoryFrom = from;
  salesHistoryTo = to;
  salesHistoryData = null;
  await refreshSalesHistory(true);
}

function openClosedOperation(date) {
  if (currentUser.role !== 'admin' || !date) return;
  dailyOperationsDate = date;
  dailyOperationsFollowToday = date === philippinesDateKey();
  dailyOperationsData = null;
  dailyOperationsRequest++;
  navigateTo('daily-operations');
}

function salesHistoryRows() {
  return (salesHistoryData && salesHistoryData.operations || []).map(record => [
    record.operation_date,
    record.assigned_staff,
    record.opened_by_name,
    record.closed_by_name,
    Number(record.total_sales || 0),
    Number(record.total_orders || 0),
    Number(record.completed_orders || 0),
    Number(record.cancelled_orders || 0),
    Number(record.transaction_count || 0),
    Object.entries(record.payment_breakdown || {})
      .map(([method, amount]) => `${method}: ${Number(amount).toFixed(2)}`).join('; ')
  ]);
}

function exportSalesHistory() {
  const rows = [
    ['Business date', 'Assigned staff', 'Opened by', 'Closed by', 'Total sales', 'Orders', 'Completed', 'Cancelled', 'Transactions', 'Payment breakdown'],
    ...salesHistoryRows()
  ];
  const csv = rows.map(row => row.map(value => `"${String(value == null ? '' : value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ydur-sales-history-${salesHistoryFrom}-to-${salesHistoryTo}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function printSalesHistory() {
  const records = (salesHistoryData && salesHistoryData.operations || []).map(record => {
    const breakdown = Object.entries(record.payment_breakdown || {})
      .map(([method, amount]) => `${escapeHTML(method)}: ${money(amount)}`).join('<br>') || '—';
    return `<tr><td>${escapeHTML(record.operation_date)}</td><td>${escapeHTML(operationsDateTime(record.opened_at))}<br>${escapeHTML(operationsDateTime(record.closed_at))}</td><td>${escapeHTML(record.assigned_staff || 'Unknown')}</td><td>${money(record.total_sales)}</td><td>${escapeHTML(record.total_orders)}</td><td>${escapeHTML(record.completed_orders)}</td><td>${escapeHTML(record.cancelled_orders)}</td><td>${escapeHTML(record.transaction_count)}</td><td>${breakdown}</td></tr>`;
  }).join('');
  const printWindow = window.open('', '_blank', 'width=1100,height=750');
  if (!printWindow) return showToast('Allow pop-ups to print Sales History.');
  printWindow.document.write(`<!doctype html><html><head><title>YDUR's Sales History</title><style>body{font:13px Arial,sans-serif;margin:24px;color:#222}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:7px;border:1px solid #ccc}th{background:#eee}h1{font-size:20px}@media print{body{margin:10mm}}</style></head><body><h1>YDUR'S FRIED &amp; GRILL — Sales History</h1><p>Closed operations: ${escapeHTML(salesHistoryFrom)} through ${escapeHTML(salesHistoryTo)}</p><table><thead><tr><th>Business date</th><th>Open / close</th><th>Staff</th><th>Sales</th><th>Orders</th><th>Completed</th><th>Cancelled</th><th>Transactions</th><th>Payments</th></tr></thead><tbody>${records || '<tr><td colspan="9">No closed operations in this range.</td></tr>'}</tbody></table><script>window.onload=function(){window.print();};<\/script></body></html>`);
  printWindow.document.close();
}

async function updateDailyOrderStatus(orderId, status) {
  try {
    const result = await requestDailyOperations('POST', {
      action: 'update_order_status',
      date: dailyOperationsDate,
      order_id: Number(orderId),
      status
    });
    showToast(result.message);
    await refreshDailyOperations(true);
  } catch (error) {
    showToast(error.message);
  }
}

function dailyReportRows() {
  if (spectatorMode) {
    return SPECTATOR_DATA.sales
      .filter(sale => philippinesDateKey(new Date(sale.paidAt)) === dailyOperationsDate)
      .map(sale => [sale.orderId, sale.method, Number(sale.total), sale.paidAt]);
  }
  const data = dailyOperationsData || {};
  return (data.sales || []).map(sale => [sale.order_number, sale.payment_method, Number(sale.amount), sale.paid_at]);
}

function dailyReportSummary() {
  if (!spectatorMode) return dailyOperationsData && dailyOperationsData.summary || {};
  const orders = SPECTATOR_DATA.orders.filter(order => philippinesDateKey(new Date(order.createdAt)) === dailyOperationsDate);
  const sales = SPECTATOR_DATA.sales.filter(sale => philippinesDateKey(new Date(sale.paidAt)) === dailyOperationsDate);
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  return {
    total_sales: totalSales,
    total_orders: orders.length,
    completed_orders: orders.filter(order => order.status.toLowerCase() === 'completed').length,
    pending_orders: orders.filter(order => order.status.toLowerCase() === 'pending').length,
    cancelled_orders: orders.filter(order => order.status.toLowerCase() === 'cancelled').length,
    revenue: totalSales,
    transaction_count: sales.length
  };
}

function dailyReportBreakdown() {
  if (!spectatorMode) return dailyOperationsData && dailyOperationsData.payment_breakdown || {};
  const totals = {};
  SPECTATOR_DATA.sales
    .filter(sale => philippinesDateKey(new Date(sale.paidAt)) === dailyOperationsDate)
    .forEach(sale => {
      totals[sale.method] = (totals[sale.method] || 0) + Number(sale.total || 0);
    });
  return totals;
}

function dailyReportBestSellers() {
  if (!spectatorMode) return dailyOperationsData && dailyOperationsData.best_sellers || [];
  const paidOrderIds = new Set(SPECTATOR_DATA.sales
    .filter(sale => philippinesDateKey(new Date(sale.paidAt)) === dailyOperationsDate)
    .map(sale => sale.orderId));
  const products = new Map();
  SPECTATOR_DATA.orders.filter(order => paidOrderIds.has(order.id)).forEach(order => {
    order.items.forEach(item => {
      const current = products.get(item.name) || { product_name: item.name, quantity_sold: 0, sales_total: 0 };
      current.quantity_sold += Number(item.quantity);
      current.sales_total += Number(item.quantity) * Number(item.unitPrice);
      products.set(item.name, current);
    });
  });
  return Array.from(products.values()).sort((left, right) => right.quantity_sold - left.quantity_sold);
}

function exportDailyOperationsReport() {
  const summary = dailyReportSummary();
  const breakdown = dailyReportBreakdown();
  const bestSellers = dailyReportBestSellers();
  const rows = [
    ['Daily Operations Report', dailyOperationsDate],
    ['Total sales', Number(summary.total_sales || 0)],
    ['Total orders', Number(summary.total_orders || 0)],
    ['Completed orders', Number(summary.completed_orders || 0)],
    ['Pending orders', Number(summary.pending_orders || 0)],
    ['Cancelled orders', Number(summary.cancelled_orders || 0)],
    ['Revenue', Number(summary.revenue || 0)],
    ['Transaction count', Number(summary.transaction_count || 0)],
    [],
    ['Payment method', 'Amount'],
    ...Object.entries(breakdown),
    [],
    ['Best-selling product', 'Quantity sold', 'Sales total'],
    ...bestSellers.map(product => [product.product_name, product.quantity_sold, product.sales_total]),
    [],
    ['Order / Transaction', 'Payment method', 'Amount', 'Paid at'],
    ...dailyReportRows()
  ];
  const csv = rows.map(row => row.map(value => `"${String(value == null ? '' : value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ydur-daily-report-${dailyOperationsDate}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function printDailyOperationsReport() {
  const summary = dailyReportSummary();
  const breakdown = dailyReportBreakdown();
  const bestSellers = dailyReportBestSellers();
  const payments = spectatorMode
    ? SPECTATOR_DATA.sales.filter(sale => philippinesDateKey(new Date(sale.paidAt)) === dailyOperationsDate)
      .map(sale => ({ order_number: sale.orderId, payment_method: sale.method, amount: sale.total, paid_at: sale.paidAt }))
    : data.sales || [];
  const title = `Daily Operations Report — ${dailyOperationsDate}`;
  const rows = payments.map(sale => `<tr><td>${escapeHTML(sale.order_number)}</td><td>${escapeHTML(operationsStatusLabel(sale.payment_method))}</td><td>${money(sale.amount)}</td><td>${escapeHTML(operationsDateTime(sale.paid_at))}</td></tr>`).join('');
  const breakdownRows = Object.entries(breakdown).map(([method, amount]) => `<tr><td>${escapeHTML(method)}</td><td>${money(amount)}</td></tr>`).join('');
  const bestSellerRows = bestSellers.map(product => `<tr><td>${escapeHTML(product.product_name)}</td><td>${escapeHTML(product.quantity_sold)}</td><td>${money(product.sales_total)}</td></tr>`).join('');
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return showToast('Allow pop-ups to print this report.');
  printWindow.document.write(`<!doctype html><html><head><title>${escapeHTML(title)}</title><style>body{font:14px Arial,sans-serif;margin:32px;color:#222}h1{font-size:22px}table{width:100%;border-collapse:collapse;margin:12px 0 24px}th,td{text-align:left;padding:8px;border-bottom:1px solid #ccc}th{background:#eee}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px 0}.summary span{padding:9px;border:1px solid #ddd}@media print{body{margin:12mm}}</style></head><body><h1>YDUR'S FRIED &amp; GRILL</h1><h2>${escapeHTML(title)}</h2><p>Sales and order summary for the selected operation date.</p><div class="summary"><span>Total sales: <strong>${money(summary.total_sales || 0)}</strong></span><span>Total orders: <strong>${escapeHTML(summary.total_orders || 0)}</strong></span><span>Completed: <strong>${escapeHTML(summary.completed_orders || 0)}</strong></span><span>Pending: <strong>${escapeHTML(summary.pending_orders || 0)}</strong></span><span>Cancelled: <strong>${escapeHTML(summary.cancelled_orders || 0)}</strong></span><span>Revenue: <strong>${money(summary.revenue || 0)}</strong></span><span>Transactions: <strong>${escapeHTML(summary.transaction_count || 0)}</strong></span></div><h3>Payment methods</h3><table><thead><tr><th>Method</th><th>Total</th></tr></thead><tbody>${breakdownRows || '<tr><td colspan="2">No transactions.</td></tr>'}</tbody></table><h3>Best-selling products</h3><table><thead><tr><th>Product</th><th>Quantity</th><th>Sales</th></tr></thead><tbody>${bestSellerRows || '<tr><td colspan="3">No paid products.</td></tr>'}</tbody></table><h3>Transactions</h3><table><thead><tr><th>Order</th><th>Payment method</th><th>Amount</th><th>Paid at</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No transactions recorded.</td></tr>'}</tbody></table><script>window.onload=function(){window.print();};<\/script></body></html>`);
  printWindow.document.close();
}

function pageContent(role, page) {
  if (page === 'dashboard') return dashboardContent(role);
  if (page === 'daily-operations') return dailyOperationsPage();
  if (page === 'sales-history') {
    if (spectatorMode) {
      return '<div class="page-heading"><div><p class="eyebrow">ADMIN REPORTS</p><h1>Sales History</h1><p class="page-description">Historical financial records are not available in the static Spectator preview.</p></div></div><article class="panel spectator-operation-note"><strong>Read-only preview</strong><span>No live operation or transaction data is accessed.</span></article>';
    }
    if (role === 'admin') return salesHistoryPage();
  }
  if (role === 'kitchen') return kitchenPage(page);
  if (page === 'new-order' && role === 'cashier') return newOrderPage();
  if ((page === 'order-history' || page === 'orders') && (role === 'cashier' || role === 'admin')) {
    return role === 'cashier' ? historyPage() : orderManagementPage();
  }
  if (page === 'menu' && (role === 'admin' || role === 'cashier')) return productManagementPage();
  if (page === 'pos' && (role === 'admin' || role === 'cashier')) return paymentPage();
  if (page === 'staff' && role === 'admin' && !staticDemo) return staffManagementPage();
  const item = NAVIGATION[role].find(entry => entry[0] === page);
  return `<div class="page-heading"><div><p class="eyebrow">${role === 'admin' ? 'MANAGEMENT' : 'POINT OF SALE'}</p><h1>${escapeHTML(item ? item[1] : 'Dashboard')}</h1><p class="page-description">This workspace is ready for future database integration.</p></div></div><article class="panel placeholder-panel">${emptyState('This module is outside the scope of the current frontend demonstration.', item ? item[2] : '◇')}</article>`;
}

function staffManagementPage() {
  const roleLabels = { admin: 'Admin', cashier: 'Cashier', kitchen: 'Kitchen Staff' };
  const accounts = (auth.staffAccounts || []).filter(account => {
    const active = Number(account.is_active) === 1;
    if (staffFilter === 'all') return true;
    if (staffFilter === 'active') return active;
    if (staffFilter === 'inactive') return !active;
    if (staffFilter === 'admin' || staffFilter === 'cashier' || staffFilter === 'kitchen') {
      return account.role === staffFilter;
    }
    return false;
  });
  const rows = accounts.map(account => {
    const id = Number(account.id);
    const role = String(account.role);
    const active = Number(account.is_active) === 1;
    const isOwnAccount = id === Number(currentUser.id);
    const targetAllowed = ['cashier', 'kitchen'].includes(role) && !isOwnAccount;
    const created = account.created_at ? dateTime(account.created_at) : 'Unknown';
    const actionButton = targetAllowed
      ? `<div class="staff-row-actions">
          <button class="secondary-button staff-reset-button" type="button" data-reset-account="${id}" data-reset-username="${escapeHTML(account.username)}">Reset Password</button>
          <button class="${active ? 'danger-button' : 'secondary-button'}" type="button" data-staff-action="${active ? 'deactivate' : 'reactivate'}" data-account-id="${id}" data-account-name="${escapeHTML(account.full_name)}">${active ? 'Deactivate' : 'Reactivate'}</button>
          ${account.deletion_block_reason
            ? `<span class="account-action-note delete-blocked">Delete blocked: ${escapeHTML(account.deletion_block_reason)}</span>`
            : `<button class="danger-button" type="button" data-staff-action="delete" data-account-id="${id}" data-account-name="${escapeHTML(account.full_name)}">Delete Permanently</button>`}
        </div>`
      : `<span class="account-action-note">${isOwnAccount
        ? 'Current account. Admin accounts cannot be permanently deleted.'
        : role === 'admin'
          ? 'Admin accounts cannot be permanently deleted.'
          : 'Protected'}</span>`;

    return `<tr>
      <td>${id}</td>
      <td>${escapeHTML(account.full_name)}</td>
      <td>${escapeHTML(account.username)}</td>
      <td>${roleLabels[role] || escapeHTML(role)}</td>
      <td><span class="status-badge ${active ? 'ready' : 'pending'}">${active ? 'Active' : 'Inactive'}</span></td>
      <td>${escapeHTML(created)}</td>
      <td>${actionButton}</td>
    </tr>`;
  }).join('');

  return `<div class="page-heading">
      <div><p class="eyebrow">ADMINISTRATION</p><h1>Staff / User Management</h1><p class="page-description">Create and manage Cashier and Kitchen Staff accounts.</p></div>
    </div>
    ${auth.staffMessage ? `<div class="staff-notice success" role="status">${escapeHTML(auth.staffMessage)}</div>` : ''}
    ${auth.staffError ? `<div class="staff-notice error" role="alert">${escapeHTML(auth.staffError)}</div>` : ''}
    <div class="staff-grid">
      <article class="panel staff-create-panel">
        <div class="panel-heading"><div><h2>Add Staff</h2><p>Create an active account for a Cashier or Kitchen Staff member.</p></div></div>
        <form id="staffCreateForm" class="staff-create-form" method="post" action="index.php?dashboard=admin&staff=1">
          <input type="hidden" name="action" value="create_staff">
          <input type="hidden" name="csrf_token" value="${escapeHTML(auth.csrfToken)}">
          <label><span class="field-label">Full Name</span><input class="form-control" name="full_name" maxlength="100" autocomplete="name" required></label>
          <label><span class="field-label">Username</span><input class="form-control" name="username" minlength="3" maxlength="50" pattern="[A-Za-z0-9._-]{3,50}" autocomplete="username" required></label>
          <div class="password-form-group">
            <label class="field-label" for="staffPassword">Password</label>
            <div class="password-field">
              <input class="form-control" id="staffPassword" name="password" type="password" minlength="12" autocomplete="new-password" required>
              <button class="password-toggle" type="button" data-password-toggle="staffPassword" aria-label="Show password" aria-pressed="false">
                <svg class="password-eye password-eye-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="password-eye password-eye-off" viewBox="0 0 24 24" aria-hidden="true"></svg>
              </button>
            </div>
            <div class="password-strength" data-password-strength data-level="empty" aria-live="polite">
              <div class="password-strength-heading"><span>Password strength</span><strong data-strength-label>Password strength</strong></div>
              <div class="password-strength-bar" aria-hidden="true"><span data-strength-segment></span><span data-strength-segment></span><span data-strength-segment></span><span data-strength-segment></span></div>
              <p class="password-strength-hint">Use at least 12 characters with uppercase, lowercase, numbers, and symbols.</p>
            </div>
          </div>
          <div class="password-form-group">
            <label class="field-label" for="staffConfirmPassword">Confirm Password</label>
            <div class="password-field confirmation-field">
              <input class="form-control" id="staffConfirmPassword" name="confirm_password" type="password" minlength="12" autocomplete="new-password" required>
              <button class="password-toggle" type="button" data-password-toggle="staffConfirmPassword" aria-label="Show confirm password" aria-pressed="false">
                <svg class="password-eye password-eye-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="password-eye password-eye-off" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-2.1 3M6.4 6.4C3.6 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.1-.9"/></svg>
              </button>
              <span class="password-confirm-icon" data-confirm-icon hidden></span>
            </div>
            <div class="password-confirm-feedback" data-confirm-feedback hidden></div>
          </div>
          <label><span class="field-label">Staff Role</span><select class="form-control" name="staff_role" required><option value="" disabled selected>Select staff role</option><option value="cashier">Cashier</option><option value="kitchen">Kitchen Staff</option></select></label>
          <button class="primary-button" type="submit">Add Staff</button>
        </form>
      </article>
      <article class="panel staff-list-panel">
        <div class="staff-list-toolbar">
          <div class="panel-heading"><div><h2>Accounts</h2><p>View account roles and activation status.</p></div></div>
          <label class="staff-filter" for="staffFilter"><span class="field-label">Filter accounts</span><select class="form-control" id="staffFilter">
            <option value="active"${staffFilter === 'active' ? ' selected' : ''}>Active Staff</option>
            <option value="all"${staffFilter === 'all' ? ' selected' : ''}>All Staff</option>
            <option value="inactive"${staffFilter === 'inactive' ? ' selected' : ''}>Inactive Staff</option>
            <option value="admin"${staffFilter === 'admin' ? ' selected' : ''}>Admin</option>
            <option value="cashier"${staffFilter === 'cashier' ? ' selected' : ''}>Cashier</option>
            <option value="kitchen"${staffFilter === 'kitchen' ? ' selected' : ''}>Kitchen Staff</option>
          </select></label>
        </div>
        ${rows ? `<div class="table-scroll"><table><thead><tr><th>ID</th><th>Full Name</th><th>Username</th><th>Role</th><th>Status</th><th>Date Created</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState('No accounts match this filter.', '♙')}
      </article>
    </div>
    <div class="staff-modal" id="staffActionModal" role="dialog" aria-modal="true" aria-labelledby="staffActionTitle" aria-describedby="staffActionText" hidden>
      <div class="staff-modal-card">
        <h2 id="staffActionTitle">Confirm staff account action</h2>
        <p id="staffActionText"></p>
        <form id="staffActionForm" method="post" action="index.php?dashboard=admin&staff=1">
          <input type="hidden" id="staffAction" name="action" value="">
          <input type="hidden" name="csrf_token" value="${escapeHTML(auth.csrfToken)}">
          <input type="hidden" id="staffActionAccountId" name="account_id" value="">
          <input type="hidden" id="staffActionStatus" name="is_active" value="">
          <div class="staff-modal-actions">
            <button class="secondary-button" type="button" data-close-staff-action>Cancel</button>
            <button class="danger-button" id="staffActionConfirm" type="submit">Confirm</button>
          </div>
        </form>
      </div>
    </div>
    <div class="staff-modal" id="resetPasswordModal" role="dialog" aria-modal="true" aria-labelledby="resetPasswordTitle" hidden>
      <div class="staff-modal-card">
        <h2 id="resetPasswordTitle">Reset staff password?</h2>
        <p id="resetPasswordText">This will replace the staff member's password and require a password change at next login.</p>
        <form id="resetStaffPasswordForm" method="post" action="index.php?dashboard=admin&staff=1">
          <input type="hidden" name="action" value="reset_staff_password">
          <input type="hidden" name="csrf_token" value="${escapeHTML(auth.csrfToken)}">
          <input type="hidden" id="resetAccountId" name="account_id" value="">
          <div class="staff-modal-actions">
            <button class="secondary-button" type="button" data-close-reset>Cancel</button>
            <button class="danger-button" type="submit">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
    <div class="staff-modal" id="temporaryPasswordModal" role="dialog" aria-modal="true" aria-labelledby="temporaryPasswordTitle"${auth.temporaryPassword ? '' : ' hidden'}>
      <div class="staff-modal-card">
        <h2 id="temporaryPasswordTitle">Temporary password</h2>
        <p>This password is shown once. Give it privately to <strong>${escapeHTML(auth.temporaryPasswordUsername)}</strong>.</p>
        <div class="temporary-password-value"><code id="temporaryPasswordValue">${escapeHTML(auth.temporaryPassword)}</code></div>
        ${auth.temporaryPassword ? '<button class="primary-button" type="button" data-copy-temporary>Copy Temporary Password</button>' : ''}
        <button class="secondary-button staff-modal-dismiss" type="button" data-close-temporary>Close</button>
      </div>
    </div>`;
}

function updateStorageNotice() {
  const notice = document.getElementById('storageNotice');
  if (!notice) return;
  notice.hidden = !storageError;
  notice.textContent = storageError || '';
}

function spectatorBannerMarkup() {
  const roles = [
    ['admin', 'Administrator'],
    ['cashier', 'Cashier'],
    ['kitchen', 'Kitchen Staff']
  ];
  return `<section class="spectator-banner" aria-label="Spectator mode controls">
    <div class="spectator-status"><span class="spectator-eye" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg></span><div><strong>SPECTATOR MODE – VIEW ONLY</strong><small>Static sample data. Editing and transactions are disabled.</small></div></div>
    <nav class="spectator-role-switch" aria-label="Switch dashboard preview">${roles.map(([role, label]) => `<button type="button" class="spectator-role-button${currentUser.role === role ? ' active' : ''}" data-spectator-role="${role}" aria-pressed="${currentUser.role === role}">${label}</button>`).join('')}</nav>
    <button type="button" class="spectator-exit" data-spectator-exit>Exit Spectator Mode</button>
  </section>`;
}

function enforceSpectatorControls(root = document) {
  if (!spectatorMode) return;

  root.querySelectorAll('form').forEach(form => {
    form.setAttribute('aria-disabled', 'true');
    form.action = `${window.location.pathname}?spectator=1`;
  });
  root.querySelectorAll('input, textarea, select').forEach(control => {
    if (control.id === 'operationsDate') return;
    control.disabled = true;
    control.setAttribute('aria-disabled', 'true');
    control.title = 'This feature is disabled in Spectator Mode.';
  });
  root.querySelectorAll('button').forEach(button => {
    const navigationControl =
      button.hasAttribute('data-page') ||
      button.hasAttribute('data-goto') ||
      button.hasAttribute('data-spectator-role') ||
      button.hasAttribute('data-spectator-exit') ||
      button.id === 'menuToggle' ||
      button.id === 'sidebarClose' ||
      button.dataset.action === 'view-order' ||
      button.dataset.action === 'close-order-details' ||
      button.dataset.action === 'print-daily-report' ||
      button.dataset.action === 'export-daily-report';
    if (navigationControl) return;
    button.disabled = true;
    button.title = 'This feature is disabled in Spectator Mode.';
  });
}

function renderDashboard() {
  document.title = `YDUR's Fried & Grill | ${ROLE_NAMES[currentUser.role]}`;
  const links = NAVIGATION[currentUser.role].filter(entry => !staticDemo || entry[0] !== 'staff');
  const navMarkup = links.map(([page, label, icon]) => page === 'logout'
    ? `<button class="nav-link" data-logout><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></button>`
    : `<button class="nav-link${activePage === page ? ' active' : ''}" data-page="${page}"><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></button>`).join('');
  app.innerHTML = `
    <div class="app-shell${spectatorMode ? ' spectator-shell' : ''}">
      <aside class="sidebar" id="sidebar">
        <div class="brand"><img class="brand-logo sidebar-logo" src="../ydurslogo.jpg" alt="YDUR's Fried &amp; Grill logo"><div class="brand-copy"><span class="brand-name">YDUR'S</span><span class="brand-subtitle">FRIED &amp; GRILL</span></div><button class="icon-button sidebar-close" id="sidebarClose" aria-label="Close menu">&times;</button></div>
        <div class="workspace-label">WORKSPACE</div>
        <nav class="main-nav" aria-label="${ROLE_NAMES[currentUser.role]} navigation">${navMarkup}</nav>
        <div class="sidebar-bottom"><div class="user-mini">${roleAvatarMarkup('sidebar-avatar')}<div class="user-mini-info"><strong>${escapeHTML(currentUser.name)}</strong><span>${ROLE_NAMES[currentUser.role]}</span></div></div>${currentUser.role === 'cashier' ? '' : '<button class="logout-button" data-logout>Logout <span aria-hidden="true">↗</span></button>'}</div>
      </aside>
      <div class="sidebar-scrim" id="sidebarScrim"></div>
      <main class="main-area">
        ${spectatorMode ? spectatorBannerMarkup() : ''}
        <header class="topbar"><div class="topbar-left"><button class="icon-button menu-toggle" id="menuToggle" aria-label="Open navigation">☰</button><div class="breadcrumb"><span>YDUR'S FRIED &amp; GRILL</span><b>/</b><strong id="breadcrumbCurrent"></strong></div></div><div class="topbar-actions"><div class="topbar-user">${roleAvatarMarkup('header-avatar')}<div><strong>${escapeHTML(currentUser.name)}</strong><span>${ROLE_NAMES[currentUser.role]}</span></div></div><button class="topbar-logout" data-logout>Logout</button></div></header>
        <section class="content-area"><div class="demo-notice"><span aria-hidden="true">ⓘ</span> ${spectatorMode ? 'Fictional preview information only. No account or transaction data is connected.' : 'Daily Operations uses shared database records. Menu products and POS orders are saved in this browser.'}</div><div class="storage-notice" id="storageNotice" role="alert" hidden></div><section class="page-view active" id="pageContent"></section><footer class="page-footer"><span>© 2026 YDUR's Fried &amp; Grill</span><span>${spectatorMode ? 'Static preview data · no changes saved' : 'Restaurant Management System <b>•</b> Daily Operations saved to database'}</span></footer></section>
      </main>
    </div><div class="toast" id="appToast" role="status" aria-live="polite"></div>`;
  updatePage();
    if (!dashboardEventsBound) {
      app.addEventListener('click', handleClick);
      app.addEventListener('submit', handleSubmit);
      app.addEventListener('change', handleChange);
      app.addEventListener('input', handleInput);
      window.addEventListener('storage', handleStorageChange);
      dashboardEventsBound = true;
    }
  if (!spectatorMode && dailyOperationsRefreshTimer === null) {
    dailyOperationsRefreshTimer = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return;
      const currentDate = philippinesDateKey();
      if (dailyOperationsFollowToday && dailyOperationsDate !== currentDate) {
        dailyOperationsDate = currentDate;
        dailyOperationsData = null;
        dailyOperationsRequest++;
      }
      if (activePage === 'daily-operations') {
        refreshDailyOperations(true);
      } else if (activePage === 'sales-history') {
        refreshSalesHistory(true);
      }
    }, 15000);
  }
  document.getElementById('menuToggle').addEventListener('click', () => toggleSidebar(true));
  document.getElementById('sidebarClose').addEventListener('click', () => toggleSidebar(false));
  document.getElementById('sidebarScrim').addEventListener('click', () => toggleSidebar(false));
}

function roleAvatarMarkup(sizeClass) {
  const imagePath = ROLE_AVATARS[currentUser.role];
  if (!imagePath) {
    return `<div class="avatar ${sizeClass}" aria-hidden="true">${escapeHTML(currentUser.name.charAt(0))}</div>`;
  }
  return `<img class="avatar role-avatar ${sizeClass}" src="${imagePath}" alt="${ROLE_NAMES[currentUser.role]} profile avatar" decoding="async">`;
}

function updatePage() {
  const item = NAVIGATION[currentUser.role].find(entry => entry[0] === activePage);
  document.getElementById('breadcrumbCurrent').textContent = item ? item[1] : 'Dashboard';
  document.getElementById('pageContent').innerHTML = pageContent(currentUser.role, activePage);
  setupPasswordValidation(document);
  document.querySelectorAll('.nav-link[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === activePage));
  updateStorageNotice();
  enforceSpectatorControls();
  refreshDailyOperations();
  refreshSalesHistory();
}

function navigateTo(page) {
  if (!NAVIGATION[currentUser.role].some(item => item[0] === page)) return;
  if (!spectatorMode) {
    if (page !== activePage && activePage === 'new-order') draftOrder = null;
    if (page === 'new-order' && activePage !== 'new-order') draftOrder = createDraft();
    if (page === 'daily-operations' && activePage !== 'daily-operations') dailyOperationsData = null;
  }
  activePage = page;
  if (spectatorMode) window.history.replaceState(null, '', spectatorUrl(currentUser.role, page));
  updatePage();
  toggleSidebar(false);
}

function switchSpectatorRole(role) {
  if (!spectatorMode || !Object.prototype.hasOwnProperty.call(ROLE_NAMES, role)) return;
  currentUser = { ...currentUser, name: `${ROLE_NAMES[role]} Preview`, role };
  activePage = 'dashboard';
  draftOrder = null;
  window.history.replaceState(null, '', spectatorUrl(role, activePage));
  renderDashboard();
}

function exitSpectatorMode() {
  if (!spectatorMode) return;
  window.location.replace(`${window.location.pathname}?spectator_exit=1`);
}

function toggleSidebar(open) {
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('sidebarScrim').classList.toggle('show', open);
}

function logout() {
<<<<<<< HEAD
  if (staticDemo) {
    currentUser = null;
    activePage = 'dashboard';
    showLogin();
    return;
  }
=======
  if (spectatorMode) return exitSpectatorMode();
>>>>>>> newestbranch
  const form = document.createElement('form');
  form.method = 'post';
  form.action = window.location.pathname;
  form.hidden = true;
  form.innerHTML = `<input name="action" value="logout"><input name="csrf_token" value="${escapeHTML(auth.csrfToken)}">`;
  document.body.appendChild(form);
  form.submit();
}

function showToast(message) {
  const toast = document.getElementById('appToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function syncDraftFields() {
  if (!draftOrder) return;
  const customer = document.getElementById('customerName');
  const orderType = document.getElementById('orderType');
  const instructions = document.getElementById('specialInstructions');
  if (customer) draftOrder.customer = customer.value.trim();
  if (orderType) draftOrder.type = orderType.value;
  if (instructions) draftOrder.instructions = instructions.value.trim();
}

function handleClick(event) {
  const target = event.target.closest('button');
  if (!target) return;
  if (spectatorMode) {
    if (target.hasAttribute('data-spectator-exit')) return exitSpectatorMode();
    if (target.dataset.spectatorRole) return switchSpectatorRole(target.dataset.spectatorRole);
    if (target.id === 'menuToggle' || target.id === 'sidebarClose') return;
    if (target.dataset.page) return navigateTo(target.dataset.page);
    if (target.dataset.goto) return navigateTo(target.dataset.goto);
    if (target.dataset.action === 'view-order') {
      expandedOrderId = expandedOrderId === target.dataset.orderId ? '' : target.dataset.orderId;
      return updatePage();
    }
    if (target.dataset.action === 'close-order-details') {
      expandedOrderId = '';
      return updatePage();
    }
    if (target.dataset.action === 'print-daily-report') return printDailyOperationsReport();
    if (target.dataset.action === 'export-daily-report') return exportDailyOperationsReport();
    return blockSpectatorAction();
  }
  if (target.hasAttribute('data-logout')) return logout();
  if (target.dataset.passwordToggle) {
    const input = document.getElementById(target.dataset.passwordToggle);
    if (input) {
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      target.classList.toggle('is-visible', visible);
      target.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
      target.setAttribute('aria-pressed', String(visible));
      input.focus();
    }
    return;
  }
  if (target.dataset.staffAction) {
    const action = target.dataset.staffAction;
    const accountId = target.dataset.accountId;
    const accountName = target.dataset.accountName;
    const modal = document.getElementById('staffActionModal');
    const title = document.getElementById('staffActionTitle');
    const text = document.getElementById('staffActionText');
    const confirmButton = document.getElementById('staffActionConfirm');
    document.getElementById('staffActionAccountId').value = accountId;
    document.getElementById('staffAction').value =
      action === 'delete' ? 'delete_staff' : 'set_staff_status';

    if (action === 'deactivate') {
      title.textContent = 'Deactivate staff account?';
      text.textContent = `${accountName} will no longer be able to log in. Their account and all related transaction records will be preserved.`;
      document.getElementById('staffActionStatus').value = '0';
      confirmButton.textContent = 'Deactivate';
    } else if (action === 'reactivate') {
      title.textContent = 'Reactivate staff account?';
      text.textContent = `Restore ${accountName}'s ability to log in, provided their password is valid.`;
      document.getElementById('staffActionStatus').value = '1';
      confirmButton.textContent = 'Reactivate';
    } else {
      title.textContent = 'Delete staff account permanently?';
      text.textContent = `Permanently remove ${accountName}'s unused account? This cannot be undone. No transaction records will be deleted.`;
      document.getElementById('staffActionStatus').value = '';
      confirmButton.textContent = 'Delete Permanently';
    }

    modal.hidden = false;
    confirmButton.focus();
    return;
  }
  if (target.hasAttribute('data-close-staff-action')) {
    document.getElementById('staffActionModal').hidden = true;
    return;
  }
  if (target.dataset.resetAccount) {
    const modal = document.getElementById('resetPasswordModal');
    document.getElementById('resetAccountId').value = target.dataset.resetAccount;
    document.getElementById('resetPasswordText').textContent =
      `Reset the password for ${target.dataset.resetUsername}? The employee will be required to change it at next login.`;
    modal.hidden = false;
    return;
  }
  if (target.hasAttribute('data-close-reset')) {
    document.getElementById('resetPasswordModal').hidden = true;
    return;
  }
  if (target.hasAttribute('data-close-temporary')) {
    document.getElementById('temporaryPasswordModal').hidden = true;
    return;
  }
  if (target.hasAttribute('data-copy-temporary')) {
    const value = document.getElementById('temporaryPasswordValue').textContent;
    const copy = navigator.clipboard
      ? navigator.clipboard.writeText(value)
      : Promise.reject(new Error('Clipboard unavailable'));
    copy.then(() => showToast('Temporary password copied.'))
      .catch(() => showToast('Copy unavailable. Select and copy the password manually.'));
    return;
  }
  if (target.dataset.page) return navigateTo(target.dataset.page);
  if (target.dataset.goto) return navigateTo(target.dataset.goto);
  const action = target.dataset.action;
  if (!action) return;
  if (action === 'toggle-daily-operation') return changeDailyOperationStatus(target.dataset.status);
  if (action === 'update-daily-order') return updateDailyOrderStatus(target.dataset.orderId, target.dataset.status);
  if (action === 'view-closed-operation') return openClosedOperation(target.dataset.date);
  if (action === 'print-sales-history') return printSalesHistory();
  if (action === 'export-sales-history') return exportSalesHistory();
  if (action === 'reload-sales-history') {
    salesHistoryData = null;
    return refreshSalesHistory(true);
  }
  if (action === 'reload-daily-operations') {
    dailyOperationsData = null;
    return refreshDailyOperations(true);
  }
  if (action === 'print-daily-report') return printDailyOperationsReport();
  if (action === 'export-daily-report') return exportDailyOperationsReport();
  if (action === 'add-product' || action === 'increase-item' || action === 'decrease-item' || action === 'remove-item') {
    syncDraftFields();
    const id = target.dataset.productId;
    const quantity = Number(draftOrder.cart[id] || 0);
    if (action === 'add-product' || action === 'increase-item') draftOrder.cart[id] = quantity + 1;
    if (action === 'decrease-item' && quantity > 1) draftOrder.cart[id] = quantity - 1;
    if (action === 'decrease-item' && quantity <= 1 || action === 'remove-item') delete draftOrder.cart[id];
    return updatePage();
  }
  if (action === 'cancel-order') {
    draftOrder = null;
    navigateTo('dashboard');
    return showToast('Order draft cancelled.');
  }
  if (action === 'confirm-order') return confirmOrder();
  if (action === 'view-order') {
    expandedOrderId = expandedOrderId === target.dataset.orderId ? '' : target.dataset.orderId;
    return updatePage();
  }
  if (action === 'close-order-details') {
    expandedOrderId = '';
    return updatePage();
  }
  if (action === 'advance-kitchen-order') return advanceKitchenOrder(target.dataset.orderId);
  if (action === 'complete-kitchen-order') return completeKitchenOrder(target.dataset.orderId);
  if (action === 'cancel-recorded-order') return cancelRecordedOrder(target.dataset.orderId);
  if (action === 'delete-product') return deleteProduct(target.dataset.productId);
  if (action === 'print-receipt') return printReceipt(target.dataset.orderId);
}

function evaluatePasswordStrength(password) {
  if (!password) return { level: 'empty', label: 'Password strength', segments: 0 };

  const length = Array.from(password).length;
  const categories = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ].filter(Boolean).length;

  if (length < 8) return { level: 'weak', label: 'Weak', segments: 1 };
  if (length < 12) {
    return categories >= 3
      ? { level: 'medium', label: 'Medium', segments: 2 }
      : { level: 'weak', label: 'Weak', segments: 1 };
  }
  if (categories >= 4) return { level: 'strong', label: 'Strong', segments: 4 };
  if (categories >= 2) return { level: 'medium', label: 'Medium', segments: 3 };
  return { level: 'medium', label: 'Medium', segments: 2 };
}

function updatePasswordValidation(form) {
  const password = form.querySelector('[name="password"], [name="new_password"]');
  const confirm = form.querySelector('[name="confirm_password"]');
  if (!password) return;

  const strength = evaluatePasswordStrength(password.value);
  const indicator = form.querySelector('[data-password-strength]');
  if (indicator) {
    indicator.dataset.level = strength.level;
    indicator.querySelector('[data-strength-label]').textContent = strength.label;
    indicator.querySelectorAll('[data-strength-segment]').forEach((segment, index) => {
      segment.classList.toggle('active', index < strength.segments);
    });
  }

  password.setCustomValidity(Array.from(password.value).length < 12
    ? 'Password must contain at least 12 characters.'
    : '');

  if (!confirm) return;
  const hasConfirmation = confirm.value !== '';
  const matches = hasConfirmation && confirm.value === password.value;
  confirm.classList.toggle('password-match', hasConfirmation && matches);
  confirm.classList.toggle('password-mismatch', hasConfirmation && !matches);
  confirm.setCustomValidity(hasConfirmation && !matches
    ? 'Passwords do not match.'
    : '');

  const feedback = form.querySelector('[data-confirm-feedback]');
  const statusIcon = form.querySelector('[data-confirm-icon]');
  if (statusIcon) {
    statusIcon.hidden = !hasConfirmation;
    if (hasConfirmation) {
      statusIcon.className = `password-confirm-icon ${matches ? 'match' : 'mismatch'}`;
      statusIcon.textContent = matches ? '✓' : '✕';
    }
  }
  if (feedback) {
    feedback.className = 'password-confirm-feedback';
    feedback.hidden = !hasConfirmation;
    if (hasConfirmation) {
      feedback.classList.add(matches ? 'match' : 'mismatch');
      feedback.innerHTML = matches
        ? '<span class="password-status-icon" aria-hidden="true">✓</span><span>Passwords match.</span>'
        : '<span class="password-status-icon" aria-hidden="true">✕</span><span>Passwords do not match.</span>';
    } else {
      feedback.textContent = '';
    }
  }
}

function setupPasswordValidation(root) {
  root.querySelectorAll('#staffCreateForm, #changePasswordForm').forEach(form => {
    updatePasswordValidation(form);
  });
}

function validatePasswordForm(form) {
  updatePasswordValidation(form);
  const password = form.querySelector('[name="password"], [name="new_password"]');
  const confirm = form.querySelector('[name="confirm_password"]');

  if (!password || Array.from(password.value).length < 12) {
    showToast('Password must contain at least 12 characters.');
    return false;
  }
  if (confirm && confirm.value === '') {
    showToast('Please confirm the password.');
    return false;
  }
  if (confirm && confirm.value !== password.value) {
    showToast('Passwords do not match.');
    return false;
  }
  return true;
}

function handleSubmit(event) {
  if (spectatorMode) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return blockSpectatorAction();
  }
  const form = event.target;
  if (!form.matches('form')) return;
  if (form.id === 'staffCreateForm' || form.id === 'changePasswordForm') {
    if (!validatePasswordForm(form)) {
      event.preventDefault();
      return;
    }
  }
  if (
    form.id === 'staffCreateForm' ||
    form.id === 'staffStatusForm' ||
    form.id === 'staffActionForm' ||
    form.id === 'changePasswordForm' ||
    form.id === 'resetStaffPasswordForm' ||
    form.classList.contains('staff-status-form')
  ) {
    return;
  }
  event.preventDefault();
  if (
    form.id === 'operationCreateForm' ||
    form.id === 'operationSettingsForm' ||
    form.id === 'dailyOrderForm' ||
    form.id === 'dailyPaymentForm'
  ) return submitDailyOperationsForm(form);
  if (form.id === 'salesHistoryFilter') return applySalesHistoryFilter(form);
  if (form.id === 'historySearch') {
    historySearch = new FormData(form).get('query').trim();
    return updatePage();
  }
  if (form.id === 'productCreateForm') return addProduct(form);
  if (form.id === 'paymentForm') return confirmPayment(form);
  if (form.classList.contains('product-edit-form')) return updateProduct(form);
}

function handleChange(event) {
  if (event.target.id === 'operationsDate') {
    if (!event.target.value) return;
    dailyOperationsDate = event.target.value;
    dailyOperationsFollowToday = dailyOperationsDate === philippinesDateKey();
    dailyOperationsData = null;
    dailyOperationsRequest++;
    dailyOperationsLoading = false;
    updatePage();
    return;
  }
  if (spectatorMode) return;
  if (event.target.id === 'staffFilter') {
    staffFilter = event.target.value;
    updatePage();
  }
  if (event.target.id === 'historyStatus') {
    historyStatus = event.target.value;
    updatePage();
  }
  if (event.target.id === 'posOrder') {
    selectedPosOrderId = event.target.value;
    paymentReceived = '';
    updatePage();
  }
  if (event.target.id === 'dailyPaymentOrder') {
    const option = event.target.selectedOptions[0];
    const amount = document.getElementById('dailyPaymentAmount');
    if (option && amount) {
      amount.value = option.dataset.remaining || '';
      amount.max = option.dataset.remaining || '';
    }
  }
  if (event.target.id === 'orderType' && draftOrder) draftOrder.type = event.target.value;
}

function handleInput(event) {
  if (spectatorMode) return;
  const target = event.target;
  if (target.matches('[data-product-quantity]')) {
    const total = Array.from(document.querySelectorAll('[data-product-quantity]'))
      .reduce((sum, input) => sum + Math.max(0, Number(input.value) || 0) * Number(input.dataset.price || 0), 0);
    const totalElement = document.getElementById('operationsOrderTotal');
    if (totalElement) totalElement.textContent = money(total);
  }
  if (target.matches('[name="password"], [name="new_password"], [name="confirm_password"]')) {
    const form = target.closest('form');
    if (form) updatePasswordValidation(form);
  }
  if (target.id === 'customerName' && draftOrder) draftOrder.customer = target.value;
  if (target.id === 'specialInstructions' && draftOrder) draftOrder.instructions = target.value;
  if (target.id === 'amountReceived') {
    paymentReceived = target.value;
    const order = getOrders().find(record => record.id === selectedPosOrderId);
    const changeElement = document.getElementById('paymentChange');
    const validation = document.getElementById('paymentValidation');
    const amount = Number(paymentReceived);
    const valid = order && Number.isFinite(amount) && amount >= Number(order.total);
    if (changeElement) changeElement.textContent = money(valid ? amount - order.total : 0);
    if (validation) validation.textContent = paymentReceived && !valid ? 'Amount received must cover the order total.' : '';
  }
}

function handleStorageChange(event) {
  if (spectatorMode) return;
  if (event.key !== STORAGE_KEYS.products && event.key !== STORAGE_KEYS.transactions) return;
  if (activePage === 'new-order') syncDraftFields();
  updatePage();
}

function confirmOrder() {
  if (blockSpectatorAction()) return;
  syncDraftFields();
  const items = cartItems().map(item => ({
    productId: item.id,
    name: item.name,
    category: item.category,
    unitPrice: Number(item.price),
    quantity: item.quantity
  }));
  if (!items.length) return showToast('Add at least one product before confirming.');
  if (items.some(item => !Number.isFinite(item.unitPrice) || item.unitPrice <= 0 || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    return showToast('Order contains an invalid product price or quantity.');
  }
  const orders = getOrders();
  if (storageError) return showToast(storageError);
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const order = {
    id: draftOrder.id,
    customer: draftOrder.customer,
    type: draftOrder.type,
    instructions: draftOrder.instructions,
    items,
    subtotal: total,
    total,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    paymentMethod: '',
    createdAt: new Date().toISOString()
  };
  if (orders.some(record => record.id === order.id)) order.id = generateOrderId();
  if (!saveOrders([order, ...orders])) return;
  draftOrder = null;
  expandedOrderId = order.id;
  activePage = 'order-history';
  updatePage();
  showToast(`Order ${order.id} confirmed and sent to the kitchen.`);
}

function advanceKitchenOrder(orderId) {
  if (blockSpectatorAction()) return;
  const orders = getOrders();
  const order = orders.find(record => record.id === orderId);
  if (!order || !['Pending', 'Preparing'].includes(order.status)) return;
  order.status = order.status === 'Pending' ? 'Preparing' : 'Ready';
  if (!saveOrders(orders)) return;
  updatePage();
  showToast(`${order.id} is now ${order.status}.`);
}

function completeKitchenOrder(orderId) {
  if (blockSpectatorAction()) return;
  const orders = getOrders();
  const order = orders.find(record => record.id === orderId);
  if (!order || order.status !== 'Ready') return;
  order.status = 'Completed';
  if (!saveOrders(orders)) return;
  updatePage();
  showToast(`${order.id} marked completed.`);
}

function cancelRecordedOrder(orderId) {
  if (blockSpectatorAction()) return;
  const orders = getOrders();
  const order = orders.find(record => record.id === orderId);
  if (!order || order.status !== 'Pending' || order.paymentStatus === 'Paid') return;
  order.status = 'Cancelled';
  if (!saveOrders(orders)) return;
  updatePage();
  showToast(`${order.id} cancelled.`);
}

function addProduct(form) {
  if (blockSpectatorAction()) return;
  const data = new FormData(form);
  const requestedName = String(data.get('name') || '').trim();
  const name = PROVIDED_MENU_PRODUCT_NAMES.find(productName => productName.toLowerCase() === requestedName.toLowerCase()) || '';
  const price = Number(data.get('price'));
  const availability = String(data.get('isAvailable') || '');
  if (!name || !Number.isFinite(price) || price <= 0 || !['true', 'false'].includes(availability)) {
    return showToast('Choose a listed menu item and enter a valid price and availability.');
  }
  const products = getProducts();
  if (storageError) return showToast(storageError);
  if (products.some(product => String(product.name || '').trim().toLowerCase() === name.toLowerCase())) {
    return showToast(`${name} is already in the menu.`);
  }
  products.push({
    id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    category: '',
    description: '',
    price,
    isAvailable: availability === 'true'
  });
  if (!saveProducts(products)) return;
  updatePage();
  showToast(`${name} added to the menu.`);
}

function updateProduct(form) {
  if (blockSpectatorAction()) return;
  const data = new FormData(form);
  const requestedName = String(data.get('name') || '').trim();
  const name = PROVIDED_MENU_PRODUCT_NAMES.find(productName => productName.toLowerCase() === requestedName.toLowerCase()) || '';
  const price = Number(data.get('price'));
  const availability = String(data.get('isAvailable') || '');
  if (!name || !Number.isFinite(price) || price <= 0 || !['true', 'false'].includes(availability)) {
    return showToast('Choose a listed menu item and enter a valid price and availability.');
  }
  const products = getProducts();
  const product = products.find(record => record.id === form.dataset.productId);
  if (!product) return showToast('That menu product could not be found.');
  if (products.some(record => record.id !== product.id && String(record.name || '').trim().toLowerCase() === name.toLowerCase())) {
    return showToast(`${name} is already in the menu.`);
  }
  product.name = name;
  product.price = price;
  product.isAvailable = availability === 'true';
  if (!saveProducts(products)) return;
  updatePage();
  showToast(`${product.name} updated. Existing orders are unchanged.`);
}

function deleteProduct(productId) {
  if (blockSpectatorAction()) return;
  const products = getProducts();
  const product = products.find(record => record.id === productId);
  if (!product) return showToast('That menu product could not be found.');
  if (!window.confirm(`Remove ${product.name} from the menu? Existing orders will be kept.`)) return;
  if (!saveProducts(products.filter(record => record.id !== productId))) return;
  updatePage();
  showToast(`${product.name} removed from the menu.`);
}

function confirmPayment(form) {
  if (blockSpectatorAction()) return;
  const amount = Number(new FormData(form).get('amountReceived'));
  if (!Number.isFinite(amount) || amount < 0) return showToast('Enter a valid amount received.');
  const orders = getOrders();
  const order = orders.find(record => record.id === selectedPosOrderId);
  if (!order || order.paymentStatus === 'Paid' || order.status === 'Cancelled') return showToast('Select an available unpaid order.');
  if (amount < order.total) {
    document.getElementById('paymentValidation').textContent = 'Amount received must cover the order total.';
    return showToast('Payment is less than the order total.');
  }
  const sales = getSales();
  if (storageError) return showToast(storageError);
  if (sales.some(sale => sale.orderId === order.id)) return showToast('A sale for this order already exists.');
  const sale = {
    orderId: order.id,
    method: 'Cash',
    total: Number(order.total),
    amountReceived: amount,
    change: amount - order.total,
    paidAt: new Date().toISOString()
  };
  order.paymentStatus = 'Paid';
  order.paymentMethod = 'Cash';
  order.paidAt = sale.paidAt;
  if (!saveTransactions(orders, [sale, ...sales])) return;
  paymentReceived = '';
  lastReceiptOrderId = order.id;
  updatePage();
  showToast(`Payment confirmed for ${order.id}.`);
}

function printReceipt(orderId) {
  if (blockSpectatorAction()) return;
  const sale = getSales().find(record => record.orderId === orderId);
  const order = getOrders().find(record => record.id === orderId);
  if (!sale || !order) return showToast('Receipt details could not be found.');
  const printWindow = window.open('', '_blank', 'width=420,height=700');
  if (!printWindow) return showToast('Allow pop-ups to print this receipt.');
  printWindow.document.write(`<!doctype html><html><head><title>Receipt ${escapeHTML(order.id)}</title><style>body{font:14px Arial,sans-serif;max-width:340px;margin:24px auto;color:#25231f}h1{text-align:center;font-size:20px}p{text-align:center;color:#625b52}.line{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #ccc}.total{font-weight:bold;font-size:17px}.footer{text-align:center;margin-top:24px}@media print{body{margin:0 auto}}</style></head><body><h1>YDUR'S FRIED &amp; GRILL</h1><p>Customer receipt · ${escapeHTML(dateTime(sale.paidAt))}</p><div class="line"><strong>Order</strong><span>${escapeHTML(order.id)}</span></div><div class="line"><strong>Customer</strong><span>${escapeHTML(order.customer || 'Walk-in')}</span></div>${order.items.map(item => `<div class="line"><span>${escapeHTML(item.quantity)} × ${escapeHTML(item.name)}</span><span>${money(item.quantity * item.unitPrice)}</span></div>`).join('')}<div class="line total"><span>Total</span><span>${money(sale.total)}</span></div><div class="line"><span>Payment</span><span>Cash</span></div><div class="line"><span>Received</span><span>${money(sale.amountReceived)}</span></div><div class="line"><span>Change</span><span>${money(sale.change)}</span></div><p class="footer">Thank you for dining with us!</p><script>window.onload=function(){window.print();};<\/script></body></html>`);
  printWindow.document.close();
}

function showChangePassword() {
  document.title = "YDUR's Fried & Grill | Change password";
  app.innerHTML = `
    <main class="login-layout">
      <section class="login-brand-panel" aria-label="YDUR's Fried & Grill">
        <div class="login-brand">
          <img class="brand-logo login-logo" src="../ydurslogo.jpg" alt="YDUR's Fried &amp; Grill logo">
          <div class="brand-copy"><span class="brand-name">YDUR'S</span><span class="brand-subtitle">FRIED &amp; GRILL</span></div>
        </div>
        <div class="login-welcome">
          <p class="eyebrow">ACCOUNT SECURITY</p>
          <h1>Create a new<br>password.</h1>
          <p>Your temporary password must be changed before you can access the workspace.</p>
        </div>
        <p class="login-brand-footer">Fresh from our grill, made for your table.</p>
      </section>
      <section class="login-form-panel">
        <form class="login-card" id="changePasswordForm" method="post" action="index.php?change_password=1">
          <div class="login-card-brand"><img class="brand-logo login-card-logo" src="../ydurslogo.jpg" alt="YDUR's Fried &amp; Grill logo"></div>
          <p class="eyebrow">PASSWORD UPDATE</p>
          <h2>Change password</h2>
          ${auth.staffError ? `<div class="login-error">${escapeHTML(auth.staffError)}</div>` : ''}
          <input type="hidden" name="action" value="change_password">
          <input type="hidden" name="csrf_token" value="${escapeHTML(auth.csrfToken)}">
          <label class="field-label" for="newPassword">New Password</label>
          <div class="password-field">
            <input class="form-control" id="newPassword" name="new_password" type="password" minlength="12" autocomplete="new-password" required>
            <button class="password-toggle" type="button" data-password-toggle="newPassword" aria-label="Show new password" aria-pressed="false">
              <svg class="password-eye password-eye-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="password-eye password-eye-off" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-2.1 3M6.4 6.4C3.6 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.1-.9"/></svg>
            </button>
          </div>
          <div class="password-strength" data-password-strength data-level="empty" aria-live="polite">
            <div class="password-strength-heading"><span>Password strength</span><strong data-strength-label>Password strength</strong></div>
            <div class="password-strength-bar" aria-hidden="true"><span data-strength-segment></span><span data-strength-segment></span><span data-strength-segment></span><span data-strength-segment></span></div>
            <p class="password-strength-hint">Use at least 12 characters with uppercase, lowercase, numbers, and symbols.</p>
          </div>
          <label class="field-label" for="confirmPassword">Confirm New Password</label>
          <div class="password-field confirmation-field">
            <input class="form-control" id="confirmPassword" name="confirm_password" type="password" minlength="12" autocomplete="new-password" required>
            <button class="password-toggle" type="button" data-password-toggle="confirmPassword" aria-label="Show confirm password" aria-pressed="false">
              <svg class="password-eye password-eye-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="password-eye password-eye-off" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-2.1 3M6.4 6.4C3.6 8.3 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.1-.9"/></svg>
            </button>
            <span class="password-confirm-icon" data-confirm-icon hidden></span>
          </div>
          <div class="password-confirm-feedback" data-confirm-feedback hidden></div>
          <button class="primary-button login-submit" type="submit">Update Password <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </main>`;

  app.querySelectorAll('[data-password-toggle]').forEach(button => {
    button.addEventListener('click', event => {
      const input = document.getElementById(event.currentTarget.dataset.passwordToggle);
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      event.currentTarget.classList.toggle('is-visible', visible);
      event.currentTarget.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
      event.currentTarget.setAttribute('aria-pressed', String(visible));
      input.focus();
    });
  });
  setupPasswordValidation(app);
  app.addEventListener('submit', handleSubmit);
  app.addEventListener('input', handleInput);
}

if (spectatorMode) {
  app.classList.add('spectator-mode');
  renderDashboard();
} else {
  if (!spectatorExit) initializeMenuData();
  if (!currentUser) {
    if (requestedRole !== null) window.history.replaceState(null, '', window.location.pathname);
    showLogin();
  } else if (
    params.get('change_password') === '1' ||
    Number(currentUser.must_change_password) === 1
  ) {
    showChangePassword();
  } else if (!requestedRole) {
    window.location.replace(dashboardUrl(currentUser.role));
  } else if (requestedRole !== currentUser.role) {
    window.location.replace(dashboardUrl(currentUser.role));
  } else {
    renderDashboard();
  }
}
