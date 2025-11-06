import { Component } from '../utils/component-base.js';
import { ThemeEvents } from '../utils/events.js';

/**
 * Product Gallery Component following Horizon pattern
 * Handles product media gallery, thumbnails, and variant image switching
 * 
 * @typedef {Object} Refs
 * @property {HTMLElement[]} slides
 * @property {HTMLElement[]} thumbnails
 * @property {HTMLElement} mainImage
 * 
 * @extends {Component<Refs>}
 */
export class ProductGalleryComponent extends Component {
  currentIndex = 0;
  #resizeObserver = null;

  connectedCallback() {
    super.connectedCallback();

    // Initialize gallery
    this.#initializeGallery();

    // Listen for variant updates
    document.addEventListener(ThemeEvents.variantUpdate, this.#handleVariantUpdate);

    // Set up resize observer for responsive behavior
    this.#setupResizeObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(ThemeEvents.variantUpdate, this.#handleVariantUpdate);
    
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
    }
  }

  /**
   * Initialize gallery
   */
  #initializeGallery() {
    // Set first slide as active
    if (this.refs.slides && this.refs.slides.length > 0) {
      this.#setActiveSlide(0);
    }

    // Add keyboard navigation
    this.addEventListener('keydown', this.#handleKeydown.bind(this));
  }

  /**
   * Handle variant update event
   * @param {CustomEvent} event
   */
  #handleVariantUpdate = (event) => {
    const { variant } = event.detail;
    
    if (!variant || !variant.featured_media) return;

    // Find slide with matching media ID
    const targetSlide = this.#findSlideByMediaId(variant.featured_media.id);
    
    if (targetSlide !== -1) {
      this.#setActiveSlide(targetSlide);
      this.#scrollToSlide(targetSlide);
    }
  };

  /**
   * Find slide index by media ID
   * @param {string | number} mediaId
   * @returns {number} Slide index or -1 if not found
   */
  #findSlideByMediaId(mediaId) {
    if (!this.refs.slides) return -1;

    return this.refs.slides.findIndex(slide => {
      const slideMediaId = slide.dataset.mediaId;
      return slideMediaId && slideMediaId === mediaId.toString();
    });
  }

  /**
   * Set active slide
   * @param {number} index
   */
  #setActiveSlide(index) {
    if (!this.refs.slides || index < 0 || index >= this.refs.slides.length) return;

    this.currentIndex = index;

    // Update slides
    this.refs.slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        slide.removeAttribute('inert');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('inert', '');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // Update thumbnails
    if (this.refs.thumbnails) {
      this.refs.thumbnails.forEach((thumb, i) => {
        if (i === index) {
          thumb.classList.add('active');
          thumb.setAttribute('aria-current', 'true');
        } else {
          thumb.classList.remove('active');
          thumb.removeAttribute('aria-current');
        }
      });
    }

    // Announce to screen readers
    this.announceToScreenReader(`Image ${index + 1} of ${this.refs.slides.length}`);
  }

  /**
   * Scroll to slide (for thumbnail clicks)
   * @param {number} index
   */
  #scrollToSlide(index) {
    if (!this.refs.slides || index < 0 || index >= this.refs.slides.length) return;

    const slide = this.refs.slides[index];
    const container = slide.parentElement;

    if (container) {
      // Smooth scroll to slide
      container.scrollTo({
        left: slide.offsetLeft,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Handle thumbnail click
   * @param {number} index - Thumbnail index
   * @param {Event} event
   */
  selectSlide(index, event) {
    event?.preventDefault();
    this.#setActiveSlide(parseInt(index, 10));
    this.#scrollToSlide(parseInt(index, 10));
  }

  /**
   * Navigate to previous slide
   * @param {Event} event
   */
  previousSlide(event) {
    event?.preventDefault();
    const newIndex = this.currentIndex > 0 
      ? this.currentIndex - 1 
      : (this.refs.slides?.length || 1) - 1;
    
    this.#setActiveSlide(newIndex);
    this.#scrollToSlide(newIndex);
  }

  /**
   * Navigate to next slide
   * @param {Event} event
   */
  nextSlide(event) {
    event?.preventDefault();
    const newIndex = this.currentIndex < (this.refs.slides?.length || 1) - 1 
      ? this.currentIndex + 1 
      : 0;
    
    this.#setActiveSlide(newIndex);
    this.#scrollToSlide(newIndex);
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   */
  #handleKeydown(event) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousSlide(event);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextSlide(event);
        break;
      case 'Home':
        event.preventDefault();
        this.#setActiveSlide(0);
        this.#scrollToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        const lastIndex = (this.refs.slides?.length || 1) - 1;
        this.#setActiveSlide(lastIndex);
        this.#scrollToSlide(lastIndex);
        break;
    }
  }

  /**
   * Setup resize observer for responsive behavior
   */
  #setupResizeObserver() {
    if (!('ResizeObserver' in window)) return;

    this.#resizeObserver = new ResizeObserver(() => {
      // Re-scroll to current slide on resize
      this.#scrollToSlide(this.currentIndex);
    });

    this.#resizeObserver.observe(this);
  }

  /**
   * Handle intersection observer for slide visibility
   * Automatically updates current index based on scroll position
   */
  #setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    if (!this.refs.slides) return;

    const options = {
      root: this.querySelector('.slides-container'),
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = this.refs.slides?.indexOf(/** @type {HTMLElement} */ (entry.target));
          if (index !== undefined && index !== -1) {
            this.#setActiveSlide(index);
          }
        }
      });
    }, options);

    this.refs.slides.forEach(slide => observer.observe(slide));
  }
}

if (!customElements.get('product-gallery-component')) {
  customElements.define('product-gallery-component', ProductGalleryComponent);
}

