// Admin and User Credentials Configuration
// IMPORTANT: This file should be added to .gitignore in production
// Never commit this file with real credentials to version control

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
};

const USER_CREDENTIALS = {
    username: 'user',
    password: 'user123',
    role: 'user',
    name: 'Website User'
};

// Default users array (can be extended)
const DEFAULT_USERS = [
    ADMIN_CREDENTIALS,
    USER_CREDENTIALS
];

// Admin Contact Information (for order notifications)
const ADMIN_CONFIG = {
    email: 'admin@nithanyafoods.com',  // Change this to your admin email
    phone: '+91XXXXXXXXXX',            // Change this to your admin phone number
    name: 'Nithanya Foods Admin'
};

// UPI Payment Configuration
const UPI_CONFIG = {
    upiId: 'yourname@upi',              // Replace with your UPI ID (e.g., yourname@paytm, yourname@ybl)
    upiName: 'Nithanya Foods',           // Your business/account name
    qrCodeImage: '',                     // Optional: URL to your UPI QR code image
    instructions: 'Please make payment using any UPI app (Google Pay, PhonePe, Paytm, etc.) and enter the transaction ID below.'
};

// EmailJS Configuration
// Get your keys from: https://www.emailjs.com/
const EMAILJS_CONFIG = {
    serviceId: 'YOUR_EMAILJS_SERVICE_ID',    // Replace with your EmailJS Service ID
    templateId: 'YOUR_EMAILJS_TEMPLATE_ID',  // Replace with your EmailJS Template ID
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'      // Replace with your EmailJS Public Key
};

