// Global variables
let currentSlide = 0;
let cart = [];
let menuItems = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen after 3 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'none';
    }, 3000);

    // Initialize navigation
    initializeNavigation();
    
    // Initialize carousel
    initializeCarousel();
    
    // Load menu items
    loadMenuItems();
    
    // Initialize forms
    initializeForms();
    
    // Initialize gift card interactions
    initializeGiftCards();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize cart
    initializeCart();
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Carousel functionality
function initializeCarousel() {
    const carousel = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.dish-card');
    
    // Auto-rotate carousel
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.dish-card');
    const totalSlides = slides.length;
    
    slides[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    slides[currentSlide].classList.add('active');
    
    const carousel = document.querySelector('.carousel-container');
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Menu functionality
function loadMenuItems() {
    // Sample menu data
    menuItems = [
        {
            id: 1,
            name: "Wagyu Beef Tenderloin",
            category: "mains",
            price: 58,
            description: "Premium A5 Wagyu beef with truffle sauce and seasonal vegetables",
            image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
            allergens: ["gluten"]
        },
        {
            id: 2,
            name: "Boston Lobster Thermidor",
            category: "mains",
            price: 52,
            description: "Fresh Boston lobster with garlic butter, herbs, and cheese gratinée",
            image: "https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg",
            allergens: ["shellfish", "dairy"]
        },
        {
            id: 3,
            name: "Foie Gras Terrine",
            category: "appetizers",
            price: 48,
            description: "Pan-seared foie gras with brioche toast and fig compote",
            image: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg",
            allergens: ["gluten", "dairy"]
        },
        {
            id: 4,
            name: "Chocolate Soufflé",
            category: "desserts",
            price: 42,
            description: "Decadent dark chocolate soufflé with gold leaf and vanilla ice cream",
            image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
            allergens: ["dairy", "eggs"]
        },
        {
            id: 5,
            name: "Oysters Rockefeller",
            category: "appetizers",
            price: 45,
            description: "Fresh Pacific oysters with spinach, herbs, and Pernod",
            image: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg",
            allergens: ["shellfish"]
        },
        {
            id: 6,
            name: "Dom Pérignon 2012",
            category: "beverages",
            price: 60,
            description: "Vintage champagne with notes of citrus and brioche",
            image: "https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg",
            allergens: ["sulfites"]
        },
        {
            id: 7,
            name: "Tuna Tartare",
            category: "appetizers",
            price: 44,
            description: "Fresh bluefin tuna with avocado, citrus, and sesame",
            image: "https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg",
            allergens: ["fish", "sesame"]
        },
        {
            id: 8,
            name: "Crème Brûlée",
            category: "desserts",
            price: 40,
            description: "Classic vanilla custard with caramelized sugar and fresh berries",
            image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
            allergens: ["dairy", "eggs"]
        },
        {
            id: 9,
            name: "Truffle Risotto",
            category: "mains",
            price: 55,
            description: "Creamy Arborio rice with black truffle shavings and Parmesan",
            image: "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
            allergens: ["dairy", "gluten"]
        },
        {
            id: 10,
            name: "Seared Duck Breast",
            category: "mains",
            price: 50,
            description: "Pan-seared duck breast with cherry gastrique and roasted vegetables",
            image: "https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg",
            allergens: []
        },
        {
            id: 11,
            name: "Mango Panna Cotta",
            category: "desserts",
            price: 38,
            description: "Silky smooth panna cotta with fresh mango coulis and mint",
            image: "https://images.pexels.com/photos/1279332/pexels-photo-1279332.jpeg",
            allergens: ["dairy"]
        },
        {
            id: 12,
            name: "Craft Cocktail Selection",
            category: "beverages",
            price: 45,
            description: "Artisanal cocktails crafted with premium spirits and fresh ingredients",
            image: "https://images.pexels.com/photos/1407847/pexels-photo-1407847.jpeg",
            allergens: []
        }
    ];

    displayMenuItems(menuItems);
    initializeMenuFilters();
    initializeMenuSearch();
}

function displayMenuItems(items) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';

    items.forEach(item => {
        const menuItemElement = createMenuItemElement(item);
        menuGrid.appendChild(menuItemElement);
    });
}

function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="menu-item-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="menu-item-footer">
                <span class="price">RM ${item.price}</span>
                <button class="add-to-cart" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        </div>
    `;
    return div;
}

function initializeMenuFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            filterMenuItems(category);
        });
    });
}

function filterMenuItems(category) {
    let filteredItems = menuItems;
    
    if (category !== 'all') {
        filteredItems = menuItems.filter(item => item.category === category);
    }
    
    displayMenuItems(filteredItems);
}

function initializeMenuSearch() {
    const searchInput = document.getElementById('menu-search');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
        displayMenuItems(filteredItems);
    });
}

// Cart functionality
function initializeCart() {
    const cartIcon = document.getElementById('cart-icon');
    cartIcon.addEventListener('click', openCart);
    
    updateCartCount();
}

function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;

    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartCount();
    showCartNotification();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateCartCount();
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartDisplay();
        updateCartCount();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.add('show');
    } else {
        cartCount.classList.remove('show');
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #ccc; padding: 20px;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>RM ${item.price} each</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <span style="margin-left: 15px; color: #D4AF37; font-weight: bold;">RM ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'block';
    updateCartDisplay();
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Simulate checkout process
    alert('Thank you for your order! You will be redirected to payment.');
    cart = [];
    updateCartCount();
    closeCart();
}

function showCartNotification() {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #D4AF37;
        color: #000;
        padding: 15px 20px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = 'Item added to cart!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Forms functionality
function initializeForms() {
    initializeReservationForm();
    initializeGiftCardForm();
    initializeNewsletterForm();
}

function initializeReservationForm() {
    const form = document.getElementById('reservation-form');
    const dateInput = document.getElementById('res-date');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    form.addEventListener('submit', handleReservationSubmit);
}

function handleReservationSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reservationData = Object.fromEntries(formData);
    
    // Validate form
    if (!validateReservationForm(reservationData)) {
        return;
    }
    
    // Simulate API call
    showLoadingState(e.target);
    
    setTimeout(() => {
        hideLoadingState(e.target);
        showSuccessMessage('Reservation confirmed! Check your email for details.');
        e.target.reset();
    }, 2000);
}

function validateReservationForm(data) {
    const requiredFields = ['date', 'time', 'guests', 'location', 'name', 'email', 'phone'];
    
    for (let field of requiredFields) {
        if (!data[field]) {
            alert(`Please fill in the ${field} field.`);
            return false;
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    return true;
}

function initializeGiftCardForm() {
    const form = document.getElementById('gift-card-form');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    
    let selectedAmount = 60; // Default amount
    
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedAmount = parseInt(button.getAttribute('data-amount'));
            customAmountInput.value = '';
        });
    });
    
    customAmountInput.addEventListener('input', (e) => {
        if (e.target.value) {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            selectedAmount = parseInt(e.target.value);
        }
    });
    
    form.addEventListener('submit', (e) => handleGiftCardSubmit(e, selectedAmount));
}

function handleGiftCardSubmit(e, amount) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const giftCardData = Object.fromEntries(formData);
    giftCardData.amount = amount;
    
    if (!validateGiftCardForm(giftCardData)) {
        return;
    }
    
    showLoadingState(e.target);
    
    setTimeout(() => {
        hideLoadingState(e.target);
        showSuccessMessage(`Gift card purchased successfully! Confirmation sent to ${giftCardData.recipient_email}`);
        e.target.reset();
    }, 2000);
}

function validateGiftCardForm(data) {
    const requiredFields = ['recipient_name', 'recipient_email', 'sender_name'];
    
    for (let field of requiredFields) {
        if (!data[field]) {
            alert(`Please fill in the ${field.replace('_', ' ')} field.`);
            return false;
        }
    }
    
    if (data.amount < 40 || data.amount > 60) {
        alert('Gift card amount must be between RM 40 and RM 60.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.recipient_email)) {
        alert('Please enter a valid recipient email address.');
        return false;
    }
    
    return true;
}

function initializeNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = e.target.querySelector('input[type="email"]').value;
        
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        showLoadingState(e.target);
        
        setTimeout(() => {
            hideLoadingState(e.target);
            showSuccessMessage('Thank you for subscribing to our newsletter!');
            e.target.reset();
        }, 1500);
    });
}

// Gift card interactions
function initializeGiftCards() {
    initializeInteractiveGiftCard();
}

function initializeInteractiveGiftCard() {
    const cardModel = document.querySelector('.gift-card-3d-model');
    const previewAmount = document.getElementById('preview-amount');
    
    if (!cardModel) return;
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let currentScale = 1;
    
    // Mouse events
    cardModel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        cardModel.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        currentRotationY += deltaX * 0.5;
        currentRotationX -= deltaY * 0.5;
        
        // Limit X rotation
        currentRotationX = Math.max(-30, Math.min(30, currentRotationX));
        
        updateCardTransform();
        
        startX = e.clientX;
        startY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        cardModel.style.cursor = 'grab';
    });
    
    // Wheel event for zoom
    cardModel.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        currentScale *= zoomFactor;
        currentScale = Math.max(0.8, Math.min(1.5, currentScale));
        
        updateCardTransform();
    });
    
    // Touch events for mobile
    let lastTouchX = 0;
    let lastTouchY = 0;
    
    cardModel.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
    });
    
    cardModel.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;
        
        currentRotationY += deltaX * 0.5;
        currentRotationX -= deltaY * 0.5;
        currentRotationX = Math.max(-30, Math.min(30, currentRotationX));
        
        updateCardTransform();
        
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
    });
    
    function updateCardTransform() {
        cardModel.style.transform = `
            rotateX(${currentRotationX}deg) 
            rotateY(${currentRotationY}deg) 
            scale(${currentScale})
        `;
    }
    
    // Update amount when gift card amount changes
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = button.getAttribute('data-amount');
            previewAmount.textContent = `RM ${amount}`;
        });
    });
    
    if (customAmountInput) {
        customAmountInput.addEventListener('input', (e) => {
            if (e.target.value) {
                previewAmount.textContent = `RM ${e.target.value}`;
            }
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVideo = document.querySelector('.hero-video');
        
        if (heroVideo) {
            heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
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
    const animatedElements = document.querySelectorAll('.menu-item, .testimonial-card, .team-member, .content-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add stagger effect to content cards
    const contentCards = document.querySelectorAll('.content-card');
    contentCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
}

function hideLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    
    // Reset button text based on form type
    if (form.id === 'reservation-form') {
        submitButton.textContent = 'Book Table';
    } else if (form.id === 'gift-card-form') {
        submitButton.textContent = 'Purchase Gift Card';
    } else if (form.id === 'newsletter-form') {
        submitButton.textContent = 'Subscribe';
    }
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #D4AF37;
        color: #000;
        padding: 20px 30px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 3000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: fadeInScale 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('cart-modal');
    if (e.target === modal) {
        closeCart();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
    }
});

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical images
    const criticalImages = [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
        'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Add entrance animations to elements
    const elementsToAnimate = document.querySelectorAll('.dish-card, .testimonial-card, .team-member, .content-card');
    elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-video');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add floating animation to gift card
function addFloatingAnimation() {
    const giftCard = document.querySelector('.gift-card-3d-model');
    if (giftCard) {
        let floatDirection = 1;
        setInterval(() => {
            const currentTransform = giftCard.style.transform || '';
            const floatOffset = Math.sin(Date.now() * 0.001) * 2;
            giftCard.style.transform = currentTransform + ` translateY(${floatOffset}px)`;
        }, 50);
    }
}

// Initialize floating animation after page load
setTimeout(addFloatingAnimation, 1000);