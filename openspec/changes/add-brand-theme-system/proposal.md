# Change: Add Brand Theme System

## Why
Currently, the theme uses hardcoded design values scattered across components, making it difficult to create new DTC sites with different visual styles. Each new brand requires manual CSS changes across multiple files. A design system that separates design decisions (colors, fonts, spacing, etc.) from HTML structure will enable one-click visual style switching through configuration, dramatically reducing setup time and enabling multi-brand scenarios from a single codebase.

## What Changes
- **ADDED**: Design token system with CSS custom properties for all design decisions
- **ADDED**: Theme preset system for one-click style switching
- **ADDED**: Comprehensive design token configuration in `settings_schema.json` (colors, typography, spacing, borders, shadows)
- **ADDED**: Dynamic CSS variable injection from Shopify settings
- **MODIFIED**: Tailwind config to use design tokens from CSS variables
- **MODIFIED**: All components to use design token variables instead of hardcoded values
- **ADDED**: Theme preset selection UI in Shopify Theme Editor
- **ADDED**: Documentation for creating custom theme presets

## Impact
- **Affected specs**: New capability `theme-system` (design token management and theme presets)
- **Affected code**:
  - `config/settings_schema.json` - Extended with design token groups
  - `src/css/tailwind.css` - Design token variable definitions
  - `tailwind.config.js` - Token mapping to Tailwind theme
  - `layout/theme.liquid` - Dynamic CSS variable injection
  - All `sections/*.liquid` - Migration to use design tokens
  - All `snippets/*.liquid` - Migration to use design tokens
  - All `templates/*.liquid` - Migration to use design tokens
- **Breaking changes**: None - existing components continue to work, tokens provide defaults
- **Migration path**: Existing hardcoded values will be replaced with token references, maintaining visual compatibility

