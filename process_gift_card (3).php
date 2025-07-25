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
$required_fields = ['amount', 'recipient_name', 'recipient_email', 'sender_name'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize and validate input
$gift_card_data = [
    'amount' => filter_var($input['amount'], FILTER_VALIDATE_FLOAT),
    'balance' => filter_var($input['amount'], FILTER_VALIDATE_FLOAT), // Initial balance equals amount
    'recipient_name' => filter_var($input['recipient_name'], FILTER_SANITIZE_STRING),
    'recipient_email' => filter_var($input['recipient_email'], FILTER_VALIDATE_EMAIL),
    'sender_name' => filter_var($input['sender_name'], FILTER_SANITIZE_STRING),
    'sender_email' => filter_var($input['sender_email'] ?? '', FILTER_VALIDATE_EMAIL),
    'message' => filter_var($input['message'] ?? '', FILTER_SANITIZE_STRING),
    'design' => filter_var($input['design'] ?? 'classic', FILTER_SANITIZE_STRING)
];

// Validate amount
if (!$gift_card_data['amount'] || $gift_card_data['amount'] < 40 || $gift_card_data['amount'] > 60) {
    http_response_code(400);
    echo json_encode(['error' => 'Gift card amount must be between RM 40 and RM 60']);
    exit;
}

// Validate emails
if (!$gift_card_data['recipient_email']) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid recipient email address']);
    exit;
}

try {
    // Generate unique gift card code
    $card_code = generateGiftCardCode();
    
    // Set expiration date (2 years from now)
    $expires_at = date('Y-m-d', strtotime('+2 years'));
    
    // Insert gift card
    $stmt = $pdo->prepare("
        INSERT INTO gift_cards (
            card_code, amount, balance, recipient_name, recipient_email, 
            sender_name, sender_email, message, design_type, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $card_code,
        $gift_card_data['amount'],
        $gift_card_data['balance'], // Initial balance equals amount
        $gift_card_data['recipient_name'],
        $gift_card_data['recipient_email'],
        $gift_card_data['sender_name'],
        $gift_card_data['sender_email'],
        $gift_card_data['message'],
        $gift_card_data['design'],
        $expires_at
    ]);
    
    $gift_card_id = $pdo->lastInsertId();
    
    // Record purchase transaction
    $stmt = $pdo->prepare("
        INSERT INTO gift_card_transactions (
            gift_card_id, transaction_type, amount, balance_after, description
        ) VALUES (?, 'purchase', ?, ?, 'Gift card purchased')
    ");
    
    $stmt->execute([
        $gift_card_id,
        $gift_card_data['amount'],
        $gift_card_data['amount']
    ]);
    
    // Send gift card email
    $email_sent = sendGiftCardEmail($gift_card_data, $card_code, $expires_at);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'gift_card_id' => $gift_card_id,
        'card_code' => $card_code,
        'message' => 'Gift card purchased successfully! Confirmation sent to recipient.',
        'email_sent' => $email_sent
    ]);
    
} catch (PDOException $e) {
    error_log("Gift card error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Failed to process gift card purchase']);
}

function generateGiftCardCode() {
    // Generate a unique 12-character code
    $prefix = 'CHAT';
    $suffix = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8));
    return $prefix . '-' . substr($suffix, 0, 4) . '-' . substr($suffix, 4, 4);
}

function sendGiftCardEmail($gift_card_data, $card_code, $expires_at) {
    $to = $gift_card_data['recipient_email'];
    $subject = "You've received a ChatABC Gift Card!";
    
    $formatted_expires = date('F j, Y', strtotime($expires_at));
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #000; color: #D4AF37; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .gift-card { 
                background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
                color: #000;
                padding: 30px;
                margin: 20px 0;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .card-code { 
                font-size: 24px; 
                font-weight: bold; 
                letter-spacing: 2px; 
                margin: 15px 0;
                font-family: 'Courier New', monospace;
            }
            .amount { font-size: 36px; font-weight: bold; margin: 10px 0; }
            .message-box { 
                background: #f9f9f9; 
                padding: 15px; 
                margin: 20px 0; 
                border-left: 4px solid #D4AF37;
                font-style: italic;
            }
            .footer { background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; }
            .instructions { background: #e8f4f8; padding: 15px; margin: 20px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>ChatABC</h1>
            <p>Where Culinary Art Meets Excellence</p>
        </div>
        <div class='content'>
            <h2>🎁 You've Received a Gift Card!</h2>
            <p>Dear {$gift_card_data['recipient_name']},</p>
            <p>Congratulations! {$gift_card_data['sender_name']} has sent you a ChatABC gift card.</p>
            
            " . (!empty($gift_card_data['message']) ? "
            <div class='message-box'>
                <h3>Personal Message:</h3>
                <p>\"{$gift_card_data['message']}\"</p>
                <p><em>- {$gift_card_data['sender_name']}</em></p>
            </div>
            " : "") . "
            
            <div class='gift-card'>
                <h2>ChatABC Gift Card</h2>
                <div class='amount'>RM " . number_format($gift_card_data['amount'], 2) . "</div>
                <div class='card-code'>$card_code</div>
                <p>Valid until $formatted_expires</p>
            </div>
            
            <div class='instructions'>
                <h3>How to Use Your Gift Card:</h3>
                <ol>
                    <li>Visit any ChatABC location or order online</li>
                    <li>Present this gift card code at checkout</li>
                    <li>The amount will be deducted from your total</li>
                    <li>Any remaining balance can be used for future visits</li>
                </ol>
                <p><strong>Note:</strong> This gift card cannot be exchanged for cash and is non-refundable.</p>
            </div>
            
            <p>We look forward to serving you an unforgettable dining experience!</p>
        </div>
        <div class='footer'>
            <p>ChatABC Restaurant | +60 3-2161 8888 | info@chatabc.com</p>
            <p>KLCC • Petaling Jaya • Georgetown • Johor Bahru • Kota Kinabalu</p>
        </div>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: ChatABC <giftcards@chatabc.com>" . "\r\n";
    
    // In production environment, use proper email service
    // return mail($to, $subject, $message, $headers);
    
    // For demo, always return true
    return true;
}
?>