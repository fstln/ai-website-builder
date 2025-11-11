/**
 * @file product-gallery.js
 * @description Web Component for product image gallery with thumbnails and zoom
 */

import { Component } from '../utils/component-base.js';

/**
 * ProductGallery Web Component
 * Manages product image gallery, thumbnails, zoom, and keyboard navigation
 * 
 * @example
 * <product-gallery-component>
 *   <div data-main-image>...</div>
 *   <div data-thumbnails>...</div>
 * </product-gallery-component>
 */
class ProductGalleryComponent extends Component {
  constructor() {
    super();
    this.currentIndex = 0;
    this.images = [];
    this.isZoomed = false;
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.mainImageContainer = this.querySelector('[data-main-image]');
    this.thumbnailsContainer = this.querySelector('[data-thumbnails]');
    
    if (!this.mainImageContainer) {
      console.error('ProductGallery requires [data-main-image] element');
      return;
    }

    this.initializeGallery();
    this.attachEventListeners();
    
    // Listen for variant changes
    document.addEventListener('variant:selected', this.handleVariantChange.bind(this));
  }

  /**
   * Initialize gallery
   */
  initializeGallery() {
    // Get all images from thumbnails
    const thumbnails = this.thumbnailsContainer?.querySelectorAll('[data-thumbnail]');
    
    if (thumbnails) {
      this.images = Array.from(thumbnails).map((thumb, index) => ({
        index,
        src: thumb.dataset.imageSrc || thumb.querySelector('img')?.src,
        alt: thumb.dataset.imageAlt || thumb.querySelector('img')?.alt,
        element: thumb
      }));
    }

    // Set initial active thumbnail
    this.setActiveThumbnail(0);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Thumbnail clicks
    if (this.thumbnailsContainer) {
      this.thumbnailsContainer.addEventListener('click', (e) => {
        const thumbnail = e.target.closest('[data-thumbnail]');
        if (thumbnail) {
          const index = parseInt(thumbnail.dataset.thumbnailIndex || '0', 10);
          this.changeImage(index);
        }
      });
    }

    // Main image click for zoom
    if (this.mainImageContainer) {
      this.mainImageContainer.addEventListener('click', this.handleImageClick.bind(this));
    }

    // Keyboard navigation
    this.addEventListener('keydown', this.handleKeyboard.bind(this));

    // Touch gestures for mobile
    this.attachTouchListeners();
  }

  /**
   * Change displayed image
   * @param {number} index - Image index
   */
  changeImage(index) {
    if (index < 0 || index >= this.images.length) return;

    const image = this.images[index];
    if (!image) return;

    this.currentIndex = index;

    // Update main image
    const mainImg = this.mainImageContainer?.querySelector('img');
    if (mainImg && image.src) {
      // Fade out
      mainImg.style.opacity = '0';
      
      // Change image after fade
      setTimeout(() => {
        mainImg.src = image.src;
        mainImg.alt = image.alt || '';
        
        // Fade in
        mainImg.style.opacity = '1';
      }, 150);
    }

    // Update active thumbnail
    this.setActiveThumbnail(index);

    // Announce to screen readers
    this.announceToScreenReader(`Image ${index + 1} of ${this.images.length}`);
  }

  /**
   * Set active thumbnail
   * @param {number} index - Thumbnail index
   */
  setActiveThumbnail(index) {
    if (!this.thumbnailsContainer) return;

    const thumbnails = this.thumbnailsContainer.querySelectorAll('[data-thumbnail]');
    
    thumbnails.forEach((thumb, i) => {
      if (i === index) {
        thumb.classList.add('active', 'border-primary');
        thumb.classList.remove('border-border');
        thumb.setAttribute('aria-current', 'true');
      } else {
        thumb.classList.remove('active', 'border-primary');
        thumb.classList.add('border-border');
        thumb.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Handle image click (zoom)
   * @param {MouseEvent} event
   */
  handleImageClick(event) {
    if (this.dataset.enableZoom !== 'true') return;

    event.preventDefault();
    this.toggleZoom();
  }

  /**
   * Toggle zoom state
   */
  toggleZoom() {
    this.isZoomed = !this.isZoomed;

    if (this.isZoomed) {
      this.openZoom();
    } else {
      this.closeZoom();
    }
  }

  /**
   * Open zoom modal
   */
  openZoom() {
    const modal = this.createZoomModal();
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Focus trap
    this.zoomCleanup = this.trapFocus(modal);

    // Announce to screen readers
    this.announceToScreenReader('Image zoom opened. Press Escape to close.');

    // Add to modal
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
  }

  /**
   * Close zoom modal
   */
  closeZoom() {
    const modal = document.querySelector('[data-zoom-modal]');
    if (!modal) return;

    modal.classList.remove('active');
    
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
      
      if (this.zoomCleanup) {
        this.zoomCleanup();
      }
    }, 300);

    this.isZoomed = false;
  }

  /**
   * Create zoom modal
   * @returns {HTMLElement}
   */
  createZoomModal() {
    const modal = document.createElement('div');
    modal.setAttribute('data-zoom-modal', '');
    modal.className = 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center opacity-0 transition-opacity duration-300';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image zoom');

    const currentImage = this.images[this.currentIndex];
    
    modal.innerHTML = `
      <button 
        type="button"
        class="absolute top-4 right-4 text-white hover:text-background/70 transition-colors z-10"
        data-close-zoom
        aria-label="Close zoom"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <button 
        type="button"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-background/70 transition-colors ${this.images.length <= 1 ? 'hidden' : ''}"
        data-zoom-prev
        aria-label="Previous image"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button 
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-background/70 transition-colors ${this.images.length <= 1 ? 'hidden' : ''}"
        data-zoom-next
        aria-label="Next image"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <div class="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
        <img 
          src="${currentImage.src}" 
          alt="${currentImage.alt || ''}"
          class="max-w-full max-h-full object-contain"
          data-zoom-image
        >
      </div>

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm ${this.images.length <= 1 ? 'hidden' : ''}">
        <span data-zoom-counter>${this.currentIndex + 1} / ${this.images.length}</span>
      </div>
    `;

    // Event listeners
    modal.querySelector('[data-close-zoom]')?.addEventListener('click', () => this.closeZoom());
    modal.querySelector('[data-zoom-prev]')?.addEventListener('click', () => this.changeZoomImage(-1));
    modal.querySelector('[data-zoom-next]')?.addEventListener('click', () => this.changeZoomImage(1));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeZoom();
    });

    return modal;
  }

  /**
   * Change zoom image
   * @param {number} direction - -1 for previous, 1 for next
   */
  changeZoomImage(direction) {
    const newIndex = this.currentIndex + direction;
    
    if (newIndex < 0 || newIndex >= this.images.length) return;

    this.currentIndex = newIndex;
    const image = this.images[newIndex];

    // Update zoom image
    const zoomImg = document.querySelector('[data-zoom-image]');
    const counter = document.querySelector('[data-zoom-counter]');
    
    if (zoomImg && image.src) {
      zoomImg.src = image.src;
      zoomImg.alt = image.alt || '';
    }

    if (counter) {
      counter.textContent = `${newIndex + 1} / ${this.images.length}`;
    }

    // Update main gallery
    this.changeImage(newIndex);
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   */
  handleKeyboard(event) {
    // In zoom mode
    if (this.isZoomed) {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          this.closeZoom();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          this.changeZoomImage(-1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.changeZoomImage(1);
          break;
      }
      return;
    }

    // In gallery mode
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.changeImage(this.currentIndex - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.changeImage(this.currentIndex + 1);
        break;
      case 'Home':
        event.preventDefault();
        this.changeImage(0);
        break;
      case 'End':
        event.preventDefault();
        this.changeImage(this.images.length - 1);
        break;
    }
  }

  /**
   * Attach touch listeners for swipe gestures
   */
  attachTouchListeners() {
    let touchStartX = 0;
    let touchEndX = 0;

    this.mainImageContainer?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.mainImageContainer?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  /**
   * Handle swipe gesture
   * @param {number} startX
   * @param {number} endX
   */
  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next image
        this.changeImage(this.currentIndex + 1);
      } else {
        // Swipe right - previous image
        this.changeImage(this.currentIndex - 1);
      }
    }
  }

  /**
   * Handle variant change event
   * @param {CustomEvent} event
   */
  handleVariantChange(event) {
    const variant = event.detail?.variant;
    
    if (!variant || !variant.featured_media) return;
    
    // Find the image index for this variant's featured media
    const mediaId = variant.featured_media.id;
    const index = this.images.findIndex(img => 
      img.element?.dataset.mediaId === mediaId.toString()
    );

    if (index >= 0) {
      this.changeImage(index);
    } else {
      console.log('Could not find image for media ID:', mediaId);
    }
  }

  /**
   * Public method to select media by ID
   * @param {number|string} mediaId - Media ID to select
   */
  selectMediaById(mediaId) {
    const index = this.images.findIndex(img => 
      img.element?.dataset.mediaId === mediaId.toString()
    );

    if (index >= 0) {
      this.changeImage(index);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    if (this.isZoomed) {
      this.closeZoom();
    }

    document.removeEventListener('variant:selected', this.handleVariantChange);
  }
}

// Register the custom element
if (!customElements.get('product-gallery-component')) {
  customElements.define('product-gallery-component', ProductGalleryComponent);
}

export { ProductGalleryComponent };
