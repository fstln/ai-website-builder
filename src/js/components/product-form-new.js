import { Component } from '../utils/component-base.js';
import { ThemeEvents, CartAddEvent } from '../utils/events.js';
import { addToCart } from '../utils/cart-api.js';

/**
 * Product Form Component following Horizon pattern
 * Handles product form submission and cart additions
 * 
 * @typedef {Object} Refs
 * @property {HTMLInputElement} variantId
 * @property {HTMLElement} liveRegion
 * @property {AddToCartComponent} addToCartButtonContainer
 * @property {HTMLElement} [addToCartTextError]
 * 
 * @extends {Component<Refs>}
 */
export class ProductFormComponent extends Component {
  requiredRefs = ['variantId', 'liveRegion'];
  #abortController = null;

  connectedCallback() {
    super.connectedCallback();

    // Listen for variant update events
    this.addEventListener(ThemeEvents.variantUpdate, this.#onVariantUpdate);
    this.addEventListener(ThemeEvents.variantSelected, this.#onVariantSelected);

    // Fetch initial cart quantity for the current variant
    this.#fetchAndUpdateCartQuantity();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(ThemeEvents.variantUpdate, this.#onVariantUpdate);
    this.removeEventListener(ThemeEvents.variantSelected, this.#onVariantSelected);
    
    if (this.#abortController) {
      this.#abortController.abort();
    }
  }

  /**
   * Handles form submission
   * @param {SubmitEvent} event
   */
  async handleSubmit(event) {
    event.preventDefault();

    const { addToCartTextError, addToCartButtonContainer } = this.refs;
    const form = /** @type {HTMLFormElement} */ (event.target);

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Disable button during submission
    addToCartButtonContainer?.disable();

    const formData = new FormData(form);
    const variantId = formData.get('id');
    const quantity = parseInt(formData.get('quantity')?.toString() || '1', 10);

    if (!variantId) {
      console.error('No variant ID found');
      addToCartButtonContainer?.enable();
      return;
    }

    try {
      // Add section IDs for section rendering
      const sections = this.#getSectionIdsForUpdate();
      
      const response = await addToCart({
        id: variantId.toString(),
        quantity,
        sections: sections.join(','),
        sections_url: window.location.pathname
      });

      // Hide error message
      if (addToCartTextError) {
        addToCartTextError.classList.add('hidden');
        addToCartTextError.removeAttribute('aria-live');
      }

      // Announce success to screen reader
      const addedText = this.refs.addToCartButtonContainer?.refs.addToCartButton
        ?.querySelector('.add-to-cart-text--added')?.textContent?.trim() || 'Added to cart';
      
      this.#setLiveRegionText(addedText);

      setTimeout(() => {
        this.#clearLiveRegionText();
      }, 3000);

      // Fetch updated cart quantity
      await this.#fetchAndUpdateCartQuantity();

      // Dispatch cart add event
      document.dispatchEvent(CartAddEvent({
        item: response.items?.[0],
        quantity
      }));

    } catch (error) {
      console.error('Failed to add to cart:', error);
      
      // Show error message
      if (addToCartTextError) {
        addToCartTextError.textContent = error.message || 'Failed to add to cart. Please try again.';
        addToCartTextError.classList.remove('hidden');
        addToCartTextError.setAttribute('aria-live', 'polite');
      }

      this.announceToScreenReader('Failed to add to cart. Please try again.');

    } finally {
      addToCartButtonContainer?.enable();
    }
  }

  /**
   * Get section IDs that should be updated after cart add
   * @returns {string[]}
   */
  #getSectionIdsForUpdate() {
    const sections = [];
    
    // Add cart drawer section
    const cartDrawer = document.querySelector('cart-drawer-component');
    if (cartDrawer?.dataset.sectionId) {
      sections.push(cartDrawer.dataset.sectionId);
    }

    return sections;
  }

  /**
   * Fetch cart and update quantity display for current variant
   */
  async #fetchAndUpdateCartQuantity() {
    const variantId = this.refs.variantId.value;
    if (!variantId) return;

    try {
      const response = await fetch(window.Shopify?.routes?.root + 'cart.js');
      const cart = await response.json();

      // Find quantity of current variant in cart
      let cartQuantity = 0;
      for (const item of cart.items) {
        if (item.variant_id.toString() === variantId) {
          cartQuantity += item.quantity;
        }
      }

      // Update quantity selector's cart quantity
      const quantitySelector = /** @type {any} */ (this.querySelector('quantity-selector-component'));
      if (quantitySelector) {
        const input = quantitySelector.refs.quantityInput;
        if (input) {
          input.setAttribute('data-cart-quantity', cartQuantity.toString());
          quantitySelector.updateCartQuantity?.();
        }
      }

      // Update quantity label if it exists
      const quantityLabel = this.querySelector('.quantity-label');
      if (quantityLabel && cartQuantity > 0) {
        const labelText = `${cartQuantity} in cart`;
        quantityLabel.textContent = labelText;
        quantityLabel.classList.remove('hidden');
      } else if (quantityLabel) {
        quantityLabel.classList.add('hidden');
      }

    } catch (error) {
      console.error('Failed to fetch cart quantity:', error);
    }
  }

  /**
   * Handle variant update event
   * @param {CustomEvent} event
   */
  #onVariantUpdate = async (event) => {
    const { detail } = event;
    
    // Check if this update is for this product
    if (detail.productId && detail.productId !== this.dataset.productId) {
      return;
    }

    const { variantId, addToCartButtonContainer } = this.refs;
    const variant = detail.variant;

    // Update variant ID
    variantId.value = variant?.id ?? '';

    // Update button state
    if (addToCartButtonContainer) {
      if (!variant || !variant.available) {
        addToCartButtonContainer.disable();
      } else {
        addToCartButtonContainer.enable();
      }

      // Update product variant media for animation
      if (variant?.featured_media?.preview_image?.src) {
        const mediaUrl = variant.featured_media.preview_image.src + '&width=100';
        addToCartButtonContainer.setAttribute('data-product-variant-media', mediaUrl);
      }
    }

    // Update quantity selector constraints
    const quantitySelector = /** @type {any} */ (this.querySelector('quantity-selector-component'));
    if (quantitySelector && variant) {
      const input = quantitySelector.refs.quantityInput;
      if (input) {
        // Update max inventory
        if (variant.inventory_management && variant.inventory_policy === 'deny') {
          input.max = variant.inventory_quantity.toString();
        } else {
          input.removeAttribute('max');
        }
        
        quantitySelector.updateButtonStates?.();
      }
    }

    // Fetch and update cart quantity for new variant
    await this.#fetchAndUpdateCartQuantity();
  };

  /**
   * Handle variant selected event (before update)
   * Disable button while variant is being fetched
   */
  #onVariantSelected = () => {
    this.refs.addToCartButtonContainer?.disable();
  };

  /**
   * Set live region text for screen readers
   * @param {string} text
   */
  #setLiveRegionText(text) {
    if (this.refs.liveRegion) {
      this.refs.liveRegion.textContent = text;
    }
  }

  /**
   * Clear live region text
   */
  #clearLiveRegionText() {
    if (this.refs.liveRegion) {
      this.refs.liveRegion.textContent = '';
    }
  }
}

if (!customElements.get('product-form-component')) {
  customElements.define('product-form-component', ProductFormComponent);
}

