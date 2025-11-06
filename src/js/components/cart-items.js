/**
 * @file cart-items.js
 * @description Web Component for managing cart items display and updates using Section Rendering
 * Based on Horizon Reference implementation
 */

import { ComponentBase } from '../utils/component-base.js';

/**
 * CartItems Web Component
 * Handles cart item quantity updates, removal, and UI updates via Shopify Section Rendering
 * 
 * @example
 * <cart-items-component data-section-id="template--123__cart-items">
 *   <!-- Cart items markup -->
 * </cart-items-component>
 */
class CartItemsComponent extends ComponentBase {
  constructor() {
    super();
    this.isUpdating = false;
    this.sectionId = this.dataset.sectionId;
    this.abortController = null;
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Listen for quantity changes
    this.addEventListener('change', this.handleQuantityChange.bind(this));
    
    // Listen for remove button clicks
    this.addEventListener('click', this.handleRemoveClick.bind(this));
    
    // Listen for cart updates from other sources
    document.addEventListener('cart:updated', this.handleExternalCartUpdate.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Clean up event listeners
    document.removeEventListener('cart:updated', this.handleExternalCartUpdate);
    
    // Cancel any pending requests
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Handle quantity input changes
   * @param {Event} event
   */
  async handleQuantityChange(event) {
    console.log('[CartItems] Change event received', event);
    const input = event.target;
    console.log('[CartItems] Input element:', input);
    console.log('[CartItems] Input name:', input.name);
    console.log('[CartItems] Input value:', input.value);
    
    // Check if this is a quantity input from our quantity-input snippet
    // The name will be like: updates[1234567890]
    if (!input.name || !input.name.startsWith('updates[')) {
      console.log('[CartItems] Not a cart quantity input, ignoring');
      return;
    }

    // Extract line key from name attribute
    const match = input.name.match(/updates\[(.+)\]/);
    if (!match) {
      console.log('[CartItems] Could not extract line key from name');
      return;
    }

    const line = match[1];
    const quantity = parseInt(input.value, 10);

    console.log('[CartItems] Line key:', line);
    console.log('[CartItems] Quantity:', quantity);

    if (isNaN(quantity) || quantity < 0) {
      console.error('[CartItems] Invalid quantity value');
      return;
    }

    console.log('[CartItems] Calling updateCartLine...');
    await this.updateCartLine(line, quantity);
  }

  /**
   * Handle remove button clicks
   * @param {Event} event
   */
  async handleRemoveClick(event) {
    const removeButton = event.target.closest('[data-cart-remove]');
    if (!removeButton) return;

    event.preventDefault();

    const line = removeButton.dataset.cartRemove;
    if (!line) {
      console.error('No line item specified for removal');
      return;
    }

    // Remove item by setting quantity to 0
    await this.updateCartLine(line, 0);
  }

  /**
   * Update cart line using Shopify Cart API with Section Rendering
   * This fetches the updated section HTML and replaces the DOM
   * @param {string} line - Line item key
   * @param {number} quantity - New quantity (0 to remove)
   */
  async updateCartLine(line, quantity) {
    if (this.isUpdating) {
      console.log('Update already in progress, skipping');
      return;
    }

    this.isUpdating = true;

    // Cancel any previous request
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      // Disable cart during update
      this.disableCartItems();

      // Build the request body with section rendering
      const body = JSON.stringify({
        line: line,
        quantity: quantity,
        sections: this.sectionId,
        sections_url: window.location.pathname
      });

      // Make the request to /cart/change.js
      const rootUrl = window.Shopify?.routes?.root || '/';
      const response = await fetch(`${rootUrl}cart/change.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: body,
        signal: this.abortController.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || errorData.message || 'Failed to update cart');
      }

      const data = await response.json();

      // Check for errors in response
      if (data.errors) {
        throw new Error(data.errors);
      }

      // Get the new section HTML from the response
      const newSectionHTML = data.sections?.[this.sectionId];

      if (newSectionHTML) {
        // Parse the new HTML
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(newSectionHTML, 'text/html');
        const newContent = newDoc.querySelector('cart-items-component');

        if (newContent) {
          // Replace the entire inner HTML
          this.innerHTML = newContent.innerHTML;
          
          // Re-collect refs after DOM update
          this._collectRefs();
        }
      }

      // Update cart count in header
      this.updateCartCount(data.item_count);

      // Dispatch cart update event for other components
      this.dispatchCustomEvent('cart:updated', {
        cart: data,
        itemCount: data.item_count,
        source: 'cart-items-component'
      });

      // Announce to screen readers
      const message = quantity === 0 
        ? 'Item removed from cart'
        : 'Cart updated';
      this.announceToScreenReader(message);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
        return;
      }

      console.error('Cart update error:', error);
      
      // Show error message
      this.showError(error.message || 'Failed to update cart. Please try again.');

      // Dispatch error event
      this.dispatchCustomEvent('cart:error', {
        error: error.message,
        line,
        quantity
      });

      // Announce error to screen readers
      this.announceToScreenReader('Failed to update cart. Please try again.');

    } finally {
      this.isUpdating = false;
      this.enableCartItems();
      this.abortController = null;
    }
  }

  /**
   * Disable cart items during update
   */
  disableCartItems() {
    this.classList.add('cart-items-disabled');
    this.style.opacity = '0.6';
    this.style.pointerEvents = 'none';
  }

  /**
   * Enable cart items after update
   */
  enableCartItems() {
    this.classList.remove('cart-items-disabled');
    this.style.opacity = '';
    this.style.pointerEvents = '';
  }

  /**
   * Update cart count in header and other UI elements
   * @param {number} count - New cart item count
   */
  updateCartCount(count) {
    // Update all elements with data-cart-count attribute
    const cartCountElements = document.querySelectorAll('[data-cart-count]');
    cartCountElements.forEach(element => {
      element.textContent = count;
      
      // Hide/show badge if count is 0
      if (count === 0) {
        element.classList.add('hidden');
      } else {
        element.classList.remove('hidden');
      }
    });

    // Update cart page header if it exists
    const cartHeader = document.querySelector('.cart-header p');
    if (cartHeader) {
      if (count === 0) {
        cartHeader.textContent = window.Shopify?.T?.('general.cart.empty') || 'Your cart is empty';
      } else {
        const itemText = count === 1 
          ? (window.Shopify?.T?.('general.cart.item_count.one')?.replace('{{ count }}', count) || `${count} item`)
          : (window.Shopify?.T?.('general.cart.item_count.other')?.replace('{{ count }}', count) || `${count} items`);
        cartHeader.textContent = itemText;
      }
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    const errorContainer = this.querySelector('[data-cart-error]');
    if (!errorContainer) return;

    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
    errorContainer.setAttribute('role', 'alert');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorContainer.classList.add('hidden');
      errorContainer.removeAttribute('role');
    }, 5000);
  }

  /**
   * Handle cart updates from other sources (e.g., add to cart from product page)
   * @param {CustomEvent} event
   */
  handleExternalCartUpdate(event) {
    // Don't react to our own events
    if (event.detail.source === 'cart-items-component') return;

    // Optionally refresh the cart page
    // For now, we'll just update the count
    if (event.detail.itemCount !== undefined) {
      this.updateCartCount(event.detail.itemCount);
    }

    // Could also fetch and render the updated section
    // but that might be overkill for external updates
  }
}

// Register the custom element
if (!customElements.get('cart-items-component')) {
  customElements.define('cart-items-component', CartItemsComponent);
}

export { CartItemsComponent };
