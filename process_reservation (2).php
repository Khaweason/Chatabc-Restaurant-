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
$required_fields = ['date', 'time', 'guests', 'location', 'name', 'email', 'phone'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize and validate input
$reservation_data = [
    'date' => filter_var($input['date'], FILTER_SANITIZE_STRING),
    'time' => filter_var($input['time'], FILTER_SANITIZE_STRING),
    'guests' => filter_var($input['guests'], FILTER_VALIDATE_INT),
    'location' => filter_var($input['location'], FILTER_SANITIZE_STRING),
    'name' => filter_var($input['name'], FILTER_SANITIZE_STRING),
    'email' => filter_var($input['email'], FILTER_VALIDATE_EMAIL),
    'phone' => filter_var($input['phone'], FILTER_SANITIZE_STRING),
    'occasion' => filter_var($input['occasion'] ?? '', FILTER_SANITIZE_STRING),
    'notes' => filter_var($input['notes'] ?? '', FILTER_SANITIZE_STRING)
];

// Validate email
if (!$reservation_data['email']) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// Validate guests count
if ($reservation_data['guests'] < 1 || $reservation_data['guests'] > 20) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid number of guests']);
    exit;
}

// Validate date (must be today or future)
$reservation_date = new DateTime($reservation_data['date']);
$today = new DateTime();
$today->setTime(0, 0, 0);

if ($reservation_date < $today) {
    http_response_code(400);
    echo json_encode(['error' => 'Reservation date must be today or in the future']);
    exit;
}

// Map location codes to IDs
$location_map = [
    'klcc' => 1,
    'pj' => 2,
    'georgetown' => 3,
    'jb' => 4,
    'kk' => 5
];

$location_id = $location_map[$reservation_data['location']] ?? null;
if (!$location_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid location']);
    exit;
}

try {
    // Check if location exists and is active
    $stmt = $pdo->prepare("SELECT id, name, capacity FROM locations WHERE id = ? AND is_active = TRUE");
    $stmt->execute([$location_id]);
    $location = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$location) {
        http_response_code(400);
        echo json_encode(['error' => 'Location not available']);
        exit;
    }
    
    // Check availability for the requested time slot
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as reservation_count 
        FROM reservations 
        WHERE location_id = ? 
        AND reservation_date = ? 
        AND reservation_time = ? 
        AND status IN ('pending', 'confirmed')
    ");
    $stmt->execute([$location_id, $reservation_data['date'], $reservation_data['time']]);
    $existing_reservations = $stmt->fetch()['reservation_count'];
    
    // Simple availability check (in production, implement proper table management)
    $max_concurrent_reservations = floor($location['capacity'] / 4); // Assume average 4 guests per reservation
    
    if ($existing_reservations >= $max_concurrent_reservations) {
        http_response_code(409);
        echo json_encode(['error' => 'No availability for the selected time slot']);
        exit;
    }
    
    // Generate confirmation code
    $confirmation_code = 'CHAT' . strtoupper(substr(uniqid(), -6));
    
    // Insert reservation
    $stmt = $pdo->prepare("
        INSERT INTO reservations (
            customer_name, email, phone, location_id, reservation_date, 
            reservation_time, guests, special_occasion, special_requests, 
            status, confirmation_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    ");
    
    $stmt->execute([
        $reservation_data['name'],
        $reservation_data['email'],
        $reservation_data['phone'],
        $location_id,
        $reservation_data['date'],
        $reservation_data['time'],
        $reservation_data['guests'],
        $reservation_data['occasion'],
        $reservation_data['notes'],
        $confirmation_code
    ]);
    
    $reservation_id = $pdo->lastInsertId();
    
    // Send confirmation email (simulate)
    $email_sent = sendConfirmationEmail($reservation_data, $confirmation_code, $location['name']);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'reservation_id' => $reservation_id,
        'confirmation_code' => $confirmation_code,
        'message' => 'Reservation confirmed! Check your email for details.',
        'email_sent' => $email_sent
    ]);
    
} catch (PDOException $e) {
    error_log("Reservation error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to process reservation']);
}

function sendConfirmationEmail($reservation_data, $confirmation_code, $location_name) {
    // In production, integrate with email service (SendGrid, Mailgun, etc.)
    // For demo purposes, we'll simulate email sending
    
    $to = $reservation_data['email'];
    $subject = "ChatABC Reservation Confirmation - $confirmation_code";
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #000; color: #D4AF37; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .details { background: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #D4AF37; }
            .footer { background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>ChatABC</h1>
            <p>Where Culinary Art Meets Excellence</p>
        </div>
        <div class='content'>
            <h2>Reservation Confirmation</h2>
            <p>Dear {$reservation_data['name']},</p>
            <p>Thank you for choosing ChatABC. Your reservation has been confirmed!</p>
            
            <div class='details'>
                <h3>Reservation Details:</h3>
                <p><strong>Confirmation Code:</strong> $confirmation_code</p>
                <p><strong>Date:</strong> {$reservation_data['date']}</p>
                <p><strong>Time:</strong> {$reservation_data['time']}</p>
                <p><strong>Guests:</strong> {$reservation_data['guests']}</p>
                <p><strong>Location:</strong> $location_name</p>
                " . (!empty($reservation_data['occasion']) ? "<p><strong>Occasion:</strong> {$reservation_data['occasion']}</p>" : "") . "
            </div>
            
            <p>We look forward to providing you with an exceptional dining experience.</p>
            <p>If you need to modify or cancel your reservation, please contact us at least 24 hours in advance.</p>
        </div>
        <div class='footer'>
            <p>ChatABC Restaurant | +60 3-2161 8888 | info@chatabc.com</p>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: ChatABC <noreply@chatabc.com>" . "\r\n";
    
    // In production environment, use proper email service
    // return mail($to, $subject, $message, $headers);
    
    // For demo, always return true
    return true;
}

function handleReservationSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const reservationData = Object.fromEntries(formData);

    if (!validateReservationForm(reservationData)) {
        return;
    }

    showLoadingState(e.target);

    fetch('process_reservation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
    })
    .then(res => res.json())
    .then(data => {
        hideLoadingState(e.target);
        if (data.success) {
            showSuccessMessage('Reservation confirmed! Check your email for details.');
            e.target.reset();
        } else {
            alert(data.error || 'Reservation failed.');
        }
    })
    .catch(() => {
        hideLoadingState(e.target);
        alert('Reservation failed. Please try again.');
    });
}
?>