/**
 * Navigation Module
 * Handles mobile menu and dropdown menu interactions
 */

export function initNavigation() {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  
  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      toggleMobileMenu(mobileNav);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-mobile-menu-toggle]') && 
          !e.target.closest('[data-mobile-nav]')) {
        closeMobileMenu(mobileNav);
      }
    });
    
    // Close mobile menu with ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu(mobileNav);
      }
    });
  }
  
  // Dropdown menus (if any)
  setupDropdowns();
  
  // Sticky header on scroll
  setupStickyHeader();
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu(nav) {
  const isHidden = nav.classList.contains('hidden');
  
  if (isHidden) {
    openMobileMenu(nav);
  } else {
    closeMobileMenu(nav);
  }
}

/**
 * Open mobile menu
 */
function openMobileMenu(nav) {
  nav.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Add animation
  requestAnimationFrame(() => {
    nav.classList.add('active');
  });
}

/**
 * Close mobile menu
 */
function closeMobileMenu(nav) {
  nav.classList.remove('active');
  nav.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * Setup dropdown menus
 */
function setupDropdowns() {
  const dropdownTriggers = document.querySelectorAll('[data-dropdown-trigger]');
  
  dropdownTriggers.forEach(trigger => {
    const dropdown = trigger.nextElementSibling;
    
    if (!dropdown) return;
    
    // Show dropdown on hover (desktop)
    if (window.matchMedia('(min-width: 768px)').matches) {
      trigger.addEventListener('mouseenter', () => {
        showDropdown(dropdown);
      });
      
      trigger.parentElement.addEventListener('mouseleave', () => {
        hideDropdown(dropdown);
      });
    } else {
      // Toggle on click for mobile devices
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDropdown(dropdown);
      });
    }
  });
}

/**
 * Show dropdown menu
 */
function showDropdown(dropdown) {
  dropdown.classList.remove('hidden');
  dropdown.classList.add('active');
}

/**
 * Hide dropdown menu
 */
function hideDropdown(dropdown) {
  dropdown.classList.remove('active');
  dropdown.classList.add('hidden');
}

/**
 * Toggle dropdown menu
 */
function toggleDropdown(dropdown) {
  if (dropdown.classList.contains('hidden')) {
    showDropdown(dropdown);
  } else {
    hideDropdown(dropdown);
  }
}

/**
 * Setup sticky header
 */
function setupStickyHeader() {
  const header = document.querySelector('.site-header');
  
  if (!header) return;
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  const updateHeader = () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide on scroll down, show on scroll up
    if (scrollY > lastScrollY && scrollY > 200) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    
    lastScrollY = scrollY;
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
}

