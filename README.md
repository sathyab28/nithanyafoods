# Nithanya Foods - Online Millet Store

A modern, responsive website for selling premium quality millets online.

## Features

- 🛍️ Product listing with images and prices
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern and clean UI/UX
- ⚡ Fast and lightweight
- 🌾 Showcases various millet products (Ragi, Peanut, and more)
- 🔐 User authentication with Admin and Website User roles
- 📧 Gmail/Google Sign-In integration (requires OAuth setup)
- 🛒 Shopping cart functionality
- 📦 Order placement and management
- 📋 Order history for users
- ⚙️ Admin panel for product management

## Products

The website currently displays:
- Ragi (Finger Millet) - ₹120/kg
- Peanut (Groundnut) - ₹180/kg
- Foxtail Millet - ₹100/kg
- Pearl Millet (Bajra) - ₹90/kg
- Little Millet - ₹110/kg
- Barnyard Millet - ₹95/kg

## Setup

1. Simply open `index.html` in your web browser
2. No build process or dependencies required
3. All files are self-contained

### Gmail Login Setup (Optional)

To enable Gmail/Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure the OAuth consent screen
6. Add authorized JavaScript origins (your domain)
7. Copy your Client ID
8. In `index.html`, replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID

**Note:** For local testing, you can use `http://localhost` as an authorized origin.

### Payment Gateway Setup (Razorpay)

To enable online payments:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or log in to your account
3. Go to Settings → API Keys
4. Copy your Key ID
5. In `config.js`, replace `YOUR_RAZORPAY_KEY_ID` with your actual Key ID

**Important:** 
- For production, you should use a backend server to create orders securely
- Never expose your Razorpay Key Secret in client-side code
- Use test keys for development and live keys for production

### Email Notifications Setup (EmailJS)

To enable email notifications for orders:

1. Go to [EmailJS](https://www.emailjs.com) and create a free account
2. Create an Email Service (Gmail, Outlook, etc.)
3. Create an Email Template with variables like `{{order_id}}`, `{{customer_name}}`, etc.
4. Get your Service ID, Template ID, and Public Key
5. In `config.js`, update `EMAILJS_CONFIG` with your credentials
6. Update `ADMIN_CONFIG` with your admin email address

**Email Template Variables Available:**
- `{{order_id}}` - Order ID
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer name
- `{{customer_email}}` - Customer email
- `{{customer_phone}}` - Customer phone
- `{{order_items}}` - List of order items
- `{{order_total}}` - Total amount
- `{{payment_id}}` - Payment ID
- `{{delivery_address}}` - Delivery address

### SMS Notifications

SMS notifications require a backend service. You can integrate with:
- Twilio
- AWS SNS
- Your own SMS gateway

Update the `sendSMSNotification()` function in `script.js` to call your backend API.

## File Structure

```
nithanyafoods/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # Product data and interactivity
├── config.js           # Credentials configuration (not in git)
├── config.example.js   # Example config file template
├── .gitignore          # Git ignore file
└── README.md           # This file
```

**Note:** `config.js` is excluded from version control. Copy `config.example.js` to `config.js` and configure your credentials.

## Customization

### Adding Products
Edit the `products` array in `script.js` to add or modify products:

```javascript
{
    id: 7,
    name: "Product Name",
    description: "Product description",
    price: 150,
    image: "image-url.jpg",
    currency: "₹"
}
```

### Changing Images
Replace the image URLs in the `products` array with your own product images. You can:
- Use local images (place them in an `images/` folder and update paths)
- Use image hosting services
- Use the placeholder service that's already implemented as fallback

### Styling
Modify `styles.css` to change colors, fonts, or layout. The CSS uses CSS variables for easy customization.

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## User Guide

### Login Credentials

**Important:** Admin credentials are stored in `config.js` file and are not displayed on the website for security reasons.

To set up credentials:
1. Create a `config.js` file (see `config.example.js` template)
2. Configure your admin and user credentials
3. The `config.js` file is excluded from version control via `.gitignore`

**Default Test Credentials** (for development only):
- Admin: Configured in `config.js`
- User: Configured in `config.js`

**Security Note:** In production, credentials should be managed through a secure backend authentication system, not stored in client-side files.

### How to Use

1. **Browse Products**: View all available millet products with prices
2. **Login**: Click "Login" to access shopping features
3. **Add to Cart**: Click "Add to Cart" on any product (requires login)
4. **View Cart**: Click the cart icon in the header to view your cart
5. **Checkout**: Click "Proceed to Checkout" to place an order
6. **View Orders**: After login, click "My Orders" to see your order history
7. **Admin Panel**: Admin users can click "Admin" to manage products

### Shopping Cart Features

- Add multiple quantities of products
- Update quantities using +/- buttons
- Remove items from cart
- View total price
- Proceed to checkout with delivery address

### Order Management

- Place orders with delivery address
- View order history
- Track order status (Pending, Processing, Completed, Cancelled)
- View order details including items and total

## Future Enhancements

Potential features to add:
- Product search and filtering
- Product detail pages
- Payment integration (Stripe, PayPal, etc.)
- Email notifications for orders
- Order tracking with delivery updates
- Product reviews and ratings
- Wishlist functionality
- Coupon/discount codes

## License

© 2024 Nithanya Foods. All rights reserved.

