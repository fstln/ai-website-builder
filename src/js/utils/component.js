/**
 * Base Component class with refs system
 * Based on Horizon's component framework
 * 
 * @template {Object} Refs
 */
export class Component extends HTMLElement {
  /**
   * @type {Refs}
   */
  refs = /** @type {Refs} */ ({});

  /**
   * @type {string[]}
   */
  requiredRefs = [];

  connectedCallback() {
    this.collectRefs();
    this.validateRequiredRefs();
  }

  disconnectedCallback() {
    // Cleanup hook for subclasses
  }

  /**
   * Collects all elements with ref attribute
   */
  collectRefs() {
    const elements = this.querySelectorAll('[ref]');
    
    elements.forEach((element) => {
      const refName = element.getAttribute('ref');
      if (!refName) return;

      // Handle array refs (ref="items[]")
      if (refName.endsWith('[]')) {
        const arrayName = refName.slice(0, -2);
        if (!this.refs[arrayName]) {
          this.refs[arrayName] = [];
        }
        this.refs[arrayName].push(element);
      } else {
        this.refs[refName] = element;
      }
    });

    // Attach event handlers using on:event="/methodName" pattern
    this.attachEventHandlers();
  }

  /**
   * Attaches event handlers based on on:event attributes
   */
  attachEventHandlers() {
    const elementsWithHandlers = this.querySelectorAll('[on\\:click], [on\\:change], [on\\:input], [on\\:blur], [on\\:focus]');
    
    elementsWithHandlers.forEach((element) => {
      const attributes = element.attributes;
      
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        
        if (attr.name.startsWith('on:')) {
          const eventName = attr.name.slice(3); // Remove 'on:' prefix
          const handlerPath = attr.value;
          
          // Parse handler path (e.g., "/methodName" or "/methodName/arg1/arg2")
          const parts = handlerPath.split('/').filter(p => p);
          const methodName = parts[0];
          const args = parts.slice(1);
          
          if (typeof this[methodName] === 'function') {
            element.addEventListener(eventName, (event) => {
              this[methodName](event, ...args);
            });
          } else {
            console.warn(`Method ${methodName} not found on component`);
          }
        }
      }
    });
  }

  /**
   * Validates that all required refs are present
   */
  validateRequiredRefs() {
    const missing = this.requiredRefs.filter(refName => !this.refs[refName]);
    
    if (missing.length > 0) {
      console.error(
        `${this.constructor.name}: Missing required refs:`,
        missing
      );
    }
  }

  /**
   * Query selector helper
   * @param {string} selector
   * @returns {Element | null}
   */
  $(selector) {
    return this.querySelector(selector);
  }

  /**
   * Query selector all helper
   * @param {string} selector
   * @returns {NodeListOf<Element>}
   */
  $$(selector) {
    return this.querySelectorAll(selector);
  }

  /**
   * Dispatch a custom event
   * @param {string} eventName
   * @param {any} detail
   * @param {boolean} bubbles
   */
  emit(eventName, detail = {}, bubbles = true) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

