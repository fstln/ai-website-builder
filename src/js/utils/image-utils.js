/**
 * @file image-utils.js
 * @description Utility functions for working with Shopify images
 */

/**
 * Get Shopify CDN image URL with size parameter
 * @param {string} url - Original image URL
 * @param {string|number} size - Size parameter (e.g., '400x400', '1024x', 'x500', 'master')
 * @returns {string} Sized image URL
 * 
 * @example
 * getSizedImageUrl('https://cdn.shopify.com/image.jpg', '400x400');
 * getSizedImageUrl('https://cdn.shopify.com/image.jpg', '1024x'); // Width only
 * getSizedImageUrl('https://cdn.shopify.com/image.jpg', 'x500'); // Height only
 */
export function getSizedImageUrl(url, size) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Remove any existing size parameters
  let cleanUrl = url.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master|(\d+x\d*|\d*x\d+))\./g, '.');

  // Don't modify if size is 'master' or original
  if (size === 'master' || size === 'original') {
    return cleanUrl;
  }

  // Insert size before file extension
  const extension = cleanUrl.split('.').pop();
  const baseUrl = cleanUrl.substring(0, cleanUrl.lastIndexOf('.'));

  return `${baseUrl}_${size}.${extension}`;
}

/**
 * Get srcset string for responsive images
 * @param {string} url - Original image URL
 * @param {number[]} widths - Array of widths for srcset
 * @returns {string} Srcset string
 * 
 * @example
 * getImageSrcset('https://cdn.shopify.com/image.jpg', [400, 800, 1200]);
 * // "https://cdn.shopify.com/image_400x.jpg 400w, ..."
 */
export function getImageSrcset(url, widths = [400, 600, 800, 1000, 1200, 1400]) {
  if (!url) {
    return '';
  }

  return widths
    .map(width => `${getSizedImageUrl(url, `${width}x`)} ${width}w`)
    .join(', ');
}

/**
 * Get sizes attribute for responsive images
 * @param {Object} [options] - Size options
 * @param {string} [options.mobile='100vw'] - Mobile size
 * @param {string} [options.tablet='50vw'] - Tablet size
 * @param {string} [options.desktop='33vw'] - Desktop size
 * @returns {string} Sizes string
 * 
 * @example
 * getImageSizes(); // "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
 */
export function getImageSizes(options = {}) {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw'
  } = options;

  return `(min-width: 1024px) ${desktop}, (min-width: 768px) ${tablet}, ${mobile}`;
}

/**
 * Preload an image
 * @param {string} url - Image URL to preload
 * @returns {Promise<HTMLImageElement>} Promise that resolves when image is loaded
 * 
 * @example
 * await preloadImage('https://cdn.shopify.com/image.jpg');
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('No URL provided'));
      return;
    }

    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Get image aspect ratio from dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {number} Aspect ratio (width / height)
 * 
 * @example
 * getAspectRatio(1600, 1200); // 1.333...
 */
export function getAspectRatio(width, height) {
  if (!width || !height || height === 0) {
    return 1;
  }
  return width / height;
}

/**
 * Get padding-top percentage for aspect ratio box
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Padding percentage (e.g., '75%')
 * 
 * @example
 * getAspectRatioPadding(1600, 1200); // "75%"
 */
export function getAspectRatioPadding(width, height) {
  const ratio = getAspectRatio(width, height);
  return `${(1 / ratio) * 100}%`;
}

/**
 * Lazy load images using Intersection Observer
 * @param {HTMLElement|NodeList|Array} images - Image element(s) to lazy load
 * @param {Object} [options] - Intersection Observer options
 * @param {string} [options.rootMargin='50px'] - Root margin
 * @param {number} [options.threshold=0.01] - Threshold
 * 
 * @example
 * lazyLoadImages(document.querySelectorAll('img[data-src]'));
 */
export function lazyLoadImages(images, options = {}) {
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    const imageList = images instanceof NodeList ? Array.from(images) : 
                     Array.isArray(images) ? images : [images];
    imageList.forEach(loadImage);
    return;
  }

  const config = {
    rootMargin: options.rootMargin || '50px',
    threshold: options.threshold || 0.01
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, config);

  const imageList = images instanceof NodeList ? Array.from(images) : 
                   Array.isArray(images) ? images : [images];

  imageList.forEach(img => imageObserver.observe(img));
}

/**
 * Load a single image (helper for lazy loading)
 * @param {HTMLElement} img - Image element
 */
function loadImage(img) {
  if (!img) return;

  const src = img.dataset.src || img.getAttribute('data-src');
  const srcset = img.dataset.srcset || img.getAttribute('data-srcset');

  if (src) {
    img.src = src;
    img.removeAttribute('data-src');
  }

  if (srcset) {
    img.srcset = srcset;
    img.removeAttribute('data-srcset');
  }

  img.classList.add('loaded');
}

/**
 * Get Shopify image focal point
 * @param {Object} image - Shopify image object
 * @param {Object} [image.presentation] - Image presentation settings
 * @param {Object} [image.presentation.focal_point] - Focal point settings
 * @returns {Object|null} Focal point coordinates (x, y as percentages)
 * 
 * @example
 * const focalPoint = getImageFocalPoint(image);
 * // { x: '50%', y: '50%' }
 */
export function getImageFocalPoint(image) {
  if (!image?.presentation?.focal_point) {
    return null;
  }

  const { x, y } = image.presentation.focal_point;
  return {
    x: `${x * 100}%`,
    y: `${y * 100}%`
  };
}

/**
 * Apply focal point to image element
 * @param {HTMLElement} img - Image element
 * @param {Object} focalPoint - Focal point object
 * @param {string} focalPoint.x - X position percentage
 * @param {string} focalPoint.y - Y position percentage
 * 
 * @example
 * applyFocalPoint(imgElement, { x: '30%', y: '70%' });
 */
export function applyFocalPoint(img, focalPoint) {
  if (!img || !focalPoint) return;

  img.style.objectPosition = `${focalPoint.x} ${focalPoint.y}`;
}

/**
 * Get color from image URL (for placeholder/loading states)
 * Shopify CDN images can have a dominant color in metadata
 * @param {string} url - Image URL
 * @returns {string|null} Hex color or null
 */
export function getImagePlaceholderColor(url) {
  if (!url) return null;

  // Try to extract color from URL parameters if present
  const match = url.match(/[?&]v=(\d+)/);
  if (match) {
    // Generate a placeholder color based on the version number
    const version = parseInt(match[1], 10);
    const hue = version % 360;
    return `hsl(${hue}, 20%, 90%)`;
  }

  // Default neutral placeholder
  return '#f5f5f5';
}

/**
 * Create a blurred placeholder data URL
 * @param {number} [width=20] - Placeholder width
 * @param {number} [height=20] - Placeholder height
 * @param {string} [color='#f5f5f5'] - Background color
 * @returns {string} Data URL
 */
export function createPlaceholderDataUrl(width = 20, height = 20, color = '#f5f5f5') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

/**
 * Shopify image size presets
 */
export const ImageSizes = {
  PICO: 'pico', // 16x16
  ICON: 'icon', // 32x32
  THUMB: 'thumb', // 50x50
  SMALL: 'small', // 100x100
  COMPACT: 'compact', // 160x160
  MEDIUM: 'medium', // 240x240
  LARGE: 'large', // 480x480
  GRANDE: 'grande', // 600x600
  ORIGINAL: 'original', // Original image
  MASTER: 'master' // Original image
};

/**
 * Common srcset width breakpoints
 */
export const SrcsetWidths = {
  MOBILE: [375, 750],
  TABLET: [768, 1024],
  DESKTOP: [1280, 1536, 1920],
  ALL: [375, 750, 768, 1024, 1280, 1536, 1920]
};

