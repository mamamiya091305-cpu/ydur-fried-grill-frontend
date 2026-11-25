<?php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
header("Content-Security-Policy-Report-Only: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:");
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    header('Strict-Transport-Security: max-age=31536000');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Privacy Policy | Ydur's Fried &amp; Grilled</title>
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png?v=2">
  <link rel="stylesheet" href="home.css">
</head>
<body>
  <header class="site-header"><a class="brand" href="/"><img src="ydurslogo.jpg" alt=""><span>Ydur's Fried &amp; Grilled</span></a></header>
  <main>
    <article class="hero" style="display:block">
      <p class="eyebrow">Privacy Policy</p>
      <h1>Privacy and account information</h1>
      <p class="lead">Ydur's Fried &amp; Grilled Management System is an internal service for authorized restaurant employees.</p>
      <p>Staff usernames and authentication information are used to operate the management system and protect role-based access. Passwords are stored in hashed form and are not displayed to administrators.</p>
      <p>Sessions may use secure, HTTP-only cookies. Do not share your credentials or leave an authenticated session unattended.</p>
      <p>Operational records are stored through the application database or in browser storage for application demonstration features. Staff should not enter personal information that is not required for restaurant operations.</p>
      <p>For questions about data handling or account access, contact the Ydur's Fried &amp; Grilled administrator through an approved restaurant channel.</p>
      <div class="actions"><a class="primary" href="/docs/index.php">Staff Login</a><a class="secondary" href="/">Return Home</a></div>
    </article>
  </main>
  <footer><p>&copy; <?= date('Y') ?> Ydur's Fried &amp; Grilled</p></footer>
</body>
</html>
