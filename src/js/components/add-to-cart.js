/**
 * @file add-to-cart.js
 * @description Web Component for handling add to cart functionality
 */

import { addToCart, dispatchCartEvent, CartEvents } from '../utils/cart-api.js';

/**
 * AddToCart Web Component
 * Handles add to cart form submission with AJAX, loading states, and error handling
 * 
 * @example
 * <add-to-cart-component>
 *   <form action="/cart/add" method="post">
 *     <input type="hidden" name="id" value="{{variant_id}}">
 *     <input type="number" name="quantity" value="1">
 *     <button type="submit" data-add-to-cart-button>Add to Cart</button>
 *     <div data-add-to-cart-error></div>
 *   </form>
 * </add-to-cart-component>
 */
class AddToCartComponent extends HTMLElement {
  constructor() {
    super();
    this.form = null;
    this.submitButton = null;
    this.errorContainer = null;
    this.originalButtonText = '';
  }

  connectedCallback() {
    this.form = this.querySelector('form');
    this.submitButton = this.querySelector('[data-add-to-cart-button]');
    this.errorContainer = this.querySelector('[data-add-to-cart-error]');

    if (!this.form || !this.submitButton) {
      console.error('AddToCartComponent requires a form and submit button');
      return;
    }

    this.originalButtonText = this.submitButton.textContent || 'Add to Cart';
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  disconnectedCallback() {
    if (this.form) {
      this.form.removeEventListener('submit', this.handleSubmit);
    }
  }

  /**
   * Handle form submission
   * @param {Event} event - Submit event
   */
  async handleSubmit(event) {
    event.preventDefault();

    if (!this.form || !this.submitButton) return;

    // Validate form
    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      return;
    }

    // Get form data
    const formData = new FormData(this.form);
    const variantId = formData.get('id');
    const quantity = parseInt(formData.get('quantity')?.toString() || '1', 10);

    if (!variantId) {
      this.showError('Please select a variant');
      return;
    }

    // Prepare item data
    const item = {
      id: parseInt(variantId.toString(), 10),
      quantity: quantity
    };

    // Get line item properties if any
    const properties = {};
    formData.forEach((value, key) => {
      if (key.startsWith('properties[')) {
        const propKey = key.replace('properties[', '').replace(']', '');
        properties[propKey] = value;
      }
    });

    if (Object.keys(properties).length > 0) {
      item.properties = properties;
    }

    try {
      this.setLoading(true);
      this.clearError();

      const cartItem = await addToCart(item);

      this.setSuccess();
      
      // Dispatch cart updated event
      dispatchCartEvent(CartEvents.ITEM_ADDED, {
        item: cartItem,
        quantity: quantity,
        variantId: variantId
      });

      // Reset form after successful add
      setTimeout(() => {
        this.resetButton();
      }, 2000);

    } catch (error) {
      this.showError(error.message || 'Failed to add item to cart');
      this.setLoading(false);

      // Dispatch error event
      dispatchCartEvent(CartEvents.ERROR, {
        error: error.message,
        variantId: variantId
      });
    }
  }

  /**
   * Set loading state
   * @param {boolean} loading - Whether button is loading
   */
  setLoading(loading) {
    if (!this.submitButton) return;

    if (loading) {
      this.submitButton.disabled = true;
      this.submitButton.classList.add('loading');
      this.submitButton.textContent = this.submitButton.dataset.loadingText || 'Adding...';
      this.submitButton.setAttribute('aria-busy', 'true');
    } else {
      this.submitButton.disabled = false;
      this.submitButton.classList.remove('loading');
      this.submitButton.textContent = this.originalButtonText;
      this.submitButton.setAttribute('aria-busy', 'false');
    }
  }

  /**
   * Set success state
   */
  setSuccess() {
    if (!this.submitButton) return;

    this.submitButton.classList.remove('loading');
    this.submitButton.classList.add('success');
    this.submitButton.textContent = this.submitButton.dataset.successText || 'Added to Cart!';
    this.submitButton.setAttribute('aria-busy', 'false');

    // Announce to screen readers
    this.announceToScreenReader('Item added to cart');
  }

  /**
   * Reset button to original state
   */
  resetButton() {
    if (!this.submitButton) return;

    this.submitButton.classList.remove('success', 'loading');
    this.submitButton.disabled = false;
    this.submitButton.textContent = this.originalButtonText;
    this.submitButton.setAttribute('aria-busy', 'false');
  }

  /**
   * Show error message
   * @param {string} message - Error message to display
   */
  showError(message) {
    if (!this.errorContainer) {
      console.error(message);
      return;
    }

    this.errorContainer.textContent = message;
    this.errorContainer.classList.remove('hidden');
    this.errorContainer.setAttribute('role', 'alert');

    // Announce to screen readers
    this.announceToScreenReader(message);

    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  /**
   * Clear error message
   */
  clearError() {
    if (!this.errorContainer) return;

    this.errorContainer.textContent = '';
    this.errorContainer.classList.add('hidden');
    this.errorContainer.removeAttribute('role');
  }

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   */
  announceToScreenReader(message) {
    const liveRegion = document.querySelector('[data-cart-live-region]') || this.createLiveRegion();
    liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }

  /**
   * Create a live region for screen reader announcements
   * @returns {HTMLElement} Live region element
   */
  createLiveRegion() {
    let liveRegion = document.querySelector('[data-cart-live-region]');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.setAttribute('data-cart-live-region', '');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    return liveRegion;
  }
}

// Register the custom element
if (!customElements.get('add-to-cart-component')) {
  customElements.define('add-to-cart-component', AddToCartComponent);
}

export { AddToCartComponent };

