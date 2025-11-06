/**
 * @file format-money.js
 * @description Utility functions for formatting money values in Shopify themes
 */

/**
 * Format money value using Shopify's money_format setting
 * This function is typically used with the window.theme.moneyFormat setting
 * which should be set in the theme's layout file from Liquid: {{ shop.money_format | json }}
 * 
 * @param {number} cents - Amount in cents
 * @param {string} [format] - Money format string (defaults to window.theme.moneyFormat or '${{amount}}')
 * @returns {string} Formatted money string
 * 
 * @example
 * formatMoney(1000); // "$10.00"
 * formatMoney(1000, '€{{amount_with_comma_separator}}'); // "€10,00"
 */
export function formatMoney(cents, format = null) {
  if (typeof cents === 'string') {
    cents = parseFloat(cents.replace(/[^\d.-]/g, ''));
  }

  if (isNaN(cents)) {
    return '';
  }

  const formatString = format || 
    (typeof window !== 'undefined' && window.theme?.moneyFormat) || 
    '${{amount}}';

  const value = (cents / 100).toFixed(2);
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatValue = (placeholder) => {
    switch (placeholder) {
      case 'amount':
        return formatWithDelimiters(value, 2);
      case 'amount_no_decimals':
        return formatWithDelimiters(value, 0);
      case 'amount_with_comma_separator':
        return formatWithDelimiters(value, 2, ',', '.');
      case 'amount_no_decimals_with_comma_separator':
        return formatWithDelimiters(value, 0, ',', '.');
      case 'amount_with_apostrophe_separator':
        return formatWithDelimiters(value, 2, "'", '.');
      case 'amount_no_decimals_with_space_separator':
        return formatWithDelimiters(value, 0, ' ', '.');
      case 'amount_with_space_separator':
        return formatWithDelimiters(value, 2, ' ', '.');
      default:
        return formatWithDelimiters(value, 2);
    }
  };

  return formatString.replace(placeholderRegex, (match, placeholder) => {
    return formatValue(placeholder);
  });
}

/**
 * Format a number with delimiters
 * @param {string|number} value - Number to format
 * @param {number} precision - Decimal places
 * @param {string} [thousandsSeparator=','] - Thousands separator
 * @param {string} [decimalSeparator='.'] - Decimal separator
 * @returns {string} Formatted number
 * 
 * @example
 * formatWithDelimiters(1000.50, 2); // "1,000.50"
 * formatWithDelimiters(1000.50, 2, '.', ','); // "1.000,50"
 */
export function formatWithDelimiters(
  value,
  precision = 2,
  thousandsSeparator = ',',
  decimalSeparator = '.'
) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  if (isNaN(value)) {
    return '';
  }

  const fixedValue = value.toFixed(precision);
  const parts = fixedValue.split('.');
  const dollars = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  const cents = parts[1];

  return precision > 0 ? `${dollars}${decimalSeparator}${cents}` : dollars;
}

/**
 * Get price range string for products with variants
 * @param {number} minPrice - Minimum price in cents
 * @param {number} maxPrice - Maximum price in cents
 * @param {string} [format] - Money format string
 * @returns {string} Price range string
 * 
 * @example
 * getPriceRange(1000, 2000); // "$10.00 - $20.00"
 * getPriceRange(1000, 1000); // "$10.00"
 */
export function getPriceRange(minPrice, maxPrice, format = null) {
  if (minPrice === maxPrice) {
    return formatMoney(minPrice, format);
  }

  return `${formatMoney(minPrice, format)} - ${formatMoney(maxPrice, format)}`;
}

/**
 * Parse money string to cents
 * @param {string} money - Formatted money string
 * @returns {number} Amount in cents
 * 
 * @example
 * parseMoneyString('$10.00'); // 1000
 * parseMoneyString('€10,50'); // 1050
 */
export function parseMoneyString(money) {
  if (typeof money !== 'string') {
    return 0;
  }

  // Remove currency symbols and spaces
  let cleaned = money.replace(/[^\d.,-]/g, '');

  // Determine decimal separator
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  if (lastComma > lastDot) {
    // European format (1.000,50)
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // US format (1,000.50)
    cleaned = cleaned.replace(/,/g, '');
  }

  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : Math.round(value * 100);
}

/**
 * Format a sale price with compare at price
 * @param {number} price - Sale price in cents
 * @param {number} compareAtPrice - Original price in cents
 * @param {string} [format] - Money format string
 * @returns {Object} Object with formatted price and compareAtPrice
 * 
 * @example
 * formatSalePrice(800, 1000);
 * // { price: "$8.00", compareAtPrice: "$10.00", saved: "$2.00", percentOff: "20%" }
 */
export function formatSalePrice(price, compareAtPrice, format = null) {
  const formattedPrice = formatMoney(price, format);
  const formattedCompareAtPrice = formatMoney(compareAtPrice, format);
  const saved = compareAtPrice - price;
  const percentOff = Math.round((saved / compareAtPrice) * 100);

  return {
    price: formattedPrice,
    compareAtPrice: formattedCompareAtPrice,
    saved: formatMoney(saved, format),
    percentOff: `${percentOff}%`,
    isOnSale: price < compareAtPrice
  };
}

/**
 * Get the currency symbol from format string or default
 * @param {string} [format] - Money format string
 * @returns {string} Currency symbol
 * 
 * @example
 * getCurrencySymbol('${{amount}}'); // "$"
 * getCurrencySymbol('{{amount}} USD'); // "USD"
 */
export function getCurrencySymbol(format = null) {
  const formatString = format || 
    (typeof window !== 'undefined' && window.theme?.moneyFormat) || 
    '${{amount}}';

  // Extract text before or after the placeholder
  const match = formatString.match(/([^\{]+)\{\{/);
  if (match) {
    return match[1].trim();
  }

  const matchAfter = formatString.match(/\}\}([^\}]+)/);
  if (matchAfter) {
    return matchAfter[1].trim();
  }

  return '$';
}

/**
 * Initialize money formatting with theme settings
 * Should be called once when the theme loads
 * @param {Object} settings - Theme settings
 * @param {string} settings.moneyFormat - Money format from shop settings
 */
export function initializeMoneyFormat(settings) {
  if (typeof window !== 'undefined') {
    window.theme = window.theme || {};
    window.theme.moneyFormat = settings.moneyFormat || '${{amount}}';
  }
}

