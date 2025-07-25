<?php
session_start();
header('Content-Type: application/json');

// Admin login check
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'chatabc_restaurant';

$conn = mysqli_connect($host, $username, $password, $database);
if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$type = $_GET['type'] ?? 'orders';

switch ($type) {
    case 'orders':
        $sql = "SELECT * FROM orders ORDER BY created_at DESC";
        break;
    case 'reservations':
        $sql = "SELECT * FROM reservations ORDER BY reservation_date DESC, reservation_time DESC";
        break;
    case 'gift_cards':
        $sql = "SELECT * FROM gift_cards ORDER BY created_at DESC";
        break;
    default:
        $sql = "SELECT * FROM orders ORDER BY created_at DESC";
}

$result = mysqli_query($conn, $sql);
if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed']);
    exit();
}

$data = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo json_encode($data);

mysqli_free_result($result);
mysqli_close($conn);