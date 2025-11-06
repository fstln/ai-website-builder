/**
 * Theme Events - Custom event types following Horizon pattern
 */

export const ThemeEvents = {
  cartUpdate: 'theme:cart:update',
  cartAdd: 'theme:cart:add',
  quantitySelectorUpdate: 'theme:quantity-selector:update',
  discountUpdate: 'theme:discount:update',
  variantChange: 'theme:variant:change',
  variantSelected: 'theme:variant:selected',
  variantUpdate: 'theme:variant:update',
};

/**
 * @typedef {Object} CartUpdateEventDetail
 * @property {Object} cart - Cart object
 * @property {number} itemCount - Total item count
 * @property {string} [source] - Source component that triggered the update
 */

/**
 * Cart Update Event
 * @param {CartUpdateEventDetail} detail
 * @returns {CustomEvent<CartUpdateEventDetail>}
 */
export function CartUpdateEvent(detail) {
  return new CustomEvent(ThemeEvents.cartUpdate, {
    detail,
    bubbles: true,
    composed: true
  });
}

/**
 * @typedef {Object} QuantitySelectorUpdateEventDetail
 * @property {number} quantity - New quantity value
 * @property {number} [cartLine] - Cart line index (1-based)
 * @property {string} [variantId] - Variant ID
 */

/**
 * Quantity Selector Update Event
 * @param {QuantitySelectorUpdateEventDetail} detail
 * @returns {CustomEvent<QuantitySelectorUpdateEventDetail>}
 */
export function QuantitySelectorUpdateEvent(detail) {
  return new CustomEvent(ThemeEvents.quantitySelectorUpdate, {
    detail,
    bubbles: true,
    composed: true
  });
}

/**
 * @typedef {Object} CartAddEventDetail
 * @property {Object} item - Added item
 * @property {number} quantity - Quantity added
 */

/**
 * Cart Add Event
 * @param {CartAddEventDetail} detail
 * @returns {CustomEvent<CartAddEventDetail>}
 */
export function CartAddEvent(detail) {
  return new CustomEvent(ThemeEvents.cartAdd, {
    detail,
    bubbles: true,
    composed: true
  });
}

/**
 * @typedef {Object} DiscountUpdateEventDetail
 * @property {string} code - Discount code
 * @property {boolean} applied - Whether discount was applied
 */

/**
 * Discount Update Event
 * @param {DiscountUpdateEventDetail} detail
 * @returns {CustomEvent<DiscountUpdateEventDetail>}
 */
export function DiscountUpdateEvent(detail) {
  return new CustomEvent(ThemeEvents.discountUpdate, {
    detail,
    bubbles: true,
    composed: true
  });
}

/**
 * @typedef {Object} VariantSelectedEventDetail
 * @property {string} optionValueId - Option value ID that was selected
 * @property {string} [source] - Source component
 */

/**
 * Variant Selected Event (before fetch)
 * @param {VariantSelectedEventDetail} detail
 * @returns {CustomEvent<VariantSelectedEventDetail>}
 */
export function VariantSelectedEvent(detail) {
  return new CustomEvent(ThemeEvents.variantSelected, {
    detail,
    bubbles: true,
    composed: true
  });
}

/**
 * @typedef {Object} VariantUpdateEventDetail
 * @property {Object} variant - Updated variant object
 * @property {string} [productId] - Product ID
 * @property {Document} [html] - Updated HTML document
 * @property {string} [source] - Source component
 */

/**
 * Variant Update Event (after fetch)
 * @param {VariantUpdateEventDetail} detail
 * @returns {CustomEvent<VariantUpdateEventDetail>}
 */
export function VariantUpdateEvent(detail) {
  return new CustomEvent(ThemeEvents.variantUpdate, {
    detail,
    bubbles: true,
    composed: true
  });
}
