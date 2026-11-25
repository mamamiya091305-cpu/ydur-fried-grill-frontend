<?php

ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

$serverName = strtolower(rtrim((string) ($_SERVER['SERVER_NAME'] ?? ''), '.'));
$productionHosts = ['ydursfriedgrill.site.je', 'www.ydursfriedgrill.site.je'];
$isProduction = in_array($serverName, $productionHosts, true);
$configurationFile = __DIR__ . ($isProduction ? '/database.production.php' : '/database.local.php');

if (!is_file($configurationFile)) {
    error_log('Required database configuration file is missing.');
    if (defined('YDUR_DATABASE_DIAGNOSTIC') && YDUR_DATABASE_DIAGNOSTIC) {
        throw new RuntimeException('Database configuration file is missing.');
    }

    http_response_code(500);
    exit('Database configuration is incomplete.');
}

$configuration = require $configurationFile;
$requiredSettings = ['host', 'database', 'username', 'password'];
if (!is_array($configuration)) {
    error_log('Database configuration must return an array.');
    if (defined('YDUR_DATABASE_DIAGNOSTIC') && YDUR_DATABASE_DIAGNOSTIC) {
        throw new RuntimeException('Database configuration is invalid.');
    }

    http_response_code(500);
    exit('Database configuration is incomplete.');
}

foreach ($requiredSettings as $setting) {
    if (!array_key_exists($setting, $configuration) || !is_string($configuration[$setting])) {
        error_log('Database configuration is missing a required setting.');
        if (defined('YDUR_DATABASE_DIAGNOSTIC') && YDUR_DATABASE_DIAGNOSTIC) {
            throw new RuntimeException('Database configuration is invalid.');
        }

        http_response_code(500);
        exit('Database configuration is incomplete.');
    }
}

if ($isProduction && $configuration['password'] === '') {
    error_log('Production database password has not been configured.');
    if (defined('YDUR_DATABASE_DIAGNOSTIC') && YDUR_DATABASE_DIAGNOSTIC) {
        throw new RuntimeException('Production database password has not been configured.');
    }

    http_response_code(500);
    exit('Database configuration is incomplete.');
}

try {
    $pdo = new PDO(
        'mysql:host=' . $configuration['host'] .
        ';dbname=' . $configuration['database'] .
        ';charset=utf8mb4',
        $configuration['username'],
        $configuration['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $exception) {
    error_log($exception->getMessage());
    if (defined('YDUR_DATABASE_DIAGNOSTIC') && YDUR_DATABASE_DIAGNOSTIC) {
        throw $exception;
    }

    http_response_code(500);
    exit('Database connection failed. Please try again later.');
}
