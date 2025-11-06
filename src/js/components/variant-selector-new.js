import { Component } from '../utils/component-base.js';
import { ThemeEvents } from '../utils/events.js';
import { sectionRenderer, morphSection } from '../utils/section-renderer.js';

/**
 * Variant Selector Component following Horizon pattern
 * Handles variant selection and updates product information
 * 
 * @extends {Component}
 */
export class VariantSelectorComponent extends Component {
  #pendingRequestUrl = null;
  #abortController = null;

  connectedCallback() {
    super.connectedCallback();

    // Load product data from script tag
    this.#loadProductData();

    // Listen for change events on variant inputs
    this.addEventListener('change', this.#variantChanged.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this.#abortController) {
      this.#abortController.abort();
    }
  }

  /**
   * Load product data from JSON script tag
   */
  #loadProductData() {
    const productScript = this.querySelector('[type="application/json"]');
    if (productScript) {
      try {
        this.productData = JSON.parse(productScript.textContent);
      } catch (error) {
        console.error('Failed to parse product data:', error);
      }
    }
  }

  /**
   * Handle variant change event
   * @param {Event} event
   */
  async #variantChanged(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    // Get selected option element
    const selectedOption = target instanceof HTMLSelectElement 
      ? target.options[target.selectedIndex] 
      : target;

    if (!selectedOption) return;

    // Update visual state
    this.#updateSelectedOption(target);

    // Dispatch variant selected event (before fetching)
    this.dispatchEvent(new CustomEvent(ThemeEvents.variantSelected, {
      detail: { 
        optionValueId: selectedOption.dataset.optionValueId || '',
        source: 'variant-selector-component'
      },
      bubbles: true,
      composed: true
    }));

    // Check if on product page
    const isOnProductPage = this.dataset.productPage === 'true' &&
      !this.closest('product-card') &&
      !this.closest('quick-add-dialog');

    // Build request URL
    const requestUrl = this.#buildRequestUrl(selectedOption);
    
    // Fetch updated section
    await this.#fetchUpdatedSection(requestUrl);

    // Update URL if on product page
    if (isOnProductPage) {
      const variantId = selectedOption.dataset.variantId;
      const url = new URL(window.location.href);
      
      if (variantId) {
        url.searchParams.set('variant', variantId);
      } else {
        url.searchParams.delete('variant');
      }

      if (url.href !== window.location.href) {
        history.replaceState({}, '', url.toString());
      }
    }
  }

  /**
   * Update selected option visual state
   * @param {Element} target
   */
  #updateSelectedOption(target) {
    // Handle radio buttons
    if (target instanceof HTMLInputElement && target.type === 'radio') {
      const container = target.closest('.variant-input');
      if (container) {
        // Remove selected class from siblings
        const siblings = container.parentElement?.querySelectorAll('.variant-input');
        siblings?.forEach(el => el.classList.remove('selected'));
        
        // Add selected class to current
        container.classList.add('selected');
      }
    }

    // Handle select dropdowns (already handled by browser)
  }

  /**
   * Build request URL for variant
   * @param {HTMLElement} selectedOption
   * @returns {string}
   */
  #buildRequestUrl(selectedOption) {
    const productUrl = this.dataset.productUrl?.split('?')[0];
    if (!productUrl) return '';

    const url = new URL(productUrl, window.location.origin);
    
    // Add variant ID if available
    const variantId = selectedOption.dataset.variantId;
    if (variantId) {
      url.searchParams.set('variant', variantId);
    }

    // Add section ID for section rendering
    const sectionId = this.dataset.sectionId;
    if (sectionId) {
      url.searchParams.set('section_id', sectionId);
    }

    return url.href;
  }

  /**
   * Fetch updated section HTML
   * @param {string} requestUrl
   */
  async #fetchUpdatedSection(requestUrl) {
    if (!requestUrl) return;

    // Cancel previous request
    if (this.#abortController) {
      this.#abortController.abort();
    }
    this.#abortController = new AbortController();

    // Skip if already pending this URL
    if (this.#pendingRequestUrl === requestUrl) return;
    this.#pendingRequestUrl = requestUrl;

    try {
      const response = await fetch(requestUrl, {
        signal: this.#abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract variant data from new HTML
      const newVariantSelector = doc.querySelector('variant-selector-component');
      const productScript = newVariantSelector?.querySelector('[type="application/json"]');
      
      if (productScript) {
        try {
          const productData = JSON.parse(productScript.textContent);
          const selectedVariant = productData.selected_or_first_available_variant;

          // Dispatch variant update event with full variant data
          this.dispatchEvent(new CustomEvent(ThemeEvents.variantUpdate, {
            detail: {
              variant: selectedVariant,
              productId: this.dataset.productId,
              html: doc,
              source: 'variant-selector-component'
            },
            bubbles: true,
            composed: true
          }));

        } catch (error) {
          console.error('Failed to parse variant data:', error);
        }
      }

      // Update this component's HTML if needed
      if (newVariantSelector) {
        this.innerHTML = newVariantSelector.innerHTML;
        // Re-load product data
        this.#loadProductData();
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Variant fetch aborted');
        return;
      }
      console.error('Failed to fetch variant:', error);
    } finally {
      this.#pendingRequestUrl = null;
      this.#abortController = null;
    }
  }

  /**
   * Update variant picker HTML (called from parent components)
   * @param {Document} html
   */
  updateVariantPicker(html) {
    const newVariantSelector = html.querySelector('variant-selector-component');
    if (newVariantSelector) {
      this.innerHTML = newVariantSelector.innerHTML;
      this.#loadProductData();
    }
  }

  /**
   * Update selected option programmatically
   * @param {string} optionValueId
   */
  updateSelectedOption(optionValueId) {
    // Find and select the matching option
    const radioInput = this.querySelector(`input[data-option-value-id="${optionValueId}"]`);
    if (radioInput instanceof HTMLInputElement) {
      radioInput.checked = true;
      this.#updateSelectedOption(radioInput);
      return;
    }

    // Handle select dropdown
    const select = this.querySelector('select');
    if (select) {
      const option = select.querySelector(`option[data-option-value-id="${optionValueId}"]`);
      if (option instanceof HTMLOptionElement) {
        select.value = option.value;
      }
    }
  }
}

if (!customElements.get('variant-selector-component')) {
  customElements.define('variant-selector-component', VariantSelectorComponent);
}

