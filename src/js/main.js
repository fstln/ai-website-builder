/**
 * 最小化 Shopify 主题 - 主入口文件
 * 
 * 该文件导入所有必需的模块并初始化主题功能
 */

import { initCart } from './modules/cart.js';
import { initProduct } from './modules/product.js';
import { initNavigation } from './modules/navigation.js';

/**
 * 主题初始化
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('最小化 Shopify 主题已加载');
  
  // 初始化所有模块
  initCart();
  initProduct();
  initNavigation();
  
  // 监听产品添加到购物车事件
  document.addEventListener('product-added-to-cart', (e) => {
    console.log('Product added to cart:', e.detail);
  });
});

/**
 * 工具函数：防抖
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
 * 工具函数：节流
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
