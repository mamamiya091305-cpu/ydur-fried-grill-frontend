YDUR'S FRIED & GRILL - FRONTEND DEMONSTRATION

CONTENTS
- index.html       Shared login page and role-based dashboard entry point
- css/style.css    Existing visual theme, login, and responsive dashboard styles
- js/app.js        Frontend demo login, role navigation, dashboard, and logout logic

HOW TO OPEN (NO BACKEND OR LOCALHOST REQUIRED)
1. Open this folder in Visual Studio Code.
2. Open index.html directly in a modern browser.
3. Use one of the demonstration accounts below to sign in.

DEMO ACCOUNTS
- Administrator: admin / admin123
- Cashier:       cashier / cashier123
- Kitchen Staff: kitchen / kitchen123

Each account opens its own role-specific dashboard. Dashboard data is intentionally
empty; there are no sample transactions, orders, inventory records, or statistics.
Navigation between the planned workspaces is available, but restaurant modules are
not implemented yet. Kitchen order status controls will appear with future order data.

SECURITY
This is a frontend-only demonstration. Credentials are hardcoded in JavaScript and
the role check uses sessionStorage, so this is not secure authentication or access
control. Do not use these credentials for real accounts. Replace the demo logic with
server-side authentication and role permissions during backend integration.

Google Fonts are used when an internet connection is available. Local font fallbacks
are provided.
