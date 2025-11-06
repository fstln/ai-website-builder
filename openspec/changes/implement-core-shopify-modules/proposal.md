# Change: Implement Core Shopify Theme Modules

## Why

当前主题缺少核心 Shopify 商店功能的完整实现。虽然已有 header 和 footer 的基础结构，但缺少关键的产品展示、购物车、博客、搜索等核心模块。这些模块对于一个完整的 DTC (Direct-to-Consumer) Shopify 主题至关重要，需要实现：

1. **产品详情页 (main-product)** - 完整的产品展示，包括图片画廊、变体选择、购买功能
2. **购物车 (main-cart)** - 购物车管理和结账流程
3. **博客列表 (main-blog)** - 博客文章列表展示
4. **文章详情 (main-article)** - 单篇博客文章展示
5. **静态页面 (main-page)** - 通用页面内容展示
6. **搜索结果 (main-search)** - 产品和内容搜索功能

这些模块必须参考 `horizon-referrence` 中的实现模式，特别是核心购买功能的逻辑，同时采用现代化 DTC 审美，使用 Tailwind CSS 构建响应式界面，使用 Web Components 处理交互逻辑。

## What Changes

### 1. Product Page Module (main-product)
- **Enhance existing** `sections/main-product.liquid` with:
  - Image gallery with thumbnail navigation (Web Component)
  - Variant selector with color/size swatches (Web Component)
  - Quantity selector
  - Add to cart functionality (reference horizon cart logic)
  - Product meta information (SKU, availability, etc.)
  - Accordion for description/specs
  - Related products section
  - Modern DTC styling with Tailwind

### 2. Cart Page Module (main-cart)
- **Enhance existing** `sections/main-cart.liquid` with:
  - Cart items with quantity adjustment (Web Component)
  - Remove items functionality
  - Cart total calculation
  - Promo code input
  - Shipping calculator
  - Cart recommendations
  - Empty cart state
  - Cart update logic (reference horizon cart API patterns)

### 3. Blog Listing Module (main-blog)
- **Enhance existing** `sections/main-blog.liquid` with:
  - Blog post card grid
  - Featured image handling
  - Excerpt display
  - Author and date metadata
  - Pagination
  - Filter by tags (Web Component)
  - Responsive grid layout

### 4. Article Detail Module (main-article)
- **Enhance existing** `sections/main-article.liquid` with:
  - Article hero image
  - Rich text content rendering
  - Author bio section
  - Social share buttons (Web Component)
  - Related articles
  - Comments section (if enabled)
  - Reading progress indicator (Web Component)

### 5. Page Module (main-page)
- **Enhance existing** `sections/main-page.liquid` with:
  - Flexible content container
  - Support for rich text
  - Contact form integration (if applicable)
  - Breadcrumbs
  - Table of contents for long content (Web Component)

### 6. Search Module (main-search)
- **Enhance existing** `sections/main-search.liquid` with:
  - Search form with autocomplete (Web Component)
  - Results grid (products, articles, pages)
  - Filter by type
  - Sort options
  - No results state
  - Search suggestions

### 7. Web Components
- Create new components in `src/js/`:
  - `product-gallery.js` - Image gallery with zoom
  - `variant-selector.js` - Product variant selection
  - `cart-drawer.js` - Mini cart drawer
  - `cart-items.js` - Cart item management
  - `quantity-selector.js` - Product quantity control
  - `search-autocomplete.js` - Search suggestions
  - `article-share.js` - Social sharing
  - `reading-progress.js` - Article progress bar
  - `tag-filter.js` - Blog tag filtering

### 8. Supporting Snippets
- Create new snippets in `snippets/`:
  - `product-form.liquid` - Product purchase form
  - `cart-item.liquid` - Single cart item
  - `blog-card.liquid` - Blog post card
  - `product-badge.liquid` - Sale/new badges
  - `star-rating.liquid` - Product ratings

### 9. Localization
- Add translation keys to `locales/en.default.json`:
  - Product-related strings
  - Cart messages
  - Blog labels
  - Search prompts
  - Form labels

## Impact

### Affected Capabilities
- **E-commerce Core**: Complete product browsing and purchasing flow
- **Content Management**: Blog and page display systems
- **Search & Discovery**: Product and content search functionality
- **User Experience**: Modern, accessible, responsive interfaces

### Affected Code
- `sections/main-product.liquid` - Major enhancement
- `sections/main-cart.liquid` - Major enhancement  
- `sections/main-blog.liquid` - Major enhancement
- `sections/main-article.liquid` - Major enhancement
- `sections/main-page.liquid` - Enhancement
- `sections/main-search.liquid` - Major enhancement
- `src/js/modules/` - New Web Components
- `snippets/` - New supporting snippets
- `locales/en.default.json` - New translations
- `src/css/tailwind.css` - Component styles

### Dependencies
- Requires `horizon-referrence` sections as implementation reference
- Must maintain compatibility with existing header/footer
- Follows project Tailwind CSS and Web Components patterns
- Implements WCAG 2.2 accessibility standards

### Breaking Changes
**NONE** - This is an additive change that enhances existing placeholder sections

### Performance Considerations
- Lazy load product images
- Optimize Web Component bundle size
- Use Shopify's section rendering for performance
- Implement progressive enhancement
- Code splitting for module-specific JS

### Accessibility
- All components must meet WCAG 2.2 AA standards
- Keyboard navigation support
- Screen reader compatibility  
- Focus management for interactive elements
- Proper ARIA attributes
- Color contrast compliance

