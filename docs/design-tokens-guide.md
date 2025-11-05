# Design Tokens Guide for AI Assistants

## Purpose
This document provides structured guidance for AI assistants to understand and modify the design token system to create custom visual styles for DTC (Direct-to-Consumer) websites. The design token system separates design decisions from HTML structure, enabling visual style changes through configuration without modifying component code.

## System Architecture

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

### Key Files
- **`config/settings_schema.json`**: Defines all configurable design tokens accessible in Shopify Theme Editor
- **`src/css/tailwind.css`**: Contains fallback CSS variable definitions (build-time defaults)
- **`layout/theme.liquid`**: Dynamically injects CSS variables from Shopify settings (runtime values)
- **`tailwind.config.js`**: Maps Tailwind theme to CSS custom properties
- **`config/themes/*.json`**: Example preset files with complete token configurations

## Design Token Categories

### 1. Colors
**Purpose**: Control brand identity and visual hierarchy

**Available Tokens**:
- `color_primary`: Main brand color (used for buttons, links, CTAs)
- `color_secondary`: Alternative brand color (used for accents, highlights)
- `color_accent`: Highlight color (used for interactive elements, CTAs)
- `color_background`: Page background color
- `color_text`: Primary text color
- `color_text_secondary`: Secondary/muted text color
- `color_border`: Border and divider color
- `color_error`: Error states and validation messages
- `color_success`: Success states and confirmations
- `color_warning`: Warning states and alerts

**How to Modify**:
1. Open `config/settings_schema.json`
2. Find the "Colors" section
3. Update the `default` value for any color token
4. Or modify `config/settings_data.json` directly to change current values

**Example - Creating a Tech Brand**:
```json
{
  "color_primary": "#0066FF",
  "color_secondary": "#00CCFF",
  "color_accent": "#FF6600",
  "color_background": "#FFFFFF",
  "color_text": "#1A1A1A",
  "color_text_secondary": "#6B7280",
  "color_border": "#E5E7EB"
}
```

**Example - Creating a Luxury Brand**:
```json
{
  "color_primary": "#1A1A1A",
  "color_secondary": "#8B7355",
  "color_accent": "#D4AF37",
  "color_background": "#FAFAFA",
  "color_text": "#1A1A1A",
  "color_text_secondary": "#6B7280",
  "color_border": "#D1D5DB"
}
```

### 2. Typography
**Purpose**: Control text appearance and readability

**Available Tokens**:
- **Font Families**:
  - `font_heading`: Font for headings (h1, h2, h3, etc.)
  - `font_body`: Font for body text
  
- **Font Sizes**:
  - `text_size_xs`: Extra small text (10-14px)
  - `text_size_sm`: Small text (12-16px)
  - `text_size_base`: Base text size (14-18px)
  - `text_size_lg`: Large text (16-20px)
  - `text_size_xl`: Extra large text (18-24px)

- **Font Weights**:
  - `font_weight_normal`: Normal weight (300, 400, or 500)
  - `font_weight_bold`: Bold weight (600, 700, or 800)

- **Line Heights**:
  - `line_height_tight`: Tight spacing (1.2, 1.25, or 1.3)
  - `line_height_normal`: Normal spacing (1.5, 1.6, or 1.75)
  - `line_height_relaxed`: Relaxed spacing (1.75, 2, or 2.25)

**How to Modify**:
1. Update font families using Shopify font picker (e.g., `assistant_n4`, `work_sans_n4`)
2. Adjust font sizes to match brand guidelines
3. Set weights and line heights for readability

**Example - Modern Sans-Serif**:
```json
{
  "font_heading": "work_sans_n4",
  "font_body": "work_sans_n4",
  "text_size_base": 16,
  "font_weight_normal": "400",
  "font_weight_bold": "700",
  "line_height_normal": "1.6"
}
```

**Example - Elegant Serif**:
```json
{
  "font_heading": "playfair_display_n4",
  "font_body": "lora_n4",
  "text_size_base": 17,
  "font_weight_normal": "400",
  "font_weight_bold": "700",
  "line_height_normal": "1.7"
}
```

### 3. Spacing
**Purpose**: Control layout spacing and rhythm

**Available Tokens**:
- `spacing_base`: Base unit for spacing scale (typically 4px or 8px)
- Spacing scale is calculated: `calc(var(--spacing-base) * multiplier)`
- Available multipliers: 0.5x, 1x, 1.5x, 2x, 3x, 4x, 6x, 8x, 12x, 16x

**How to Modify**:
- Set `spacing_base` to 4 for tighter spacing (modern, tech brands)
- Set `spacing_base` to 8 for more generous spacing (luxury, premium brands)

**Example - Tight Spacing (Tech)**:
```json
{
  "spacing_base": 4
}
```

**Example - Generous Spacing (Luxury)**:
```json
{
  "spacing_base": 8
}
```

### 4. Borders
**Purpose**: Control border radius and width for rounded corners

**Available Tokens**:
- `border_radius_sm`: Small radius (2-6px)
- `border_radius_md`: Medium radius (4-10px)
- `border_radius_lg`: Large radius (8-16px)
- `border_radius_xl`: Extra large radius (12-24px)
- `border_radius_full`: Full circle (9999px)
- `border_width`: Default border width (1-4px)

**How to Modify**:
- Small values (2-4px): Minimal, modern aesthetic
- Medium values (6-8px): Balanced, friendly
- Large values (12-16px): Rounded, playful
- Full (9999px): Pill-shaped buttons

**Example - Sharp, Modern**:
```json
{
  "border_radius_sm": 2,
  "border_radius_md": 4,
  "border_radius_lg": 6,
  "border_width": 1
}
```

**Example - Rounded, Friendly**:
```json
{
  "border_radius_sm": 6,
  "border_radius_md": 12,
  "border_radius_lg": 16,
  "border_width": 1
}
```

### 5. Shadows
**Purpose**: Control elevation and depth perception

**Available Tokens**:
- `shadow_none`: No shadow
- `shadow_sm`: Subtle elevation
- `shadow_md`: Medium elevation
- `shadow_lg`: Large elevation
- `shadow_xl`: Extra large elevation
- `shadow_2xl`: Maximum elevation

**How to Modify**:
- Update shadow values as CSS shadow strings
- Use subtle shadows for minimal brands
- Use stronger shadows for depth and luxury feel

**Example - Minimal Shadows**:
```json
{
  "shadow_sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  "shadow_md": "0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  "shadow_lg": "0 4px 8px 0 rgba(0, 0, 0, 0.1)"
}
```

**Example - Prominent Shadows (Luxury)**:
```json
{
  "shadow_sm": "0 1px 2px 0 rgba(0, 0, 0, 0.08)",
  "shadow_md": "0 4px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.08)",
  "shadow_lg": "0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.08)"
}
```

## Step-by-Step: Creating a Custom Visual Style

### Step 1: Understand Brand Identity
**AI should ask or analyze**:
- What is the brand's personality? (minimal, modern, luxury, playful, tech, etc.)
- What are the brand colors? (primary, secondary, accent)
- What is the target audience? (affects typography and spacing choices)
- What is the brand voice? (formal, casual, bold, subtle)

### Step 2: Map Brand to Tokens
**Create a token mapping document**:

For a **Tech Startup**:
- Colors: Bold, vibrant (blue, purple, orange)
- Typography: Modern sans-serif, clean
- Spacing: Tight (4px base)
- Borders: Rounded but not too much (6-8px)
- Shadows: Subtle, modern

For a **Luxury Brand**:
- Colors: Rich, sophisticated (dark, gold, cream)
- Typography: Elegant serif or refined sans-serif
- Spacing: Generous (8px base)
- Borders: Minimal radius (2-4px)
- Shadows: Strong, defined

For a **Minimal Brand**:
- Colors: Monochrome or limited palette
- Typography: Clean, simple sans-serif
- Spacing: Balanced (4-6px base)
- Borders: Sharp corners or very subtle radius
- Shadows: Minimal or none

### Step 3: Modify Configuration Files

#### Option A: Update settings_schema.json (Affects Defaults)
```json
{
  "name": "Colors",
  "settings": [
    {
      "type": "color",
      "id": "color_primary",
      "label": "Primary Color",
      "default": "#YOUR_COLOR_HERE"
    }
  ]
}
```

#### Option B: Update settings_data.json (Current Values)
```json
{
  "current": {
    "color_primary": "#YOUR_COLOR_HERE",
    "color_secondary": "#YOUR_COLOR_HERE",
    // ... all other tokens
  }
}
```

#### Option C: Create a New Preset File
1. Copy `config/themes/minimal.json`
2. Rename to `config/themes/your-brand.json`
3. Update all token values
4. Import into `settings_data.json` when ready

### Step 4: Verify Token Usage in Components

**Check that components use tokens correctly**:
- Components should use Tailwind classes like `bg-primary`, `text-text`, `text-text-secondary`
- Not hardcoded values like `bg-black`, `text-gray-600`

**Common patterns**:
- Backgrounds: `bg-background`, `bg-primary`, `bg-border`
- Text: `text-text`, `text-text-secondary`, `text-primary`
- Borders: `border-border`, `rounded-md` (uses token)
- Shadows: `shadow-md` (uses token)

### Step 5: Test and Refine

1. **Build the theme**: `npm run build`
2. **Validate**: `npm run lint`
3. **Preview in Shopify Theme Editor**
4. **Test on different devices** (mobile, tablet, desktop)
5. **Adjust tokens** based on visual feedback

## Token Naming Conventions

### CSS Variables
- Format: `--{category}-{name}`
- Examples: `--color-primary`, `--font-heading`, `--spacing-base`
- Always lowercase with hyphens

### Tailwind Classes
- Colors: `bg-primary`, `text-text`, `text-text-secondary`
- Typography: `font-heading`, `font-body`, `text-base`
- Spacing: Uses Tailwind spacing scale (p-4, m-2, etc.)
- Borders: `rounded-md`, `border-width`
- Shadows: `shadow-md`, `shadow-lg`

### Settings IDs
- Format: `{category}_{name}`
- Examples: `color_primary`, `font_heading`, `spacing_base`
- Always lowercase with underscores

## Best Practices for AI Assistants

### 1. Always Provide Fallback Values
When modifying tokens, ensure fallback values exist in:
- `src/css/tailwind.css` (build-time defaults)
- `layout/theme.liquid` (runtime defaults using `| default:` filter)

### 2. Maintain Token Consistency
- Use the same color tokens across related elements
- Keep spacing proportional (use spacing scale)
- Ensure typography hierarchy is clear

### 3. Consider Accessibility
- Ensure sufficient color contrast (text on background)
- Test error/success/warning colors are distinguishable
- Maintain readable font sizes

### 4. Preserve Visual Hierarchy
- Primary color for CTAs and important elements
- Secondary color for accents
- Text colors for proper contrast
- Spacing for visual rhythm

### 5. Document Custom Presets
When creating a custom preset:
- Name it descriptively (e.g., `tech-startup.json`, `luxury-fashion.json`)
- Include a comment or README explaining the brand it represents
- Document any non-standard token values

## Common Brand Patterns

### Pattern 1: Minimalist Tech
```json
{
  "color_primary": "#000000",
  "color_secondary": "#666666",
  "color_accent": "#0066FF",
  "spacing_base": 4,
  "border_radius_md": 4,
  "shadow_sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
}
```

### Pattern 2: Vibrant Modern
```json
{
  "color_primary": "#3B82F6",
  "color_secondary": "#8B5CF6",
  "color_accent": "#F59E0B",
  "spacing_base": 4,
  "border_radius_md": 8,
  "shadow_md": "0 4px 6px -1px rgba(59, 130, 246, 0.1)"
}
```

### Pattern 3: Luxury Premium
```json
{
  "color_primary": "#1A1A1A",
  "color_secondary": "#8B7355",
  "color_accent": "#D4AF37",
  "spacing_base": 8,
  "border_radius_md": 4,
  "shadow_lg": "0 10px 15px -3px rgba(0, 0, 0, 0.12)"
}
```

### Pattern 4: Playful Creative
```json
{
  "color_primary": "#FF6B6B",
  "color_secondary": "#4ECDC4",
  "color_accent": "#FFE66D",
  "spacing_base": 4,
  "border_radius_md": 12,
  "shadow_md": "0 4px 6px -1px rgba(255, 107, 107, 0.2)"
}
```

## Troubleshooting Guide

### Issue: Colors not updating
**Solution**: 
1. Check `layout/theme.liquid` has proper Liquid syntax
2. Verify settings are saved in `settings_data.json`
3. Clear browser cache and rebuild

### Issue: Typography not applying
**Solution**:
1. Verify font family IDs are valid Shopify font names
2. Check font fallbacks are properly formatted
3. Ensure font picker settings are saved

### Issue: Spacing looks wrong
**Solution**:
1. Verify `spacing_base` is set correctly
2. Check components use Tailwind spacing classes
3. Ensure spacing calculations are correct

### Issue: Shadows not showing
**Solution**:
1. Verify shadow values are valid CSS shadow strings
2. Check elements have proper background colors
3. Ensure shadows aren't being overridden by other styles

## Quick Reference: Token → Component Mapping

| Component | Tokens Used | Tailwind Classes |
|-----------|-------------|------------------|
| Buttons | `color_primary`, `color_background`, `radius_md` | `bg-primary`, `text-background`, `rounded-md` |
| Headers | `color_background`, `color_text`, `color_border` | `bg-background`, `text-text`, `border-border` |
| Text | `color_text`, `color_text_secondary`, `font_body` | `text-text`, `text-text-secondary`, `font-body` |
| Cards | `color_background`, `color_border`, `shadow_md`, `radius_lg` | `bg-background`, `border-border`, `shadow-md`, `rounded-lg` |
| Links | `color_primary`, `color_accent` | `text-primary`, `hover:text-accent` |

## Summary for AI Assistants

When asked to create or modify a visual style for a DTC website:

1. **Identify brand characteristics** from the request
2. **Map to token categories** (colors, typography, spacing, borders, shadows)
3. **Choose appropriate values** based on brand patterns
4. **Modify configuration files** (`settings_schema.json` or `settings_data.json`)
5. **Create preset file** if this is a reusable style
6. **Verify components** use tokens correctly
7. **Test and validate** the changes

Remember: The design token system enables style changes without modifying component code. All visual customization happens through configuration files.

