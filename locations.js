// Locations Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLocationsPage();
});

function initializeLocationsPage() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize map interactions
    initializeMapPins();
    
    // Initialize location cards animations
    initializeLocationCards();
    
    // Initialize scroll effects
    initializeScrollEffects();
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

// Map pins interaction
function initializeMapPins() {
    const mapPins = document.querySelectorAll('.map-pin');
    
    mapPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const location = pin.getAttribute('data-location');
            highlightLocation(location);
        });
    });
}

function highlightLocation(locationId) {
    // Remove previous highlights
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach(card => {
        card.classList.remove('highlighted');
    });
    
    // Add highlight to selected location
    const targetCard = document.querySelector(`[data-location="${locationId}"]`);
    if (targetCard) {
        targetCard.classList.add('highlighted');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Show notification
    showNotification(`Showing ${getLocationName(locationId)} location`, 'info');
}

function getLocationName(locationId) {
    const names = {
        'klcc': 'KLCC',
        'pj': 'Petaling Jaya',
        'georgetown': 'Georgetown',
        'jb': 'Johor Bahru',
        'kk': 'Kota Kinabalu'
    };
    return names[locationId] || locationId;
}

// Location cards animations
function initializeLocationCards() {
    const locationCards = document.querySelectorAll('.location-card');
    
    // Add data attributes for easier targeting
    locationCards.forEach((card, index) => {
        const locations = ['klcc', 'pj', 'georgetown', 'jb', 'kk'];
        if (locations[index]) {
            card.setAttribute('data-location', locations[index]);
        }
        
        // Add entrance animation delay
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// Scroll effects
function initializeScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.location-card, .feature-card, .map-pin');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add stagger effect to location cards
    const locationCards = document.querySelectorAll('.location-card');
    locationCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Reservation functionality
function makeReservation(locationId) {
    // Store selected location in localStorage
    localStorage.setItem('selectedLocation', locationId);
    
    // Redirect to reservations section
    window.location.href = 'index.html#reservations';
    
    // Show confirmation
    showNotification(`Redirecting to reservations for ${getLocationName(locationId)}`, 'success');
}

// Map functionality
function viewMap(locationId) {
    const locationName = getLocationName(locationId);
    
    // In a real implementation, this would open Google Maps or similar
    const mapUrls = {
        'klcc': 'https://maps.google.com/?q=Petronas+Twin+Towers+KLCC',
        'pj': 'https://maps.google.com/?q=1+Utama+Shopping+Centre+Petaling+Jaya',
        'georgetown': 'https://maps.google.com/?q=Eastern+Oriental+Hotel+Georgetown',
        'jb': 'https://maps.google.com/?q=Paradigm+Mall+Johor+Bahru',
        'kk': 'https://maps.google.com/?q=Shangri+La+Tanjung+Aru+Kota+Kinabalu'
    };
    
    if (mapUrls[locationId]) {
        window.open(mapUrls[locationId], '_blank');
    } else {
        showNotification(`Opening map for ${locationName}`, 'info');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        notification.style.color = '#fff';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #dc3545, #e74c3c)';
        notification.style.color = '#fff';
    } else {
        notification.style.background = 'linear-gradient(135deg, #D4AF37, #FFD700)';
        notification.style.color = '#000';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

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
    
    .location-card.highlighted {
        border-color: #FFD700 !important;
        box-shadow: 0 25px 60px rgba(255, 215, 0, 0.4) !important;
        transform: translateY(-15px) !important;
    }
    
    .location-card.highlighted::before {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, transparent 50%) !important;
    }
`;
document.head.appendChild(style);