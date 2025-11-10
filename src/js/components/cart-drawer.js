/**
 * @file cart-drawer.js
 * @description Web Component for mini cart drawer/sidebar
 */

import { getCart, updateCartItem, removeFromCart } from '../utils/cart-api.js';
import { Component } from '../utils/component-base.js';

/**
 * CartDrawer Web Component
 * Sliding drawer that shows cart contents
 * 
 * @example
 * <cart-drawer-component>
 *   <!-- Cart drawer content -->
 * </cart-drawer-component>
 */
class CartDrawerComponent extends Component {
  constructor() {
    super();
    this.isOpen = false;
    this.focusableElements = [];
    this.previousFocus = null;
  }

  connectedCallback() {
    super.connectedCallback();

    // Listen for cart events
    document.addEventListener('cart:item-added', this.handleCartUpdate.bind(this));
    document.addEventListener('cart:updated', this.handleCartUpdate.bind(this));
    
    // Listen for open/close triggers
    document.addEventListener('cart:open-drawer', this.open.bind(this));
    
    // Attach event listeners
    this.attachEventListeners();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Close button
    const closeButton = this.querySelector('[data-drawer-close]');
    closeButton?.addEventListener('click', this.close.bind(this));

    // Backdrop click
    const backdrop = this.querySelector('[data-drawer-backdrop]');
    backdrop?.addEventListener('click', this.close.bind(this));

    // Quantity changes
    this.addEventListener('change', this.handleQuantityChange.bind(this));

    // Remove buttons
    this.addEventListener('click', (e) => {
      const removeButton = e.target.closest('[data-drawer-remove]');
      if (removeButton) {
        e.preventDefault();
        const line = removeButton.dataset.drawerRemove;
        this.removeItem(line);
      }
    });

    // Keyboard events
    this.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  /**
   * Open drawer
   */
  async open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.previousFocus = document.activeElement;

    // Refresh cart data
    await this.refreshCartData();

    // Show drawer
    this.classList.add('active');
    this.setAttribute('aria-hidden', 'false');
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    setTimeout(() => {
      const closeButton = this.querySelector('[data-drawer-close]');
      closeButton?.focus();
    }, 100);

    // Setup focus trap
    this.updateFocusableElements();

    // Announce to screen readers
    this.announceToScreenReader('Shopping cart opened');
  }

  /**
   * Close drawer
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    // Hide drawer
    this.classList.remove('active');
    this.setAttribute('aria-hidden', 'true');
    
    // Unlock body scroll
    document.body.style.overflow = '';

    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }

    // Announce to screen readers
    this.announceToScreenReader('Shopping cart closed');
  }

  /**
   * Handle cart update events
   * @param {CustomEvent} event
   */
  async handleCartUpdate(event) {
    // If item was just added, open the drawer
    if (event.type === 'cart:item-added') {
      await this.refreshCartData();
      this.open();
    } else {
      await this.refreshCartData();
    }
  }

  /**
   * Refresh cart data from API
   */
  async refreshCartData() {
    try {
      const cart = await getCart();
      this.renderCart(cart);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  }

  /**
   * Render cart contents
   * @param {Object} cart - Cart data
   */
  renderCart(cart) {
    const itemsContainer = this.querySelector('[data-drawer-items]');
    const emptyState = this.querySelector('[data-drawer-empty]');
    const cartContent = this.querySelector('[data-drawer-content]');
    const subtotalElement = this.querySelector('[data-drawer-subtotal]');
    const countElement = this.querySelector('[data-drawer-count]');

    if (!itemsContainer) return;

    // Update count
    if (countElement) {
      countElement.textContent = cart.item_count;
    }

    // Show empty state or items
    if (cart.item_count === 0) {
      emptyState?.classList.remove('hidden');
      cartContent?.classList.add('hidden');
      return;
    }

    emptyState?.classList.add('hidden');
    cartContent?.classList.remove('hidden');

    // Render items
    itemsContainer.innerHTML = cart.items.map(item => this.renderCartItem(item)).join('');

    // Update subtotal
    if (subtotalElement) {
      const formatMoney = window.Shopify?.formatMoney || ((cents) => `$${(cents / 100).toFixed(2)}`);
      subtotalElement.textContent = formatMoney(cart.total_price);
    }
  }

  /**
   * Render single cart item
   * @param {Object} item - Cart item
   * @returns {string} HTML string
   */
  renderCartItem(item) {
    const formatMoney = window.Shopify?.formatMoney || ((cents) => `$${(cents / 100).toFixed(2)}`);
    
    return `
      <div class="cart-drawer-item flex gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition-all" data-cart-item="${item.key}">
        ${item.image ? `
          <a href="${item.url}" class="flex-shrink-0 group">
            <img 
              src="${item.image}" 
              alt="${item.title}"
              class="w-20 h-20 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
              loading="lazy"
            >
          </a>
        ` : ''}
        
        <div class="flex-grow min-w-0">
          <h4 class="font-semibold text-sm mb-1 text-gray-900">
            <a href="${item.url}" class="hover:text-blue-600 transition-colors line-clamp-2">${item.product_title}</a>
          </h4>
          
          ${!item.variant_title.includes('Default') ? `
            <p class="text-xs text-gray-600 mb-2">${item.variant_title}</p>
          ` : ''}
          
          <div class="flex items-center justify-between gap-2 mt-3">
            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                data-drawer-quantity-minus="${item.key}"
                aria-label="Decrease quantity"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              
              <input
                type="number"
                class="w-10 h-8 text-center border-0 border-x border-gray-300 text-sm font-medium text-gray-900 bg-white"
                value="${item.quantity}"
                min="0"
                data-drawer-quantity-input="${item.key}"
                aria-label="Quantity"
              >
              
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
                data-drawer-quantity-plus="${item.key}"
                aria-label="Increase quantity"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
            
            <span class="font-bold text-sm text-gray-900">${formatMoney(item.final_line_price)}</span>
          </div>
        </div>
        
        <button
          type="button"
          class="flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          data-drawer-remove="${item.key}"
          aria-label="Remove ${item.product_title}"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
  }

  /**
   * Handle quantity change
   * @param {Event} event
   */
  async handleQuantityChange(event) {
    const input = event.target;
    if (!input.matches('[data-drawer-quantity-input]')) return;

    const line = input.dataset.drawerQuantityInput;
    const quantity = parseInt(input.value, 10);

    if (isNaN(quantity) || quantity < 0) return;

    await this.updateQuantity(line, quantity);
  }

  /**
   * Update item quantity
   * @param {string} line - Line item key
   * @param {number} quantity - New quantity
   */
  async updateQuantity(line, quantity) {
    try {
      const item = this.querySelector(`[data-cart-item="${line}"]`);
      item?.classList.add('opacity-50', 'pointer-events-none');

      await updateCartItem(line, quantity);
      await this.refreshCartData();

      // Update cart count badge
      this.updateCartBadge();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      await this.refreshCartData(); // Revert UI
    }
  }

  /**
   * Remove item from cart
   * @param {string} line - Line item key
   */
  async removeItem(line) {
    try {
      const item = this.querySelector(`[data-cart-item="${line}"]`);
      item?.classList.add('opacity-50', 'pointer-events-none');

      await removeFromCart(line);
      await this.refreshCartData();

      // Update cart count badge
      this.updateCartBadge();

      this.announceToScreenReader('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      await this.refreshCartData(); // Revert UI
    }
  }

  /**
   * Update cart count badge in header
   */
  async updateCartBadge() {
    try {
      const cart = await getCart();
      const badges = document.querySelectorAll('[data-cart-count-badge]');
      
      badges.forEach(badge => {
        badge.textContent = cart.item_count;
        badge.classList.toggle('hidden', cart.item_count === 0);
      });
    } catch (error) {
      console.error('Failed to update cart badge:', error);
    }
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} event
   */
  handleKeyboard(event) {
    if (event.key === 'Escape') {
      this.close();
      return;
    }

    // Focus trap
    if (event.key === 'Tab' && this.isOpen) {
      this.handleTabKey(event);
    }
  }

  /**
   * Handle Tab key for focus trap
   * @param {KeyboardEvent} event
   */
  handleTabKey(event) {
    this.updateFocusableElements();

    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  /**
   * Update list of focusable elements
   */
  updateFocusableElements() {
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(this.querySelectorAll(focusableSelector));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this.isOpen) {
      document.body.style.overflow = '';
    }

    document.removeEventListener('cart:item-added', this.handleCartUpdate);
    document.removeEventListener('cart:updated', this.handleCartUpdate);
    document.removeEventListener('cart:open-drawer', this.open);
  }
}

// Register the custom element
if (!customElements.get('cart-drawer-component')) {
  customElements.define('cart-drawer-component', CartDrawerComponent);
}

export { CartDrawerComponent };

