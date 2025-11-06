# Change: Implement Modern DTC Header Component

## Why

The current header implementation is basic and doesn't meet modern DTC (Direct-to-Consumer) website standards. A professional header is critical for:
- First impressions and brand credibility
- User navigation and findability
- Mobile commerce (majority of traffic)
- Conversion optimization through clear CTA placement

The existing header lacks:
- Modern responsive layout patterns
- Integrated search functionality
- Customer account access
- Professional visual design aligned with current DTC trends

## What Changes

### Visual Design
- Clean, minimal aesthetic following DTC best practices (brands like Allbirds, Warby Parker, Glossier)
- Generous whitespace and breathing room
- Subtle borders and shadows for depth
- Smooth transitions and micro-interactions
- Sticky header behavior on scroll

### Desktop Layout (≥768px)
- **Left zone**: Logo image (theme settings) or store name (fallback)
- **Center zone**: Horizontal navigation menu (from `linklists.main-menu`)
- **Right zone**: Search icon/modal, cart with item count, account/login icon

### Mobile Layout (<768px)
- **Left zone**: Hamburger menu button (opens slide-out navigation)
- **Center zone**: Logo (centered for visual balance)
- **Right zone**: Search icon, cart icon with count

### Functional Features
- Sticky header that shows/hides on scroll
- Mobile slide-out navigation panel
- Search modal with focus management
- Cart count badge with real-time updates
- Smooth animations and transitions
- Keyboard navigation support
- ARIA labels for accessibility

### Configuration Options (Schema)
- Enable/disable sticky header
- Header background color (with opacity support)
- Logo max-width adjustment
- Menu link styling (font, color, hover effects)
- Search modal toggle
- Account icon visibility (when customer accounts enabled)

## Impact

### Affected Specs
- **NEW**: `header-component` - Complete header specification

### Affected Code
- **Modified**: `/sections/header.liquid` - Complete rewrite with modern structure
- **Modified**: `/src/js/modules/navigation.js` - Enhanced with search modal, cart updates, accessibility
- **Modified**: `/src/css/tailwind.css` - New component classes for header elements
- **NEW**: `/snippets/icon.liquid` - Reusable SVG icon component (if not exists)
- **Modified**: `/config/settings_schema.json` - Add header configuration section
- **Modified**: `/locales/en.default.json` - Add header-related translation keys

### Breaking Changes
None - this is an enhancement of existing functionality

### Dependencies
- Requires navigation linklist (`main-menu`) to be configured in Shopify admin
- Requires cart JavaScript for item count updates
- Requires customer accounts feature for account icon display

