const ROLE_NAMES = {
  admin: 'Administrator',
  cashier: 'Cashier',
  kitchen: 'Kitchen Staff'
};

const NAVIGATION = {
  admin: [
    ['dashboard', 'Dashboard', '▦'],
    ['orders', 'Orders', '▤'],
    ['kitchen', 'Kitchen Monitoring', '♨'],
    ['menu', 'Menu Management', '☷'],
    ['pos', 'POS / Sales', '₱'],
    ['inventory', 'Inventory Management', '▣'],
    ['suppliers', 'Supplier Management', '♧'],
    ['purchases', 'Purchase Management', '▧'],
    ['reports', 'Reports', '▥'],
    ['staff', 'Staff / User Management', '♙'],
    ['settings', 'Settings', '⚙']
  ],
  cashier: [
    ['dashboard', 'Dashboard', '▦'],
    ['new-order', 'New Order', '＋'],
    ['order-history', 'Order History', '▤'],
    ['pos', 'POS / Sales', '₱'],
    ['menu', 'Menu / View Products', '☷'],
    ['logout', 'Logout', '↗']
  ],
  kitchen: [
    ['dashboard', 'Dashboard', '▦'],
    ['incoming', 'Incoming Orders', '▤'],
    ['preparing', 'Preparing Orders', '♨'],
    ['completed', 'Completed Orders', '✓']
  ]
};

const STORAGE_KEYS = {
  products: 'ydurProducts',
  transactions: 'ydurTransactions'
};

const DEMO_PRODUCTS = [
  { id: 'demo-chicken', name: 'Grilled Chicken', category: 'Grilled', price: 150, icon: '🍗', demonstration: true },
  { id: 'demo-bbq', name: 'Pork BBQ', category: 'Grilled', price: 120, icon: '🍢', demonstration: true },
  { id: 'demo-seafood', name: 'Grilled Seafood', category: 'Seafood', price: 180, icon: '🦐', demonstration: true },
  { id: 'demo-fries', name: 'French Fries', category: 'Sides', price: 80, icon: '🍟', demonstration: true },
  { id: 'demo-iced-tea', name: 'Iced Tea', category: 'Beverages', price: 35, icon: '🥤', demonstration: true }
];

const app = document.getElementById('app');
const staticDemo = window.YDUR_STATIC_DEMO === true;
const params = new URLSearchParams(window.location.search);
const requestedRole = params.get('dashboard');
const auth = window.YDUR_AUTH || { user: null, csrfToken: '', loginError: '', staffAccounts: [], staffMessage: '', staffError: '', temporaryPassword: '', temporaryPasswordUsername: '' };
let currentUser = auth.user;
let activePage = params.get('staff') === '1' ? 'staff' : 'dashboard';
let staffFilter = 'active';
let storageError = '';
let draftOrder = null;
let historySearch = '';
let historyStatus = 'All';
let expandedOrderId = '';
let selectedPosOrderId = '';
let paymentReceived = '';
let lastReceiptOrderId = '';
let toastTimer;

function dashboardUrl(role) {
  return `${window.location.pathname}?dashboard=${encodeURIComponent(role)}`;
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

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    storageError = `Browser storage could not read ${key}: ${error.message}`;
    return fallback;
  }
}

function writeStored(key, value) {
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

function ensureDemoProducts() {
  try {
    if (localStorage.getItem(STORAGE_KEYS.products) === null) {
      writeStored(STORAGE_KEYS.products, DEMO_PRODUCTS);
    }
    if (localStorage.getItem(STORAGE_KEYS.transactions) === null) {
      writeStored(STORAGE_KEYS.transactions, { orders: [], sales: [] });
    }
  } catch (error) {
    storageError = `Browser storage could not initialize demonstration products: ${error.message}`;
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
  return readCollection(STORAGE_KEYS.products);
}

function getTransactionData() {
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
  if (storageError) {
    showToast(storageError);
    return false;
  }
  const data = getTransactionData();
  return storageError ? false : writeStored(STORAGE_KEYS.transactions, { ...data, orders: records });
}

function saveProducts(records) {
  if (storageError) {
    showToast(storageError);
    return false;
  }
  return writeStored(STORAGE_KEYS.products, records);
}

function saveSales(records) {
  if (storageError) {
    showToast(storageError);
    return false;
  }
  const data = getTransactionData();
  return storageError ? false : writeStored(STORAGE_KEYS.transactions, { ...data, sales: records });
}

function saveTransactions(orders, sales) {
  if (storageError) {
    showToast(storageError);
    return false;
  }
  return writeStored(STORAGE_KEYS.transactions, { orders, sales });
}

function showLogin() {
  document.title = "YDUR's Fried & Grill | Sign in";
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
            <p class="security-note">GitHub Pages supports this browser-only demo. Database-backed sign-in requires a PHP-enabled server such as XAMPP.</p>
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
          <p>Welcome to your restaurant workspace. Sign in with your staff account to continue.</p>
        </div>
        <p class="login-brand-footer">Fresh from our grill, made for your table.</p>
      </section>
      <section class="login-form-panel">
        <form class="login-card" id="loginForm" novalidate>
          <div class="login-card-brand"><div class="brand-mark" aria-hidden="true">Y</div></div>
          <p class="eyebrow">STAFF ACCESS</p>
          <h2>Welcome back</h2>
          <p class="login-intro">Sign in to your YDUR's Fried &amp; Grill account.</p>
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
}

function emptyState(message, icon) {
  return `<div class="empty-state"><span class="empty-state-icon" aria-hidden="true">${icon || '◇'}</span><p>${message}</p></div>`;
}

function statCard(label, value, icon) {
  return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div></article>`;
}

function getTodayOrders() {
  const today = new Date().toDateString();
  return getOrders().filter(order => new Date(order.createdAt).toDateString() === today);
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
    <div class="detail-items">${order.items.map(item => `<div class="detail-item"><span><strong>${escapeHTML(item.name)}</strong><small>${item.quantity} × ${money(item.unitPrice)}</small></span>${includePrices ? `<b>${money(item.quantity * item.unitPrice)}</b>` : `<b>× ${item.quantity}</b>`}</div>`).join('')}</div>
    ${order.instructions ? `<p class="detail-note"><strong>Special instructions:</strong> ${escapeHTML(order.instructions)}</p>` : ''}
    ${includePrices ? `<div class="detail-total"><span>Order total</span><strong>${money(order.total)}</strong></div><p class="detail-note">Payment: ${escapeHTML(order.paymentStatus)}${order.paymentMethod ? ` · ${escapeHTML(order.paymentMethod)}` : ''}</p>` : ''}
    ${includePrices && order.status === 'Pending' && order.paymentStatus !== 'Paid' ? `<button class="secondary-button cancel-recorded-order" data-action="cancel-recorded-order" data-order-id="${escapeHTML(order.id)}">Cancel order</button>` : ''}
  </article>`;
}

function dashboardContent(role) {
  const orders = getOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const todaySales = getSales().filter(sale => new Date(sale.paidAt).toDateString() === new Date().toDateString())
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

function productArt(product) {
  const icon = escapeHTML(product.icon || '🍽️');
  return `<svg class="product-art" viewBox="0 0 240 130" role="img" aria-label="${escapeHTML(product.name)} illustration">
    <rect width="240" height="130" rx="12" fill="#f6e5d7"/>
    <circle cx="120" cy="65" r="44" fill="#fff" opacity=".8"/>
    <text x="120" y="82" text-anchor="middle" font-size="54">${icon}</text>
  </svg>`;
}

function productCards(products, allowAdd) {
  if (!products.length) return emptyState('No menu products available. Ask an Administrator to add products.', '☷');
  return `<div class="product-grid">${products.map(product => `<article class="product-card">
    ${productArt(product)}
    <div class="product-card-body">
      <div class="product-card-meta"><span>${escapeHTML(product.category)}</span>${product.demonstration ? '<span class="sample-chip">DEMO PRICE</span>' : ''}</div>
      <h3>${escapeHTML(product.name)}</h3>
      <div class="product-card-bottom"><strong>${money(product.price)}</strong>${allowAdd ? `<button class="primary-button product-add" data-action="add-product" data-product-id="${escapeHTML(product.id)}">Add <span aria-hidden="true">＋</span></button>` : ''}</div>
    </div>
  </article>`).join('')}</div>`;
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
  if (!draftOrder) draftOrder = createDraft();
  const items = cartItems();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `
    <div class="page-heading"><div><p class="eyebrow">POINT OF SALE</p><h1>New Order</h1><p class="page-description">Add menu items and confirm the customer's order.</p></div><span class="demo-price-note">Sample prices are editable by the Administrator.</span></div>
    <div class="order-layout">
      <section class="panel order-builder">
        <div class="order-meta-grid">
          <div><span class="field-label">Order ID</span><div class="order-id-display">${escapeHTML(draftOrder.id)}</div></div>
          <div><label class="field-label" for="orderType">Order type</label><select class="form-control" id="orderType"><option${draftOrder.type === 'Dine-in' ? ' selected' : ''}>Dine-in</option><option${draftOrder.type === 'Takeout' ? ' selected' : ''}>Takeout</option></select></div>
          <div><label class="field-label" for="customerName">Customer name <span class="optional-label">(optional)</span></label><input class="form-control" id="customerName" maxlength="80" placeholder="Walk-in customer" value="${escapeHTML(draftOrder.customer)}"></div>
        </div>
        <div class="panel-heading product-section-heading"><div><h2>Available menu</h2><p>Choose products to add them to this order.</p></div><span class="sample-label">EDITABLE DEMONSTRATION PRICES</span></div>
        ${productCards(getProducts(), true)}
      </section>
      <aside class="panel order-summary">
        <div class="panel-heading"><div><p class="eyebrow">CURRENT ORDER</p><h2>Order summary</h2></div><span class="cart-count">${items.reduce((sum, item) => sum + item.quantity, 0)} items</span></div>
        <div class="cart-items">${items.length ? items.map(item => `<div class="cart-item">
          <div class="cart-item-info"><strong>${escapeHTML(item.name)}</strong><small>${money(item.price)} each</small><b>${money(item.price * item.quantity)}</b></div>
          <div class="quantity-control"><button aria-label="Decrease ${escapeHTML(item.name)} quantity" data-action="decrease-item" data-product-id="${escapeHTML(item.id)}">−</button><span>${item.quantity}</span><button aria-label="Increase ${escapeHTML(item.name)} quantity" data-action="increase-item" data-product-id="${escapeHTML(item.id)}">＋</button></div>
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

function productManagementPage() {
  const products = getProducts();
  return `<div class="page-heading"><div><p class="eyebrow">MENU MANAGEMENT</p><h1>${currentUser.role === 'admin' ? 'Menu & Pricing' : 'Menu / View Products'}</h1><p class="page-description">${currentUser.role === 'admin' ? 'Manage menu items and their selling prices.' : 'Browse available products and their current prices.'}</p></div></div>
    <p class="demo-price-note">${currentUser.role === 'admin' ? 'Demonstration prices only. Update these values to match your menu; only Administrators can edit prices.' : 'Sample demonstration prices only. Prices can only be changed by an Administrator.'}</p>
    ${currentUser.role === 'admin' ? `<article class="panel product-create-panel"><div class="panel-heading"><div><h2>Add a product</h2><p>Enter a product and a valid price above ₱0.00.</p></div></div><form id="productCreateForm" class="product-create-form"><label><span class="field-label">Product name</span><input class="form-control" name="name" maxlength="80" required></label><label><span class="field-label">Category</span><input class="form-control" name="category" maxlength="40" placeholder="e.g. Grilled" required></label><label><span class="field-label">Price (₱)</span><input class="form-control" name="price" type="number" min="0.01" step="0.01" required></label><label><span class="field-label">Image icon</span><input class="form-control" name="icon" maxlength="4" placeholder="🍽️"></label><button class="primary-button" type="submit">Add product</button></form></article>` : ''}
    ${products.length ? `<div class="product-grid management-grid">${products.map(product => `<article class="product-card">
      ${productArt(product)}<div class="product-card-body"><div class="product-card-meta"><span>${escapeHTML(product.category)}</span>${product.demonstration ? '<span class="sample-chip">DEMO PRICE</span>' : ''}</div><h3>${escapeHTML(product.name)}</h3>
      ${currentUser.role === 'admin' ? `<form class="product-edit-form" data-product-id="${escapeHTML(product.id)}">
        <div class="product-edit-grid">
          <label><span class="field-label">Product name</span><input class="form-control" name="name" maxlength="80" value="${escapeHTML(product.name)}" required></label>
          <label><span class="field-label">Category</span><input class="form-control" name="category" maxlength="40" value="${escapeHTML(product.category)}" required></label>
          <label><span class="field-label">Price (₱)</span><input class="form-control" id="price-${escapeHTML(product.id)}" name="price" type="number" min="0.01" step="0.01" value="${escapeHTML(product.price)}" required></label>
          <label><span class="field-label">Image icon</span><input class="form-control" name="icon" maxlength="4" value="${escapeHTML(product.icon || '🍽️')}"></label>
        </div>
        <div class="product-edit-actions"><button class="secondary-button" type="submit">Save changes</button><button class="remove-item" type="button" data-action="delete-product" data-product-id="${escapeHTML(product.id)}" aria-label="Remove ${escapeHTML(product.name)}">×</button></div>
      </form>` : `<strong class="product-view-price">${money(product.price)}</strong>`}</div>
    </article>`).join('')}</div>` : emptyState('No products yet.', '☷')}`;
}

function kitchenCards(orders) {
  if (!orders.length) return emptyState('No kitchen orders at this stage.', '♨');
  return `<div class="kitchen-card-grid">${orders.map(order => `<article class="kitchen-order-card">
    <div class="kitchen-order-head"><div><span class="order-id">${escapeHTML(order.id)}</span><p>${escapeHTML(dateTime(order.createdAt))} · ${escapeHTML(order.type)}</p></div><span class="status-badge ${escapeHTML(order.status.toLowerCase())}">${escapeHTML(order.status)}</span></div>
    <ul class="kitchen-item-list">${order.items.map(item => `<li><strong>${item.quantity} ×</strong> ${escapeHTML(item.name)}</li>`).join('')}</ul>
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
    <article class="panel sales-panel"><div class="panel-heading"><div><h2>Sales transactions</h2><p>Only confirmed payments are recorded as sales.</p></div></div>${sales.length ? `<div class="table-scroll"><table><thead><tr><th>ORDER</th><th>PAID AT</th><th>METHOD</th><th>TOTAL</th><th>RECEIVED</th><th>CHANGE</th><th></th></tr></thead><tbody>${sales.map(sale => `<tr><td class="order-id">${escapeHTML(sale.orderId)}</td><td>${escapeHTML(dateTime(sale.paidAt))}</td><td>Cash</td><td class="amount-cell">${money(sale.total)}</td><td>${money(sale.amountReceived)}</td><td>${money(sale.change)}</td><td><button class="text-button" data-action="print-receipt" data-order-id="${escapeHTML(sale.orderId)}">Receipt</button></td></tr>`).join('')}</tbody></table></div>` : emptyState('No confirmed sales yet.', '₱')}</article></div>`;
}

function receiptButtonMarkup(orderId) {
  return `<div class="receipt-ready"><span>Payment confirmed for ${escapeHTML(orderId)}.</span><button class="secondary-button" data-action="print-receipt" data-order-id="${escapeHTML(orderId)}">Print receipt</button></div>`;
}

function orderManagementPage() {
  const records = getOrders().slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const selected = records.find(order => order.id === expandedOrderId);
  return `<div class="page-heading"><div><p class="eyebrow">MANAGEMENT</p><h1>Orders</h1><p class="page-description">Review all customer orders and their payment status.</p></div></div><article class="panel orders-panel">${ordersTable(records, true)}${selected ? orderDetails(selected, true) : ''}</article>`;
}

function pageContent(role, page) {
  if (page === 'dashboard') return dashboardContent(role);
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
          <label><span class="field-label">Password</span><input class="form-control" name="password" type="password" minlength="12" autocomplete="new-password" required></label>
          <label><span class="field-label">Confirm Password</span><input class="form-control" name="confirm_password" type="password" minlength="12" autocomplete="new-password" required></label>
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

function renderDashboard() {
  document.title = `YDUR's Fried & Grill | ${ROLE_NAMES[currentUser.role]}`;
  const links = NAVIGATION[currentUser.role].filter(entry => !staticDemo || entry[0] !== 'staff');
  const navMarkup = links.map(([page, label, icon]) => page === 'logout'
    ? `<button class="nav-link" data-logout><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></button>`
    : `<button class="nav-link${activePage === page ? ' active' : ''}" data-page="${page}"><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></button>`).join('');
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand"><div class="brand-mark" aria-hidden="true">Y</div><div class="brand-copy"><span class="brand-name">YDUR'S</span><span class="brand-subtitle">FRIED &amp; GRILL</span></div><button class="icon-button sidebar-close" id="sidebarClose" aria-label="Close menu">&times;</button></div>
        <div class="workspace-label">WORKSPACE</div>
        <nav class="main-nav" aria-label="${ROLE_NAMES[currentUser.role]} navigation">${navMarkup}</nav>
        <div class="sidebar-bottom"><div class="user-mini"><div class="avatar">${escapeHTML(currentUser.name.charAt(0))}</div><div class="user-mini-info"><strong>${escapeHTML(currentUser.name)}</strong><span>${ROLE_NAMES[currentUser.role]}</span></div></div>${currentUser.role === 'cashier' ? '' : '<button class="logout-button" data-logout>Logout <span aria-hidden="true">↗</span></button>'}</div>
      </aside>
      <div class="sidebar-scrim" id="sidebarScrim"></div>
      <main class="main-area">
        <header class="topbar"><div class="topbar-left"><button class="icon-button menu-toggle" id="menuToggle" aria-label="Open navigation">☰</button><div class="breadcrumb"><span>YDUR'S FRIED &amp; GRILL</span><b>/</b><strong id="breadcrumbCurrent"></strong></div></div><div class="topbar-actions"><div class="topbar-user"><div class="avatar avatar-small">${escapeHTML(currentUser.name.charAt(0))}</div><div><strong>${escapeHTML(currentUser.name)}</strong><span>${ROLE_NAMES[currentUser.role]}</span></div></div><button class="topbar-logout" data-logout>Logout</button></div></header>
        <section class="content-area"><div class="demo-notice"><span aria-hidden="true">ⓘ</span> Orders, products, and payments in this workspace are currently stored in this browser only.</div><div class="storage-notice" id="storageNotice" role="alert" hidden></div><section class="page-view active" id="pageContent"></section><footer class="page-footer"><span>© 2026 YDUR's Fried &amp; Grill</span><span>Restaurant Management System <b>•</b> Local browser data</span></footer></section>
      </main>
    </div><div class="toast" id="appToast" role="status" aria-live="polite"></div>`;
  updatePage();
  app.addEventListener('click', handleClick);
  app.addEventListener('submit', handleSubmit);
  app.addEventListener('change', handleChange);
  app.addEventListener('input', handleInput);
  window.addEventListener('storage', handleStorageChange);
  document.getElementById('menuToggle').addEventListener('click', () => toggleSidebar(true));
  document.getElementById('sidebarClose').addEventListener('click', () => toggleSidebar(false));
  document.getElementById('sidebarScrim').addEventListener('click', () => toggleSidebar(false));
}

function updatePage() {
  const item = NAVIGATION[currentUser.role].find(entry => entry[0] === activePage);
  document.getElementById('breadcrumbCurrent').textContent = item ? item[1] : 'Dashboard';
  document.getElementById('pageContent').innerHTML = pageContent(currentUser.role, activePage);
  document.querySelectorAll('.nav-link[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === activePage));
  updateStorageNotice();
}

function navigateTo(page) {
  if (!NAVIGATION[currentUser.role].some(item => item[0] === page)) return;
  if (page !== activePage && activePage === 'new-order') draftOrder = null;
  if (page === 'new-order' && activePage !== 'new-order') draftOrder = createDraft();
  activePage = page;
  updatePage();
  toggleSidebar(false);
}

function toggleSidebar(open) {
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('sidebarScrim').classList.toggle('show', open);
}

function logout() {
  if (staticDemo) {
    currentUser = null;
    activePage = 'dashboard';
    showLogin();
    return;
  }
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
  if (target.hasAttribute('data-logout')) return logout();
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

function handleSubmit(event) {
  const form = event.target;
  if (!form.matches('form')) return;
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
  if (form.id === 'historySearch') {
    historySearch = new FormData(form).get('query').trim();
    return updatePage();
  }
  if (form.id === 'productCreateForm') return addProduct(form);
  if (form.id === 'paymentForm') return confirmPayment(form);
  if (form.classList.contains('product-edit-form')) return updateProduct(form);
}

function handleChange(event) {
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
  if (event.target.id === 'orderType' && draftOrder) draftOrder.type = event.target.value;
}

function handleInput(event) {
  const target = event.target;
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
  if (event.key !== STORAGE_KEYS.products && event.key !== STORAGE_KEYS.transactions) return;
  if (activePage === 'new-order') syncDraftFields();
  updatePage();
}

function confirmOrder() {
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
  const orders = getOrders();
  const order = orders.find(record => record.id === orderId);
  if (!order || !['Pending', 'Preparing'].includes(order.status)) return;
  order.status = order.status === 'Pending' ? 'Preparing' : 'Ready';
  if (!saveOrders(orders)) return;
  updatePage();
  showToast(`${order.id} is now ${order.status}.`);
}

function completeKitchenOrder(orderId) {
  const orders = getOrders();
  const order = orders.find(record => record.id === orderId);
  if (!order || order.status !== 'Ready') return;
  order.status = 'Completed';
  if (!saveOrders(orders)) return;
  updatePage();
  showToast(`${order.id} marked completed.`);
}

function cancelRecordedOrder(orderId) {
  const orders = getOrders();
  const order = orders.find(record => record.id === orderId);
  if (!order || order.status !== 'Pending' || order.paymentStatus === 'Paid') return;
  order.status = 'Cancelled';
  if (!saveOrders(orders)) return;
  updatePage();
  showToast(`${order.id} cancelled.`);
}

function addProduct(form) {
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const category = String(data.get('category') || '').trim();
  const price = Number(data.get('price'));
  const icon = String(data.get('icon') || '').trim() || '🍽️';
  if (!name || !category || !Number.isFinite(price) || price <= 0) return showToast('Enter a product name, category, and a price above ₱0.00.');
  const products = getProducts();
  if (storageError) return showToast(storageError);
  products.push({ id: `product-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, name, category, price, icon, demonstration: false });
  if (!saveProducts(products)) return;
  updatePage();
  showToast(`${name} added to the menu.`);
}

function updateProduct(form) {
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const category = String(data.get('category') || '').trim();
  const price = Number(data.get('price'));
  const icon = String(data.get('icon') || '').trim() || '🍽️';
  if (!name || !category || !Number.isFinite(price) || price <= 0) {
    return showToast('Enter a product name, category, and a price above ₱0.00.');
  }
  const products = getProducts();
  const product = products.find(record => record.id === form.dataset.productId);
  if (!product) return showToast('That menu product could not be found.');
  product.name = name;
  product.category = category;
  product.price = price;
  product.icon = icon;
  if (!saveProducts(products)) return;
  updatePage();
  showToast(`${product.name} updated. Existing orders are unchanged.`);
}

function deleteProduct(productId) {
  const products = getProducts();
  const product = products.find(record => record.id === productId);
  if (!product) return showToast('That menu product could not be found.');
  if (!window.confirm(`Remove ${product.name} from the menu? Existing orders will be kept.`)) return;
  if (!saveProducts(products.filter(record => record.id !== productId))) return;
  updatePage();
  showToast(`${product.name} removed from the menu.`);
}

function confirmPayment(form) {
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
  const sale = getSales().find(record => record.orderId === orderId);
  const order = getOrders().find(record => record.id === orderId);
  if (!sale || !order) return showToast('Receipt details could not be found.');
  const printWindow = window.open('', '_blank', 'width=420,height=700');
  if (!printWindow) return showToast('Allow pop-ups to print this receipt.');
  printWindow.document.write(`<!doctype html><html><head><title>Receipt ${escapeHTML(order.id)}</title><style>body{font:14px Arial,sans-serif;max-width:340px;margin:24px auto;color:#25231f}h1{text-align:center;font-size:20px}p{text-align:center;color:#625b52}.line{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #ccc}.total{font-weight:bold;font-size:17px}.footer{text-align:center;margin-top:24px}@media print{body{margin:0 auto}}</style></head><body><h1>YDUR'S FRIED &amp; GRILL</h1><p>Customer receipt · ${escapeHTML(dateTime(sale.paidAt))}</p><div class="line"><strong>Order</strong><span>${escapeHTML(order.id)}</span></div><div class="line"><strong>Customer</strong><span>${escapeHTML(order.customer || 'Walk-in')}</span></div>${order.items.map(item => `<div class="line"><span>${item.quantity} × ${escapeHTML(item.name)}</span><span>${money(item.quantity * item.unitPrice)}</span></div>`).join('')}<div class="line total"><span>Total</span><span>${money(sale.total)}</span></div><div class="line"><span>Payment</span><span>Cash</span></div><div class="line"><span>Received</span><span>${money(sale.amountReceived)}</span></div><div class="line"><span>Change</span><span>${money(sale.change)}</span></div><p class="footer">Thank you for dining with us!</p><script>window.onload=function(){window.print();};<\/script></body></html>`);
  printWindow.document.close();
}

function showChangePassword() {
  document.title = "YDUR's Fried & Grill | Change password";
  app.innerHTML = `
    <main class="login-layout">
      <section class="login-brand-panel" aria-label="YDUR's Fried & Grill">
        <div class="login-brand">
          <div class="brand-mark" aria-hidden="true">Y</div>
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
          <div class="login-card-brand"><div class="brand-mark" aria-hidden="true">Y</div></div>
          <p class="eyebrow">PASSWORD UPDATE</p>
          <h2>Change password</h2>
          ${auth.staffError ? `<div class="login-error">${escapeHTML(auth.staffError)}</div>` : ''}
          <input type="hidden" name="action" value="change_password">
          <input type="hidden" name="csrf_token" value="${escapeHTML(auth.csrfToken)}">
          <label class="field-label" for="newPassword">New Password</label>
          <div class="password-field">
            <input class="form-control" id="newPassword" name="new_password" type="password" minlength="12" autocomplete="new-password" required>
            <button class="password-toggle" type="button" data-password-toggle="newPassword" aria-label="Show new password" aria-pressed="false">Show</button>
          </div>
          <label class="field-label" for="confirmPassword">Confirm New Password</label>
          <div class="password-field">
            <input class="form-control" id="confirmPassword" name="confirm_password" type="password" minlength="12" autocomplete="new-password" required>
            <button class="password-toggle" type="button" data-password-toggle="confirmPassword" aria-label="Show confirm password" aria-pressed="false">Show</button>
          </div>
          <button class="primary-button login-submit" type="submit">Update Password <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </main>`;

  app.querySelectorAll('[data-password-toggle]').forEach(button => {
    button.addEventListener('click', event => {
      const input = document.getElementById(event.currentTarget.dataset.passwordToggle);
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      event.currentTarget.textContent = visible ? 'Hide' : 'Show';
      event.currentTarget.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
      event.currentTarget.setAttribute('aria-pressed', String(visible));
      input.focus();
    });
  });
}

ensureDemoProducts();
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
