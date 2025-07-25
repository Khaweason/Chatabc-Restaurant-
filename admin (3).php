<?php
session_start();

// Simple authentication (in production, use proper authentication)
if (!isset($_SESSION['admin_logged_in'])) {
    if (isset($_POST['login'])) {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        
        // Simple credentials (in production, use hashed passwords and database)
        if ($username === 'admin' && $password === 'chatABC2024') {
            $_SESSION['admin_logged_in'] = true;
            header('Location: admin.php');
            exit;
        } else {
            $login_error = 'Invalid credentials';
        }
    }
    
    // Show login form
    include 'admin_login.php';
    exit;
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Database connection (you'll need to configure this)
$host = 'localhost';
$dbname = 'chatabc_restaurant';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Handle AJAX requests
if (isset($_POST['action'])) {
    header('Content-Type: application/json');
    
    switch ($_POST['action']) {
        case 'get_reservations':
            $stmt = $pdo->query("SELECT * FROM reservations ORDER BY reservation_date DESC, reservation_time DESC");
            $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($reservations);
            break;
            
        case 'update_reservation_status':
            $id = $_POST['id'];
            $status = $_POST['status'];
            $stmt = $pdo->prepare("UPDATE reservations SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            echo json_encode(['success' => true]);
            break;
            
        case 'get_orders':
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
            $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($orders);
            break;
            
        case 'update_order_status':
            $id = $_POST['id'];
            $status = $_POST['status'];
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$status, $id]);
            echo json_encode(['success' => true]);
            break;
            
        case 'get_gift_cards':
            $stmt = $pdo->query("SELECT * FROM gift_cards ORDER BY created_at DESC");
            $gift_cards = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($gift_cards);
            break;
            
        case 'get_analytics':
            // Get today's stats
            $today = date('Y-m-d');
            
            // Total reservations today
            $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM reservations WHERE DATE(reservation_date) = ?");
            $stmt->execute([$today]);
            $reservations_today = $stmt->fetch()['count'];
            
            // Total orders today
            $stmt = $pdo->prepare("SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders WHERE DATE(created_at) = ?");
            $stmt->execute([$today]);
            $orders_data = $stmt->fetch();
            
            // Gift cards sold today
            $stmt = $pdo->prepare("SELECT COUNT(*) as count, SUM(amount) as total FROM gift_cards WHERE DATE(created_at) = ?");
            $stmt->execute([$today]);
            $gift_cards_data = $stmt->fetch();
            
            echo json_encode([
                'reservations_today' => $reservations_today,
                'orders_today' => $orders_data['count'] ?? 0,
                'revenue_today' => $orders_data['revenue'] ?? 0,
                'gift_cards_today' => $gift_cards_data['count'] ?? 0,
                'gift_cards_revenue' => $gift_cards_data['total'] ?? 0
            ]);
            break;
    }
    exit;
}

// Optionally, fetch and display order items for each order
// ...existing code...
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatABC Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1>ChatABC</h1>
                <p>Admin Dashboard</p>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#dashboard" class="nav-link active" data-section="dashboard">📊 Dashboard</a></li>
                    <li><a href="#reservations" class="nav-link" data-section="reservations">📅 Reservations</a></li>
                    <li><a href="#orders" class="nav-link" data-section="orders">🛒 Orders</a></li>
                    <li><a href="#gift-cards" class="nav-link" data-section="gift-cards">🎁 Gift Cards</a></li>
                    <li><a href="#menu" class="nav-link" data-section="menu">🍽️ Menu</a></li>
                    <li><a href="#analytics" class="nav-link" data-section="analytics">📈 Analytics</a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <a href="?logout=1" class="logout-btn">🚪 Logout</a>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="main-header">
                <h2 id="page-title">Dashboard</h2>
                <div class="header-actions">
                    <span class="current-time" id="current-time"></span>
                    <span class="admin-user">Welcome, Admin</span>
                </div>
            </header>

            <!-- Dashboard Section -->
            <section id="dashboard-section" class="content-section active">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📅</div>
                        <div class="stat-info">
                            <h3 id="reservations-today">0</h3>
                            <p>Reservations Today</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🛒</div>
                        <div class="stat-info">
                            <h3 id="orders-today">0</h3>
                            <p>Orders Today</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-info">
                            <h3 id="revenue-today">RM 0</h3>
                            <p>Revenue Today</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎁</div>
                        <div class="stat-info">
                            <h3 id="gift-cards-today">0</h3>
                            <p>Gift Cards Sold</p>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Recent Reservations</h3>
                        <div id="recent-reservations" class="recent-list">
                            <!-- Recent reservations will be loaded here -->
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Recent Orders</h3>
                        <div id="recent-orders" class="recent-list">
                            <!-- Recent orders will be loaded here -->
                        </div>
                    </div>
                </div>
            </section>

            <!-- Reservations Section -->
            <section id="reservations-section" class="content-section">
                <div class="section-header">
                    <h3>Reservations Management</h3>
                    <div class="filters">
                        <select id="reservation-filter">
                            <option value="all">All Reservations</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Date & Time</th>
                                <th>Guests</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="reservations-table">
                            <!-- Reservations will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Orders Section -->
            <section id="orders-section" class="content-section">
                <div class="section-header">
                    <h3>Orders Management</h3>
                    <div class="filters">
                        <select id="order-filter">
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="orders-table">
                            <!-- Orders will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Gift Cards Section -->
            <section id="gift-cards-section" class="content-section">
                <div class="section-header">
                    <h3>Gift Cards Management</h3>
                    <div class="filters">
                        <select id="gift-card-filter">
                            <option value="all">All Gift Cards</option>
                            <option value="active">Active</option>
                            <option value="used">Used</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Card Code</th>
                                <th>Amount</th>
                                <th>Balance</th>
                                <th>Recipient</th>
                                <th>Sender</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="gift-cards-table">
                            <!-- Gift cards will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Menu Section -->
            <section id="menu-section" class="content-section">
                <div class="section-header">
                    <h3>Menu Management</h3>
                    <button class="btn btn-primary" onclick="openAddItemModal()">Add New Item</button>
                </div>
                <div class="menu-grid" id="admin-menu-grid">
                    <!-- Menu items will be loaded here -->
                </div>
            </section>

            <!-- Analytics Section -->
            <section id="analytics-section" class="content-section">
                <div class="section-header">
                    <h3>Analytics & Reports</h3>
                    <div class="date-range">
                        <input type="date" id="start-date">
                        <input type="date" id="end-date">
                        <button class="btn btn-secondary" onclick="generateReport()">Generate Report</button>
                    </div>
                </div>
                <div class="analytics-grid">
                    <div class="chart-container">
                        <h4>Revenue Trend</h4>
                        <canvas id="revenue-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h4>Popular Items</h4>
                        <canvas id="items-chart"></canvas>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Modals -->
    <div id="status-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Update Status</h3>
                <span class="close" onclick="closeModal('status-modal')">&times;</span>
            </div>
            <div class="modal-body">
                <form id="status-form">
                    <input type="hidden" id="status-item-id">
                    <input type="hidden" id="status-item-type">
                    <div class="form-group">
                        <label for="new-status">New Status:</label>
                        <select id="new-status" required>
                            <!-- Options will be populated based on item type -->
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal('status-modal')">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Status</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="admin.js"></script>
</body>
</html>

