import { Component } from '../utils/component-base.js';
import { QuantitySelectorUpdateEvent } from '../utils/events.js';

/**
 * Base Quantity Selector Component following Horizon pattern
 * 
 * @typedef {Object} Refs
 * @property {HTMLInputElement} quantityInput
 * @property {HTMLButtonElement} minusButton
 * @property {HTMLButtonElement} plusButton
 * 
 * @extends {Component<Refs>}
 */
export class QuantitySelectorComponent extends Component {
  requiredRefs = ['quantityInput', 'minusButton', 'plusButton'];
  serverDisabledMinus = false;
  serverDisabledPlus = false;
  initialized = false;

  connectedCallback() {
    super.connectedCallback();

    // Capture server-disabled state on first load
    const { minusButton, plusButton } = this.refs;

    if (minusButton && minusButton.disabled) {
      this.serverDisabledMinus = true;
    }
    if (plusButton && plusButton.disabled) {
      this.serverDisabledPlus = true;
    }

    this.initialized = true;
    this.updateButtonStates();
  }

  /**
   * Decrease quantity
   * @param {Event} event
   */
  decreaseQuantity(event) {
    event?.preventDefault();
    const { min, value, step } = this.getCurrentValues();
    const newValue = Math.max(min, value - step);
    
    if (newValue !== value) {
      this.setQuantity(newValue);
    }
  }

  /**
   * Increase quantity
   * @param {Event} event
   */
  increaseQuantity(event) {
    event?.preventDefault();
    const { value, step } = this.getCurrentValues();
    const effectiveMax = this.getEffectiveMax();
    const newValue = value + step;
    
    if (effectiveMax === null || newValue <= effectiveMax) {
      this.setQuantity(newValue);
    }
  }

  /**
   * Set quantity value and dispatch event
   * @param {number} quantity
   */
  setQuantity(quantity) {
    const { quantityInput } = this.refs;
    const { min } = this.getCurrentValues();
    const effectiveMax = this.getEffectiveMax();

    // Clamp value
    let newValue = Math.max(min, quantity);
    if (effectiveMax !== null) {
      newValue = Math.min(newValue, effectiveMax);
    }

    quantityInput.value = newValue.toString();
    this.updateButtonStates();

    // Dispatch event for cart items component to listen
    const cartLine = quantityInput.getAttribute('data-cart-line');
    document.dispatchEvent(QuantitySelectorUpdateEvent({
      quantity: newValue,
      cartLine: cartLine ? parseInt(cartLine, 10) : undefined,
      variantId: this.dataset.variantId
    }));
  }

  /**
   * Handle blur event - validate and snap to valid value
   * @param {Event} event
   */
  validateQuantity(event) {
    const { quantityInput } = this.refs;
    const value = parseInt(quantityInput.value, 10);
    
    if (!isNaN(value)) {
      this.setQuantity(value);
    }
  }

  /**
   * Select input value on focus
   * @param {Event} event
   */
  selectInputValue(event) {
    const { quantityInput } = this.refs;
    quantityInput.select();
  }

  /**
   * Get current values from DOM
   * @returns {{min: number, max: number|null, step: number, value: number, cartQuantity: number}}
   */
  getCurrentValues() {
    const { quantityInput } = this.refs;
    return {
      min: parseInt(quantityInput.min) || 1,
      max: quantityInput.max ? parseInt(quantityInput.max) : null,
      step: parseInt(quantityInput.step) || 1,
      value: parseInt(quantityInput.value) || 0,
      cartQuantity: parseInt(quantityInput.getAttribute('data-cart-quantity') || '0'),
    };
  }

  /**
   * Get effective maximum value
   * Product page: max - cartQuantity (how many can be added)
   * Override in subclass for different behavior
   * @returns {number | null}
   */
  getEffectiveMax() {
    const { max, cartQuantity, min } = this.getCurrentValues();
    if (max === null) return null;
    // Product page: can only add what's left
    return Math.max(max - cartQuantity, min);
  }

  /**
   * Update button states based on current value
   */
  updateButtonStates() {
    if (!this.initialized) return;

    const { minusButton, plusButton } = this.refs;
    if (!minusButton || !plusButton) return;

    const { min, value } = this.getCurrentValues();
    const effectiveMax = this.getEffectiveMax();

    // Update minus button
    if (!this.serverDisabledMinus) {
      minusButton.disabled = value <= min;
    }

    // Update plus button
    if (!this.serverDisabledPlus) {
      plusButton.disabled = effectiveMax !== null && value >= effectiveMax;
    }
  }

  /**
   * Update cart quantity attribute
   */
  updateCartQuantity() {
    this.updateButtonStates();
  }
}

if (!customElements.get('quantity-selector-component')) {
  customElements.define('quantity-selector-component', QuantitySelectorComponent);
}
