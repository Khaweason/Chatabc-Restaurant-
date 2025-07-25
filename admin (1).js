// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    // Initialize navigation
    initializeNavigation();
    
    // Update current time
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Load initial data
    loadDashboardData();
    
    // Initialize forms
    initializeStatusForm();
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get section name
            const section = link.getAttribute('data-section');
            
            // Show corresponding section
            showSection(section);
            
            // Update page title
            updatePageTitle(section);
            
            // Load section data
            loadSectionData(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function updatePageTitle(section) {
    const titles = {
        'dashboard': 'Dashboard',
        'reservations': 'Reservations',
        'orders': 'Orders',
        'gift-cards': 'Gift Cards',
        'menu': 'Menu Management',
        'analytics': 'Analytics'
    };
    
    const pageTitle = document.getElementById('page-title');
    pageTitle.textContent = titles[section] || 'Dashboard';
}

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-MY', {
        timeZone: 'Asia/Kuala_Lumpur',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Data Loading
function loadDashboardData() {
    loadAnalytics();
    loadRecentReservations();
    loadRecentOrders();
}

function loadSectionData(section) {
    switch (section) {
        case 'reservations':
            loadReservations();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'gift-cards':
            loadGiftCards();
            break;
        case 'menu':
            loadMenuItems();
            break;
        case 'analytics':
            loadAnalyticsCharts();
            break;
    }
}

function loadAnalytics() {
    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_analytics'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('reservations-today').textContent = data.reservations_today || 0;
        document.getElementById('orders-today').textContent = data.orders_today || 0;
        document.getElementById('revenue-today').textContent = `RM ${(data.revenue_today || 0).toFixed(2)}`;
        document.getElementById('gift-cards-today').textContent = data.gift_cards_today || 0;
    })
    .catch(error => console.error('Error loading analytics:', error));
}

function loadRecentReservations() {
    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_reservations'
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('recent-reservations');
        container.innerHTML = '';
        
        // Show only the 5 most recent
        const recent = data.slice(0, 5);
        
        if (recent.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center;">No recent reservations</p>';
            return;
        }
        
        recent.forEach(reservation => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.innerHTML = `
                <div class="recent-item-info">
                    <h4>${reservation.customer_name}</h4>
                    <p>${reservation.reservation_date} at ${reservation.reservation_time}</p>
                </div>
                <span class="recent-item-status status-${reservation.status}">${reservation.status}</span>
            `;
            container.appendChild(item);
        });
    })
    .catch(error => console.error('Error loading recent reservations:', error));
}

function loadRecentOrders() {
    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_orders'
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('recent-orders');
        container.innerHTML = '';
        
        // Show only the 5 most recent
        const recent = data.slice(0, 5);
        
        if (recent.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center;">No recent orders</p>';
            return;
        }
        
        recent.forEach(order => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.innerHTML = `
                <div class="recent-item-info">
                    <h4>Order #${order.id}</h4>
                    <p>RM ${parseFloat(order.total_amount).toFixed(2)}</p>
                </div>
                <span class="recent-item-status status-${order.status}">${order.status}</span>
            `;
            container.appendChild(item);
        });
    })
    .catch(error => console.error('Error loading recent orders:', error));
}

function loadReservations() {
    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_reservations'
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('reservations-table');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No reservations found</td></tr>';
            return;
        }
        
        data.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${reservation.id}</td>
                <td>
                    <div>
                        <strong>${reservation.customer_name}</strong><br>
                        <small style="color: #999;">${reservation.email}</small>
                    </div>
                </td>
                <td>
                    ${reservation.reservation_date}<br>
                    <small style="color: #999;">${reservation.reservation_time}</small>
                </td>
                <td>${reservation.guests}</td>
                <td>${reservation.location}</td>
                <td><span class="recent-item-status status-${reservation.status}">${reservation.status}</span></td>
                <td>
                    <button class="btn btn-small btn-secondary" onclick="updateStatus(${reservation.id}, 'reservation', '${reservation.status}')">
                        Update Status
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading reservations:', error));
}

function loadOrders() {
    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_orders'
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('orders-table');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No orders found</td></tr>';
            return;
        }
        
        data.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>
                    <div>
                        <strong>${order.customer_name || 'Guest'}</strong><br>
                        <small style="color: #999;">${order.customer_email || 'N/A'}</small>
                    </div>
                </td>
                <td>
                    <small style="color: #999;">${order.items_count || 'N/A'} items</small>
                </td>
                <td>RM ${parseFloat(order.total_amount).toFixed(2)}</td>
                <td><span class="recent-item-status status-${order.status}">${order.status}</span></td>
                <td>
                    <small style="color: #999;">${new Date(order.created_at).toLocaleDateString()}</small>
                </td>
                <td>
                    <button class="btn btn-small btn-secondary" onclick="updateStatus(${order.id}, 'order', '${order.status}')">
                        Update Status
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading orders:', error));
}

function loadGiftCards() {
    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=get_gift_cards'
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById('gift-cards-table');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999;">No gift cards found</td></tr>';
            return;
        }
        
        data.forEach(card => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><code>${card.card_code}</code></td>
                <td>$${parseFloat(card.amount).toFixed(2)}</td>
                <td>$${parseFloat(card.balance).toFixed(2)}</td>
                <td>
                    <div>
                        <strong>${card.recipient_name}</strong><br>
                        <small style="color: #999;">${card.recipient_email}</small>
                    </div>
                </td>
                <td>${card.sender_name}</td>
                <td><span class="recent-item-status status-${card.status}">${card.status}</span></td>
                <td>
                    <small style="color: #999;">${new Date(card.created_at).toLocaleDateString()}</small>
                </td>
                <td>
                    <button class="btn btn-small btn-secondary" onclick="viewGiftCard(${card.id})">
                        View Details
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => console.error('Error loading gift cards:', error));
}

function loadMenuItems() {
    // Sample menu items for demo
    const menuItems = [
        {
            id: 1,
            name: "Wagyu Beef Tenderloin",
            category: "mains",
            price: 52,
            description: "Premium A5 Wagyu beef with truffle sauce",
            image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
            available: true
        },
        {
            id: 2,
            name: "Boston Lobster Thermidor",
            category: "mains",
            price: 52,
            description: "Fresh Boston lobster with garlic butter",
            image: "https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg",
            available: true
        },
        {
            id: 3,
            name: "Foie Gras Terrine",
            category: "appetizers",
            price: 48,
            description: "Pan-seared foie gras with brioche toast",
            image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
            available: false
        }
    ];
    
    const container = document.getElementById('admin-menu-grid');
    container.innerHTML = '';
    
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-card-content">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="menu-item-card-footer">
                    <span class="menu-item-price">RM ${item.price}</span>
                    <div>
                        <span class="recent-item-status ${item.available ? 'status-confirmed' : 'status-cancelled'}">
                            ${item.available ? 'Available' : 'Unavailable'}
                        </span>
                    </div>
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn btn-small btn-secondary" onclick="editMenuItem(${item.id})">Edit</button>
                    <button class="btn btn-small ${item.available ? 'btn-secondary' : 'btn-primary'}" 
                            onclick="toggleAvailability(${item.id}, ${item.available})">
                        ${item.available ? 'Disable' : 'Enable'}
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Status Management
function initializeStatusForm() {
    const form = document.getElementById('status-form');
    form.addEventListener('submit', handleStatusUpdate);
}

function updateStatus(id, type, currentStatus) {
    const modal = document.getElementById('status-modal');
    const itemIdInput = document.getElementById('status-item-id');
    const itemTypeInput = document.getElementById('status-item-type');
    const statusSelect = document.getElementById('new-status');
    
    itemIdInput.value = id;
    itemTypeInput.value = type;
    
    // Populate status options based on type
    let options = [];
    if (type === 'reservation') {
        options = [
            { value: 'pending', text: 'Pending' },
            { value: 'confirmed', text: 'Confirmed' },
            { value: 'completed', text: 'Completed' },
            { value: 'cancelled', text: 'Cancelled' }
        ];
    } else if (type === 'order') {
        options = [
            { value: 'pending', text: 'Pending' },
            { value: 'preparing', text: 'Preparing' },
            { value: 'ready', text: 'Ready' },
            { value: 'completed', text: 'Completed' },
            { value: 'cancelled', text: 'Cancelled' }
        ];
    }
    
    statusSelect.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        if (option.value === currentStatus) {
            optionElement.selected = true;
        }
        statusSelect.appendChild(optionElement);
    });
    
    modal.style.display = 'block';
}

function handleStatusUpdate(e) {
    e.preventDefault();
    
    const id = document.getElementById('status-item-id').value;
    const type = document.getElementById('status-item-type').value;
    const newStatus = document.getElementById('new-status').value;
    
    const action = type === 'reservation' ? 'update_reservation_status' : 'update_order_status';
    
    fetch('admin.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=${action}&id=${id}&status=${newStatus}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeModal('status-modal');
            showNotification('Status updated successfully!', 'success');
            
            // Reload the appropriate section
            if (type === 'reservation') {
                loadReservations();
                loadRecentReservations();
            } else {
                loadOrders();
                loadRecentOrders();
            }
            
            loadAnalytics();
        } else {
            showNotification('Error updating status', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating status:', error);
        showNotification('Error updating status', 'error');
    });
}

// Modal Management
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    } else {
        notification.style.background = '#D4AF37';
        notification.style.color = '#000';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function editMenuItem(id) {
    showNotification('Edit functionality would open a modal here', 'info');
}

function toggleAvailability(id, currentStatus) {
    const newStatus = !currentStatus;
    showNotification(`Item ${newStatus ? 'enabled' : 'disabled'} successfully!`, 'success');
    
    // Reload menu items
    setTimeout(() => {
        loadMenuItems();
    }, 1000);
}

function viewGiftCard(id) {
    showNotification('Gift card details would open in a modal here', 'info');
}

function openAddItemModal() {
    showNotification('Add new item modal would open here', 'info');
}

function generateReport() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'error');
        return;
    }
    
    showNotification('Generating report...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification('Report generated successfully!', 'success');
    }, 2000);
}

function loadAnalyticsCharts() {
    // This would integrate with Chart.js or similar library
    showNotification('Analytics charts would be loaded here', 'info');
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Orders
fetch('data.php?type=orders')
  .then(res => res.json())
  .then(data => {
    // Populate your orders table with 'data'
  });

// Reservations
fetch('data.php?type=reservations')
  .then(res => res.json())
  .then(data => {
    // Populate your reservations table with 'data'
  });

// Gift Cards
fetch('data.php?type=gift_cards')
  .then(res => res.json())
  .then(data => {
    // Populate your gift cards table with 'data'
  });