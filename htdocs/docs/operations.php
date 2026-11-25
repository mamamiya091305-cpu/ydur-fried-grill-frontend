<?php

ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);
date_default_timezone_set('Asia/Manila');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

function operationsResponse(array $body, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($body, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    exit;
}

function operationsDate(string $value): bool
{
    $date = DateTime::createFromFormat('!Y-m-d', $value, new DateTimeZone('Asia/Manila'));
    return $date !== false && $date->format('Y-m-d') === $value;
}

function operationsTime(string $value): bool
{
    if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $value)) {
        return false;
    }

    return true;
}

function operationsCleanText($value, int $limit): ?string
{
    if (!is_string($value)) {
        return null;
    }

    $value = trim($value);
    if (strlen($value) > $limit) {
        return null;
    }

    return $value;
}

function operationsPaymentMethodLabel(string $method): string
{
    $method = strtolower($method);
    return $method === 'gcash' ? 'GCash' : ucwords(str_replace('_', ' ', $method));
}

function operationsDateTime(string $date, string $time): string
{
    return $date . ' ' . $time . ':00';
}

$isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.cookie_httponly', '1');
ini_set('session.cookie_samesite', 'Lax');
session_set_cookie_params(0, '/', '', $isHttps, true);
session_start();

if (!isset($_SESSION['user_id'], $_SESSION['role'], $_SESSION['csrf_token'])) {
    operationsResponse(['error' => 'Sign in to access Daily Operations.'], 401);
}

require_once dirname(__DIR__) . '/config/database.php';

try {
    $pdo->exec("SET time_zone = '+08:00'");
    $accountQuery = $pdo->prepare(
        'SELECT id, full_name, role, is_active, must_change_password
         FROM users WHERE id = :id LIMIT 1'
    );
    $accountQuery->execute([':id' => (int) $_SESSION['user_id']]);
    $account = $accountQuery->fetch();
} catch (PDOException $exception) {
    error_log($exception->getMessage());
    operationsResponse(['error' => 'Unable to verify your account. Please try again.'], 500);
}

if (
    !$account ||
    (int) $account['is_active'] !== 1 ||
    $account['role'] !== $_SESSION['role'] ||
    (int) $account['must_change_password'] === 1 ||
    !in_array($account['role'], ['admin', 'cashier', 'kitchen'], true)
) {
    operationsResponse(['error' => 'Your account is not authorized to access Daily Operations.'], 403);
}

$role = (string) $account['role'];
$userId = (int) $account['id'];
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));

if ($method === 'GET') {
    if (($_GET['view'] ?? '') === 'history') {
        if ($role !== 'admin') {
            operationsResponse(['error' => 'Only Administrators can access Sales History.'], 403);
        }

        $from = is_string($_GET['from'] ?? null) ? $_GET['from'] : '';
        $to = is_string($_GET['to'] ?? null) ? $_GET['to'] : '';
        if (!operationsDate($from) || !operationsDate($to) || $from > $to) {
            operationsResponse(['error' => 'Choose a valid Sales History date range.'], 422);
        }

        try {
            $historyQuery = $pdo->prepare(
                "SELECT d.id, d.operation_date,
                        CONCAT(DATE_FORMAT(d.opened_at, '%Y-%m-%dT%H:%i:%s'), '+08:00') AS opened_at,
                        CONCAT(DATE_FORMAT(d.closed_at, '%Y-%m-%dT%H:%i:%s'), '+08:00') AS closed_at,
                        d.assigned_staff_id, staff.full_name AS assigned_staff,
                        opener.full_name AS opened_by_name, closer.full_name AS closed_by_name,
                        COALESCE(order_summary.total_orders, 0) AS total_orders,
                        COALESCE(order_summary.completed_orders, 0) AS completed_orders,
                        COALESCE(order_summary.cancelled_orders, 0) AS cancelled_orders,
                        COALESCE(payment_summary.transaction_count, 0) AS transaction_count,
                        COALESCE(payment_summary.total_sales, 0) AS total_sales
                 FROM daily_operations d
                 JOIN users staff ON staff.id = d.assigned_staff_id
                 JOIN users opener ON opener.id = d.opened_by
                 LEFT JOIN users closer ON closer.id = d.closed_by
                 LEFT JOIN (
                    SELECT daily_op.id AS operation_id, COUNT(o.id) AS total_orders,
                           SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
                           SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
                    FROM daily_operations daily_op
                    LEFT JOIN orders o
                      ON (o.daily_operation_id = daily_op.id
                          OR (o.daily_operation_id IS NULL AND DATE(o.created_at) = daily_op.operation_date))
                    WHERE daily_op.status = 'closed'
                      AND daily_op.operation_date BETWEEN :orders_from AND :orders_to
                    GROUP BY daily_op.id
                 ) order_summary ON order_summary.operation_id = d.id
                 LEFT JOIN (
                    SELECT daily_op.id AS operation_id, COUNT(p.id) AS transaction_count,
                           COALESCE(SUM(p.amount), 0) AS total_sales
                    FROM daily_operations daily_op
                    LEFT JOIN payments p
                      ON (p.daily_operation_id = daily_op.id
                          OR (p.daily_operation_id IS NULL AND DATE(p.paid_at) = daily_op.operation_date))
                    WHERE daily_op.status = 'closed'
                      AND daily_op.operation_date BETWEEN :payments_from AND :payments_to
                    GROUP BY daily_op.id
                 ) payment_summary ON payment_summary.operation_id = d.id
                 WHERE d.status = 'closed'
                   AND d.operation_date BETWEEN :history_from AND :history_to
                 ORDER BY d.operation_date DESC, d.id DESC"
            );
            $historyQuery->execute([
                ':orders_from' => $from,
                ':orders_to' => $to,
                ':payments_from' => $from,
                ':payments_to' => $to,
                ':history_from' => $from,
                ':history_to' => $to
            ]);
            $history = $historyQuery->fetchAll();
            $paymentBreakdownQuery = $pdo->prepare(
                "SELECT d.id AS operation_id, p.payment_method, SUM(p.amount) AS amount
                 FROM daily_operations d
                 JOIN payments p
                   ON (p.daily_operation_id = d.id
                       OR (p.daily_operation_id IS NULL AND DATE(p.paid_at) = d.operation_date))
                 WHERE d.status = 'closed'
                   AND d.operation_date BETWEEN :from_date AND :to_date
                 GROUP BY d.id, p.payment_method"
            );
            $paymentBreakdownQuery->execute([':from_date' => $from, ':to_date' => $to]);
            $breakdowns = [];
            foreach ($paymentBreakdownQuery->fetchAll() as $payment) {
                $operationId = (int) $payment['operation_id'];
                $methodName = operationsPaymentMethodLabel((string) $payment['payment_method']);
                $breakdowns[$operationId][$methodName] = (float) $payment['amount'];
            }

            foreach ($history as &$record) {
                $record['id'] = (int) $record['id'];
                $record['assigned_staff_id'] = (int) $record['assigned_staff_id'];
                $record['total_orders'] = (int) $record['total_orders'];
                $record['completed_orders'] = (int) $record['completed_orders'];
                $record['cancelled_orders'] = (int) $record['cancelled_orders'];
                $record['transaction_count'] = (int) $record['transaction_count'];
                $record['total_sales'] = (float) $record['total_sales'];
                $record['payment_breakdown'] = $breakdowns[$record['id']] ?? [];
            }
            unset($record);

            operationsResponse(['from' => $from, 'to' => $to, 'operations' => $history]);
        } catch (PDOException $exception) {
            error_log($exception->getMessage());
            operationsResponse(['error' => 'Unable to load Sales History. Please try again.'], 500);
        }
    }

    $date = is_string($_GET['date'] ?? null) ? $_GET['date'] : '';
    if (!operationsDate($date)) {
        operationsResponse(['error' => 'Choose a valid operation date.'], 422);
    }

    try {
        $operationQuery = $pdo->prepare(
            "SELECT d.id, d.operation_date AS date, d.assigned_staff_id, d.opened_by, d.closed_by,
                    CONCAT(DATE_FORMAT(d.opened_at, '%Y-%m-%dT%H:%i:%s'), '+08:00') AS opened_at,
                    CASE WHEN d.closed_at IS NULL THEN NULL
                         ELSE CONCAT(DATE_FORMAT(d.closed_at, '%Y-%m-%dT%H:%i:%s'), '+08:00')
                    END AS closed_at,
                    d.notes, d.status, u.full_name AS assigned_staff
             FROM daily_operations d
             JOIN users u ON u.id = d.assigned_staff_id
             WHERE d.operation_date = :operation_date
             LIMIT 1"
        );
        $operationQuery->execute([':operation_date' => $date]);
        $operation = $operationQuery->fetch() ?: null;
        if ($operation) {
            $operation['id'] = (int) $operation['id'];
            $operation['assigned_staff_id'] = (int) $operation['assigned_staff_id'];
        }

        $operationId = $operation ? (int) $operation['id'] : null;
        $kitchenFilter = $role === 'kitchen'
            ? ' AND (o.assigned_kitchen_id = :kitchen_user_id OR o.assigned_kitchen_id IS NULL)'
            : '';
        $ordersQuery = $pdo->prepare(
            "SELECT o.id, o.order_number, o.customer_name, o.order_type, o.status,
                    o.payment_status, o.total, o.notes,
                    CONCAT(DATE_FORMAT(o.created_at, '%Y-%m-%dT%H:%i:%s'), '+08:00') AS created_at
             FROM orders o
             WHERE (o.daily_operation_id = :operation_id
                    OR (o.daily_operation_id IS NULL AND DATE(o.created_at) = :operation_date))
             " . $kitchenFilter . "
             ORDER BY o.created_at DESC, o.id DESC"
        );
        $orderParameters = [
            ':operation_id' => $operationId,
            ':operation_date' => $date
        ];
        if ($role === 'kitchen') {
            $orderParameters[':kitchen_user_id'] = $userId;
        }
        $ordersQuery->execute($orderParameters);
        $orders = $ordersQuery->fetchAll();
        $orderIds = [];
        $orderIndex = [];
        foreach ($orders as $index => &$order) {
            $order['id'] = (int) $order['id'];
            $order['total'] = (float) $order['total'];
            $order['items'] = [];
            $orderIds[] = $order['id'];
            $orderIndex[$order['id']] = $index;
        }
        unset($order);

        if ($orderIds) {
            $itemPlaceholders = [];
            $itemParameters = [];
            foreach ($orderIds as $index => $orderId) {
                $placeholder = ':order_' . $index;
                $itemPlaceholders[] = $placeholder;
                $itemParameters[$placeholder] = $orderId;
            }
            $itemsQuery = $pdo->prepare(
                'SELECT order_id, product_id, product_name, quantity, unit_price,
                        line_total, special_instructions
                 FROM order_items
                 WHERE order_id IN (' . implode(', ', $itemPlaceholders) . ')
                 ORDER BY id'
            );
            $itemsQuery->execute($itemParameters);
            foreach ($itemsQuery->fetchAll() as $item) {
                $orderId = (int) $item['order_id'];
                if (!isset($orderIndex[$orderId])) {
                    continue;
                }
                $orders[$orderIndex[$orderId]]['items'][] = [
                    'product_id' => $item['product_id'] === null ? null : (int) $item['product_id'],
                    'name' => (string) $item['product_name'],
                    'quantity' => (int) $item['quantity'],
                    'unit_price' => (float) $item['unit_price'],
                    'line_total' => (float) $item['line_total'],
                    'instructions' => (string) ($item['special_instructions'] ?? '')
                ];
            }
        }

        $sales = [];
        $paymentBreakdown = [];
        $summary = [
            'total_sales' => 0.0,
            'total_orders' => count($orders),
            'completed_orders' => 0,
            'pending_orders' => 0,
            'preparing_orders' => 0,
            'ready_orders' => 0,
            'cancelled_orders' => 0,
            'revenue' => 0.0,
            'transaction_count' => 0
        ];
        foreach ($orders as $order) {
            if ($order['status'] === 'completed') {
                $summary['completed_orders']++;
            } elseif ($order['status'] === 'pending') {
                $summary['pending_orders']++;
            } elseif ($order['status'] === 'preparing') {
                $summary['preparing_orders']++;
            } elseif ($order['status'] === 'ready') {
                $summary['ready_orders']++;
            } elseif ($order['status'] === 'cancelled') {
                $summary['cancelled_orders']++;
            }
        }

        if ($role !== 'kitchen') {
            $salesQuery = $pdo->prepare(
                "SELECT p.id, p.order_id, o.order_number, p.amount, p.payment_method,
                        p.reference_number,
                        CONCAT(DATE_FORMAT(p.paid_at, '%Y-%m-%dT%H:%i:%s'), '+08:00') AS paid_at
                 FROM payments p
                 JOIN orders o ON o.id = p.order_id
                 WHERE (p.daily_operation_id = :operation_id
                        OR (p.daily_operation_id IS NULL AND DATE(p.paid_at) = :payment_date))
                 ORDER BY p.paid_at DESC, p.id DESC"
            );
            $salesQuery->execute([
                ':operation_id' => $operationId,
                ':payment_date' => $date
            ]);
            $sales = $salesQuery->fetchAll();
            foreach ($sales as &$sale) {
                $sale['id'] = (int) $sale['id'];
                $sale['order_id'] = (int) $sale['order_id'];
                $sale['amount'] = (float) $sale['amount'];
                $methodName = operationsPaymentMethodLabel((string) $sale['payment_method']);
                $paymentBreakdown[$methodName] = ($paymentBreakdown[$methodName] ?? 0) + $sale['amount'];
                $summary['total_sales'] += $sale['amount'];
            }
            unset($sale);
            $summary['revenue'] = $summary['total_sales'];
            $summary['transaction_count'] = count($sales);
        }

        $bestSellers = [];
        if ($role !== 'kitchen') {
            $bestSellersQuery = $pdo->prepare(
                "SELECT i.product_id, i.product_name, SUM(i.quantity) AS quantity_sold,
                        SUM(i.line_total) AS sales_total
                 FROM order_items i
                 JOIN orders o ON o.id = i.order_id
                 WHERE (o.daily_operation_id = :operation_id
                        OR (o.daily_operation_id IS NULL AND DATE(o.created_at) = :order_date))
                   AND o.payment_status IN ('partially_paid', 'paid')
                   AND o.status <> 'cancelled'
                 GROUP BY i.product_id, i.product_name
                 ORDER BY quantity_sold DESC, sales_total DESC, i.product_name
                 LIMIT 10"
            );
            $bestSellersQuery->execute([
                ':operation_id' => $operationId,
                ':order_date' => $date
            ]);
            $bestSellers = $bestSellersQuery->fetchAll();
            foreach ($bestSellers as &$product) {
                $product['quantity_sold'] = (int) $product['quantity_sold'];
                $product['sales_total'] = (float) $product['sales_total'];
            }
            unset($product);
        }

        $productsQuery = $pdo->query(
            "SELECT p.id, p.product_name, p.price, p.description,
                    COALESCE(c.category_name, 'Uncategorized') AS category
             FROM products p
             LEFT JOIN categories c ON c.id = p.category_id
             WHERE p.is_available = 1
             ORDER BY c.category_name, p.product_name"
        );
        $products = $productsQuery->fetchAll();
        foreach ($products as &$product) {
            $product['id'] = (int) $product['id'];
            $product['price'] = (float) $product['price'];
        }
        unset($product);

        $staff = [];
        $kitchenStaff = [];
        if ($role === 'admin') {
            $staffQuery = $pdo->query(
                "SELECT id, full_name
                 FROM users
                 WHERE role = 'cashier' AND is_active = 1
                 ORDER BY full_name, id"
            );
            $staff = $staffQuery->fetchAll();
            foreach ($staff as &$staffMember) {
                $staffMember['id'] = (int) $staffMember['id'];
            }
            unset($staffMember);
            $kitchenStaffQuery = $pdo->query(
                "SELECT id, full_name
                 FROM users
                 WHERE role = 'kitchen' AND is_active = 1
                 ORDER BY full_name, id"
            );
            $kitchenStaff = $kitchenStaffQuery->fetchAll();
            foreach ($kitchenStaff as &$staffMember) {
                $staffMember['id'] = (int) $staffMember['id'];
            }
            unset($staffMember);
        } elseif ($role === 'cashier') {
            $staff[] = ['id' => $userId, 'full_name' => (string) $account['full_name']];
            $kitchenStaffQuery = $pdo->query(
                "SELECT id, full_name
                 FROM users
                 WHERE role = 'kitchen' AND is_active = 1
                 ORDER BY full_name, id"
            );
            $kitchenStaff = $kitchenStaffQuery->fetchAll();
            foreach ($kitchenStaff as &$staffMember) {
                $staffMember['id'] = (int) $staffMember['id'];
            }
            unset($staffMember);
        }

        if ($role === 'kitchen') {
            foreach ($orders as &$order) {
                unset($order['total'], $order['payment_status']);
                foreach ($order['items'] as &$item) {
                    unset($item['unit_price'], $item['line_total']);
                }
                unset($item);
            }
            unset($order);
            $products = [];
        }

        operationsResponse([
            'date' => $date,
            'role' => $role,
            'operation' => $operation,
            'summary' => $summary,
            'orders' => $orders,
            'sales' => $sales,
            'payment_breakdown' => $paymentBreakdown,
            'best_sellers' => $bestSellers,
            'products' => $products,
            'staff' => $staff,
            'kitchen_staff' => $kitchenStaff
        ]);
    } catch (PDOException $exception) {
        error_log($exception->getMessage());
        operationsResponse(['error' => 'Unable to load daily operations. Please try again.'], 500);
    }
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    operationsResponse(['error' => 'This request method is not supported.'], 405);
}

$postedToken = is_string($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null)
    ? $_SERVER['HTTP_X_CSRF_TOKEN']
    : '';
if ($postedToken === '' || !hash_equals((string) $_SESSION['csrf_token'], $postedToken)) {
    operationsResponse(['error' => 'Your session token is invalid. Refresh the page and try again.'], 403);
}

$payload = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($payload)) {
    operationsResponse(['error' => 'The request data is invalid.'], 400);
}

$action = is_string($payload['action'] ?? null) ? $payload['action'] : '';
$date = is_string($payload['date'] ?? null) ? $payload['date'] : '';
if (!operationsDate($date)) {
    operationsResponse(['error' => 'Choose a valid operation date.'], 422);
}

if (in_array($action, ['create_operation', 'set_operation_status'], true) && $role !== 'admin') {
    operationsResponse(['error' => 'Only Administrators can start or close daily operations.'], 403);
}

if (in_array($action, ['create_order', 'record_payment'], true) &&
    !in_array($role, ['admin', 'cashier'], true)
) {
    operationsResponse(['error' => 'Only Admins and Cashiers can manage orders and sales.'], 403);
}

if ($action === 'update_operation' && $role !== 'admin') {
    operationsResponse(['error' => 'Only Administrators can edit operation settings.'], 403);
}

try {
    $operationQuery = $pdo->prepare(
        'SELECT id, status FROM daily_operations WHERE operation_date = :operation_date LIMIT 1'
    );
    $operationQuery->execute([':operation_date' => $date]);
    $operation = $operationQuery->fetch() ?: null;

    if ($action === 'create_operation') {
        if ($operation) {
            operationsResponse(['error' => 'A daily operation already exists for this date.'], 409);
        }

        if ($role !== 'admin' || $date !== date('Y-m-d')) {
            operationsResponse(['error' => 'Only an Administrator can start an operation for the current Philippine business date.'], 403);
        }

        $assignedStaffId = filter_var($payload['assigned_staff_id'] ?? null, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1]
        ]);
        $openingTime = is_string($payload['opening_time'] ?? null) ? $payload['opening_time'] : '';
        $notes = operationsCleanText($payload['notes'] ?? '', 4000);

        if (
            $assignedStaffId === false ||
            !operationsTime($openingTime) ||
            $notes === null
        ) {
            operationsResponse(['error' => 'Review the operation date, opening time, assigned cashier, and notes.'], 422);
        }

        $staffQuery = $pdo->prepare(
            "SELECT id FROM users
             WHERE id = :id AND role = 'cashier' AND is_active = 1
             LIMIT 1"
        );
        $staffQuery->execute([':id' => $assignedStaffId]);
        if (!$staffQuery->fetchColumn()) {
            operationsResponse(['error' => 'Choose an active Cashier account.'], 422);
        }

        $pdo->beginTransaction();
        $activeOperationQuery = $pdo->query(
            "SELECT id FROM daily_operations WHERE status = 'open' LIMIT 1 FOR UPDATE"
        );
        if ($activeOperationQuery->fetchColumn()) {
            $pdo->rollBack();
            operationsResponse(['error' => 'Another daily operation is already open. Close it before starting a new business day.'], 409);
        }
        $insert = $pdo->prepare(
            "INSERT INTO daily_operations
                (operation_date, assigned_staff_id, opened_by, opened_at, notes, status)
             VALUES
                (:operation_date, :assigned_staff_id, :opened_by, :opened_at, :notes, 'open')"
        );
        $insert->execute([
            ':operation_date' => $date,
            ':assigned_staff_id' => $assignedStaffId,
            ':opened_by' => $userId,
            ':opened_at' => operationsDateTime($date, $openingTime),
            ':notes' => $notes === '' ? null : $notes
        ]);
        $pdo->commit();

        operationsResponse(['message' => 'Daily operation created successfully.']);
    }

    if ($action === 'set_operation_status') {
        if (!$operation) {
            operationsResponse(['error' => 'Create a daily operation before changing its status.'], 404);
        }
        $status = is_string($payload['status'] ?? null) ? $payload['status'] : '';
        if ($status !== 'closed') {
            operationsResponse(['error' => 'An open operation can only be closed.'], 422);
        }

        $pdo->beginTransaction();
        $lockedOperationQuery = $pdo->prepare(
            'SELECT status FROM daily_operations WHERE id = :id FOR UPDATE'
        );
        $lockedOperationQuery->execute([':id' => (int) $operation['id']]);
        if ($lockedOperationQuery->fetchColumn() !== 'open') {
            $pdo->rollBack();
            operationsResponse(['error' => 'This operation is already closed and cannot be reopened.'], 409);
        }
        $update = $pdo->prepare(
            "UPDATE daily_operations
             SET status = 'closed', closed_at = :closed_at, closed_by = :closed_by
             WHERE id = :id"
        );
        $update->execute([
            ':closed_at' => date('Y-m-d H:i:s'),
            ':closed_by' => $userId,
            ':id' => (int) $operation['id']
        ]);
        $pdo->commit();

        operationsResponse(['message' => 'Daily operation closed. Its records are now available in Sales History.']);
    }

    if ($action === 'update_operation') {
        if (!$operation) {
            operationsResponse(['error' => 'No daily operation exists for this date.'], 404);
        }
        if ($operation['status'] !== 'open') {
            operationsResponse(['error' => 'Closed operations are read-only.'], 409);
        }
        $assignedStaffId = filter_var($payload['assigned_staff_id'] ?? null, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1]
        ]);
        $notes = operationsCleanText($payload['notes'] ?? '', 4000);
        if ($assignedStaffId === false || $notes === null) {
            operationsResponse(['error' => 'Review the assigned cashier and operation notes.'], 422);
        }
        $staffQuery = $pdo->prepare(
            "SELECT id FROM users
             WHERE id = :id AND role = 'cashier' AND is_active = 1
             LIMIT 1"
        );
        $staffQuery->execute([':id' => $assignedStaffId]);
        if (!$staffQuery->fetchColumn()) {
            operationsResponse(['error' => 'Choose an active Cashier account.'], 422);
        }
        $pdo->beginTransaction();
        $lockedOperationQuery = $pdo->prepare(
            'SELECT status FROM daily_operations WHERE id = :id FOR UPDATE'
        );
        $lockedOperationQuery->execute([':id' => (int) $operation['id']]);
        if ($lockedOperationQuery->fetchColumn() !== 'open') {
            $pdo->rollBack();
            operationsResponse(['error' => 'Closed operations are read-only.'], 409);
        }
        $update = $pdo->prepare(
            'UPDATE daily_operations
             SET assigned_staff_id = :assigned_staff_id, notes = :notes
             WHERE id = :id'
        );
        $update->execute([
            ':assigned_staff_id' => $assignedStaffId,
            ':notes' => $notes === '' ? null : $notes,
            ':id' => (int) $operation['id']
        ]);
        $pdo->commit();
        operationsResponse(['message' => 'Operation settings saved.']);
    }

    if ($action === 'create_order') {
        if (!$operation || $operation['status'] !== 'open') {
            operationsResponse(['error' => 'Open a daily operation before creating an order.'], 409);
        }
        if ($date !== date('Y-m-d')) {
            operationsResponse(['error' => 'New orders can only be recorded for the current Philippine business date.'], 409);
        }

        $clientRequestId = operationsCleanText($payload['client_request_id'] ?? '', 64);
        $customerName = operationsCleanText($payload['customer_name'] ?? '', 120);
        $notes = operationsCleanText($payload['notes'] ?? '', 4000);
        $orderType = is_string($payload['order_type'] ?? null) ? $payload['order_type'] : '';
        $kitchenStaffId = $payload['assigned_kitchen_id'] ?? null;
        if ($kitchenStaffId !== null && $kitchenStaffId !== '') {
            $kitchenStaffId = filter_var($kitchenStaffId, FILTER_VALIDATE_INT, [
                'options' => ['min_range' => 1]
            ]);
        } else {
            $kitchenStaffId = null;
        }
        $items = $payload['items'] ?? null;
        if (
            $clientRequestId === null ||
            !preg_match('/^[A-Za-z0-9-]{16,64}$/', $clientRequestId) ||
            $customerName === null ||
            $notes === null ||
            !in_array($orderType, ['dine_in', 'takeout'], true) ||
            ($kitchenStaffId !== null && $kitchenStaffId === false) ||
            !is_array($items) ||
            count($items) < 1 ||
            count($items) > 50
        ) {
            operationsResponse(['error' => 'Review the customer, order type, notes, and selected products.'], 422);
        }

        $existingRequest = $pdo->prepare(
            'SELECT order_number FROM orders WHERE client_request_id = :client_request_id LIMIT 1'
        );
        $existingRequest->execute([':client_request_id' => $clientRequestId]);
        $existingOrderNumber = $existingRequest->fetchColumn();
        if ($existingOrderNumber) {
            operationsResponse([
                'message' => 'This order was already recorded.',
                'order_number' => (string) $existingOrderNumber
            ]);
        }
        if ($kitchenStaffId !== null) {
            $kitchenQuery = $pdo->prepare(
                "SELECT id FROM users
                 WHERE id = :id AND role = 'kitchen' AND is_active = 1
                 LIMIT 1"
            );
            $kitchenQuery->execute([':id' => $kitchenStaffId]);
            if (!$kitchenQuery->fetchColumn()) {
                operationsResponse(['error' => 'Choose an active Kitchen Staff account.'], 422);
            }
        }

        $quantities = [];
        foreach ($items as $item) {
            if (!is_array($item)) {
                operationsResponse(['error' => 'The selected product list is invalid.'], 422);
            }
            $productId = filter_var($item['product_id'] ?? null, FILTER_VALIDATE_INT, [
                'options' => ['min_range' => 1]
            ]);
            $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT, [
                'options' => ['min_range' => 1, 'max_range' => 99]
            ]);
            if ($productId === false || $quantity === false) {
                operationsResponse(['error' => 'Product quantities must be between 1 and 99.'], 422);
            }
            $quantities[$productId] = ($quantities[$productId] ?? 0) + $quantity;
            if ($quantities[$productId] > 99) {
                operationsResponse(['error' => 'A product quantity cannot exceed 99.'], 422);
            }
        }

        $pdo->beginTransaction();
        $lockedOperationQuery = $pdo->prepare(
            'SELECT status FROM daily_operations WHERE id = :id FOR UPDATE'
        );
        $lockedOperationQuery->execute([':id' => (int) $operation['id']]);
        if ($lockedOperationQuery->fetchColumn() !== 'open') {
            $pdo->rollBack();
            operationsResponse(['error' => 'The daily operation has closed. New orders are not allowed.'], 409);
        }
        $productQuery = $pdo->prepare(
            'SELECT id, product_name, price
             FROM products
             WHERE id = :id AND is_available = 1
             LIMIT 1'
        );
        $orderItems = [];
        $totalCents = 0;
        foreach ($quantities as $productId => $quantity) {
            $productQuery->execute([':id' => $productId]);
            $product = $productQuery->fetch();
            if (!$product) {
                $pdo->rollBack();
                operationsResponse(['error' => 'A selected product is no longer available. Refresh and try again.'], 409);
            }
            $priceCents = (int) round((float) $product['price'] * 100);
            $lineCents = $priceCents * $quantity;
            $totalCents += $lineCents;
            $orderItems[] = [
                'product_id' => (int) $product['id'],
                'product_name' => (string) $product['product_name'],
                'quantity' => $quantity,
                'unit_price' => number_format($priceCents / 100, 2, '.', ''),
                'line_total' => number_format($lineCents / 100, 2, '.', '')
            ];
        }
        if ($totalCents <= 0 || $totalCents > 9999999999) {
            $pdo->rollBack();
            operationsResponse(['error' => 'The order total must be within the supported database range.'], 422);
        }

        $orderNumber = 'YDUR-' . str_replace('-', '', $date) . '-' . strtoupper(bin2hex(random_bytes(8)));
        $total = number_format($totalCents / 100, 2, '.', '');
        $insertOrder = $pdo->prepare(
            'INSERT INTO orders
                (order_number, customer_name, order_type, status, payment_status,
                 subtotal, discount, tax, total, notes, created_by, daily_operation_id,
                 assigned_kitchen_id, client_request_id)
             VALUES
                (:order_number, :customer_name, :order_type, \'pending\', \'unpaid\',
                 :subtotal, 0, 0, :total, :notes, :created_by, :daily_operation_id,
                 :assigned_kitchen_id, :client_request_id)'
        );
        $insertOrder->execute([
            ':order_number' => $orderNumber,
            ':customer_name' => $customerName === '' ? null : $customerName,
            ':order_type' => $orderType,
            ':subtotal' => $total,
            ':total' => $total,
            ':notes' => $notes === '' ? null : $notes,
            ':created_by' => $userId,
            ':daily_operation_id' => (int) $operation['id'],
            ':assigned_kitchen_id' => $kitchenStaffId,
            ':client_request_id' => $clientRequestId
        ]);
        $orderId = (int) $pdo->lastInsertId();
        $insertItem = $pdo->prepare(
            'INSERT INTO order_items
                (order_id, product_id, product_name, quantity, unit_price, line_total)
             VALUES
                (:order_id, :product_id, :product_name, :quantity, :unit_price, :line_total)'
        );
        foreach ($orderItems as $item) {
            $insertItem->execute([
                ':order_id' => $orderId,
                ':product_id' => $item['product_id'],
                ':product_name' => $item['product_name'],
                ':quantity' => $item['quantity'],
                ':unit_price' => $item['unit_price'],
                ':line_total' => $item['line_total']
            ]);
        }
        $pdo->commit();
        operationsResponse([
            'message' => 'Order recorded successfully.',
            'order_number' => $orderNumber
        ], 201);
    }

    if ($action === 'update_order_status') {
        $orderId = filter_var($payload['order_id'] ?? null, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1]
        ]);
        $status = is_string($payload['status'] ?? null) ? $payload['status'] : '';
        if ($orderId === false || !in_array($status, ['preparing', 'ready', 'completed', 'cancelled'], true)) {
            operationsResponse(['error' => 'Choose a valid order and status.'], 422);
        }

        $pdo->beginTransaction();
        if (!$operation) {
            $pdo->rollBack();
            operationsResponse(['error' => 'Open a daily operation before changing order statuses.'], 409);
        }
        $lockedOperationQuery = $pdo->prepare(
            'SELECT status FROM daily_operations WHERE id = :id FOR UPDATE'
        );
        $lockedOperationQuery->execute([':id' => (int) $operation['id']]);
        if ($lockedOperationQuery->fetchColumn() !== 'open') {
            $pdo->rollBack();
            operationsResponse(['error' => 'Closed operations and their orders are read-only.'], 409);
        }
        $orderQuery = $pdo->prepare(
            'SELECT id, status, payment_status
             FROM orders
             WHERE id = :id
               AND (daily_operation_id = :operation_id
                    OR (daily_operation_id IS NULL AND DATE(created_at) = :operation_date))
               ' . ($role === 'kitchen' ? 'AND (assigned_kitchen_id = :kitchen_user_id OR assigned_kitchen_id IS NULL)' : '') . '
             FOR UPDATE'
        );
        $statusParameters = [
            ':id' => $orderId,
            ':operation_id' => $operation ? (int) $operation['id'] : null,
            ':operation_date' => $date
        ];
        if ($role === 'kitchen') {
            $statusParameters[':kitchen_user_id'] = $userId;
        }
        $orderQuery->execute($statusParameters);
        $order = $orderQuery->fetch();
        if (!$order) {
            $pdo->rollBack();
            operationsResponse(['error' => 'That order does not belong to this operation date.'], 404);
        }

        $allowedTransitions = [
            'pending' => ['preparing'],
            'preparing' => ['ready'],
            'ready' => ['completed']
        ];
        if ($role === 'kitchen') {
            if (!in_array($status, $allowedTransitions[$order['status']] ?? [], true)) {
                $pdo->rollBack();
                operationsResponse(['error' => 'Kitchen Staff can only advance an order to its next preparation status.'], 409);
            }
        } elseif (
            $status === 'cancelled' &&
            in_array($order['payment_status'], ['partially_paid', 'paid'], true)
        ) {
            $pdo->rollBack();
            operationsResponse(['error' => 'Orders with recorded payments cannot be cancelled.'], 409);
        }
        if ($status === 'cancelled') {
            $recordedPaymentQuery = $pdo->prepare(
                'SELECT COUNT(*) FROM payments WHERE order_id = :order_id'
            );
            $recordedPaymentQuery->execute([':order_id' => $orderId]);
            if ((int) $recordedPaymentQuery->fetchColumn() > 0) {
                $pdo->rollBack();
                operationsResponse(['error' => 'Orders with recorded payments cannot be cancelled.'], 409);
            }
        }

        if (
            $role !== 'kitchen' &&
            $status !== 'cancelled' &&
            !in_array($status, $allowedTransitions[$order['status']] ?? [], true)
        ) {
            $pdo->rollBack();
            operationsResponse(['error' => 'This order cannot move to the requested status.'], 409);
        }

        $updateOrder = $pdo->prepare('UPDATE orders SET status = :status WHERE id = :id');
        $updateOrder->execute([':status' => $status, ':id' => $orderId]);
        $pdo->commit();
        operationsResponse(['message' => 'Order status updated.']);
    }

    if ($action === 'record_payment') {
        $clientRequestId = operationsCleanText($payload['client_request_id'] ?? '', 64);
        if (
            $clientRequestId === null ||
            !preg_match('/^[A-Za-z0-9-]{16,64}$/', $clientRequestId)
        ) {
            operationsResponse(['error' => 'The payment request could not be verified. Refresh and try again.'], 422);
        }
        $existingPaymentQuery = $pdo->prepare(
            'SELECT id FROM payments WHERE client_request_id = :client_request_id LIMIT 1'
        );
        $existingPaymentQuery->execute([':client_request_id' => $clientRequestId]);
        if ($existingPaymentQuery->fetchColumn()) {
            operationsResponse(['message' => 'This payment was already recorded.']);
        }
        if (!$operation || $operation['status'] !== 'open') {
            operationsResponse(['error' => 'Open a daily operation before recording a sale.'], 409);
        }
        if ($date !== date('Y-m-d')) {
            operationsResponse(['error' => 'New payments can only be recorded for the current Philippine business date.'], 409);
        }
        $orderId = filter_var($payload['order_id'] ?? null, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1]
        ]);
        $method = is_string($payload['payment_method'] ?? null) ? $payload['payment_method'] : '';
        $amount = $payload['amount'] ?? null;
        $reference = operationsCleanText($payload['reference_number'] ?? '', 100);
        $methods = ['cash', 'gcash', 'card', 'bank_transfer', 'other'];
        if (
            $orderId === false ||
            !in_array($method, $methods, true) ||
            $reference === null ||
            !(is_int($amount) || is_float($amount) || (is_string($amount) && is_numeric($amount))) ||
            (float) $amount <= 0
        ) {
            operationsResponse(['error' => 'Enter a valid order, payment method, and amount.'], 422);
        }

        $amountCents = (int) round((float) $amount * 100);
        if ($amountCents <= 0) {
            operationsResponse(['error' => 'Payment amount must be greater than zero.'], 422);
        }

        $pdo->beginTransaction();
        $lockedOperationQuery = $pdo->prepare(
            'SELECT status FROM daily_operations WHERE id = :id FOR UPDATE'
        );
        $lockedOperationQuery->execute([':id' => (int) $operation['id']]);
        if ($lockedOperationQuery->fetchColumn() !== 'open') {
            $pdo->rollBack();
            operationsResponse(['error' => 'The daily operation has closed. New payments are not allowed.'], 409);
        }
        $orderQuery = $pdo->prepare(
            'SELECT id, total, payment_status
             FROM orders
             WHERE id = :id
               AND (daily_operation_id = :operation_id
                    OR (daily_operation_id IS NULL AND DATE(created_at) = :operation_date))
               AND payment_status IN (\'unpaid\', \'partially_paid\')
               AND status <> \'cancelled\'
             FOR UPDATE'
        );
        $orderQuery->execute([
            ':id' => $orderId,
            ':operation_id' => (int) $operation['id'],
            ':operation_date' => $date
        ]);
        $order = $orderQuery->fetch();
        if (!$order) {
            $pdo->rollBack();
            operationsResponse(['error' => 'Select an unpaid order from this operation date.'], 404);
        }

        $paidQuery = $pdo->prepare('SELECT COALESCE(SUM(amount), 0) FROM payments WHERE order_id = :order_id');
        $paidQuery->execute([':order_id' => $orderId]);
        $paidCents = (int) round((float) $paidQuery->fetchColumn() * 100);
        $totalCents = (int) round((float) $order['total'] * 100);
        $dueCents = $totalCents - $paidCents;
        if ($dueCents <= 0 || $amountCents > $dueCents) {
            $pdo->rollBack();
            operationsResponse(['error' => 'Payment exceeds the remaining order balance or the order is already paid.'], 409);
        }

        $insertPayment = $pdo->prepare(
            'INSERT INTO payments
                (order_id, amount, payment_method, reference_number, received_by,
                 daily_operation_id, client_request_id)
             VALUES
                (:order_id, :amount, :payment_method, :reference_number, :received_by,
                 :daily_operation_id, :client_request_id)'
        );
        $insertPayment->execute([
            ':order_id' => $orderId,
            ':amount' => number_format($amountCents / 100, 2, '.', ''),
            ':payment_method' => $method,
            ':reference_number' => $reference === '' ? null : $reference,
            ':received_by' => $userId,
            ':daily_operation_id' => (int) $operation['id'],
            ':client_request_id' => $clientRequestId
        ]);
        $newPaidCents = $paidCents + $amountCents;
        $paymentStatus = $newPaidCents >= $totalCents ? 'paid' : 'partially_paid';
        $updateOrder = $pdo->prepare('UPDATE orders SET payment_status = :payment_status WHERE id = :id');
        $updateOrder->execute([':payment_status' => $paymentStatus, ':id' => $orderId]);
        $pdo->commit();
        operationsResponse(['message' => 'Sale recorded successfully.'], 201);
    }

    operationsResponse(['error' => 'The requested operation is not supported.'], 400);
} catch (PDOException $exception) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if ($exception->getCode() === '23000') {
        operationsResponse(['error' => 'A conflicting operation or transaction already exists. Refresh and try again.'], 409);
    }
    error_log($exception->getMessage());
    operationsResponse(['error' => 'Unable to save the operation. Please try again.'], 500);
}
