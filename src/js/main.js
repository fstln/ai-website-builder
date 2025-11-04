/**
 * Minimal Shopify Theme - Main Entry File
 * 
 * This file imports all required modules and initializes theme functionality
 */

import { initCart } from './modules/cart.js';
import { initProduct } from './modules/product.js';
import { initNavigation } from './modules/navigation.js';

/**
 * Theme Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Minimal Shopify Theme loaded');
  
  // Initialize all modules
  initCart();
  initProduct();
  initNavigation();
  
  // Listen for product added to cart event
  document.addEventListener('product-added-to-cart', (e) => {
    console.log('Product added to cart:', e.detail);
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
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
