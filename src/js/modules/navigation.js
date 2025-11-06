/**
 * Navigation Module
 * Handles mobile menu drawer and sticky header
 */

export function initNavigation() {
  initMobileDrawer();
  initStickyHeader();
  initCartCountListener();
}

/**
 * Initialize Mobile Drawer
 */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
  const closeBtn = document.querySelector('[data-mobile-close]');
  const drawer = document.querySelector('[data-mobile-drawer]');
  const backdrop = document.querySelector('[data-mobile-backdrop]');

  if (!toggleBtn || !drawer) return;

  // Open drawer
  const openDrawer = () => {
    drawer.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Focus close button
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 100);
  };

  // Close drawer
  const closeDrawer = () => {
    drawer.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  };

  // Event listeners
  toggleBtn.addEventListener('click', openDrawer);
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) {
      closeDrawer();
    }
  });

  // Close drawer on link click (mobile navigation)
  const navLinks = drawer.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeDrawer, 150);
    });
  });
}

/**
 * Initialize Sticky Header with Scroll Detection
 */
function initStickyHeader() {
  const header = document.querySelector('[data-header]');
  
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const scrollY = window.scrollY;

    // Add scrolled class for elevated shadow
    if (scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  // Throttle scroll events using requestAnimationFrame
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  updateHeader();
}

/**
 * Initialize Cart Count Listener
 * Listens for custom cart:updated events
 */
function initCartCountListener() {
  const cartCountElement = document.querySelector('[data-cart-count]');
  
  if (!cartCountElement) return;

  // Listen for cart update events
  document.addEventListener('cart:updated', (e) => {
    const { itemCount } = e.detail;
    updateCartCount(itemCount);
  });
}

/**
 * Update cart count display
 * @param {number} count - Number of items in cart
 */
function updateCartCount(count) {
  const cartCountElements = document.querySelectorAll('[data-cart-count]');
  
  cartCountElements.forEach(element => {
    element.textContent = count;
    
    // Toggle visibility
    element.style.display = count > 0 ? 'flex' : 'none';

    // Add scale animation
    if (count > 0) {
      element.style.animation = 'none';
      setTimeout(() => {
        element.style.animation = 'cartCountPulse 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }, 10);
    }
  });
}

// Add CSS animation for cart count pulse
if (typeof document !== 'undefined' && !document.querySelector('#cart-count-animation')) {
  const style = document.createElement('style');
  style.id = 'cart-count-animation';
  style.textContent = `
    @keyframes cartCountPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
  `;
  document.head.appendChild(style);
}
