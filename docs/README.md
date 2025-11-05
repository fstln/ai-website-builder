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

### 2. [Design Tokens Guide](./design-tokens-guide.md)
**Purpose**: How to modify design tokens for custom visual styles  
**Use when**:
- Creating custom visual styles for DTC websites
- Modifying theme colors, fonts, spacing
- Understanding design token system
- Creating theme presets

**Key Sections**:
- Design token categories
- Step-by-step customization guide
- Brand pattern examples
- Token naming conventions

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
| Modify design tokens | `design-tokens-guide.md` | `config/settings_schema.json` |
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

