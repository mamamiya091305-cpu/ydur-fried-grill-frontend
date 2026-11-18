YDUR'S FRIED & GRILL - FRONTEND DEMONSTRATION

CONTENTS
- index.html       Shared login page and role-based dashboard entry point
- css/style.css    Existing visual theme plus responsive ordering and payment modules
- js/app.js        Role navigation, menu pricing, orders, kitchen workflow, sales, and logout

HOW TO OPEN (NO BACKEND OR LOCALHOST REQUIRED)
1. Open this folder in Visual Studio Code.
2. Open index.html directly in a modern browser.
3. Use one of the demonstration accounts below to sign in.

DEMO ACCOUNTS
- Administrator: admin / admin123
- Cashier:       cashier / cashier123
- Kitchen Staff: kitchen / kitchen123

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
- Product and transaction records are saved in this browser's localStorage under
  ydurProducts and ydurTransactions. Clearing browser storage removes this demo data.
- No sample transactions are preloaded; dashboard statistics remain empty until an
  order is actually created and, for sales totals, paid.

SECURITY
This is a frontend-only demonstration. Credentials are hardcoded in JavaScript,
role checks use sessionStorage, and records are accessible through browser storage.
These checks do not provide secure authentication or access control. Do not use
these credentials or this application for real transactions. Implement server-side
authentication, authorization, and persistent storage during backend integration.

Google Fonts are used when an internet connection is available. Local font fallbacks
are provided.
