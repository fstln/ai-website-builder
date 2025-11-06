/**
 * Base Component class following Horizon's pattern
 * Provides ref management and common utilities
 * Event handling is done via global event delegation (see registerEventListeners below)
 * 
 * @template {Record<string, HTMLElement | HTMLElement[]>} [Refs={}]
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
    // Register global event listeners (only once)
    registerEventListeners();
    
    // Collect refs
    this.#collectRefs();
    
    // Validate required refs
    this.#validateRequiredRefs();
  }

  disconnectedCallback() {
    // Cleanup is handled by subclasses if needed
  }

  /**
   * Collect all elements with ref attribute
   * @private
   */
  #collectRefs() {
    const elements = this.querySelectorAll('[ref]');
    
    // Clear existing refs
    this.refs = /** @type {Refs} */ ({});
    
    elements.forEach((element) => {
      const refName = element.getAttribute('ref');
      if (!refName) return;

      // Handle array refs (ref="items[]")
      if (refName.endsWith('[]')) {
        const key = refName.slice(0, -2);
        if (!this.refs[key]) {
          this.refs[key] = [];
        }
        this.refs[key].push(/** @type {any} */ (element));
      } else {
        this.refs[refName] = /** @type {any} */ (element);
      }
    });
  }

  /**
   * Validate that all required refs are present
   * @private
   */
  #validateRequiredRefs() {
    if (!this.requiredRefs || this.requiredRefs.length === 0) return;

    const missing = this.requiredRefs.filter(ref => !this.refs[ref]);
    
    if (missing.length > 0) {
      console.error(`Missing required refs in ${this.constructor.name}:`, missing);
    }
  }

  /**
   * Query selector helper
   * @param {string} selector
   * @returns {HTMLElement | null}
   */
  $(selector) {
    return this.querySelector(selector);
  }

  /**
   * Query selector all helper
   * @param {string} selector
   * @returns {NodeListOf<HTMLElement>}
   */
  $$(selector) {
    return this.querySelectorAll(selector);
  }

  /**
   * Emit a custom event
   * @param {string} eventName
   * @param {any} [detail]
   * @param {boolean} [bubbles=true]
   */
  emit(eventName, detail, bubbles = true) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles,
      composed: true
    });
    this.dispatchEvent(event);
  }

  /**
   * Announce to screen readers
   * @param {string} message
   * @param {string} [priority='polite']
   */
  announceToScreenReader(message, priority = 'polite') {
    const liveRegion = this.#getOrCreateLiveRegion(priority);
    liveRegion.textContent = message;
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }

  /**
   * Get or create ARIA live region
   * @private
   * @param {string} priority
   * @returns {HTMLElement}
   */
  #getOrCreateLiveRegion(priority) {
    const selector = `[data-live-region="${priority}"]`;
    let region = document.querySelector(selector);
    
    if (!region) {
      region = document.createElement('div');
      region.setAttribute('data-live-region', priority);
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      document.body.appendChild(region);
    }
    
    return /** @type {HTMLElement} */ (region);
  }

  /**
   * Debounce a function
   * @param {Function} func
   * @param {number} wait
   * @returns {Function}
   */
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Throttle a function
   * @param {Function} func
   * @param {number} limit
   * @returns {Function}
   */
  throttle(func, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

/**
 * Get the closest Component instance from an element
 * @param {Element} element
 * @returns {Component | null}
 */
function getClosestComponent(element) {
  let current = element.parentElement;
  
  while (current) {
    if (current instanceof Component) {
      return current;
    }
    current = current.parentElement;
  }
  
  return null;
}

/**
 * Global event delegation system following Horizon's pattern
 * Registers event listeners once at the document level
 */
let initialized = false;

function registerEventListeners() {
  if (initialized) return;
  initialized = true;

  const events = ['click', 'change', 'select', 'focus', 'blur', 'submit', 'input', 'keydown', 'keyup'];
  const shouldBubble = ['focus', 'blur'];

  for (const eventName of events) {
    const attribute = `on:${eventName}`;

    document.addEventListener(
      eventName,
      (event) => {
        const element = getEventElement(event, eventName, shouldBubble);
        
        if (!element) return;

        const value = element.getAttribute(attribute) ?? '';
        
        // Parse: "/method" or "selector/method" or "/method/arg1/arg2"
        const parts = value.split('/').filter(Boolean);
        
        if (parts.length === 0) return;
        
        // Check if first part is a selector or method name
        let selector = null;
        let methodName = parts[0];
        let args = parts.slice(1);
        
        // If it contains a dot or starts with # or ., it's a selector
        if (methodName.includes('.') || methodName.startsWith('#') || methodName.startsWith('[')) {
          selector = methodName;
          methodName = parts[1];
          args = parts.slice(2);
        }
        
        // Find the component instance
        const instance = selector
          ? (selector.startsWith('#') 
              ? document.querySelector(selector)
              : element.closest(selector))
          : getClosestComponent(element);

        if (!(instance instanceof Component) || !methodName) return;

        const callback = /** @type {any} */ (instance)[methodName];

        if (typeof callback === 'function') {
          try {
            callback.call(instance, event, ...args);
          } catch (error) {
            console.error(`Error calling ${methodName} on ${instance.constructor.name}:`, error);
          }
        } else {
          console.error(`Method ${methodName} not found on component ${instance.constructor.name}`);
        }
      },
      { capture: true }
    );
  }
}

/**
 * Get the element that triggered the event
 * @param {Event} event
 * @param {string} eventType
 * @param {string[]} shouldBubble
 * @returns {Element | null}
 */
function getEventElement(event, eventType, shouldBubble) {
  const target = event.composedPath?.()[0] ?? event.target;

  if (!(target instanceof Element)) return null;

  // Check if the target itself has the attribute
  if (target.hasAttribute(`on:${eventType}`)) {
    return target;
  }

  // For bubbling events, find the closest element with the attribute
  if (event.bubbles || shouldBubble.includes(eventType)) {
    return target.closest(`[on\\:${eventType}]`);
  }

  return null;
}
