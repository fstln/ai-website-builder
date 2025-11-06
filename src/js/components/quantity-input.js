/**
 * Quantity Input Web Component
 * A reusable quantity selector with increment/decrement buttons.
 * 
 * @extends HTMLElement
 */
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = null;
    this.minusBtn = null;
    this.plusBtn = null;
    this.min = 1;
    this.max = null;
    this.disabled = false;
  }

  connectedCallback() {
    // Get elements
    this.input = this.querySelector('[data-quantity-input]');
    this.minusBtn = this.querySelector('[data-quantity-minus]');
    this.plusBtn = this.querySelector('[data-quantity-plus]');

    if (!this.input || !this.minusBtn || !this.plusBtn) {
      console.error('QuantityInput: Required elements not found');
      return;
    }

    // Get configuration
    this.min = parseInt(this.dataset.min || this.input.min || '1', 10);
    this.max = this.dataset.max ? parseInt(this.dataset.max, 10) : (this.input.max ? parseInt(this.input.max, 10) : null);
    this.disabled = this.dataset.disabled === 'true' || this.input.disabled;

    // Attach event listeners
    this.minusBtn.addEventListener('click', this.decrease.bind(this));
    this.plusBtn.addEventListener('click', this.increase.bind(this));
    this.input.addEventListener('change', this.handleChange.bind(this));
    this.input.addEventListener('input', this.updateButtons.bind(this));

    // Initial state
    this.updateButtons();
  }

  decrease() {
    const value = parseInt(this.input.value, 10) || 0;
    const min = parseInt(this.input.min, 10) || this.min;
    
    if (value > min) {
      this.input.value = value - 1;
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
      this.updateButtons();
    }
  }

  increase() {
    console.log('[QuantityInput] Increase button clicked');
    const value = parseInt(this.input.value, 10) || 0;
    const max = this.input.max ? parseInt(this.input.max, 10) : this.max;
    
    console.log('[QuantityInput] Current value:', value, 'Max:', max);
    
    if (max === null || value < max) {
      this.input.value = value + 1;
      console.log('[QuantityInput] New value:', this.input.value);
      console.log('[QuantityInput] Dispatching change event, bubbles: true');
      this.input.dispatchEvent(new Event('change', { bubbles: true }));
      this.updateButtons();
    } else {
      console.log('[QuantityInput] Cannot increase - at max value');
    }
  }

  handleChange() {
    let value = parseInt(this.input.value, 10);
    const min = parseInt(this.input.min, 10) || this.min;
    const max = this.input.max ? parseInt(this.input.max, 10) : this.max;

    if (isNaN(value)) {
      value = min;
    }
    if (value < min) {
      value = min;
    }
    if (max !== null && value > max) {
      value = max;
    }
    
    this.input.value = value;
    this.updateButtons();
  }

  updateButtons() {
    const value = parseInt(this.input.value, 10) || 0;
    const min = parseInt(this.input.min, 10) || this.min;
    const max = this.input.max ? parseInt(this.input.max, 10) : this.max;
    
    this.minusBtn.disabled = this.disabled || value <= min;
    this.plusBtn.disabled = this.disabled || (max !== null && value >= max);
    this.input.disabled = this.disabled;
  }
}

if (!customElements.get('quantity-input')) {
  customElements.define('quantity-input', QuantityInput);
}

export { QuantityInput };

