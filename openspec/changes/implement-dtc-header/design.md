# Design: Modern DTC Header Component

## Context

The header is the primary navigation element for the entire theme and appears on every page. It must:
- Provide clear, accessible navigation across all device sizes
- Support core ecommerce functions (search, cart, account)
- Maintain performance (minimal JavaScript, efficient CSS)
- Follow Shopify Theme 2.0 best practices
- Align with modern DTC visual standards

**Constraints**:
- Must work within Shopify's serverless environment
- Cannot use external dependencies or frameworks
- Must support Shopify's theme editor customization
- Must be accessible (WCAG AA minimum)
- Must perform well on mobile networks

**Stakeholders**:
- End users: Fast, intuitive navigation
- Merchants: Easy customization without code
- Developers: Maintainable, extensible code

## Goals / Non-Goals

### Goals
1. Create a professional, conversion-optimized header
2. Implement responsive design that works across all devices
3. Provide seamless navigation and search experiences
4. Ensure accessibility for keyboard and screen reader users
5. Enable theme customization through Shopify admin
6. Maintain excellent performance (< 3KB JavaScript, < 5KB CSS)

### Non-Goals
1. Mega menu support (future enhancement)
2. Multiple navigation menus (single menu only for now)
3. Promotional banner integration (separate section)
4. Multi-currency selector (separate component)
5. Complex animations (keep micro-interactions only)

## Decisions

### Decision 1: Layout Architecture - CSS Grid over Flexbox

**Choice**: Use CSS Grid for main header layout with three explicit columns

**Rationale**:
- Grid provides precise control over three-zone layout (left/center/right)
- Easier to maintain visual balance across different content sizes
- Better support for responsive reordering (mobile logo centering)
- Cleaner code than multiple nested Flexbox containers

**Alternatives Considered**:
- Flexbox with `justify-content: space-between` - Harder to maintain center alignment when left/right zones vary
- Absolute positioning - Inflexible and maintenance-heavy

**Implementation**:
```css
.header-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "logo nav actions";
}

@media (max-width: 767px) {
  .header-container {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "menu logo actions";
  }
}
```

### Decision 2: Mobile Navigation - Slide-out Drawer Pattern

**Choice**: Full-height slide-out drawer from left side

**Rationale**:
- Most common pattern in DTC websites (familiar UX)
- Provides ample space for navigation links
- Allows future expansion (filters, account links, etc.)
- Better than dropdown overlay (clearer hierarchy)

**Alternatives Considered**:
- Dropdown from top - Takes vertical space, pushes content down
- Bottom sheet - Less common, harder thumb reach on large phones
- Full-screen overlay - Feels heavy, loses context

**Implementation Details**:
- Slide animation using CSS transforms (hardware-accelerated)
- Backdrop overlay with blur effect
- Focus trap when drawer is open
- Close on backdrop click or ESC key
- `position: fixed` for drawer to prevent body scroll issues

### Decision 3: Search Implementation - Modal Pattern

**Choice**: Search modal overlay with instant focus on search input

**Rationale**:
- Keeps header clean (just icon, not input field)
- Provides large search input with better UX
- Allows for search suggestions without layout shift
- Common pattern across major DTC brands

**Alternatives Considered**:
- Inline search bar - Takes too much space on desktop
- Dropdown search - Limited space for suggestions
- Separate search page - Adds friction, requires page load

**Implementation Details**:
- Native `<dialog>` element for better accessibility
- Backdrop click or ESC to close
- Focus management (trap focus, restore on close)
- Debounced input for predictive search (future)

### Decision 4: Cart Count - Event-driven Updates

**Choice**: Custom events for cart count synchronization

**Rationale**:
- Decouples header from cart functionality
- Allows multiple cart count displays to stay in sync
- Follows event-driven architecture pattern
- Easier to maintain and extend

**Implementation**:
```javascript
// Dispatch event when cart updates
document.dispatchEvent(new CustomEvent('cart:updated', {
  detail: { itemCount: newCount }
}));

// Listen in header
document.addEventListener('cart:updated', (e) => {
  updateCartBadge(e.detail.itemCount);
});
```

### Decision 5: Sticky Header - Show on Scroll Up Pattern

**Choice**: Header hides when scrolling down, shows when scrolling up

**Rationale**:
- Maximizes content visibility when reading down
- Keeps navigation accessible when user wants to navigate
- Common pattern in modern websites (better UX research)
- Small header footprint doesn't warrant always-visible

**Alternatives Considered**:
- Always sticky - Takes vertical space, especially on mobile
- Never sticky - Navigation requires scroll to top
- Transparent on top - Only works for specific layouts

**Implementation Details**:
- Use `IntersectionObserver` for scroll detection (better performance)
- Throttle scroll events to 60fps max
- `position: sticky` with `top: 0`
- Add shadow/border when scrolled for visual separation

### Decision 6: Accessibility - Progressive Enhancement

**Choice**: Start with semantic HTML, enhance with JavaScript

**Rationale**:
- Works without JavaScript (search redirects to search page)
- Screen reader friendly from the start
- Keyboard navigation built-in with proper HTML
- ARIA attributes added progressively

**Accessibility Checklist**:
- [ ] Semantic HTML (`<nav>`, `<button>`, `<a>`)
- [ ] ARIA labels for icon-only buttons
- [ ] Keyboard navigation (Tab, Enter, ESC)
- [ ] Focus management (mobile menu, search modal)
- [ ] Screen reader announcements (cart count, menu state)
- [ ] Color contrast (WCAG AA: 4.5:1 minimum)
- [ ] Touch targets (44px minimum on mobile)

## Risks / Trade-offs

### Risk 1: Mobile Menu Complexity
**Risk**: Slide-out drawer animation may be janky on low-end devices
**Mitigation**: 
- Use CSS transforms (hardware-accelerated)
- `will-change` property for animation hint
- Reduce motion on `prefers-reduced-motion`
- Test on low-end Android devices

### Risk 2: Search Modal Performance
**Risk**: Modal open/close may cause layout shift
**Mitigation**:
- Use native `<dialog>` element (optimized by browser)
- Prevent body scroll with `overflow: hidden`
- Load modal content on first open (lazy initialization)

### Risk 3: Cart Count Sync
**Risk**: Cart count may get out of sync across page
**Mitigation**:
- Single source of truth (cart API response)
- Event-driven updates (any cart change fires event)
- Fallback to full page reload on error

### Risk 4: Customization Complexity
**Risk**: Too many theme settings may overwhelm merchants
**Mitigation**:
- Provide 3 preset styles (Minimal, Modern, Bold)
- Group settings logically in theme editor
- Use sensible defaults that work well
- Add `info` tooltips for complex settings

## Migration Plan

### Phase 1: Core Implementation (This Change)
1. Build new header structure with responsive layout
2. Implement mobile drawer navigation
3. Add search modal functionality
4. Integrate cart count display
5. Add theme editor settings

### Phase 2: Enhancement (Future Changes)
1. Predictive search suggestions
2. Mega menu support for large catalogs
3. Currency/language selectors
4. Announcement bar integration
5. Transparent header option for homepage

### Rollback Plan
If critical issues arise:
1. Git revert to previous header version
2. Previous header still available in theme version history
3. No database/settings migration required
4. Merchants can roll back via theme editor versions

## Open Questions

1. **Q**: Should we support multiple navigation menus (e.g., utility nav)?
   **A**: Not in this change. Single main menu keeps it simple. Can add in future.

2. **Q**: Should account icon show when customer accounts are disabled?
   **A**: No. Conditionally render based on `shop.customer_accounts_enabled`.

3. **Q**: What about promotional announcement bar?
   **A**: Separate section. Header should focus on navigation only.

4. **Q**: Should logo support both image and text at same time?
   **A**: No. Either image (if uploaded) OR store name. Keeps layout predictable.

5. **Q**: How to handle very long navigation menu (10+ items)?
   **A**: Desktop will wrap if needed. Mobile drawer scrolls. Future enhancement: mega menu.

