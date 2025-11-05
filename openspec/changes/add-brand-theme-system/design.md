# Design: Brand Theme System

## Context
The theme currently hardcodes design values (colors, fonts, spacing) directly in components. To enable rapid DTC site creation with different visual styles, we need a design system that:
1. Separates design decisions from HTML structure
2. Allows configuration-driven visual style switching
3. Supports theme presets for common brand patterns
4. Maintains performance (no runtime overhead)

## Goals / Non-Goals

### Goals
- Enable one-click visual style switching via configuration
- Support unlimited theme presets (minimal, modern, luxury, etc.)
- Maintain zero runtime overhead (CSS variables, build-time compilation)
- Full Shopify Theme Editor integration
- Backward compatible with existing components

### Non-Goals
- Runtime theme switching UI (configuration-based only)
- Multi-theme support on same page (single theme per site)
- Advanced design tooling (keep simple, configuration-driven)
- Design token generation from external tools (manual configuration)

## Decisions

### Decision 1: CSS Custom Properties for Design Tokens
**What**: Use CSS custom properties (CSS variables) defined in `:root` for all design tokens.

**Why**:
- Native browser support, zero runtime overhead
- Can be dynamically injected from Liquid based on Shopify settings
- Works seamlessly with Tailwind CSS via variable references
- No build-time complexity increase
- Enables live preview in Shopify Theme Editor

**Alternatives considered**:
- SCSS variables: Requires build-time compilation, harder to make dynamic
- JavaScript theme objects: Runtime overhead, breaks CSS-only styling
- Tailwind config only: Not dynamic, requires rebuild for changes

### Decision 2: Shopify Settings Schema for Token Configuration
**What**: Extend `settings_schema.json` with comprehensive design token groups accessible via `settings.*` in Liquid.

**Why**:
- Native Shopify Theme Editor integration
- No custom UI needed
- Familiar to merchants
- Supports validation and defaults
- Can be exported/imported for theme presets

**Alternatives considered**:
- Separate JSON config file: Requires custom tooling, no editor integration
- Environment variables: Not accessible in Liquid, requires build process

### Decision 3: Theme Presets as Configuration Files
**What**: Store theme presets as JSON files (e.g., `themes/minimal.json`, `themes/modern.json`) that can be imported into `settings_data.json`.

**Why**:
- Simple, version-controlled
- Easy to share and customize
- Can be loaded via Shopify CLI or manual import
- Supports documentation and examples

**Alternatives considered**:
- Database storage: Requires backend, overkill for static configs
- Complex preset system: Adds unnecessary complexity

### Decision 4: Tailwind CSS Variable References
**What**: Map Tailwind theme tokens to CSS custom properties (e.g., `colors.primary: 'var(--color-primary)'`).

**Why**:
- Maintains Tailwind utility class benefits
- Single source of truth (CSS variables)
- Dynamic updates without rebuild
- Familiar developer experience

**Alternatives considered**:
- Abandon Tailwind: Loses utility-first benefits
- Static Tailwind config: Not dynamic, requires rebuild

### Decision 5: Token Categories
**What**: Organize tokens into: Colors, Typography, Spacing, Borders, Shadows, Breakpoints.

**Why**:
- Covers all design decisions
- Clear organization for merchants
- Extensible for future needs
- Aligns with design system best practices

## Architecture

### Design Token Flow
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

### File Structure
```
config/
├── settings_schema.json          # Token configuration UI
├── settings_data.json            # Current theme values
└── themes/                       # Theme presets (new)
    ├── minimal.json
    ├── modern.json
    └── luxury.json

src/css/
└── tailwind.css                  # Token definitions + Tailwind

layout/
└── theme.liquid                  # Dynamic CSS injection

tailwind.config.js                # Token → Tailwind mapping
```

### Token Injection Pattern
```liquid
<!-- layout/theme.liquid -->
<style>
  :root {
    --color-primary: {{ settings.color_primary }};
    --color-secondary: {{ settings.color_secondary }};
    --font-heading: {{ settings.font_heading.family }};
    --spacing-base: {{ settings.spacing_base }}px;
    /* ... all tokens ... */
  }
</style>
```

## Risks / Trade-offs

### Risk: Performance Impact
**Mitigation**: CSS custom properties are native and have zero runtime overhead. Injection happens server-side, no client-side processing.

### Risk: Complexity for Merchants
**Mitigation**: Provide clear preset options and documentation. Most merchants will use presets, not customize individual tokens.

### Risk: Breaking Existing Components
**Mitigation**: Maintain backward compatibility by providing sensible defaults. Migrate components gradually.

### Trade-off: Build-time vs Runtime
**Choice**: Runtime (CSS variables) for flexibility. Trade-off: Slightly larger CSS (but still minified), but enables instant theme switching without rebuilds.

### Trade-off: Comprehensive vs Simple
**Choice**: Start comprehensive but organized. Easier to add tokens upfront than retrofit later.

## Migration Plan

### Phase 1: Foundation
1. Define token structure in `settings_schema.json`
2. Create CSS variable definitions in `tailwind.css`
3. Update Tailwind config to reference variables
4. Add dynamic injection in `theme.liquid`

### Phase 2: Component Migration
1. Identify all hardcoded design values
2. Replace with token references (colors, fonts, spacing)
3. Test each component for visual consistency
4. Update component documentation

### Phase 3: Presets
1. Create example preset files
2. Document preset import process
3. Add preset selector to theme editor
4. Test preset switching

### Rollback
- Remove token references, restore hardcoded values
- Keep old settings schema as fallback
- No database changes, fully reversible

## Open Questions
- Should we support gradient tokens? (Defer to Phase 2)
- Animation/transition tokens? (Defer to Phase 2)
- Component-specific tokens? (Start global, add later if needed)

