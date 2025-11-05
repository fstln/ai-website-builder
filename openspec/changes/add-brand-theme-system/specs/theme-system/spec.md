# Theme System Specification

## ADDED Requirements

### Requirement: Design Token Configuration
The system SHALL provide a comprehensive design token configuration system that separates design decisions (colors, typography, spacing, borders, shadows) from HTML structure, enabling visual style changes through configuration without modifying component code.

#### Scenario: Merchant configures theme colors
- **GIVEN** a merchant opens the Shopify Theme Editor
- **WHEN** they navigate to the "Colors" settings group
- **THEN** they see color pickers for primary, secondary, accent, background, text, border, error, success, and warning colors
- **AND** when they change a color value
- **THEN** the change is immediately reflected across all components using that color token
- **AND** the value is saved to `settings_data.json`

#### Scenario: Developer extends design tokens
- **GIVEN** a developer wants to add a new color token
- **WHEN** they add the token definition to `settings_schema.json` and `src/css/tailwind.css`
- **THEN** the token is available throughout the theme via CSS custom properties
- **AND** it can be referenced in Tailwind classes
- **AND** it appears in the Theme Editor for merchant customization

### Requirement: CSS Custom Property System
The system SHALL use CSS custom properties (CSS variables) defined in `:root` for all design tokens, enabling dynamic value injection from Shopify settings without build-time recompilation.

#### Scenario: Theme loads with default tokens
- **GIVEN** the theme is loaded on a page
- **WHEN** the browser renders `layout/theme.liquid`
- **THEN** all design tokens are injected as CSS custom properties in a `<style>` block
- **AND** tokens reference Shopify settings values (e.g., `{{ settings.color_primary }}`)
- **AND** fallback values are provided for missing settings

#### Scenario: Merchant changes setting in Theme Editor
- **GIVEN** a merchant is previewing the theme in the Theme Editor
- **WHEN** they change a color setting (e.g., `color_primary`)
- **THEN** the CSS custom property `--color-primary` is updated immediately
- **AND** all components using `var(--color-primary)` reflect the new color
- **AND** no page reload or rebuild is required

### Requirement: Tailwind CSS Token Integration
The system SHALL map Tailwind CSS theme values to design token CSS custom properties, enabling Tailwind utility classes to use design tokens while maintaining build-time optimization.

#### Scenario: Developer uses Tailwind utility with token
- **GIVEN** a developer writes `<div class="bg-primary text-white">`
- **WHEN** Tailwind compiles the CSS
- **THEN** `bg-primary` references `var(--color-primary)` from the design token system
- **AND** the compiled CSS includes the variable reference
- **AND** the actual color value is resolved at runtime from Shopify settings

#### Scenario: Token update affects Tailwind classes
- **GIVEN** components use Tailwind classes like `bg-primary`, `text-secondary`, `rounded-md`
- **WHEN** a merchant changes the corresponding design token values
- **THEN** all components using those Tailwind classes update automatically
- **AND** no component code changes are required

### Requirement: Theme Preset System
The system SHALL provide theme presets (pre-configured design token sets) that merchants can select to instantly switch the entire visual style of their store.

#### Scenario: Merchant selects a theme preset
- **GIVEN** a merchant is in the Theme Editor
- **WHEN** they select a preset from the "Theme Presets" dropdown (e.g., "Minimal", "Modern", "Luxury")
- **THEN** all design token values are updated to match the preset
- **AND** the visual style changes immediately across all pages
- **AND** the preset values are saved to `settings_data.json`

#### Scenario: Developer creates custom preset
- **GIVEN** a developer wants to create a custom theme preset
- **WHEN** they create a JSON file in `config/themes/` with all design token values
- **THEN** the preset can be imported into `settings_data.json`
- **AND** it appears as an option in the preset selector
- **AND** merchants can apply it with one click

#### Scenario: Preset includes all design tokens
- **GIVEN** a theme preset file exists
- **WHEN** it is loaded
- **THEN** it includes values for all design token categories:
  - Colors (primary, secondary, accent, background, text, border, error, success, warning)
  - Typography (heading font, body font, sizes, weights, line heights)
  - Spacing (base unit, scale multipliers)
  - Borders (radius values, widths)
  - Shadows (elevation levels)
- **AND** missing values fall back to defaults

### Requirement: Component Token Usage
All theme components (sections, snippets, templates) SHALL use design tokens instead of hardcoded design values, ensuring visual style changes propagate automatically.

#### Scenario: Component uses color token
- **GIVEN** a component needs to display a primary color
- **WHEN** the developer writes the component
- **THEN** they use `bg-primary` (Tailwind) or `var(--color-primary)` (CSS) instead of hardcoded colors like `#000000`
- **AND** when the primary color token changes, the component updates automatically

#### Scenario: Component uses spacing token
- **GIVEN** a component needs consistent spacing
- **WHEN** the developer writes the component
- **THEN** they use spacing tokens (e.g., `p-base`, `gap-lg`) instead of hardcoded values like `px-4` or `py-8`
- **AND** when spacing tokens change, components maintain proportional spacing

#### Scenario: Component uses typography token
- **GIVEN** a component displays text
- **WHEN** the developer writes the component
- **THEN** they use typography tokens (e.g., `font-heading`, `text-body`) instead of hardcoded font families
- **AND** when typography tokens change, text styling updates automatically

### Requirement: Design Token Categories
The system SHALL support the following design token categories, each with comprehensive configuration options accessible in the Theme Editor.

#### Scenario: Colors category configuration
- **GIVEN** a merchant opens the Theme Editor
- **WHEN** they navigate to the "Colors" settings group
- **THEN** they see color pickers for:
  - Primary color (main brand color)
  - Secondary color (accent/alternative brand color)
  - Accent color (highlights, CTAs)
  - Background color (page background)
  - Text color (primary text)
  - Text secondary color (secondary text)
  - Border color (borders, dividers)
  - Error color (error messages, validation)
  - Success color (success messages, confirmations)
  - Warning color (warning messages, alerts)

#### Scenario: Typography category configuration
- **GIVEN** a merchant opens the Theme Editor
- **WHEN** they navigate to the "Typography" settings group
- **THEN** they see configuration for:
  - Heading font family (via Shopify font picker)
  - Body font family (via Shopify font picker)
  - Font sizes (scale: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
  - Font weights (light, normal, medium, semibold, bold)
  - Line heights (tight, normal, relaxed, loose)
  - Letter spacing (tighter, normal, wider)

#### Scenario: Spacing category configuration
- **GIVEN** a merchant opens the Theme Editor
- **WHEN** they navigate to the "Spacing" settings group
- **THEN** they see configuration for:
  - Base spacing unit (in pixels, e.g., 4px or 8px)
  - Spacing scale multipliers (0.5x, 1x, 1.5x, 2x, 3x, 4x, 6x, 8x, 12x, 16x)

#### Scenario: Borders category configuration
- **GIVEN** a merchant opens the Theme Editor
- **WHEN** they navigate to the "Borders" settings group
- **THEN** they see configuration for:
  - Border radius values (none, sm, md, lg, xl, 2xl, full)
  - Border widths (0, 1, 2, 4, 8 pixels)

#### Scenario: Shadows category configuration
- **GIVEN** a merchant opens the Theme Editor
- **WHEN** they navigate to the "Shadows" settings group
- **THEN** they see configuration for elevation levels:
  - Shadow none (no shadow)
  - Shadow sm (subtle elevation)
  - Shadow md (medium elevation)
  - Shadow lg (large elevation)
  - Shadow xl (extra large elevation)
  - Shadow 2xl (maximum elevation)

### Requirement: Backward Compatibility
The system SHALL maintain backward compatibility with existing components, ensuring that components without token updates continue to function correctly with default token values.

#### Scenario: Component uses old hardcoded values
- **GIVEN** a component still uses hardcoded design values (e.g., `bg-black`, `text-white`)
- **WHEN** the theme loads
- **THEN** the component renders correctly with the hardcoded values
- **AND** the design token system does not interfere with existing functionality
- **AND** merchants can migrate components to tokens gradually

#### Scenario: Missing token values
- **GIVEN** a component references a design token
- **WHEN** the token value is not set in Shopify settings
- **THEN** the component uses a sensible default value
- **AND** the theme continues to function without errors
- **AND** merchants see fallback styling instead of broken appearance

### Requirement: Performance
The system SHALL maintain optimal performance with no runtime overhead, using native CSS custom properties and server-side injection.

#### Scenario: CSS bundle size impact
- **GIVEN** the design token system is implemented
- **WHEN** the theme is built
- **THEN** the CSS bundle size increase is minimal (< 1KB gzipped)
- **AND** CSS custom properties add no runtime JavaScript overhead
- **AND** token injection happens server-side in Liquid

#### Scenario: Page load performance
- **GIVEN** a page loads with design tokens
- **WHEN** the browser renders the page
- **THEN** CSS custom properties are resolved instantly (native browser feature)
- **AND** no JavaScript execution is required for token resolution
- **AND** page load time is not affected

### Requirement: Theme Editor Integration
The system SHALL provide full integration with Shopify Theme Editor, allowing merchants to customize design tokens visually without code changes.

#### Scenario: Merchant previews token changes
- **GIVEN** a merchant is in the Theme Editor
- **WHEN** they change a design token value (e.g., primary color)
- **THEN** the preview updates immediately
- **AND** they can see the change across all components
- **AND** changes are saved automatically

#### Scenario: Merchant exports theme configuration
- **GIVEN** a merchant has customized their theme tokens
- **WHEN** they export `settings_data.json`
- **THEN** all design token values are included
- **AND** the configuration can be imported to another store
- **AND** the visual style is preserved

