<?php

$isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');
session_set_cookie_params(0, '/', '', $isHttps, true);
session_start();

header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$roles = ['admin', 'cashier', 'kitchen'];

function getStaffDeletionReferenceColumns(PDO $pdo): array
{
    $tables = ['orders', 'payments', 'stock_movements'];
    $tableQuery = $pdo->query(
        "SELECT TABLE_NAME
         FROM INFORMATION_SCHEMA.TABLES
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME IN ('orders', 'payments', 'stock_movements')"
    );
    $existingTables = [];
    foreach ($tableQuery->fetchAll(PDO::FETCH_COLUMN) as $existingTable) {
        $existingTables[strtolower((string) $existingTable)] = (string) $existingTable;
    }
    $columnsByTable = [];

    foreach ($tables as $table) {
        $actualTableName = $existingTables[strtolower($table)] ?? null;
        if ($actualTableName === null) {
            $columnsByTable[$table] = [];
            continue;
        }

        $columnQuery = $pdo->prepare(
            'SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :table_name'
        );
        $columnQuery->execute([':table_name' => $actualTableName]);
        $columns = $columnQuery->fetchAll(PDO::FETCH_COLUMN);

        $foreignKeyQuery = $pdo->prepare(
            'SELECT COLUMN_NAME
             FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = :table_name
               AND REFERENCED_TABLE_NAME = \'users\'
               AND REFERENCED_COLUMN_NAME = \'id\''
        );
        $foreignKeyQuery->execute([':table_name' => $actualTableName]);
        $userForeignKeyColumns = array_fill_keys($foreignKeyQuery->fetchAll(PDO::FETCH_COLUMN), true);
        $referenceColumns = [];

        foreach ($columns as $column) {
            $normalizedColumn = strtolower((string) $column);
            $looksLikeUserReference =
                preg_match('/(^|_)(user|staff|employee|account|cashier|kitchen|operator|worker)(_|$)/', $normalizedColumn) === 1 ||
                preg_match('/(^|_)(created|updated|processed|recorded|handled|served|prepared|received|approved|completed|closed|taken|collected)_by$/', $normalizedColumn) === 1;

            if (isset($userForeignKeyColumns[$column]) || $looksLikeUserReference) {
                $referenceColumns[] = (string) $column;
            }
        }

        $columnsByTable[$actualTableName] = $referenceColumns;
    }

    return $columnsByTable;
}

function getStaffDeletionBlockReason(PDO $pdo, int $accountId, array $referenceColumns): ?string
{
    foreach ($referenceColumns as $table => $columns) {
        foreach ($columns as $column) {
            $quotedTable = '`' . str_replace('`', '``', $table) . '`';
            $quotedColumn = '`' . str_replace('`', '``', $column) . '`';
            $referenceQuery = $pdo->prepare(
                "SELECT 1 FROM $quotedTable WHERE $quotedColumn = :account_id LIMIT 1"
            );
            $referenceQuery->bindValue(':account_id', $accountId, PDO::PARAM_INT);
            $referenceQuery->execute();

            if ($referenceQuery->fetchColumn()) {
                return 'Related records exist in ' . $table . '. Deactivate this account instead.';
            }
        }
    }

    return null;
}

$authenticatedUser = null;
$sessionRole = is_string($_SESSION['role'] ?? null) ? $_SESSION['role'] : '';
if (isset($_SESSION['user_id']) || isset($_SESSION['role'])) {
    if (
        !in_array($sessionRole, $roles, true) ||
        !isset($_SESSION['user_id'], $_SESSION['username'], $_SESSION['full_name'])
    ) {
        $_SESSION = [];
    } else {
        require_once __DIR__ . '/config/database.php';

        try {
            $sessionAccount = $pdo->prepare(
                'SELECT id, full_name, username, role, is_active, must_change_password
                 FROM users WHERE id = :id LIMIT 1'
            );
            $sessionAccount->execute([':id' => (int) $_SESSION['user_id']]);
            $currentAccount = $sessionAccount->fetch();

            if (
                $currentAccount &&
                (int) $currentAccount['is_active'] === 1 &&
                in_array($currentAccount['role'], $roles, true) &&
                $currentAccount['role'] === $sessionRole
            ) {
                $authenticatedUser = [
                    'id' => (int) $currentAccount['id'],
                    'username' => (string) $currentAccount['username'],
                    'name' => (string) $currentAccount['full_name'],
                    'role' => (string) $currentAccount['role'],
                    'must_change_password' => (int) $currentAccount['must_change_password']
                ];
            } else {
                $_SESSION = [];
            }
        } catch (PDOException $exception) {
            error_log($exception->getMessage());
            $_SESSION = [];
        }
    }
}

$loginError = '';
$staffMessage = '';
$staffError = '';
$staffAccounts = [];
$temporaryPassword = '';

if (isset($_SESSION['temporary_password'])) {
    $temporaryPassword = (string) $_SESSION['temporary_password'];
    unset($_SESSION['temporary_password']);
}
if (isset($_SESSION['temporary_password_username'])) {
    $temporaryPasswordUsername = (string) $_SESSION['temporary_password_username'];
    unset($_SESSION['temporary_password_username']);
} else {
    $temporaryPasswordUsername = '';
}

if (isset($_SESSION['staff_message'])) {
    $staffMessage = (string) $_SESSION['staff_message'];
    unset($_SESSION['staff_message']);
}
if (isset($_SESSION['staff_error'])) {
    $staffError = (string) $_SESSION['staff_error'];
    unset($_SESSION['staff_error']);
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $action = is_string($_POST['action'] ?? null) ? $_POST['action'] : 'login';
    $postedToken = is_string($_POST['csrf_token'] ?? null) ? $_POST['csrf_token'] : '';
    $sessionToken = is_string($_SESSION['csrf_token'] ?? null) ? $_SESSION['csrf_token'] : '';

    if ($sessionToken === '' || !hash_equals($sessionToken, $postedToken)) {
        http_response_code(403);
        exit('Invalid request. Please refresh the page and try again.');
    }

    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();

        $cookie = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $cookie['path'], $cookie['domain'], $cookie['secure'], $cookie['httponly']);

        header('Location: index.php', true, 303);
        exit;
    }

    if ($action === 'change_password') {
        if (!isset($_SESSION['user_id'], $_SESSION['role']) || !in_array($_SESSION['role'], ['cashier', 'kitchen'], true)) {
            http_response_code(403);
            exit('Access denied.');
        }

        require_once __DIR__ . '/config/database.php';

        $newPassword = is_string($_POST['new_password'] ?? null) ? $_POST['new_password'] : '';
        $confirmPassword = is_string($_POST['confirm_password'] ?? null) ? $_POST['confirm_password'] : '';

        if (strlen($newPassword) < 12) {
            $_SESSION['staff_error'] = 'New password must contain at least 12 characters.';
        } elseif ($newPassword !== $confirmPassword) {
            $_SESSION['staff_error'] = 'Passwords do not match.';
        } else {
            try {
                $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
                $update = $pdo->prepare(
                    'UPDATE users
                     SET password_hash = :password_hash,
                         must_change_password = 0,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id
                       AND role IN (\'cashier\', \'kitchen\')
                       AND is_active = 1
                       AND must_change_password = 1'
                );
                $update->execute([
                    ':password_hash' => $passwordHash,
                    ':id' => (int) $_SESSION['user_id']
                ]);

                if ($update->rowCount() === 1) {
                    $_SESSION['must_change_password'] = 0;
                    $_SESSION['staff_message'] = 'Password changed successfully.';
                    header('Location: index.php?dashboard=' . rawurlencode($_SESSION['role']), true, 303);
                    exit;
                }

                $_SESSION['staff_error'] = 'Password change could not be completed.';
            } catch (PDOException $exception) {
                error_log($exception->getMessage());
                $_SESSION['staff_error'] = 'Unable to update the password.';
            }
        }

        header('Location: index.php?change_password=1', true, 303);
        exit;
    }

    if ($action === 'reset_staff_password') {
        if (($sessionRole = $_SESSION['role'] ?? '') !== 'admin') {
            http_response_code(403);
            exit('Access denied.');
        }

        require_once __DIR__ . '/config/database.php';

        $accountId = filter_var($_POST['account_id'] ?? null, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1]
        ]);

        if ($accountId === false) {
            $staffError = 'Invalid staff account.';
        } else {
            try {
                $target = $pdo->prepare(
                    'SELECT id, username, role FROM users WHERE id = :id LIMIT 1'
                );
                $target->execute([':id' => $accountId]);
                $targetAccount = $target->fetch();

                if (
                    !$targetAccount ||
                    !in_array($targetAccount['role'], ['cashier', 'kitchen'], true)
                ) {
                    $staffError = 'Only Cashier or Kitchen Staff passwords can be reset.';
                } else {
                    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
                    $temporaryPassword = '';
                    for ($i = 0; $i < 16; $i++) {
                        $temporaryPassword .= $alphabet[random_int(0, strlen($alphabet) - 1)];
                    }

                    $passwordHash = password_hash($temporaryPassword, PASSWORD_DEFAULT);
                    $reset = $pdo->prepare(
                        'UPDATE users
                         SET password_hash = :password_hash,
                             must_change_password = 1,
                             updated_at = CURRENT_TIMESTAMP
                         WHERE id = :id
                           AND role IN (\'cashier\', \'kitchen\')'
                    );
                    $reset->execute([
                        ':password_hash' => $passwordHash,
                        ':id' => $accountId
                    ]);

                    if ($reset->rowCount() === 1) {
                        $_SESSION['temporary_password'] = $temporaryPassword;
                        $_SESSION['temporary_password_username'] = (string) $targetAccount['username'];
                        $_SESSION['staff_message'] = 'Temporary password generated successfully.';
                    } else {
                        $staffError = 'Unable to reset the staff password.';
                    }
                }
            } catch (PDOException $exception) {
                error_log($exception->getMessage());
                $staffError = 'Unable to reset the staff password.';
            }
        }
    }

    if ($action === 'create_staff' || $action === 'set_staff_status' || $action === 'delete_staff') {
        if (($sessionRole = $_SESSION['role'] ?? '') !== 'admin') {
            http_response_code(403);
            exit('Access denied.');
        }

        require_once __DIR__ . '/config/database.php';

        if ($action === 'create_staff') {
            $fullName = is_string($_POST['full_name'] ?? null) ? trim($_POST['full_name']) : '';
            $username = is_string($_POST['username'] ?? null) ? trim($_POST['username']) : '';
            $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
            $confirmPassword = is_string($_POST['confirm_password'] ?? null) ? $_POST['confirm_password'] : '';
            $staffRole = is_string($_POST['staff_role'] ?? null) ? $_POST['staff_role'] : '';

            if ($fullName === '' || strlen($fullName) > 100) {
                $staffError = 'Please enter a valid full name.';
            } elseif (!preg_match('/^[A-Za-z0-9._-]{3,50}$/', $username)) {
                $staffError = 'Username must be 3-50 characters and use letters, numbers, dots, underscores, or hyphens.';
            } elseif (!in_array($staffRole, ['cashier', 'kitchen'], true)) {
                $staffError = 'Invalid staff role.';
            } elseif (strlen($password) < 12) {
                $staffError = 'Password must contain at least 12 characters.';
            } elseif ($password !== $confirmPassword) {
                $staffError = 'Passwords do not match.';
            } else {
                try {
                    $check = $pdo->prepare('SELECT COUNT(*) FROM users WHERE username = :username');
                    $check->execute([':username' => $username]);

                    if ((int) $check->fetchColumn() > 0) {
                        $staffError = 'That username is already in use.';
                    } else {
                        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                        $insert = $pdo->prepare(
                            "INSERT INTO users (full_name, username, password_hash, role, is_active)
                             VALUES (:full_name, :username, :password_hash, :role, 1)"
                        );
                        $insert->execute([
                            ':full_name' => $fullName,
                            ':username' => $username,
                            ':password_hash' => $passwordHash,
                            ':role' => $staffRole
                        ]);
                        $staffMessage = 'Staff account created successfully.';
                    }
                } catch (PDOException $exception) {
                    if ($exception->getCode() === '23000') {
                        $staffError = 'That username is already in use.';
                    } else {
                        error_log($exception->getMessage());
                        $staffError = 'Unable to create the staff account. Please try again.';
                    }
                }
            }
        } elseif ($action === 'set_staff_status') {
            $accountId = filter_var($_POST['account_id'] ?? null, FILTER_VALIDATE_INT, [
                'options' => ['min_range' => 1]
            ]);
            $isActive = filter_var($_POST['is_active'] ?? null, FILTER_VALIDATE_INT);

            if ($accountId === false || !in_array($isActive, [0, 1], true)) {
                $staffError = 'Invalid account status request.';
            } elseif ($isActive === 0 && $accountId === (int) ($_SESSION['user_id'] ?? 0)) {
                $staffError = 'You cannot deactivate your own account.';
            } else {
                try {
                    $target = $pdo->prepare('SELECT role, is_active FROM users WHERE id = :id');
                    $target->execute([':id' => $accountId]);
                    $targetAccount = $target->fetch();

                    if (!$targetAccount) {
                        $staffError = 'Staff account not found.';
                    } elseif ($targetAccount['role'] === 'admin' && $isActive === 0) {
                        $adminCount = $pdo->query(
                            "SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1"
                        )->fetchColumn();
                        $staffError = (int) $adminCount <= 1
                            ? 'The last active Admin account cannot be deactivated.'
                            : 'Admin accounts cannot be deactivated through staff management.';
                    } elseif (!in_array($targetAccount['role'], ['cashier', 'kitchen'], true)) {
                        $staffError = 'Only Cashier or Kitchen Staff accounts can be changed.';
                    } elseif ((int) $targetAccount['is_active'] === $isActive) {
                        $staffMessage = $isActive === 1
                            ? 'Staff account is already active.'
                            : 'Staff account is already inactive.';
                    } else {
                        $update = $pdo->prepare(
                            'UPDATE users
                             SET is_active = :is_active, updated_at = CURRENT_TIMESTAMP
                             WHERE id = :id AND role IN (\'cashier\', \'kitchen\')'
                        );
                        $update->execute([
                            ':is_active' => $isActive,
                            ':id' => $accountId
                        ]);
                        $staffMessage = $isActive === 1
                            ? 'Staff account reactivated successfully.'
                            : 'Staff account deactivated successfully.';
                    }
                } catch (PDOException $exception) {
                    error_log($exception->getMessage());
                    $staffError = 'Unable to update the staff account.';
                }
            }
        } else {
            $accountId = filter_var($_POST['account_id'] ?? null, FILTER_VALIDATE_INT, [
                'options' => ['min_range' => 1]
            ]);

            if ($accountId === false) {
                $staffError = 'Invalid staff account.';
            } else {
                try {
                    $pdo->beginTransaction();
                    $target = $pdo->prepare(
                        'SELECT role FROM users WHERE id = :id FOR UPDATE'
                    );
                    $target->execute([':id' => $accountId]);
                    $targetAccount = $target->fetch();

                    if (!$targetAccount) {
                        $staffError = 'Staff account not found.';
                    } elseif (!in_array($targetAccount['role'], ['cashier', 'kitchen'], true)) {
                        $staffError = 'Only Cashier or Kitchen Staff accounts can be permanently deleted.';
                    } else {
                        $referenceColumns = getStaffDeletionReferenceColumns($pdo);
                        $deletionBlockReason = getStaffDeletionBlockReason($pdo, $accountId, $referenceColumns);

                        if ($deletionBlockReason !== null) {
                            $staffError = $deletionBlockReason;
                        } else {
                            $delete = $pdo->prepare(
                                'DELETE FROM users
                                 WHERE id = :id AND role IN (\'cashier\', \'kitchen\')'
                            );
                            $delete->execute([':id' => $accountId]);

                            if ($delete->rowCount() === 1) {
                                $staffMessage = 'Unused staff account permanently deleted.';
                            } else {
                                $staffError = 'Unable to delete the staff account.';
                            }
                        }
                    }

                    $pdo->commit();
                } catch (PDOException $exception) {
                    if ($pdo->inTransaction()) {
                        $pdo->rollBack();
                    }

                    if ($exception->getCode() === '23000') {
                        $staffError = 'Permanent deletion is blocked because related records reference this account. Deactivate it instead.';
                    } else {
                        error_log($exception->getMessage());
                        $staffError = 'Unable to verify or delete the staff account. Deactivate it instead.';
                    }
                }
            }
        }
    }

    if (
        $action === 'create_staff' ||
        $action === 'set_staff_status' ||
        $action === 'delete_staff' ||
        $action === 'reset_staff_password'
    ) {
        if ($staffMessage !== '') {
            $_SESSION['staff_message'] = $staffMessage;
        }
        if ($staffError !== '') {
            $_SESSION['staff_error'] = $staffError;
        }
    }

    if ($action !== 'login') {
        $authenticatedUser = null;
        if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
            $authenticatedUser = [
                'id' => (int) ($_SESSION['user_id'] ?? 0),
                'username' => (string) ($_SESSION['username'] ?? ''),
                'name' => (string) ($_SESSION['full_name'] ?? ''),
                'role' => 'admin'
            ];
        }

        if ($authenticatedUser !== null) {
            $requestedDashboard = $_GET['dashboard'] ?? 'admin';
            header('Location: index.php?dashboard=' . rawurlencode($requestedDashboard) . '&staff=1', true, 303);
            exit;
        }

        http_response_code(400);
        exit('Invalid request.');
    }

    $username = is_string($_POST['username'] ?? null) ? trim($_POST['username']) : '';
    $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';

    if ($username === '' || $password === '') {
        $loginError = 'Enter both your username and password.';
    } else {
        require_once __DIR__ . '/config/database.php';

        try {
            $statement = $pdo->prepare(
                'SELECT id, full_name, username, password_hash, role, is_active, must_change_password
                 FROM users
                 WHERE username = :username
                 LIMIT 1'
            );
            $statement->execute([':username' => $username]);
            $account = $statement->fetch();
        } catch (PDOException $exception) {
            error_log($exception->getMessage());
            $loginError = 'Unable to sign in right now. Please try again later.';
            $account = false;
        }

        if (
            $account &&
            (int) $account['is_active'] === 1 &&
            in_array($account['role'], $roles, true) &&
            password_verify($password, $account['password_hash'])
        ) {
            session_regenerate_id(true);
            $_SESSION = [
                'user_id' => (int) $account['id'],
                'username' => $account['username'],
                'full_name' => $account['full_name'],
                'role' => $account['role'],
                'must_change_password' => (int) $account['must_change_password'],
                'csrf_token' => bin2hex(random_bytes(32))
            ];

            if (
                in_array($account['role'], ['cashier', 'kitchen'], true) &&
                (int) $account['must_change_password'] === 1
            ) {
                header('Location: index.php?change_password=1', true, 303);
            } else {
                header('Location: index.php?dashboard=' . rawurlencode($account['role']), true, 303);
            }
            exit;
        }

        if ($loginError === '') {
            $loginError = 'Incorrect username or password. Please try again.';
        }
    }
}

$requestedRole = is_string($_GET['dashboard'] ?? null) ? $_GET['dashboard'] : '';
$changePasswordRequested = isset($_GET['change_password']) && $_GET['change_password'] === '1';

if (
    $authenticatedUser !== null &&
    in_array($authenticatedUser['role'], ['cashier', 'kitchen'], true) &&
    (int) $authenticatedUser['must_change_password'] === 1 &&
    !$changePasswordRequested
) {
    header('Location: index.php?change_password=1');
    exit;
}

if (
    $authenticatedUser !== null &&
    in_array($authenticatedUser['role'], ['cashier', 'kitchen'], true) &&
    (int) $authenticatedUser['must_change_password'] === 0 &&
    $changePasswordRequested
) {
    header('Location: index.php?dashboard=' . rawurlencode($authenticatedUser['role']));
    exit;
}

if ($authenticatedUser !== null && $authenticatedUser['role'] === 'admin' && $changePasswordRequested) {
    header('Location: index.php?dashboard=admin');
    exit;
}

if ($authenticatedUser === null && (isset($_GET['dashboard']) || $changePasswordRequested)) {
    header('Location: index.php');
    exit;
}
if ($authenticatedUser !== null && $requestedRole !== $authenticatedUser['role']) {
    header('Location: index.php?dashboard=' . rawurlencode($authenticatedUser['role']));
    exit;
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($authenticatedUser !== null && $authenticatedUser['role'] === 'admin') {
    try {
        $staffQuery = $pdo->query(
            'SELECT id, full_name, username, role, is_active, must_change_password, created_at
             FROM users
             WHERE role IN (\'admin\', \'cashier\', \'kitchen\')
             ORDER BY created_at DESC, id DESC'
        );
        $staffAccounts = $staffQuery->fetchAll();

        $referenceColumns = getStaffDeletionReferenceColumns($pdo);
        foreach ($staffAccounts as &$staffAccount) {
            if ($staffAccount['role'] === 'admin') {
                $staffAccount['deletion_block_reason'] = 'Admin accounts cannot be permanently deleted.';
                continue;
            }

            $staffAccount['deletion_block_reason'] = getStaffDeletionBlockReason(
                $pdo,
                (int) $staffAccount['id'],
                $referenceColumns
            );
        }
        unset($staffAccount);
    } catch (PDOException $exception) {
        error_log($exception->getMessage());
        $staffError = 'Unable to verify staff account history.';
        foreach ($staffAccounts as &$staffAccount) {
            $staffAccount['deletion_block_reason'] = 'Unable to verify transaction history. Deactivate this account instead.';
        }
        unset($staffAccount);
    }
}

$clientAuth = [
    'user' => $authenticatedUser,
    'csrfToken' => $_SESSION['csrf_token'],
    'loginError' => $loginError,
    'staffAccounts' => $staffAccounts,
    'staffMessage' => $staffMessage,
    'staffError' => $staffError,
    'temporaryPassword' => $temporaryPassword,
    'temporaryPasswordUsername' => $temporaryPasswordUsername
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="YDUR's Fried & Grill restaurant management system." />
  <title>YDUR's Fried &amp; Grill | Sign in</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="docs/css/style.css" />
</head>
<body>
  <div id="app"></div>
  <script>
    window.YDUR_AUTH = <?= json_encode($clientAuth, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
  </script>
  <script src="docs/js/app.js"></script>
</body>
</html>
