# Project Architecture Documentation

## Purpose
This document provides a comprehensive overview of the project architecture, key files, and development patterns to help AI assistants understand the codebase structure and make informed development decisions without reading all files.

## Project Overview

**Project Type**: Shopify Theme 2.0 (Online Store 2.0)  
**Framework**: Minimal template framework for DTC (Direct-to-Consumer) stores  
**Architecture**: Theme 2.0 with JSON templates, Sections Everywhere, and Design Token System  
**Build Tool**: Vite  
**Styling**: Tailwind CSS with CSS custom properties  
**JavaScript**: Vanilla ES6+ modules with Web Components support

## Directory Structure

```
ai-website-from-scratch/
├── 📁 assets/                    # Compiled output (generated, git-ignored in dev)
│   ├── theme.css                 # Compiled Tailwind CSS (~15KB)
│   └── main.js                   # Bundled JavaScript (~5KB)
│
├── 📁 config/                    # Theme configuration
│   ├── settings_schema.json      # ⭐ Theme Editor settings definition
│   ├── settings_data.json        # Current theme settings values
│   └── themes/                   # Design token presets
│       ├── minimal.json          # Minimal preset
│       ├── modern.json           # Modern preset
│       └── luxury.json           # Luxury preset
│
├── 📁 layout/                    # Base layout templates
│   ├── theme.liquid              # ⭐ Main layout (injects design tokens)
│   └── password.liquid           # Password protection layout
│
├── 📁 templates/                 # Page templates (Theme 2.0 JSON format)
│   ├── index.json                # Homepage
│   ├── product.json              # Product pages
│   ├── collection.json           # Collection pages
│   ├── cart.json                 # Cart page
│   ├── page.json                 # Static pages
│   ├── blog.json                 # Blog list
│   ├── article.json              # Blog articles
│   ├── search.json               # Search results
│   └── 404.json                  # 404 error page
│
├── 📁 sections/                  # Reusable theme sections
│   ├── header.liquid             # ⭐ Site header/navigation
│   ├── footer.liquid             # ⭐ Site footer
│   ├── hero.liquid               # Homepage hero banner
│   ├── featured-products.liquid   # Featured products section
│   ├── featured-collection.liquid # Featured collection section
│   ├── main-product.liquid       # Product page content
│   ├── main-collection.liquid    # Collection page content
│   ├── main-cart.liquid          # Cart page content
│   ├── main-page.liquid          # Static page content
│   ├── main-blog.liquid          # Blog list content
│   ├── main-article.liquid       # Blog article content
│   ├── main-search.liquid        # Search results content
│   └── main-404.liquid           # 404 page content
│
├── 📁 snippets/                   # Reusable Liquid fragments
│   ├── product-card.liquid       # ⭐ Product card component
│   ├── breadcrumbs.liquid        # Breadcrumb navigation
│   ├── price.liquid              # Price formatting
│   ├── image.liquid              # Responsive image wrapper
│   └── icon.liquid               # SVG icon renderer
│
├── 📁 src/                       # Source files (not deployed to Shopify)
│   ├── css/
│   │   └── tailwind.css          # ⭐ Tailwind source + design tokens
│   └── js/
│       ├── main.js               # ⭐ Main entry point
│       └── modules/
│           ├── cart.js           # Cart functionality
│           ├── product.js        # Product form + Web Component
│           └── navigation.js     # Navigation/mobile menu
│
├── 📁 locales/                   # Translations
│   └── en.default.json           # ⭐ English translations
│
├── 📁 docs/                      # Documentation
│   ├── architecture.md           # This file
│   └── design-tokens-guide.md    # Design token system guide
│
├── 📁 .github/workflows/         # CI/CD
│   └── build-deploy.yml          # GitHub Actions workflow
│
├── ⚙️ Configuration Files
│   ├── package.json              # ⭐ Dependencies and scripts
│   ├── vite.config.js            # ⭐ Vite build configuration
│   ├── tailwind.config.js        # ⭐ Tailwind + design token mapping
│   ├── postcss.config.js         # PostCSS configuration
│   ├── .theme-check.yml          # Shopify theme validation rules
│   └── .shopifyignore           # Files to exclude from Shopify upload
│
└── 📁 openspec/                  # OpenSpec change management
    ├── project.md                # Project context
    └── changes/                  # Change proposals
```

## Key Files Reference

### 🎯 Critical Configuration Files

#### `config/settings_schema.json`
**Purpose**: Defines all theme settings accessible in Shopify Theme Editor  
**Contains**: Design token groups (Colors, Typography, Spacing, Borders, Shadows)  
**When to modify**: Adding new theme customization options, extending design tokens  
**Key sections**: Colors, Typography, Spacing, Borders, Shadows, Theme Presets

#### `config/settings_data.json`
**Purpose**: Stores current theme settings values  
**Contains**: Active theme configuration  
**When to modify**: Importing theme presets, setting default values  
**Note**: This file is managed by Shopify Theme Editor, manual edits may be overwritten

#### `tailwind.config.js`
**Purpose**: Maps Tailwind theme to design token CSS variables  
**Contains**: Color, typography, spacing, border, shadow mappings  
**When to modify**: Adding new design token categories, extending Tailwind theme  
**Key mappings**: `primary: 'var(--color-primary)'`, `font-heading: 'var(--font-heading)'`

#### `src/css/tailwind.css`
**Purpose**: Tailwind CSS source + design token fallback definitions  
**Contains**: 
- Tailwind directives (`@tailwind base/components/utilities`)
- Design token CSS variables with defaults
- Custom component classes (`.btn-primary`, `.btn-secondary`)
**When to modify**: Adding new design tokens, custom component styles  
**Key sections**: `:root` variables, `@layer components`

#### `layout/theme.liquid`
**Purpose**: Base HTML layout, dynamically injects design tokens from Shopify settings  
**Contains**: 
- HTML structure
- CSS/JS asset references
- Dynamic CSS variable injection (from `settings.*`)
**When to modify**: Adding global scripts/styles, modifying token injection  
**Key feature**: Injects all design tokens as CSS custom properties at runtime

### 🏗️ Theme Structure Files

#### `templates/*.json`
**Purpose**: Define page structure using Theme 2.0 JSON format  
**Format**: JSON objects with `sections` and `order` keys  
**When to modify**: Adding/removing sections on pages, reordering sections  
**Example**:
```json
{
  "sections": {
    "main-product": { "type": "main-product", "settings": {} }
  },
  "order": ["main-product"]
}
```

#### `sections/*.liquid`
**Purpose**: Reusable page sections (Theme 2.0 - Sections Everywhere)  
**Types**:
- **Layout sections**: `header.liquid`, `footer.liquid` (always rendered)
- **Content sections**: `hero.liquid`, `featured-products.liquid` (homepage)
- **Main sections**: `main-product.liquid`, `main-collection.liquid` (page-specific content)
**When to modify**: Updating section content, adding settings, styling  
**Requirements**: Must include `{% schema %}` block for Theme Editor

#### `snippets/*.liquid`
**Purpose**: Reusable Liquid fragments (components)  
**Usage**: `{% render 'product-card', product: product %}`  
**When to modify**: Creating reusable components, updating component logic  
**Key snippets**:
- `product-card.liquid` - Product display card
- `breadcrumbs.liquid` - Navigation breadcrumbs
- `price.liquid` - Price formatting with sale/compare
- `image.liquid` - Responsive image wrapper
- `icon.liquid` - SVG icon renderer

### 💻 JavaScript Architecture

#### `src/js/main.js`
**Purpose**: Main entry point, initializes all modules  
**Contains**: Module imports, DOMContentLoaded event handler  
**When to modify**: Adding new modules, changing initialization order  
**Pattern**: Imports modules, calls init functions on page load

#### `src/js/modules/*.js`
**Purpose**: Modular JavaScript functionality  
**Modules**:
- `cart.js` - Cart add/update/remove operations
- `product.js` - Product form, variant selection, Web Component example
- `navigation.js` - Mobile menu, dropdowns, sticky header
**When to modify**: Adding functionality, fixing bugs, creating new modules  
**Pattern**: ES6 modules with `export function initX()`

### 🎨 Design Token System

#### Design Token Flow
```
Shopify Settings (settings_schema.json)
    ↓
Liquid Template (layout/theme.liquid)
    ↓
CSS Custom Properties (:root variables)
    ↓
Tailwind Config (variable references)
    ↓
Component Classes (Tailwind utilities)
```

#### Token Categories
- **Colors**: `color_primary`, `color_secondary`, `color_accent`, `color_background`, `color_text`, etc.
- **Typography**: `font_heading`, `font_body`, `text_size_*`, `font_weight_*`, `line_height_*`
- **Spacing**: `spacing_base` (with calculated scale)
- **Borders**: `border_radius_*`, `border_width`
- **Shadows**: `shadow_*` (sm, md, lg, xl, 2xl)

#### Token Usage in Components
- **Tailwind classes**: `bg-primary`, `text-text-secondary`, `rounded-md`
- **CSS variables**: `var(--color-primary)`, `var(--spacing-base)`
- **Component classes**: `.btn-primary` uses `var(--color-primary)`

### 📦 Build System

#### `vite.config.js`
**Purpose**: Vite build configuration  
**Builds**:
- `src/css/tailwind.css` → `assets/theme.css`
- `src/js/main.js` → `assets/main.js`
**Output**: `assets/` directory (deployed to Shopify)

#### Build Process
1. **Source**: `src/css/tailwind.css` + `src/js/main.js`
2. **Vite**: Compiles CSS (PostCSS + Tailwind), bundles JS
3. **Output**: `assets/theme.css` + `assets/main.js`
4. **Deploy**: Files in `assets/` are served by Shopify CDN

#### Available Scripts
- `npm run build` - Production build
- `npm run dev` - Watch mode for development
- `npm run lint` - Shopify theme validation

## Architecture Patterns

### 1. Shopify Theme 2.0 Architecture
- **JSON Templates**: Page structure defined in JSON
- **Sections Everywhere**: All pages support sections
- **App Blocks**: Can embed app functionality
- **Flexibility**: Merchants can customize any page via Theme Editor

### 2. Design Token System
- **Separation**: Design decisions separated from HTML structure
- **Configuration**: Tokens defined in `settings_schema.json`
- **Runtime**: Tokens injected as CSS variables in `layout/theme.liquid`
- **Presets**: Pre-configured token sets in `config/themes/`

### 3. Component Architecture
- **Liquid Components**: Sections and snippets (server-rendered)
- **Web Components**: Native custom elements (client-side, see `product.js`)
- **JavaScript Modules**: ES6+ modules for shared functionality
- **Clear Separation**: Structure (Liquid) vs. Behavior (JS) vs. Style (CSS)

### 4. Build & Deployment
- **Source Files**: `src/` directory (not deployed)
- **Compiled Assets**: `assets/` directory (deployed to Shopify)
- **CI/CD**: GitHub Actions auto-builds on push
- **Version Control**: Source files tracked, built assets auto-committed

## Development Guidelines

### Adding a New Section

1. **Create section file**: `sections/my-section.liquid`
2. **Add schema block**: `{% schema %}` with name and settings
3. **Add to template**: Update relevant `templates/*.json` file
4. **Use design tokens**: Use Tailwind classes with token references
5. **Test**: Run `npm run lint` and test in Shopify Theme Editor

### Adding a New Snippet

1. **Create snippet file**: `snippets/my-snippet.liquid`
2. **Accept parameters**: Use Liquid parameters for flexibility
3. **Use in sections**: `{% render 'my-snippet', param: value %}`
4. **Document parameters**: Add comments explaining usage

### Adding JavaScript Functionality

1. **Create module**: `src/js/modules/my-module.js`
2. **Export init function**: `export function initMyModule()`
3. **Import in main.js**: Add import and call init
4. **Use data attributes**: `data-*` for DOM selection
5. **Prefer Web Components**: For complex reusable UI

### Modifying Design Tokens

1. **Add to schema**: `config/settings_schema.json`
2. **Add CSS variable**: `src/css/tailwind.css` (fallback)
3. **Add injection**: `layout/theme.liquid` (runtime)
4. **Map to Tailwind**: `tailwind.config.js` (if needed)
5. **Update presets**: `config/themes/*.json` (if needed)
6. **See**: `docs/design-tokens-guide.md` for details

### Adding a New Page Template

1. **Create section**: `sections/main-newpage.liquid`
2. **Create JSON template**: `templates/newpage.json`
3. **Reference section**: Add section to JSON template
4. **Test**: Verify page renders correctly

## File Naming Conventions

### Liquid Files
- **Sections**: `kebab-case.liquid` (e.g., `featured-products.liquid`)
- **Snippets**: `kebab-case.liquid` (e.g., `product-card.liquid`)
- **Templates**: `kebab-case.json` (e.g., `product.json`)

### JavaScript Files
- **Modules**: `kebab-case.js` (e.g., `product-form.js`)
- **Web Components**: `PascalCase` class names (e.g., `ProductCard`)

### CSS/JSON Files
- **Config files**: `kebab-case.json` (e.g., `settings_schema.json`)
- **CSS files**: `kebab-case.css` (e.g., `tailwind.css`)

## Key Design Decisions

### Why Theme 2.0?
- **Sections Everywhere**: Maximum flexibility for merchants
- **App Blocks**: Support for app integrations
- **Future-Proof**: Access to latest Shopify features

### Why CSS Custom Properties?
- **Runtime Flexibility**: Change tokens without rebuild
- **Theme Editor Integration**: Live preview support
- **Zero Overhead**: Native browser support

### Why Tailwind CSS?
- **Utility-First**: Rapid development
- **Small Bundle**: JIT mode keeps CSS minimal
- **Token Integration**: Works seamlessly with CSS variables

### Why Vanilla JavaScript?
- **Zero Dependencies**: Minimal bundle size
- **Web Components**: Native browser support
- **Performance**: No framework overhead

## Common Tasks Quick Reference

### Change Theme Colors
1. Edit `config/settings_schema.json` → Colors section
2. Or modify `config/settings_data.json` directly
3. Or use preset from `config/themes/`

### Add New Section
1. Create `sections/my-section.liquid`
2. Add `{% schema %}` block
3. Add to `templates/*.json` file

### Add JavaScript Feature
1. Create `src/js/modules/feature.js`
2. Export `initFeature()` function
3. Import and call in `src/js/main.js`
4. Run `npm run build`

### Modify Styling
1. Use Tailwind classes with design tokens
2. Add custom CSS in `src/css/tailwind.css` `@layer components`
3. Run `npm run build`

### Add Translation
1. Add key-value pair to `locales/en.default.json`
2. Use in Liquid: `{{ 'key.path' | t }}`

### Test Changes
1. Run `npm run build` - Build assets
2. Run `npm run lint` - Validate theme
3. Test in Shopify Theme Editor (local or remote)

## Important Notes for AI Assistants

### 🚨 CRITICAL: Styling Approach

**When creating new pages or components, you MUST:**

1. **Use Tailwind classes + BEM naming** for layout and structure
2. **Put custom styles in `<style>` tags** for special effects
3. **Understand the separation**:
   - `settings_data.json` = Brand style (colors, sizes, fonts)
   - Tailwind + Custom CSS = Page layout and structure
   - Both are needed for complete design

**Example: Correct approach**
```liquid
<style>
  .product-hero {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  }
</style>

<section class="product-hero py-16">
  <div class="product-hero__container container-custom">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="product-hero__image">
        <img src="..." class="w-full h-96 object-cover rounded-lg">
      </div>
      <div class="product-hero__content">
        <h1 class="text-3xl font-bold text-text mb-4">Title</h1>
      </div>
    </div>
  </div>
</section>
```

**After creating, ALWAYS run:** `npm run build`

📖 **See**: `docs/design-tokens-guide.md` (Tailwind CSS Usage Guide section) for detailed guidelines

### When Making Changes

1. **Always check**: `config/settings_schema.json` for available settings
2. **Use design tokens**: Prefer `bg-primary` over `bg-black`
3. **Follow patterns**: Check existing sections/snippets for patterns
4. **Validate**: Run `npm run lint` after changes
5. **Build**: Run `npm run build` to update assets

### File Locations

- **Source files**: `src/` (never deployed directly)
- **Compiled files**: `assets/` (deployed to Shopify)
- **Theme files**: `sections/`, `snippets/`, `templates/`, `layout/`
- **Configuration**: `config/`, `locales/`

### Design Token Usage

- **In Liquid**: Use Tailwind classes (`bg-primary`, `text-text`)
- **In CSS**: Use CSS variables (`var(--color-primary)`)
- **In JS**: Use CSS variables if needed (rare)

### Common Patterns

- **Sections**: Always include `{% schema %}` block
- **Snippets**: Accept parameters for flexibility
- **JavaScript**: Use `data-*` attributes for DOM selection
- **Styling**: Mobile-first responsive design with Tailwind

## Related Documentation

- **Design Tokens Guide**: `docs/design-tokens-guide.md` - How to modify design tokens
- **Theme 2.0 Migration**: `THEME_2.0_MIGRATION.md` - Migration details
- **Project Context**: `openspec/project.md` - Detailed project context
- **README**: `README.md` - Quick start and overview

## Quick File Lookup

| What I Need To... | File Location |
|-------------------|---------------|
| Change theme colors/fonts | `config/settings_schema.json` |
| Add new section | `sections/my-section.liquid` |
| Add new snippet | `snippets/my-snippet.liquid` |
| Modify CSS | `src/css/tailwind.css` |
| Add JavaScript | `src/js/modules/my-module.js` |
| Change page structure | `templates/*.json` |
| Add translation | `locales/en.default.json` |
| Configure build | `vite.config.js` |
| Configure Tailwind | `tailwind.config.js` |
| Modify layout | `layout/theme.liquid` |
| Use design tokens | See `docs/design-tokens-guide.md` |

## AI Assistant Quick Reference

### When Starting a Task

1. **Read this file first** - Understand project structure
2. **Check key files** - Review relevant files marked with ⭐
3. **Follow patterns** - Match existing code style and patterns
4. **Validate** - Run `npm run lint` and `npm run build`
5. **Test** - Verify changes work in Shopify Theme Editor

### File Modification Guide

**Adding new theme setting**:
→ `config/settings_schema.json` (add setting)
→ `layout/theme.liquid` (inject as CSS variable)
→ `src/css/tailwind.css` (add fallback)
→ `tailwind.config.js` (map to Tailwind if needed)

**Adding new section**:
→ `sections/my-section.liquid` (create section)
→ `templates/*.json` (add to page)
→ Test in Theme Editor

**Adding JavaScript**:
→ `src/js/modules/my-module.js` (create module)
→ `src/js/main.js` (import and init)
→ `npm run build` (compile)

**Modifying styling**:
→ Use Tailwind classes with design tokens
→ Or add custom CSS in `src/css/tailwind.css`
→ `npm run build` (compile)

### Critical File Checklist

Before making changes, check these files:
- ✅ `config/settings_schema.json` - Available settings
- ✅ `tailwind.config.js` - Available Tailwind classes
- ✅ `src/css/tailwind.css` - Design token definitions
- ✅ `layout/theme.liquid` - Token injection logic
- ✅ Existing sections/snippets - Follow patterns

### Common Mistakes to Avoid

1. ❌ Don't hardcode colors (use design tokens)
2. ❌ Don't modify `assets/` directly (edit `src/` instead)
3. ❌ Don't forget `{% schema %}` blocks in sections
4. ❌ Don't use inline styles (use Tailwind classes)
5. ❌ Don't skip validation (`npm run lint`)

---

**Last Updated**: After Theme 2.0 migration and design token system implementation  
**Theme Version**: 2.0 (Online Store 2.0)  
**Build Status**: ✅ Validated (279 files, 0 offenses)  
**Documentation**: See also `docs/design-tokens-guide.md` for design token details

