# Design: Core Shopify Modules Implementation

## Context

This change implements the core functionality modules for a modern DTC Shopify theme. The implementation must balance:

1. **Reference Implementation**: Following patterns from `horizon-referrence` for proven Shopify best practices
2. **Modern Aesthetics**: Using Tailwind CSS for a contemporary DTC brand look
3. **Web Standards**: Leveraging native Web Components for interactive features
4. **Accessibility**: Meeting WCAG 2.2 AA requirements
5. **Performance**: Optimizing for Core Web Vitals

### Constraints
- Must work within Shopify's Online Store 2.0 architecture
- Build process limited to Vite + Tailwind + PostCSS
- No external JavaScript frameworks (vanilla JS + Web Components only)
- Must be compatible with Shopify theme editor
- Bundle size targets: CSS < 15KB, JS < 5KB (gzipped per module)

### Stakeholders
- **Merchants**: Need reliable, easy-to-customize e-commerce functionality
- **Shoppers**: Expect fast, accessible, mobile-friendly shopping experience
- **Developers**: Require maintainable, well-documented code

## Goals / Non-Goals

### Goals
- ✅ Implement complete product browsing and purchasing flow
- ✅ Create reusable, accessible Web Components
- ✅ Match modern DTC aesthetic standards
- ✅ Maintain mobile-first responsive design
- ✅ Achieve excellent accessibility scores
- ✅ Reference horizon-referrence for core cart/product logic
- ✅ Support Shopify theme editor customization

### Non-Goals
- ❌ Multi-currency support (Phase 2)
- ❌ Advanced product filtering (Phase 2)
- ❌ Product reviews/ratings system (Phase 2)
- ❌ Wishlist functionality (Phase 2)
- ❌ Customer account pages (Phase 2)
- ❌ Product quick view modal (Phase 2)

## Decisions

### 1. Web Component Architecture

**Decision**: Use native Web Components with a lightweight base class for all interactive modules.

**Rationale**:
- Native browser support (no framework overhead)
- Encapsulation of component logic
- Follows project's vanilla JS preference
- Can reference existing patterns from header/footer implementation

**Implementation Pattern**:
```javascript
// Base component pattern (already exists in project)
import { Component } from '@theme/component';

class ProductGallery extends Component {
  constructor() {
    super();
    this.currentIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initGallery();
  }

  initGallery() {
    // Component logic
  }
}

customElements.define('product-gallery', ProductGallery);
```

**Alternatives Considered**:
- **Vanilla JS with classes**: More code duplication, harder to maintain
- **External framework (Alpine.js, etc.)**: Adds bundle size, against project principles

### 2. Product Variant Selection

**Decision**: Implement variant selector using Shopify's variant JSON data with Web Component UI.

**Rationale**:
- Follows Shopify best practices
- Allows real-time price/availability updates
- Supports all variant types (color, size, etc.)
- Enables rich UI (color swatches, size buttons)

**Implementation**:
- Store product JSON in `<script type="application/json">` tag
- Variant selector component reads JSON and manages state
- Update price, images, and availability on selection
- Handle variant combinations and "unavailable" states
- Reference horizon-referrence's variant logic patterns

**Code Example**:
```liquid
<variant-selector data-product-id="{{ product.id }}">
  <select ref="variantSelect" name="id">
    {% for variant in product.variants %}
      <option value="{{ variant.id }}" {% if variant.id == product.selected_or_first_available_variant.id %}selected{% endif %}>
        {{ variant.title }}
      </option>
    {% endfor %}
  </select>
</variant-selector>

<script type="application/json" data-product-json>
  {{ product | json }}
</script>
```

### 3. Cart State Management

**Decision**: Use Shopify Cart API with event-driven updates across components.

**Rationale**:
- Leverages Shopify's built-in cart system
- No custom backend needed
- Event system allows component communication
- Follows horizon-referrence cart patterns

**Implementation**:
```javascript
// Cart module pattern (reference horizon)
class CartItems extends Component {
  async updateCart(updates) {
    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      const cart = await response.json();
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('cart:updated', {
        detail: { cart }
      }));
      
      return cart;
    } catch (error) {
      console.error('Cart update failed:', error);
    }
  }
}
```

**Event-driven Communication**:
- `cart:updated` - Cart contents changed
- `cart:item-added` - Item added to cart
- `cart:item-removed` - Item removed from cart
- Components listen to events and update UI accordingly

### 4. Image Gallery Pattern

**Decision**: Use native browser features for image gallery (no external libraries).

**Features**:
- Main image display with aspect ratio container
- Thumbnail navigation
- Touch gestures on mobile (native scroll)
- Zoom on click (Web Component)
- Lazy loading for off-screen images

**Accessibility**:
- Keyboard navigation (arrow keys)
- Screen reader announcements
- Focus management
- ARIA labels for current image index

### 5. Styling Approach

**Decision**: Use Tailwind utility classes with component-scoped custom CSS via `{% stylesheet %}`.

**Pattern**:
```liquid
<div class="product-card grid gap-4 md:grid-cols-2">
  <!-- Tailwind for layout/spacing -->
</div>

{% stylesheet %}
.product-card__gallery {
  /* Component-specific styling */
  container-type: inline-size;
}

@container (min-width: 400px) {
  .product-card__gallery {
    /* Responsive within component */
  }
}
{% endstylesheet %}
```

**Benefits**:
- Rapid development with utilities
- Component-scoped styles prevent leaks
- Container queries for true component responsiveness
- Consistent spacing/typography from Tailwind config

### 6. Search Implementation

**Decision**: Use Shopify Predictive Search API for autocomplete, standard search for results page.

**Rationale**:
- Shopify-native, no external service needed
- Fast autocomplete experience
- Supports products, collections, articles
- Mobile-optimized

**Implementation**:
```javascript
class SearchAutocomplete extends Component {
  async fetchSuggestions(query) {
    const response = await fetch(
      `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,article`
    );
    const { resources } = await response.json();
    return resources;
  }
}
```

### 7. Blog Structure

**Decision**: Use Shopify's built-in blog system with custom styling.

**Features**:
- Blog post grid with featured images
- Tag-based filtering (client-side for performance)
- Pagination (Shopify native)
- Rich text rendering with Liquid
- Social share buttons

**Responsive Grid**:
- 1 column mobile
- 2 columns tablet
- 3 columns desktop
- CSS Grid with auto-fit for flexibility

## Risks / Trade-offs

### Risk: Web Component Bundle Size
**Mitigation**: 
- Code split by page type (product JS only on product pages)
- Lazy load non-critical components
- Minify and tree-shake aggressively
- Target < 5KB per module gzipped

### Risk: Accessibility Complexity
**Mitigation**:
- Follow WAI-ARIA patterns for all interactive components
- Reference accessibility rules from horizon-referrence
- Test with screen readers during development
- Use automated accessibility testing
- Include ARIA live regions for dynamic updates

### Risk: Browser Compatibility
**Mitigation**:
- Web Components supported in all modern browsers
- Progressive enhancement for older browsers
- Feature detection where needed
- Target last 2 versions of major browsers

### Trade-off: Custom vs. Native Components
**Decision**: Use native HTML where possible (select, button), enhance with Web Components.

**Example**:
```liquid
<!-- Native select for fallback -->
<select name="id" ref="variantSelect">
  <option>...</option>
</select>

<!-- Enhanced with Web Component -->
<variant-selector>
  <!-- Custom UI rendered by component -->
</variant-selector>
```

## Migration Plan

### Phase 1: Foundation (Current)
1. Set up Web Component base classes
2. Create utility functions (cart API, fetch helpers)
3. Implement core snippets (product-form, cart-item)
4. Add base translations

### Phase 2: Product & Cart
1. Implement product gallery Web Component
2. Build variant selector
3. Create add-to-cart functionality
4. Implement cart page with quantity updates
5. Add cart drawer (mini cart)

### Phase 3: Content & Search
1. Build blog listing with pagination
2. Create article detail page
3. Implement search autocomplete
4. Build search results page
5. Add tag filtering

### Phase 4: Polish & Optimization
1. Accessibility audit and fixes
2. Performance optimization
3. Cross-browser testing
4. Mobile optimization
5. Theme editor testing

### Rollback Plan
- Each section can be reverted independently
- Keep existing simple sections as backup
- No database changes required
- Theme preview for testing before publish

## Open Questions

1. **Q**: Should we implement product quick view modal in this phase?
   **A**: No, defer to Phase 2. Focus on core functionality first.

2. **Q**: Do we need to support product variants with more than 3 options?
   **A**: Yes, Shopify supports up to 3 variant options. This is a Shopify limitation.

3. **Q**: Should cart drawer be persistent or only open on add-to-cart?
   **A**: Open on add-to-cart, with persistent cart icon badge showing count.

4. **Q**: Image gallery zoom - modal or inline?
   **A**: Inline zoom for mobile (pinch), modal lightbox for desktop (click).

5. **Q**: Blog comments - native Shopify or custom?
   **A**: Native Shopify comments system (if enabled in theme settings).

## Reference Implementation Notes

### From horizon-referrence

Key patterns to reference:

1. **Cart API Integration** (`horizon-referrence/sections/main-cart.liquid`)
   - Cart update endpoints
   - Error handling
   - Loading states
   - Optimistic UI updates

2. **Product Information** (`horizon-referrence/sections/product-information.liquid`)
   - Variant selection logic
   - Price formatting
   - Availability display
   - Product JSON structure

3. **Component Architecture**
   - Use of content_for blocks
   - Schema structure for theme editor
   - Responsive grid patterns
   - CSS custom properties for theming

4. **Accessibility Patterns**
   - ARIA attributes for interactive elements
   - Keyboard navigation
   - Focus management
   - Screen reader text

### Modern DTC Aesthetics

- Clean, minimalist layouts
- Ample whitespace
- High-quality imagery
- Clear typography hierarchy
- Subtle animations (respect prefers-reduced-motion)
- Mobile-first responsive design
- Modern color schemes via Tailwind
- Professional product photography presentation

