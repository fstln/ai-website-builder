# Theme Presets

This directory contains pre-configured theme presets that you can use to quickly switch your store's visual style.

## Available Presets

### Minimal
A clean, minimalist design with black and white colors, perfect for brands that want a simple, professional look.

**Characteristics:**
- Black primary color (#000000)
- Clean, minimal spacing
- Subtle shadows
- Professional typography

### Modern
A contemporary, vibrant design with bright colors and modern styling, ideal for tech brands and creative businesses.

**Characteristics:**
- Blue primary color (#3B82F6)
- Purple secondary color (#8B5CF6)
- Orange accent color (#F59E0B)
- Rounded corners
- Vibrant shadows

### Luxury
A premium, sophisticated design with rich colors and elegant styling, perfect for high-end brands and luxury products.

**Characteristics:**
- Dark charcoal primary (#1A1A1A)
- Gold accent (#D4AF37)
- Elegant spacing
- Refined shadows

## How to Use Theme Presets

### Method 1: Import via Shopify Theme Editor

1. Open your Shopify admin
2. Go to **Online Store > Themes**
3. Click **Customize** on your theme
4. In the Theme Editor, navigate to **Theme Settings**
5. Copy the values from a preset JSON file
6. Paste into the corresponding settings fields
7. Click **Save**

### Method 2: Replace settings_data.json

1. Backup your current `config/settings_data.json`
2. Copy the contents of a preset file (e.g., `minimal.json`)
3. Replace the `"current"` object in `config/settings_data.json` with the preset values
4. Deploy your theme to Shopify

### Method 3: Manual Merge (Advanced)

For developers who want to merge specific values:

1. Open the preset JSON file
2. Copy only the values you want to change
3. Manually update `config/settings_data.json` with those values
4. Deploy your theme

## Creating Custom Presets

To create a custom preset:

1. Customize your theme settings in Shopify Theme Editor
2. Export your `config/settings_data.json` file
3. Copy the values from the `"current"` object
4. Create a new JSON file in this directory (e.g., `my-brand.json`)
5. Paste the values into the preset file
6. Share with your team or use for other stores

### Preset File Format

```json
{
  "current": {
    "color_primary": "#000000",
    "color_secondary": "#666666",
    "color_accent": "#3B82F6",
    // ... all other design token values
  }
}
```

## Design Token Reference

All presets include values for:

- **Colors**: Primary, secondary, accent, background, text, border, error, success, warning
- **Typography**: Heading font, body font, sizes, weights, line heights
- **Spacing**: Base unit and scale
- **Borders**: Radius values and widths
- **Shadows**: Elevation levels

For a complete list of available tokens, see `config/settings_schema.json`.

## Best Practices

1. **Test Presets**: Always preview a preset before applying it to a live store
2. **Customize**: Presets are starting points - customize colors, fonts, and spacing to match your brand
3. **Version Control**: Keep preset files in version control for easy rollback
4. **Documentation**: Document any customizations you make to presets

## Troubleshooting

**Preset doesn't apply correctly:**
- Ensure all required token values are present in the preset file
- Check that JSON syntax is valid
- Verify that settings IDs match those in `settings_schema.json`

**Colors look different:**
- Some colors may need adjustment based on your brand guidelines
- Test color contrast for accessibility
- Preview on different devices and screens

