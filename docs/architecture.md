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
├── 📁 sections/                  # Reusable theme sections（详见 docs/liquid_dev_playbook.md）
│   ├── header.liquid             # ⭐ Site header/navigation
│   ├── footer.liquid             # ⭐ Site footer
│   ├── hero.liquid               # Homepage hero banner
│   ├── featured-products.liquid   # Featured products section
│   ├── featured-collection.liquid # Featured collection section
│   ├── sticky-navbar.liquid # Sticky pill navigation for purchase pages (jump links)
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
│   └── js/                       # 原生 JS + Web Components，详见 docs/js_component_guide.md
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
│   └── design_tokens_guide.md    # Design token system guide
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
- Custom component classes (`.btn-primary`, `.btn-outline-primary` / legacy `.btn-secondary`)
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
**Requirements**: Must include `{% schema %}` block for Theme Editor，并遵循 `docs/liquid_dev_playbook.md` 的 color-scheme、语义结构、可访问性/SEO 规则

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
**Pattern**: Imports modules, calls init functions on page load，遵循 `docs/js_component_guide.md` 的渐进增强/懒加载策略

#### `src/js/modules/*.js`
**Purpose**: Modular JavaScript functionality  
**Modules**:
- `cart.js` - Cart add/update/remove operations
- `product.js` - Product form, variant selection, Web Component example
- `navigation.js` - Mobile menu, dropdowns, sticky header
**When to modify**: Adding functionality, fixing bugs, creating new modules  
**Pattern**: ES6 modules with `export function initX()`，并与 `docs/js_component_guide.md` 中的 Web Component 规则保持一致

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
- **Colors**: `color_primary`, `color_accent`, `color_background`, `color_text`, etc.
- **Typography**: `font_heading`, `font_body`, `text_size_*`, `font_weight_*`, `line_height_*`
- **Spacing**: `spacing_base` (with calculated scale)
- **Borders**: `border_radius_*`, `border_width`
- **Shadows**: `shadow_*` (sm, md, lg, xl, 2xl)

> **Fonts & head code**  
> - Shopify 的 `font_picker` 结果在 `layout/theme.liquid` 中通过 `{{ settings.font_* | font_face: font_display: 'swap' }}` 注入 `@font-face`，不再需要手动维护 Google Fonts `<link>`。  
> - 若需要额外的追踪脚本、像素或自定义 `<link>`，请使用 `settings.custom_head_markup`（Theme Editor → Custom Code → Head injections）。Liquid 会在 `</head>` 前输出该字段，避免直接改模板。

#### Token Usage in Components
- **Tailwind classes**: `bg-primary`, `text-muted`, `rounded-md`
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
6. **See**: `docs/design_tokens_guide.md` for details

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

1. **Wrap every section/root with** `class="color-scheme color-{{ section.settings.color_scheme | default: 'scheme-1' }}"` **并只使用** `docs/visual_spec.md` **中定义的语义 Tailwind 组合（`bg-background`, `text-foreground`, `bg-surface`, `.btn` 等）。**
2. **所有 CTA/链接按钮走 `.btn` 家族**（`.btn.btn-primary` / `.btn.btn-outline-primary`〔或旧 `.btn.btn-secondary`〕 / `.btn` + 自定义尺寸），禁止自定义渐变 hover 或孤立状态样式。
3. **自定义 CSS 优先写入 `src/css/tailwind.css` 的 `@layer components`**；只有确实需要 Section 局部样式时才在模板内添加 `<style>`，并确保仍引用 token 变量。
4. **理解令牌/结构分层**：`settings_data.json` 控制品牌外观，Tailwind/Liquid 决定布局；任何视觉需求都应通过配置 + 语义类完成，避免硬编码色值或尺寸。

**Example: Correct approach**
```liquid
<style>
  .product-hero {
    background: linear-gradient(135deg, var(--color-primary), rgb(var(--color-primary-rgb) / 0.6));
  }
</style>

<section class="product-hero py-16">
  <div class="product-hero__container container-custom">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="product-hero__image">
        <img src="..." class="w-full h-96 object-cover rounded-lg">
      </div>
      <div class="product-hero__content">
        <h1 class="text-3xl font-bold text-foreground mb-4">Title</h1>
      </div>
    </div>
  </div>
</section>
```

> 示例中的 `<style>` 仅用于演示如何基于 token 派生渐变；可复用的样式应移至 `src/css/tailwind.css`。

**After creating, ALWAYS run:** `npm run build`

📖 **See**: `docs/design_tokens_guide.md`, `docs/visual_spec.md`, `docs/liquid_dev_playbook.md` 获取更详细的类与结构约定

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

- **In Liquid**: Use Tailwind classes (`bg-primary`, `text-foreground`)
- **In CSS**: Use CSS variables (`var(--color-primary)`)
- **In JS**: Use CSS variables if needed (rare)

### Common Patterns

- **Sections**: Always include `{% schema %}` block
- **Snippets**: Accept parameters for flexibility
- **JavaScript**: Use `data-*` attributes for DOM selection
- **Styling**: Mobile-first responsive design with Tailwind

## Related Documentation

- **Design Tokens Guide** (`docs/design_tokens_guide.md`): settings → CSS 变量 → Tailwind 映射全流程
- **Visual Spec** (`docs/visual_spec.md`): Section/Block 可直接套用的 Tailwind 语义组合
- **Color Scheme Playbook** (`docs/color_scheme.md`): Shopify scheme 角色、派生值与治理
- **Brand Color Playbook** (`docs/brand_color_playbook.md`): 如何为新品牌挑选/扩展色板
- **Accessibility Playbook** (`docs/accessibility_playbook.md`): WCAG/ADA/EU 指令检查清单
- **SEO Playbook** (`docs/seo_playbook.md`): 语义结构、性能与元数据约束
- **Liquid Development Playbook** (`docs/liquid_dev_playbook.md`): Section/Snippet 结构、schema、可访问性
- **JavaScript & Web Component Guide** (`docs/js_component_guide.md`): 渐进增强、模块化、交互策略
- **Theme 2.0 Migration** (`THEME_2.0_MIGRATION.md`): 历史迁移说明
- **Project Context** (`openspec/project.md`): OpenSpec 背景
- **README** (`README.md`): 快速开始与脚手架

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
| Use design tokens | See `docs/design_tokens_guide.md` |

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

## Sections Catalog（集中索引）

目的：系统性梳理当前主题可用的 Sections，给出“放在哪、解决什么问题、依赖什么”的快速索引。具体样式/语义请对照 `docs/visual_spec.md` 与 `docs/liquid_dev_playbook.md`。

---

### A. 全局/框架类

- `sections/header.liquid` / `sections/main-header.liquid`
  - 场景：站点头部（Logo/导航/购物车入口）。
  - 建议：头部内放置购物车角标元素（`[data-cart-count-badge]`），由 Cart Drawer/Cart 模块统一刷新。

- `sections/footer.liquid`
  - 场景：站点底部（导航、联系、社媒、支付图标、订阅）。
  - 建议：包含 Accessibility/隐私等政策链接；遵循可访问性与 SEO 要求。

- `sections/announcement-bar.liquid`
  - 场景：顶部通告（物流/折扣/重要通知）。
  - 建议：短文本 + 可选链接；避免堆叠多条信息。

- `sections/sticky-navbar.liquid`
  - 场景：长购买页的“胶囊锚点导航”。
  - 使用：为目标区块设置 `id`（或 Section `section_id`），在本 Section 的 blocks 中填入锚点；点击将平滑滚动。
  - 设置：`sticky_offset`（吸顶距离）、`scroll_offset`（滚动对齐偏移）。

---

### B. 首页/营销类

- `sections/hero.liquid` / `sections/hero-highlight-section.liquid`
  - 场景：首屏 Hero 或带图文的卖点强调区。
  - 建议：用 `section_id` 供粘性导航/跳转使用；按钮用 `.btn.btn-primary`。

- `sections/featured-products.liquid` / `sections/featured-collection.liquid`
  - 场景：精选产品/集合展示。
  - 依赖：`snippets/product-card.liquid`、`snippets/price.liquid`。

---

### C. 核心页面主区

- `sections/main-product.liquid`
  - 场景：产品详情核心内容（标题、价格、描述、变体、数量、购买按钮等）。
  - 交互：与 `variant-selector-*`、`product-gallery-*`、`add-to-cart-*` 等组件配合。

- `sections/main-collection.liquid` / `sections/main-cart.liquid` / `sections/main-page.liquid` / `sections/main-blog.liquid` / `sections/main-article.liquid` / `sections/main-search.liquid` / `sections/main-404.liquid`
  - 场景：集合、购物车、静态页、博客、文章、搜索、404 等标准主区。

---

### D. 购买页增强与复用区块

- `sections/faq-accordion-section.liquid`
  - 场景：常见问题（复用 `snippets/faq-accordion.liquid`）。
  - 设置：`color_scheme`、`section_id`、标题/副标题；Blocks 为问答项。

> 说明：不收录以 `custom-` 开头的临时/专项 Section（仅用于示例或特定活动，非稳定接口）。如需参考其结构，请直接查看对应文件，但不作为通用目录的一部分。

---

### E. 组合示例（来自模板）

- 产品页（示例）
  - 结构：`main-product` → `sticky-navbar` → 若干营销/说明区块（如 `hero-highlight-section`、复用型信息模块）→ FAQ。
  - 要点：区块通过 `section_id` 提供锚点；`sticky-navbar` 的 blocks 指向这些 `id`；避免依赖 `custom-*` 临时区块作为稳定能力。

---

### F. 接入与治理建议

- 所有 Section 根节点必须：
  - 包裹 `class="color-scheme color-{{ section.settings.color_scheme | default: 'scheme-1' }}"`；
  - 遵守 `docs/liquid_dev_playbook.md` 的 schema 规范（含 `color_scheme` setting）。
- 使用语义类：颜色/边框/阴影请用 Tailwind 语义映射（如 `bg-background`, `text-foreground`, `border-border`）。
- 复用优先：常见卖点/对比/规格/FAQ 优先沿用现有自定义 Section 的结构抽象，不要在新 Section 硬编码视觉风格。
- 表单/CTA：按钮统一 `.btn.btn-primary`，次按钮 `.btn.btn-outline-primary`（`btn-secondary` 为兼容别名）。
- 锚点导航：长页建议统一通过 `sticky-navbar` 管理跳转，确保移动端滚动偏移一致。

---

### G. 清单（新增/修改 Section 时自检）

- [ ] schema 含 `color_scheme` 与清晰分组/描述；`presets` 可预览。
- [ ] 标题层级正确（页面仅一处 `<h1>`，Section 从 `<h2>` 起）。
- [ ] 媒体具备 `alt`/`loading`/`decoding`；列表/表格使用语义标签。
- [ ] 未出现硬编码颜色/边框；全部引用 tokens/语义类。
- [ ] 长页面区块提供 `section_id` 以便导航/链接。
- [ ] 需要交互的区块提供 `data-*` 钩子并与 JS 模块对齐。

以上目录随代码演进补充。若新增 Section，请在合并请求中同步更新本章节并附上使用截图/链接，便于 AI 与协作者快速复用。

### Common Mistakes to Avoid

1. ❌ Don't hardcode colors (use design tokens)
2. ❌ Don't modify `assets/` directly (edit `src/` instead)
3. ❌ Don't forget `{% schema %}` blocks in sections
4. ❌ Don't 把长期样式留在 inline `<style>`；无法复用的局部样式才可保留，其余迁移到 `src/css/tailwind.css`
5. ❌ Don't skip validation (`npm run lint`)

---

**Last Updated**: After Theme 2.0 migration and design token system implementation  
**Theme Version**: 2.0 (Online Store 2.0)  
**Build Status**: ✅ Validated (279 files, 0 offenses)  
**Documentation**: See also `docs/design_tokens_guide.md` for design token details
