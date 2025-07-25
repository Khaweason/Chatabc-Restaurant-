<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$host = 'localhost';
$dbname = 'chatabc_restaurant';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'phone', 'items', 'total'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Validate items (should be an array)
if (!is_array($input['items']) || count($input['items']) === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Order must include at least one item']);
    exit;
}

// Sanitize and validate input
$order_data = [
    'name' => filter_var($input['name'], FILTER_SANITIZE_STRING),
    'email' => filter_var($input['email'], FILTER_VALIDATE_EMAIL),
    'phone' => filter_var($input['phone'], FILTER_SANITIZE_STRING),
    'notes' => filter_var($input['notes'] ?? '', FILTER_SANITIZE_STRING),
    'total' => filter_var($input['total'], FILTER_VALIDATE_FLOAT),
    'items' => $input['items']
];

if (!$order_data['email']) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

if ($order_data['total'] <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid order total']);
    exit;
}

try {
    // Insert order
    $stmt = $pdo->prepare("
        INSERT INTO orders (customer_name, email, phone, notes, total, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    ");
    $stmt->execute([
        $order_data['id'],
        $order_data['customer_name'],
        $order_data['email'],
        $order_data['phone'],
        $order_data['notes'],
        $order_data['total'],
        $order_data['status'],
         $order_data['created_at']
    ]);
    $order_id = $pdo->lastInsertId();

    // Insert order items
    $item_stmt = $pdo->prepare("
        INSERT INTO order_items (order_id, item_id, item_name, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    ");
    foreach ($order_data['items'] as $item) {
        // Expecting each item: ['id' => ..., 'name' => ..., 'quantity' => ..., 'price' => ...]
        $item_id = filter_var($item['id'], FILTER_VALIDATE_INT);
        $item_name = filter_var($item['name'], FILTER_SANITIZE_STRING);
        $quantity = filter_var($item['quantity'], FILTER_VALIDATE_INT);
        $price = filter_var($item['price'], FILTER_VALIDATE_FLOAT);

        if (!$item_id || !$item_name || $quantity < 1 || $price < 0) {
            continue; // skip invalid items
        }

        $item_stmt->execute([$order_id, $item_id, $item_name, $quantity, $price]);
    }

    // Simulate sending confirmation email
    $email_sent = true; // In production, use mail() or an email service

    echo json_encode([
        'success' => true,
        'order_id' => $order_id,
        'message' => 'Order placed successfully!',
        'email_sent' => $email_sent
    ]);
} catch (PDOException $e) {
    error_log("Order error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to process order']);
}
?>
