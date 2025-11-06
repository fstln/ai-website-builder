# Tasks: Implement Core Shopify Modules

## 1. Foundation Setup
- [ ] 1.1 Create Web Component utilities in `src/js/utils/`
  - [ ] 1.1.1 Cart API wrapper (`cart-api.js`)
  - [ ] 1.1.2 Money formatting helper (`format-money.js`)
  - [ ] 1.1.3 Image helper utilities (`image-utils.js`)
- [ ] 1.2 Add core translations to `locales/en.default.json`
  - [ ] 1.2.1 Product-related strings
  - [ ] 1.2.2 Cart messages  
  - [ ] 1.2.3 Blog labels
  - [ ] 1.2.4 Search prompts
  - [ ] 1.2.5 Form labels and validation messages
- [ ] 1.3 Create base snippets in `snippets/`
  - [ ] 1.3.1 `product-badge.liquid` - Sale/new badges
  - [ ] 1.3.2 `star-rating.liquid` - Product ratings display
  - [ ] 1.3.3 `quantity-input.liquid` - Reusable quantity selector

## 2. Product Gallery Component
- [ ] 2.1 Create `src/js/components/product-gallery.js`
  - [ ] 2.1.1 Main image display with aspect ratio
  - [ ] 2.1.2 Thumbnail navigation
  - [ ] 2.1.3 Keyboard controls (arrow keys)
  - [ ] 2.1.4 Touch gesture support (swipe)
  - [ ] 2.1.5 Image zoom functionality
  - [ ] 2.1.6 Lazy loading for thumbnails
  - [ ] 2.1.7 ARIA labels and accessibility
  - [ ] 2.1.8 Loading states and error handling
- [ ] 2.2 Add gallery styles with Tailwind utilities
- [ ] 2.3 Test responsive behavior (mobile/tablet/desktop)
- [ ] 2.4 Test accessibility with screen reader

## 3. Variant Selector Component
- [ ] 3.1 Create `src/js/components/variant-selector.js`
  - [ ] 3.1.1 Parse product JSON data
  - [ ] 3.1.2 Render variant options (dropdowns/buttons/swatches)
  - [ ] 3.1.3 Handle variant selection changes
  - [ ] 3.1.4 Update price on variant change
  - [ ] 3.1.5 Update availability status
  - [ ] 3.1.6 Sync with product gallery images
  - [ ] 3.1.7 Handle unavailable combinations
  - [ ] 3.1.8 Form validation
  - [ ] 3.1.9 Accessible color swatches (with labels)
- [ ] 3.2 Create `snippets/variant-picker.liquid`
- [ ] 3.3 Style variant options (color swatches, size buttons)
- [ ] 3.4 Test all variant combinations
- [ ] 3.5 Test keyboard navigation

## 4. Product Form & Add to Cart
- [ ] 4.1 Create `snippets/product-form.liquid`
  - [ ] 4.1.1 Product form structure
  - [ ] 4.1.2 Quantity selector integration
  - [ ] 4.1.3 Add to cart button
  - [ ] 4.1.4 Dynamic pricing display
  - [ ] 4.1.5 Inventory status messages
- [ ] 4.2 Create `src/js/components/add-to-cart.js`
  - [ ] 4.2.1 Handle form submission
  - [ ] 4.2.2 Call Shopify Cart API
  - [ ] 4.2.3 Show loading state
  - [ ] 4.2.4 Display success/error messages
  - [ ] 4.2.5 Dispatch cart:item-added event
  - [ ] 4.2.6 Optimistic UI updates
- [ ] 4.3 Style add to cart button with loading states
- [ ] 4.4 Test error scenarios (out of stock, network error)

## 5. Enhanced Main Product Section
- [ ] 5.1 Update `sections/main-product.liquid`
  - [ ] 5.1.1 Integrate product gallery component
  - [ ] 5.1.2 Add variant selector component
  - [ ] 5.1.3 Include product form
  - [ ] 5.1.4 Add product meta info (SKU, vendor, tags)
  - [ ] 5.1.5 Create description accordion
  - [ ] 5.1.6 Add specifications section
  - [ ] 5.1.7 Include shipping/returns info
  - [ ] 5.1.8 Add structured data (JSON-LD)
- [ ] 5.2 Style with Tailwind (modern DTC aesthetic)
- [ ] 5.3 Implement responsive layout (mobile/tablet/desktop)
- [ ] 5.4 Add schema settings for theme editor
- [ ] 5.5 Test product page rendering with various products
- [ ] 5.6 Test accessibility compliance

## 6. Cart Items Component
- [ ] 6.1 Create `src/js/components/cart-items.js`
  - [ ] 6.1.1 Render cart items from Shopify cart
  - [ ] 6.1.2 Quantity adjustment (increase/decrease)
  - [ ] 6.1.3 Remove item functionality
  - [ ] 6.1.4 Update cart totals
  - [ ] 6.1.5 Handle cart API errors
  - [ ] 6.1.6 Show loading states
  - [ ] 6.1.7 Optimistic UI updates
  - [ ] 6.1.8 Dispatch cart:updated events
- [ ] 6.2 Create `snippets/cart-item.liquid`
  - [ ] 6.2.1 Item image
  - [ ] 6.2.2 Product title and variant
  - [ ] 6.2.3 Price display
  - [ ] 6.2.4 Quantity controls
  - [ ] 6.2.5 Remove button
  - [ ] 6.2.6 Line item properties (if any)
- [ ] 6.3 Style cart items with Tailwind
- [ ] 6.4 Test quantity updates
- [ ] 6.5 Test remove functionality

## 7. Enhanced Main Cart Section
- [ ] 7.1 Update `sections/main-cart.liquid`
  - [ ] 7.1.1 Integrate cart-items component
  - [ ] 7.1.2 Add cart totals display
  - [ ] 7.1.3 Include discount code input
  - [ ] 7.1.4 Add shipping calculator (if enabled)
  - [ ] 7.1.5 Create checkout button
  - [ ] 7.1.6 Add cart recommendations section
  - [ ] 7.1.7 Empty cart state with CTA
  - [ ] 7.1.8 Cart note textarea (optional)
- [ ] 7.2 Style cart page layout
- [ ] 7.3 Implement responsive design
- [ ] 7.4 Add schema settings
- [ ] 7.5 Test empty cart state
- [ ] 7.6 Test with multiple items

## 8. Cart Drawer Component (Mini Cart)
- [ ] 8.1 Create `src/js/components/cart-drawer.js`
  - [ ] 8.1.1 Drawer open/close logic
  - [ ] 8.1.2 Focus trap when open
  - [ ] 8.1.3 Close on ESC key
  - [ ] 8.1.4 Close on backdrop click
  - [ ] 8.1.5 Display cart items
  - [ ] 8.1.6 Show cart total
  - [ ] 8.1.7 Checkout button
  - [ ] 8.1.8 "View Cart" link
  - [ ] 8.1.9 Listen to cart:updated events
  - [ ] 8.1.10 ARIA dialog pattern implementation
- [ ] 8.2 Create `snippets/cart-drawer.liquid`
- [ ] 8.3 Style drawer with slide-in animation
- [ ] 8.4 Add drawer trigger in header
- [ ] 8.5 Test drawer accessibility
- [ ] 8.6 Test on mobile devices

## 9. Blog Post Card Snippet
- [ ] 9.1 Create `snippets/blog-card.liquid`
  - [ ] 9.1.1 Featured image with aspect ratio
  - [ ] 9.1.2 Article title
  - [ ] 9.1.3 Excerpt/summary
  - [ ] 9.1.4 Author and date
  - [ ] 9.1.5 Read more link
  - [ ] 9.1.6 Tag display
- [ ] 9.2 Style with Tailwind (card design)
- [ ] 9.3 Add hover effects
- [ ] 9.4 Make image lazy-loaded

## 10. Enhanced Main Blog Section
- [ ] 10.1 Update `sections/main-blog.liquid`
  - [ ] 10.1.1 Blog header with title
  - [ ] 10.1.2 Grid layout for blog cards
  - [ ] 10.1.3 Integrate blog-card snippet
  - [ ] 10.1.4 Add pagination controls
  - [ ] 10.1.5 Tag filter sidebar/dropdown
  - [ ] 10.1.6 Empty state (no posts)
- [ ] 10.2 Implement responsive grid (1/2/3 columns)
- [ ] 10.3 Style pagination
- [ ] 10.4 Add schema settings (posts per page, layout)
- [ ] 10.5 Test with various article counts
- [ ] 10.6 Test pagination

## 11. Tag Filter Component
- [ ] 11.1 Create `src/js/components/tag-filter.js`
  - [ ] 11.1.1 Render available tags
  - [ ] 11.1.2 Handle tag selection
  - [ ] 11.1.3 Update URL with selected tag
  - [ ] 11.1.4 Active tag highlighting
  - [ ] 11.1.5 "Clear filter" option
  - [ ] 11.1.6 Keyboard navigation
- [ ] 11.2 Style tag buttons/pills
- [ ] 11.3 Test filtering functionality

## 12. Enhanced Main Article Section
- [ ] 12.1 Update `sections/main-article.liquid`
  - [ ] 12.1.1 Article hero image
  - [ ] 12.1.2 Title and metadata (author, date)
  - [ ] 12.1.3 Content with proper typography
  - [ ] 12.1.4 Social share buttons
  - [ ] 12.1.5 Tag links
  - [ ] 12.1.6 Author bio section
  - [ ] 12.1.7 Related articles section
  - [ ] 12.1.8 Comments section (if enabled)
  - [ ] 12.1.9 Reading progress indicator
  - [ ] 12.1.10 Structured data (JSON-LD)
- [ ] 12.2 Style article content (prose styles)
- [ ] 12.3 Implement responsive layout
- [ ] 12.4 Add schema settings
- [ ] 12.5 Test with short and long articles

## 13. Article Components
- [ ] 13.1 Create `src/js/components/article-share.js`
  - [ ] 13.1.1 Share to Twitter/X
  - [ ] 13.1.2 Share to Facebook
  - [ ] 13.1.3 Share to LinkedIn
  - [ ] 13.1.4 Copy link to clipboard
  - [ ] 13.1.5 Share via email
  - [ ] 13.1.6 Success feedback
- [ ] 13.2 Create `src/js/components/reading-progress.js`
  - [ ] 13.2.1 Calculate reading progress
  - [ ] 13.2.2 Update progress bar
  - [ ] 13.2.3 Fixed position on scroll
  - [ ] 13.2.4 Smooth animation
- [ ] 13.3 Style share buttons
- [ ] 13.4 Style progress bar

## 14. Enhanced Main Page Section
- [ ] 14.1 Update `sections/main-page.liquid`
  - [ ] 14.1.1 Page title with optional subtitle
  - [ ] 14.1.2 Rich text content container
  - [ ] 14.1.3 Breadcrumb navigation
  - [ ] 14.1.4 Table of contents (for long pages)
  - [ ] 14.1.5 Contact form integration (if applicable)
  - [ ] 14.1.6 Optional sidebar
- [ ] 14.2 Style page content (prose styles)
- [ ] 14.3 Implement responsive layout
- [ ] 14.4 Add schema settings (layout options)
- [ ] 14.5 Test with various page types (about, contact, FAQ)

## 15. Search Autocomplete Component
- [ ] 15.1 Create `src/js/components/search-autocomplete.js`
  - [ ] 15.1.1 Input debouncing (300ms)
  - [ ] 15.1.2 Call Predictive Search API
  - [ ] 15.1.3 Render product suggestions
  - [ ] 15.1.4 Render article suggestions
  - [ ] 15.1.5 Render collection suggestions
  - [ ] 15.1.6 Keyboard navigation (arrow keys)
  - [ ] 15.1.7 Handle selection (Enter key)
  - [ ] 15.1.8 Close on ESC or outside click
  - [ ] 15.1.9 Loading state
  - [ ] 15.1.10 Empty results state
  - [ ] 15.1.11 ARIA combobox pattern
- [ ] 15.2 Style suggestion dropdown
- [ ] 15.3 Test autocomplete functionality
- [ ] 15.4 Test accessibility

## 16. Enhanced Main Search Section
- [ ] 16.1 Update `sections/main-search.liquid`
  - [ ] 16.1.1 Search form with autocomplete
  - [ ] 16.1.2 Results count display
  - [ ] 16.1.3 Filter by result type (products/articles/pages)
  - [ ] 16.1.4 Sort options dropdown
  - [ ] 16.1.5 Products grid
  - [ ] 16.1.6 Articles list
  - [ ] 16.1.7 Pages list
  - [ ] 16.1.8 No results state with suggestions
  - [ ] 16.1.9 Pagination for results
  - [ ] 16.1.10 Search term highlighting
- [ ] 16.2 Implement responsive layout
- [ ] 16.3 Style search results
- [ ] 16.4 Add schema settings
- [ ] 16.5 Test search functionality
- [ ] 16.6 Test with no results

## 17. Quantity Selector Component
- [ ] 17.1 Create `src/js/components/quantity-selector.js`
  - [ ] 17.1.1 Increment button
  - [ ] 17.1.2 Decrement button
  - [ ] 17.1.3 Manual input validation
  - [ ] 17.1.4 Min/max constraints
  - [ ] 17.1.5 Dispatch change events
  - [ ] 17.1.6 Keyboard support (arrow keys)
  - [ ] 17.1.7 ARIA labels
- [ ] 17.2 Style quantity controls
- [ ] 17.3 Test edge cases (min=1, max inventory)

## 18. Cross-Component Integration
- [ ] 18.1 Test cart event system
  - [ ] 18.1.1 Add to cart updates header badge
  - [ ] 18.1.2 Cart changes update drawer
  - [ ] 18.1.3 Cart page syncs with drawer
- [ ] 18.2 Test variant selection updates gallery
- [ ] 18.3 Verify all components dispatch events correctly
- [ ] 18.4 Test component cleanup on disconnect

## 19. Styling & Polish
- [ ] 19.1 Review all sections for visual consistency
- [ ] 19.2 Ensure Tailwind classes follow project conventions
- [ ] 19.3 Add focus styles to all interactive elements
- [ ] 19.4 Verify color contrast ratios (WCAG AA)
- [ ] 19.5 Add loading states to all async operations
- [ ] 19.6 Implement error messages for all failure states
- [ ] 19.7 Add smooth transitions and animations
- [ ] 19.8 Respect `prefers-reduced-motion`

## 20. Accessibility Audit
- [ ] 20.1 Test keyboard navigation on all pages
  - [ ] 20.1.1 Product page
  - [ ] 20.1.2 Cart page
  - [ ] 20.1.3 Blog page
  - [ ] 20.1.4 Article page
  - [ ] 20.1.5 Search page
- [ ] 20.2 Test with screen reader (VoiceOver/NVDA)
- [ ] 20.3 Verify ARIA attributes
- [ ] 20.4 Check focus management in modals/drawers
- [ ] 20.5 Validate semantic HTML structure
- [ ] 20.6 Test with keyboard-only navigation
- [ ] 20.7 Run automated accessibility tools (axe DevTools)

## 21. Responsive Testing
- [ ] 21.1 Test on mobile devices (320px - 767px)
- [ ] 21.2 Test on tablets (768px - 1023px)
- [ ] 21.3 Test on desktop (1024px+)
- [ ] 21.4 Test on large screens (1440px+)
- [ ] 21.5 Verify touch interactions on mobile
- [ ] 21.6 Test landscape orientation on mobile/tablet

## 22. Performance Optimization
- [ ] 22.1 Lazy load images below the fold
- [ ] 22.2 Defer non-critical JavaScript
- [ ] 22.3 Optimize Web Component bundle sizes
- [ ] 22.4 Test Core Web Vitals
  - [ ] 22.4.1 Largest Contentful Paint (LCP)
  - [ ] 22.4.2 First Input Delay (FID)
  - [ ] 22.4.3 Cumulative Layout Shift (CLS)
- [ ] 22.5 Minify and compress assets
- [ ] 22.6 Test page load speed (< 3s on 3G)

## 23. Cross-Browser Testing
- [ ] 23.1 Test in Chrome/Edge
- [ ] 23.2 Test in Firefox
- [ ] 23.3 Test in Safari (desktop and iOS)
- [ ] 23.4 Test in Samsung Internet
- [ ] 23.5 Verify Web Component support
- [ ] 23.6 Test polyfills (if needed)

## 24. Theme Editor Testing
- [ ] 24.1 Verify all sections appear in theme editor
- [ ] 24.2 Test schema settings for each section
- [ ] 24.3 Verify section rearrangement works
- [ ] 24.4 Test block adding/removing (where applicable)
- [ ] 24.5 Verify preview updates in real-time
- [ ] 24.6 Test with different color schemes

## 25. Documentation
- [ ] 25.1 Document Web Component APIs
- [ ] 25.2 Add JSDoc comments to all public methods
- [ ] 25.3 Document cart event system
- [ ] 25.4 Update README with new features
- [ ] 25.5 Create merchant guide for customization
- [ ] 25.6 Document theme settings

## 26. Final Validation
- [ ] 26.1 Run Shopify Theme Check
- [ ] 26.2 Validate all Liquid syntax
- [ ] 26.3 Check for console errors
- [ ] 26.4 Verify no broken images/links
- [ ] 26.5 Test with real product data
- [ ] 26.6 Test with edge cases (long names, many variants, etc.)
- [ ] 26.7 Verify translation keys exist
- [ ] 26.8 Check bundle sizes (CSS < 15KB, JS < 5KB per module)

## 27. Deployment Preparation
- [ ] 27.1 Build production assets (Vite)
- [ ] 27.2 Commit built assets to repo
- [ ] 27.3 Test theme in Shopify preview
- [ ] 27.4 Create theme backup before deploy
- [ ] 27.5 Deploy to development theme
- [ ] 27.6 Final smoke test on live theme

