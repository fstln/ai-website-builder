/**
 * Product Form Module
 * Handles product variant selection and quantity selection
 */

export function initProduct() {
  const productForms = document.querySelectorAll('[data-product-form]');
  
  productForms.forEach(form => {
    setupProductForm(form);
  });
}

/**
 * Setup product form
 */
function setupProductForm(form) {
  const variantSelects = form.querySelectorAll('select[name^="options"]');
  
  // Listen for variant selection changes
  variantSelects.forEach(select => {
    select.addEventListener('change', () => {
      updateVariant(form);
    });
  });
  
  // Initialize variant
  updateVariant(form);
}

/**
 * Update selected variant
 */
function updateVariant(form) {
  // Get all option values
  const options = Array.from(form.querySelectorAll('select[name^="options"]'))
    .map(select => select.value);
  
  // Simplified handling - in full implementation, should match correct variant based on options
  // In complete implementation, need to find matching variant from product data
  const variantIdInput = form.querySelector('input[name="id"]');
  
  // Check if variant is available
  const submitButton = form.querySelector('button[type="submit"]');
  // Simplified handling - in full implementation, need to check variant inventory
  if (submitButton && variantIdInput) {
    submitButton.disabled = !variantIdInput.value;
  }
}

/**
 * Get product data (if product JSON is embedded in page)
 */
export function getProductData() {
  const productScript = document.querySelector('[data-product-json]');
  if (productScript) {
    try {
      return JSON.parse(productScript.textContent);
    } catch (error) {
      console.error('Error parsing product JSON:', error);
      return null;
    }
  }
  return null;
}

/**
 * Web Component Example: Product Card
 * Prioritize native JavaScript Web Components
 */
if (typeof customElements !== 'undefined') {
  class ProductCard extends HTMLElement {
    connectedCallback() {
      this.render();
      this.attachEventListeners();
    }
    
    render() {
      const productData = this.dataset.product;
      if (!productData) return;
      
      try {
        const product = JSON.parse(productData);
        // Render product card content
        // In actual implementation, should use Liquid template to generate HTML
        // Web Component is mainly for interaction logic
      } catch (error) {
        console.error('Error rendering product card:', error);
      }
    }
    
    attachEventListeners() {
      const addToCartBtn = this.querySelector('[data-add-to-cart]');
      if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleAddToCart();
        });
      }
    }
    
    async handleAddToCart() {
      const productId = this.dataset.productId;
      const quantity = this.dataset.quantity || 1;
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: productId,
            quantity: parseInt(quantity)
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }
        
        // Trigger custom event
        this.dispatchEvent(new CustomEvent('product-added-to-cart', {
          bubbles: true,
          detail: { productId, quantity }
        }));
      } catch (error) {
        console.error('Add to cart error:', error);
      }
    }
  }
  
  // Register custom element
  if (!customElements.get('product-card')) {
    customElements.define('product-card', ProductCard);
  }
}

