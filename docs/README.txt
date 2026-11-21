YDUR'S FRIED & GRILL - MANAGEMENT SYSTEM

CONTENTS
- index.php        Database-backed login and role-based dashboard entry point
- index.html       Redirects visitors to the PHP entry point
- css/style.css    Existing visual theme plus responsive ordering and payment modules
- js/app.js        Role navigation, menu pricing, orders, kitchen workflow, sales, and logout

HOW TO OPEN LOCALLY WITH XAMPP
1. Start Apache and MySQL from the XAMPP Control Panel.
2. Confirm config/database.php connects to the existing ydurs_db database.
3. Open http://localhost/ydur_fried_grill_frontend/docs/index.php
4. Sign in with an existing active account from the users table.

AUTHENTICATION
- Usernames and passwords are checked against users using PDO and password_verify().
- Sessions store the authenticated account and its database-assigned role.
- Dashboard role URLs are checked against the session; logout expires the session.
- There is no public registration flow.

STAFF ACCOUNT MANAGEMENT
- The Administrator sidebar includes Staff / User Management.
- Administrators can create active Cashier or Kitchen Staff accounts.
- Staff passwords are hashed with password_hash(), duplicate usernames are rejected,
  and staff management actions require an active Admin session and a valid CSRF token.
- The staff list defaults to active accounts and can be filtered by status or role.
- Cashier and Kitchen Staff accounts can be deactivated or reactivated. Deactivation
  preserves the account and its records; inactive users cannot sign in, and existing
  sessions are revalidated against the database on every request.
- Only unused Cashier and Kitchen Staff accounts can be permanently deleted. Admin
  accounts and accounts referenced by orders, payments, or stock movements are
  protected; related records are never deleted.
- Administrators cannot deactivate their own account or change another Admin account.
- Administrators can generate a one-time temporary password for Cashier or Kitchen
  Staff accounts. The temporary password is shown once and is not saved in plain text.
- Staff accounts with must_change_password set to 1 must create a new password before
  any dashboard access.

ORDER, MENU, AND PAYMENT DEMONSTRATION
- Cashier: create Dine-in or Takeout orders, view order history, browse products,
  accept cash payments, and print receipts.
- Administrator: add and remove products, change menu prices, review orders, and
  view confirmed sales.
- Kitchen Staff: view incoming food orders and move them through Preparing, Ready,
  and Completed. Kitchen screens omit selling prices and payment details.
- New orders start as Pending and Unpaid. Only confirming sufficient cash payment
  marks an order Paid and records a sale.
- The initial menu is clearly labeled demonstration data:
  Grilled Chicken ₱150.00, Pork BBQ ₱120.00, Grilled Seafood ₱180.00,
  French Fries ₱80.00, and Iced Tea ₱35.00. These are sample prices, not confirmed
  restaurant prices. An Administrator can edit them.
- Orders store a snapshot of item names, quantities, unit prices, and totals so
  later menu-price changes do not alter recorded orders.
- Product and transaction records are still saved in this browser's localStorage
  under ydurProducts and ydurTransactions. Clearing browser storage removes this data.
- No sample transactions are preloaded; dashboard statistics remain empty until an
  order is actually created and, for sales totals, paid.

DATA STORAGE LIMITATION
Only login authentication is connected to MySQL. Orders, products, payments, and
other dashboard records remain browser-local demonstration data; they are not yet
persisted to the existing database tables.

Google Fonts are used when an internet connection is available. Local font fallbacks
are provided.
