# Data Model: Minimal Shopify Theme Template Framework

**Feature**: 001-minimal-shopify-theme  
**Date**: November 4, 2025  
**Purpose**: Define theme entities, file structure, and relationships for Shopify Theme 1.0 architecture

## Overview

This data model defines the entities that make up a Shopify theme using Theme 1.0 architecture. Unlike traditional application data models with database entities, Shopify themes consist of file-based entities that define the structure, appearance, and behavior of an online store.

## Core Entities

### 1. Layout Templates

**Purpose**: Define the overall HTML structure and wrapper for all pages.

**Entity**: Layout  
**Location**: `/layout/*.liquid`  
**Cardinality**: 1-3 layouts per theme (typically just `theme.liquid` and `password.liquid`)

**Structure**:
```liquid
<!-- layout/theme.liquid -->
<!DOCTYPE html>
<html>
  <head>
    {{ content_for_header }}  <!-- Shopify required content -->
    <link rel="stylesheet" href="{{ 'theme.css' | asset_url }}">
  </head>
  <body>
    {% sections 'header' %}    <!-- Header section -->
    
    <main>
      {{ content_for_layout }} <!-- Page-specific content -->
    </main>
    
    {% sections 'footer' %}    <!-- Footer section -->
    
    <script src="{{ 'theme.js' | asset_url }}" defer></script>
  </body>
</html>
```

**Key Attributes**:
- `content_for_header`: Required Shopify meta tags and scripts
- `content_for_layout`: Placeholder for page template content
- Section references: Reusable sections (header, footer)
- Asset references: Links to CSS and JavaScript files

**Relationships**:
- One Layout → Many Page Templates
- One Layout → Many Sections (via section references)
- One Layout → Many Assets (via asset filters)

---

### 2. Page Templates

**Purpose**: Define the structure and content for specific page types.

**Entity**: Template  
**Location**: `/templates/*.liquid`  
**Cardinality**: 9-15 templates per theme (one per major page type)

**Required Templates**:
1. `index.liquid` - Homepage
2. `product.liquid` - Product detail page
3. `collection.liquid` - Collection listing page
4. `cart.liquid` - Shopping cart
5. `page.liquid` - Static content pages (About, Contact, etc.)
6. `blog.liquid` - Blog listing
7. `article.liquid` - Individual blog post
8. `search.liquid` - Search results
9. `404.liquid` - Not found page

**Optional Templates**:
- `customers/login.liquid` - Customer login
- `customers/register.liquid` - Customer registration
- `customers/account.liquid` - Customer account dashboard
- `list-collections.liquid` - All collections listing
- `gift_card.liquid` - Gift card display

**Structure Example**:
```liquid
<!-- templates/product.liquid -->
<div class="product-page">
  <div class="product-media">
    {% render 'product-images', product: product %}
  </div>
  
  <div class="product-info">
    <h1>{{ product.title }}</h1>
    <div class="price">{{ product.price | money }}</div>
    
    {% form 'product', product %}
      {% render 'product-form', product: product %}
    {% endform %}
  </div>
  
  {% section 'product-recommendations' %}
</div>
```

**Key Attributes**:
- Template-specific variables (e.g., `product`, `collection`, `cart`)
- Form tags (for cart, customer, etc.)
- Snippet renders (reusable components)
- Section includes (dynamic content blocks)

**Relationships**:
- One Template → One Layout (via layout assignment)
- One Template → Many Snippets (via render tags)
- One Template → Many Sections (via section tags)

---

### 3. Sections

**Purpose**: Reusable, customizable content blocks that merchants can configure via Theme Editor.

**Entity**: Section  
**Location**: `/sections/*.liquid`  
**Cardinality**: 8-15 sections per minimal theme

**Core Sections**:
1. `header.liquid` - Site navigation and branding
2. `footer.liquid` - Site footer with links and info
3. `hero.liquid` - Homepage hero banner
4. `featured-products.liquid` - Product showcase
5. `featured-collection.liquid` - Collection highlight
6. `newsletter.liquid` - Email signup form
7. `testimonials.liquid` - Customer reviews
8. `rich-text.liquid` - Customizable text content

**Structure**:
```liquid
<!-- sections/featured-products.liquid -->
<div class="featured-products">
  <h2>{{ section.settings.heading }}</h2>
  
  <div class="product-grid">
    {% for product in section.settings.collection.products limit: section.settings.product_count %}
      {% render 'product-card', product: product %}
    {% endfor %}
  </div>
</div>

{% schema %}
{
  "name": "Featured Products",
  "tag": "section",
  "class": "featured-products-section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Featured Products"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    },
    {
      "type": "range",
      "id": "product_count",
      "min": 2,
      "max": 12,
      "step": 2,
      "default": 4,
      "label": "Products to show"
    }
  ],
  "presets": [
    {
      "name": "Featured Products",
      "category": "Products"
    }
  ]
}
{% endschema %}
```

**Key Attributes**:
- `section.settings`: Merchant-configurable settings
- `section.blocks`: Repeatable content blocks (optional)
- `{% schema %}`: JSON configuration for Theme Editor
- Presets: Default configurations for quick adding

**Relationships**:
- Many Sections → One Schema Definition (embedded)
- One Section → Many Snippets (via render tags)
- One Section → Many Settings (defined in schema)

---

### 4. Snippets

**Purpose**: Small, reusable components that can be included in templates, sections, or other snippets.

**Entity**: Snippet  
**Location**: `/snippets/*.liquid`  
**Cardinality**: 10-20 snippets per minimal theme

**Common Snippets**:
1. `product-card.liquid` - Product display card
2. `icon.liquid` - SVG icon renderer
3. `image.liquid` - Responsive image wrapper
4. `breadcrumbs.liquid` - Navigation breadcrumb trail
5. `pagination.liquid` - Page navigation controls
6. `social-sharing.liquid` - Social media share buttons
7. `price.liquid` - Price formatting component
8. `quantity-selector.liquid` - Quantity input control

**Structure Example**:
```liquid
<!-- snippets/product-card.liquid -->
{% comment %}
  Renders a product card
  
  Usage:
  {% render 'product-card', product: product, show_vendor: true %}
  
  Parameters:
  - product: {Object} Product object
  - show_vendor: {Boolean} Display vendor name (optional)
  - image_ratio: {String} Image aspect ratio (optional)
{% endcomment %}

<div class="product-card">
  <a href="{{ product.url }}" class="product-card__link">
    <div class="product-card__image">
      {% if product.featured_image %}
        <img
          src="{{ product.featured_image | image_url: width: 400 }}"
          alt="{{ product.featured_image.alt | escape }}"
          loading="lazy"
          width="400"
          height="{{ 400 | divided_by: product.featured_image.aspect_ratio | round }}"
        >
      {% endif %}
    </div>
    
    <div class="product-card__info">
      {% if show_vendor %}
        <div class="product-card__vendor">{{ product.vendor }}</div>
      {% endif %}
      
      <h3 class="product-card__title">{{ product.title }}</h3>
      
      {% render 'price', product: product %}
    </div>
  </a>
</div>
```

**Key Attributes**:
- Input parameters (passed via render tag)
- Liquid logic (conditional rendering, loops)
- HTML structure (reusable markup)
- Documentation comments (usage instructions)

**Relationships**:
- Many Snippets → Many Templates (via render tags)
- Many Snippets → Many Sections (via render tags)
- Snippets can render other Snippets (composition)

---

### 5. Assets

**Purpose**: Static files (CSS, JavaScript, images, fonts) used by the theme.

**Entity**: Asset  
**Location**: `/assets/*.*`  
**Cardinality**: 10-30 files per minimal theme

**Asset Categories**:

1. **Stylesheets**:
   - `theme.css` - Main compiled stylesheet (Vite output)
   - `critical.css` - Inline critical styles (optional)

2. **JavaScript**:
   - `theme.js` - Main bundled script (Vite output)
   - `theme.js.map` - Source map for debugging (optional)

3. **Images**:
   - `placeholder.svg` - Default product image
   - `logo.svg` - Site logo
   - `favicon.ico` - Browser favicon

4. **Fonts** (optional):
   - Custom web fonts if not using system fonts

**Build Artifacts** (Generated by Vite):
```javascript
// Before build (source)
src/css/tailwind.css  → assets/theme.css
src/js/main.js        → assets/theme.js

// Build process
1. Vite reads src/ files
2. Tailwind processes and purges CSS
3. JavaScript modules bundled and minified
4. Output written to assets/ directory
5. GitHub Actions commits built assets
6. Shopify deploys via GitHub integration
```

**Key Attributes**:
- File name (used in asset_url filter)
- MIME type (CSS, JS, image, font)
- Size (monitored for performance)
- Cache behavior (handled by Shopify CDN)

**Relationships**:
- Many Assets → Many Layouts (via asset_url filter)
- Many Assets → Many Templates (via asset_url filter)
- Many Assets → Many Sections (via asset_url filter)

---

### 6. Configuration

**Purpose**: Theme settings and customization options accessible via Shopify admin.

**Entity**: Configuration  
**Location**: `/config/*.json`  
**Cardinality**: 2 files (settings_schema.json, settings_data.json)

#### 6.1 Settings Schema

**File**: `config/settings_schema.json`  
**Purpose**: Defines customizable theme settings for merchants

**Structure**:
```json
[
  {
    "name": "theme_info",
    "theme_name": "Minimal Theme",
    "theme_version": "1.0.0",
    "theme_author": "Your Name",
    "theme_documentation_url": "https://github.com/user/repo",
    "theme_support_url": "https://github.com/user/repo/issues"
  },
  {
    "name": "Colors",
    "settings": [
      {
        "type": "color",
        "id": "color_primary",
        "label": "Primary Color",
        "default": "#000000"
      },
      {
        "type": "color",
        "id": "color_secondary",
        "label": "Secondary Color",
        "default": "#666666"
      }
    ]
  },
  {
    "name": "Typography",
    "settings": [
      {
        "type": "font_picker",
        "id": "font_heading",
        "label": "Heading Font",
        "default": "helvetica_n7"
      },
      {
        "type": "font_picker",
        "id": "font_body",
        "label": "Body Font",
        "default": "helvetica_n4"
      }
    ]
  },
  {
    "name": "Layout",
    "settings": [
      {
        "type": "range",
        "id": "layout_max_width",
        "min": 1000,
        "max": 1600,
        "step": 50,
        "unit": "px",
        "label": "Max Content Width",
        "default": 1200
      }
    ]
  }
]
```

**Setting Types**:
- `text`: Short text input
- `textarea`: Multi-line text
- `richtext`: HTML editor
- `color`: Color picker
- `font_picker`: Shopify font selector
- `range`: Numeric slider
- `select`: Dropdown menu
- `checkbox`: Boolean toggle
- `radio`: Radio button group
- `image_picker`: Image upload
- `collection`: Collection selector
- `product`: Product selector
- `blog`: Blog selector
- `page`: Page selector
- `url`: URL input

#### 6.2 Settings Data

**File**: `config/settings_data.json`  
**Purpose**: Stores current theme setting values

**Structure**:
```json
{
  "current": {
    "color_primary": "#121212",
    "color_secondary": "#4A5568",
    "font_heading": "helvetica_n7",
    "font_body": "helvetica_n4",
    "layout_max_width": 1200,
    "sections": {
      "header": {
        "type": "header",
        "settings": {
          "logo": "shopify://shop_images/logo.png",
          "logo_width": 150
        }
      },
      "footer": {
        "type": "footer",
        "settings": {
          "show_social_icons": true
        }
      }
    }
  },
  "presets": {
    "Default": {
      "color_primary": "#000000",
      "color_secondary": "#666666"
    }
  }
}
```

**Relationships**:
- One Settings Schema → One Settings Data file
- Settings accessible via `settings` object in Liquid
- Section settings stored in settings_data.json

---

### 7. Localization

**Purpose**: Multi-language support and translatable strings.

**Entity**: Locale  
**Location**: `/locales/*.json`  
**Cardinality**: 1+ locale files (en.default.json required)

**Structure**:
```json
{
  "general": {
    "404": {
      "title": "Page not found",
      "subtitle": "The page you requested does not exist."
    },
    "search": {
      "search": "Search",
      "no_results": "No results found for \"{{ terms }}\"."
    },
    "cart": {
      "title": "Shopping Cart",
      "subtotal": "Subtotal",
      "checkout": "Checkout",
      "empty": "Your cart is empty"
    }
  },
  "products": {
    "product": {
      "add_to_cart": "Add to cart",
      "sold_out": "Sold out",
      "unavailable": "Unavailable",
      "vendor": "Vendor",
      "quantity": "Quantity"
    }
  },
  "customer": {
    "login": {
      "title": "Login",
      "email": "Email",
      "password": "Password"
    }
  }
}
```

**Usage in Liquid**:
```liquid
{{ 'products.product.add_to_cart' | t }}
{{ 'general.search.no_results' | t: terms: search.terms }}
```

**Key Attributes**:
- Hierarchical key structure (dot notation)
- Variable interpolation support
- Pluralization rules (optional)
- Default locale (en.default.json)

---

## Build-Time Entities (Source Files)

These entities exist in the source directory and are compiled during the build process:

### 8. Source Stylesheets

**Location**: `/src/css/*.css`  
**Purpose**: Pre-compiled Tailwind CSS

**Structure**:
```css
/* src/css/tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom components */
@layer components {
  .btn {
    @apply px-4 py-2 rounded font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary text-white hover:bg-primary-dark;
  }
}

/* Custom utilities */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

**Build Process**: Vite + Tailwind → `assets/theme.css`

---

### 9. Source JavaScript

**Location**: `/src/js/*.js`  
**Purpose**: Modular JavaScript before bundling

**Structure**:
```javascript
// src/js/main.js (entry point)
import { initCart } from './modules/cart.js';
import { initProductForm } from './modules/product.js';
import { initMobileNav } from './modules/navigation.js';
import { initSearch } from './modules/search.js';

document.addEventListener('DOMContentLoaded', () => {
  initCart();
  initProductForm();
  initMobileNav();
  initSearch();
});

// src/js/modules/cart.js
export function initCart() {
  // Cart functionality
}

export async function addToCart(variantId, quantity) {
  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity })
  });
  return response.json();
}
```

**Build Process**: Vite (Rollup) → `assets/theme.js`

---

## Entity Relationship Diagram

```
┌─────────────┐
│   Layout    │
│ theme.liquid│
└──────┬──────┘
       │
       │ contains
       │
       ├────────────┬────────────┬────────────┐
       │            │            │            │
┌──────▼──────┐ ┌──▼────────┐ ┌─▼─────────┐ ┌▼────────┐
│  Templates  │ │  Sections │ │  Assets   │ │ Config  │
│  (9-15)     │ │  (8-15)   │ │  (10-30)  │ │ (2)     │
└──────┬──────┘ └──────┬────┘ └───────────┘ └─────────┘
       │               │
       │ renders       │ renders
       │               │
       └───────┬───────┘
               │
        ┌──────▼──────┐
        │  Snippets   │
        │  (10-20)    │
        └─────────────┘

Build Process:
┌─────────────┐     Vite      ┌─────────────┐
│   src/css   │──────────────▶│ assets/*.css│
│   src/js    │──────────────▶│ assets/*.js │
└─────────────┘               └─────────────┘
```

---

## File Count Summary

| Entity Type | Count Range | Purpose |
|------------|-------------|---------|
| Layouts | 1-3 | HTML wrappers |
| Templates | 9-15 | Page structures |
| Sections | 8-15 | Reusable blocks |
| Snippets | 10-20 | Small components |
| Assets | 10-30 | Static files |
| Config | 2 | Theme settings |
| Locales | 1+ | Translations |
| **Total Files** | **41-86** | **Complete theme** |

---

## Data Flow

### Request Flow:
1. User requests page (e.g., `/products/shoes`)
2. Shopify determines template (`product.liquid`)
3. Template renders with layout (`theme.liquid`)
4. Template includes sections and snippets
5. Liquid processes variables and logic
6. HTML returned with asset references
7. Browser loads CSS/JS from Shopify CDN

### Build Flow:
1. Developer edits source files (`src/`)
2. Runs `npm run build` (Vite)
3. Tailwind CSS compiled and purged
4. JavaScript bundled and minified
5. Output written to `assets/`
6. Developer commits changes
7. GitHub Actions runs build automatically
8. Shopify syncs via GitHub integration

---

## Validation Rules

### Required Files (Shopify validation):
- ✅ `layout/theme.liquid`
- ✅ `templates/index.liquid`
- ✅ `templates/product.liquid`
- ✅ `templates/collection.liquid`
- ✅ `templates/cart.liquid`
- ✅ `templates/404.liquid`
- ✅ `config/settings_schema.json`
- ✅ `locales/en.default.json`

### File Naming Conventions:
- All lowercase
- Hyphens for multi-word names
- No spaces or special characters
- `.liquid` extension for templates/sections/snippets
- `.json` extension for config/locales

### Performance Constraints:
- `theme.css`: < 100KB (target: < 20KB gzipped)
- `theme.js`: < 50KB (target: < 15KB gzipped)
- Total theme size: < 5MB
- Image assets: Use Shopify CDN, not stored in theme

---

## Conclusion

This data model defines the complete file-based architecture for a minimal Shopify theme. All entities work together to provide a functional, customizable, and performant storefront that merchants can deploy and modify through GitHub integration. The structure balances Shopify conventions with modern development practices (build tools, modular code) to create an optimal developer experience.

