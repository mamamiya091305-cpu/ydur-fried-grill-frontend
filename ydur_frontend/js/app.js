const DEMO_ACCOUNTS = {
  admin: { password: 'admin123', role: 'admin', name: 'Administrator' },
  cashier: { password: 'cashier123', role: 'cashier', name: 'Cashier' },
  kitchen: { password: 'kitchen123', role: 'kitchen', name: 'Kitchen Staff' }
};

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
    ['pos', 'POS / Sales', '₱']
  ],
  kitchen: [
    ['dashboard', 'Dashboard', '▦'],
    ['incoming', 'Incoming Orders', '▤'],
    ['preparing', 'Preparing Orders', '♨'],
    ['completed', 'Completed Orders', '✓']
  ]
};

const app = document.getElementById('app');
const params = new URLSearchParams(window.location.search);
const requestedRole = params.get('dashboard');
let currentUser = readSession();
let activePage = 'dashboard';

function readSession() {
  try {
    const stored = JSON.parse(sessionStorage.getItem('ydurDemoSession') || 'null');
    const account = stored && DEMO_ACCOUNTS[stored.username];
    if (account && stored.role === account.role) {
      return { username: stored.username, role: account.role, name: account.name };
    }
  } catch (error) {
    sessionStorage.removeItem('ydurDemoSession');
  }
  return null;
}

function dashboardUrl(role) {
  return `${window.location.pathname}?dashboard=${encodeURIComponent(role)}`;
}

function showLogin() {
  document.title = "YDUR's Fried & Grill | Sign in";
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
          <div class="login-error" id="loginError" role="alert" aria-live="polite" hidden></div>
          <label class="field-label" for="username">Username</label>
          <input class="form-control" id="username" name="username" autocomplete="username" placeholder="Enter your username" required>
          <label class="field-label" for="password">Password</label>
          <div class="password-field">
            <input class="form-control" id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required>
            <button class="password-toggle" id="passwordToggle" type="button" aria-label="Show password" aria-pressed="false">Show</button>
          </div>
          <button class="primary-button login-submit" type="submit">Sign in <span aria-hidden="true">→</span></button>
          <details class="demo-accounts">
            <summary>Frontend demo accounts</summary>
            <p><strong>Administrator</strong> &nbsp; admin / admin123</p>
            <p><strong>Cashier</strong> &nbsp; cashier / cashier123</p>
            <p><strong>Kitchen Staff</strong> &nbsp; kitchen / kitchen123</p>
          </details>
          <p class="security-note">Demo only: credentials are checked in your browser and do not provide secure authentication.</p>
        </form>
      </section>
    </main>`;

  const form = document.getElementById('loginForm');
  const password = document.getElementById('password');
  document.getElementById('passwordToggle').addEventListener('click', event => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    event.currentTarget.textContent = visible ? 'Hide' : 'Show';
    event.currentTarget.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    event.currentTarget.setAttribute('aria-pressed', String(visible));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const passwordValue = password.value;
    const account = DEMO_ACCOUNTS[username];
    const error = document.getElementById('loginError');

    if (!username || !passwordValue) {
      error.textContent = 'Enter both your username and password.';
      error.hidden = false;
      return;
    }
    if (!account || account.password !== passwordValue) {
      error.textContent = 'Incorrect username or password. Please try again.';
      error.hidden = false;
      password.value = '';
      password.focus();
      return;
    }

    sessionStorage.setItem('ydurDemoSession', JSON.stringify({ username, role: account.role }));
    window.location.assign(dashboardUrl(account.role));
  });
}

function emptyState(message, icon) {
  return `<div class="empty-state"><span class="empty-state-icon" aria-hidden="true">${icon || '◇'}</span><p>${message}</p></div>`;
}

function emptyOrdersTable(message) {
  return `<div class="table-scroll"><table class="empty-orders-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE &amp; TIME</th><th>AMOUNT</th><th>TYPE</th><th>STATUS</th></tr></thead><tbody><tr><td colspan="6">${emptyState(message, '▤')}</td></tr></tbody></table></div>`;
}

function statCard(label, value, icon) {
  return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div></article>`;
}

function dashboardContent(role) {
  if (role === 'admin') {
    return `
      <div class="page-heading"><div><p class="eyebrow">OVERVIEW</p><h1>Welcome, Administrator!</h1><p class="page-description">Your restaurant management overview.</p></div><button class="primary-button" data-goto="orders">View orders <span aria-hidden="true">→</span></button></div>
      <div class="stats-grid">${statCard("Today's sales", '₱0.00', '₱')}${statCard('Total orders', '0', '▤')}${statCard('Pending orders', '0', '◷')}${statCard('Low-stock items', '0', '▧')}</div>
      <div class="dashboard-grid">
        <article class="panel"><div class="panel-heading"><div><h2>Sales overview</h2><p>No transactions recorded.</p></div></div>${emptyState('Sales activity will appear here when recorded.', '₱')}</article>
        <article class="panel"><div class="panel-heading"><div><h2>Low stock</h2><p>Inventory items needing attention</p></div></div>${emptyState('Your inventory records will appear here.', '▣')}</article>
      </div>
      <article class="panel orders-panel"><div class="panel-heading"><div><h2>Recent orders</h2><p>Latest restaurant orders</p></div><button class="text-button" data-goto="orders">View all <span>→</span></button></div>${emptyOrdersTable('No orders yet.')}</article>`;
  }
  if (role === 'cashier') {
    return `
      <div class="page-heading"><div><p class="eyebrow">POINT OF SALE</p><h1>Welcome, Cashier!</h1><p class="page-description">A clear view of today's transactions.</p></div><button class="primary-button" data-goto="new-order"><span aria-hidden="true">＋</span> New Order</button></div>
      <div class="stats-grid cashier-stats">${statCard("Today's sales", '₱0.00', '₱')}${statCard('Total orders', '0', '▤')}${statCard('Pending orders', '0', '◷')}</div>
      <article class="panel orders-panel"><div class="panel-heading"><div><h2>Recent orders</h2><p>Today's customer transactions</p></div><button class="text-button" data-goto="order-history">Order history <span>→</span></button></div>${emptyOrdersTable('No transactions recorded.')}</article>`;
  }
  return `
    <div class="page-heading"><div><p class="eyebrow">KITCHEN</p><h1>Welcome, Kitchen Staff!</h1><p class="page-description">Track food preparation and order progress.</p></div></div>
    <div class="stats-grid kitchen-stats">${statCard('Pending orders', '0', '◷')}${statCard('Preparing orders', '0', '♨')}${statCard('Completed orders', '0', '✓')}</div>
    <article class="panel kitchen-orders"><div class="panel-heading"><div><h2>Kitchen orders</h2><p>Order details and preparation status</p></div></div>
      <div class="status-filters" role="group" aria-label="Filter kitchen orders">${[['incoming', 'Pending'], ['preparing', 'Preparing'], ['completed', 'Ready']].map(([page, label]) => `<button class="status-filter${activePage === page ? ' selected' : ''}" data-goto="${page}">${label}</button>`).join('')}</div>
      ${emptyState('No orders yet. Order cards and status controls will appear here when orders arrive.', '♨')}
    </article>`;
}

function pageContent(role, page) {
  if (page === 'dashboard') return dashboardContent(role);
  const item = NAVIGATION[role].find(entry => entry[0] === page);
  if (!item) return dashboardContent(role);
  const title = item[1];
  if (role === 'kitchen') {
    const status = { incoming: 'Pending', preparing: 'Preparing', completed: 'Ready' }[page];
    return `<div class="page-heading"><div><p class="eyebrow">KITCHEN</p><h1>${title}</h1><p class="page-description">Orders with ${status.toLowerCase()} status.</p></div></div><article class="panel kitchen-orders"><div class="panel-heading"><div><h2>${status} orders</h2><p>Food items, quantities, order numbers, and special instructions</p></div></div>${emptyState('No orders yet. Order cards and status controls will appear here when orders arrive.', '♨')}</article>`;
  }
  const message = page === 'new-order'
    ? 'Order entry will be available here when the POS module is connected.'
    : page === 'order-history' || page === 'orders'
      ? 'No orders yet.'
      : 'This workspace is ready for future database integration.';
  return `<div class="page-heading"><div><p class="eyebrow">${role === 'admin' ? 'MANAGEMENT' : 'POINT OF SALE'}</p><h1>${title}</h1><p class="page-description">${role === 'cashier' ? 'Customer ordering and payment workspace.' : 'Restaurant management workspace.'}</p></div>${role === 'cashier' && page === 'order-history' ? '<button class="primary-button" data-goto="new-order"><span aria-hidden="true">＋</span> New Order</button>' : ''}</div><article class="panel placeholder-panel">${emptyState(message, item[2])}</article>`;
}

function renderDashboard() {
  document.title = `YDUR's Fried & Grill | ${ROLE_NAMES[currentUser.role]}`;
  const links = NAVIGATION[currentUser.role];
  const navMarkup = links.map(([page, label, icon]) => `<button class="nav-link${activePage === page ? ' active' : ''}" data-page="${page}"><span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></button>`).join('');
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand"><div class="brand-mark" aria-hidden="true">Y</div><div class="brand-copy"><span class="brand-name">YDUR'S</span><span class="brand-subtitle">FRIED &amp; GRILL</span></div><button class="icon-button sidebar-close" id="sidebarClose" aria-label="Close menu">&times;</button></div>
        <div class="workspace-label">WORKSPACE</div>
        <nav class="main-nav" aria-label="${ROLE_NAMES[currentUser.role]} navigation">${navMarkup}</nav>
        <div class="sidebar-bottom"><div class="user-mini"><div class="avatar">${currentUser.name.charAt(0)}</div><div class="user-mini-info"><strong>${currentUser.name}</strong><span>${currentUser.role === 'admin' ? 'Administrator' : currentUser.name}</span></div></div><button class="logout-button" data-logout>Logout <span aria-hidden="true">↗</span></button></div>
      </aside>
      <div class="sidebar-scrim" id="sidebarScrim"></div>
      <main class="main-area">
        <header class="topbar"><div class="topbar-left"><button class="icon-button menu-toggle" id="menuToggle" aria-label="Open navigation">☰</button><div class="breadcrumb"><span>YDUR'S FRIED &amp; GRILL</span><b>/</b><strong id="breadcrumbCurrent"></strong></div></div><div class="topbar-actions"><div class="topbar-user"><div class="avatar avatar-small">${currentUser.name.charAt(0)}</div><div><strong>${currentUser.name}</strong><span>${ROLE_NAMES[currentUser.role]}</span></div></div><button class="topbar-logout" data-logout>Logout</button></div></header>
        <section class="content-area"><div class="demo-notice"><span aria-hidden="true">ⓘ</span> Frontend demonstration only. Dashboard data is empty and credentials are not secure authentication.</div><section class="page-view active" id="pageContent"></section><footer class="page-footer"><span>© 2026 YDUR's Fried &amp; Grill</span><span>Restaurant Management System <b>•</b> Frontend demonstration</span></footer></section>
      </main>
    </div>`;
  updatePage();
  document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => navigateTo(button.dataset.page)));
  document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', logout));
  document.getElementById('menuToggle').addEventListener('click', () => toggleSidebar(true));
  document.getElementById('sidebarClose').addEventListener('click', () => toggleSidebar(false));
  document.getElementById('sidebarScrim').addEventListener('click', () => toggleSidebar(false));
}

function updatePage() {
  const item = NAVIGATION[currentUser.role].find(entry => entry[0] === activePage);
  document.getElementById('breadcrumbCurrent').textContent = item ? item[1] : 'Dashboard';
  document.getElementById('pageContent').innerHTML = pageContent(currentUser.role, activePage);
  document.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () => navigateTo(button.dataset.goto)));
}

function navigateTo(page) {
  if (!NAVIGATION[currentUser.role].some(item => item[0] === page)) return;
  activePage = page;
  document.querySelectorAll('.nav-link').forEach(button => button.classList.toggle('active', button.dataset.page === page));
  updatePage();
  toggleSidebar(false);
}

function toggleSidebar(open) {
  document.getElementById('sidebar').classList.toggle('open', open);
  document.getElementById('sidebarScrim').classList.toggle('show', open);
}

function logout() {
  sessionStorage.removeItem('ydurDemoSession');
  currentUser = null;
  app.replaceChildren();
  window.location.replace(window.location.pathname);
}

if (!currentUser) {
  if (requestedRole !== null) window.history.replaceState(null, '', window.location.pathname);
  showLogin();
} else if (!requestedRole) {
  window.location.replace(dashboardUrl(currentUser.role));
} else if (requestedRole !== currentUser.role) {
  window.location.replace(dashboardUrl(currentUser.role));
} else {
  renderDashboard();
}
