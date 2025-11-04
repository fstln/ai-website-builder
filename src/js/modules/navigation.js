/**
 * 导航模块
 * 处理移动菜单和下拉菜单交互
 */

export function initNavigation() {
  // 移动菜单切换
  const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  
  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      toggleMobileMenu(mobileNav);
    });
    
    // 点击外部关闭移动菜单
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-mobile-menu-toggle]') && 
          !e.target.closest('[data-mobile-nav]')) {
        closeMobileMenu(mobileNav);
      }
    });
    
    // ESC 键关闭移动菜单
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu(mobileNav);
      }
    });
  }
  
  // 下拉菜单（如果有）
  setupDropdowns();
  
  // 滚动时固定头部
  setupStickyHeader();
}

/**
 * 切换移动菜单
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
 * 打开移动菜单
 */
function openMobileMenu(nav) {
  nav.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // 添加动画
  requestAnimationFrame(() => {
    nav.classList.add('active');
  });
}

/**
 * 关闭移动菜单
 */
function closeMobileMenu(nav) {
  nav.classList.remove('active');
  nav.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * 设置下拉菜单
 */
function setupDropdowns() {
  const dropdownTriggers = document.querySelectorAll('[data-dropdown-trigger]');
  
  dropdownTriggers.forEach(trigger => {
    const dropdown = trigger.nextElementSibling;
    
    if (!dropdown) return;
    
    // 悬停显示下拉菜单（桌面）
    if (window.matchMedia('(min-width: 768px)').matches) {
      trigger.addEventListener('mouseenter', () => {
        showDropdown(dropdown);
      });
      
      trigger.parentElement.addEventListener('mouseleave', () => {
        hideDropdown(dropdown);
      });
    } else {
      // 移动设备点击切换
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDropdown(dropdown);
      });
    }
  });
}

/**
 * 显示下拉菜单
 */
function showDropdown(dropdown) {
  dropdown.classList.remove('hidden');
  dropdown.classList.add('active');
}

/**
 * 隐藏下拉菜单
 */
function hideDropdown(dropdown) {
  dropdown.classList.remove('active');
  dropdown.classList.add('hidden');
}

/**
 * 切换下拉菜单
 */
function toggleDropdown(dropdown) {
  if (dropdown.classList.contains('hidden')) {
    showDropdown(dropdown);
  } else {
    hideDropdown(dropdown);
  }
}

/**
 * 设置固定头部
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
    
    // 向下滚动时隐藏，向上滚动时显示
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

