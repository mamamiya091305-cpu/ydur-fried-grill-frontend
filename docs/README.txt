YDUR'S FRIED & GRILL - MANAGEMENT SYSTEM

CONTENTS
- index.html       Standalone browser-only demonstration entry point
- index.php        Database-backed login and role-based dashboard entry point
- css/style.css    Existing visual theme plus responsive ordering and payment modules
- js/app.js        Role navigation, menu pricing, orders, kitchen workflow, sales, and logout
- operations.php   Role-checked Daily Operations API backed by the existing MySQL tables
- ../20261125_daily_operations.sql
                    Daily operation metadata and nullable order/payment links
- ../20261125_daily_operations_history.sql
                    Single-active-operation database guard

HOW TO OPEN THE BROWSER DEMONSTRATION
1. Open docs/index.html directly in a browser, or use
   http://localhost/ydur_fried_grill_frontend/docs/index.html with XAMPP.
2. Choose a demonstration role. No database or PHP runtime is required.
3. Products, orders, and sales are saved only in the current browser's localStorage.
   The role picker is for demonstration only; it does not authenticate users.
4. Staff / User Management is unavailable in this browser-only mode.

HOW TO OPEN DATABASE-BACKED SIGN-IN WITH XAMPP
1. Start Apache and MySQL from the XAMPP Control Panel.
2. Confirm config/database.php connects to the existing ydurs_db database.
3. Open http://localhost/ydur_fried_grill_frontend/docs/index.php
4. Sign in with an existing active account from the users table.

INFINITYFREE DEPLOYMENT PACKAGE
- Upload the contents of htdocs/ to InfinityFree's htdocs directory.
- The root index.php provides an official Ydur's Fried Grill public homepage.
  Staff Login links to docs/index.php; the existing docs/css and docs/js paths remain unchanged.
- The root and privacy pages identify the management system as an employee-only
  Ydur's Fried Grill service and do not imitate a third-party authentication provider.
- Configure htdocs/config/database.production.php privately. This file is ignored
  by Git and must never be committed. Copy the non-secret connection settings from
  database.production.example.php and enter the database password only in the
  private production config.
- The config directory's .htaccess blocks direct browser access. The database.php
  loader selects local settings on localhost and production settings on the
  ydursfriedgrill.site.je domain.
- Do not upload reset_admin.php, test_connection.php, SQL backups, or the temporary
  diagnostic.php file.
- Set the hosting account to PHP 8.4 and verify PDO MySQL is enabled before testing.
- Daily Operations reads and writes the existing MySQL products, orders, order_items,
  and payments tables. New operation records and their order/payment links are shared
  across devices. The older POS, order, and menu demonstration screens still use
  browser localStorage; those existing browser records are not imported, overwritten,
  or deleted by the migration.

TEMPORARY ADMIN RECOVERY
- Keep the original setup_admin.php in your private YDURS_BACKUP folder.
- The updated setup_admin.php is ignored by Git. Temporarily upload it to the site
  web root only when the users table has no Admin account.
- Configure a private recovery-key hash as config/setup_admin_key.php (return the
  password_hash() value as a PHP string) or set YDUR_ADMIN_RECOVERY_KEY_HASH in the
  PHP environment. The plaintext recovery key must be generated randomly and kept
  privately; do not put it in tracked source files.
- The setup_admin_key.php config file is ignored by Git and, on InfinityFree, belongs
  under htdocs/config/ where the config .htaccess denies direct browser access.
- Use HTTPS for online recovery. Immediately after creating the Admin, remove
  setup_admin.php and the temporary recovery config from the hosting account.

AUTHENTICATION
- Usernames and passwords are checked against users using PDO and password_verify().
- Sessions store the authenticated account and its database-assigned role.
- Dashboard role URLs are checked against the session; logout expires the session.
- There is no public registration flow.
- The sign-in cooldown is stored in the PHP session, so it is only a supplementary
  per-session control and does not replace persistent or hosting-level rate limiting.
- The deployment sends standard security headers and a CSP in Report-Only mode.
  Review browser reports on the hosting environment before considering enforcement.

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

ORDER, MENU, AND PAYMENT
- Cashier: create Dine-in or Takeout orders, view order history, browse products,
  accept cash payments, and print receipts.
- Administrator: add and remove products, change menu prices, review orders, and
  view confirmed sales.
- Kitchen Staff: view incoming food orders and move them through Preparing, Ready,
  and Completed. Kitchen screens omit selling prices and payment details.
- New orders start as Pending and Unpaid. Only confirming sufficient cash payment
  marks an order Paid and records a sale.
- The Main Menu (Tuna Kinilaw, Chicken BBQ, Fried Chicken, Panga, Pompano,
  French Fries, Kikiam, Fishball, Pika-Pika, and Fried Hito) is separate from
  House Specials & Favorites. The five specials appear in their own horizontal,
  scrollable row and are not combined with the Main Menu grid. Main Menu setup
  records start unavailable with no price; an Administrator must enter confirmed
  prices and enable them before Cashiers can add them to orders.
- The five user-confirmed foods are added once to each browser's menu catalog:
  Tuna Sisig (₱150), Calamares (₱250), Fried Siomai (₱80), Chicken Skin (₱99),
  and Fried Bangus (₱180); all are Available. Existing products with matching
  names are preserved rather than duplicated or overwritten.
- The legacy browser menu shows only the ten listed Main Menu foods and five listed
  House Specials. Administrators can configure prices and availability only for
  these items. Other existing browser-catalog entries remain stored but are not
  shown as menu products; they are not deleted.
- The fifteen provided food images are stored in assets/menu/ and mirrored in
  htdocs/assets/menu/. Their images are matched by the supplied product names and
  displayed without cropping.
- These static image assets require no database migration. The legacy POS catalog
  uses browser localStorage and does not automatically sync with the separate
  MySQL product catalog used by Daily Operations.
- Orders store a snapshot of item names, quantities, unit prices, and totals so
  later menu-price changes do not alter recorded orders.
- Product and transaction records are still saved in this browser's localStorage
  under ydurProducts and ydurTransactions. Clearing browser storage removes this data.
- On startup, the application removes only the known legacy demo products from
  ydurProducts. Other products and all order/payment history remain unchanged.
- No sample transactions are preloaded; dashboard statistics remain empty until an
  order is actually created and, for sales totals, paid.

DATA STORAGE LIMITATION
Daily Operations sales, orders, and daily operation records are persisted to MySQL.
The older POS/order history/menu demonstration screens and inventory display still
use browser localStorage. Existing localStorage data is retained as-is and is not
automatically imported because importing browser-local records could create duplicate
orders or payments.

DAILY OPERATIONS DATABASE MIGRATION
1. Make a private backup of the existing database before changing its schema.
2. In phpMyAdmin, select the existing application database and import
   20261125_daily_operations.sql exactly once from the project root. It creates the
   daily_operations table and adds nullable linkage/idempotency columns to the
   existing orders and payments tables. Existing rows are not deleted or rewritten.
3. Before applying the history migration, run
   SELECT COUNT(*) AS open_operations FROM daily_operations WHERE status = 'open';
   Confirm the result is at most one. If multiple open days are
   present, review them and close stale operations with accurate timestamps before
   continuing; do not delete any operation or sales data.
4. Import 20261125_daily_operations_history.sql from the project root exactly once.
   It adds a generated-column unique guard so concurrent requests cannot open
   multiple business days. The database must support indexed generated columns.
5. If an ALTER TABLE statement fails, stop and check which statements completed
   before retrying. Do not run either migration a second time without resolving
   any partially applied statements.
6. Upload the updated docs/operations.php, docs/index.php, docs/js/app.js, and
   docs/css/style.css into the corresponding htdocs/docs/ locations. Keep the
   private database configuration files out of public downloads and source control.
7. Test with active Admin, Cashier, and Kitchen Staff accounts. Spectator Mode uses
   static sample data and never sends Daily Operations requests to the database.

DAILY OPERATIONS TESTING
1. Sign in as Admin, open Daily Operations, and start today's Philippine business
   date. Confirm it is Open and the assigned cashier and opening time are displayed.
2. Sign in as Cashier and create an order from available database products. Confirm
   the calculated total, order details, and persistence after refresh.
3. Record Cash, GCash, or another supported payment. Confirm Admin's dashboard
   refreshes within 15 seconds and the sales, order, transaction, and payment-method
   totals update. The API also refreshes totals immediately after writes.
4. Sign in as Kitchen Staff and verify assigned or unassigned orders are visible,
   prices/payment details are hidden, and only the next preparation status can be set.
5. Sign back in as Admin, confirm the close warning, and close the operation. Verify
   the timestamp and that no new payments, orders, or status edits are accepted.
6. Open Sales History, search a date range, and confirm the closed operation's
   sales, order counts, staff, and payment breakdown. Open its report to inspect
   transaction and order details; print and export both daily and history reports.
7. Refresh the browser and sign in from another device/session to verify closed
   operations remain in history. Try opening a second operation while one is open.
8. Sign in as Spectator and confirm only static preview information is shown; no
   live history or financial data is fetched and no changes can be made.

INFINITYFREE DAILY OPERATIONS DEPLOYMENT
1. Back up the database, then apply both migrations in order through hosting
   phpMyAdmin: the base Daily Operations migration followed by the history
   migration. If the base migration was already applied, apply only the history
   migration after checking that no more than one operation is open.
2. Upload the four updated files listed above to the same relative htdocs/docs/
   paths. Do not expose the SQL migration on the public website.
3. Keep htdocs/config/database.production.php private and configured as before;
   never place database credentials in JavaScript or the migration.
4. Confirm PHP 8.4 with PDO MySQL enabled, then test over HTTPS using each role.
   Existing InfinityFree authentication/session and .htaccess configuration remains
   unchanged.

Google Fonts are used when an internet connection is available. Local font fallbacks
are provided.
