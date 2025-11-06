/**
 * Utility functions based on Horizon
 */

/**
 * Create fetch configuration
 * @param {string} method - HTTP method
 * @param {Object} [body] - Request body
 * @returns {RequestInit}
 */
export function fetchConfig(method = 'POST', body = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  return config;
}

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Wait for animation to end
 * @param {HTMLElement} element
 * @param {Function} callback
 */
export function onAnimationEnd(element, callback) {
  const handleAnimationEnd = () => {
    element.removeEventListener('animationend', handleAnimationEnd);
    callback();
  };
  element.addEventListener('animationend', handleAnimationEnd);
}

/**
 * Reset shimmer effect (placeholder for future implementation)
 * @param {HTMLElement} element
 */
export function resetShimmer(element) {
  // Placeholder for shimmer reset logic
  element.classList.remove('shimmer');
}

