// Default product data
const defaultProducts = [
    {
        id: 1,
        name: "Ragi (Finger Millet)",
        description: "Rich in calcium and protein, perfect for daily nutrition. Organically grown and naturally processed.",
        price: 120,
        image: "https://images.pexels.com/photos/162712/ragi-finger-millet-grain-162712.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        currency: "₹"
    },
    {
        id: 2,
        name: "Peanut (Groundnut)",
        description: "Premium quality peanuts, rich in protein and healthy fats. Great for snacking and cooking.",
        price: 180,
        image: "https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        currency: "₹"
    },
    {
        id: 3,
        name: "Foxtail Millet",
        description: "Gluten-free millet with high fiber content. Ideal for diabetes management and weight control.",
        price: 100,
        image: "https://images.pexels.com/photos/162712/ragi-finger-millet-grain-162712.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        currency: "₹"
    },
    {
        id: 4,
        name: "Pearl Millet (Bajra)",
        description: "Nutritious and energy-rich millet. Excellent source of iron and magnesium.",
        price: 90,
        image: "https://images.pexels.com/photos/162712/ragi-finger-millet-grain-162712.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        currency: "₹"
    },
    {
        id: 5,
        name: "Little Millet",
        description: "Small grain with big benefits. High in fiber and essential minerals for a healthy diet.",
        price: 110,
        image: "https://images.pexels.com/photos/162712/ragi-finger-millet-grain-162712.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        currency: "₹"
    },
    {
        id: 6,
        name: "Barnyard Millet",
        description: "Fast-cooking millet with low glycemic index. Perfect for quick, healthy meals.",
        price: 95,
        image: "https://images.pexels.com/photos/162712/ragi-finger-millet-grain-162712.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
        currency: "₹"
    }
];

// Load products from localStorage or use default
let products = loadProducts();

// Shopping Cart
let cart = loadCart();

// Orders
let orders = loadOrders();

// LocalStorage functions
function loadProducts() {
    const saved = localStorage.getItem('nithanyaFoodsProducts');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error loading products:', e);
            return defaultProducts;
        }
    }
    return defaultProducts;
}

function saveProducts() {
    localStorage.setItem('nithanyaFoodsProducts', JSON.stringify(products));
}

// Cart Functions
function loadCart() {
    const saved = localStorage.getItem('nithanyaFoodsCart');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }
    return [];
}

function saveCart() {
    localStorage.setItem('nithanyaFoodsCart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId) {
    // Check if user is logged in
    if (!isLoggedIn()) {
        alert('Please login to add items to cart.');
        openLoginModal();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            currency: product.currency,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
        }
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = getCartCount();
    }
    
    displayCartItems();
}

function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }
        return;
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.currency}${item.price}/kg</p>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                    <span class="cart-item-qty">${item.quantity} kg</span>
                    <button class="qty-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <strong>${item.currency}${(item.price * item.quantity).toFixed(2)}</strong>
                <button class="remove-btn" onclick="removeFromCart(${item.productId})">×</button>
            </div>
        </div>
    `).join('');
    
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        const total = getCartTotal();
        cartTotal.textContent = `₹${total.toFixed(2)}`;
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        if (cartSidebar.classList.contains('active')) {
            displayCartItems();
        }
    }
}

// Orders Functions
function loadOrders() {
    const saved = localStorage.getItem('nithanyaFoodsOrders');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }
    return [];
}

function saveOrders() {
    localStorage.setItem('nithanyaFoodsOrders', JSON.stringify(orders));
}

function placeOrder(orderData) {
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: getCartTotal(),
        status: 'pending',
        ...orderData
    };
    
    orders.push(order);
    saveOrders();
    
    // Clear cart
    cart = [];
    saveCart();
    
    // Update UI
    displayOrders();
    closeCheckoutModal();
    toggleCart();
    
    showNotification('Order placed successfully! Order ID: ' + order.id);
}

function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    const ordersSection = document.getElementById('orders');
    const currentUser = getCurrentUser();
    
    if (!ordersList || !ordersSection) return;
    
    if (!isLoggedIn()) {
        ordersSection.style.display = 'none';
        return;
    }
    
    // Filter orders for current user
    const userOrders = orders.filter(order => 
        order.email === currentUser.email || 
        order.username === currentUser.username
    );
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p class="empty-orders">No orders yet. Start shopping!</p>';
        ordersSection.style.display = 'block';
        return;
    }
    
    ordersSection.style.display = 'block';
    ordersList.innerHTML = userOrders.map(order => {
        const orderDate = new Date(order.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>Order #${order.id}</h3>
                        <p class="order-date">${orderDate}</p>
                    </div>
                    <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <div class="order-item-info">
                                <h4>${item.name}</h4>
                                <p>${item.quantity} kg × ${item.currency}${item.price}</p>
                            </div>
                            <strong>${item.currency}${(item.price * item.quantity).toFixed(2)}</strong>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-address">
                        <strong>Delivery Address:</strong>
                        <p>${order.fullName}</p>
                        <p>${order.address}, ${order.city} - ${order.pincode}</p>
                        <p>Phone: ${order.phone}</p>
                    </div>
                    <div class="order-total">
                        <strong>Total: ₹${order.total.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Checkout Functions
function proceedToCheckout() {
    if (!isLoggedIn()) {
        alert('Please login to proceed with checkout.');
        openLoginModal();
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.add('active');
        displayCheckoutSummary();
        
        // Pre-fill user info if available
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.email) {
            const fullNameInput = document.getElementById('fullName');
            if (fullNameInput && currentUser.name) {
                fullNameInput.value = currentUser.name;
            }
        }
    }
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
        document.getElementById('checkoutForm').reset();
    }
}

function displayCheckoutSummary() {
    const summary = document.getElementById('checkoutSummary');
    if (!summary) return;
    
    const total = getCartTotal();
    
    summary.innerHTML = `
        <div class="summary-items">
            ${cart.map(item => `
                <div class="summary-item">
                    <span>${item.name} (${item.quantity} kg)</span>
                    <span>${item.currency}${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="summary-total">
            <strong>Total: ₹${total.toFixed(2)}</strong>
        </div>
    `;
}

function handleCheckout(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const transactionId = document.getElementById('transactionId').value.trim();
    
    if (!fullName || !phone || !address || !city || !pincode) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (!transactionId) {
        alert('Please enter your UPI transaction ID.');
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    
    const currentUser = getCurrentUser();
    
    // Prepare order data
    const orderData = {
        fullName,
        phone,
        address,
        city,
        pincode,
        email: currentUser?.email || '',
        username: currentUser?.username || '',
        transactionId: transactionId,
        paymentMethod: 'UPI'
    };
    
    // Confirm payment before placing order
    if (confirm('Have you completed the UPI payment?\n\nTransaction ID: ' + transactionId + '\n\nClick OK to confirm and place your order.')) {
        placeOrder(orderData, transactionId, 'paid');
    }
}

// Google Sign-In Handler
function handleGoogleSignIn(response) {
    // Decode the JWT token (simplified - in production, verify on server)
    try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        const user = {
            username: payload.email.split('@')[0],
            email: payload.email,
            name: payload.name || payload.email,
            role: 'user',
            picture: payload.picture,
            googleId: payload.sub
        };
        
        setCurrentUser(user);
        updateUserInterface();
        closeLoginModal();
        showNotification(`Welcome, ${user.name}!`);
        
        // Update navigation to show orders
        updateNavigation();
    } catch (error) {
        console.error('Error processing Google sign-in:', error);
        alert('Error signing in with Google. Please try again.');
    }
}

// Notification function
function showNotification(message) {
    // Simple notification - can be enhanced with a toast library
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update navigation to include orders link
function updateNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    
    const currentUser = getCurrentUser();
    if (isLoggedIn() && currentUser.role === 'user') {
        // Check if orders link already exists
        if (!document.querySelector('a[href="#orders"]')) {
            const ordersLink = document.createElement('a');
            ordersLink.href = '#orders';
            ordersLink.textContent = 'My Orders';
            nav.insertBefore(ordersLink, nav.querySelector('.user-actions'));
        }
    }
}

// User Authentication System
// Credentials are loaded from config.js file (not displayed in UI)
// In production, this should be handled by a secure backend server
const defaultUsers = typeof DEFAULT_USERS !== 'undefined' ? DEFAULT_USERS : [];

// Get current user from session
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Set current user in session
function setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

// Clear current user session
function clearCurrentUser() {
    sessionStorage.removeItem('currentUser');
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Authenticate user
function authenticateUser(username, password, userType) {
    // Check if user exists in default users
    const user = defaultUsers.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === userType
    );
    
    if (user) {
        return {
            username: user.username,
            role: user.role,
            name: user.name
        };
    }
    
    // Check localStorage for additional users
    const savedUsers = localStorage.getItem('nithanyaFoodsUsers');
    if (savedUsers) {
        try {
            const users = JSON.parse(savedUsers);
            const foundUser = users.find(u => 
                u.username === username && 
                u.password === password && 
                u.role === userType
            );
            if (foundUser) {
                return {
                    username: foundUser.username,
                    role: foundUser.role,
                    name: foundUser.name || foundUser.username
                };
            }
        } catch (e) {
            console.error('Error loading users:', e);
        }
    }
    
    return null;
}

// Update UI based on user role
function updateUserInterface() {
    const userActions = document.getElementById('userActions');
    const currentUser = getCurrentUser();
    
    if (!userActions) return;
    
    if (currentUser) {
        // User is logged in
        userActions.innerHTML = `
            <button class="cart-btn" onclick="toggleCart()" id="cartBtn">
                🛒 Cart <span class="cart-count" id="cartCount">${getCartCount()}</span>
            </button>
            <span class="user-info">👤 ${currentUser.name}</span>
            ${isAdmin() ? '<button class="admin-toggle-btn" onclick="toggleAdminPanel()">⚙️ Admin</button>' : ''}
            <button class="logout-btn" onclick="logout()">Logout</button>
        `;
        updateCartUI();
        updateNavigation();
        displayOrders();
    } else {
        // User is not logged in
        userActions.innerHTML = `
            <button class="cart-btn" onclick="toggleCart()" id="cartBtn">
                🛒 Cart <span class="cart-count" id="cartCount">${getCartCount()}</span>
            </button>
            <button class="login-btn" onclick="openLoginModal()">Login</button>
        `;
        updateCartUI();
    }
}

// Login functions
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('loginForm').reset();
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const userType = document.getElementById('userType').value;
    
    if (!username || !password || !userType) {
        alert('Please fill in all fields.');
        return;
    }
    
    const user = authenticateUser(username, password, userType);
    
    if (user) {
        setCurrentUser(user);
        updateUserInterface();
        closeLoginModal();
        alert(`Welcome, ${user.name}!`);
    } else {
        alert('Invalid credentials. Please try again.\n\nPlease contact the administrator for login credentials.');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        clearCurrentUser();
        updateUserInterface();
        
        // Close admin panel if open
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel && adminPanel.classList.contains('active')) {
            toggleAdminPanel();
        }
        
        // Close cart if open
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            toggleCart();
        }
        
        // Hide orders section
        const ordersSection = document.getElementById('orders');
        if (ordersSection) {
            ordersSection.style.display = 'none';
        }
        
        // Remove orders link from navigation
        const ordersLink = document.querySelector('a[href="#orders"]');
        if (ordersLink) {
            ordersLink.remove();
        }
        
        alert('You have been logged out successfully.');
    }
}

// Function to create product card
function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="currency">${product.currency}</span>${product.price}<span class="unit">/kg</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Function to display products
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    }
    // Also update admin panel if it's open
    if (document.getElementById('adminPanel').classList.contains('active')) {
        displayAdminProducts();
    }
}

// This function is now replaced by the new addToCart above

// Admin Panel Functions
function toggleAdminPanel() {
    // Check if user is admin
    if (!isAdmin()) {
        alert('Access denied. Admin privileges required.');
        return;
    }
    
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('active');
    if (panel.classList.contains('active')) {
        displayAdminProducts();
        switchTab('add'); // Reset to add tab when opening
    }
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'manage') {
        displayAdminProducts();
    }
}

// Display products in admin panel
function displayAdminProducts() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    
    if (products.length === 0) {
        productsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No products yet. Add your first product!</p>';
        return;
    }
    
    productsList.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="admin-product-price">${product.currency}${product.price}/kg</p>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="openEditModal(${product.id})">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add Product Function
function addProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();
    const currency = document.getElementById('productCurrency').value.trim() || '₹';
    
    if (!name || !description || isNaN(price) || price < 0 || !image) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    // Generate new ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        name,
        description,
        price,
        image,
        currency
    };
    
    products.push(newProduct);
    saveProducts();
    displayProducts();
    
    // Reset form
    document.getElementById('addProductForm').reset();
    document.getElementById('productCurrency').value = '₹';
    
    alert('Product added successfully!');
    switchTab('manage');
}

// Edit Product Functions
function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductImage').value = product.image;
    document.getElementById('editProductCurrency').value = product.currency;
    
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editProductForm').reset();
}

function editProduct(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editProductId').value);
    const name = document.getElementById('editProductName').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const image = document.getElementById('editProductImage').value.trim();
    const currency = document.getElementById('editProductCurrency').value.trim() || '₹';
    
    if (!name || !description || isNaN(price) || price < 0 || !image) {
        alert('Please fill in all required fields correctly.');
        return;
    }
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
        alert('Product not found.');
        return;
    }
    
    products[productIndex] = {
        id,
        name,
        description,
        price,
        image,
        currency
    };
    
    saveProducts();
    displayProducts();
    closeEditModal();
    
    alert('Product updated successfully!');
}

// Delete Product Function
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        alert('Product not found.');
        return;
    }
    
    const productName = products[productIndex].name;
    products.splice(productIndex, 1);
    saveProducts();
    displayProducts();
    
    alert(`${productName} has been deleted.`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateUserInterface();
    
    // Login form submission handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Checkout form submission handler
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    // Add form submission handler
    const addForm = document.getElementById('addProductForm');
    if (addForm) {
        addForm.addEventListener('submit', addProduct);
    }
    
    // Edit form submission handler
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', editProduct);
    }
    
    // Close modals when clicking outside
    document.getElementById('adminPanel').addEventListener('click', function(e) {
        if (e.target === this) {
            toggleAdminPanel();
        }
    });
    
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
    
    document.getElementById('loginModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeLoginModal();
        }
    });
    
    document.getElementById('checkoutModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCheckoutModal();
        }
    });
    
    // Close cart sidebar when clicking outside
    document.getElementById('cartSidebar').addEventListener('click', function(e) {
        if (e.target === this) {
            toggleCart();
        }
    });
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

