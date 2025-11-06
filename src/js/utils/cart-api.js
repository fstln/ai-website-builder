/**
 * @file cart-api.js
 * @description Utility functions for interacting with the Shopify Cart API
 */

/**
 * @typedef {Object} CartItem
 * @property {number} id - Variant ID
 * @property {number} variant_id - Variant ID
 * @property {string} product_id - Product ID
 * @property {string} title - Product title
 * @property {number} quantity - Item quantity
 * @property {number} price - Price in cents
 * @property {number} line_price - Total line price in cents
 * @property {number} final_price - Final price in cents
 * @property {number} final_line_price - Final line price in cents
 * @property {string} url - Product URL
 * @property {string} featured_image - Featured image object
 * @property {Object} image - Image object
 * @property {string} handle - Product handle
 * @property {boolean} requires_shipping - Whether item requires shipping
 * @property {string} product_type - Product type
 * @property {string} product_title - Product title
 * @property {string} variant_title - Variant title
 * @property {string} vendor - Product vendor
 * @property {Object} properties - Line item properties
 * @property {number} key - Line item key
 */

/**
 * @typedef {Object} Cart
 * @property {string} token - Cart token
 * @property {string} note - Cart note
 * @property {Object} attributes - Cart attributes
 * @property {number} total_price - Total price in cents
 * @property {number} total_weight - Total weight in grams
 * @property {number} item_count - Total item count
 * @property {CartItem[]} items - Array of cart items
 * @property {boolean} requires_shipping - Whether cart requires shipping
 * @property {string} currency - Currency code
 * @property {number} items_subtotal_price - Subtotal price in cents
 * @property {number} cart_level_discount_applications - Cart level discounts
 */

/**
 * Creates a fetch configuration object for Cart API calls
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} [body] - Request body
 * @returns {RequestInit} Fetch configuration object
 */
function fetchConfig(method = 'POST', body = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  return config;
}

/**
 * Gets the current cart state
 * @returns {Promise<Cart>} The current cart
 * @throws {Error} If the fetch fails
 */
export async function getCart() {
  try {
    const response = await fetch('/cart.js');
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

/**
 * Adds an item to the cart
 * @param {Object} item - Item to add
 * @param {number} item.id - Variant ID
 * @param {number} [item.quantity=1] - Quantity to add
 * @param {Object} [item.properties] - Line item properties
 * @returns {Promise<CartItem>} The added cart item
 * @throws {Error} If the add fails
 */
export async function addToCart(item) {
  try {
    const response = await fetch('/cart/add.js', fetchConfig('POST', {
      items: [item]
    }));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to add item to cart');
    }

    const result = await response.json();
    return result.items?.[0] || result;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Updates a cart item quantity by line key
 * @param {string|number} line - Line item key or index (1-based)
 * @param {number} quantity - New quantity (0 to remove)
 * @returns {Promise<Cart>} Updated cart
 * @throws {Error} If the update fails
 */
export async function updateCartItem(line, quantity) {
  try {
    const body = {
      line,
      quantity
    };

    const response = await fetch('/cart/change.js', fetchConfig('POST', body));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to update cart item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

/**
 * Updates multiple cart items at once
 * @param {Object} updates - Object with line keys/indices as keys and quantities as values
 * @returns {Promise<Cart>} Updated cart
 * @throws {Error} If the update fails
 */
export async function updateCart(updates) {
  try {
    const response = await fetch('/cart/update.js', fetchConfig('POST', { updates }));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to update cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

/**
 * Removes an item from the cart by line key
 * @param {string|number} line - Line item key or index (1-based)
 * @returns {Promise<Cart>} Updated cart
 */
export async function removeFromCart(line) {
  return updateCartItem(line, 0);
}

/**
 * Clears the entire cart
 * @returns {Promise<Cart>} Empty cart
 * @throws {Error} If the clear fails
 */
export async function clearCart() {
  try {
    const response = await fetch('/cart/clear.js', fetchConfig('POST'));

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

/**
 * Updates cart attributes
 * @param {Object} attributes - Attributes to set
 * @returns {Promise<Cart>} Updated cart
 * @throws {Error} If the update fails
 */
export async function updateCartAttributes(attributes) {
  try {
    const response = await fetch('/cart/update.js', fetchConfig('POST', { attributes }));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to update cart attributes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating cart attributes:', error);
    throw error;
  }
}

/**
 * Updates cart note
 * @param {string} note - Cart note
 * @returns {Promise<Cart>} Updated cart
 * @throws {Error} If the update fails
 */
export async function updateCartNote(note) {
  try {
    const response = await fetch('/cart/update.js', fetchConfig('POST', { note }));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.description || 'Failed to update cart note');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating cart note:', error);
    throw error;
  }
}

/**
 * Gets the cart item count
 * @returns {Promise<number>} Total item count
 */
export async function getCartItemCount() {
  try {
    const cart = await getCart();
    return cart.item_count;
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return 0;
  }
}

/**
 * Cart API event names
 */
export const CartEvents = {
  UPDATED: 'cart:updated',
  ITEM_ADDED: 'cart:item-added',
  ITEM_REMOVED: 'cart:item-removed',
  ERROR: 'cart:error'
};

/**
 * Dispatches a cart event
 * @param {string} eventName - Event name from CartEvents
 * @param {Object} detail - Event detail data
 */
export function dispatchCartEvent(eventName, detail = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    composed: true
  });
  document.dispatchEvent(event);
}

