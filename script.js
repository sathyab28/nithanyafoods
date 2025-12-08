// Default product data
const defaultProducts = [
    {
        id: 1,
        name: "Ragi (Finger Millet)",
        description: "Rich in calcium and protein, perfect for daily nutrition. Organically grown and naturally processed.",
        price: 120,
        image: "temp/ragi.png",
        currency: "₹",
        stock: 50,
        inStock: true
    },
    {
        id: 2,
        name: "Peanut (Groundnut)",
        description: "Premium quality peanuts, rich in protein and healthy fats. Great for snacking and cooking.",
        price: 180,
        image: "temp/peanut.png",
        currency: "₹",
        stock: 30,
        inStock: true
    },
    {
        id: 3,
        name: "Foxtail Millet",
        description: "Gluten-free millet with high fiber content. Ideal for diabetes management and weight control.",
        price: 100,
        image: "temp/foxtail.png",
        currency: "₹",
        stock: 40,
        inStock: true
    },
    {
        id: 4,
        name: "Pearl Millet (Bajra)",
        description: "Nutritious and energy-rich millet. Excellent source of iron and magnesium.",
        price: 90,
        image: "temp/pearl.png",
        currency: "₹",
        stock: 35,
        inStock: true
    },
    {
        id: 5,
        name: "Little Millet",
        description: "Small grain with big benefits. High in fiber and essential minerals for a healthy diet.",
        price: 110,
        image: "temp/little.png",
        currency: "₹",
        inStock: true
    },
    {
        id: 6,
        name: "Millet",
        description: "Fast-cooking millet with low glycemic index. Perfect for quick, healthy meals.",
        price: 95,
        image: "temp/m.png",
        currency: "₹",
        stock: 0,
        inStock: false
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
    
    // Check if product is in stock
    const stock = product.stock || 0;
    const inStock = product.inStock !== false && stock > 0;
    
    if (!inStock) {
        showNotification('This product is out of stock.');
        return;
    }
    
    const existingItem = cart.find(item => item.productId === productId);
    const requestedQuantity = existingItem ? existingItem.quantity + 1 : 1;
    
    // Check if requested quantity exceeds available stock
    if (requestedQuantity > stock) {
        showNotification(`Only ${stock} kg available in stock.`);
        return;
    }
    
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

function placeOrder(orderData, transactionId = null, paymentStatus = 'pending') {
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: getCartTotal(),
        status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
        transactionId: transactionId,
        paymentMethod: orderData.paymentMethod || 'UPI',
        paymentStatus: paymentStatus,
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
    
    // Send order notification to admin and customer
    if (paymentStatus === 'paid') {
        // Send email to admin
        sendOrderNotificationToAdmin(order);
        
        // Send email to customer (if email provided)
        if (order.email) {
            sendOrderConfirmationToCustomer(order);
        }
        
        // Send SMS to customer
        sendOrderSMSToCustomer(order);
    }
    
    showNotification('Order placed successfully! Order ID: ' + order.id);
}

// Email Notification Functions
function sendOrderNotificationToAdmin(order) {
    const emailConfig = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG : null;
    const adminConfig = typeof ADMIN_CONFIG !== 'undefined' ? ADMIN_CONFIG : { email: '', name: 'Admin' };
    
    // Check if EmailJS is properly configured
    if (!emailConfig || !adminConfig.email || !emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
        console.warn('EmailJS not properly configured. Please update config.js with your EmailJS credentials.');
        console.log('Order details for admin:', {
            orderId: order.id,
            customer: order.fullName,
            phone: order.phone,
            total: order.total,
            items: order.items
        });
        return;
    }
    
    // Check if EmailJS library is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded. Please check if the script is included in index.html');
        return;
    }
    
    // Initialize EmailJS
    try {
        emailjs.init(emailConfig.publicKey);
        
        // Format order items
        const orderItems = order.items.map(item => 
            `${item.name} - ${item.quantity} kg × ₹${item.price} = ₹${item.quantity * item.price}`
        ).join('\n');
        
        const templateParams = {
            to_email: adminConfig.email,
            to_name: adminConfig.name,
            order_id: order.id,
            order_date: new Date(order.date).toLocaleString('en-IN'),
            customer_name: order.fullName,
            customer_email: order.email || 'Not provided',
            customer_phone: order.phone,
            order_items: orderItems,
            order_total: `₹${order.total.toFixed(2)}`,
            payment_id: order.transactionId || 'N/A',
            delivery_address: `${order.address}, ${order.city} - ${order.pincode}`,
            payment_status: order.paymentStatus || 'pending',
            payment_method: order.paymentMethod || 'UPI'
        };
        
        emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams)
            .then(function(response) {
                console.log('✅ Admin notification email sent successfully!', response.status, response.text);
                showNotification('Admin notified via email');
            }, function(error) {
                console.error('❌ Failed to send admin notification email:', error);
                console.error('Error details:', {
                    status: error.status,
                    text: error.text,
                    serviceId: emailConfig.serviceId,
                    templateId: emailConfig.templateId
                });
            });
    } catch (error) {
        console.error('Error initializing EmailJS:', error);
    }
}

function sendOrderConfirmationToCustomer(order) {
    const emailConfig = typeof EMAILJS_CONFIG !== 'undefined' ? EMAILJS_CONFIG : null;
    const customerEmail = order.email;
    
    if (!emailConfig || !customerEmail) {
        console.log('EmailJS not configured or customer email not provided. Order details:', order);
        return;
    }
    
    // Check if EmailJS is properly configured
    if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
        console.warn('EmailJS not properly configured. Customer email not sent.');
        return;
    }
    
    // Check if EmailJS library is loaded
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded.');
        return;
    }
    
    // Initialize EmailJS
    try {
        emailjs.init(emailConfig.publicKey);
        
        // Format order items
        const orderItems = order.items.map(item => 
            `${item.name} - ${item.quantity} kg × ₹${item.price} = ₹${item.quantity * item.price}`
        ).join('\n');
        
        const templateParams = {
            to_email: customerEmail,
            to_name: order.fullName,
            order_id: order.id,
            order_date: new Date(order.date).toLocaleString('en-IN'),
            order_items: orderItems,
            order_total: `₹${order.total.toFixed(2)}`,
            payment_id: order.transactionId || 'N/A',
            delivery_address: `${order.address}, ${order.city} - ${order.pincode}`,
            payment_status: order.paymentStatus || 'pending',
            payment_method: order.paymentMethod || 'UPI'
        };
        
        emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams)
            .then(function(response) {
                console.log('✅ Customer confirmation email sent successfully!', response.status, response.text);
            }, function(error) {
                console.error('❌ Failed to send customer confirmation email:', error);
            });
    } catch (error) {
        console.error('Error sending customer email:', error);
    }
}

// SMS Notification Function
function sendOrderSMSToCustomer(order) {
    const customerPhone = order.phone;
    
    if (!customerPhone) {
        console.warn('Customer phone number not provided. SMS not sent.');
        return;
    }
    
    // Format phone number (remove spaces, ensure it starts with +)
    let phoneNumber = customerPhone.trim().replace(/\s+/g, '');
    if (!phoneNumber.startsWith('+')) {
        // If it doesn't start with +, assume it's an Indian number and add +91
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '+91' + phoneNumber.substring(1);
        } else if (phoneNumber.length === 10) {
            phoneNumber = '+91' + phoneNumber;
        } else {
            phoneNumber = '+91' + phoneNumber;
        }
    }
    
    // Format order items for SMS
    const orderItems = order.items.map(item => 
        `${item.name}(${item.quantity}kg)`
    ).join(', ');
    
    // Create SMS message
    const smsMessage = `Thank you for your order! Order ID: ${order.id}. Items: ${orderItems}. Total: ₹${order.total.toFixed(2)}. We'll process your order soon. - Nithanya Foods`;
    
    // For SMS, you need to use a backend service or SMS gateway
    // This is a placeholder that can be integrated with:
    // 1. Twilio API (requires backend)
    // 2. AWS SNS (requires backend)
    // 3. TextLocal API (can work with frontend but needs API key)
    // 4. Your own backend API
    
    // Option 1: If you have a backend API endpoint
    const smsApiUrl = typeof SMS_API_CONFIG !== 'undefined' && SMS_API_CONFIG.apiUrl 
        ? SMS_API_CONFIG.apiUrl 
        : null;
    
    if (smsApiUrl) {
        // Send SMS via your backend API
        fetch(smsApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phoneNumber,
                message: smsMessage,
                orderId: order.id
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('✅ SMS sent successfully:', data);
        })
        .catch(error => {
            console.error('❌ Failed to send SMS:', error);
        });
    } else {
        // Option 2: Use a service that works from frontend (like TextLocal)
        // Note: This requires API key in config
        const smsConfig = typeof SMS_CONFIG !== 'undefined' ? SMS_CONFIG : null;
        
        if (smsConfig && smsConfig.apiKey && smsConfig.sender) {
            // Using TextLocal API as example (you can replace with your preferred service)
            const textLocalUrl = `https://api.textlocal.in/send/?apikey=${encodeURIComponent(smsConfig.apiKey)}&numbers=${encodeURIComponent(phoneNumber)}&message=${encodeURIComponent(smsMessage)}&sender=${encodeURIComponent(smsConfig.sender)}`;
            
            fetch(textLocalUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        console.log('✅ SMS sent successfully via TextLocal');
                    } else {
                        console.error('❌ SMS sending failed:', data);
                    }
                })
                .catch(error => {
                    console.error('❌ Failed to send SMS:', error);
                });
        } else {
            // Log SMS details for manual sending or backend integration
            console.log('SMS Configuration:', {
                phone: phoneNumber,
                message: smsMessage,
                note: 'SMS API not configured. Please set up SMS_CONFIG in config.js or use a backend API.'
            });
            
            // Show notification to user
            showNotification('Order confirmed! SMS will be sent to ' + phoneNumber);
        }
    }
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
    
    // Display UPI payment details
    displayUPIPaymentDetails();
}

function displayUPIPaymentDetails() {
    const upiDetails = document.getElementById('upiPaymentDetails');
    if (!upiDetails) return;
    
    // Get UPI config from config.js file
    const upiConfig = typeof UPI_CONFIG !== 'undefined' ? UPI_CONFIG : {
        upiId: 'yourname@upi',
        upiName: 'Nithanya Foods',
        instructions: 'Please make payment using any UPI app and enter the transaction ID below.'
    };
    
    // Validate UPI ID is configured
    if (!upiConfig.upiId || upiConfig.upiId === 'yourname@upi') {
        console.warn('UPI ID not configured. Please update config.js with your UPI ID.');
        upiDetails.innerHTML = `
            <div class="upi-info-box" style="border-color: #dc3545;">
                <p style="color: #dc3545; text-align: center; padding: 1rem;">
                    ⚠️ UPI ID not configured. Please update config.js with your UPI ID.
                </p>
            </div>
        `;
        return;
    }
    
    const total = getCartTotal();
    
    // Create UPI payment string for QR code (UPI URI format)
    // Format: upi://pay?pa=<UPI_ID>&pn=<PAYEE_NAME>&am=<AMOUNT>&cu=<CURRENCY>&tn=<TRANSACTION_NOTE>
    const upiPaymentString = `upi://pay?pa=${encodeURIComponent(upiConfig.upiId)}&pn=${encodeURIComponent(upiConfig.upiName || 'Nithanya Foods')}&am=${total.toFixed(2)}&cu=INR&tn=Nithanya Foods Order`;
    const upiLink = upiPaymentString;
    
    upiDetails.innerHTML = `
        <div class="upi-info-box">
            <div class="upi-header">
                <h4>Pay via UPI</h4>
                <p class="upi-amount">Amount: <strong>₹${total.toFixed(2)}</strong></p>
            </div>
            <div class="upi-details">
                <div class="upi-id-section">
                    <label>UPI ID:</label>
                    <div class="upi-id-display">
                        <strong>${upiConfig.upiId}</strong>
                        <button class="copy-btn" onclick="copyUPIId('${upiConfig.upiId}')" title="Copy UPI ID">📋</button>
                    </div>
                </div>
                <div class="upi-qr-section">
                    ${upiConfig.qrCodeImage ? `
                        <div class="upi-qr">
                            <img src="${upiConfig.qrCodeImage}" alt="UPI QR Code" class="qr-code-image">
                            <p class="qr-hint">Scan this QR code to pay</p>
                        </div>
                    ` : `
                        <div class="upi-qr">
                            <div id="upiQRCode" class="qr-code-container"></div>
                            <p class="qr-hint">Scan this QR code with any UPI app to pay</p>
                        </div>
                    `}
                </div>
                <div class="upi-actions">
                    <a href="${upiLink}" class="upi-pay-btn" onclick="handleUPIPaymentClick(event, '${upiConfig.upiId}', ${total})">
                        💳 Pay with UPI App
                    </a>
                    <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; text-align: center;">
                        Click to open UPI app and pay ₹${total.toFixed(2)} to ${upiConfig.upiId}
                    </p>
                </div>
                <p class="upi-instructions">${upiConfig.instructions || 'After successful payment, enter the transaction ID below and click "Place Order". Order will be placed automatically and confirmation email will be sent.'}</p>
            </div>
        </div>
    `;
    
    // Generate QR code if QRCode library is available
    if (!upiConfig.qrCodeImage) {
        const qrContainer = document.getElementById('upiQRCode');
        if (qrContainer) {
            // Clear any existing QR code
            qrContainer.innerHTML = '';
            
            // Try using QRCode.js library
            if (typeof QRCode !== 'undefined') {
                try {
                    new QRCode(qrContainer, {
                        text: upiPaymentString,
                        width: 200,
                        height: 200,
                        colorDark: '#2d5016',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    });
                } catch (error) {
                    console.error('QRCode.js error:', error);
                    generateQRCodeFallback(qrContainer, upiPaymentString);
                }
            } else if (typeof QRCodeJS !== 'undefined') {
                // Alternative QR code library
                try {
                    new QRCodeJS({
                        content: upiPaymentString,
                        padding: 4,
                        width: 200,
                        height: 200,
                        color: '#2d5016',
                        background: '#ffffff',
                        ecl: 'H',
                        container: qrContainer
                    });
                } catch (error) {
                    console.error('QRCodeJS error:', error);
                    generateQRCodeFallback(qrContainer, upiPaymentString);
                }
            } else {
                // Fallback: Use online QR code API
                generateQRCodeFallback(qrContainer, upiPaymentString);
            }
        }
    }
}

// Fallback QR code generation using online API
function generateQRCodeFallback(container, text) {
    // Use a QR code API service as fallback
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    container.innerHTML = `<img src="${qrApiUrl}" alt="UPI QR Code" class="qr-code-image" onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\'color:#666; padding:1rem;\'>QR code unavailable. Please use the UPI ID or payment link.</p>'">`;
}

// Handle UPI payment link click
function handleUPIPaymentClick(event, upiId, amount) {
    // Log payment attempt for debugging
    console.log('UPI Payment initiated:', {
        upiId: upiId,
        amount: amount,
        timestamp: new Date().toISOString()
    });
    
    // The link will open the UPI app automatically
    // No need to prevent default - let the browser handle the upi:// protocol
    showNotification(`Opening UPI app to pay ₹${amount.toFixed(2)} to ${upiId}`);
}

function copyUPIId(upiId) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(upiId).then(function() {
            showNotification('UPI ID copied to clipboard!');
        }, function() {
            // Fallback for older browsers
            fallbackCopyUPIId(upiId);
        });
    } else {
        fallbackCopyUPIId(upiId);
    }
}

function fallbackCopyUPIId(upiId) {
    const textArea = document.createElement('textarea');
    textArea.value = upiId;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showNotification('UPI ID copied to clipboard!');
    } catch (err) {
        showNotification('Failed to copy. Please copy manually: ' + upiId);
    }
    document.body.removeChild(textArea);
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
    
    // Automatically place order after payment (transaction ID provided)
    // Show processing state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing Order...';
    }
    
    // Place order automatically - payment is considered successful when transaction ID is provided
    placeOrder(orderData, transactionId, 'paid');
    
    // Reset button state after delay
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
        }
    }, 2000);
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
    
    if (!username || !password) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Try to authenticate as admin first, then as user
    let user = authenticateUser(username, password, 'admin');
    if (!user) {
        user = authenticateUser(username, password, 'user');
    }
    
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
    // Check stock status
    const stock = product.stock || 0;
    const inStock = product.inStock !== false && stock > 0;
    const stockStatus = inStock ? (stock > 10 ? 'In Stock' : `Only ${stock} kg left`) : 'Out of Stock';
    const stockClass = inStock ? 'in-stock' : 'out-of-stock';
    
    return `
        <div class="product-card ${!inStock ? 'out-of-stock-card' : ''}">
            ${!inStock ? '<div class="out-of-stock-badge">Out of Stock</div>' : ''}
            <img src="${product.image || ''}" alt="${product.name}" class="product-image ${!inStock ? 'out-of-stock-image' : ''}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}';"
                 loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="currency">${product.currency}</span>${product.price}<span class="unit">/kg</span>
                </div>
                <div class="stock-status ${stockClass}">
                    ${stockStatus}
                </div>
                <button class="add-to-cart ${!inStock ? 'disabled' : ''}" 
                        onclick="${inStock ? `addToCart(${product.id})` : 'showNotification(\'This product is out of stock\')'}"
                        ${!inStock ? 'disabled' : ''}>
                    ${inStock ? 'Add to Cart' : 'Out of Stock'}
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
    
    productsList.innerHTML = products.map(product => {
        const stock = product.stock || 0;
        const inStock = product.inStock !== false && stock > 0;
        const stockStatus = inStock ? `${stock} kg` : 'Out of Stock';
        const stockClass = inStock ? 'in-stock' : 'out-of-stock';
        
        return `
        <div class="admin-product-item">
            <div class="admin-product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="admin-product-price">${product.currency}${product.price}/kg</p>
                <p class="admin-product-stock ${stockClass}">Stock: ${stockStatus}</p>
            </div>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="openEditModal(${product.id})">Edit</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `;
    }).join('');
}

// Add Product Function
function addProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const image = document.getElementById('productImage').value.trim();
    const currency = document.getElementById('productCurrency').value.trim() || '₹';
    const stock = parseFloat(document.getElementById('productStock').value) || 0;
    
    if (!name || !description || isNaN(price) || price < 0 || !image || isNaN(stock) || stock < 0) {
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
        currency,
        stock: stock,
        inStock: stock > 0
    };
    
    products.push(newProduct);
    saveProducts();
    displayProducts();
    
    // Reset form
    document.getElementById('addProductForm').reset();
    document.getElementById('productCurrency').value = '₹';
    const preview = document.getElementById('productImagePreview');
    if (preview) {
        preview.innerHTML = '';
        preview.classList.remove('active');
    }
    
    alert('Product added successfully!');
    switchTab('manage');
}

// Image Upload Functions
async function handleImageUpload(fileInputId, urlInputId, previewId) {
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);
    const preview = document.getElementById(previewId);
    
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    
    const file = fileInput.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        fileInput.value = '';
        return;
    }
    
    // Validate file size (max 5MB for ImgBB, 10MB for base64 fallback)
    if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB.');
        fileInput.value = '';
        return;
    }
    
    // Show uploading state
    if (preview) {
        preview.innerHTML = '<p style="text-align: center; padding: 1rem; color: #666;">📤 Uploading image...</p>';
        preview.classList.add('active');
    }
    
    // Try to upload to cloud service first
    const imageHostingConfig = typeof IMAGE_HOSTING_CONFIG !== 'undefined' ? IMAGE_HOSTING_CONFIG : null;
    
    if (imageHostingConfig && imageHostingConfig.service === 'imgbb' && imageHostingConfig.imgbbApiKey) {
        try {
            const imageUrl = await uploadImageToImgBB(file, imageHostingConfig.imgbbApiKey);
            if (imageUrl) {
                urlInput.value = imageUrl;
                updateImagePreview(urlInputId, previewId);
                showNotification('Image uploaded successfully!');
                return;
            }
        } catch (error) {
            console.warn('Failed to upload to ImgBB, falling back to base64:', error);
        }
    }
    
    // Fallback to base64 if cloud upload fails or not configured
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        urlInput.value = base64Image;
        updateImagePreview(urlInputId, previewId);
        if (preview) {
            preview.innerHTML += '<p style="font-size: 0.8rem; color: #ff9800; margin-top: 0.5rem;">⚠️ Using local storage (image visible only to you)</p>';
        }
    };
    reader.onerror = function() {
        alert('Error reading image file.');
        if (preview) {
            preview.innerHTML = '';
            preview.classList.remove('active');
        }
    };
    reader.readAsDataURL(file);
}

// Upload image to ImgBB
async function uploadImageToImgBB(file, apiKey) {
    return new Promise((resolve, reject) => {
        // Convert file to base64 for ImgBB API
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result.split(',')[1]; // Remove data:image/...;base64, prefix
            
            // ImgBB API expects form data with key and image (base64)
            const formData = new FormData();
            formData.append('key', apiKey);
            formData.append('image', base64);
            
            fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data && data.data.url) {
                    console.log('✅ Image uploaded to ImgBB:', data.data.url);
                    resolve(data.data.url);
                } else {
                    console.error('❌ ImgBB upload failed:', data.error);
                    reject(new Error(data.error?.message || 'Upload failed'));
                }
            })
            .catch(error => {
                console.error('❌ ImgBB upload error:', error);
                reject(error);
            });
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

function updateImagePreview(urlInputId, previewId) {
    const urlInput = document.getElementById(urlInputId);
    const preview = document.getElementById(previewId);
    
    if (!urlInput || !preview) return;
    
    const imageUrl = urlInput.value.trim();
    
    if (imageUrl) {
        preview.innerHTML = `<img src="${imageUrl}" alt="Preview">`;
        preview.classList.add('active');
    } else {
        preview.innerHTML = '';
        preview.classList.remove('active');
    }
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
    document.getElementById('editProductStock').value = product.stock || 0;
    
    // Update image preview
    updateImagePreview('editProductImage', 'editProductImagePreview');
    
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editProductForm').reset();
    const preview = document.getElementById('editProductImagePreview');
    if (preview) {
        preview.innerHTML = '';
        preview.classList.remove('active');
    }
}

function editProduct(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editProductId').value);
    const name = document.getElementById('editProductName').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const image = document.getElementById('editProductImage').value.trim();
    const currency = document.getElementById('editProductCurrency').value.trim() || '₹';
    const stock = parseFloat(document.getElementById('editProductStock').value) || 0;
    
    if (!name || !description || isNaN(price) || price < 0 || !image || isNaN(stock) || stock < 0) {
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
        currency,
        stock: stock,
        inStock: stock > 0
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
    
    // Checkout modal should only close via close button, not by clicking outside
    // Removed click-outside-to-close functionality for checkout modal
    // document.getElementById('checkoutModal').addEventListener('click', function(e) {
    //     if (e.target === this) {
    //         closeCheckoutModal();
    //     }
    // });
    
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

