# Documentation Index

This directory contains documentation to help AI assistants understand and work with this Shopify theme project.

## 📚 Documentation Files

### 1. [Architecture Documentation](./architecture.md) ⭐ **START HERE**
**Purpose**: Comprehensive project structure and key files reference  
**Use when**: 
- Starting a new task
- Understanding project structure
- Finding where to make changes
- Learning development patterns

**Key Sections**:
- Directory structure with file descriptions
- Key files reference (what each file does)
- Architecture patterns
- Development guidelines
- Quick file lookup table

### 2. [Design Tokens Guide](./design_tokens_guide.md) 🎨 **MUST READ**
**Purpose**: How to modify design tokens for custom visual styles and use Tailwind CSS correctly  
**Use when**:
- Creating custom visual styles for DTC websites
- Modifying theme colors, fonts, spacing
- Understanding design token system
- Creating theme presets
- Creating new pages or components
- Understanding styling approach (Tailwind + BEM + custom styles)
- Combining Tailwind with custom CSS
- Deciding when to use design tokens vs custom styles

**Key Sections**:
- Design token categories (colors, typography, spacing, borders, shadows, component sizes, brand personality, interactions, layout)
- Step-by-step customization guide
- Brand pattern examples
- Token naming conventions
- Tailwind CSS + BEM best practices
- Custom styles in `<style>` tags
- Design tokens vs page styles
- Complete examples with build workflow

### 3. [AI 设计系统核心原则](./ai_design_principles.md)
**Purpose**: 框架无关的视觉/交互守则（Material 灵感 + Shopify theme 约束）  
**Use when**: 需要理解移动优先、海拔、语义色、排版、交互合约与可访问性总则。  

### 4. [Visual Spec](./visual_spec.md)
**Purpose**: Tailwind 语义类的具体使用规范（布局、色彩、排版、组件模式）  
**Use when**: 在 Section/Block 中写类、确认按钮/卡片/表单等具体组合。

### 5. [Liquid Development Playbook](./liquid_dev_playbook.md)
**Purpose**: Section/Snippet 编写规则（schema、语义结构、color scheme、可访问性/SEO）  
**Use when**: 需要创建或修改 Liquid 模板、Section/Block。

### 6. [JavaScript & Web Component Guide](./js_component_guide.md)
**Purpose**: 原生 JS 与 Web Component 的结构、渐进增强、懒加载与 Shopify 事件配合  
**Use when**: 添加交互、监听 Section 事件、编写 Web Component。

### 7. [Color Scheme Guide](./color_scheme.md)
**Purpose**: Shopify `color_scheme_group` 的配置、注入、Section 使用方法  
**Use when**: 需要新增/调整 Scheme 或确保 Section 继承正确。

### 8. [Brand Color Playbook](./brand_color_playbook.md)
**Purpose**: 选择/扩展品牌色板的决策流程，保持差异性与可访问性  
**Use when**: 为新品牌生成 preset、调整主辅色或campaign色板。

### 9. [Accessibility Playbook](./accessibility_playbook.md)
**Purpose**: 汇总 WCAG / ADA / EU 指令与 Shopify 建议的可访问性清单  
**Use when**: 设计/生成模块时需要确保 alt text、对比度、键盘可达等要求落地。

### 10. [SEO Playbook](./seo_playbook.md)
 
### 11. [通用模块与组件目录](./modules_catalog.md)
**Purpose**: 枚举现有可复用的 Snippets、Web Components、JS 模块与工具，说明用途与接入方式  
**Use when**: 想复用已有能力（购物车抽屉、产品卡、FAQ、变体/图廊等），避免重复造轮子

### 12. [Sections 目录与适用场景](./sections_catalog.md)
**Purpose**: 列出主题已实现的 Sections、推荐放置位置、依赖与注意事项  
**Use when**: 规划页面结构、挑选合适区块、为长购买页配置粘性锚点导航
**Purpose**: 整合 Shopify SEO 能力、语义结构与性能要求的执行清单  
**Use when**: 生成页面/模块时需要设置 meta、结构化数据、lazy loading、语义标签或评估性能。

## 🚀 Quick Start for AI Assistants

1. **Read** `docs/architecture.md` to understand project structure
2. **Check** key files marked with ⭐ in the architecture doc
3. **Follow** existing patterns in similar files
4. **Validate** changes with `npm run lint`
5. **Build** with `npm run build`

## 📋 Common Tasks

| Task | Documentation | Key Files |
|------|--------------|-----------|
| Add new section | `architecture.md` | `sections/*.liquid`, `templates/*.json` |
| Modify design tokens | `design_tokens_guide.md` | `config/settings_schema.json` |
| Plan principles | `ai_design_principles.md` | applies across theme |
| Implement visual rules | `visual_spec.md` | Sections/Snippets |
| Build Liquid sections | `liquid_dev_playbook.md`, `color_scheme.md` | `sections/*.liquid`, `snippets/*.liquid` |
| Implement JS/Web Components | `js_component_guide.md` | `src/js/*.js` |
| Build color schemes | `color_scheme.md`, `brand_color_playbook.md` | `config/settings_schema.json`, `snippets/color-schemes.liquid` |
| Ensure accessibility | `accessibility_playbook.md` | Sections/Snippets |
| Optimize SEO/performance | `seo_playbook.md` | layout/theme.liquid, snippets, sections |
| Add JavaScript | `architecture.md` | `src/js/modules/*.js` |
| Change styling | `architecture.md` | `src/css/tailwind.css` |
| Add translation | `architecture.md` | `locales/en.default.json` |

## 🔍 File Location Quick Reference

**Configuration**:
- Theme settings: `config/settings_schema.json`
- Design tokens: `config/settings_schema.json` + `src/css/tailwind.css`
- Build config: `vite.config.js`, `tailwind.config.js`

**Theme Structure**:
- Layouts: `layout/theme.liquid`
- Templates: `templates/*.json`
- Sections: `sections/*.liquid`
- Snippets: `snippets/*.liquid`

**Source Code**:
- CSS: `src/css/tailwind.css`
- JavaScript: `src/js/main.js` + `src/js/modules/*.js`

**Output**:
- Compiled assets: `assets/theme.css`, `assets/main.js`

## 📖 Related Documentation

- **Project Context**: `../openspec/project.md` - Detailed project context
- **Theme 2.0 Migration**: `../THEME_2.0_MIGRATION.md` - Migration details
- **Main README**: `../README.md` - Quick start and overview

---

For detailed information, see the individual documentation files listed above.
