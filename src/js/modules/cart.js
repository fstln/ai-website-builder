/**
 * Cart Functionality Module
 * Handles cart add, update, and remove operations
 */

export function initCart() {
  // Cart icon and count
  const cartIcon = document.querySelector('[data-cart-icon]');
  const cartCount = document.querySelector('[data-cart-count]');
  
  // Cart form
  const cartForm = document.querySelector('[data-cart-form]');
  if (cartForm) {
    setupCartForm(cartForm);
  }
  
  // Listen for add to cart events
  document.addEventListener('submit', async (e) => {
    if (e.target.matches('[data-product-form]')) {
      e.preventDefault();
      await addToCart(e.target);
    }
  });
  
  // Listen for remove item events
  document.addEventListener('click', async (e) => {
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      e.preventDefault();
      const itemKey = removeBtn.dataset.cartRemove;
      await removeFromCart(itemKey);
    }
  });
}

/**
 * Add item to cart
 */
async function addToCart(form) {
  const formData = new FormData(form);
  
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }
    
    const item = await response.json();
    
    // Update cart count
    await updateCartCount();
    
    // Show success message
    showNotification('Item added to cart');
    
    return item;
  } catch (error) {
    console.error('Add to cart error:', error);
    showNotification('Failed to add item. Please try again.', 'error');
  }
}

/**
 * Remove item from cart
 */
async function removeFromCart(itemKey) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: itemKey,
        quantity: 0
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove from cart');
    }
    
    // Reload page to update cart
    window.location.reload();
  } catch (error) {
    console.error('Remove from cart error:', error);
    showNotification('Failed to remove item. Please try again.', 'error');
  }
}

/**
 * Setup cart form
 */
function setupCartForm(form) {
  // Listen for quantity changes
  const quantityInputs = form.querySelectorAll('[data-quantity-input]');
  quantityInputs.forEach(input => {
    input.addEventListener('change', () => {
      // Auto-submit form update
      form.querySelector('[name="update"]')?.click();
    });
  });
}

/**
 * Update cart count display
 */
async function updateCartCount() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    
    const cartCountElements = document.querySelectorAll('[data-cart-count]');
    cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
    });
  } catch (error) {
    console.error('Update cart count error:', error);
  }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'success') {
  // Simple notification implementation
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'error' ? 'bg-red-600' : 'bg-green-600'
  } text-white`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

