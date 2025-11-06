import { Component } from '../utils/component-base.js';

/**
 * Add to Cart Component following Horizon pattern
 * 
 * @typedef {Object} Refs
 * @property {HTMLButtonElement} addToCartButton
 * 
 * @extends {Component<Refs>}
 */
export class AddToCartComponent extends Component {
  requiredRefs = ['addToCartButton'];

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Enables the add to cart button
   */
  enable() {
    if (this.refs.addToCartButton) {
      this.refs.addToCartButton.disabled = false;
    }
  }

  /**
   * Disables the add to cart button
   */
  disable() {
    if (this.refs.addToCartButton) {
      this.refs.addToCartButton.disabled = true;
    }
  }

  /**
   * Handles the click event for the add to cart button
   * @param {MouseEvent} event - The click event
   */
  handleClick(event) {
    const form = this.closest('form');
    if (!form?.checkValidity()) return;

    // Check if adding would exceed max before animating
    const quantitySelector = /** @type {any} */ (form.querySelector('quantity-selector-component'));
    if (quantitySelector?.canAddToCart) {
      const validation = quantitySelector.canAddToCart();
      // Don't animate if it would exceed max
      if (!validation.canAdd) {
        return;
      }
    }

    this.animateAddToCart();

    const animationEnabled = this.dataset.addToCartAnimation === 'true';
    if (animationEnabled && !event.target.closest('.quick-add-modal')) {
      this.#animateFlyToCart();
    }
  }

  /**
   * Animates the add to cart button
   */
  animateAddToCart() {
    const button = this.refs.addToCartButton;
    if (!button) return;

    // Add animation class
    button.classList.add('adding-to-cart');
    button.setAttribute('aria-busy', 'true');

    // Remove animation after delay
    setTimeout(() => {
      button.classList.remove('adding-to-cart');
      button.classList.add('added-to-cart');
      button.setAttribute('aria-busy', 'false');
      
      this.announceToScreenReader('Item added to cart');

      // Reset state after showing "Added" state
      setTimeout(() => {
        button.classList.remove('added-to-cart');
      }, 2000);
    }, 1000);
  }

  /**
   * Animates product image flying to cart
   * @private
   */
  #animateFlyToCart() {
    const productImage = this.dataset.productVariantMedia;
    if (!productImage) return;

    // Find cart icon in header
    const cartIcon = document.querySelector('[data-cart-icon]') || 
                     document.querySelector('.cart-link') ||
                     document.querySelector('[href="/cart"]');
    
    if (!cartIcon) return;

    // Create flying image element
    const flyingImage = document.createElement('img');
    flyingImage.src = productImage;
    flyingImage.className = 'flying-product-image';
    flyingImage.style.cssText = `
      position: fixed;
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      z-index: 9999;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    // Get starting position (product image or button)
    const productImageElement = this.closest('.product')?.querySelector('img') || 
                                this.refs.addToCartButton;
    const startRect = productImageElement?.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    if (!startRect || !endRect) return;

    // Set initial position
    flyingImage.style.left = `${startRect.left + startRect.width / 2 - 40}px`;
    flyingImage.style.top = `${startRect.top + startRect.height / 2 - 40}px`;
    flyingImage.style.opacity = '1';
    flyingImage.style.transform = 'scale(1)';
    flyingImage.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    document.body.appendChild(flyingImage);

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      flyingImage.style.left = `${endRect.left + endRect.width / 2 - 40}px`;
      flyingImage.style.top = `${endRect.top + endRect.height / 2 - 40}px`;
      flyingImage.style.transform = 'scale(0.2)';
      flyingImage.style.opacity = '0';
    });

    // Remove element after animation
    setTimeout(() => {
      flyingImage.remove();
      
      // Pulse cart icon
      cartIcon.classList.add('cart-pulse');
      setTimeout(() => cartIcon.classList.remove('cart-pulse'), 600);
    }, 800);
  }

  /**
   * Preload product image for animation
   * @private
   */
  #preloadImage() {
    const image = this.dataset.productVariantMedia;
    if (!image) return;

    const img = new Image();
    img.src = image;
  }
}

if (!customElements.get('add-to-cart-component')) {
  customElements.define('add-to-cart-component', AddToCartComponent);
}

