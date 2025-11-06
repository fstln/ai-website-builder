import { Component } from '../utils/component-base.js';
import { morphSection, sectionRenderer } from '../utils/section-renderer.js';
import { ThemeEvents, CartUpdateEvent } from '../utils/events.js';
import { updateCartItem } from '../utils/cart-api.js';

/**
 * Cart Items Component following Horizon pattern
 * 
 * @typedef {Object} Refs
 * @property {HTMLElement[]} quantitySelectors - Quantity selector elements
 * @property {HTMLElement[]} cartItemRows - Cart item rows
 * 
 * @extends {Component<Refs>}
 */
class CartItemsComponent extends Component {
  #debouncedOnChange = this.debounce(this.#onQuantityChange.bind(this), 300);
  #isUpdating = false;
  #abortController = null;

  connectedCallback() {
    super.connectedCallback();

    // Listen for quantity selector updates
    document.addEventListener(ThemeEvents.quantitySelectorUpdate, this.#debouncedOnChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    document.removeEventListener(ThemeEvents.quantitySelectorUpdate, this.#debouncedOnChange);
    
    if (this.#abortController) {
      this.#abortController.abort();
    }
  }

  /**
   * Handle quantity change event
   * @param {CustomEvent} event
   */
  async #onQuantityChange(event) {
    const { quantity, cartLine: line } = event.detail;

    if (!line) return;

    if (quantity === 0) {
      return this.onLineItemRemove(line);
    }

    await this.updateQuantity({
      line,
      quantity,
      action: 'change',
    });
  }

  /**
   * Handle line item removal
   * @param {number} line - Line item index (1-based)
   */
  async onLineItemRemove(line) {
    await this.updateQuantity({
      line,
      quantity: 0,
      action: 'clear',
    });

    const cartItemRow = this.refs.cartItemRows?.[line - 1];
    
    if (cartItemRow) {
      // Add removing animation
      cartItemRow.classList.add('removing', 'opacity-50');
      
      // Remove after animation
      setTimeout(() => {
        cartItemRow.remove();
      }, 300);
    }
  }

  /**
   * Update cart quantity
   * @param {Object} options
   * @param {number} options.line - Line index (1-based)
   * @param {number} options.quantity - New quantity
   * @param {string} options.action - Action type ('change' or 'clear')
   */
  async updateQuantity({ line, quantity, action }) {
    if (this.#isUpdating) {
      console.log('[CartItems] Update already in progress, skipping');
      return;
    }

    this.#isUpdating = true;

    // Cancel previous request
    if (this.#abortController) {
      this.#abortController.abort();
    }
    this.#abortController = new AbortController();

    const sectionId = this.dataset.sectionId;
    
    if (!sectionId) {
      console.error('[CartItems] No section ID found');
      this.#isUpdating = false;
      return;
    }

    try {
      // Show loading state
      this.#setLoadingState(line, true);

      // Build request body
      const body = {
        line,
        quantity,
        sections: sectionId,
        sections_url: window.location.pathname
      };

      const shopifyRoot = window.Shopify?.routes?.root || '/';
      const response = await fetch(`${shopifyRoot}cart/change.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
        signal: this.#abortController.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || errorData.message || 'Failed to update cart');
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors);
      }

      // Get updated section HTML
      const newSectionHTML = data.sections?.[sectionId];
      
      if (newSectionHTML) {
        // Use morphSection to update DOM
        morphSection(this, newSectionHTML);
      }

      // Dispatch cart update event
      document.dispatchEvent(CartUpdateEvent({
        cart: data,
        itemCount: data.item_count,
        source: 'cart-items-component'
      }));

      // Announce to screen reader
      const message = quantity === 0 ? 'Item removed from cart' : 'Cart updated';
      this.announceToScreenReader(message);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[CartItems] Request was cancelled');
        return;
      }

      console.error('[CartItems] Cart update error:', error);
      this.#showError(error.message || 'Failed to update cart. Please try again.');
      this.announceToScreenReader('Failed to update cart. Please try again.');

    } finally {
      this.#isUpdating = false;
      this.#setLoadingState(line, false);
      this.#abortController = null;
    }
  }

  /**
   * Set loading state for a cart item
   * @param {number} line
   * @param {boolean} loading
   */
  #setLoadingState(line, loading) {
    const item = this.refs.cartItemRows?.[line - 1];
    if (!item) return;

    if (loading) {
      item.classList.add('loading', 'opacity-50', 'pointer-events-none');
      item.setAttribute('aria-busy', 'true');
    } else {
      item.classList.remove('loading', 'opacity-50', 'pointer-events-none');
      item.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * Show error message
   * @param {string} message
   */
  #showError(message) {
    const errorContainer = this.querySelector('[data-cart-error]');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.classList.remove('hidden');
      errorContainer.setAttribute('role', 'alert');
      setTimeout(() => {
        errorContainer.classList.add('hidden');
        errorContainer.removeAttribute('role');
      }, 5000);
    }
  }
}

if (!customElements.get('cart-items-component')) {
  customElements.define('cart-items-component', CartItemsComponent);
}

export { CartItemsComponent };
