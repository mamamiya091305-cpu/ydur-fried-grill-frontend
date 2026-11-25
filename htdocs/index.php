<?php

ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

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
  <meta name="description" content="Ydur's Fried &amp; Grilled Management System for authorized restaurant employees.">
  <title>Ydur's Fried &amp; Grilled Management System</title>
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png?v=2">
  <link rel="stylesheet" href="home.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/" aria-label="Ydur's Fried &amp; Grilled home">
      <img src="ydurslogo.jpg" alt="Ydur's Fried &amp; Grilled logo">
      <span>Ydur's Fried &amp; Grilled</span>
    </a>
  </header>

  <main>
    <section class="hero" aria-labelledby="hero-title">
      <div>
        <p class="eyebrow">Official Ydur's Fried &amp; Grilled</p>
        <h1 id="hero-title">Ydur's Fried &amp; Grilled Management System</h1>
        <p class="lead">A secure internal workspace for restaurant operations, staff accounts, orders, kitchen workflow, and sales management.</p>
        <p class="notice"><strong>Authorized employees only.</strong> Access is restricted to staff accounts issued by Ydur's Fried &amp; Grilled.</p>
        <div class="actions">
          <a class="primary" href="/docs/index.php">Staff Login</a>
          <a class="secondary" href="/privacy.php">Privacy Policy</a>
        </div>
      </div>
      <img class="hero-logo" src="ydurslogo.jpg" alt="" aria-hidden="true">
    </section>
  </main>

  <footer>
    <p>&copy; <?= date('Y') ?> Ydur's Fried &amp; Grilled</p>
  </footer>
</body>
</html>
