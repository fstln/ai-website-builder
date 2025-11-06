/**
 * @file variant-selector.js
 * @description Web Component for product variant selection
 */

import { Component } from '../utils/component-base.js';

/**
 * VariantSelector Web Component
 * Manages product variant selection, availability, and price updates
 * 
 * @example
 * <variant-selector-component data-product-id="123">
 *   <select name="options[Color]">...</select>
 *   <select name="options[Size]">...</select>
 * </variant-selector-component>
 */
class VariantSelectorComponent extends Component {
  constructor() {
    super();
    this.variants = [];
    this.currentVariant = null;
    this.options = [];
  }

  connectedCallback() {
    super.connectedCallback();

    // Get product data from script tag or data attribute
    this.loadProductData();
    
    if (!this.variants.length) {
      console.error('No variant data found');
      return;
    }

    // Find all variant option inputs
    this.optionInputs = Array.from(
      this.querySelectorAll('select[name^="options"], input[name^="options"]')
    );

    // Set initial variant
    this.currentVariant = this.getSelectedVariant();
    this.updateUI();

    // Attach event listeners
    this.attachEventListeners();
  }

  /**
   * Load product data from JSON script tag
   */
  loadProductData() {
    const productJson = document.querySelector('[data-product-json]');
    
    if (productJson) {
      try {
        const productData = JSON.parse(productJson.textContent);
        this.variants = productData.variants || [];
        this.options = productData.options || [];
      } catch (e) {
        console.error('Failed to parse product data:', e);
      }
    }

    // Fallback: try to get from data attribute
    if (!this.variants.length && this.dataset.variants) {
      try {
        this.variants = JSON.parse(this.dataset.variants);
      } catch (e) {
        console.error('Failed to parse variants from data attribute:', e);
      }
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    this.optionInputs.forEach(input => {
      input.addEventListener('change', this.handleOptionChange.bind(this));
    });
  }

  /**
   * Handle option change
   * @param {Event} event
   */
  handleOptionChange(event) {
    const newVariant = this.getSelectedVariant();
    
    if (!newVariant) {
      this.handleUnavailableVariant();
      return;
    }

    if (newVariant.id !== this.currentVariant?.id) {
      this.currentVariant = newVariant;
      this.updateUI();
      this.dispatchVariantChange();
    }
  }

  /**
   * Get currently selected variant based on option selections
   * @returns {Object|null}
   */
  getSelectedVariant() {
    const selectedOptions = this.getSelectedOptions();
    
    return this.variants.find(variant => {
      return variant.options.every((option, index) => {
        return option === selectedOptions[index];
      });
    });
  }

  /**
   * Get currently selected options
   * @returns {string[]}
   */
  getSelectedOptions() {
    return this.optionInputs.map(input => {
      if (input.type === 'radio') {
        const checked = this.querySelector(`input[name="${input.name}"]:checked`);
        return checked ? checked.value : '';
      }
      return input.value;
    });
  }

  /**
   * Update UI elements based on current variant
   */
  updateUI() {
    if (!this.currentVariant) return;

    // Update hidden variant ID input
    this.updateVariantIdInput();

    // Update price
    this.updatePrice();

    // Update availability
    this.updateAvailability();

    // Update SKU
    this.updateSKU();

    // Update add to cart button
    this.updateAddToCartButton();

    // Update gallery if variant has specific image
    this.updateGallery();

    // Update URL
    this.updateURL();

    // Update option availability (disable unavailable combinations)
    this.updateOptionAvailability();
  }

  /**
   * Update hidden variant ID input
   */
  updateVariantIdInput() {
    const variantIdInput = document.querySelector('[data-product-variant-id]');
    
    if (variantIdInput) {
      variantIdInput.value = this.currentVariant.id;
    }
  }

  /**
   * Update price display
   */
  updatePrice() {
    const priceElements = document.querySelectorAll('[data-product-price]');
    const comparePriceElements = document.querySelectorAll('[data-product-compare-price]');
    const priceWrappers = document.querySelectorAll('[data-price-wrapper]');

    const price = this.currentVariant.price;
    const compareAtPrice = this.currentVariant.compare_at_price;
    
    // Format price (assuming Shopify.formatMoney is available)
    const formatMoney = window.Shopify?.formatMoney || ((cents) => `$${(cents / 100).toFixed(2)}`);

    priceElements.forEach(el => {
      el.textContent = formatMoney(price);
      
      // Add/remove sale class
      if (compareAtPrice && compareAtPrice > price) {
        el.classList.add('text-red-600', 'font-bold');
      } else {
        el.classList.remove('text-red-600', 'font-bold');
      }
    });

    comparePriceElements.forEach(el => {
      if (compareAtPrice && compareAtPrice > price) {
        el.textContent = formatMoney(compareAtPrice);
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    // Update price wrapper visibility
    priceWrappers.forEach(wrapper => {
      if (compareAtPrice && compareAtPrice > price) {
        wrapper.classList.add('on-sale');
      } else {
        wrapper.classList.remove('on-sale');
      }
    });
  }

  /**
   * Update availability status
   */
  updateAvailability() {
    const availabilityElements = document.querySelectorAll('[data-product-availability]');
    const available = this.currentVariant.available;

    availabilityElements.forEach(el => {
      if (available) {
        el.textContent = el.dataset.availableText || 'In stock';
        el.classList.remove('text-red-600');
        el.classList.add('text-green-600');
      } else {
        el.textContent = el.dataset.unavailableText || 'Out of stock';
        el.classList.remove('text-green-600');
        el.classList.add('text-red-600');
      }
    });
  }

  /**
   * Update SKU display
   */
  updateSKU() {
    const skuElements = document.querySelectorAll('[data-product-sku]');
    const sku = this.currentVariant.sku;

    skuElements.forEach(el => {
      if (sku) {
        el.textContent = sku;
        el.closest('[data-sku-wrapper]')?.classList.remove('hidden');
      } else {
        el.closest('[data-sku-wrapper]')?.classList.add('hidden');
      }
    });
  }

  /**
   * Update add to cart button state
   */
  updateAddToCartButton() {
    const buttons = document.querySelectorAll('[data-add-to-cart-button]');
    const available = this.currentVariant.available;

    buttons.forEach(button => {
      if (available) {
        button.disabled = false;
        button.textContent = button.dataset.availableText || 'Add to Cart';
      } else {
        button.disabled = true;
        button.textContent = button.dataset.unavailableText || 'Sold Out';
      }
    });
  }

  /**
   * Update gallery to show variant image
   */
  updateGallery() {
    if (!this.currentVariant.featured_media) return;

    const gallery = document.querySelector('product-gallery-component');
    
    if (gallery) {
      // Dispatch event to gallery
      const event = new CustomEvent('variant:selected', {
        detail: {
          variant: this.currentVariant,
          media: this.currentVariant
        },
        bubbles: true
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Update URL with selected variant
   */
  updateURL() {
    if (!this.currentVariant) return;

    const url = new URL(window.location.href);
    url.searchParams.set('variant', this.currentVariant.id);
    
    // Update URL without page reload
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * Update option availability (disable unavailable combinations)
   */
  updateOptionAvailability() {
    const selectedOptions = this.getSelectedOptions();

    this.optionInputs.forEach((input, optionIndex) => {
      if (input.tagName === 'SELECT') {
        // For selects, disable unavailable options
        Array.from(input.options).forEach(option => {
          const testOptions = [...selectedOptions];
          testOptions[optionIndex] = option.value;
          
          const isAvailable = this.isOptionCombinationAvailable(testOptions);
          option.disabled = !isAvailable;
        });
      } else if (input.type === 'radio') {
        // For radio buttons, disable unavailable options
        const radios = this.querySelectorAll(`input[name="${input.name}"]`);
        
        radios.forEach(radio => {
          const testOptions = [...selectedOptions];
          testOptions[optionIndex] = radio.value;
          
          const isAvailable = this.isOptionCombinationAvailable(testOptions);
          radio.disabled = !isAvailable;
          
          // Update visual state
          const label = radio.closest('label') || document.querySelector(`label[for="${radio.id}"]`);
          if (label) {
            if (isAvailable) {
              label.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
              label.classList.add('opacity-50', 'cursor-not-allowed');
            }
          }
        });
      }
    });
  }

  /**
   * Check if option combination is available
   * @param {string[]} options
   * @returns {boolean}
   */
  isOptionCombinationAvailable(options) {
    return this.variants.some(variant => {
      return variant.available && variant.options.every((opt, i) => opt === options[i]);
    });
  }

  /**
   * Handle unavailable variant selection
   */
  handleUnavailableVariant() {
    // Show error message
    const errorContainer = document.querySelector('[data-variant-error]');
    
    if (errorContainer) {
      errorContainer.textContent = 'This variant combination is not available';
      errorContainer.classList.remove('hidden');
      
      setTimeout(() => {
        errorContainer.classList.add('hidden');
      }, 3000);
    }

    // Announce to screen readers
    this.announceToScreenReader('Selected variant combination is not available');

    // Disable add to cart
    const buttons = document.querySelectorAll('[data-add-to-cart-button]');
    buttons.forEach(button => {
      button.disabled = true;
      button.textContent = 'Unavailable';
    });
  }

  /**
   * Dispatch variant change event
   */
  dispatchVariantChange() {
    const event = new CustomEvent('variant:changed', {
      detail: {
        variant: this.currentVariant
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);

    // Also dispatch to document for other components
    document.dispatchEvent(new CustomEvent('variant:selected', {
      detail: {
        variant: this.currentVariant,
        media: this.currentVariant
      },
      bubbles: true
    }));

    // Announce to screen readers
    const optionNames = this.currentVariant.options.join(', ');
    this.announceToScreenReader(`Selected variant: ${optionNames}`);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.optionInputs.forEach(input => {
      input.removeEventListener('change', this.handleOptionChange);
    });
  }
}

// Register the custom element
if (!customElements.get('variant-selector-component')) {
  customElements.define('variant-selector-component', VariantSelectorComponent);
}

export { VariantSelectorComponent };

