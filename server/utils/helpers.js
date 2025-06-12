// Generate random string for various purposes
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format currency (Ethiopian Birr)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 2
  }).format(amount);
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Validate Ethiopian phone number
const validateEthiopianPhone = (phone) => {
  const phoneRegex = /^(\+251|0)?[97]\d{8}$/;
  return phoneRegex.test(phone);
};

// Generate order tracking number
const generateTrackingNumber = () => {
  const prefix = 'GEB';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Check if date is expired
const isExpired = (date) => {
  return new Date(date) < new Date();
};

// Calculate estimated delivery date
const calculateDeliveryDate = (orderDate, city) => {
  const baseDate = new Date(orderDate);
  let daysToAdd = 3; // Default 3 days
  
  // Add extra days for remote cities
  const remoteCities = ['Gambela', 'Afar', 'Somali'];
  if (remoteCities.includes(city)) {
    daysToAdd = 7;
  }
  
  baseDate.setDate(baseDate.getDate() + daysToAdd);
  return baseDate;
};

module.exports = {
  generateRandomString,
  formatCurrency,
  calculateDistance,
  validateEthiopianPhone,
  generateTrackingNumber,
  sanitizeInput,
  isExpired,
  calculateDeliveryDate
};