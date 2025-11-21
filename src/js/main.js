/**
 * Minimal Shopify Theme - Main Entry File
 * 
 * This file imports all required modules and initializes theme functionality
 */

import { initCart } from './modules/cart.js';
import { initProduct } from './modules/product.js';
import { initNavigation } from './modules/navigation.js';

// Import Web Components - Horizon Architecture
import './components/add-to-cart-new.js';  // Horizon-style add to cart
import './components/product-form-new.js';  // Horizon-style product form
import './components/variant-selector-new.js';  // Horizon-style variant selector
import './components/product-gallery-new.js';  // Horizon-style gallery
import './components/cart-items-new.js';  // Horizon-style cart items
import './components/cart-drawer.js';
import './components/quantity-selector.js';  // Base quantity selector
import './components/cart-quantity-selector.js';  // Cart-specific quantity selector
import './components/countdown-timer.js'; // Countdown timer component

// Import utilities (for global access)
import { initializeMoneyFormat } from './utils/format-money.js';

/**
 * Theme Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Minimal Shopify Theme loaded');

  // Initialize money formatting (from Liquid settings)
  if (window.Shopify && window.Shopify.money_format) {
    initializeMoneyFormat({
      moneyFormat: window.Shopify.money_format
    });
  }

  // Initialize all modules
  initCart();
  initProduct();
  initNavigation();

  // Listen for cart events
  document.addEventListener('cart:item-added', (e) => {
    console.log('Item added to cart:', e.detail);
  });

  document.addEventListener('cart:updated', (e) => {
    console.log('Cart updated:', e.detail);
  });

  document.addEventListener('cart:error', (e) => {
    console.error('Cart error:', e.detail);
  });
});

/**
 * Utility function: Debounce
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility function: Throttle
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
